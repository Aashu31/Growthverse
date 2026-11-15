/**
 * Centralized error handling.
 * Never logs request bodies (they can contain passwords/tokens).
 */

import fp from "fastify-plugin";
import { ZodError } from "zod";
import config from "../config/env.js";
import { HttpError } from "../lib/http.js";

async function errorHandlerPlugin(fastify) {
  fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send({ success: false, message: "Route not found", code: "NOT_FOUND" });
  });

  fastify.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode || error.status || 500;

    fastify.log.error(
      {
        method: request.method,
        url: request.url,
        statusCode,
        name: error.name,
        code: error.code,
      },
      "Request failed"
    );

    if (error instanceof ZodError) {
      return reply.code(400).send({
        success: false,
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        errors: error.issues.map((issue) => ({
          field: issue.path.join(".") || "body",
          message: issue.message,
        })),
      });
    }

    if (error instanceof HttpError) {
      return reply.code(error.statusCode).send({
        success: false,
        message: error.message,
        code: error.code || "ERROR",
        ...(error.details ? { errors: error.details } : {}),
      });
    }

    if (error.code === "P2002") {
      return reply.code(409).send({
        success: false,
        message: "A record with this value already exists.",
        code: "CONFLICT",
      });
    }

    if (error.code === "P2003" || error.code === "P2025") {
      return reply.code(400).send({
        success: false,
        message: "The related record could not be found.",
        code: "INVALID_REFERENCE",
      });
    }

    if (error.validation) {
      return reply.code(400).send({
        success: false,
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        errors: error.validation.map((issue) => ({
          field: issue.instancePath || issue.params?.missingProperty || "request",
          message: issue.message,
        })),
      });
    }

    const isCors = /Origin is not allowed/i.test(error.message || "");
    if (isCors) {
      return reply.code(403).send({ success: false, message: "Request origin is not allowed", code: "INVALID_ORIGIN" });
    }

    const body = {
      success: false,
      message: statusCode >= 500 ? "Internal server error" : error.message || "Request failed",
      code: statusCode >= 500 ? "INTERNAL_ERROR" : error.code || "ERROR",
    };

    if (!config.isProduction && statusCode >= 500) {
      body.debug = error.message;
    }

    return reply.code(statusCode >= 400 && statusCode < 600 ? statusCode : 500).send(body);
  });
}

export default fp(errorHandlerPlugin, { name: "growthverse-error-handler" });
