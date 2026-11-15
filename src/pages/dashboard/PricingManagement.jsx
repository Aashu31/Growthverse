import React from "react";
import { ResourceManager } from "../../components/dashboard/ResourceManager";
import { StatusBadge } from "../../components/dashboard/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { PERMISSIONS } from "../../utils/permissions";

const columns = [
  { key: "name", label: "Plan" },
  { key: "category", label: "Category" },
  { key: "audience", label: "Audience" },
  { key: "billingCycle", label: "Billing" },
  {
    key: "amount",
    label: "Amount",
    rowRender: (row) => `${row.currency || "INR"} ${Number(row.amount || 0).toLocaleString()}`,
  },
  {
    key: "isActive",
    label: "Status",
    rowRender: (row) => <StatusBadge value={row.isActive ? "active" : "inactive"} />,
  },
];

const fields = [
  { name: "name", label: "Plan name", required: true, placeholder: "Growth Plan" },
  { name: "category", label: "Category", defaultValue: "Development" },
  {
    name: "audience",
    label: "Audience",
    type: "select",
    required: true,
    defaultValue: "indian",
    options: [
      { value: "indian", label: "Indian market" },
      { value: "international", label: "International market" },
    ],
  },
  {
    name: "billingCycle",
    label: "Billing cycle",
    type: "select",
    required: true,
    defaultValue: "monthly",
    options: ["monthly", "quarterly", "yearly", "one-time"],
  },
  {
    name: "currency",
    label: "Currency",
    type: "select",
    required: true,
    defaultValue: "INR",
    options: ["INR", "USD"],
  },
  { name: "amount", label: "Amount", type: "number", min: 1, step: "0.01", required: true },
  { name: "description", label: "Description", type: "textarea", span: "full", rows: 3 },
  { name: "features", label: "Included features", type: "tags", span: "full", help: "Comma-separated list." },
  { name: "supportDetails", label: "Support details", type: "textarea", span: "full", rows: 2 },
  { name: "isActive", label: "Active", type: "checkbox", defaultValue: true },
  { name: "displayOrder", label: "Display order", type: "number", defaultValue: 0 },
];

export default function PricingManagement() {
  const { hasPermission } = useAuth();
  return (
    <ResourceManager
      resource="pricing"
      title="Pricing Management"
      description="Control the plans displayed on the public pricing page."
      columns={columns}
      fields={fields}
      createLabel="Add plan"
      searchPlaceholder="Search pricing plans..."
      emptyMessage="No pricing plans yet."
      filterField="audience"
      filterOptions={[
        { value: "indian", label: "Indian market" },
        { value: "international", label: "International market" },
      ]}
      canManage={hasPermission(PERMISSIONS.CONTENT_MANAGE)}
      modalSize="3xl"
    />
  );
}
