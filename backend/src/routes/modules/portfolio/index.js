/**
 * Portfolio module.
 * Public read of published projects; ADMIN/SUPER_ADMIN management.
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
  published: boolQuery,
  all: boolQuery,
  featured: boolQuery,
  category: z.string().max(100).optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const projectBody = z.object({
  title: z.string().trim().min(1).max(150),
  slug: z.string().trim().min(1).max(150).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  description: z.string().max(5000).optional().default(""),
  category: z.string().max(100).optional().default("General"),
  technologies: z.union([z.array(z.string()), z.string()]).optional().default([]),
  thumbnail: z.string().max(1000).optional().nullable(),
  images: z.union([z.array(z.string()), z.string()]).optional().default([]),
  projectUrl: z.string().url().max(1000).optional().nullable().or(z.literal("")),
  isPublished: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  displayOrder: z.coerce.number().int().optional().default(0),
});

const updateBody = projectBody.partial();

function normalize(data) {
  const result = { ...data };
  if (data.technologies !== undefined) result.technologies = toArray(data.technologies);
  if (data.images !== undefined) result.images = toArray(data.images);
  if (result.projectUrl === "") result.projectUrl = null;
  if (result.thumbnail === "") result.thumbnail = null;
  return result;
}

export default async function portfolioRoutes(fastify) {
  fastify.get("/", { preHandler: [fastify.optionalAuthenticate] }, async (request, reply) => {
    const query = querySchema.parse(request.query || {});
    const manager = isManager(request);
    const where = {};

    if (manager && query.all) {
      if (query.published !== undefined) where.isPublished = query.published;
    } else {
      where.isPublished = true;
    }
    if (query.featured !== undefined) where.isFeatured = query.featured;
    if (query.category) where.category = query.category;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [projects, total] = await prisma.$transaction([
      prisma.portfolioProject.findMany({
        where,
        orderBy: { displayOrder: "asc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.portfolioProject.count({ where }),
    ]);

    return reply.send({
      success: true,
      message: "Portfolio projects retrieved successfully",
      data: { projects, total, page: query.page, totalPages: Math.ceil(total / query.limit) },
    });
  });

  fastify.get("/:slug", { preHandler: [fastify.optionalAuthenticate] }, async (request, reply) => {
    const project = await prisma.portfolioProject.findUnique({ where: { slug: safeString(request.params.slug, 150) } });
    if (!project || (!isManager(request) && !project.isPublished)) throw notFound("Portfolio project not found");
    return reply.send({ success: true, message: "Portfolio project retrieved successfully", data: { project } });
  });

  fastify.post("/", { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.CONTENT_MANAGE)] }, async (request, reply) => {
    const project = await prisma.portfolioProject.create({ data: normalize(projectBody.parse(request.body || {})) });
    return reply.code(201).send({ success: true, message: "Portfolio project created successfully", data: { project } });
  });

  fastify.put("/:id", { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.CONTENT_MANAGE)] }, async (request, reply) => {
    const id = safeString(request.params.id, 100);
    const data = normalize(updateBody.parse(request.body || {}));
    if (Object.keys(data).length === 0) throw badRequest("No fields provided");
    const existing = await prisma.portfolioProject.findUnique({ where: { id } });
    if (!existing) throw notFound("Portfolio project not found");
    const project = await prisma.portfolioProject.update({ where: { id }, data });
    return reply.send({ success: true, message: "Portfolio project updated successfully", data: { project } });
  });

  fastify.delete("/:id", { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.CONTENT_MANAGE)] }, async (request, reply) => {
    const id = safeString(request.params.id, 100);
    const existing = await prisma.portfolioProject.findUnique({ where: { id } });
    if (!existing) throw notFound("Portfolio project not found");
    await prisma.portfolioProject.delete({ where: { id } });
    return reply.send({ success: true, message: "Portfolio project deleted successfully" });
  });
}
