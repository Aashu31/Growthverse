import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/Modal";
import { generateId, formatDate } from "../../utils/formatters";
import { getStatusColor } from "../../utils/helpers";
import { LuPlus, LuEdit, LuTrash2, LuSearch } from "lucide-react";

const STATUSES = ["New", "Contacted", "In Discussion", "Converted", "Closed"];

export default function ContactsManagement() {
  const { demoData, createEntity, updateEntity, deleteEntity } = useData();
  const [contacts, setContacts] = useState(demoData.contacts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const formData = {
    customerName: "",
    email: "",
    phone: "",
    company: "",
    service: "Website Development",
    budget: "$5,000 - $10,000",
    status: "New",
  };

  const SERVICES = ["Website Development", "Web Application Development", "UI/UX Design", "Mobile Application Development", "AI and Automation", "Cloud and DevOps", "Digital Branding", "Digital Marketing", "Sarthi - School Management Solution"];
  const BUDGETS = ["Under $2,500", "$2,500 - $5,000", "$5,000 - $10,000", "$10,000 - $25,000", "$25,000+"];

  const filteredContacts = contacts.filter((c) => {
    const matchSearch = c.customerName.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: generateId("cnt"),
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      service: formData.service,
      budget: formData.budget,
      submissionDate: new Date().toISOString(),
      status: formData.status,
    };
    if (editingId) {
      updateEntity("contacts", editingId, newItem);
      setEditingId(null);
    } else {
      createEntity("contacts", newItem);
    }
    setContacts(demoData.contacts);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    deleteEntity("contacts", confirmId);
    setContacts(demoData.contacts);
    setConfirmId(null);
    setIsConfirmOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h2 text-primary-text dark:text-white">Contacts Management</h2>
          <p className="text-secondary-text dark:text-gray-300">
            Manage business enquiries. All data is demonstration data stored locally.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <LuPlus className="h-4 w-4 mr-2" /> Add Enquiry
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 lg:w-96">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
        >
          <option value="all">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border dark:border-gray-700">
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Customer</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Email</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Service</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Budget</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Date</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400">Status</th>
              <th className="pb-3 font-medium text-secondary-text dark:text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-secondary-text dark:text-gray-400">
                  No enquiries found.
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact) => (
                <tr key={contact.id} className="border-b border-border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 font-medium text-primary-text dark:text-white">{contact.customerName}</td>
                  <td className="py-4 text-secondary-text dark:text-gray-300">{contact.email}</td>
                  <td className="py-4 text-secondary-text dark:text-gray-300 text-sm">{contact.service}</td>
                  <td className="py-4 text-secondary-text dark:text-gray-300 text-sm">{contact.budget}</td>
                  <td className="py-4 text-secondary-text dark:text-gray-300 text-sm">{formatDate(contact.submissionDate)}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingId(contact.id); setIsModalOpen(true); }}>
                      <LuEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setConfirmId(contact.id); setIsConfirmOpen(true); }}
                    >
                      <LuTrash2 className="h-4 w-4" />
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
        title={editingId ? "Edit Enquiry" : "Add Enquiry"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Budget</label>
              <select
                name="budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              >
                {BUDGETS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-text dark:text-white">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">
              {editingId ? "Update Enquiry" : "Create Enquiry"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
        title="Delete Enquiry"
        message="Are you sure you want to delete this enquiry?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
