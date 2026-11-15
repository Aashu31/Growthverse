import React from "react";
import { Link } from "react-router-dom";
import { LuArrowRight } from "lucide-react";
import { SERVICES_DATA, CATEGORIES } from "../../data";

export default function Services() {
  const [activeCategory, setActiveCategory] = React.useState("All");

  const filteredServices =
    activeCategory === "All"
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      <section className="py-20 lg:py-32">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-h2 mb-4">Our Services</h2>
            <p className="text-lg text-secondary-text max-w-2xl mx-auto">
              Explore our complete range of digital technology solutions.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mb-12">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === "All"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                  : "bg-gray-100 dark:bg-gray-800 text-primary-text dark:text-white border border-border dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all border border-border dark:border-gray-700 bg-white dark:bg-dark-secondary text-primary-text dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-electric-blue ${activeCategory === cat ? "bg-blue-600 text-white" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                className="group block"
              >
                <div className="card-premium hover:border-blue-600 dark:hover:border-blue-800/50">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${service.iconColor} bg-opacity-10 group-hover:bg-opacity-20 transition-colors">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-blue-600 dark:text-electric-blue uppercase tracking-wider mb-2 block">
                    {service.category}
                  </span>
                  <h3 className="text-xl font-semibold text-primary-text dark:text-white mb-3">
                    {service.name}
                  </h3>
                  <p className="text-secondary-text dark:text-gray-300 text-sm leading-relaxed mb-6">
                    {service.shortDescription}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border dark:border-gray-700">
                    <span className="text-sm font-medium text-primary-text dark:text-white">
                      {service.priceRange}
                    </span>
                    <span className="text-sm font-medium text-blue-600 dark:text-electric-blue">
                      View Details <LuArrowRight className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
