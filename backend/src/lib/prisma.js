/**
 * Single Prisma client instance for the whole backend.
 * Importing from this module avoids creating multiple connection pools.
 */

import { PrismaClient } from "@prisma/client";
import config from "../config/env.js";

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.__growthversePrisma ||
  new PrismaClient({
    log: config.isDevelopment ? ["warn", "error"] : ["error"],
  });

if (!config.isProduction) {
  globalForPrisma.__growthversePrisma = prisma;
}

export default prisma;
