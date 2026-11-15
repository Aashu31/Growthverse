/**
 * Frontend mirror of the backend permission matrix.
 * Used only for navigation and route UX. The backend is the source of truth.
 */

export const ROLES = Object.freeze({
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  CUSTOMER: "CUSTOMER",
});

export const PERMISSIONS = Object.freeze({
  DASHBOARD_VIEW: "dashboard.view",
  CONTENT_VIEW: "content.view",
  CONTENT_MANAGE: "content.manage",
  CONTACTS_VIEW: "contacts.view",
  CONTACTS_MANAGE: "contacts.manage",
  CUSTOMERS_VIEW: "customers.view",
  CUSTOMERS_MANAGE: "customers.manage",
  ORDERS_VIEW: "orders.view",
  ORDERS_MANAGE: "orders.manage",
  SETTINGS_VIEW: "settings.view",
  SETTINGS_MANAGE: "settings.manage",
  USERS_MANAGE: "users.manage",
  ACCOUNT_SELF: "account.self",
  ORDERS_SELF: "orders.self",
});

const ADMIN_PERMISSIONS = [
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.CONTENT_VIEW,
  PERMISSIONS.CONTENT_MANAGE,
  PERMISSIONS.CONTACTS_VIEW,
  PERMISSIONS.CONTACTS_MANAGE,
  PERMISSIONS.CUSTOMERS_VIEW,
  PERMISSIONS.CUSTOMERS_MANAGE,
  PERMISSIONS.ORDERS_VIEW,
  PERMISSIONS.ORDERS_MANAGE,
  PERMISSIONS.SETTINGS_VIEW,
];

const STAFF_PERMISSIONS = [
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.CONTENT_VIEW,
  PERMISSIONS.CONTACTS_VIEW,
  PERMISSIONS.CONTACTS_MANAGE,
  PERMISSIONS.CUSTOMERS_VIEW,
  PERMISSIONS.ORDERS_VIEW,
  PERMISSIONS.ORDERS_MANAGE,
];

const CUSTOMER_PERMISSIONS = [PERMISSIONS.ACCOUNT_SELF, PERMISSIONS.ORDERS_SELF];

export const ROLE_PERMISSIONS = Object.freeze({
  SUPER_ADMIN: Object.values(PERMISSIONS),
  ADMIN: ADMIN_PERMISSIONS,
  STAFF: STAFF_PERMISSIONS,
  CUSTOMER: CUSTOMER_PERMISSIONS,
});

export function hasPermission(role, permission) {
  return Boolean(ROLE_PERMISSIONS[role]?.includes(permission));
}

export function isStaffRole(role) {
  return role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN || role === ROLES.STAFF;
}

export function isAdminRole(role) {
  return role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN;
}

export function isSuperAdminRole(role) {
  return role === ROLES.SUPER_ADMIN;
}

/** Landing route for a role after authentication. */
export function roleHome(role) {
  return isStaffRole(role) ? "/dashboard" : "/account";
}

export function roleLabel(role) {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return "Super Administrator";
    case ROLES.ADMIN:
      return "Administrator";
    case ROLES.STAFF:
      return "Staff";
    case ROLES.CUSTOMER:
      return "Customer";
    default:
      return "Unknown";
  }
}
