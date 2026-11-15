import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/Modal";
import { generateId, formatCurrency } from "../../utils/formatters";
import { Plus, Edit, Trash2, Search } from "lucide-react";

const BILLING_TYPES = ["month", "year", "custom"];

export default function PricingManagement() {
  const { demoData, createEntity, updateEntity, deleteEntity } = useData();
  const [pricing, setPricing] = useState(demoData.pricing);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [search, setSearch] = useState("");

  const formData = {
    name: "",
    description: "",
    price: "",
    currency: "USD",
    billingType: "month",
    features: "",
    limitations: "",
    popular: false,
    active: true,
  };

  const filteredPricing = pricing.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: generateId("plan"),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      currency: formData.currency,
      billingType: formData.billingType,
      features: formData.features.split(",").map((f) => f.trim()).filter(Boolean),
      limitations: formData.limitations.split(",").map((f) => f.trim()).filter(Boolean),
      popular: formData.popular,
      active: formData.active,
    };
    if (editingId) {
      updateEntity("pricing", editingId, newItem);
      setEditingId(null);
    } else {
      createEntity("pricing", newItem);
    }
    setPricing(demoData.pricing);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    deleteEntity("pricing", confirmId);
    setPricing(demoData.pricing);
    setConfirmId(null);
    setIsConfirmOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h2 text-primary-text dark:text-white">Pricing Management</h2>
          <p className="text-secondary-text dark:text-gray-300">
            Manage your pricing plans. Demonstration data stored locally.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Plan
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search pricing plans..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border dark:border-gray-700">
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Plan</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Price</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Billing</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Popular</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Status</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPricing.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-secondary-text dark:text-gray-400">
                  No pricing plans found.
                </td>
              </tr>
            ) : (
              filteredPricing.map((plan) => (
                <tr key={plan.id} className="border-b border-border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 font-medium text-primary-text dark:text-white">{plan.name}</td>
                  <td className="py-4">{formatCurrency(plan.price)}</td>
                  <td className="py-4 text-secondary-text dark:text-gray-300">{plan.billingType}</td>
                  <td className="py-4">
                    {plan.popular ? (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        Popular
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        No
                      </span>
                    )}
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${plan.active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}>
                      {plan.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingId(plan.id); setIsModalOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setConfirmId(plan.id); setIsConfirmOpen(true); }}
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
        title={editingId ? "Edit Pricing Plan" : "Add Pricing Plan"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Plan Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text dark:text-gray-400">$</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                  required
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-text dark:text-white">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Billing Type</label>
              <select
                name="billingType"
                value={formData.billingType}
                onChange={(e) => setFormData({ ...formData, billingType: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              >
                {BILLING_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>INR</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-text dark:text-white">Features (comma separated)</label>
            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              placeholder="Feature 1, Feature 2, Feature 3"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-text dark:text-white">Limitations (comma separated)</label>
            <input
              type="text"
              name="limitations"
              value={formData.limitations}
              onChange={(e) => setFormData({ ...formData, limitations: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              placeholder="Limitation 1, Limitation 2"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label className="text-sm text-secondary-text dark:text-gray-300 cursor-pointer">Popular Plan</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label className="text-sm text-secondary-text dark:text-gray-300 cursor-pointer">Active</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">
              {editingId ? "Update Plan" : "Create Plan"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
        title="Delete Pricing Plan"
        message="Are you sure you want to delete this pricing plan?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
