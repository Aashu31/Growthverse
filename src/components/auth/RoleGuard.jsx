import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AuthLoadingScreen } from "./ProtectedRoute";

/** Restricts a subtree to one or more roles after authentication. */
export function RoleGuard({ roles, fallback = "/forbidden" }) {
  const { isLoading, isAuthenticated, hasRole, homePath } = useAuth();

  if (isLoading) return <AuthLoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasRole(roles)) return <Navigate to={fallback || homePath || "/"} replace />;
  return <Outlet />;
}

export default RoleGuard;
