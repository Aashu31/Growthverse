import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader } from "../common/Loader";

export function AuthLoadingScreen({ label = "Checking your session..." }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader size="lg" text={label} />
    </div>
  );
}

function safeRedirect(value, fallback) {
  if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return fallback;
}

/**
 * Requires an authenticated session. Optionally restricts by role.
 * The backend still enforces every permission; this is UX only.
 */
export function ProtectedRoute({ roles = null }) {
  const { isAuthenticated, isLoading, homePath, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) return <AuthLoadingScreen />;

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?redirect=${redirect}`} replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0 && !hasRole(roles)) {
    return <Navigate to={homePath || "/"} replace />;
  }

  return <Outlet />;
}

/** Keeps signed-in users away from login/register/password pages. */
export function GuestRoute() {
  const { isAuthenticated, isLoading, homePath } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const target = safeRedirect(params.get("redirect"), homePath || "/");

  if (isLoading) return <AuthLoadingScreen />;
  if (isAuthenticated) return <Navigate to={target} replace />;
  return <Outlet />;
}

export default ProtectedRoute;
