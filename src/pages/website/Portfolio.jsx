import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Filter, Search } from "lucide-react";
import { PORTFOLIO_DATA } from "../../data";

const CATEGORIES = ["All", "Websites", "Web Applications", "UI/UX", "AI Solutions", "Cloud and DevOps", "Branding"];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredProjects = useMemo(() => {
    return PORTFOLIO_DATA.filter((p) => {
      const matchCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      <section className="py-20 lg:py-32">
        <div className="container-premium">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
            <div>
              <div className="text-center mb-16">
                <h2 className="text-h2 mb-4">Our Portfolio</h2>
                <p className="text-lg text-secondary-text max-w-2xl mx-auto">
                  Explore our featured projects and case studies.
                </p>
              </div>
            </div>
            <div className="flex gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                />
              </div>
              <button
                onClick={() => {}}
                className="px-6 py-3 rounded-xl border border-border dark:border-gray-700 bg-white dark:bg-dark-secondary text-primary-text dark:text-white flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Filter className="h-4 w-4" /> Filter
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === "All"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                  : "bg-gray-100 dark:bg-gray-800 text-primary-text dark:text-white border border-border dark:border-gray-700"
              }`}
            >
              All
            </button>
            {CATEGORIES.slice(1).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all border border-border dark:border-gray-700 bg-white dark:bg-dark-secondary text-primary-text dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 ${activeCategory === cat ? "bg-blue-600 text-white" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-secondary-text dark:text-gray-400">
                  No projects found matching your criteria.
                </p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/portfolio/${project.slug}`}
                  className="group block"
                >
                  <div className="card-premium hover:border-blue-600 dark:hover:border-blue-800/50">
                    <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white font-medium">View Project</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-blue-600 dark:text-electric-blue uppercase tracking-wider mb-2 block">
                      {project.category}
                    </span>
                    <h3 className="text-lg font-semibold text-primary-text dark:text-white mb-3">
                      {project.title}
                    </h3>
                    <p className="text-secondary-text dark:text-gray-300 text-sm leading-relaxed mb-6">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-secondary-text dark:text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
