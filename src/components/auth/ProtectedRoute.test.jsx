import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const authState = vi.hoisted(() => ({ current: {} }));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => authState.current,
  AuthProvider: ({ children }) => children,
}));

import { ProtectedRoute } from "./ProtectedRoute";

function renderRoutes(initialPath = "/dashboard") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<ProtectedRoute roles={["SUPER_ADMIN", "ADMIN", "STAFF"]} />}>
          <Route path="/dashboard" element={<div>Dashboard content</div>} />
        </Route>
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/account" element={<div>Account page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    authState.current = {
      isAuthenticated: false,
      isLoading: false,
      homePath: "/account",
      hasRole: () => false,
    };
  });

  it("redirects anonymous visitors to login", () => {
    renderRoutes();
    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("renders the protected content for an authorised staff user", () => {
    authState.current = {
      isAuthenticated: true,
      isLoading: false,
      homePath: "/dashboard",
      hasRole: (roles) => roles.includes("ADMIN"),
    };

    renderRoutes();
    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
  });

  it("sends an authenticated but unauthorised user to their home route", () => {
    authState.current = {
      isAuthenticated: true,
      isLoading: false,
      homePath: "/account",
      hasRole: () => false,
    };

    renderRoutes();
    expect(screen.getByText("Account page")).toBeInTheDocument();
  });
});
