/**
 * Database connection helpers. The Prisma client is created once in lib/prisma.js.
 */

import prisma from "../lib/prisma.js";

const database = {
  async connect() {
    await prisma.$connect();
    return true;
  },

  async disconnect() {
    await prisma.$disconnect();
    return true;
  },

  async isConnected() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  },
};

export default database;
