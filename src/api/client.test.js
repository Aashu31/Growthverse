import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiFetch } from "./client";

const jsonResponse = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });

describe("API client", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    document.cookie = "gv_csrf=csrf-token-123; path=/";
  });

  it("sends cookies, JSON and the CSRF header on mutations", async () => {
    fetch.mockResolvedValueOnce(jsonResponse({ success: true }));

    await apiFetch("/auth/login", {
      method: "POST",
      body: { email: "ada@example.com", password: "Example-Password-9" },
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe("/api/auth/login");
    expect(init.credentials).toBe("include");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.headers["X-CSRF-Token"]).toBe("csrf-token-123");
    expect(JSON.parse(init.body)).toEqual({
      email: "ada@example.com",
      password: "Example-Password-9",
    });
  });

  it("does not send a CSRF header for safe requests", async () => {
    fetch.mockResolvedValueOnce(jsonResponse({ success: true, data: [] }));
    await apiFetch("/services");

    const [, init] = fetch.mock.calls[0];
    expect(init.method).toBe("GET");
    expect(init.headers["X-CSRF-Token"]).toBeUndefined();
  });

  it("refreshes once on a 401 and retries the original request", async () => {
    fetch
      .mockResolvedValueOnce(jsonResponse({ message: "Expired", code: "UNAUTHORIZED" }, 401))
      .mockResolvedValueOnce(jsonResponse({ success: true, data: { user: { id: "u1" } } }))
      .mockResolvedValueOnce(jsonResponse({ success: true, data: { ok: true } }));

    const result = await apiFetch("/services");

    expect(fetch).toHaveBeenCalledTimes(3);
    expect(fetch.mock.calls[1][0]).toBe("/api/auth/refresh");
    expect(fetch.mock.calls[1][1].method).toBe("POST");
    expect(fetch.mock.calls[2][0]).toBe("/api/services");
    expect(result.data.ok).toBe(true);
  });

  it("does not attempt refresh for a failed login", async () => {
    fetch.mockResolvedValueOnce(
      jsonResponse({ message: "Invalid email or password", code: "UNAUTHORIZED" }, 401)
    );

    await expect(
      apiFetch("/auth/login", { method: "POST", body: { email: "a@b.com", password: "x" } })
    ).rejects.toMatchObject({ status: 401 });

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("maps validation errors to field errors", async () => {
    fetch.mockResolvedValueOnce(
      jsonResponse(
        {
          success: false,
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          errors: [
            { field: "email", message: "Invalid email" },
            { field: "password", message: "Too short" },
          ],
        },
        400
      )
    );

    const error = await apiFetch("/auth/register", { method: "POST", body: {} }).catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(400);
    expect(error.fieldErrors()).toEqual({
      email: "Invalid email",
      password: "Too short",
    });
  });
});
