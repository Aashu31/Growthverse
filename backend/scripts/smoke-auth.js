#!/usr/bin/env node
/**
 * End-to-end authentication / authorization smoke test against a running backend.
 *
 * Usage:
 *   1. Start PostgreSQL and the backend in development mode.
 *   2. npm run smoke:auth
 *
 * This script uses the development database (DATABASE_URL) and cleans up the
 * records it creates. It never prints passwords or token values.
 */

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import crypto from "node:crypto";
import prisma from "../src/lib/prisma.js";
import { hashPassword } from "../src/lib/password.js";

const BASE_URL = process.env.SMOKE_BASE_URL || "http://127.0.0.1:5000";
const ORIGIN = process.env.SMOKE_ORIGIN || "http://localhost:3000";
const RUN_ID = `${Date.now().toString(36)}${crypto.randomBytes(3).toString("hex")}`;
const PASSWORD = "SmokeTest!2345";
const NEW_PASSWORD = "SmokeTest!6789";
const CUSTOMER_EMAIL = `smoke.customer.${RUN_ID}@example.com`;
const OTHER_CUSTOMER_EMAIL = `smoke.other.${RUN_ID}@example.com`;
const ADMIN_EMAIL = `smoke.admin.${RUN_ID}@example.com`;
const STAFF_EMAIL = `smoke.staff.${RUN_ID}@example.com`;
const SUPER_EMAIL = `smoke.super.${RUN_ID}@example.com`;
const SERVICE_SLUG = `smoke-service-${RUN_ID}`;
const SETTINGS_KEY = `smokeKey${RUN_ID}`;
const ORDER_A = `SMOKE-${RUN_ID}-A`;
const ORDER_B = `SMOKE-${RUN_ID}-B`;

const results = [];
let failures = 0;

function check(label, condition, detail = "") {
  if (condition) {
    results.push({ ok: true, label });
    console.log(`  PASS  ${label}`);
  } else {
    failures += 1;
    results.push({ ok: false, label, detail });
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

function section(title) {
  console.log(`\n${title}`);
}

class CookieJar {
  constructor() {
    this.cookies = new Map();
  }

  store(headers) {
    const list = typeof headers.getSetCookie === "function" ? headers.getSetCookie() : [];
    for (const raw of list) {
      const [pair, ...attributes] = raw.split(";");
      const separator = pair.indexOf("=");
      if (separator < 0) continue;
      const name = pair.slice(0, separator).trim();
      const value = pair.slice(separator + 1).trim();
      const expired = attributes.some((attribute) => /^\s*max-age\s*=\s*0\s*$/i.test(attribute));
      if (!value || expired) this.cookies.delete(name);
      else this.cookies.set(name, value);
    }
  }

  get(name) {
    return this.cookies.get(name);
  }

  set(name, value) {
    this.cookies.set(name, value);
  }

  header() {
    return [...this.cookies.entries()].map(([name, value]) => `${name}=${value}`).join("; ");
  }
}

class Client {
  constructor(label) {
    this.label = label;
    this.jar = new CookieJar();
  }

  async request(route, options = {}) {
    const method = (options.method || "GET").toUpperCase();
    const safe = method === "GET" || method === "HEAD" || method === "OPTIONS";
    const headers = { Origin: options.origin === undefined ? ORIGIN : options.origin };

    if (options.body !== undefined) headers["Content-Type"] = "application/json";
    if (!safe && options.csrf !== false) {
      const csrfToken = this.jar.get("gv_csrf");
      if (csrfToken) headers["X-CSRF-Token"] = csrfToken;
    }
    if (options.cookie !== false && this.jar.header()) headers.Cookie = this.jar.header();
    Object.assign(headers, options.headers || {});

    const response = await fetch(`${BASE_URL}${route}`, {
      method,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      redirect: "manual",
    });

    this.jar.store(response.headers);

    const text = await response.text();
    let body = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }

    return { status: response.status, body, setCookie: response.headers.getSetCookie?.() || [] };
  }
}

function extractToken(url, expectedPath) {
  try {
    const parsed = new URL(url);
    if (!parsed.pathname.endsWith(expectedPath)) return null;
    return parsed.searchParams.get("token");
  } catch {
    return null;
  }
}

async function runProvisioningScript(extraEnv) {
  const scriptPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "provision-super-admin.js");
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [scriptPath], {
      cwd: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
      env: { ...process.env, ...extraEnv },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

async function main() {
  const health = await fetch(`${BASE_URL}/api/health`);
  const healthBody = await health.json().catch(() => null);
  if (!health.ok || healthBody?.database !== "connected") {
    throw new Error(`Backend is not ready at ${BASE_URL}. Start it with "npm run dev" first.`);
  }

  // ---------------------------------------------------------------- anonymous
  section("Anonymous access and public reads");
  const anon = new Client("anonymous");

  check("GET /api/health returns 200", health.status === 200, String(health.status));

  for (const route of ["/api/services", "/api/pricing", "/api/features", "/api/portfolio", "/api/settings"]) {
    const response = await anon.request(route);
    check(`public GET ${route} returns 200`, response.status === 200, `status ${response.status}`);
  }

  const privateRoutes = [
    ["GET", "/api/auth/me"],
    ["GET", "/api/auth/sessions"],
    ["GET", "/api/dashboard/overview"],
    ["GET", "/api/customers"],
    ["GET", "/api/contacts"],
    ["GET", "/api/orders"],
    ["GET", "/api/admin/users"],
    ["POST", "/api/services"],
  ];
  for (const [method, route] of privateRoutes) {
    const response = await anon.request(route, {
      method,
      body: method === "POST" ? { title: "x" } : undefined,
    });
    check(`unauthenticated ${method} ${route} returns 401`, response.status === 401, `status ${response.status}`);
  }

  const csrfBootstrap = await anon.request("/api/auth/csrf");
  check("GET /api/auth/csrf returns a CSRF token", csrfBootstrap.status === 200 && Boolean(anon.jar.get("gv_csrf")));

  // ---------------------------------------------------------------- register
  section("Registration and email verification");

  const invalidEmail = await anon.request("/api/auth/register", {
    method: "POST",
    body: { name: "Bad Email", email: "not-an-email", password: PASSWORD },
  });
  check("registration rejects invalid email with 400", invalidEmail.status === 400, `status ${invalidEmail.status}`);

  const weakPassword = await anon.request("/api/auth/register", {
    method: "POST",
    body: { name: "Weak Password", email: `smoke.weak.${RUN_ID}@example.com`, password: "password" },
  });
  check("registration rejects weak password with 400", weakPassword.status === 400, `status ${weakPassword.status}`);

  const roleEscalation = await anon.request("/api/auth/register", {
    method: "POST",
    body: { name: "Role Escalation", email: `smoke.role.${RUN_ID}@example.com`, password: PASSWORD, role: "SUPER_ADMIN" },
  });
  check(
    "public registration refuses non-CUSTOMER role",
    roleEscalation.status === 400,
    `status ${roleEscalation.status}`
  );

  const registration = await anon.request("/api/auth/register", {
    method: "POST",
    body: { name: "Smoke Customer", email: CUSTOMER_EMAIL, password: PASSWORD },
  });
  check("valid registration returns 201", registration.status === 201, `status ${registration.status}`);
  check(
    "registration forces CUSTOMER role",
    registration.body?.data?.user?.role === "CUSTOMER",
    String(registration.body?.data?.user?.role)
  );
  check("registration does not issue an access cookie", !anon.jar.get("gv_at"));

  const verifyToken = extractToken(registration.body?.devVerificationUrl, "/verify-email");
  if (!verifyToken) {
    check("registration exposes a development verification link", false, "missing devVerificationUrl");
  } else {
    check("registration exposes a development verification link", true);
    const verify = await anon.request("/api/auth/verify-email", { method: "POST", body: { token: verifyToken } });
    check("verification token is accepted", verify.status === 200, `status ${verify.status}`);
    const verifyReplay = await anon.request("/api/auth/verify-email", { method: "POST", body: { token: verifyToken } });
    check("verification token cannot be reused", verifyReplay.status === 400, `status ${verifyReplay.status}`);
  }

  // ---------------------------------------------------------------- login
  section("Login, cookies and CSRF");

  const wrongPassword = await anon.request("/api/auth/login", {
    method: "POST",
    body: { email: CUSTOMER_EMAIL, password: "WrongPassword!2345" },
  });
  check("login with wrong password returns 401", wrongPassword.status === 401, `status ${wrongPassword.status}`);
  check(
    "login failure does not reveal whether the account exists",
    wrongPassword.body?.message === "Invalid email or password",
    String(wrongPassword.body?.message)
  );

  const evilOrigin = await anon.request("/api/auth/login", {
    method: "POST",
    origin: "http://evil.example",
    body: { email: CUSTOMER_EMAIL, password: PASSWORD },
  });
  check("mutation from an untrusted origin is rejected", evilOrigin.status === 403, `status ${evilOrigin.status}`);

  const customer = new Client("customer");
  const login = await customer.request("/api/auth/login", {
    method: "POST",
    body: { email: CUSTOMER_EMAIL, password: PASSWORD },
  });
  check("valid login returns 200", login.status === 200, `status ${login.status}`);
  check("login sets access, refresh and CSRF cookies", Boolean(customer.jar.get("gv_at") && customer.jar.get("gv_rt") && customer.jar.get("gv_csrf")));

  const accessCookie = login.setCookie.find((value) => value.startsWith("gv_at=")) || "";
  const refreshCookie = login.setCookie.find((value) => value.startsWith("gv_rt=")) || "";
  const csrfCookie = login.setCookie.find((value) => value.startsWith("gv_csrf=")) || "";
  check("access cookie is HttpOnly and scoped to /api", /HttpOnly/i.test(accessCookie) && /Path=\/api(;|$)/i.test(accessCookie), accessCookie.split(";").slice(1).join(";"));
  check("refresh cookie is HttpOnly and scoped to /api/auth", /HttpOnly/i.test(refreshCookie) && /Path=\/api\/auth(;|$)/i.test(refreshCookie), refreshCookie.split(";").slice(1).join(";"));
  check("CSRF cookie is readable by the SPA", !/HttpOnly/i.test(csrfCookie), csrfCookie.split(";").slice(1).join(";"));

  const me = await customer.request("/api/auth/me");
  check("GET /api/auth/me returns the signed-in customer", me.status === 200 && me.body?.data?.user?.email === CUSTOMER_EMAIL);
  check("verified email is reflected in the profile", me.body?.data?.user?.emailVerified === true);

  const csrfMissing = await customer.request("/api/auth/logout", { method: "POST", csrf: false });
  check("state-changing request without CSRF header is rejected", csrfMissing.status === 403, `status ${csrfMissing.status}`);
  check("CSRF rejection uses the expected error code", csrfMissing.body?.code === "CSRF_FAILED", String(csrfMissing.body?.code));

  const logout = await customer.request("/api/auth/logout", { method: "POST" });
  check("logout succeeds with a valid CSRF token", logout.status === 200, `status ${logout.status}`);
  check("logout clears authentication cookies", !customer.jar.get("gv_at") && !customer.jar.get("gv_rt"));

  const afterLogout = await customer.request("/api/auth/me");
  check("access token is rejected after logout", afterLogout.status === 401, `status ${afterLogout.status}`);

  // ---------------------------------------------------------------- isolation
  section("Customer authorization and data isolation");

  const customerSession = new Client("customer");
  const relogin = await customerSession.request("/api/auth/login", {
    method: "POST",
    body: { email: CUSTOMER_EMAIL, password: PASSWORD },
  });
  check("customer can sign in again", relogin.status === 200, `status ${relogin.status}`);

  const customerRecord = await prisma.customer.findFirst({ where: { email: CUSTOMER_EMAIL } });
  if (!customerRecord) throw new Error("Expected the registered customer record to exist.");

  const otherCustomer = await prisma.customer.create({
    data: { name: "Other Smoke Customer", email: OTHER_CUSTOMER_EMAIL },
  });
  const orderA = await prisma.projectInquiry.create({
    data: {
      orderNumber: ORDER_A,
      customerId: customerRecord.id,
      customerName: customerRecord.name,
      email: CUSTOMER_EMAIL,
      projectTitle: "Smoke order for the signed-in customer",
      amount: 100,
      currency: "INR",
      status: "pending",
    },
  });
  const orderB = await prisma.projectInquiry.create({
    data: {
      orderNumber: ORDER_B,
      customerId: otherCustomer.id,
      customerName: otherCustomer.name,
      email: OTHER_CUSTOMER_EMAIL,
      projectTitle: "Smoke order for another customer",
      amount: 200,
      currency: "INR",
      status: "pending",
    },
  });

  const deniedCustomers = await customerSession.request("/api/customers");
  check("customer cannot read the customer directory", deniedCustomers.status === 403, `status ${deniedCustomers.status}`);

  const deniedDashboard = await customerSession.request("/api/dashboard/overview");
  check("customer cannot read dashboard analytics", deniedDashboard.status === 403, `status ${deniedDashboard.status}`);

  const deniedCreateService = await customerSession.request("/api/services", {
    method: "POST",
    body: { title: "Nope", slug: `nope-${RUN_ID}` },
  });
  check("customer cannot create content", deniedCreateService.status === 403, `status ${deniedCreateService.status}`);

  const ownOrders = await customerSession.request("/api/orders");
  check(
    "customer sees only their own order",
    ownOrders.status === 200 && ownOrders.body?.data?.orders?.length === 1 && ownOrders.body?.data?.orders?.[0]?.id === orderA.id,
    JSON.stringify(ownOrders.body?.data?.orders?.map((order) => order.orderNumber))
  );

  const otherOrder = await customerSession.request(`/api/orders/${orderB.id}`);
  check("customer cannot read another customer's order", otherOrder.status === 404, `status ${otherOrder.status}`);

  // ---------------------------------------------------------------- refresh
  section("Refresh token rotation and replay detection");

  const oldRefreshToken = customerSession.jar.get("gv_rt");
  const refreshed = await customerSession.request("/api/auth/refresh", { method: "POST" });
  const newRefreshToken = customerSession.jar.get("gv_rt");
  check("refresh returns 200", refreshed.status === 200, `status ${refreshed.status}`);
  check("refresh rotates the refresh token", Boolean(oldRefreshToken && newRefreshToken && oldRefreshToken !== newRefreshToken));

  const meAfterRefresh = await customerSession.request("/api/auth/me");
  check("rotated session can access protected data", meAfterRefresh.status === 200, `status ${meAfterRefresh.status}`);

  customerSession.jar.set("gv_rt", oldRefreshToken);
  const replay = await customerSession.request("/api/auth/refresh", { method: "POST" });
  check("reused refresh token is rejected", replay.status === 401, `status ${replay.status}`);
  check("reused refresh token revokes the family", replay.body?.code === "REFRESH_TOKEN_REUSE", String(replay.body?.code));

  const afterReplay = await customerSession.request("/api/auth/me");
  check("all sessions are revoked after replay detection", afterReplay.status === 401, `status ${afterReplay.status}`);

  // ---------------------------------------------------------------- password reset
  section("Password reset");

  const forgot = await anon.request("/api/auth/forgot-password", { method: "POST", body: { email: CUSTOMER_EMAIL } });
  check("forgot-password returns 200", forgot.status === 200, `status ${forgot.status}`);
  const unknownForgot = await anon.request("/api/auth/forgot-password", {
    method: "POST",
    body: { email: `nobody.${RUN_ID}@example.com` },
  });
  check(
    "forgot-password does not disclose unknown accounts",
    unknownForgot.status === 200 && unknownForgot.body?.message === forgot.body?.message
  );

  const resetToken = extractToken(forgot.body?.devResetUrl, "/reset-password");
  if (!resetToken) {
    check("forgot-password exposes a development reset link", false, "missing devResetUrl");
  } else {
    check("forgot-password exposes a development reset link", true);
    const reset = await anon.request("/api/auth/reset-password", {
      method: "POST",
      body: { token: resetToken, newPassword: NEW_PASSWORD },
    });
    check("password reset succeeds", reset.status === 200, `status ${reset.status}`);

    const resetReplay = await anon.request("/api/auth/reset-password", {
      method: "POST",
      body: { token: resetToken, newPassword: NEW_PASSWORD },
    });
    check("reset token cannot be reused", resetReplay.status === 400, `status ${resetReplay.status}`);

    const oldLogin = await anon.request("/api/auth/login", {
      method: "POST",
      body: { email: CUSTOMER_EMAIL, password: PASSWORD },
    });
    check("old password no longer works", oldLogin.status === 401, `status ${oldLogin.status}`);
  }

  const resetSession = new Client("customer-after-reset");
  const newLogin = await resetSession.request("/api/auth/login", {
    method: "POST",
    body: { email: CUSTOMER_EMAIL, password: NEW_PASSWORD },
  });
  check("new password works", newLogin.status === 200, `status ${newLogin.status}`);

  // ---------------------------------------------------------------- sessions
  section("Session management");

  const secondSession = new Client("customer-second-device");
  const secondLogin = await secondSession.request("/api/auth/login", {
    method: "POST",
    body: { email: CUSTOMER_EMAIL, password: NEW_PASSWORD },
  });
  check("second device can sign in", secondLogin.status === 200, `status ${secondLogin.status}`);

  const sessions = await resetSession.request("/api/auth/sessions");
  check(
    "session list contains two active sessions",
    sessions.status === 200 && sessions.body?.data?.sessions?.length === 2,
    String(sessions.body?.data?.sessions?.length)
  );
  check(
    "session list marks the current session",
    sessions.body?.data?.sessions?.filter((session) => session.current).length === 1
  );

  const otherSession = sessions.body?.data?.sessions?.find((session) => !session.current);
  if (otherSession) {
    const revoked = await resetSession.request(`/api/auth/sessions/${otherSession.id}`, { method: "DELETE" });
    check("a specific session can be revoked", revoked.status === 200, `status ${revoked.status}`);
    const secondMe = await secondSession.request("/api/auth/me");
    check("revoked device loses access", secondMe.status === 401, `status ${secondMe.status}`);
  } else {
    check("a specific session can be revoked", false, "no secondary session found");
  }

  const logoutAll = await resetSession.request("/api/auth/logout-all", { method: "POST" });
  check("logout-all succeeds", logoutAll.status === 200, `status ${logoutAll.status}`);
  const afterLogoutAll = await resetSession.request("/api/auth/me");
  check("logout-all invalidates the current session", afterLogoutAll.status === 401, `status ${afterLogoutAll.status}`);

  // ---------------------------------------------------------------- provisioning
  section("SUPER_ADMIN provisioning");

  const refused = await runProvisioningScript({
    ALLOW_SUPER_ADMIN_PROVISION: "false",
    SUPER_ADMIN_EMAIL: SUPER_EMAIL,
    SUPER_ADMIN_NAME: "Smoke Super",
    SUPER_ADMIN_PASSWORD: PASSWORD,
    SUPER_ADMIN_FORCE: "true",
  });
  check(
    "provisioning refuses to run without the explicit flag",
    refused.code !== 0 && /ALLOW_SUPER_ADMIN_PROVISION/.test(refused.stderr),
    `exit ${refused.code}`
  );

  const provisioned = await runProvisioningScript({
    ALLOW_SUPER_ADMIN_PROVISION: "true",
    SUPER_ADMIN_EMAIL: SUPER_EMAIL,
    SUPER_ADMIN_NAME: "Smoke Super",
    SUPER_ADMIN_PASSWORD: PASSWORD,
    SUPER_ADMIN_FORCE: "true",
  });
  check("provisioning succeeds with the flag and credentials", provisioned.code === 0, provisioned.stderr.trim());
  check("provisioning never prints the password", !provisioned.stdout.includes(PASSWORD) && !provisioned.stderr.includes(PASSWORD));

  // ---------------------------------------------------------------- RBAC
  section("Role-based authorization (SUPER_ADMIN / ADMIN / STAFF)");

  const adminPasswordHash = await hashPassword(PASSWORD);
  await prisma.user.create({
    data: { name: "Smoke Admin", email: ADMIN_EMAIL, passwordHash: adminPasswordHash, role: "ADMIN", emailVerified: true },
  });
  await prisma.user.create({
    data: { name: "Smoke Staff", email: STAFF_EMAIL, passwordHash: adminPasswordHash, role: "STAFF", emailVerified: true },
  });

  const superClient = new Client("super-admin");
  const superLogin = await superClient.request("/api/auth/login", {
    method: "POST",
    body: { email: SUPER_EMAIL, password: PASSWORD },
  });
  check("provisioned SUPER_ADMIN can sign in", superLogin.status === 200, `status ${superLogin.status}`);

  const adminClient = new Client("admin");
  const adminLogin = await adminClient.request("/api/auth/login", {
    method: "POST",
    body: { email: ADMIN_EMAIL, password: PASSWORD },
  });
  check("ADMIN can sign in", adminLogin.status === 200, `status ${adminLogin.status}`);

  const staffClient = new Client("staff");
  const staffLogin = await staffClient.request("/api/auth/login", {
    method: "POST",
    body: { email: STAFF_EMAIL, password: PASSWORD },
  });
  check("STAFF can sign in", staffLogin.status === 200, `status ${staffLogin.status}`);

  const superUsers = await superClient.request("/api/admin/users");
  check("SUPER_ADMIN can list users", superUsers.status === 200 && Array.isArray(superUsers.body?.data?.users));

  const superRoles = await superClient.request("/api/admin/roles");
  check(
    "SUPER_ADMIN sees the permission matrix",
    superRoles.status === 200 && superRoles.body?.data?.roles?.length === 4
  );

  const adminUsers = await adminClient.request("/api/admin/users");
  check("ADMIN cannot list users", adminUsers.status === 403, `status ${adminUsers.status}`);

  const staffUsers = await staffClient.request("/api/admin/users");
  check("STAFF cannot list users", staffUsers.status === 403, `status ${staffUsers.status}`);

  const adminDashboard = await adminClient.request("/api/dashboard/overview");
  check("ADMIN can view the dashboard", adminDashboard.status === 200, `status ${adminDashboard.status}`);

  const staffDashboard = await staffClient.request("/api/dashboard/overview");
  check("STAFF can view the dashboard", staffDashboard.status === 200, `status ${staffDashboard.status}`);

  const adminCustomers = await adminClient.request("/api/customers");
  check("ADMIN can view customers", adminCustomers.status === 200, `status ${adminCustomers.status}`);

  const staffCustomers = await staffClient.request("/api/customers");
  check("STAFF can view customers", staffCustomers.status === 200, `status ${staffCustomers.status}`);

  const staffServiceCreate = await staffClient.request("/api/services", {
    method: "POST",
    body: { title: "Staff should not create", slug: `staff-denied-${RUN_ID}` },
  });
  check("STAFF cannot manage content", staffServiceCreate.status === 403, `status ${staffServiceCreate.status}`);

  const staffSettings = await staffClient.request("/api/settings", {
    method: "PUT",
    body: { settings: { [SETTINGS_KEY]: "denied" } },
  });
  check("STAFF cannot manage settings", staffSettings.status === 403, `status ${staffSettings.status}`);

  const adminSettings = await adminClient.request("/api/settings", {
    method: "PUT",
    body: { settings: { [SETTINGS_KEY]: "denied" } },
  });
  check("ADMIN cannot manage settings", adminSettings.status === 403, `status ${adminSettings.status}`);

  const noCsrfService = await superClient.request("/api/services", {
    method: "POST",
    csrf: false,
    body: { title: "No CSRF", slug: `no-csrf-${RUN_ID}` },
  });
  check("staff mutation without CSRF is rejected", noCsrfService.status === 403 && noCsrfService.body?.code === "CSRF_FAILED");

  const serviceCreate = await superClient.request("/api/services", {
    method: "POST",
    body: {
      title: "Smoke Test Service",
      slug: SERVICE_SLUG,
      description: "Created by the automated smoke test.",
      shortDescription: "Smoke test service",
      category: "Testing",
    },
  });
  check("SUPER_ADMIN can create content", serviceCreate.status === 201, `status ${serviceCreate.status}`);
  const createdServiceId = serviceCreate.body?.data?.service?.id;

  if (createdServiceId) {
    const serviceUpdate = await superClient.request(`/api/services/${createdServiceId}`, {
      method: "PUT",
      body: { shortDescription: "Updated by smoke test" },
    });
    check("SUPER_ADMIN can update content", serviceUpdate.status === 200, `status ${serviceUpdate.status}`);

    const serviceDelete = await superClient.request(`/api/services/${createdServiceId}`, { method: "DELETE" });
    check("SUPER_ADMIN can delete content", serviceDelete.status === 200, `status ${serviceDelete.status}`);
  }

  const settingsUpdate = await superClient.request("/api/settings", {
    method: "PUT",
    body: { settings: { [SETTINGS_KEY]: "smoke-value" } },
  });
  check("SUPER_ADMIN can update settings", settingsUpdate.status === 200, `status ${settingsUpdate.status}`);

  const settingsPublic = await anon.request(`/api/settings?key=${encodeURIComponent(SETTINGS_KEY)}`);
  check(
    "non-sensitive settings are publicly readable",
    settingsPublic.status === 200 && settingsPublic.body?.data?.value === "smoke-value",
    JSON.stringify(settingsPublic.body)
  );

  const staffOrders = await staffClient.request("/api/orders");
  check(
    "STAFF can read all orders",
    staffOrders.status === 200 && staffOrders.body?.data?.total >= 2,
    String(staffOrders.body?.data?.total)
  );

  const staffOrder = await staffClient.request(`/api/orders/${orderB.id}`);
  check("STAFF can read a specific order", staffOrder.status === 200, `status ${staffOrder.status}`);

  // ---------------------------------------------------------------- contacts
  section("Public enquiry submission and staff inbox");

  const enquiryEmail = `smoke.enquiry.${RUN_ID}@example.com`;
  const enquiry = await anon.request("/api/contacts", {
    method: "POST",
    body: {
      name: "Smoke Enquirer",
      email: enquiryEmail,
      message: "This is an automated smoke-test enquiry with enough characters.",
      subject: "Smoke test",
    },
  });
  check("public contact form submission succeeds", enquiry.status === 201, `status ${enquiry.status}`);

  const contactsList = await staffClient.request("/api/contacts");
  check(
    "STAFF can read the contact inbox",
    contactsList.status === 200 && contactsList.body?.data?.enquiries?.some((contact) => contact.email === enquiryEmail),
    JSON.stringify(contactsList.body?.data?.enquiries?.length)
  );

  // ---------------------------------------------------------------- cleanup
  section("Cleanup");

  await prisma.siteSetting.deleteMany({ where: { key: SETTINGS_KEY } });
  await prisma.contact.deleteMany({ where: { email: enquiryEmail } });
  await prisma.projectInquiry.deleteMany({ where: { orderNumber: { in: [ORDER_A, ORDER_B] } } });
  await prisma.service.deleteMany({ where: { slug: SERVICE_SLUG } });
  await prisma.customer.deleteMany({ where: { email: { in: [CUSTOMER_EMAIL, OTHER_CUSTOMER_EMAIL] } } });
  await prisma.user.deleteMany({
    where: { email: { in: [CUSTOMER_EMAIL, ADMIN_EMAIL, STAFF_EMAIL, SUPER_EMAIL] } },
  });
  check("smoke-test records cleaned up", true);

  console.log(`\n${results.length - failures}/${results.length} checks passed.`);
  if (failures > 0) {
    console.error(`\n${failures} smoke-test check(s) failed.`);
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error("\nSmoke test aborted:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
