import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

// Tests always run against the isolated test database and low Argon2 cost.
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
process.env.EMAIL_PROVIDER = "console";
process.env.ARGON2_MEMORY_COST = "8192";
process.env.ARGON2_TIME_COST = "2";
process.env.RATE_LIMIT_MAX = "100000";
process.env.LOGIN_RATE_LIMIT_MAX = "1000";
process.env.AUTH_RATE_LIMIT_MAX = "1000";
process.env.LOG_LEVEL = "silent";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.js"],
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
