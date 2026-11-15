import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import { SectionHeader } from "../../components/website/Hero";

const DEV_PRICING_INR = {
  min: "₹4,000",
  max: "₹6,000",
  includes: [
    "Full website and project development",
    "Mobile-responsive, modern architecture",
    "Tailwind CSS bespoke UI design",
    "Fast loading performance optimization",
    "SEO-ready page metadata structure",
    "Deployment assistance & DNS configuration",
    "Three months of free support and maintenance",
  ],
  note: "One-time project pricing. Final quotation depends on project scope and custom requirements.",
};

const DEV_PRICING_USD = {
  min: "$1,000",
  max: "$1,500",
  includes: [
    "Full website and project development",
    "Mobile-responsive, modern architecture",
    "Tailwind CSS bespoke UI design",
    "Fast loading performance optimization",
    "SEO-ready page metadata structure",
    "Deployment assistance & DNS configuration",
    "Three months of free support and maintenance",
  ],
  note: "One-time project pricing. Final quotation depends on project scope and custom requirements.",
};

const MAINT_PRICING_INR = [
  { name: "Monthly", price: "₹1,000", period: "Billed monthly" },
  { name: "Quarterly", price: "₹4,000", period: "Billed every 3 months" },
  { name: "Yearly", price: "₹11,000", period: "Billed annually (Best Value)" },
];

const MAINT_PRICING_USD = [
  { name: "Monthly", price: "$300", period: "Billed monthly" },
  { name: "Quarterly", price: "$1,200", period: "Billed every 3 months" },
  { name: "Yearly", price: "$2,200", period: "Billed annually (Best Value)" },
];

const MAINTENANCE_INCLUDES = [
  "Comprehensive technical support",
  "Regular package & dependency updates",
  "Minor website modifications & copy updates",
  "Layout & visual fine-tuning",
  "Security audits & SSL monitoring",
  "Rapid bug fixes & defect remediation",
  "General web assistance & consultation",
];

const PRICING_TERMS = [
  "Development pricing is a one-time project charge.",
  "Three months of free support and maintenance are included after project delivery.",
  "Paid maintenance plans are optional after the included support period.",
  "Maintenance plans cover reasonable minor modifications and technical support.",
  "New features, major redesigns, and substantial scope changes require separate quotations.",
  "The precise scope of support and turnaround time should be agreed with the customer.",
];

export default function Pricing() {
  const [currency, setCurrency] = useState("INR");

  const devPricing = currency === "INR" ? DEV_PRICING_INR : DEV_PRICING_USD;
  const maintPricing = currency === "INR" ? MAINT_PRICING_INR : MAINT_PRICING_USD;

  return (
    <div className="min-h-screen bg-espresso text-light-text selection:bg-champagne selection:text-espresso">
      {/* Hero Header */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-espresso via-deep-coffee to-espresso overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container-premium relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-champagne/10 text-champagne border border-champagne/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Honest & Transparent</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-light-text">
            Straightforward{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-champagne via-light-gold to-caramel">
              Pricing.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-warm-grey leading-relaxed">
            Approved one-time development rates with 3 months free maintenance, plus
            transparent ongoing support packages.
          </p>

          {/* Currency Toggle */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex p-1.5 rounded-full bg-deep-coffee border border-champagne/30 shadow-lg">
              <button
                type="button"
                onClick={() => setCurrency("INR")}
                className={`px-6 py-2 rounded-full text-xs font-semibold transition-all ${
                  currency === "INR"
                    ? "bg-gradient-to-r from-champagne to-caramel text-espresso shadow"
                    : "text-warm-grey hover:text-light-text"
                }`}
              >
                India (INR ₹)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`px-6 py-2 rounded-full text-xs font-semibold transition-all ${
                  currency === "USD"
                    ? "bg-gradient-to-r from-champagne to-caramel text-espresso shadow"
                    : "text-warm-grey hover:text-light-text"
                }`}
              >
                International (USD $)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Project Development Pricing Section */}
      <section className="py-20 bg-[#FFF8ED] text-dark-text relative">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-gv-border shadow-card-warm-lg p-8 sm:p-12">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-caramel">
                  One-Time Project Development
                </span>
                <h2 className="text-3xl font-serif font-bold text-dark-text">
                  Website Development Package
                </h2>
                <div className="text-4xl lg:text-5xl font-serif font-bold text-dark-text">
                  {devPricing.min} – {devPricing.max}
                </div>
                <p className="text-xs sm:text-sm text-dark-mocha/70 leading-relaxed">
                  {devPricing.note}
                </p>

                <div className="pt-4 border-t border-sand-beige/60 space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-dark-text block mb-2">
                    Package Inclusions:
                  </span>
                  {devPricing.includes.map((inc, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-dark-mocha">
                      <CheckCircle2 className="w-4 h-4 text-caramel shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-5 p-8 rounded-2xl bg-espresso text-light-text border border-champagne/30 space-y-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-champagne/15 border border-champagne/30 flex items-center justify-center text-champagne mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-serif font-bold text-light-text">
                    3 Months Included Support
                  </h4>
                  <p className="text-xs text-warm-grey mt-2 leading-relaxed">
                    Every project includes ninety days of zero-cost bug fixes, tweaks, and
                    maintenance following launch.
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-champagne to-caramel text-espresso font-bold text-xs block shadow hover:shadow-glow-gold transition-all"
                >
                  Discuss Your Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ongoing Maintenance Plans Section */}
      <section className="py-20 lg:py-28 bg-espresso text-light-text relative border-t border-champagne/15">
        <div className="container-premium">
          <SectionHeader
            title="Ongoing Maintenance & Support"
            description="Optional plans after your included 3-month free period to maintain peak security and content freshness."
            badge="Maintenance"
            dark={true}
          />

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            {maintPricing.map((plan, idx) => (
              <div
                key={plan.name}
                className={`p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                  idx === 2
                    ? "bg-deep-coffee border-champagne/60 shadow-glow-gold"
                    : "bg-deep-coffee/60 border-champagne/20"
                }`}
              >
                <div>
                  {idx === 2 && (
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-champagne text-espresso mb-4">
                      Most Popular
                    </span>
                  )}
                  <h4 className="text-lg font-serif font-bold text-light-text mb-1">
                    {plan.name} Plan
                  </h4>
                  <p className="text-xs text-warm-grey mb-4">{plan.period}</p>
                  <div className="text-3xl font-serif font-bold text-champagne mb-6">
                    {plan.price}
                  </div>
                </div>

                <Link
                  to="/contact"
                  className={`w-full py-3 rounded-xl text-center text-xs font-bold transition-all ${
                    idx === 2
                      ? "bg-gradient-to-r from-champagne to-caramel text-espresso shadow"
                      : "border border-champagne/30 text-light-text hover:border-champagne hover:text-champagne"
                  }`}
                >
                  Choose {plan.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Maintenance Inclusions List */}
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-deep-coffee/70 border border-champagne/20 space-y-4">
            <h4 className="text-base font-serif font-bold text-light-text text-center mb-4">
              What Ongoing Maintenance Covers
            </h4>
            <div className="grid sm:grid-cols-2 gap-3 text-xs text-warm-grey">
              {MAINTENANCE_INCLUDES.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-champagne shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Transparency & Terms (Warm Cream) */}
      <section className="py-20 bg-[#FFF8ED] text-dark-text relative">
        <div className="container-premium max-w-4xl mx-auto">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-gv-border shadow-sm space-y-6">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-5 h-5 text-caramel" />
              <h3 className="text-xl font-serif font-bold text-dark-text">Important Terms & Clarity</h3>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-dark-mocha/80 leading-relaxed">
              {PRICING_TERMS.map((term, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-caramel mt-2 shrink-0" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
