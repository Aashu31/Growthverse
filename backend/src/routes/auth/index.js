/**
 * Authentication API: /api/auth/*
 *
 * SECURITY NOTES
 * - Passwords are hashed with Argon2id.
 * - Access tokens are short-lived JWTs delivered as HttpOnly cookies.
 * - Refresh tokens are opaque random values, stored only as SHA-256 hashes.
 * - Refresh token rotation creates a new session and revokes the old one.
 * - Presenting an already-revoked refresh token revokes all sessions (replay).
 * - Forgot-password always returns a generic response.
 */

import crypto from "node:crypto";
import { z } from "zod";
import config from "../../config/env.js";
import prisma from "../../lib/prisma.js";
import { hashPassword, validatePassword, verifyPassword, performDummyVerification, PASSWORD_MAX_LENGTH } from "../../lib/password.js";
import { generateToken, hashToken, timingSafeEqual } from "../../lib/tokens.js";
import { badRequest, conflict, normalizeEmail, safeString, unauthorized, forbidden } from "../../lib/http.js";
import {
  publicUser,
  issueAccessToken,
  createRefreshSession,
  findActiveSessionByToken,
  revokeSession,
  revokeAllUserSessions,
  handleRefreshReplay,
  setAuthCookies,
  clearAuthCookies,
  ensureCsrfCookie,
} from "../../services/auth.service.js";
import {
  buildPasswordResetUrl,
  buildVerificationUrl,
  isEmailDeliveryConfigured,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../../services/email.js";

const emailSchema = z.string().trim().email().max(254);

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    email: emailSchema,
    password: z.string().min(1).max(PASSWORD_MAX_LENGTH),
    role: z.string().optional(),
  })
  .strict();

const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1).max(PASSWORD_MAX_LENGTH),
  })
  .strict();

const forgotPasswordSchema = z.object({ email: emailSchema }).strict();
const resetPasswordSchema = z
  .object({ token: z.string().min(20).max(500), newPassword: z.string().min(1).max(PASSWORD_MAX_LENGTH) })
  .strict();
const verifyEmailSchema = z.object({ token: z.string().min(20).max(500) }).strict();
const resendVerificationSchema = z.object({ email: emailSchema }).strict();
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).max(PASSWORD_MAX_LENGTH),
    newPassword: z.string().min(1).max(PASSWORD_MAX_LENGTH),
  })
  .strict();
const updateMeSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    phone: z.string().trim().max(30).optional(),
    avatar: z.string().trim().url().max(500).optional().or(z.literal("")),
  })
  .strict();

function exposeDevLinks() {
  return !config.isProduction && !isEmailDeliveryConfigured();
}

function validateNewPassword(password) {
  const errors = validatePassword(password);
  if (errors.length > 0) throw badRequest("Password does not meet the security policy", errors);
}

async function createEmailVerificationToken(userId) {
  await prisma.emailVerificationToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });
  const token = generateToken(32);
  const expiresAt = new Date(Date.now() + config.emailVerificationExpiryMs);
  await prisma.emailVerificationToken.create({
    data: { userId, tokenHash: hashToken(token), expiresAt },
  });
  return { token, expiresAt };
}

async function createPasswordResetToken(userId) {
  await prisma.passwordResetToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });
  const token = generateToken(32);
  const expiresAt = new Date(Date.now() + config.passwordResetExpiryMs);
  await prisma.passwordResetToken.create({
    data: { userId, tokenHash: hashToken(token), expiresAt },
  });
  return { token, expiresAt };
}

export default async function authRoutes(fastify) {
  const authLimit = fastify.authLimits.auth;
  const loginLimit = fastify.authLimits.login;

  // POST /api/auth/register
  fastify.post("/register", { config: { rateLimit: authLimit } }, async (request, reply) => {
    const body = registerSchema.parse(request.body || {});
    const email = normalizeEmail(body.email);

    // Public registration may only create CUSTOMER accounts.
    if (body.role && body.role !== "CUSTOMER") {
      throw badRequest("Public registration cannot select an administrative role.");
    }

    validateNewPassword(body.password);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw conflict("An account with this email already exists.", "EMAIL_IN_USE");
    }

    const passwordHash = await hashPassword(body.password);
    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          name: body.name,
          email,
          passwordHash,
          role: "CUSTOMER",
          status: "ACTIVE",
          emailVerified: false,
        },
      });

      const existingCustomer = await tx.customer.findFirst({ where: { email } });
      if (!existingCustomer) {
        await tx.customer.create({
          data: {
            userId: created.id,
            name: created.name || "Customer",
            email,
          },
        });
      }
      // If a staff-created customer record already exists for this email, do not
      // attach it yet. Linking happens only after the email address is verified,
      // which prevents account takeover of an existing customer record.

      return created;
    });

    const { token } = await createEmailVerificationToken(user.id);
    const verifyUrl = buildVerificationUrl(token);
    await sendVerificationEmail({ to: user.email, name: user.name, verifyUrl });

    const response = {
      success: true,
      message: "Account created. Check your email to verify your address, then sign in.",
      data: {
        user: publicUser(user),
        emailVerificationRequired: true,
      },
    };
    if (exposeDevLinks()) response.devVerificationUrl = verifyUrl;

    return reply.code(201).send(response);
  });

  // POST /api/auth/login
  fastify.post(
    "/login",
    { config: { rateLimit: loginLimit } },
    async (request, reply) => {
      const body = loginSchema.parse(request.body || {});
      const email = normalizeEmail(body.email);

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        await performDummyVerification(body.password);
        throw unauthorized("Invalid email or password");
      }

      const valid = await verifyPassword(user.passwordHash, body.password);
      if (!valid) throw unauthorized("Invalid email or password");

      if (user.status !== "ACTIVE") {
        throw forbidden("This account is not active. Please contact support.");
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      const { sessionId, token: refreshToken } = await createRefreshSession({ userId: user.id, request });
      const accessToken = issueAccessToken(fastify, updatedUser, sessionId);

      setAuthCookies(reply, { accessToken, refreshToken });
      ensureCsrfCookie(request, reply);

      return reply.send({
        success: true,
        message: "Signed in successfully",
        data: { user: publicUser(updatedUser) },
      });
    }
  );

  // GET /api/auth/me
  fastify.get("/me", { preHandler: [fastify.authenticate] }, async (request, reply) => {
    ensureCsrfCookie(request, reply);
    return reply.send({
      success: true,
      data: { user: publicUser(request.authUser) },
    });
  });

  // PATCH /api/auth/me (self-service profile fields only)
  fastify.patch("/me", { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const body = updateMeSchema.parse(request.body || {});
    const data = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.phone !== undefined) data.phone = body.phone;
    if (body.avatar !== undefined) data.avatar = body.avatar || null;

    if (Object.keys(data).length === 0) throw badRequest("No supported profile fields were provided.");

    const user = await prisma.user.update({ where: { id: request.authUser.id }, data });

    await prisma.customer.updateMany({
      where: { userId: user.id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.phone !== undefined ? { phone: body.phone } : {}),
      },
    });

    return reply.send({ success: true, message: "Profile updated", data: { user: publicUser(user) } });
  });

  // POST /api/auth/refresh (rotating refresh tokens)
  fastify.post(
    "/refresh",
    { config: { rateLimit: authLimit } },
    async (request, reply) => {
      const rawToken = request.cookies?.[config.refreshCookieName] || request.body?.refreshToken;
      if (!rawToken) {
        clearAuthCookies(reply);
        return reply.code(401).send({ success: false, message: "No refresh session", code: "NO_REFRESH_SESSION" });
      }

      const session = await findActiveSessionByToken(rawToken);
      if (!session) {
        clearAuthCookies(reply);
        return reply.code(401).send({ success: false, message: "Invalid refresh session", code: "INVALID_REFRESH_SESSION" });
      }

      if (session.revokedAt) {
        // Reuse of a rotated/revoked token: revoke every session for this user.
        await handleRefreshReplay(session);
        clearAuthCookies(reply);
        return reply.code(401).send({
          success: false,
          message: "Refresh token reuse detected. All sessions have been revoked.",
          code: "REFRESH_TOKEN_REUSE",
        });
      }

      if (session.expiresAt.getTime() <= Date.now()) {
        await revokeSession(session.id);
        clearAuthCookies(reply);
        return reply.code(401).send({ success: false, message: "Refresh session expired", code: "REFRESH_SESSION_EXPIRED" });
      }

      if (session.user.status !== "ACTIVE") {
        await revokeAllUserSessions(session.userId);
        clearAuthCookies(reply);
        return reply.code(403).send({ success: false, message: "Account is not active", code: "ACCOUNT_INACTIVE" });
      }

      const newSession = await createRefreshSession({ userId: session.userId, request });
      const newTokenHash = hashToken(newSession.token);

      // Atomically claim the old session. If another concurrent request already
      // rotated it, treat this as replay and revoke the whole token family.
      const claimed = await prisma.refreshSession.updateMany({
        where: { id: session.id, revokedAt: null },
        data: { revokedAt: new Date(), replacedByTokenHash: newTokenHash },
      });

      if (claimed.count !== 1) {
        await revokeSession(newSession.sessionId);
        await handleRefreshReplay(session);
        clearAuthCookies(reply);
        return reply.code(401).send({
          success: false,
          message: "Refresh token reuse detected. All sessions have been revoked.",
          code: "REFRESH_TOKEN_REUSE",
        });
      }

      const accessToken = issueAccessToken(fastify, session.user, newSession.sessionId);
      setAuthCookies(reply, { accessToken, refreshToken: newSession.token });
      ensureCsrfCookie(request, reply);

      return reply.send({
        success: true,
        message: "Session refreshed",
        data: { user: publicUser(session.user) },
      });
    }
  );

  // POST /api/auth/logout (works even if the access token has expired)
  fastify.post("/logout", async (request, reply) => {
    const rawToken = request.cookies?.[config.refreshCookieName];
    if (rawToken) {
      const session = await findActiveSessionByToken(rawToken);
      if (session && !session.revokedAt) await revokeSession(session.id);
    }
    clearAuthCookies(reply);
    return reply.send({ success: true, message: "Signed out successfully" });
  });

  // POST /api/auth/logout-all
  fastify.post("/logout-all", { preHandler: [fastify.authenticate] }, async (request, reply) => {
    await revokeAllUserSessions(request.authUser.id);
    clearAuthCookies(reply);
    return reply.send({ success: true, message: "Signed out from all devices" });
  });

  // POST /api/auth/change-password
  fastify.post(
    "/change-password",
    { preHandler: [fastify.authenticate], config: { rateLimit: authLimit } },
    async (request, reply) => {
      const body = changePasswordSchema.parse(request.body || {});

      const user = await prisma.user.findUnique({ where: { id: request.authUser.id } });
      if (!user) throw unauthorized();

      const valid = await verifyPassword(user.passwordHash, body.currentPassword);
      if (!valid) throw badRequest("Current password is incorrect.");

      if (body.currentPassword === body.newPassword) {
        throw badRequest("New password must be different from the current password.");
      }
      validateNewPassword(body.newPassword);

      const passwordHash = await hashPassword(body.newPassword);
      await prisma.$transaction(async (tx) => {
        await tx.user.update({ where: { id: user.id }, data: { passwordHash } });
      });

      // Revoke every other session, keep the current one.
      await revokeAllUserSessions(user.id, request.authSessionId);

      return reply.send({
        success: true,
        message: "Password changed. Other devices have been signed out.",
      });
    }
  );

  // POST /api/auth/forgot-password (always generic)
  fastify.post(
    "/forgot-password",
    { config: { rateLimit: authLimit } },
    async (request, reply) => {
      const body = forgotPasswordSchema.parse(request.body || {});
      const email = normalizeEmail(body.email);
      const generic = {
        success: true,
        message: "If an account exists for that email, password reset instructions have been sent.",
      };

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || user.status !== "ACTIVE") {
        return reply.send(generic);
      }

      const { token } = await createPasswordResetToken(user.id);
      const resetUrl = buildPasswordResetUrl(token);
      await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl });

      if (exposeDevLinks()) generic.devResetUrl = resetUrl;
      return reply.send(generic);
    }
  );

  // POST /api/auth/reset-password
  fastify.post(
    "/reset-password",
    { config: { rateLimit: authLimit } },
    async (request, reply) => {
      const body = resetPasswordSchema.parse(request.body || {});
      validateNewPassword(body.newPassword);

      const tokenHash = hashToken(body.token);
      const record = await prisma.passwordResetToken.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (!record || record.usedAt || record.expiresAt.getTime() <= Date.now() || record.user.status !== "ACTIVE") {
        throw badRequest("This password reset link is invalid or has expired.", [
          "Request a new password reset link.",
        ]);
      }

      const passwordHash = await hashPassword(body.newPassword);

      await prisma.$transaction(async (tx) => {
        const claimed = await tx.passwordResetToken.updateMany({
          where: { id: record.id, usedAt: null },
          data: { usedAt: new Date() },
        });
        if (claimed.count !== 1) {
          throw badRequest("This password reset link has already been used.");
        }

        await tx.user.update({ where: { id: record.userId }, data: { passwordHash } });
        await tx.refreshSession.updateMany({
          where: { userId: record.userId, revokedAt: null },
          data: { revokedAt: new Date() },
        });
        await tx.passwordResetToken.updateMany({
          where: { userId: record.userId, usedAt: null },
          data: { usedAt: new Date() },
        });
      });

      clearAuthCookies(reply);
      return reply.send({
        success: true,
        message: "Password reset successfully. Please sign in with your new password.",
      });
    }
  );

  // POST /api/auth/verify-email
  fastify.post(
    "/verify-email",
    { config: { rateLimit: authLimit } },
    async (request, reply) => {
      const body = verifyEmailSchema.parse(request.body || {});
      const tokenHash = hashToken(body.token);

      const record = await prisma.emailVerificationToken.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (!record || record.usedAt || record.expiresAt.getTime() <= Date.now()) {
        throw badRequest("This verification link is invalid or has expired.", [
          "Request a new verification email.",
        ]);
      }

      await prisma.$transaction(async (tx) => {
        const claimed = await tx.emailVerificationToken.updateMany({
          where: { id: record.id, usedAt: null },
          data: { usedAt: new Date() },
        });
        if (claimed.count !== 1) throw badRequest("This verification link has already been used.");

        await tx.user.update({
          where: { id: record.userId },
          data: { emailVerified: true, emailVerifiedAt: new Date() },
        });

        // Only a verified email may claim a pre-existing, unlinked customer
        // record. This closes the account-takeover path through public signup.
        const existingCustomer = await tx.customer.findFirst({
          where: { email: record.user.email },
          orderBy: { createdAt: "asc" },
        });
        if (!existingCustomer) {
          await tx.customer.create({
            data: {
              userId: record.userId,
              name: record.user.name || "Customer",
              email: record.user.email,
            },
          });
        } else if (!existingCustomer.userId) {
          await tx.customer.update({
            where: { id: existingCustomer.id },
            data: {
              userId: record.userId,
              ...(existingCustomer.name ? {} : { name: record.user.name || "Customer" }),
            },
          });
        }
      });

      return reply.send({ success: true, message: "Email verified successfully." });
    }
  );

  // POST /api/auth/resend-verification (generic, rate-limited)
  fastify.post(
    "/resend-verification",
    { config: { rateLimit: authLimit } },
    async (request, reply) => {
      const body = resendVerificationSchema.parse(request.body || {});
      const email = normalizeEmail(body.email);
      const generic = {
        success: true,
        message: "If that account requires verification, a new verification email has been sent.",
      };

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || user.emailVerified || user.status !== "ACTIVE") return reply.send(generic);

      const { token } = await createEmailVerificationToken(user.id);
      const verifyUrl = buildVerificationUrl(token);
      await sendVerificationEmail({ to: user.email, name: user.name, verifyUrl });

      if (exposeDevLinks()) generic.devVerificationUrl = verifyUrl;
      return reply.send(generic);
    }
  );

  // GET /api/auth/csrf (used by the SPA after cookie bootstrap)
  fastify.get("/csrf", async (request, reply) => {
    const csrfToken = ensureCsrfCookie(request, reply);
    return reply.send({ success: true, data: { csrfToken } });
  });

  // GET /api/auth/sessions
  fastify.get("/sessions", { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const sessions = await prisma.refreshSession.findMany({
      where: { userId: request.authUser.id, revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
      select: { id: true, userAgent: true, ipAddress: true, createdAt: true, expiresAt: true },
    });
    return reply.send({
      success: true,
      data: {
        sessions: sessions.map((session) => ({
          ...session,
          current: session.id === request.authSessionId,
        })),
      },
    });
  });

  // DELETE /api/auth/sessions/:id
  fastify.delete("/sessions/:id", { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const sessionId = safeString(request.params.id, 100);
    const session = await prisma.refreshSession.findFirst({
      where: { id: sessionId, userId: request.authUser.id },
    });
    if (!session) throw badRequest("Session not found.");
    await revokeSession(session.id);
    if (session.id === request.authSessionId) clearAuthCookies(reply);
    return reply.send({ success: true, message: "Session revoked." });
  });
}
