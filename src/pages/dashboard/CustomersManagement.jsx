import React from "react";
import { ResourceManager } from "../../components/dashboard/ResourceManager";
import { StatusBadge } from "../../components/dashboard/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { PERMISSIONS } from "../../utils/permissions";

const columns = [
  { key: "name", label: "Customer" },
  { key: "email", label: "Email" },
  { key: "company", label: "Company" },
  { key: "country", label: "Country" },
  { key: "status", label: "Status", rowRender: (row) => <StatusBadge value={row.status} /> },
  {
    key: "_count.projectInquiries",
    label: "Orders",
    render: (value) => (value === undefined || value === null ? "0" : String(value)),
  },
  { key: "createdAt", label: "Added", type: "date" },
];

const fields = [
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Email address", type: "email", required: true },
  { name: "phone", label: "Phone" },
  { name: "company", label: "Company" },
  { name: "country", label: "Country" },
  {
    name: "status",
    label: "Status",
    type: "select",
    defaultValue: "active",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "lead", label: "Lead" },
    ],
  },
  { name: "notes", label: "Notes", type: "textarea", span: "full", rows: 4 },
];

export default function CustomersManagement() {
  const { hasPermission } = useAuth();
  return (
    <ResourceManager
      resource="customers"
      title="Customers Management"
      description="Maintain customer records linked to registered accounts and orders."
      columns={columns}
      fields={fields}
      createLabel="Add customer"
      searchPlaceholder="Search by name, email or company..."
      searchKeys={["name", "email", "company", "country"]}
      emptyMessage="No customers yet."
      filterField="status"
      filterOptions={[
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "lead", label: "Lead" },
      ]}
      canManage={hasPermission(PERMISSIONS.CUSTOMERS_MANAGE)}
    />
  );
}
