/**
 * Authentication service helpers: safe user projection, refresh sessions,
 * access token issuance and cookie handling.
 */

import crypto from "node:crypto";
import config from "../config/env.js";
import prisma from "../lib/prisma.js";
import {
  createSessionToken,
  generateCsrfToken,
  hashToken,
  parseSessionToken,
  timingSafeEqual,
} from "../lib/tokens.js";

export function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    role: user.role,
    status: user.status,
    emailVerified: user.emailVerified,
    emailVerifiedAt: user.emailVerifiedAt,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function durationToMs(value) {
  if (typeof value !== "string") return 0;
  const match = value.trim().match(/^(\d+)\s*(s|m|h|d|w|y)?$/i);
  if (!match) return 0;
  const amount = parseInt(match[1], 10);
  const unit = (match[2] || "s").toLowerCase();
  const factors = { s: 1000, m: 60000, h: 3600000, d: 86400000, w: 604800000, y: 31536000000 };
  return amount * factors[unit];
}

export function cookieOptions(overrides = {}) {
  return {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.cookieSameSite,
    domain: config.cookieDomain,
    path: "/",
    ...overrides,
  };
}

export function setAuthCookies(reply, { accessToken, refreshToken }) {
  reply.setCookie(
    config.accessCookieName,
    accessToken,
    cookieOptions({
      path: "/api",
      maxAge: Math.floor(durationToMs(config.accessTokenExpiry) / 1000),
    })
  );

  reply.setCookie(
    config.refreshCookieName,
    refreshToken,
    cookieOptions({
      path: "/api/auth",
      maxAge: Math.floor(config.refreshTokenExpiryMs / 1000),
    })
  );
}

export function clearAuthCookies(reply) {
  reply.clearCookie(config.accessCookieName, cookieOptions({ path: "/api" }));
  reply.clearCookie(config.refreshCookieName, cookieOptions({ path: "/api/auth" }));
  reply.clearCookie(config.csrfCookieName, cookieOptions({ httpOnly: false, path: "/" }));
}

export function ensureCsrfCookie(request, reply) {
  let token = request.cookies?.[config.csrfCookieName];
  if (!token) {
    token = generateCsrfToken();
  }
  reply.setCookie(
    config.csrfCookieName,
    token,
    cookieOptions({
      httpOnly: false,
      path: "/",
      maxAge: Math.floor(config.refreshTokenExpiryMs / 1000),
    })
  );
  return token;
}

export function issueAccessToken(fastify, user, sessionId) {
  return fastify.jwt.sign(
    { sub: user.id, role: user.role, sid: sessionId },
    { expiresIn: config.accessTokenExpiry }
  );
}

export async function createRefreshSession({ userId, request }) {
  const sessionId = crypto.randomUUID();
  const { token, tokenHash } = createSessionToken(sessionId);
  const expiresAt = new Date(Date.now() + config.refreshTokenExpiryMs);

  await prisma.refreshSession.create({
    data: {
      id: sessionId,
      userId,
      tokenHash,
      expiresAt,
      userAgent: String(request.headers["user-agent"] || "").slice(0, 255) || null,
      ipAddress: request.ip || null,
    },
  });

  return { sessionId, token, expiresAt };
}

export async function findActiveSessionByToken(rawToken, { forUpdate = false } = {}) {
  const parsed = parseSessionToken(rawToken);
  if (!parsed) return null;

  const session = await prisma.refreshSession.findUnique({
    where: { id: parsed.sessionId },
    include: { user: true },
  });

  if (!session) return null;
  const presentedHash = hashToken(parsed.token);
  if (!timingSafeEqual(session.tokenHash, presentedHash)) return null;

  return session;
}

export async function revokeSession(sessionId, replacedByTokenHash = null) {
  if (!sessionId) return;
  await prisma.refreshSession.updateMany({
    where: { id: sessionId, revokedAt: null },
    data: { revokedAt: new Date(), replacedByTokenHash },
  });
}

export async function revokeAllUserSessions(userId, exceptSessionId = null) {
  await prisma.refreshSession.updateMany({
    where: {
      userId,
      revokedAt: null,
      ...(exceptSessionId ? { id: { not: exceptSessionId } } : {}),
    },
    data: { revokedAt: new Date() },
  });
}

/** Detect replay: a revoked token was presented. Revoke every session for safety. */
export async function handleRefreshReplay(session) {
  await prisma.refreshSession.updateMany({
    where: { userId: session.userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
