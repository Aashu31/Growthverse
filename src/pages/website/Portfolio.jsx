import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Sparkles, ArrowUpRight, ArrowRight } from "lucide-react";
import { PORTFOLIO_DATA } from "../../data";
import { SectionHeader } from "../../components/website/Hero";

const CATEGORIES = [
  "All",
  "Websites",
  "Web Applications",
  "UI/UX",
  "AI Solutions",
  "Branding",
];

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
    <div className="min-h-screen bg-espresso text-light-text selection:bg-champagne selection:text-espresso">
      {/* Hero Header */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-espresso via-deep-coffee to-espresso overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container-premium relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-champagne/10 text-champagne border border-champagne/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Selected Case Studies</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-light-text">
            Crafted for High Impact & <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-champagne via-light-gold to-caramel">
              Commercial Scale.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-warm-grey leading-relaxed">
            Explore our featured client engagements, digital platforms, and production
            applications built with modern frontend engineering.
          </p>
        </div>
      </section>

      {/* Projects Showcase (Warm Cream Palette) */}
      <section className="py-20 lg:py-28 bg-[#FFF8ED] text-dark-text relative">
        <div className="container-premium">
          {/* Controls: Search and Filter Pills */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-14">
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-champagne to-caramel text-espresso shadow-md"
                      : "bg-white border border-gv-border text-dark-text hover:border-champagne hover:bg-champagne/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-mocha/50" />
              <input
                type="text"
                placeholder="Search projects by keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gv-border bg-white text-xs font-medium text-dark-text focus:outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/20 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Grid of Projects */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-gv-border">
              <p className="text-sm text-dark-mocha/60">
                No projects matched your criteria. Try adjusting your search query.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/portfolio/${project.slug}`}
                  className="group rounded-3xl overflow-hidden bg-white border border-gv-border shadow-sm hover:shadow-card-warm-lg hover:border-champagne transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-sand-beige">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-espresso/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-5 py-2.5 rounded-full bg-champagne text-espresso font-semibold text-xs flex items-center gap-2 shadow-lg">
                        <span>Read Case Study</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-caramel mb-2 block">
                        {project.category}
                      </span>
                      <h3 className="text-2xl font-serif font-bold text-dark-text mb-2 group-hover:text-caramel transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-dark-mocha/70 leading-relaxed mb-6">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-sand-beige/60">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-md text-[11px] font-medium bg-sand-beige/60 text-dark-mocha"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-deep-coffee text-light-text text-center border-t border-champagne/15">
        <div className="container-premium max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-serif font-bold text-light-text">
            Have a Project You Would Like to Feature Here?
          </h2>
          <p className="text-sm text-warm-grey">
            We partner with startups and companies to launch extraordinary digital flagships.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-champagne via-caramel to-champagne text-espresso font-bold text-xs inline-flex items-center gap-2 shadow-lg hover:shadow-glow-gold transition-all"
            >
              <span>Build With GrowthVerse</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
