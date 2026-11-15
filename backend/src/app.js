#!/usr/bin/env node

/**
 * GrowthVerse Backend Application
 * Fastify + PostgreSQL + Prisma
 */

import { fileURLToPath } from "node:url";
import fastify from "fastify";
import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import config from "./config/env.js";
import prisma from "./lib/prisma.js";
import registerRoutes from "./routes/index.js";
import authPlugin from "./plugins/auth.js";
import securityPlugin from "./plugins/security.js";
import errorHandlerPlugin from "./plugins/error-handler.js";

export async function buildApp(options = {}) {
  const logger =
    options.logger !== undefined
      ? options.logger
      : config.logLevel === "silent"
        ? false
        : {
            level: config.logLevel,
            redact: {
              paths: [
                "req.headers.authorization",
                "req.headers.cookie",
                "res.headers.set-cookie",
                "req.body.password",
                "req.body.currentPassword",
                "req.body.newPassword",
                "req.body.token",
                "req.body.refreshToken",
              ],
              censor: "[REDACTED]",
            },
          };

  const server = fastify({
    logger,
    trustProxy: config.trustProxy,
    bodyLimit: 1024 * 1024,
  });

  await server.register(cookie);
  await server.register(jwt, {
    secret: config.accessTokenSecret,
    sign: { expiresIn: config.accessTokenExpiry },
  });

  await server.register(securityPlugin);
  await server.register(errorHandlerPlugin);
  await server.register(authPlugin);

  // Allows tests to use isolated, stricter limits without changing global config.
  server.decorate("authLimits", {
    login: { max: config.loginRateLimitMax, timeWindow: "15 minutes" },
    auth: { max: config.authRateLimitMax, timeWindow: "15 minutes" },
    ...(options.authLimits || {}),
  });

  server.get("/api/health", async (_request, reply) => {
    let databaseStatus = "disconnected";
    try {
      await prisma.$queryRaw`SELECT 1`;
      databaseStatus = "connected";
    } catch {
      databaseStatus = "disconnected";
    }
    return reply.send({
      success: true,
      status: "ok",
      environment: config.nodeEnv,
      database: databaseStatus,
    });
  });

  await server.register(registerRoutes);

  return server;
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectRun) {
  const start = async () => {
    const server = await buildApp();
    try {
      await prisma.$connect();
      await server.listen({ port: config.port, host: config.host });
      server.log.info(`🚀 GrowthVerse Backend running at ${server.server.address()?.port}`);
      server.log.info(`📊 Environment: ${config.nodeEnv}`);
      const emailStatus = config.emailProvider === "smtp" && config.smtp.host ? "smtp" : config.emailProvider;
      server.log.info(`✉️  Email provider: ${emailStatus}`);
    } catch (error) {
      server.log.error({ err: error }, "Failed to start server");
      process.exit(1);
    }

    const shutdown = async () => {
      try {
        await server.close();
        await prisma.$disconnect();
        process.exit(0);
      } catch (error) {
        console.error("Graceful shutdown failed", error);
        process.exit(1);
      }
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  };

  start();
}

export default buildApp;
