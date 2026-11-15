import React from "react";
import { useParams, Link } from "react-router-dom";
import { SERVICES_DATA } from "../../data";

export default function ServiceDetails() {
  const { slug } = useParams();
  const service = SERVICES_DATA.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark">
        <div className="text-center">
          <h1 className="text-h2 text-primary-text dark:text-white mb-4">Service Not Found</h1>
          <p className="text-secondary-text dark:text-gray-400 mb-6">
            The service you're looking for doesn't exist.
          </p>
          <Link to="/services" className="btn-primary">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      <section className="relative bg-dark py-24 lg:py-32 text-white">
        <div className="container-premium relative">
          <span className="text-blue-400 font-medium uppercase tracking-wider text-sm">
            {service.category}
          </span>
          <h1 className="text-h1 mb-6">{service.name}</h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            {service.description}
          </p>
          <div className="flex gap-4 mt-8">
            <Link to="/contact" className="btn-primary">
              Start a Project
            </Link>
            <Link to="/services" className="btn-secondary">
              Back to Services
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="bg-gray-50 dark:bg-dark-secondary rounded-3xl p-8 border border-border dark:border-gray-700">
                <h2 className="text-h3 mb-6">Overview</h2>
                <p className="text-secondary-text dark:text-gray-300 leading-relaxed mb-6">
                  {service.description}
                </p>
                <h3 className="font-semibold text-primary-text dark:text-white mb-4">Key Capabilities</h3>
                <ul className="space-y-3">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-secondary-text dark:text-gray-300">
                      <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-600 dark:text-electric-blue flex-shrink-0 flex items-center justify-center mt-0.5">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-dark-secondary rounded-3xl p-8 border border-border dark:border-gray-700">
                <h2 className="text-h3 mb-6">Business Problems Addressed</h2>
                <ul className="space-y-3 text-secondary-text dark:text-gray-300 leading-relaxed">
                  <li>Establishing a professional digital presence</li>
                  <li>Reaching target audiences online</li>
                  <li>Converting visitors into customers</li>
                  <li>Maintaining a modern, responsive website</li>
                </ul>
              </div>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <div className="p-8 rounded-3xl border border-border dark:border-gray-700 bg-gray-50 dark:bg-dark-secondary">
                <h3 className="font-semibold text-primary-text dark:text-white mb-4">Service Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text dark:text-gray-400">Category</span>
                    <span className="text-primary-text dark:text-white">{service.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text dark:text-gray-400">Price Range</span>
                    <span className="text-primary-text dark:text-white">{service.priceRange}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text dark:text-gray-400">Timeline</span>
                    <span className="text-primary-text dark:text-white">{service.timeline}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text dark:text-gray-400">Status</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">{service.status}</span>
                  </div>
                </div>
              </div>
              <div className="p-8 rounded-3xl border border-border dark:border-gray-700 bg-white dark:bg-dark-secondary">
                <h3 className="font-semibold text-primary-text dark:text-white mb-4">Related Services</h3>
                <div className="space-y-3">
                  {SERVICES_DATA.filter((s) => s.id !== service.id).slice(0, 3).map((s) => (
                    <Link
                      key={s.id}
                      to={`/services/${s.slug}`}
                      className="block p-4 rounded-xl border border-border dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-primary-text dark:text-white">{s.name}</span>
                        <span className="text-xs text-blue-600 dark:text-electric-blue font-medium">{s.category}</span>
                      </div>
                      <p className="text-xs text-secondary-text dark:text-gray-400">{s.shortDescription}</p>
                    </Link>
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
