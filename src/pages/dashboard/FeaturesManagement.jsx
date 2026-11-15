import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/Modal";
import { generateId } from "../../utils/formatters";
import { Plus, Edit, Trash2, Search } from "lucide-react";

export default function FeaturesManagement() {
  const { demoData, createEntity, updateEntity, deleteEntity } = useData();
  const [features, setFeatures] = useState(demoData.features);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [search, setSearch] = useState("");

  const formData = {
    name: "",
    category: "",
    description: "",
    icon: "Target",
    visible: true,
  };

  const filteredFeatures = features.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: generateId("feat"),
      name: formData.name,
      category: formData.category,
      description: formData.description,
      icon: formData.icon,
      visible: formData.visible,
    };
    if (editingId) {
      updateEntity("features", editingId, newItem);
      setEditingId(null);
    } else {
      createEntity("features", newItem);
    }
    setFeatures(demoData.features);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    deleteEntity("features", confirmId);
    setFeatures(demoData.features);
    setConfirmId(null);
    setIsConfirmOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h2 text-primary-text dark:text-white">Features Management</h2>
          <p className="text-secondary-text dark:text-gray-300">
            Manage your feature offerings. Demonstration data stored locally.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Feature
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search features..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border dark:border-gray-700">
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Feature</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Category</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Visible</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeatures.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-secondary-text dark:text-gray-400">
                  No features found.
                </td>
              </tr>
            ) : (
              filteredFeatures.map((feature) => (
                <tr key={feature.id} className="border-b border-border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 font-medium text-primary-text dark:text-white">{feature.name}</td>
                  <td className="py-4 text-secondary-text dark:text-gray-300">{feature.category}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${feature.visible ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}>
                      {feature.visible ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingId(feature.id); setIsModalOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setConfirmId(feature.id); setIsConfirmOpen(true); }}
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
        title={editingId ? "Edit Feature" : "Add Feature"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Feature Name</label>
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
              <label className="text-sm font-medium text-primary-text dark:text-white">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                placeholder="e.g., Design, Development"
              />
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
              <label className="text-sm font-medium text-primary-text dark:text-white">Icon</label>
              <select
                name="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              >
                <option>Target</option>
                <option>Palette</option>
                <option>Monitor</option>
                <option>Layers</option>
                <option>Code</option>
                <option>Share2</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.visible}
                onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label className="text-sm text-secondary-text dark:text-gray-300 cursor-pointer">Visible to Customers</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">
              {editingId ? "Update Feature" : "Create Feature"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
        title="Delete Feature"
        message="Are you sure you want to delete this feature?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
