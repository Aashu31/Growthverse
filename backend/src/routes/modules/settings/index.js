/**
 * Website settings module.
 * Public read of non-sensitive website settings; SUPER_ADMIN can update.
 */

import { z } from "zod";
import prisma from "../../../lib/prisma.js";
import { badRequest, forbidden, notFound } from "../../../lib/http.js";
import { PERMISSIONS } from "../../../lib/permissions.js";

const sensitiveKey = /(secret|password|token|smtp|database|jwt|cookie|key$)/i;

const putSchema = z.object({
  settings: z.record(z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.any()), z.record(z.any())])),
}).strict();

function encodeValue(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function decodeValue(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (/^[[{]/.test(trimmed) || /^(true|false|null|-?\d+(\.\d+)?)$/.test(trimmed)) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }
  return value;
}

export default async function settingsRoutes(fastify) {
  fastify.get("/", async (request, reply) => {
    const key = request.query?.key ? String(request.query.key).slice(0, 100) : null;
    if (key && !sensitiveKey.test(key)) {
      const setting = await prisma.siteSetting.findUnique({ where: { key } });
      if (!setting) throw notFound("Setting not found");
      return reply.send({ success: true, message: "Setting retrieved successfully", data: { key, value: decodeValue(setting.value) } });
    }

    const settings = await prisma.siteSetting.findMany();
    const result = {};
    for (const setting of settings) {
      if (sensitiveKey.test(setting.key)) continue;
      result[setting.key] = decodeValue(setting.value);
    }

    return reply.send({ success: true, message: "Settings retrieved successfully", data: result });
  });

  fastify.put(
    "/",
    { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.SETTINGS_MANAGE)] },
    async (request, reply) => {
      const body = putSchema.parse(request.body || {});
      const entries = Object.entries(body.settings);
      if (entries.length === 0) throw badRequest("No settings provided");
      for (const [key] of entries) {
        if (sensitiveKey.test(key)) throw forbidden(`Setting "${key}" cannot be managed through this API`);
      }

      const results = await prisma.$transaction(
        entries.map(([key, value]) =>
          prisma.siteSetting.upsert({
            where: { key },
            update: { value: encodeValue(value) },
            create: { key, value: encodeValue(value) },
          })
        )
      );

      return reply.send({
        success: true,
        message: "Settings updated successfully",
        data: { updated: results.length },
      });
    }
  );
}
