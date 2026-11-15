/**
 * Administrative user and role management.
 * Only SUPER_ADMIN can manage users or roles.
 */

import { z } from "zod";
import prisma from "../../lib/prisma.js";
import { badRequest, forbidden, notFound, safeString } from "../../lib/http.js";
import { publicUser, revokeAllUserSessions } from "../../services/auth.service.js";
import { permissionsForRole, ROLES } from "../../lib/permissions.js";

const listQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "STAFF", "CUSTOMER"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    role: z.enum(["SUPER_ADMIN", "ADMIN", "STAFF", "CUSTOMER"]).optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
  })
  .strict();

async function countActiveSuperAdmins(exceptUserId = null) {
  return prisma.user.count({
    where: {
      role: ROLES.SUPER_ADMIN,
      status: "ACTIVE",
      ...(exceptUserId ? { id: { not: exceptUserId } } : {}),
    },
  });
}

export default async function adminUsersRoutes(fastify) {
  const superAdminOnly = { preHandler: [fastify.authenticate, fastify.authorizeRoles(ROLES.SUPER_ADMIN)] };

  fastify.get("/users", superAdminOnly, async (request, reply) => {
    const query = listQuerySchema.parse(request.query || {});
    const where = {};
    if (query.role) where.role = query.role;
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
      ];
    }
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          role: true,
          status: true,
          emailVerified: true,
          lastLoginAt: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return reply.send({
      success: true,
      data: { users, total, page: query.page, totalPages: Math.ceil(total / query.limit) },
    });
  });

  fastify.get("/users/:id", superAdminOnly, async (request, reply) => {
    const user = await prisma.user.findUnique({ where: { id: safeString(request.params.id, 100) } });
    if (!user) throw notFound("User not found");
    return reply.send({ success: true, data: { user: publicUser(user) } });
  });

  fastify.patch("/users/:id", superAdminOnly, async (request, reply) => {
    const targetId = safeString(request.params.id, 100);
    const body = updateUserSchema.parse(request.body || {});

    const target = await prisma.user.findUnique({ where: { id: targetId } });
    if (!target) throw notFound("User not found");

    if (Object.keys(body).length === 0) throw badRequest("No supported fields provided.");

    const targetIsSuperAdmin = target.role === ROLES.SUPER_ADMIN && target.status === "ACTIVE";
    const losingSuperAdmin =
      targetIsSuperAdmin && ((body.role && body.role !== ROLES.SUPER_ADMIN) || (body.status && body.status !== "ACTIVE"));

    if (losingSuperAdmin) {
      const remaining = await countActiveSuperAdmins(target.id);
      if (remaining < 1) throw forbidden("The last active SUPER_ADMIN cannot be demoted or deactivated.");
    }

    if (target.id === request.authUser.id && body.status && body.status !== "ACTIVE") {
      throw forbidden("You cannot deactivate your own account.");
    }

    const user = await prisma.user.update({ where: { id: target.id }, data: body });

    const revokeSessions = body.role !== undefined || (body.status !== undefined && body.status !== "ACTIVE");
    if (revokeSessions) await revokeAllUserSessions(target.id);

    return reply.send({
      success: true,
      message: "User updated successfully",
      data: { user: publicUser(user) },
    });
  });

  fastify.get("/roles", superAdminOnly, async (_request, reply) => {
    return reply.send({
      success: true,
      data: {
        roles: Object.values(ROLES).map((role) => ({ role, permissions: permissionsForRole(role) })),
      },
    });
  });
}
