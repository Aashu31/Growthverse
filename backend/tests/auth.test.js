import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import prisma from "../src/lib/prisma.js";
import { hashPassword, validatePassword } from "../src/lib/password.js";
import { hashToken } from "../src/lib/tokens.js";
import {
  ApiClient,
  createTestApp,
  createUser,
  extractTokenFromUrl,
  loginAs,
  resetDatabase,
} from "./helpers.js";

let app;

beforeAll(async () => {
  app = await createTestApp();
});

afterAll(async () => {
  await app.close();
  await prisma.$disconnect();
});

beforeEach(async () => {
  await resetDatabase();
});

const baseUser = {
  name: "Ada Customer",
  email: "ada@example.com",
  password: "StrongPass123",
};

describe("Registration", () => {
  it("registers a valid customer with an Argon2id hash", async () => {
    const client = new ApiClient(app);
    const res = await client.register(baseUser);

    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe("CUSTOMER");
    expect(res.body.data.user).not.toHaveProperty("passwordHash");
    expect(res.body.data.user.emailVerified).toBe(false);
    expect(res.body.devVerificationUrl).toContain("/verify-email?token=");

    const stored = await prisma.user.findUnique({ where: { email: baseUser.email } });
    expect(stored).toBeTruthy();
    expect(stored.passwordHash).not.toBe(baseUser.password);
    expect(stored.passwordHash.startsWith("$argon2id$")).toBe(true);
    expect(await prisma.customer.findFirst({ where: { userId: stored.id } })).toBeTruthy();
  });

  it("rejects duplicate email", async () => {
    const client = new ApiClient(app);
    await client.register(baseUser);
    const res = await client.register(baseUser);
    expect(res.status).toBe(409);
    expect(res.body.code).toBe("EMAIL_IN_USE");
  });

  it("does not attach a pre-existing customer record until the email is verified", async () => {
    const existingCustomer = await prisma.customer.create({
      data: { name: "Pre-existing Customer", email: baseUser.email },
    });
    const client = new ApiClient(app);

    const registered = await client.register(baseUser);
    expect(registered.status).toBe(201);

    const afterRegister = await prisma.customer.findUnique({ where: { id: existingCustomer.id } });
    expect(afterRegister.userId).toBeNull();
    expect(afterRegister.name).toBe("Pre-existing Customer");

    const token = extractTokenFromUrl(registered.body.devVerificationUrl);
    const verified = await client.post("/api/auth/verify-email", { token });
    expect(verified.status).toBe(200);

    const afterVerify = await prisma.customer.findUnique({ where: { id: existingCustomer.id } });
    expect(afterVerify.userId).toBeTruthy();
    expect(afterVerify.name).toBe("Pre-existing Customer");
  });

  it("rejects invalid email, weak password and missing fields", async () => {
    const client = new ApiClient(app);
    const invalidEmail = await client.register({ ...baseUser, email: "not-an-email" });
    expect(invalidEmail.status).toBe(400);

    const weak = await client.register({ ...baseUser, email: "weak@example.com", password: "password" });
    expect(weak.status).toBe(400);

    const missing = await client.post("/api/auth/register", { email: "missing@example.com" });
    expect(missing.status).toBe(400);
  });

  it("rejects attempted ADMIN and SUPER_ADMIN registration without creating privileged users", async () => {
    const client = new ApiClient(app);
    const admin = await client.register({ ...baseUser, email: "admin@example.com", role: "ADMIN" });
    const superAdmin = await client.register({ ...baseUser, email: "super@example.com", role: "SUPER_ADMIN" });

    expect(admin.status).toBe(400);
    expect(superAdmin.status).toBe(400);
    expect(await prisma.user.count({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } } })).toBe(0);
  });

  it("enforces the password policy", () => {
    expect(validatePassword("StrongPass123")).toEqual([]);
    expect(validatePassword("short")).not.toEqual([]);
    expect(validatePassword("alllowercase1")).not.toEqual([]);
    expect(validatePassword("ALLUPPERCASE1")).not.toEqual([]);
    expect(validatePassword("NoNumbersHere")).not.toEqual([]);
    expect(validatePassword("Password123")).not.toEqual([]);
  });
});

describe("Login", () => {
  it("logs in and issues HttpOnly access and refresh cookies", async () => {
    await createUser(baseUser);
    const client = new ApiClient(app);
    const res = await client.login(baseUser.email, baseUser.password);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(baseUser.email);
    expect(res.body.data.user).not.toHaveProperty("passwordHash");

    const names = res.cookies.map((cookie) => cookie.name);
    expect(names).toContain("gv_at");
    expect(names).toContain("gv_rt");
    expect(names).toContain("gv_csrf");

    const access = res.cookies.find((cookie) => cookie.name === "gv_at");
    const refresh = res.cookies.find((cookie) => cookie.name === "gv_rt");
    expect(access.httpOnly).toBe(true);
    expect(refresh.httpOnly).toBe(true);
    expect(access.path).toBe("/api");
    expect(refresh.path).toBe("/api/auth");

    const stored = await prisma.user.findUnique({ where: { email: baseUser.email } });
    expect(stored.lastLoginAt).toBeTruthy();
  });

  it("returns generic errors for wrong password and unknown email", async () => {
    await createUser(baseUser);
    const client = new ApiClient(app);
    const wrong = await client.login(baseUser.email, "WrongPass123");
    const unknown = await client.login("nobody@example.com", "WrongPass123");

    expect(wrong.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect(wrong.body.message).toBe("Invalid email or password");
    expect(unknown.body.message).toBe("Invalid email or password");
  });

  it("blocks disabled accounts", async () => {
    await createUser({ ...baseUser, status: "SUSPENDED" });
    const client = new ApiClient(app);
    const res = await client.login(baseUser.email, baseUser.password);
    expect(res.status).toBe(403);
  });

  it("rate limits repeated login attempts", async () => {
    await createUser(baseUser);
    const limitedApp = await createTestApp({
      authLimits: {
        login: { max: 3, timeWindow: "1 minute" },
        auth: { max: 1000, timeWindow: "15 minutes" },
      },
    });
    try {
      const client = new ApiClient(limitedApp);
      const statuses = [];
      for (let i = 0; i < 4; i += 1) {
        const res = await client.login(baseUser.email, "WrongPass123");
        statuses.push(res.status);
      }
      expect(statuses.slice(0, 3)).toEqual([401, 401, 401]);
      expect(statuses[3]).toBe(429);
    } finally {
      await limitedApp.close();
    }
  });
});

describe("Sessions and tokens", () => {
  it("returns the current user and rejects missing auth", async () => {
    const user = await createUser(baseUser);
    const anonymous = new ApiClient(app);
    const noAuth = await anonymous.get("/api/auth/me");
    expect(noAuth.status).toBe(401);

    const { client } = await loginAs(app, user);
    const me = await client.get("/api/auth/me");
    expect(me.status).toBe(200);
    expect(me.body.data.user.id).toBe(user.id);
    expect(me.body.data.user).not.toHaveProperty("passwordHash");
  });

  it("rejects an expired access token", async () => {
    const user = await createUser(baseUser);
    const { client } = await loginAs(app, user);
    const session = await prisma.refreshSession.findFirst({ where: { userId: user.id } });
    client.cookies.gv_at = app.jwt.sign(
      { sub: user.id, role: user.role, sid: session.id, exp: Math.floor(Date.now() / 1000) - 60 },
      { expiresIn: undefined }
    );
    // CSRF cookie remains valid; the access token itself must fail.
    const me = await client.get("/api/auth/me");
    expect(me.status).toBe(401);
  });

  it("rotates refresh tokens and detects replay", async () => {
    const user = await createUser(baseUser);
    const { client } = await loginAs(app, user);
    const oldRefresh = client.cookies.gv_rt;
    const oldAccess = client.cookies.gv_at;

    const refreshed = await client.post("/api/auth/refresh", {});
    expect(refreshed.status).toBe(200);
    expect(client.cookies.gv_rt).not.toBe(oldRefresh);
    expect(client.cookies.gv_at).not.toBe(oldAccess);

    // Replay the old refresh token from a separate client.
    const replayClient = new ApiClient(app);
    replayClient.cookies = { gv_rt: oldRefresh, gv_csrf: client.cookies.gv_csrf };
    const replay = await replayClient.post("/api/auth/refresh", {});
    expect(replay.status).toBe(401);
    expect(replay.body.code).toBe("REFRESH_TOKEN_REUSE");

    // Replay detection revoked the rotated session as well.
    const me = await client.get("/api/auth/me");
    expect(me.status).toBe(401);
  });

  it("revokes the session on logout and refresh afterwards fails", async () => {
    const user = await createUser(baseUser);
    const { client } = await loginAs(app, user);
    const logout = await client.post("/api/auth/logout", {});
    expect(logout.status).toBe(200);

    const me = await client.get("/api/auth/me");
    expect(me.status).toBe(401);

    const refresh = await client.post("/api/auth/refresh", {});
    expect(refresh.status).toBe(401);
  });

  it("revokes all sessions with logout-all", async () => {
    const user = await createUser(baseUser);
    const { client: first } = await loginAs(app, user);
    const { client: second } = await loginAs(app, user);

    expect((await second.get("/api/auth/me")).status).toBe(200);
    const result = await first.post("/api/auth/logout-all", {});
    expect(result.status).toBe(200);

    expect((await first.get("/api/auth/me")).status).toBe(401);
    expect((await second.get("/api/auth/me")).status).toBe(401);
  });

  it("enforces CSRF on cookie-authenticated mutations", async () => {
    const user = await createUser(baseUser);
    const { client } = await loginAs(app, user);
    const withoutCsrf = await client.post("/api/auth/logout", {}, { csrf: false });
    expect(withoutCsrf.status).toBe(403);
    expect(withoutCsrf.body.code).toBe("CSRF_FAILED");
  });

  it("rejects a disallowed Origin on state-changing requests", async () => {
    const user = await createUser(baseUser);
    const { client } = await loginAs(app, user);
    const result = await client.post(
      "/api/auth/logout",
      {},
      { origin: "https://evil.example" }
    );
    expect(result.status).toBe(403);
  });
});

describe("Email verification", () => {
  it("verifies a single-use token and rejects replay", async () => {
    const client = new ApiClient(app);
    const registered = await client.register(baseUser);
    const token = extractTokenFromUrl(registered.body.devVerificationUrl);

    const verified = await client.post("/api/auth/verify-email", { token });
    expect(verified.status).toBe(200);

    const stored = await prisma.user.findUnique({ where: { email: baseUser.email } });
    expect(stored.emailVerified).toBe(true);
    expect(stored.emailVerifiedAt).toBeTruthy();

    const replay = await client.post("/api/auth/verify-email", { token });
    expect(replay.status).toBe(400);
  });

  it("invalidates the previous token on resend", async () => {
    const client = new ApiClient(app);
    const registered = await client.register(baseUser);
    const firstToken = extractTokenFromUrl(registered.body.devVerificationUrl);

    const resent = await client.post("/api/auth/resend-verification", { email: baseUser.email });
    expect(resent.status).toBe(200);
    const secondToken = extractTokenFromUrl(resent.body.devVerificationUrl);
    expect(secondToken).not.toBe(firstToken);

    expect((await client.post("/api/auth/verify-email", { token: firstToken })).status).toBe(400);
    expect((await client.post("/api/auth/verify-email", { token: secondToken })).status).toBe(200);
  });

  it("returns the same generic response for unknown emails on resend", async () => {
    const client = new ApiClient(app);
    const res = await client.post("/api/auth/resend-verification", { email: "ghost@example.com" });
    expect(res.status).toBe(200);
    expect(res.body.devVerificationUrl).toBeUndefined();
  });
});

describe("Password reset and change password", () => {
  it("returns a generic forgot-password response and supports reset", async () => {
    const user = await createUser(baseUser);
    const { client } = await loginAs(app, user);
    const anonymous = new ApiClient(app);

    const known = await anonymous.post("/api/auth/forgot-password", { email: baseUser.email });
    const unknown = await anonymous.post("/api/auth/forgot-password", { email: "ghost@example.com" });
    expect(known.status).toBe(200);
    expect(unknown.status).toBe(200);
    expect(known.body.message).toBe(unknown.body.message);
    expect(known.body.devResetUrl).toBeTruthy();
    expect(unknown.body.devResetUrl).toBeUndefined();

    const token = extractTokenFromUrl(known.body.devResetUrl);
    const reset = await anonymous.post("/api/auth/reset-password", { token, newPassword: "NewStrongPass456" });
    expect(reset.status).toBe(200);

    expect((await anonymous.login(baseUser.email, baseUser.password)).status).toBe(401);
    expect((await anonymous.login(baseUser.email, "NewStrongPass456")).status).toBe(200);

    // Existing sessions were revoked by the reset.
    expect((await client.get("/api/auth/me")).status).toBe(401);

    // Token single-use.
    expect((await anonymous.post("/api/auth/reset-password", { token, newPassword: "AnotherPass789" })).status).toBe(400);
  });

  it("rejects expired and unknown reset tokens", async () => {
    const user = await createUser(baseUser);
    const token = "expired-token-value-that-is-long-enough";
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() - 60_000),
      },
    });

    const client = new ApiClient(app);
    const expired = await client.post("/api/auth/reset-password", { token, newPassword: "NewStrongPass456" });
    expect(expired.status).toBe(400);

    const unknown = await client.post("/api/auth/reset-password", {
      token: "unknown-token-value-that-is-long-enough",
      newPassword: "NewStrongPass456",
    });
    expect(unknown.status).toBe(400);
  });

  it("changes password and revokes other sessions", async () => {
    const user = await createUser(baseUser);
    const { client: current } = await loginAs(app, user);
    const { client: other } = await loginAs(app, user);

    const change = await current.post("/api/auth/change-password", {
      currentPassword: baseUser.password,
      newPassword: "NewStrongPass456",
    });
    expect(change.status).toBe(200);

    expect((await current.get("/api/auth/me")).status).toBe(200);
    expect((await other.get("/api/auth/me")).status).toBe(401);

    const fresh = new ApiClient(app);
    expect((await fresh.login(baseUser.email, baseUser.password)).status).toBe(401);
    expect((await fresh.login(baseUser.email, "NewStrongPass456")).status).toBe(200);
  });

  it("rejects an incorrect current password and weak new passwords", async () => {
    const user = await createUser(baseUser);
    const { client } = await loginAs(app, user);

    const wrong = await client.post("/api/auth/change-password", {
      currentPassword: "WrongPass123",
      newPassword: "NewStrongPass456",
    });
    expect(wrong.status).toBe(400);

    const weak = await client.post("/api/auth/change-password", {
      currentPassword: baseUser.password,
      newPassword: "weak",
    });
    expect(weak.status).toBe(400);
  });
});
