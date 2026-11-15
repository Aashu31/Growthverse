import React from "react";
import { ArrowRight } from "lucide-react";
import { SERVICES_DATA, CATEGORIES } from "../../data";
import { SectionHeader } from "../../components/website/Hero";

export default function Services() {
  const [activeCategory, setActiveCategory] = React.useState("All");

  const filteredServices =
    activeCategory === "All"
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-ivory text-charcoal dark:bg-charcoal-dark dark:text-white">
      <section className="py-20 lg:py-32">
        <div className="container-premium">
          <SectionHeader
            title="Our Services"
            description="Explore our complete range of digital technology solutions."
          />
          <div className="flex flex-wrap gap-3 mb-12">
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
            {CATEGORIES.map((cat) => (
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
            {filteredServices.map((service) => (
              <a
                key={service.id}
                href={`/services/${service.slug}`}
                className="group block"
              >
                <div className="card-premium hover:border-forest/50 transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-forest-light text-forest-dark group-hover:bg-forest group-hover:text-white transition-colors">
                    <span className="text-[18px]">●</span>
                  </div>
                  <span className="text-xs font-medium text-forest-dark dark:text-forest-light uppercase tracking-wider mb-2 block">
                    {service.category}
                  </span>
                  <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-3">
                    {service.name}
                  </h3>
                  <p className="text-muted dark:text-gray-400 text-sm leading-relaxed mb-6">
                    {service.shortDescription}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border dark:border-dark-border">
                    <span className="text-sm font-medium text-charcoal dark:text-white">
                      {service.priceRange}
                    </span>
                    <span className="text-sm font-medium text-charcoal dark:text-white">
                      View Details <ArrowRight className="h-3 w-3 ml-1" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
