import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import prisma from "../src/lib/prisma.js";
import {
  ApiClient,
  createCustomerFor,
  createTestApp,
  createUser,
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

const password = "StrongPass123";

async function staffLogin(role) {
  const user = await createUser({
    name: `${role} User`,
    email: `${role.toLowerCase()}-${Math.random().toString(36).slice(2)}@example.com`,
    role,
    password,
  });
  const { client } = await loginAs(app, user, password);
  return { user, client };
}

async function customerLogin(emailSuffix = "one") {
  const user = await createUser({
    name: `Customer ${emailSuffix}`,
    email: `customer-${emailSuffix}-${Math.random().toString(36).slice(2)}@example.com`,
    role: "CUSTOMER",
    password,
  });
  const customer = await createCustomerFor(user);
  const { client } = await loginAs(app, user, password);
  return { user, customer, client };
}

const servicePayload = (slug) => ({
  title: `Service ${slug}`,
  slug,
  description: "A test service",
  shortDescription: "Test",
  category: "Testing",
  features: ["One"],
  isActive: true,
  isPublished: true,
});

describe("Public vs protected endpoints", () => {
  it("allows public reads and enquiry submission", async () => {
    const client = new ApiClient(app);
    expect((await client.get("/api/services")).status).toBe(200);
    expect((await client.get("/api/pricing")).status).toBe(200);
    expect((await client.get("/api/features")).status).toBe(200);
    expect((await client.get("/api/portfolio")).status).toBe(200);
    expect((await client.get("/api/settings")).status).toBe(200);

    const enquiry = await client.post("/api/contacts", {
      name: "Public Visitor",
      email: "visitor@example.com",
      message: "I would like to discuss a website project.",
    });
    expect(enquiry.status).toBe(201);
  });

  it("blocks anonymous access to administrative APIs", async () => {
    const client = new ApiClient(app);
    expect((await client.get("/api/dashboard/overview")).status).toBe(401);
    expect((await client.get("/api/contacts")).status).toBe(401);
    expect((await client.get("/api/customers")).status).toBe(401);
    expect((await client.get("/api/orders")).status).toBe(401);
    expect((await client.post("/api/services", servicePayload("anon"))).status).toBe(401);
    expect((await client.put("/api/settings", { settings: { company_name: "Hacked" } })).status).toBe(401);
  });

  it("filters unpublished content for anonymous users but allows managers to see it", async () => {
    await prisma.service.create({
      data: {
        title: "Draft Service",
        slug: "draft-service",
        description: "Draft",
        shortDescription: "Draft",
        isPublished: false,
        isActive: true,
      },
    });
    await prisma.service.create({
      data: {
        title: "Live Service",
        slug: "live-service",
        description: "Live",
        shortDescription: "Live",
        isPublished: true,
        isActive: true,
      },
    });

    const anonymous = new ApiClient(app);
    const publicList = await anonymous.get("/api/services");
    expect(publicList.body.data.services.map((service) => service.slug)).toEqual(["live-service"]);
    expect((await anonymous.get("/api/services/draft-service")).status).toBe(404);

    const { client: admin } = await staffLogin("ADMIN");
    const managerList = await admin.get("/api/services?all=true");
    expect(managerList.body.data.services.map((service) => service.slug).sort()).toEqual(["draft-service", "live-service"]);
    expect((await admin.get("/api/services/draft-service")).status).toBe(200);
  });
});

describe("Role-based authorization", () => {
  it("CUSTOMER cannot access administrative modules or manage their own privileges", async () => {
    const { client } = await customerLogin();

    expect((await client.get("/api/dashboard/overview")).status).toBe(403);
    expect((await client.get("/api/contacts")).status).toBe(403);
    expect((await client.get("/api/customers")).status).toBe(403);
    expect((await client.post("/api/services", servicePayload("customer-attempt"))).status).toBe(403);
    expect((await client.get("/api/admin/users")).status).toBe(403);

    const me = await client.get("/api/auth/me");
    expect(me.status).toBe(200);

    const escalation = await client.patch("/api/auth/me", { role: "SUPER_ADMIN" });
    expect(escalation.status).toBe(400);

    const ownProfile = await client.get("/api/customers/me");
    expect(ownProfile.status).toBe(200);

    const others = await client.get("/api/customers");
    expect(others.status).toBe(403);
  });

  it("STAFF can access permitted operational modules but not content writes, settings or user management", async () => {
    const { client } = await staffLogin("STAFF");

    expect((await client.get("/api/dashboard/overview")).status).toBe(200);
    expect((await client.get("/api/contacts")).status).toBe(200);
    expect((await client.get("/api/customers")).status).toBe(200);
    expect((await client.get("/api/orders")).status).toBe(200);

    expect((await client.post("/api/services", servicePayload("staff-attempt"))).status).toBe(403);
    expect((await client.put("/api/settings", { settings: { company_name: "Staff" } })).status).toBe(403);
    expect((await client.get("/api/admin/users")).status).toBe(403);

    const enquiry = await prisma.contact.create({
      data: { name: "Lead", email: "lead@example.com", message: "Please contact me about a project." },
    });
    const updated = await client.patch(`/api/contacts/${enquiry.id}/status`, { status: "contacted" });
    expect(updated.status).toBe(200);
  });

  it("ADMIN can manage business content but cannot manage users or website settings", async () => {
    const { client } = await staffLogin("ADMIN");

    const created = await client.post("/api/services", servicePayload("admin-service"));
    expect(created.status).toBe(201);
    const id = created.body.data.service.id;
    expect((await client.put(`/api/services/${id}`, servicePayload("admin-service"))).status).toBe(200);
    expect((await client.delete(`/api/services/${id}`)).status).toBe(200);

    expect((await client.put("/api/settings", { settings: { company_name: "Admin" } })).status).toBe(403);
    expect((await client.get("/api/admin/users")).status).toBe(403);

    const target = await createUser({ email: "promote-me@example.com", role: "STAFF" });
    const promotion = await client.patch(`/api/admin/users/${target.id}`, { role: "ADMIN" });
    expect(promotion.status).toBe(403);
  });

  it("SUPER_ADMIN can manage users, roles and settings, but cannot demote the last SUPER_ADMIN", async () => {
    const { user: superAdmin, client } = await staffLogin("SUPER_ADMIN");

    expect((await client.get("/api/admin/users")).status).toBe(200);
    expect((await client.put("/api/settings", { settings: { company_name: "GrowthVerse" } })).status).toBe(200);

    const target = await createUser({ email: "staff-to-promote@example.com", role: "STAFF" });
    const promotion = await client.patch(`/api/admin/users/${target.id}`, { role: "ADMIN" });
    expect(promotion.status).toBe(200);
    expect((await prisma.user.findUnique({ where: { id: target.id } })).role).toBe("ADMIN");

    const selfDemotion = await client.patch(`/api/admin/users/${superAdmin.id}`, { role: "ADMIN" });
    expect(selfDemotion.status).toBe(403);
    expect((await prisma.user.findUnique({ where: { id: superAdmin.id } })).role).toBe("SUPER_ADMIN");
  });
});

describe("Customer data isolation", () => {
  it("does not grant unverified signups access to an existing customer's orders by email", async () => {
    const targetEmail = `target-${Math.random().toString(36).slice(2)}@example.com`;
    const targetCustomer = await prisma.customer.create({
      data: { name: "Existing Customer", email: targetEmail },
    });
    const targetOrder = await prisma.projectInquiry.create({
      data: {
        orderNumber: "ORD-TARGET",
        customerId: targetCustomer.id,
        customerName: targetCustomer.name,
        email: targetEmail,
        projectTitle: "Confidential project",
        amount: 5000,
        currency: "INR",
        status: "pending",
      },
    });

    const attacker = new ApiClient(app);
    const registered = await attacker.register({
      name: "Unverified Signup",
      email: targetEmail,
      password,
    });
    expect(registered.status).toBe(201);

    const loggedIn = await attacker.login(targetEmail, password);
    expect(loggedIn.status).toBe(200);

    const orders = await attacker.get("/api/orders");
    expect(orders.status).toBe(200);
    expect(orders.body.data.orders).toHaveLength(0);
    expect((await attacker.get(`/api/orders/${targetOrder.id}`)).status).toBe(404);
    expect((await attacker.get("/api/customers/me")).status).toBe(404);
  });

  it("CUSTOMER only sees their own orders and cannot fetch another customer's order by id", async () => {
    const first = await customerLogin("first");
    const second = await customerLogin("second");

    const firstOrder = await prisma.projectInquiry.create({
      data: {
        orderNumber: "ORD-FIRST",
        customerId: first.customer.id,
        customerName: first.customer.name,
        email: first.customer.email,
        projectTitle: "First project",
        amount: 1000,
        currency: "INR",
        status: "pending",
      },
    });
    const secondOrder = await prisma.projectInquiry.create({
      data: {
        orderNumber: "ORD-SECOND",
        customerId: second.customer.id,
        customerName: second.customer.name,
        email: second.customer.email,
        projectTitle: "Second project",
        amount: 2000,
        currency: "INR",
        status: "pending",
      },
    });

    const list = await first.client.get("/api/orders");
    expect(list.status).toBe(200);
    expect(list.body.data.orders).toHaveLength(1);
    expect(list.body.data.orders[0].id).toBe(firstOrder.id);

    expect((await first.client.get(`/api/orders/${firstOrder.id}`)).status).toBe(200);
    expect((await first.client.get(`/api/orders/${secondOrder.id}`)).status).toBe(404);

    // A customer cannot create or mutate orders even for themselves.
    expect((await first.client.patch(`/api/orders/${firstOrder.id}/status`, { status: "completed" })).status).toBe(403);
    expect(
      (await first.client.post("/api/orders", { customerId: first.customer.id, projectTitle: "x", amount: 1 })).status
    ).toBe(403);

    // Staff with the right permission can read both.
    const { client: staff } = await staffLogin("STAFF");
    const all = await staff.get("/api/orders");
    expect(all.body.data.orders).toHaveLength(2);
  });
});
