import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SERVICES_DATA } from "../../data";
import { SectionHeader } from "../../components/website/Hero";

export default function ServiceDetails() {
  const { slug } = useParams();
  const service = SERVICES_DATA.find((s) => s.slug === slug);
  const [websiteAudience, setWebsiteAudience] = React.useState("India");

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-dark">
        <div className="text-center">
          <h1 className="text-h2 text-white mb-4">Service Not Found</h1>
          <p className="text-gray-400 mb-6">
            The service you're looking for doesn't exist.
          </p>
          <a href="/services" className="btn-primary">
            Back to Services
          </a>
        </div>
      </div>
    );
  }

  const isWebsiteDevelopment = service.slug === "website-development";
  const websitePricing =
    websiteAudience === "India" ? "₹4,000 – ₹6,000" : "$1,000 – $1,500";

  return (
    <div className="min-h-screen bg-white dark:bg-charcoal-dark text-charcoal dark:text-white">
      <section className="relative bg-charcoal-dark py-24 lg:py-32 text-white">
        <div className="container-premium relative">
          <span className="badge-accent mb-4 block">{service.category}</span>
          <h1 className="text-h1 mb-6">{service.name}</h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            {service.description}
          </p>
          <div className="flex gap-4 mt-8">
            <a href="/contact" className="btn-primary">
              Start a Project
            </a>
            <a href="/services" className="btn-secondary">
              Back to Services
            </a>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="p-8 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-charcoal-dark">
                <h2 className="text-h3 mb-6">Overview</h2>
                <p className="text-muted dark:text-gray-400 leading-relaxed mb-6">
                  {service.description}
                </p>
                <h3 className="font-semibold text-charcoal dark:text-white mb-4">Key Capabilities</h3>
                <ul className="space-y-3">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-muted dark:text-gray-400">
                      <span className="w-5 h-5 rounded-full bg-forest-light flex-shrink-0 mt-0.5 flex items-center justify-center text-forest-dark">
                        <span className="text-[10px]">✓</span>
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-charcoal-dark">
                <h2 className="text-h3 mb-6">Business Problems Addressed</h2>
                <ul className="space-y-3 text-muted dark:text-gray-400 leading-relaxed">
                  <li>Establishing a professional digital presence</li>
                  <li>Reaching target audiences online</li>
                  <li>Converting visitors into customers</li>
                  <li>Maintaining a modern, responsive website</li>
                </ul>
              </div>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <div className="p-8 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-charcoal-dark">
                <h3 className="font-semibold text-charcoal dark:text-white mb-4">Service Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted dark:text-gray-400">Category</span>
                    <span className="text-charcoal dark:text-white">{service.category}</span>
                  </div>
                  {isWebsiteDevelopment ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted dark:text-gray-400 uppercase tracking-wider">
                          Audience
                        </span>
                        <button
                          onClick={() => setWebsiteAudience("India")}
                          className={`px-2 py-1 text-xs rounded border transition-colors ${websiteAudience === "India" ? "bg-forest text-white border-forest" : "border-border text-charcoal dark:text-white hover:bg-surface dark:hover:bg-charcoal"}`}
                        >
                          India
                        </button>
                        <button
                          onClick={() => setWebsiteAudience("International")}
                          className={`px-2 py-1 text-xs rounded border transition-colors ${websiteAudience === "International" ? "bg-forest text-white border-forest" : "border-border text-charcoal dark:text-white hover:bg-surface dark:hover:bg-charcoal"}`}
                        >
                          International
                        </button>
                      </div>
                      <div className="text-sm font-medium text-charcoal dark:text-white">
                        {websitePricing}
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted dark:text-gray-400">Pricing</span>
                      <span className="text-charcoal dark:text-white">
                        Request a Custom Quote
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted dark:text-gray-400">Timeline</span>
                    <span className="text-charcoal dark:text-white">{service.timeline}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted dark:text-gray-400">Status</span>
                    <span className="text-forest-dark dark:text-forest-light font-medium">{service.status}</span>
                  </div>
                </div>
              </div>
              {isWebsiteDevelopment && (
                <div className="p-8 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-charcoal-dark">
                  <h3 className="font-semibold text-charcoal dark:text-white mb-4">Project Development Pricing</h3>
                  <div className="space-y-4">
                    <p className="text-muted dark:text-gray-400 text-sm leading-relaxed">
                      One-time project development cost. Three months of free support and maintenance are included
                      after project delivery. Paid maintenance plans are optional thereafter.
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted dark:text-gray-400 uppercase tracking-wider">
                        Audience
                      </span>
                      <button
                        onClick={() => setWebsiteAudience("India")}
                        className={`px-2 py-1 text-xs rounded border transition-colors ${websiteAudience === "India" ? "bg-forest text-white border-forest" : "border-border text-charcoal dark:text-white hover:bg-surface dark:hover:bg-charcoal"}`}
                      >
                        India
                      </button>
                      <button
                        onClick={() => setWebsiteAudience("International")}
                        className={`px-2 py-1 text-xs rounded border transition-colors ${websiteAudience === "International" ? "bg-forest text-white border-forest" : "border-border text-charcoal dark:text-white hover:bg-surface dark:hover:bg-charcoal"}`}
                      >
                        International
                      </button>
                    </div>
                    <div className="text-sm font-medium text-charcoal dark:text-white">
                      {websitePricing}
                    </div>
                    <a href="/contact" className="btn-primary w-full">
                      Request Project Enquiry
                    </a>
                  </div>
                </div>
              )}
              <div className="p-8 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-charcoal-dark">
                <h3 className="font-semibold text-charcoal dark:text-white mb-4">Related Services</h3>
                <div className="space-y-3">
                  {SERVICES_DATA.filter((s) => s.id !== service.id).slice(0, 3).map((s) => (
                    <a
                      key={s.id}
                      href={`/services/${s.slug}`}
                      className="block p-4 rounded-xl border border-border dark:border-dark-border hover:bg-surface dark:hover:bg-charcoal transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-charcoal dark:text-white">{s.name}</span>
                        <span className="text-xs text-forest-dark dark:text-forest-light font-medium">{s.category}</span>
                      </div>
                      <p className="text-xs text-muted dark:text-gray-400">{s.shortDescription}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
