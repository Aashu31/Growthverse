/**
 * Transport and request security: CORS allowlist, security headers,
 * global rate limiting, Origin/Referer validation and CSRF double-submit.
 */

import fp from "fastify-plugin";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import config from "../config/env.js";
import { timingSafeEqual } from "../lib/tokens.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function isAllowedOrigin(origin) {
  if (!origin) return false;
  try {
    const normalized = new URL(origin).origin;
    return config.corsOrigins.includes(normalized);
  } catch {
    return false;
  }
}

async function securityPlugin(fastify) {
  await fastify.register(cors, {
    origin(origin, callback) {
      if (!origin) return callback(null, true); // non-browser clients
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    maxAge: 600,
  });

  await fastify.register(helmet, {
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  });

  await fastify.register(rateLimit, {
    max: config.rateLimitMax,
    timeWindow: config.rateLimitWindow,
    allowList: (request) => request.url === "/api/health",
    keyGenerator: (request) => request.ip,
  });

  // Reject cross-site state-changing requests and enforce a double-submit CSRF
  // token whenever authentication cookies are present.
  fastify.addHook("onRequest", async (request, reply) => {
    if (SAFE_METHODS.has(request.method)) return;

    const origin = request.headers.origin;
    const referer = request.headers.referer;
    const checkOrigin = origin || (referer ? (() => { try { return new URL(referer).origin; } catch { return referer; } })() : null);

    if (checkOrigin && !isAllowedOrigin(checkOrigin)) {
      return reply.code(403).send({
        success: false,
        message: "Request origin is not allowed",
        code: "INVALID_ORIGIN",
      });
    }

    const hasAuthCookie = Boolean(request.cookies?.[config.accessCookieName] || request.cookies?.[config.refreshCookieName]);
    if (!hasAuthCookie) return;

    const cookieToken = request.cookies?.[config.csrfCookieName];
    const headerToken = request.headers["x-csrf-token"];

    if (!cookieToken || !headerToken || !timingSafeEqual(cookieToken, String(headerToken))) {
      return reply.code(403).send({
        success: false,
        message: "CSRF validation failed. Refresh the page and try again.",
        code: "CSRF_FAILED",
      });
    }
  });
}

export default fp(securityPlugin, { name: "growthverse-security" });
