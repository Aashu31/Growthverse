/**
 * Pricing module.
 * Public read of active plans; ADMIN/SUPER_ADMIN management.
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
  audience: z.enum(["indian", "international"]).optional(),
  billingCycle: z.enum(["monthly", "quarterly", "yearly", "one-time"]).optional(),
  currency: z.enum(["INR", "USD"]).optional(),
  isActive: boolQuery,
  all: boolQuery,
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const planBody = z.object({
  name: z.string().trim().min(1).max(150),
  category: z.string().max(100).optional().default("General"),
  audience: z.enum(["indian", "international"]),
  billingCycle: z.enum(["monthly", "quarterly", "yearly", "one-time"]),
  currency: z.enum(["INR", "USD"]),
  amount: z.coerce.number().positive(),
  description: z.string().max(2000).optional().default(""),
  features: z.union([z.array(z.string()), z.string()]).optional().default([]),
  supportDetails: z.string().max(2000).optional().default(""),
  isActive: z.boolean().optional().default(true),
  displayOrder: z.coerce.number().int().optional().default(0),
});

const updateBody = planBody.partial();
const serialize = (plan) => ({ ...plan, amount: Number(plan.amount) });
const normalize = (data) => ({ ...data, ...(data.features !== undefined ? { features: toArray(data.features) } : {}) });

export default async function pricingRoutes(fastify) {
  fastify.get("/", { preHandler: [fastify.optionalAuthenticate] }, async (request, reply) => {
    const query = querySchema.parse(request.query || {});
    const manager = isManager(request);

    const where = {};
    if (!(manager && query.all)) where.isActive = true;
    else if (query.isActive !== undefined) where.isActive = query.isActive;
    if (query.audience) where.audience = query.audience;
    if (query.billingCycle) where.billingCycle = query.billingCycle;
    if (query.currency) where.currency = query.currency;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { category: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [plans, total] = await prisma.$transaction([
      prisma.pricingPlan.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { displayOrder: "asc" },
      }),
      prisma.pricingPlan.count({ where }),
    ]);

    return reply.send({
      success: true,
      message: "Pricing plans retrieved successfully",
      data: { plans: plans.map(serialize), total, page: query.page, totalPages: Math.ceil(total / query.limit) },
    });
  });

  fastify.get("/website-development", async (request, reply) => {
    const [indiaPlans, internationalPlans] = await prisma.$transaction([
      prisma.pricingPlan.findMany({ where: { audience: "indian", isActive: true }, orderBy: { displayOrder: "asc" } }),
      prisma.pricingPlan.findMany({ where: { audience: "international", isActive: true }, orderBy: { displayOrder: "asc" } }),
    ]);

    const pick = (plans, cycle, fallback) =>
      Number(plans.find((plan) => plan.billingCycle === cycle)?.amount ?? fallback);

    return reply.send({
      success: true,
      message: "Website development pricing retrieved successfully",
      data: {
        india: {
          monthly: pick(indiaPlans, "monthly", 1000),
          quarterly: pick(indiaPlans, "quarterly", 4000),
          yearly: pick(indiaPlans, "yearly", 11000),
        },
        international: {
          monthly: pick(internationalPlans, "monthly", 300),
          quarterly: pick(internationalPlans, "quarterly", 1200),
          yearly: pick(internationalPlans, "yearly", 2200),
        },
      },
    });
  });

  fastify.get("/maintenance", async (_request, reply) => {
    const plans = await prisma.pricingPlan.findMany({
      where: { isActive: true, OR: [{ category: { contains: "maintenance", mode: "insensitive" } }, { name: { contains: "maintenance", mode: "insensitive" } }] },
      orderBy: { displayOrder: "asc" },
    });
    return reply.send({
      success: true,
      message: "Maintenance plans retrieved successfully",
      data: { plans: plans.map(serialize), total: plans.length, page: 1, totalPages: 1 },
    });
  });

  fastify.get("/:id", { preHandler: [fastify.optionalAuthenticate] }, async (request, reply) => {
    const plan = await prisma.pricingPlan.findUnique({ where: { id: safeString(request.params.id, 100) } });
    if (!plan || (!isManager(request) && !plan.isActive)) throw notFound("Pricing plan not found");
    return reply.send({ success: true, message: "Pricing plan retrieved successfully", data: { plan: serialize(plan) } });
  });

  fastify.post("/", { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.CONTENT_MANAGE)] }, async (request, reply) => {
    const data = normalize(planBody.parse(request.body || {}));
    const plan = await prisma.pricingPlan.create({ data });
    return reply.code(201).send({ success: true, message: "Pricing plan created successfully", data: { plan: serialize(plan) } });
  });

  fastify.put("/:id", { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.CONTENT_MANAGE)] }, async (request, reply) => {
    const id = safeString(request.params.id, 100);
    const data = normalize(updateBody.parse(request.body || {}));
    if (Object.keys(data).length === 0) throw badRequest("No fields provided");
    const existing = await prisma.pricingPlan.findUnique({ where: { id } });
    if (!existing) throw notFound("Pricing plan not found");
    const plan = await prisma.pricingPlan.update({ where: { id }, data });
    return reply.send({ success: true, message: "Pricing plan updated successfully", data: { plan: serialize(plan) } });
  });

  fastify.patch("/:id/status", { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.CONTENT_MANAGE)] }, async (request, reply) => {
    const body = z.object({ isActive: z.boolean() }).parse(request.body || {});
    const plan = await prisma.pricingPlan.update({ where: { id: safeString(request.params.id, 100) }, data: { isActive: body.isActive } });
    return reply.send({ success: true, message: "Pricing plan status updated", data: { plan: serialize(plan) } });
  });

  fastify.delete("/:id", { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.CONTENT_MANAGE)] }, async (request, reply) => {
    const id = safeString(request.params.id, 100);
    const existing = await prisma.pricingPlan.findUnique({ where: { id } });
    if (!existing) throw notFound("Pricing plan not found");
    await prisma.pricingPlan.delete({ where: { id } });
    return reply.send({ success: true, message: "Pricing plan deleted successfully" });
  });
}
