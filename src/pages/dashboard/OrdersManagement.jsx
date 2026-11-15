import React, { useMemo } from "react";
import { ResourceManager } from "../../components/dashboard/ResourceManager";
import { StatusBadge } from "../../components/dashboard/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { PERMISSIONS } from "../../utils/permissions";
import { formatDate } from "../../utils/formatters";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrdersManagement() {
  const { hasPermission } = useAuth();
  const { customers, services } = useData();

  const columns = useMemo(
    () => [
      { key: "orderNumber", label: "Order" },
      { key: "projectTitle", label: "Project" },
      { key: "customerName", label: "Customer" },
      {
        key: "amount",
        label: "Amount",
        rowRender: (row) =>
          `${row.currency || "INR"} ${Number(row.amount || 0).toLocaleString()}`,
      },
      { key: "status", label: "Status", rowRender: (row) => <StatusBadge value={row.status} /> },
      { key: "dueDate", label: "Due", render: (value) => (value ? formatDate(value) : "—") },
      { key: "createdAt", label: "Created", type: "date" },
    ],
    []
  );

  const fields = useMemo(
    () => [
      { name: "orderNumber", label: "Order number", createOnly: true, placeholder: "Generated automatically if empty" },
      {
        name: "customerId",
        label: "Customer",
        type: "select",
        required: true,
        createOnly: true,
        options: customers.map((customer) => ({
          value: customer.id,
          label: `${customer.name} (${customer.email})`,
        })),
        help: customers.length === 0 ? "Create a customer first." : undefined,
      },
      {
        name: "serviceId",
        label: "Related service",
        type: "select",
        createOnly: true,
        options: services.map((service) => ({ value: service.id, label: service.title })),
      },
      { name: "projectTitle", label: "Project title", required: true, span: "full" },
      { name: "description", label: "Description", type: "textarea", span: "full", rows: 4 },
      { name: "amount", label: "Amount", type: "number", min: 1, step: "0.01", required: true },
      {
        name: "currency",
        label: "Currency",
        type: "select",
        defaultValue: "INR",
        options: ["INR", "USD"],
      },
      { name: "status", label: "Status", type: "select", defaultValue: "pending", options: statusOptions },
      { name: "startDate", label: "Start date", type: "date" },
      { name: "dueDate", label: "Due date", type: "date" },
    ],
    [customers, services]
  );

  return (
    <ResourceManager
      resource="orders"
      title="Orders Management"
      description="Track project orders, values and delivery status."
      columns={columns}
      fields={fields}
      createLabel="Add order"
      searchPlaceholder="Search orders by number, project or customer..."
      searchKeys={["orderNumber", "projectTitle", "customerName", "customerEmail"]}
      emptyMessage="No orders yet."
      filterField="status"
      filterOptions={statusOptions}
      canManage={hasPermission(PERMISSIONS.ORDERS_MANAGE)}
      modalSize="3xl"
    />
  );
}
