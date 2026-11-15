/**
 * GrowthVerse Backend Route Registration
 */

import authRoutes from "./auth/index.js";
import adminUserRoutes from "./admin/users.js";
import services from "./modules/services/index.js";
import pricing from "./modules/pricing/index.js";
import features from "./modules/features/index.js";
import portfolio from "./modules/portfolio/index.js";
import contacts from "./modules/contacts/index.js";
import customers from "./modules/customers/index.js";
import orders from "./modules/orders/index.js";
import dashboard from "./modules/dashboard/index.js";
import settings from "./modules/settings/index.js";

const registerRoutes = async (fastify) => {
  fastify.register(authRoutes, { prefix: "/api/auth" });
  fastify.register(adminUserRoutes, { prefix: "/api/admin" });

  fastify.register(services, { prefix: "/api/services" });
  fastify.register(pricing, { prefix: "/api/pricing" });
  fastify.register(features, { prefix: "/api/features" });
  fastify.register(portfolio, { prefix: "/api/portfolio" });
  fastify.register(contacts, { prefix: "/api/contacts" });
  fastify.register(customers, { prefix: "/api/customers" });
  fastify.register(orders, { prefix: "/api/orders" });
  fastify.register(dashboard, { prefix: "/api/dashboard" });
  fastify.register(settings, { prefix: "/api/settings" });
};

export default registerRoutes;
