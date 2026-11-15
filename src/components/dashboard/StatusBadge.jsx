import React from "react";
import { getStatusColor } from "../../utils/helpers";

const LABELS = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  new: "New",
  contacted: "Contacted",
  in_discussion: "In discussion",
  closed: "Closed",
  lead: "Lead",
  published: "Published",
  draft: "Draft",
  verified: "Verified",
  suspended: "Suspended",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
  SUPER_ADMIN: "Super admin",
  ADMIN: "Admin",
  STAFF: "Staff",
  CUSTOMER: "Customer",
};

export function StatusBadge({ value, className = "" }) {
  if (value === null || value === undefined || value === "") return null;
  const raw = String(value);
  const normalized = raw.toLowerCase().replace(/\s+/g, "-");
  const label = LABELS[raw] || LABELS[normalized] || raw.replace(/_/g, " ");
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getStatusColor(normalized)} ${className}`}
    >
      {label}
    </span>
  );
}

export default StatusBadge;
