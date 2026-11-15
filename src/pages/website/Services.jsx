import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { SERVICES_DATA, CATEGORIES } from "../../data";
import { getServiceImage } from "../../data/serviceImages";
import { SectionHeader } from "../../components/website/Hero";

export default function Services() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [websiteAudience, setWebsiteAudience] = useState("India");

  const filteredServices =
    activeCategory === "All"
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => s.category === activeCategory);

  const websitePricing =
    websiteAudience === "India" ? "₹4,000 – ₹6,000" : "$1,000 – $1,500";

  return (
    <div className="min-h-screen bg-espresso text-light-text selection:bg-champagne selection:text-espresso">
      {/* Hero Header */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-espresso via-deep-coffee to-espresso overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container-premium relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-champagne/10 text-champagne border border-champagne/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>End-to-End Solutions</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-light-text">
            Digital Engineering & <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-champagne via-light-gold to-caramel">
              Creative Capabilities.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-warm-grey leading-relaxed">
            From modern responsive web applications to full brand identities and AI automation,
            we engineer solutions that scale your enterprise.
          </p>
        </div>
      </section>

      {/* Services List Section (Warm Cream Palette) */}
      <section className="py-20 lg:py-28 bg-[#FFF8ED] text-dark-text relative">
        <div className="container-premium">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                activeCategory === "All"
                  ? "bg-gradient-to-r from-champagne to-caramel text-espresso shadow-md"
                  : "bg-white border border-gv-border text-dark-text hover:border-champagne hover:bg-champagne/10"
              }`}
            >
              All Services
            </button>
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

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, idx) => {
              const isWebDev = service.slug === "website-development";
              return (
                <div
                  key={service.id}
                  className={`group rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between ${
                    idx === 0
                      ? "bg-espresso text-light-text border-champagne/40 shadow-xl"
                      : "bg-white text-dark-text border-gv-border shadow-sm hover:shadow-card-warm-lg hover:border-champagne"
                  }`}
                >
                  <div>
                    {getServiceImage(service.slug) && (
                      <div className="relative mb-6 aspect-[16/10] rounded-2xl overflow-hidden border border-champagne/20 bg-sand-beige/30 shadow-inner group-hover:border-champagne/50 transition-colors">
                        <img
                          src={getServiceImage(service.slug)}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-t ${
                            idx === 0
                              ? "from-espresso/70 via-transparent to-transparent"
                              : "from-black/30 via-transparent to-transparent"
                          }`}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                          idx === 0
                            ? "bg-champagne/15 text-champagne border border-champagne/30"
                            : "bg-sand-beige/60 text-caramel border border-champagne/20"
                        }`}
                      >
                        {service.category}
                      </span>
                      <span
                        className={`text-xs ${
                          idx === 0 ? "text-warm-grey" : "text-dark-mocha/60"
                        }`}
                      >
                        {service.timeline}
                      </span>
                    </div>

                    <h3
                      className={`text-2xl font-serif font-bold mb-3 ${
                        idx === 0
                          ? "text-light-text group-hover:text-champagne"
                          : "text-dark-text group-hover:text-caramel"
                      } transition-colors`}
                    >
                      {service.name}
                    </h3>

                    <p
                      className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                        idx === 0 ? "text-warm-grey" : "text-dark-mocha/70"
                      }`}
                    >
                      {service.description}
                    </p>

                    {/* Features list */}
                    <div className="space-y-2 mb-8">
                      {service.features.slice(0, 4).map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          className={`flex items-center gap-2 text-xs ${
                            idx === 0 ? "text-light-text/90" : "text-dark-text"
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              idx === 0 ? "text-champagne" : "text-caramel"
                            }`}
                          />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom / Pricing & Detail Link */}
                  <div
                    className={`pt-5 border-t flex flex-col gap-3 ${
                      idx === 0 ? "border-white/10" : "border-sand-beige/60"
                    }`}
                  >
                    {isWebDev ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setWebsiteAudience("India");
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                                websiteAudience === "India"
                                  ? "bg-champagne text-espresso"
                                  : "bg-black/10 text-warm-grey"
                              }`}
                            >
                              India
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setWebsiteAudience("International");
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                                websiteAudience === "International"
                                  ? "bg-champagne text-espresso"
                                  : "bg-black/10 text-warm-grey"
                              }`}
                            >
                              Intl
                            </button>
                          </div>
                          <div className="text-sm font-serif font-bold text-champagne">
                            {websitePricing}
                          </div>
                        </div>

                        <Link
                          to={`/services/${service.slug}`}
                          className="px-4 py-2 rounded-full bg-champagne text-espresso font-semibold text-xs inline-flex items-center gap-1 shadow hover:bg-light-gold transition-colors"
                        >
                          <span>Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-medium ${
                            idx === 0 ? "text-warm-grey" : "text-dark-mocha/70"
                          }`}
                        >
                          Custom Scope
                        </span>
                        <Link
                          to={`/services/${service.slug}`}
                          className={`text-xs font-semibold inline-flex items-center gap-1 ${
                            idx === 0
                              ? "text-champagne hover:text-light-gold"
                              : "text-caramel hover:text-champagne"
                          } transition-colors`}
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-deep-coffee text-light-text border-t border-champagne/15 text-center">
        <div className="container-premium max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-serif font-bold text-light-text">
            Need a Customized Digital Architecture?
          </h2>
          <p className="text-sm text-warm-grey">
            We work closely with clients to build tailor-made solutions aligned with exact
            business parameters.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-champagne via-caramel to-champagne text-espresso font-bold text-xs inline-flex items-center gap-2 shadow-lg hover:shadow-glow-gold transition-all"
            >
              <span>Discuss Your Scope</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
