/**
 * Features module.
 * Public read of active features; ADMIN/SUPER_ADMIN management.
 */

import { z } from "zod";
import prisma from "../../../lib/prisma.js";
import { badRequest, notFound, safeString } from "../../../lib/http.js";
import { isManager } from "../../../lib/access.js";
import { PERMISSIONS } from "../../../lib/permissions.js";

const boolQuery = z.preprocess(
  (value) => (value === undefined || value === "" ? undefined : value === true || value === "true" || value === "1"),
  z.boolean().optional()
);

const querySchema = z.object({
  isActive: boolQuery,
  all: boolQuery,
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const featureBody = z.object({
  title: z.string().trim().min(1).max(150),
  category: z.string().max(100).optional().default("General"),
  description: z.string().max(2000).optional().default(""),
  icon: z.string().max(80).optional().default("Target"),
  isActive: z.boolean().optional().default(true),
  displayOrder: z.coerce.number().int().optional().default(0),
});

const updateBody = featureBody.partial();

export default async function featuresRoutes(fastify) {
  fastify.get("/", { preHandler: [fastify.optionalAuthenticate] }, async (request, reply) => {
    const query = querySchema.parse(request.query || {});
    const manager = isManager(request);
    const where = {};
    if (!(manager && query.all)) where.isActive = true;
    else if (query.isActive !== undefined) where.isActive = query.isActive;

    const [features, total] = await prisma.$transaction([
      prisma.feature.findMany({
        where,
        orderBy: { displayOrder: "asc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.feature.count({ where }),
    ]);

    return reply.send({
      success: true,
      message: "Features retrieved successfully",
      data: { features, total, page: query.page, totalPages: Math.ceil(total / query.limit) },
    });
  });

  fastify.get("/:id", { preHandler: [fastify.optionalAuthenticate] }, async (request, reply) => {
    const feature = await prisma.feature.findUnique({ where: { id: safeString(request.params.id, 100) } });
    if (!feature || (!isManager(request) && !feature.isActive)) throw notFound("Feature not found");
    return reply.send({ success: true, message: "Feature retrieved successfully", data: { feature } });
  });

  fastify.post("/", { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.CONTENT_MANAGE)] }, async (request, reply) => {
    const feature = await prisma.feature.create({ data: featureBody.parse(request.body || {}) });
    return reply.code(201).send({ success: true, message: "Feature created successfully", data: { feature } });
  });

  fastify.put("/:id", { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.CONTENT_MANAGE)] }, async (request, reply) => {
    const id = safeString(request.params.id, 100);
    const data = updateBody.parse(request.body || {});
    if (Object.keys(data).length === 0) throw badRequest("No fields provided");
    const existing = await prisma.feature.findUnique({ where: { id } });
    if (!existing) throw notFound("Feature not found");
    const feature = await prisma.feature.update({ where: { id }, data });
    return reply.send({ success: true, message: "Feature updated successfully", data: { feature } });
  });

  fastify.delete("/:id", { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.CONTENT_MANAGE)] }, async (request, reply) => {
    const id = safeString(request.params.id, 100);
    const existing = await prisma.feature.findUnique({ where: { id } });
    if (!existing) throw notFound("Feature not found");
    await prisma.feature.delete({ where: { id } });
    return reply.send({ success: true, message: "Feature deleted successfully" });
  });
}
