#!/usr/bin/env node
/**
 * Creates the isolated test database if needed and applies migrations.
 * Never touches the development or production database.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import dotenv from "dotenv";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(backendRoot, ".env") });

const testUrl = process.env.TEST_DATABASE_URL;
if (!testUrl) {
  console.error("TEST_DATABASE_URL is required to run backend tests.");
  process.exit(1);
}

const parsed = new URL(testUrl);
const databaseName = parsed.pathname.replace(/^\//, "");
if (!databaseName || !/test/i.test(databaseName)) {
  console.error("Refusing to run tests: TEST_DATABASE_URL must point to a database whose name contains 'test'.");
  process.exit(1);
}

const adminUrl = new URL(testUrl);
adminUrl.pathname = "/postgres";

const client = new pg.Client({ connectionString: adminUrl.toString() });
await client.connect();
try {
  const exists = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [databaseName]);
  if (exists.rowCount === 0) {
    await client.query(`CREATE DATABASE "${databaseName.replaceAll('"', '""')}"`);
    console.log(`Created test database ${databaseName}`);
  }
} finally {
  await client.end();
}

const prismaCli = path.join(backendRoot, "node_modules", "prisma", "build", "index.js");
execFileSync(process.execPath, [prismaCli, "migrate", "deploy"], {
  cwd: backendRoot,
  env: { ...process.env, DATABASE_URL: testUrl, NODE_ENV: "test" },
  stdio: "inherit",
});
