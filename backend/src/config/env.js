/**
 * GrowthVerse Backend Environment Configuration
 * Loads .env and validates security-critical settings.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";
const isTest = nodeEnv === "test";

const splitList = (value) =>
  String(value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const toInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBool = (value, fallback = false) => {
  if (value === undefined || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

const isDuration = (value) =>
  typeof value === "string" && /^\d+\s*(s|m|h|d|w|y)?$/i.test(value.trim());

const duration = (value, fallback) => (isDuration(value) ? value.trim() : fallback);

// Development fallback secret. Never used silently in production.
const ephemeralSecret = crypto.randomBytes(48).toString("hex");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || ephemeralSecret;

const config = {
  nodeEnv,
  isDevelopment: nodeEnv === "development",
  isTest,
  isProduction,

  port: toInt(process.env.PORT, 5000),
  host: process.env.HOST || "0.0.0.0",
  backendOrigin: process.env.BACKEND_ORIGIN || `http://localhost:${toInt(process.env.PORT, 5000)}`,

  databaseUrl: process.env.DATABASE_URL,

  // CORS
  corsOrigins: splitList(process.env.FRONTEND_ORIGIN || process.env.CORS_ORIGIN || "http://localhost:3000"),
  frontendOrigin: (splitList(process.env.FRONTEND_ORIGIN || process.env.CORS_ORIGIN || "http://localhost:3000")[0] || "http://localhost:3000").replace(/\/$/, ""),

  // Rate limiting
  rateLimitMax: toInt(process.env.RATE_LIMIT_MAX, 300),
  rateLimitWindow: process.env.RATE_LIMIT_TIME || "1 minute",
  loginRateLimitMax: toInt(process.env.LOGIN_RATE_LIMIT_MAX, 10),
  authRateLimitMax: toInt(process.env.AUTH_RATE_LIMIT_MAX, 20),

  // Tokens
  accessTokenSecret,
  accessTokenExpiry: duration(process.env.ACCESS_TOKEN_EXPIRY, "15m"),
  refreshTokenExpiry: duration(process.env.REFRESH_TOKEN_EXPIRY, "7d"),
  refreshTokenExpiryMs: toInt(process.env.REFRESH_TOKEN_EXPIRY_MS, 7 * 24 * 60 * 60 * 1000),
  passwordResetExpiryMs: toInt(process.env.PASSWORD_RESET_EXPIRY_MS, 30 * 60 * 1000),
  emailVerificationExpiryMs: toInt(process.env.EMAIL_VERIFICATION_EXPIRY_MS, 24 * 60 * 60 * 1000),

  // Cookies
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  cookieSecure: toBool(process.env.COOKIE_SECURE, isProduction),
  cookieSameSite: (process.env.COOKIE_SAME_SITE || "lax").toLowerCase(),
  accessCookieName: "gv_at",
  refreshCookieName: "gv_rt",
  csrfCookieName: "gv_csrf",

  // Argon2id parameters (OWASP-recommended baseline)
  argon2MemoryCost: toInt(process.env.ARGON2_MEMORY_COST, isTest ? 8192 : 19456),
  argon2TimeCost: toInt(process.env.ARGON2_TIME_COST, 2),
  argon2Parallelism: toInt(process.env.ARGON2_PARALLELISM, 1),

  // Email
  emailProvider: (process.env.EMAIL_PROVIDER || "console").toLowerCase(), // console | smtp | none
  emailFrom: process.env.EMAIL_FROM || "GrowthVerse <no-reply@growthverse.local>",
  smtp: {
    host: process.env.SMTP_HOST,
    port: toInt(process.env.SMTP_PORT, 587),
    secure: toBool(process.env.SMTP_SECURE, false),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  // Initial administrator provisioning
  allowSuperAdminProvision: toBool(process.env.ALLOW_SUPER_ADMIN_PROVISION, false),
  superAdminForce: toBool(process.env.SUPER_ADMIN_FORCE, false),

  trustProxy: toBool(process.env.TRUST_PROXY, false),
  logLevel: process.env.LOG_LEVEL || (isTest ? "silent" : isProduction ? "info" : "debug"),
};

// Hard failures in production. In development we warn and continue.
const productionErrors = [];
if (!config.databaseUrl) productionErrors.push("DATABASE_URL is required");
if (!process.env.ACCESS_TOKEN_SECRET) productionErrors.push("ACCESS_TOKEN_SECRET is required");
if (process.env.ACCESS_TOKEN_SECRET && process.env.ACCESS_TOKEN_SECRET.length < 32) productionErrors.push("ACCESS_TOKEN_SECRET must be at least 32 characters");
if (!["lax", "strict", "none"].includes(config.cookieSameSite)) productionErrors.push("COOKIE_SAME_SITE must be lax, strict or none");
if (config.cookieSameSite === "none" && !config.cookieSecure) productionErrors.push("COOKIE_SAME_SITE=none requires COOKIE_SECURE=true");
if (config.isProduction && config.emailProvider === "console") {
  console.warn("⚠️  EMAIL_PROVIDER=console in production: emails are NOT delivered.");
}

if (isProduction && productionErrors.length > 0) {
  throw new Error(`Invalid production configuration:\n- ${productionErrors.join("\n- ")}`);
}

if (!process.env.ACCESS_TOKEN_SECRET) {
  console.warn("⚠️  ACCESS_TOKEN_SECRET is not set. Using an ephemeral development secret; sessions will not survive a restart.");
}

export default config;
