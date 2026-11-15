import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/Modal";
import { generateId, formatDate, formatCurrency } from "../../utils/formatters";
import { getStatusColor } from "../../utils/helpers";
import { Plus, Edit, Trash2, Search } from "lucide-react";

const ORDER_STATUSES = ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];
const PAYMENT_STATUSES = ["Unpaid", "Paid", "Partially Paid", "Refunded"];

export default function OrdersManagement() {
  const { demoData, createEntity, updateEntity, deleteEntity } = useData();
  const [orders, setOrders] = useState(demoData.orders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [search, setSearch] = useState("");

  const formData = {
    customer: "",
    service: "Website Development",
    amount: "",
    status: "Pending",
    paymentStatus: "Unpaid",
  };

  const SERVICES = ["Website Development", "Web Application Development", "UI/UX Design", "Mobile Application Development", "AI and Automation", "Cloud and DevOps", "Digital Branding", "Digital Marketing"];

  const filteredOrders = orders.filter((o) =>
    o.customer.toLowerCase().includes(search.toLowerCase()) ||
    o.service.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: generateId("ord"),
      customer: formData.customer,
      service: formData.service,
      amount: parseFloat(formData.amount) || 0,
      orderDate: new Date().toISOString(),
      status: formData.status,
      paymentStatus: formData.paymentStatus,
    };
    if (editingId) {
      updateEntity("orders", editingId, newItem);
      setEditingId(null);
    } else {
      createEntity("orders", newItem);
    }
    setOrders(demoData.orders);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    deleteEntity("orders", confirmId);
    setOrders(demoData.orders);
    setConfirmId(null);
    setIsConfirmOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h2 text-primary-text dark:text-white">Orders Management</h2>
          <p className="text-secondary-text dark:text-gray-300">
            Demo order management interface. No real payment processing.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Order
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by customer or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border dark:border-gray-700">
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Order ID</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Customer</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Service</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Amount</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Date</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Order Status</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Payment</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-secondary-text dark:text-gray-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 font-medium text-primary-text dark:text-white">{order.id}</td>
                  <td className="py-4 text-secondary-text dark:text-gray-300">{order.customer}</td>
                  <td className="py-4 text-secondary-text dark:text-gray-300 text-sm">{order.service}</td>
                  <td className="py-4 text-primary-text dark:text-white font-medium">{formatCurrency(order.amount)}</td>
                  <td className="py-4 text-secondary-text dark:text-gray-300 text-sm">{formatDate(order.orderDate)}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingId(order.id); setIsModalOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setConfirmId(order.id); setIsConfirmOpen(true); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Order" : "Add Order"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Customer Name</label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Service</label>
              <select
                name="service"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              >
                {SERVICES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Amount ($)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Order Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-text dark:text-white">Payment Status</label>
            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
            >
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">
              {editingId ? "Update Order" : "Create Order"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
        title="Delete Order"
        message="Are you sure you want to delete this order?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
