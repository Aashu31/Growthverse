/**
 * Contacts / enquiries module.
 * Public submission; reads and status updates are staff-only.
 */

import { z } from "zod";
import prisma from "../../../lib/prisma.js";
import { notFound, safeString } from "../../../lib/http.js";
import { PERMISSIONS } from "../../../lib/permissions.js";

const boolQuery = z.preprocess(
  (value) => (value === undefined || value === "" ? undefined : value === true || value === "true" || value === "1"),
  z.boolean().optional()
);

const publicContactBody = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional().default(""),
  company: z.string().trim().max(150).optional().default(""),
  service: z.string().trim().max(150).optional().default(""),
  budget: z.string().trim().max(100).optional().default(""),
  subject: z.string().trim().max(200).optional().default("General enquiry"),
  message: z.string().trim().min(10).max(5000),
});

const adminUpdateBody = z.object({
  status: z.enum(["new", "contacted", "in_progress", "completed", "closed"]).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().max(5000).optional(),
  notes: z.string().trim().max(5000).optional(),
}).strict();

const querySchema = z.object({
  status: z.enum(["new", "contacted", "in_progress", "completed", "closed"]).optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const statusSchema = z.object({
  status: z.enum(["new", "contacted", "in_progress", "completed", "closed"]),
});

export default async function contactsRoutes(fastify) {
  const staffView = { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.CONTACTS_VIEW)] };
  const staffManage = { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.CONTACTS_MANAGE)] };

  // Public enquiry submission
  fastify.post(
    "/",
    { config: { rateLimit: { max: 5, timeWindow: "15 minutes" } } },
    async (request, reply) => {
      const body = publicContactBody.parse(request.body || {});
      const enquiry = await prisma.contact.create({
        data: { ...body, status: "new", source: "website" },
      });
      return reply.code(201).send({
        success: true,
        message: "Contact enquiry submitted successfully",
        data: { enquiry: { id: enquiry.id, status: enquiry.status, createdAt: enquiry.createdAt } },
      });
    }
  );

  fastify.get("/", staffView, async (request, reply) => {
    const query = querySchema.parse(request.query || {});
    const where = {};
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
        { company: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [enquiries, total] = await prisma.$transaction([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.contact.count({ where }),
    ]);

    return reply.send({
      success: true,
      message: "Contact enquiries retrieved successfully",
      data: { enquiries, total, page: query.page, totalPages: Math.ceil(total / query.limit) },
    });
  });

  fastify.get("/:id", staffView, async (request, reply) => {
    const enquiry = await prisma.contact.findUnique({ where: { id: safeString(request.params.id, 100) } });
    if (!enquiry) throw notFound("Contact enquiry not found");
    return reply.send({ success: true, message: "Contact enquiry retrieved successfully", data: { enquiry } });
  });

  fastify.patch("/:id/status", staffManage, async (request, reply) => {
    const body = statusSchema.parse(request.body || {});
    const enquiry = await prisma.contact.update({
      where: { id: safeString(request.params.id, 100) },
      data: { status: body.status },
    });
    return reply.send({ success: true, message: "Enquiry status updated successfully", data: { enquiry } });
  });

  // Compatibility with the existing dashboard client.
  fastify.put("/:id", staffManage, async (request, reply) => {
    const id = safeString(request.params.id, 100);
    const body = adminUpdateBody.parse(request.body || {});
    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) throw notFound("Contact enquiry not found");
    const enquiry = await prisma.contact.update({ where: { id }, data: body });
    return reply.send({ success: true, message: "Enquiry updated successfully", data: { enquiry } });
  });

  fastify.delete("/:id", staffManage, async (request, reply) => {
    const id = safeString(request.params.id, 100);
    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) throw notFound("Contact enquiry not found");
    await prisma.contact.delete({ where: { id } });
    return reply.send({ success: true, message: "Contact enquiry deleted successfully" });
  });
}
