import React from "react";
import { ResourceManager } from "../../components/dashboard/ResourceManager";
import { StatusBadge } from "../../components/dashboard/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { PERMISSIONS } from "../../utils/permissions";

const columns = [
  { key: "title", label: "Service" },
  { key: "category", label: "Category" },
  {
    key: "isActive",
    label: "Active",
    rowRender: (row) => <StatusBadge value={row.isActive ? "active" : "inactive"} />,
  },
  {
    key: "isPublished",
    label: "Published",
    rowRender: (row) => <StatusBadge value={row.isPublished ? "published" : "draft"} />,
  },
  { key: "displayOrder", label: "Order" },
  { key: "createdAt", label: "Created", type: "date" },
];

const fields = [
  { name: "title", label: "Service title", required: true, placeholder: "Website Development" },
  { name: "slug", label: "Slug", required: true, placeholder: "website-development", help: "Lowercase words separated by hyphens." },
  { name: "category", label: "Category", defaultValue: "Web Development" },
  {
    name: "shortDescription",
    label: "Short description",
    span: "full",
    placeholder: "One-line summary shown in listings",
  },
  { name: "description", label: "Full description", type: "textarea", span: "full", rows: 5 },
  { name: "features", label: "Features", type: "tags", span: "full", help: "Comma-separated list." },
  { name: "isPublished", label: "Published", type: "checkbox", defaultValue: true },
  { name: "isActive", label: "Active", type: "checkbox", defaultValue: true },
  { name: "displayOrder", label: "Display order", type: "number", defaultValue: 0 },
];

export default function ServicesManagement() {
  const { hasPermission } = useAuth();
  return (
    <ResourceManager
      resource="services"
      title="Services Management"
      description="Publish and maintain the services shown on the public website."
      columns={columns}
      fields={fields}
      createLabel="Add service"
      searchPlaceholder="Search services..."
      emptyMessage="No services yet. Add your first service to get started."
      canManage={hasPermission(PERMISSIONS.CONTENT_MANAGE)}
      modalSize="3xl"
    />
  );
}
