/**
 * Shared access helpers for content modules.
 */

import { hasPermission, PERMISSIONS } from "./permissions.js";

export function canManageContent(request) {
  return Boolean(request.authUser && hasPermission(request.authUser.role, PERMISSIONS.CONTENT_MANAGE));
}

export function canViewAdminContent(request) {
  return Boolean(
    request.authUser &&
      (hasPermission(request.authUser.role, PERMISSIONS.CONTENT_MANAGE) ||
        hasPermission(request.authUser.role, PERMISSIONS.CONTENT_VIEW))
  );
}

export function toArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return [];
}

export function isManager(request) {
  return canManageContent(request);
}
