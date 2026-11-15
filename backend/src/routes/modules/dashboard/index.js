/**
 * Dashboard analytics module. Administrative access only.
 */

import { z } from "zod";
import prisma from "../../../lib/prisma.js";
import { PERMISSIONS } from "../../../lib/permissions.js";

const querySchema = z.object({ period: z.string().max(30).optional().default("all") });

export default async function dashboardRoutes(fastify) {
  fastify.get(
    "/overview",
    { preHandler: [fastify.authenticate, fastify.authorizePermission(PERMISSIONS.DASHBOARD_VIEW)] },
    async (request, reply) => {
      querySchema.parse(request.query || {});

      const [totalCustomers, totalEnquiries, newEnquiries, totalOrders, pendingOrders, completedProjects, activeServices] =
        await prisma.$transaction([
          prisma.customer.count(),
          prisma.contact.count(),
          prisma.contact.count({ where: { status: "new" } }),
          prisma.projectInquiry.count(),
          prisma.projectInquiry.count({ where: { status: "pending" } }),
          prisma.portfolioProject.count({ where: { isPublished: true } }),
          prisma.service.count({ where: { isActive: true } }),
        ]);

      const completedOrders = await prisma.projectInquiry.findMany({
        where: { status: "completed" },
        select: { amount: true },
      });
      const revenue = completedOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0);

      return reply.send({
        success: true,
        message: "Dashboard overview retrieved successfully",
        data: {
          totalCustomers,
          totalEnquiries,
          newEnquiries,
          totalOrders,
          pendingOrders,
          completedProjects,
          activeServices,
          revenue,
        },
      });
    }
  );
}
