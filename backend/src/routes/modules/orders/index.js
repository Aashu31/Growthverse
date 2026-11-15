/**
 * Orders module.
 * STAFF/ADMIN manage all orders. CUSTOMER can only read their own orders.
 * Ownership is always enforced server-side from the authenticated user.
 */

import { z } from "zod";
import prisma from "../../../lib/prisma.js";
import { badRequest, notFound, safeString } from "../../../lib/http.js";
import { hasPermission, PERMISSIONS } from "../../../lib/permissions.js";

const boolQuery = z.preprocess(
  (value) => (value === undefined || value === "" ? undefined : value === true || value === "true" || value === "1"),
  z.boolean().optional()
);

const orderStatus = z.enum(["pending", "confirmed", "in_progress", "completed", "cancelled"]);

const querySchema = z.object({
  status: orderStatus.optional(),
  customerId: z.string().optional(),
  currency: z.enum(["INR", "USD"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const createBody = z.object({
  orderNumber: z.string().trim().min(1).max(60).optional(),
  customerId: z.string().min(1),
  serviceId: z.string().optional().nullable().or(z.literal("")),
  projectTitle: z.string().trim().min(1).max(200),
  description: z.string().max(5000).optional().default(""),
  amount: z.coerce.number().positive(),
  currency: z.enum(["INR", "USD"]).default("INR"),
  status: orderStatus.default("pending"),
  startDate: z.coerce.date().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
});

const updateBody = z.object({
  status: orderStatus.optional(),
  amount: z.coerce.number().positive().optional(),
  currency: z.enum(["INR", "USD"]).optional(),
  projectTitle: z.string().trim().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  startDate: z.coerce.date().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
});

const serializeOrder = (order) => ({
  ...order,
  amount: order.amount === null || order.amount === undefined ? null : Number(order.amount),
  customerName: order.customer?.name || order.customerName,
  customerEmail: order.customer?.email || order.email,
  serviceTitle: order.service?.title || null,
});

async function ownCustomerFor(user) {
  return prisma.customer.findFirst({
    where: { userId: user.id },
  });
}

function ensureStaff(request) {
  if (request.authUser.role === "CUSTOMER") return false;
  return hasPermission(request.authUser.role, PERMISSIONS.ORDERS_VIEW);
}

export default async function ordersRoutes(fastify) {
  fastify.get("/", { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const query = querySchema.parse(request.query || {});
    const where = {};

    if (request.authUser.role === "CUSTOMER") {
      if (!hasPermission(request.authUser.role, PERMISSIONS.ORDERS_SELF)) {
        return reply.code(403).send({ success: false, message: "Forbidden", code: "FORBIDDEN" });
      }
      const customer = await ownCustomerFor(request.authUser);
      if (!customer) {
        return reply.send({
          success: true,
          message: "Orders retrieved successfully",
          data: { orders: [], total: 0, page: query.page, totalPages: 0 },
        });
      }
      where.customerId = customer.id;
    } else {
      if (!ensureStaff(request)) {
        return reply.code(403).send({ success: false, message: "Forbidden", code: "FORBIDDEN" });
      }
      if (query.customerId) where.customerId = query.customerId;
    }

    if (query.status) where.status = query.status;
    if (query.currency) where.currency = query.currency;

    const [orders, total] = await prisma.$transaction([
      prisma.projectInquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: {
          customer: { select: { id: true, name: true, email: true } },
          service: { select: { id: true, title: true } },
        },
      }),
      prisma.projectInquiry.count({ where }),
    ]);

    return reply.send({
      success: true,
      message: "Orders retrieved successfully",
      data: { orders: orders.map(serializeOrder), total, page: query.page, totalPages: Math.ceil(total / query.limit) },
    });
  });

  fastify.get("/:id", { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const order = await prisma.projectInquiry.findUnique({
      where: { id: safeString(request.params.id, 100) },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        service: { select: { id: true, title: true } },
      },
    });
    if (!order) throw notFound("Order not found");

    if (request.authUser.role === "CUSTOMER") {
      const customer = await ownCustomerFor(request.authUser);
      const ownsByCustomer = customer && order.customerId === customer.id;
      if (!ownsByCustomer) throw notFound("Order not found");
    } else if (!ensureStaff(request)) {
      return reply.code(403).send({ success: false, message: "Forbidden", code: "FORBIDDEN" });
    }

    return reply.send({ success: true, message: "Order retrieved successfully", data: { order: serializeOrder(order) } });
  });

  fastify.post(
    "/",
    { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.ORDERS_MANAGE)] },
    async (request, reply) => {
      const body = createBody.parse(request.body || {});
      const customer = await prisma.customer.findUnique({ where: { id: body.customerId } });
      if (!customer) throw badRequest("Customer not found");

      const orderNumber = body.orderNumber || `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
      const order = await prisma.projectInquiry.create({
        data: {
          orderNumber,
          customerId: customer.id,
          customerName: customer.name,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
          serviceId: body.serviceId || null,
          projectTitle: body.projectTitle,
          description: body.description,
          amount: body.amount,
          currency: body.currency,
          status: body.status,
          startDate: body.startDate,
          dueDate: body.dueDate,
        },
        include: { customer: { select: { id: true, name: true, email: true } }, service: { select: { id: true, title: true } } },
      });

      return reply.code(201).send({ success: true, message: "Order created successfully", data: { order: serializeOrder(order) } });
    }
  );

  fastify.put(
    "/:id",
    { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.ORDERS_MANAGE)] },
    async (request, reply) => {
      const id = safeString(request.params.id, 100);
      const data = updateBody.parse(request.body || {});
      if (Object.keys(data).length === 0) throw badRequest("No fields provided");
      const existing = await prisma.projectInquiry.findUnique({ where: { id } });
      if (!existing) throw notFound("Order not found");
      const order = await prisma.projectInquiry.update({
        where: { id },
        data,
        include: { customer: { select: { id: true, name: true, email: true } }, service: { select: { id: true, title: true } } },
      });
      return reply.send({ success: true, message: "Order updated successfully", data: { order: serializeOrder(order) } });
    }
  );

  fastify.patch(
    "/:id/status",
    { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.ORDERS_MANAGE)] },
    async (request, reply) => {
      const body = z.object({ status: orderStatus }).parse(request.body || {});
      const order = await prisma.projectInquiry.update({
        where: { id: safeString(request.params.id, 100) },
        data: { status: body.status },
        include: { customer: { select: { id: true, name: true, email: true } }, service: { select: { id: true, title: true } } },
      });
      return reply.send({ success: true, message: "Order status updated successfully", data: { order: serializeOrder(order) } });
    }
  );

  fastify.delete(
    "/:id",
    { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.ORDERS_MANAGE)] },
    async (request, reply) => {
      const id = safeString(request.params.id, 100);
      const existing = await prisma.projectInquiry.findUnique({ where: { id } });
      if (!existing) throw notFound("Order not found");
      await prisma.projectInquiry.delete({ where: { id } });
      return reply.send({ success: true, message: "Order deleted successfully" });
    }
  );
}
