/**
 * Services module.
 * Public read (published + active) and ADMIN/SUPER_ADMIN management.
 */

import { z } from "zod";
import prisma from "../../../lib/prisma.js";
import { badRequest, notFound, safeString } from "../../../lib/http.js";
import { isManager, toArray } from "../../../lib/access.js";
import { PERMISSIONS } from "../../../lib/permissions.js";

const boolQuery = z.preprocess(
  (value) => (value === undefined || value === "" ? undefined : value === true || value === "true" || value === "1"),
  z.boolean().optional()
);

const querySchema = z.object({
  category: z.string().optional(),
  isActive: boolQuery,
  search: z.string().max(100).optional(),
  all: boolQuery,
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(["title", "displayOrder", "createdAt"]).default("displayOrder"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

const serviceBody = z.object({
  title: z.string().trim().min(1).max(150),
  slug: z.string().trim().min(1).max(150).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  description: z.string().max(5000).optional().default(""),
  shortDescription: z.string().max(500).optional().default(""),
  category: z.string().max(100).optional().default("General"),
  features: z.union([z.array(z.string()), z.string()]).optional().default([]),
  isPublished: z.boolean().optional().default(true),
  isActive: z.boolean().optional().default(true),
  displayOrder: z.coerce.number().int().optional().default(0),
});

const updateBody = serviceBody.partial();

function normalize(data) {
  return { ...data, ...(data.features !== undefined ? { features: toArray(data.features) } : {}) };
}

export default async function servicesRoutes(fastify) {
  fastify.get("/", { preHandler: [fastify.optionalAuthenticate] }, async (request, reply) => {
    const query = querySchema.parse(request.query || {});
    const manager = isManager(request);

    const where = {};
    if (!(manager && query.all)) {
      where.isPublished = true;
      where.isActive = true;
    } else if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }
    if (query.category) where.category = query.category;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { slug: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [services, total] = await prisma.$transaction([
      prisma.service.findMany({
        where,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: { _count: { select: { projectInquiries: true } } },
      }),
      prisma.service.count({ where }),
    ]);

    return reply.send({
      success: true,
      message: "Services retrieved successfully",
      data: { services, total, page: query.page, totalPages: Math.ceil(total / query.limit) },
    });
  });

  fastify.get("/:slug", { preHandler: [fastify.optionalAuthenticate] }, async (request, reply) => {
    const slug = safeString(request.params.slug, 150);
    const service = await prisma.service.findUnique({
      where: { slug },
      include: { _count: { select: { projectInquiries: true } } },
    });

    if (!service || (!isManager(request) && (!service.isPublished || !service.isActive))) {
      throw notFound("Service not found");
    }

    return reply.send({ success: true, message: "Service retrieved successfully", data: { service } });
  });

  fastify.post("/", { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.CONTENT_MANAGE)] }, async (request, reply) => {
    const data = normalize(serviceBody.parse(request.body || {}));
    const service = await prisma.service.create({ data });
    return reply.code(201).send({ success: true, message: "Service created successfully", data: { service } });
  });

  fastify.put("/:id", { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.CONTENT_MANAGE)] }, async (request, reply) => {
    const id = safeString(request.params.id, 100);
    const data = normalize(updateBody.parse(request.body || {}));
    if (Object.keys(data).length === 0) throw badRequest("No fields provided");
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) throw notFound("Service not found");
    const service = await prisma.service.update({ where: { id }, data });
    return reply.send({ success: true, message: "Service updated successfully", data: { service } });
  });

  fastify.patch("/:id/status", { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.CONTENT_MANAGE)] }, async (request, reply) => {
    const id = safeString(request.params.id, 100);
    const body = z.object({ isActive: z.boolean() }).parse(request.body || {});
    const service = await prisma.service.update({ where: { id }, data: { isActive: body.isActive } });
    return reply.send({ success: true, message: "Service status updated successfully", data: { service } });
  });

  fastify.delete("/:id", { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.CONTENT_MANAGE)] }, async (request, reply) => {
    const id = safeString(request.params.id, 100);
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) throw notFound("Service not found");
    await prisma.service.delete({ where: { id } });
    return reply.send({ success: true, message: "Service deleted successfully" });
  });
}
