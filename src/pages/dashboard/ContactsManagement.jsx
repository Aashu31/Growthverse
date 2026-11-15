import React from "react";
import { ResourceManager } from "../../components/dashboard/ResourceManager";
import { StatusBadge } from "../../components/dashboard/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { PERMISSIONS } from "../../utils/permissions";

const columns = [
  { key: "name", label: "Contact" },
  { key: "email", label: "Email" },
  { key: "company", label: "Company" },
  { key: "service", label: "Service" },
  { key: "status", label: "Status", rowRender: (row) => <StatusBadge value={row.status} /> },
  { key: "createdAt", label: "Received", type: "date" },
];

const fields = [
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "new", label: "New" },
      { value: "contacted", label: "Contacted" },
      { value: "in_progress", label: "In progress" },
      { value: "completed", label: "Completed" },
      { value: "closed", label: "Closed" },
    ],
  },
  { name: "subject", label: "Subject" },
  { name: "message", label: "Message", type: "textarea", span: "full", rows: 5 },
  { name: "notes", label: "Internal notes", type: "textarea", span: "full", rows: 4, help: "Visible to staff only." },
];

export default function ContactsManagement() {
  const { hasPermission } = useAuth();
  return (
    <ResourceManager
      resource="contacts"
      title="Contacts Management"
      description="Review enquiries submitted through the public contact form."
      columns={columns}
      fields={fields}
      createLabel="Add enquiry"
      allowCreate={false}
      searchPlaceholder="Search by name, email or company..."
      searchKeys={["name", "email", "company", "service", "subject"]}
      emptyMessage="No contact enquiries have been submitted yet."
      filterField="status"
      filterOptions={[
        { value: "new", label: "New" },
        { value: "contacted", label: "Contacted" },
        { value: "in_progress", label: "In progress" },
        { value: "completed", label: "Completed" },
        { value: "closed", label: "Closed" },
      ]}
      canManage={hasPermission(PERMISSIONS.CONTACTS_MANAGE)}
    />
  );
}
