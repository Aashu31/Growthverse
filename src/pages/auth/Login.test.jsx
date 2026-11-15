import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../../api/client";

const authState = vi.hoisted(() => ({ current: {} }));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => authState.current,
}));

import Login from "./Login";

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<div>Account home</div>} />
        <Route path="/dashboard" element={<div>Dashboard home</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Login page", () => {
  beforeEach(() => {
    authState.current = { login: vi.fn().mockResolvedValue({ role: "CUSTOMER" }) };
  });

  it("validates required fields without calling the API", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(authState.current.login).not.toHaveBeenCalled();
    expect(screen.getByText("Email address is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
  });

  it("signs a customer in and routes to the account area", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email address/i), "customer@example.com");
    await user.type(screen.getByLabelText(/^password/i), "Example-Password-9");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(authState.current.login).toHaveBeenCalledWith({
      email: "customer@example.com",
      password: "Example-Password-9",
    });
    expect(await screen.findByText("Account home")).toBeInTheDocument();
  });

  it("shows the server error message when credentials are rejected", async () => {
    authState.current = {
      login: vi.fn().mockRejectedValue(
        new ApiError("Invalid email or password", { status: 401, code: "UNAUTHORIZED" })
      ),
    };
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email address/i), "customer@example.com");
    await user.type(screen.getByLabelText(/^password/i), "Wrong-Password-1");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid email or password");
  });
});
