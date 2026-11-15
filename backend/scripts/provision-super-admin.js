#!/usr/bin/env node
/**
 * One-time SUPER_ADMIN provisioning / recovery.
 *
 * Required environment variables:
 *   ALLOW_SUPER_ADMIN_PROVISION=true
 *   SUPER_ADMIN_EMAIL=...
 *   SUPER_ADMIN_NAME=...
 *   SUPER_ADMIN_PASSWORD=...   (min 10 chars, upper/lower/number)
 *
 * Safety:
 *   - Refuses to run unless the explicit flag is set.
 *   - Refuses to create another SUPER_ADMIN if one already exists unless
 *     SUPER_ADMIN_FORCE=true is also set (documented recovery path).
 *   - Never prints the password.
 */

import config from "../src/config/env.js";
import prisma from "../src/lib/prisma.js";
import { hashPassword, validatePassword } from "../src/lib/password.js";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

async function main() {
  if (!config.allowSuperAdminProvision) {
    fail("ALLOW_SUPER_ADMIN_PROVISION=true is required to provision an administrator.");
  }

  const email = String(process.env.SUPER_ADMIN_EMAIL || "").trim().toLowerCase();
  const name = String(process.env.SUPER_ADMIN_NAME || "").trim();
  const password = String(process.env.SUPER_ADMIN_PASSWORD || "");

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("SUPER_ADMIN_EMAIL must be a valid email address.");
  if (!name || name.length < 2) fail("SUPER_ADMIN_NAME must be at least 2 characters.");
  if (!password) fail("SUPER_ADMIN_PASSWORD is required.");

  const passwordErrors = validatePassword(password);
  if (passwordErrors.length) fail(`SUPER_ADMIN_PASSWORD does not meet the policy:\n- ${passwordErrors.join("\n- ")}`);

  const existingSuperAdmins = await prisma.user.findMany({ where: { role: "SUPER_ADMIN" } });
  if (existingSuperAdmins.length > 0 && !config.superAdminForce) {
    fail("A SUPER_ADMIN already exists. Set SUPER_ADMIN_FORCE=true only for an intentional recovery/reset.");
  }

  const passwordHash = await hashPassword(password);
  const existingUser = await prisma.user.findUnique({ where: { email } });

  const user = existingUser
    ? await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name,
          passwordHash,
          role: "SUPER_ADMIN",
          status: "ACTIVE",
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      })
    : await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: "SUPER_ADMIN",
          status: "ACTIVE",
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      });

  // Force a fresh login and invalidate any previous sessions.
  await prisma.refreshSession.updateMany({
    where: { userId: user.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  console.log("✅ SUPER_ADMIN provisioned successfully.");
  console.log(`   Email: ${user.email}`);
  console.log("   Password: (not displayed)");
  console.log("   Remove SUPER_ADMIN_PASSWORD from the environment now.");
}

main()
  .catch((error) => {
    console.error("❌ Provisioning failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
