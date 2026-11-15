import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../../components/common/Button";
import { SectionHeader } from "../../components/website/Hero";

const DEV_PRICING_INR = {
  min: "₹4,000",
  max: "₹6,000",
  includes: [
    "Website/project development",
    "Responsive design",
    "Mobile-friendly implementation",
    "Basic UI customization",
    "Deployment assistance where applicable",
    "Three months of free support and maintenance",
  ],
  note: "One-time project pricing. Final quotation depends on project scope and requirements.",
};

const DEV_PRICING_USD = {
  min: "$1,000",
  max: "$1,500",
  includes: [
    "Website/project development",
    "Responsive design",
    "Mobile-friendly implementation",
    "Basic UI customization",
    "Deployment assistance where applicable",
    "Three months of free support and maintenance",
  ],
  note: "One-time project pricing. Final quotation depends on project scope and requirements.",
};

const MAINT_PRICING_INR = [
  { name: "Monthly", price: "₹1,000", period: "Per month" },
  { name: "Quarterly", price: "₹4,000", period: "Per 3 months" },
  { name: "Yearly", price: "₹11,000", period: "Per year" },
];

const MAINT_PRICING_USD = [
  { name: "Monthly", price: "$300", period: "Per month" },
  { name: "Quarterly", price: "$1,200", period: "Per 3 months" },
  { name: "Yearly", price: "$2,200", period: "Per year" },
];

const MAINTENANCE_INCLUDES = [
  "Website maintenance",
  "Technical support",
  "Minor website modifications",
  "Content and text modifications",
  "Basic UI adjustments",
  "Bug fixes",
  "General website assistance",
];

const PRICING_TERMS = [
  "Development pricing is a one-time project charge.",
  "Three months of support and maintenance are included after project delivery.",
  "Paid maintenance plans are optional after the included support period.",
  "Maintenance plans cover reasonable minor modifications and technical support.",
  "New features, major redesigns, and substantial scope changes require separate quotations.",
  "The precise scope of support and turnaround time should be agreed with the customer.",
];

export default function Pricing() {
  const [currency, setCurrency] = useState("INR");

  const devPricing = currency === "INR" ? DEV_PRICING_INR : DEV_PRICING_USD;
  const maintPricing = currency === "INR" ? MAINT_PRICING_INR : MAINT_PRICING_USD;
  const currencySymbol = currency === "INR" ? "₹" : "$";

  return (
    <div className="min-h-screen bg-ivory text-charcoal dark:bg-charcoal-dark dark:text-white">
      <section className="py-20 lg:py-32">
        <div className="container-premium">
          <SectionHeader
            title="Transparent Pricing"
            description="Simple, honest pricing for development and ongoing support."
          />

          {/* Development Pricing Section */}
          <div className="mb-20 lg:mb-24">
            <div className="text-center mb-12">
              <h2 className="text-h3 mb-4">Website Development Pricing</h2>
              <p className="text-muted dark:text-gray-400">
                One-time project development charges.
              </p>
            </div>
            <div className="card-premium p-8 lg:p-12 rounded-xl border border-border dark:border-dark-border">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h3 className="text-h3 mb-2">{currency === "INR" ? "Indian Customers" : "International Customers"}</h3>
                  <div className="text-5xl font-display font-bold text-charcoal dark:text-white mb-2">
                    {devPricing.min} – {devPricing.max}
                  </div>
                  <p className="text-muted dark:text-gray-400 text-sm mb-4">
                    One-time project pricing. Final quotation depends on project scope and requirements.
                  </p>
                  <h4 className="font-semibold text-charcoal dark:text-white mb-3">Includes</h4>
                  <ul className="space-y-2 mb-6">
                    {devPricing.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted dark:text-gray-400">
                        <span className="w-4 h-4 rounded-full bg-forest-light flex-shrink-0 mt-0.5 flex items-center justify-center text-forest-dark">
                          <span className="text-[10px]">✓</span>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 border-t border-border dark:border-dark-border lg:border-t-0 lg:border-l pt-6 lg:pt-0">
                  <a href="/contact" className="btn-primary w-full lg:w-auto">
                    Discuss Your Project
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Pricing Section */}
          <div className="mb-20 lg:mb-24">
            <div className="text-center mb-8">
              <h2 className="text-h3 mb-4">Ongoing Maintenance &amp; Support</h2>
              <p className="text-muted dark:text-gray-400 text-sm">
                Optional plans after the included three-month free support period.
              </p>
            </div>

            {/* Currency Switcher */}
            <div className="flex items-center justify-center mb-10">
              <div className="inline-flex p-1 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-charcoal-dark">
                <button
                  onClick={() => setCurrency("INR")}
                  className={`px-6 py-2 rounded text-sm font-medium transition-all ${
                    currency === "INR"
                      ? "bg-forest text-white shadow-sm"
                      : "text-muted dark:text-gray-400 hover:text-forest dark:hover:text-forest-light"
                  }`}
                >
                  INR (India)
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-6 py-2 rounded text-sm font-medium transition-all ${
                    currency === "USD"
                      ? "bg-forest text-white shadow-sm"
                      : "text-muted dark:text-gray-400 hover:text-forest dark:hover:text-forest-light"
                  }`}
                >
                  USD (International)
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {maintPricing.map((plan, idx) => (
                <div
                  key={plan.name}
                  className={`card-premium p-8 rounded-xl border border-border dark:border-dark-border transition-all ${
                    idx === 2
                      ? "border-forest/50 bg-forest-light/50"
                      : ""
                  }`}
                >
                  <h4 className="font-semibold text-charcoal dark:text-white mb-2">{plan.name}</h4>
                  <div className="text-3xl font-display font-bold text-charcoal dark:text-white mb-1">
                    {plan.price}
                  </div>
                  <p className="text-muted dark:text-gray-400 text-sm mb-6">{plan.period}</p>
                  <a href="/contact" className="btn-secondary w-full">
                    Choose a Maintenance Plan
                  </a>
                  {idx === 2 && (
                    <p className="mt-4 text-xs text-forest-dark dark:text-forest-light text-center font-medium">
                      Most popular
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 lg:mt-12">
              <h5 className="font-semibold text-charcoal dark:text-white mb-3">Included Services</h5>
              <ul className="space-y-2 max-w-md mx-auto">
                {MAINTENANCE_INCLUDES.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted dark:text-gray-400">
                    <span className="w-4 h-4 rounded-full bg-forest-light flex-shrink-0 mt-0.5 flex items-center justify-center text-forest-dark">
                      <span className="text-[10px]">✓</span>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Transparency Terms */}
          <div className="card-premium p-8 lg:p-12 rounded-xl border border-border dark:border-dark-border bg-surface dark:bg-charcoal">
            <h5 className="font-semibold text-charcoal dark:text-white mb-4">Important Terms</h5>
            <ul className="space-y-3 text-sm text-muted dark:text-gray-400 leading-relaxed">
              {PRICING_TERMS.map((term, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-0.5 text-forest-dark dark:text-forest-light">•</span>
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
