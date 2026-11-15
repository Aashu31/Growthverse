/**
 * Central authentication and authorization plugin.
 * Every protected route uses these decorators; individual handlers must not
 * invent their own role checks.
 */

import fp from "fastify-plugin";
import config from "../config/env.js";
import prisma from "../lib/prisma.js";
import { hasPermission, ROLES } from "../lib/permissions.js";

function extractAccessToken(request) {
  const cookieToken = request.cookies?.[config.accessCookieName];
  if (cookieToken) return cookieToken;
  const header = request.headers.authorization;
  if (header && header.startsWith("Bearer ")) return header.slice(7).trim();
  return null;
}

async function authPlugin(fastify) {
  fastify.decorateRequest("authUser", null);
  fastify.decorateRequest("authSessionId", null);

  const resolveAuth = async (request) => {
    const token = extractAccessToken(request);
    if (!token) return { error: "Authentication required" };

    let payload;
    try {
      payload = fastify.jwt.verify(token);
    } catch {
      return { error: "Invalid or expired session" };
    }

    if (!payload?.sub || !payload?.sid) return { error: "Invalid session token" };

    const [user, session] = await Promise.all([
      prisma.user.findUnique({ where: { id: payload.sub } }),
      prisma.refreshSession.findUnique({ where: { id: payload.sid } }),
    ]);

    if (!user || !session) return { error: "Invalid session" };
    if (session.userId !== user.id) return { error: "Invalid session" };
    if (session.revokedAt) return { error: "Session has been revoked" };
    if (session.expiresAt.getTime() <= Date.now()) return { error: "Session expired" };
    if (user.status !== "ACTIVE") return { error: "Account is not active" };

    return { user, session, payload };
  };

  fastify.decorate("authenticate", async (request, reply) => {
    const result = await resolveAuth(request);
    if (result.error) {
      return reply.code(401).send({
        success: false,
        message: result.error,
        code: "UNAUTHENTICATED",
      });
    }
    request.authUser = result.user;
    request.authSessionId = result.session.id;
    return undefined;
  });

  fastify.decorate("optionalAuthenticate", async (request) => {
    const result = await resolveAuth(request);
    if (!result.error) {
      request.authUser = result.user;
      request.authSessionId = result.session.id;
    }
  });

  fastify.decorate("authorizeRoles", (...roles) => async (request, reply) => {
    if (!request.authUser) {
      return reply.code(401).send({ success: false, message: "Authentication required", code: "UNAUTHENTICATED" });
    }
    if (!roles.includes(request.authUser.role)) {
      return reply.code(403).send({ success: false, message: "You do not have permission to perform this action", code: "FORBIDDEN" });
    }
    return undefined;
  });

  fastify.decorate("authorizePermission", (permission) => async (request, reply) => {
    if (!request.authUser) {
      return reply.code(401).send({ success: false, message: "Authentication required", code: "UNAUTHENTICATED" });
    }
    if (!hasPermission(request.authUser.role, permission)) {
      return reply.code(403).send({ success: false, message: "You do not have permission to perform this action", code: "FORBIDDEN" });
    }
    return undefined;
  });

  fastify.decorate("requireStaff", async (request, reply) => {
    if (!request.authUser) {
      return reply.code(401).send({ success: false, message: "Authentication required", code: "UNAUTHENTICATED" });
    }
    if (![ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF].includes(request.authUser.role)) {
      return reply.code(403).send({ success: false, message: "Administrative access required", code: "FORBIDDEN" });
    }
    return undefined;
  });
}

export default fp(authPlugin, { name: "growthverse-auth" });
