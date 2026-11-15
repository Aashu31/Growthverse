import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const authApi = vi.hoisted(() => ({
  me: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  logoutAll: vi.fn(),
  updateProfile: vi.fn(),
  changePassword: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  verifyEmail: vi.fn(),
  resendVerification: vi.fn(),
  sessions: vi.fn(),
  revokeSession: vi.fn(),
}));

vi.mock("../api/auth.api", () => ({ default: authApi, authApi }));

import { AuthProvider, useAuth } from "./AuthContext";

function Probe() {
  const { status, user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="user">{user?.email || "none"}</span>
      <button type="button" onClick={() => login({ email: "ada@example.com", password: "x" })}>
        Login
      </button>
      <button type="button" onClick={logout}>Logout</button>
    </div>
  );
}

const renderAuth = () =>
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  );

describe("AuthContext", () => {
  beforeEach(() => {
    authApi.me.mockReset();
    authApi.login.mockReset();
    authApi.logout.mockReset();
  });

  it("bootstraps an existing cookie session from /auth/me", async () => {
    authApi.me.mockResolvedValue({
      data: { user: { id: "u1", email: "staff@example.com", role: "STAFF" } },
    });

    renderAuth();

    expect(await screen.findByText("staff@example.com")).toBeInTheDocument();
    expect(screen.getByTestId("status")).toHaveTextContent("authenticated");
  });

  it("treats a 401 bootstrap as anonymous", async () => {
    authApi.me.mockRejectedValue({ status: 401, message: "Unauthorized" });

    renderAuth();

    expect(await screen.findByTestId("status")).toHaveTextContent("anonymous");
    expect(screen.getByTestId("user")).toHaveTextContent("none");
  });

  it("keeps sessions out of browser storage", async () => {
    authApi.me.mockRejectedValue({ status: 401, message: "Unauthorized" });
    authApi.login.mockResolvedValue({
      data: { user: { id: "u2", email: "customer@example.com", role: "CUSTOMER" } },
    });
    authApi.logout.mockResolvedValue({ success: true });

    const user = userEvent.setup();
    renderAuth();
    await screen.findByTestId("status");

    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("customer@example.com")).toBeInTheDocument();
    expect(window.localStorage.length).toBe(0);
    expect(window.sessionStorage.length).toBe(0);

    await user.click(screen.getByRole("button", { name: "Logout" }));
    expect(await screen.findByTestId("status")).toHaveTextContent("anonymous");
  });
});
