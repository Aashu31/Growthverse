import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { PORTFOLIO_DATA } from "../../data";
import { SectionHeader } from "../../components/website/Hero";

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
    <div className="min-h-screen bg-ivory text-charcoal dark:bg-charcoal-dark dark:text-white">
      <section className="py-20 lg:py-32">
        <div className="container-premium">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
            <div>
              <SectionHeader
                title="Our Portfolio"
                description="Explore our featured projects and case studies."
              />
            </div>
            <div className="flex gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-charcoal-dark text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-forest/50 transition-colors"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === "All"
                  ? "bg-forest text-white shadow-md shadow-forest/20"
                  : "bg-surface dark:bg-charcoal text-charcoal dark:text-white border border-border dark:border-dark-border hover:bg-forest/10 dark:hover:bg-forest/5 hover:text-forest dark:hover:text-forest-light"
              }`}
            >
              All
            </button>
            {CATEGORIES.slice(1).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all border border-border dark:border-dark-border bg-white dark:bg-charcoal-dark text-charcoal dark:text-white hover:bg-surface dark:hover:bg-charcoal hover:text-forest dark:hover:text-forest-light ${activeCategory === cat ? "bg-forest text-white" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-muted dark:text-gray-400">
                  No projects found matching your criteria.
                </p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <a
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className="group block"
                >
                  <div className="card-premium hover:border-forest/50 transition-all">
                    <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white font-medium">View Project</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-forest-dark dark:text-forest-light uppercase tracking-wider mb-2 block">
                      {project.category}
                    </span>
                    <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-3">
                      {project.title}
                    </h3>
                    <p className="text-muted dark:text-gray-400 text-sm leading-relaxed mb-6">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded text-xs font-medium bg-surface dark:bg-charcoal text-charcoal dark:text-white"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
