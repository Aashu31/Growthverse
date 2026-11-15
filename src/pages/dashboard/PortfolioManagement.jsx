import React from "react";
import { ResourceManager } from "../../components/dashboard/ResourceManager";
import { StatusBadge } from "../../components/dashboard/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { PERMISSIONS } from "../../utils/permissions";

const columns = [
  { key: "title", label: "Project" },
  { key: "category", label: "Category" },
  { key: "technologies", label: "Technologies" },
  {
    key: "isPublished",
    label: "Published",
    rowRender: (row) => <StatusBadge value={row.isPublished ? "published" : "draft"} />,
  },
  { key: "isFeatured", label: "Featured", render: (value) => (value ? "Yes" : "No") },
  { key: "displayOrder", label: "Order" },
];

const fields = [
  { name: "title", label: "Project title", required: true },
  { name: "slug", label: "Slug", required: true, help: "Lowercase words separated by hyphens." },
  { name: "category", label: "Category", defaultValue: "Websites" },
  { name: "description", label: "Description", type: "textarea", span: "full", rows: 5 },
  { name: "technologies", label: "Technologies", type: "tags", span: "full", help: "Comma-separated list." },
  { name: "thumbnail", label: "Thumbnail URL", span: "full", omitEmpty: true },
  { name: "images", label: "Gallery image URLs", type: "tags", span: "full", help: "Comma-separated URLs." },
  { name: "projectUrl", label: "Live project URL", span: "full", omitEmpty: true },
  { name: "isPublished", label: "Published", type: "checkbox", defaultValue: true },
  { name: "isFeatured", label: "Featured", type: "checkbox", defaultValue: false },
  { name: "displayOrder", label: "Display order", type: "number", defaultValue: 0 },
];

export default function PortfolioManagement() {
  const { hasPermission } = useAuth();
  return (
    <ResourceManager
      resource="portfolio"
      title="Portfolio Management"
      description="Curate case studies and published work."
      columns={columns}
      fields={fields}
      createLabel="Add project"
      searchPlaceholder="Search projects..."
      emptyMessage="No portfolio projects yet."
      canManage={hasPermission(PERMISSIONS.CONTENT_MANAGE)}
      modalSize="3xl"
    />
  );
}
