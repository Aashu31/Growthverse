/**
 * Customers module.
 * Staff-only management. A CUSTOMER can only read their own profile via /me.
 */

import { z } from "zod";
import prisma from "../../../lib/prisma.js";
import { conflict, notFound, safeString, normalizeEmail } from "../../../lib/http.js";
import { PERMISSIONS } from "../../../lib/permissions.js";

const querySchema = z.object({
  status: z.enum(["active", "inactive", "lead"]).optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const customerBody = z.object({
  name: z.string().trim().min(1).max(150),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional().default(""),
  company: z.string().trim().max(150).optional().default(""),
  country: z.string().trim().max(100).optional().default(""),
  notes: z.string().trim().max(5000).optional().default(""),
  status: z.enum(["active", "inactive", "lead"]).optional().default("active"),
});

const customerUpdateBody = customerBody.partial();

export default async function customersRoutes(fastify) {
  const staffView = { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.CUSTOMERS_VIEW)] };
  const staffManage = { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.CUSTOMERS_MANAGE)] };

  // Self-service: must be registered before /:id.
  fastify.get("/me", { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const customer = await prisma.customer.findFirst({
      where: { userId: request.authUser.id },
    });
    if (!customer) throw notFound("No customer profile is linked to this account");
    return reply.send({ success: true, data: { customer } });
  });

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

    const [customers, total] = await prisma.$transaction([
      prisma.customer.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: { _count: { select: { projectInquiries: true } } },
      }),
      prisma.customer.count({ where }),
    ]);

    return reply.send({
      success: true,
      message: "Customers retrieved successfully",
      data: { customers, total, page: query.page, totalPages: Math.ceil(total / query.limit) },
    });
  });

  fastify.get("/:id", staffView, async (request, reply) => {
    const customer = await prisma.customer.findUnique({
      where: { id: safeString(request.params.id, 100) },
      include: { _count: { select: { projectInquiries: true } } },
    });
    if (!customer) throw notFound("Customer not found");
    return reply.send({ success: true, message: "Customer retrieved successfully", data: { customer } });
  });

  fastify.post("/", staffManage, async (request, reply) => {
    const body = customerBody.parse(request.body || {});
    const email = normalizeEmail(body.email);
    const existing = await prisma.customer.findFirst({ where: { email } });
    if (existing) throw conflict("A customer with this email already exists", "CUSTOMER_EXISTS");
    const linkedUser = await prisma.user.findUnique({ where: { email } });
    const customer = await prisma.customer.create({
      data: { ...body, email, userId: linkedUser?.emailVerified ? linkedUser.id : undefined },
    });
    return reply.code(201).send({ success: true, message: "Customer created successfully", data: { customer } });
  });

  fastify.put("/:id", staffManage, async (request, reply) => {
    const id = safeString(request.params.id, 100);
    const data = customerUpdateBody.parse(request.body || {});
    if (Object.keys(data).length === 0) throw notFound("Customer not found");
    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing) throw notFound("Customer not found");
    if (data.email) data.email = normalizeEmail(data.email);
    const customer = await prisma.customer.update({ where: { id }, data });
    return reply.send({ success: true, message: "Customer updated successfully", data: { customer } });
  });

  fastify.delete("/:id", staffManage, async (request, reply) => {
    const id = safeString(request.params.id, 100);
    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing) throw notFound("Customer not found");
    await prisma.customer.delete({ where: { id } });
    return reply.send({ success: true, message: "Customer deleted successfully" });
  });
}
