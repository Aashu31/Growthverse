import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Sparkles, Clock, ShieldCheck, Tag } from "lucide-react";
import { SERVICES_DATA } from "../../data";
import { getServiceImage } from "../../data/serviceImages";

export default function ServiceDetails() {
  const { slug } = useParams();
  const service = SERVICES_DATA.find((s) => s.slug === slug);
  const [websiteAudience, setWebsiteAudience] = useState("India");

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-espresso text-light-text p-6">
        <div className="text-center max-w-md">
          <div className="text-4xl font-serif font-bold text-champagne mb-4">Service Not Found</div>
          <p className="text-sm text-warm-grey mb-6">
            The service you requested could not be located in our directory.
          </p>
          <Link
            to="/services"
            className="px-6 py-3 rounded-full bg-champagne text-espresso text-xs font-bold inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Services</span>
          </Link>
        </div>
      </div>
    );
  }

  const isWebsiteDevelopment = service.slug === "website-development";
  const websitePricing =
    websiteAudience === "India" ? "₹4,000 – ₹6,000" : "$1,000 – $1,500";

  return (
    <div className="min-h-screen bg-espresso text-light-text selection:bg-champagne selection:text-espresso">
      {/* Hero Header */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-espresso via-deep-coffee to-espresso overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container-premium relative z-10 max-w-4xl space-y-6">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold text-champagne hover:text-light-gold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Services</span>
          </Link>

          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-champagne/15 text-champagne border border-champagne/30">
            {service.category}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-light-text">
            {service.name}
          </h1>

          <p className="text-base sm:text-lg text-warm-grey leading-relaxed max-w-2xl">
            {service.description}
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-champagne to-caramel text-espresso font-bold text-xs inline-flex items-center gap-2 shadow-lg hover:shadow-glow-gold transition-all"
            >
              <span>Request Project Proposal</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="px-6 py-3.5 rounded-full border border-champagne/30 text-light-text hover:text-champagne font-semibold text-xs transition-colors"
            >
              View Pricing Structure
            </Link>
          </div>
        </div>
      </section>

      {/* Main Body (Warm Cream Palette) */}
      <section className="py-20 lg:py-28 bg-[#FFF8ED] text-dark-text relative">
        <div className="container-premium">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Left Content Area */}
            <div className="lg:col-span-8 space-y-10">
              {/* Featured Service Visual Asset */}
              {getServiceImage(service.slug) && (
                <div className="relative rounded-3xl overflow-hidden border border-champagne/30 shadow-xl bg-sand-beige/20 group">
                  <img
                    src={getServiceImage(service.slug)}
                    alt={service.name}
                    className="w-full h-72 sm:h-96 object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-espresso/80 backdrop-blur-md border border-champagne/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-champagne tracking-widest block">
                        Engineering Specification
                      </span>
                      <span className="text-sm font-serif font-bold text-light-text">
                        {service.name} Architectural Setup
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-champagne/20 flex items-center justify-center text-champagne">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}

              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-gv-border shadow-sm space-y-6">
                <h2 className="text-2xl font-serif font-bold text-dark-text">Overview & Capabilities</h2>
                <p className="text-sm text-dark-mocha/80 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-serif font-bold text-dark-text">Included Specifications</h3>
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-dark-mocha">
                        <CheckCircle2 className="w-4 h-4 text-caramel shrink-0" />
                        <span className="font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Business Value Addressed */}
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-gv-border shadow-sm space-y-4">
                <h3 className="text-xl font-serif font-bold text-dark-text">Strategic Business Outcomes</h3>
                <p className="text-xs sm:text-sm text-dark-mocha/70 leading-relaxed">
                  GrowthVerse solutions are not just functional; they are engineered to resolve primary commercial bottlenecks:
                </p>
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#F6EBDD] border border-gv-border/60">
                    <div className="text-sm font-bold font-serif text-dark-text mb-1">Conversion Velocity</div>
                    <div className="text-xs text-dark-mocha/70">Engineered user funnels designed to turn organic impressions into customers.</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F6EBDD] border border-gv-border/60">
                    <div className="text-sm font-bold font-serif text-dark-text mb-1">Scalable Architecture</div>
                    <div className="text-xs text-dark-mocha/70">Clean React and Node architecture that avoids costly rewrites as traffic grows.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sticky Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Engagement Meta Card */}
              <div className="p-8 rounded-3xl bg-espresso text-light-text border border-champagne/30 shadow-xl space-y-6">
                <h3 className="text-lg font-serif font-bold text-light-text border-b border-white/10 pb-3">
                  Service Snapshot
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-warm-grey">Category</span>
                    <span className="font-semibold text-champagne">{service.category}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-warm-grey">Typical Timeline</span>
                    <span className="font-semibold text-light-text">{service.timeline}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-warm-grey">Service Status</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-900/40 text-green-300 border border-green-500/30">
                      Active Delivery
                    </span>
                  </div>
                </div>

                {isWebsiteDevelopment && (
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <span className="text-xs uppercase tracking-wider text-champagne font-bold block">
                      Approved Pricing
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setWebsiteAudience("India")}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          websiteAudience === "India"
                            ? "bg-champagne text-espresso"
                            : "bg-white/10 text-warm-grey hover:text-light-text"
                        }`}
                      >
                        India
                      </button>
                      <button
                        type="button"
                        onClick={() => setWebsiteAudience("International")}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          websiteAudience === "International"
                            ? "bg-champagne text-espresso"
                            : "bg-white/10 text-warm-grey hover:text-light-text"
                        }`}
                      >
                        International
                      </button>
                    </div>

                    <div className="text-2xl font-serif font-bold text-champagne">
                      {websitePricing}
                    </div>

                    <p className="text-[11px] text-warm-grey leading-relaxed">
                      One-time package including 3 months free support & ongoing maintenance.
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    to="/contact"
                    className="w-full py-3 text-center rounded-xl bg-gradient-to-r from-champagne to-caramel text-espresso font-bold text-xs block shadow hover:shadow-glow-gold transition-all"
                  >
                    Start Project Enquiry
                  </Link>
                </div>
              </div>

              {/* Related Services */}
              <div className="p-6 rounded-3xl bg-white border border-gv-border shadow-sm space-y-3">
                <h4 className="text-sm font-serif font-bold text-dark-text border-b border-sand-beige/60 pb-2">
                  Related Disciplines
                </h4>
                {SERVICES_DATA.filter((s) => s.id !== service.id).slice(0, 3).map((r) => (
                  <Link
                    key={r.id}
                    to={`/services/${r.slug}`}
                    className="block p-3 rounded-xl hover:bg-sand-beige/40 transition-colors group"
                  >
                    <div className="text-xs font-bold text-dark-text group-hover:text-caramel transition-colors">
                      {r.name}
                    </div>
                    <div className="text-[11px] text-dark-mocha/60 line-clamp-1 mt-0.5">
                      {r.shortDescription}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
