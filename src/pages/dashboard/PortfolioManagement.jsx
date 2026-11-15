import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/Modal";
import { generateId } from "../../utils/formatters";
import { LuPlus, LuEdit, LuTrash2, LuSearch, LuImage } from "lucide-react";

const PORTFOLIO_CATEGORIES = ["Websites", "Web Applications", "UI/UX", "AI Solutions", "Cloud and DevOps", "Branding"];

export default function PortfolioManagement() {
  const { demoData, createEntity, updateEntity, deleteEntity } = useData();
  const [portfolio, setPortfolio] = useState(demoData.portfolio);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [search, setSearch] = useState("");

  const formData = {
    title: "",
    slug: "",
    category: "Websites",
    description: "",
    image: "",
    technologies: "",
    liveUrl: "",
    visibility: true,
  };

  const filteredPortfolio = portfolio.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: generateId("port"),
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
      category: formData.category,
      description: formData.description,
      image: formData.image || "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
      technologies: formData.technologies.split(",").map((f) => f.trim()).filter(Boolean),
      liveUrl: formData.liveUrl,
      visibility: formData.visibility,
      createdDate: new Date().toISOString(),
    };
    if (editingId) {
      updateEntity("portfolio", editingId, newItem);
      setEditingId(null);
    } else {
      createEntity("portfolio", newItem);
    }
    setPortfolio(demoData.portfolio);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    deleteEntity("portfolio", confirmId);
    setPortfolio(demoData.portfolio);
    setConfirmId(null);
    setIsConfirmOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h2 text-primary-text dark:text-white">Portfolio Management</h2>
          <p className="text-secondary-text dark:text-gray-300">
            Manage your portfolio projects. Sample images used for demonstration.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <LuPlus className="h-4 w-4 mr-2" /> Add Project
        </Button>
      </div>

      <div className="relative mb-6">
        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPortfolio.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-secondary-text dark:text-gray-400">No projects found.</p>
          </div>
        ) : (
          filteredPortfolio.map((project) => (
            <div key={project.id} className="card-premium p-6">
              <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 flex items-end p-3">
                  {project.visibility ? (
                    <span className="text-white text-xs font-medium bg-green-600/80 px-2 py-1 rounded">Visible</span>
                  ) : (
                    <span className="text-white text-xs font-medium bg-gray-600/80 px-2 py-1 rounded">Hidden</span>
                  )}
                </div>
              </div>
              <span className="text-xs font-medium text-blue-600 dark:text-electric-blue uppercase tracking-wider mb-2 block">
                {project.category}
              </span>
              <h3 className="text-lg font-semibold text-primary-text dark:text-white mb-3">
                {project.title}
              </h3>
              <p className="text-secondary-text dark:text-gray-300 text-sm leading-relaxed mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <span key={tech} className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-secondary-text dark:text-gray-300">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" size="sm" onClick={() => { setEditingId(project.id); setIsModalOpen(true); }}>
                  <LuEdit className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setConfirmId(project.id); setIsConfirmOpen(true); }}
                >
                  <LuTrash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Project" : "Add Project"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (!formData.slug) setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") });
                }}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-text dark:text-white">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
            >
              {PORTFOLIO_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
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
              <label className="text-sm font-medium text-primary-text dark:text-white">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Live URL</label>
              <input
                type="url"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                placeholder="https://example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-text dark:text-white">Technologies (comma separated)</label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              placeholder="React, Tailwind, JavaScript"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.visibility}
              onChange={(e) => setFormData({ ...formData, visibility: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            />
            <label className="text-sm text-secondary-text dark:text-gray-300 cursor-pointer">Visible on Portfolio Page</label>
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">
              {editingId ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
        title="Delete Project"
        message="Are you sure you want to delete this portfolio project?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}

function setFormData(data) {
  // placeholder
}
