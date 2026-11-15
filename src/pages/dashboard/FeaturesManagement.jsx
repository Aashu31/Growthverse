import React from "react";
import { ResourceManager } from "../../components/dashboard/ResourceManager";
import { StatusBadge } from "../../components/dashboard/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { PERMISSIONS } from "../../utils/permissions";

const columns = [
  { key: "title", label: "Feature" },
  { key: "category", label: "Category" },
  { key: "icon", label: "Icon" },
  {
    key: "isActive",
    label: "Status",
    rowRender: (row) => <StatusBadge value={row.isActive ? "active" : "inactive"} />,
  },
  { key: "displayOrder", label: "Order" },
];

const fields = [
  { name: "title", label: "Feature title", required: true },
  { name: "category", label: "Category", defaultValue: "General" },
  { name: "icon", label: "Icon name", defaultValue: "Target", help: "Lucide icon name used by the website." },
  { name: "description", label: "Description", type: "textarea", span: "full", rows: 3 },
  { name: "isActive", label: "Active", type: "checkbox", defaultValue: true },
  { name: "displayOrder", label: "Display order", type: "number", defaultValue: 0 },
];

export default function FeaturesManagement() {
  const { hasPermission } = useAuth();
  return (
    <ResourceManager
      resource="features"
      title="Features Management"
      description="Manage the capability cards presented across the website."
      columns={columns}
      fields={fields}
      createLabel="Add feature"
      searchPlaceholder="Search features..."
      emptyMessage="No features configured yet."
      canManage={hasPermission(PERMISSIONS.CONTENT_MANAGE)}
    />
  );
}
