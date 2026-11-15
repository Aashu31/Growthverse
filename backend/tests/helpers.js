import { buildApp } from "../src/app.js";
import prisma from "../src/lib/prisma.js";
import { hashPassword } from "../src/lib/password.js";

export async function createTestApp(options = {}) {
  return buildApp({
    logger: false,
    authLimits: {
      login: { max: 1000, timeWindow: "15 minutes" },
      auth: { max: 1000, timeWindow: "15 minutes" },
      ...(options.authLimits || {}),
    },
    ...options,
  });
}

export async function resetDatabase() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      refresh_sessions,
      password_reset_tokens,
      email_verification_tokens,
      project_inquiries,
      customers,
      users,
      contacts,
      services,
      pricing_plans,
      features,
      portfolio_projects,
      site_settings
    RESTART IDENTITY CASCADE
  `);
}

export async function createUser({
  name = "Test User",
  email = `user-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
  password = "StrongPass123",
  role = "CUSTOMER",
  status = "ACTIVE",
  emailVerified = false,
} = {}) {
  return prisma.user.create({
    data: { name, email, passwordHash: await hashPassword(password), role, status, emailVerified },
  });
}

export async function createCustomerFor(user, overrides = {}) {
  return prisma.customer.create({
    data: {
      userId: user.id,
      name: user.name || "Customer",
      email: user.email,
      ...overrides,
    },
  });
}

export class ApiClient {
  constructor(app, { origin = "http://localhost:3000" } = {}) {
    this.app = app;
    this.origin = origin;
    this.cookies = {};
  }

  get csrfToken() {
    return this.cookies.gv_csrf || null;
  }

  async request(method, url, { body, headers = {}, cookies = true, csrf = true, origin } = {}) {
    const finalHeaders = { ...headers };
    if (body !== undefined) finalHeaders["content-type"] = "application/json";
    if (csrf && this.csrfToken) finalHeaders["x-csrf-token"] = this.csrfToken;
    if (origin !== null) finalHeaders.origin = origin || this.origin;

    const response = await this.app.inject({
      method,
      url,
      payload: body,
      headers: finalHeaders,
      cookies: cookies ? { ...this.cookies } : undefined,
    });

    for (const cookie of response.cookies || []) {
      if (!cookie.value || (cookie.expires && new Date(cookie.expires).getTime() < Date.now())) {
        delete this.cookies[cookie.name];
      } else {
        this.cookies[cookie.name] = cookie.value;
      }
    }

    let json = null;
    try {
      json = response.json();
    } catch {
      json = null;
    }

    return { status: response.statusCode, body: json, raw: response, cookies: response.cookies || [] };
  }

  get(url, options) {
    return this.request("GET", url, options);
  }

  post(url, body, options = {}) {
    return this.request("POST", url, { ...options, body });
  }

  put(url, body, options = {}) {
    return this.request("PUT", url, { ...options, body });
  }

  patch(url, body, options = {}) {
    return this.request("PATCH", url, { ...options, body });
  }

  delete(url, options) {
    return this.request("DELETE", url, options);
  }

  async register(payload, options = {}) {
    return this.post("/api/auth/register", payload, options);
  }

  async login(email, password, options = {}) {
    return this.post("/api/auth/login", { email, password }, options);
  }
}

export function extractTokenFromUrl(url) {
  const parsed = new URL(url);
  return parsed.searchParams.get("token");
}

export async function loginAs(app, user, password = "StrongPass123") {
  const client = new ApiClient(app);
  const response = await client.login(user.email, password);
  if (response.status !== 200) {
    throw new Error(`Login failed for ${user.email}: ${response.status} ${JSON.stringify(response.body)}`);
  }
  return { client, response };
}
