import React from "react";
import { Link } from "react-router-dom";
import { PRICING_DATA } from "../../data";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      <section className="py-20 lg:py-32">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-h2 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-secondary-text max-w-2xl mx-auto">
              Choose the plan that fits your business needs.
            </p>
          </div>
          <p className="text-secondary-text dark:text-gray-300 text-center max-w-xl mx-auto mb-16">
            Pricing amounts are demonstration values until actual company
            pricing is supplied.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING_DATA.map((plan) => (
              <div
                key={plan.id}
                className={`card-premium relative ${
                  plan.popular
                    ? "border-blue-600 dark:border-blue-800/50 ring-1 ring-blue-600/20"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-blue-600/25">
                    Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-primary-text dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-secondary-text dark:text-gray-300 text-sm mb-6">
                  {plan.description}
                </p>
                <div className="mb-8">
                  <span className="text-h1 font-bold text-primary-text dark:text-white">
                    {plan.currency === "USD" ? "$" : ""}{plan.price}
                  </span>
                  <span className="text-secondary-text dark:text-gray-400 text-sm">
                    /{plan.billingType}
                  </span>
                </div>
                <h4 className="font-semibold text-primary-text dark:text-white mb-3">
                  Included Features
                </h4>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-secondary-text dark:text-gray-300 text-sm">
                      <svg className="h-4 w-4 flex-shrink-0 mt-0.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <h4 className="font-semibold text-primary-text dark:text-white mb-3">
                  Limitations
                </h4>
                <ul className="space-y-2 mb-8">
                  {plan.limitations.map((lim, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-secondary-text dark:text-gray-400 text-sm">
                      <span className="text-orange-500">-</span>
                      {lim}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`block text-center py-4 rounded-xl font-semibold transition-colors ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25"
                      : "bg-white dark:bg-dark-secondary text-primary-text dark:text-white border border-border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {plan.price === 0 ? "Get Custom Quote" : "Select Plan"}
                </Link>
              </div>
            ))}
            <div className="lg:col-span-1">
              <div className="card-premium">
                <h3 className="text-xl font-semibold text-primary-text dark:text-white mb-6">
                  Enterprise / Custom
                </h3>
                <p className="text-secondary-text dark:text-gray-300 text-sm mb-8">
                  Need a tailored solution for your organization? Contact us for
                  custom pricing and dedicated support.
                </p>
                <Link
                  to="/contact"
                  className="block text-center py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                >
                  Request Custom Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50 dark:bg-dark-secondary">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-h2 mb-4">Pricing FAQ</h2>
            <p className="text-lg text-secondary-text max-w-2xl mx-auto">
              Common questions about our pricing plans.
            </p>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {[
              {
                q: "Are these prices real?",
                a: "No. Pricing amounts are demonstration values until actual company pricing is supplied.",
              },
              {
                q: "Can I change plans later?",
                a: "Yes. You can upgrade or downgrade your plan at any time.",
              },
              {
                q: "Is there a free trial?",
                a: "Contact us to discuss trial options for your business needs.",
              },
              {
                q: "What payment methods are accepted?",
                a: "This is a frontend demonstration. No real payment processing is available.",
              },
            ].map(({ q, a }, idx) => (
              <div key={idx} className="border border-border dark:border-gray-700 rounded-xl overflow-hidden">
                <button className="w-full flex items-center justify-between px-6 py-4 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none">
                  <span className="font-medium text-primary-text dark:text-white">{q}</span>
                  <svg className="h-5 w-5 text-secondary-text transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="px-6 pb-4 border-t border-border dark:border-gray-700 text-secondary-text dark:text-gray-300 text-sm">
                  {a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
