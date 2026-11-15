import React from "react";
import { FEATURES_DATA } from "../../data";

export default function Features() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      <section className="py-20 lg:py-32">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-h2 mb-4">Our Features & Capabilities</h2>
            <p className="text-lg text-secondary-text max-w-2xl mx-auto">
              Qualities that define GrowthVerse digital solutions.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES_DATA.map((feature, idx) => (
              <div
                key={feature.id}
                className="card-premium"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gray-100 dark:bg-dark-secondary text-blue-600 dark:text-electric-blue">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary-text dark:text-white mb-3">
                  {feature.name}
                </h3>
                <p className="text-secondary-text dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <span className="mt-4 inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-electric-blue">
                  {feature.category}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-20 lg:mt-24">
            <div className="text-center mb-16">
              <h2 className="text-h2 mb-4">What Makes Our Solutions Different</h2>
              <p className="text-lg text-secondary-text max-w-2xl mx-auto">
                A business-first approach to every digital project.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-electric-blue flex-shrink-0">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-text dark:text-white mb-2">Responsive by Default</h4>
                    <p className="text-secondary-text dark:text-gray-300 text-sm">
                      Every interface adapts seamlessly to desktop, tablet, and mobile devices.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-electric-blue flex-shrink-0">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 112 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1a2 2 0 112-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-text dark:text-white mb-2">Scalable Architecture</h4>
                    <p className="text-secondary-text dark:text-gray-300 text-sm">
                      Built to grow with your business from startup to enterprise scale.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-electric-blue flex-shrink-0">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0 4a2 2 0 100 4m0 4a2 2 0 100 4m0 4a2 2 0 100 4m0-4V2m0 2a2 2 0 100 4m0 4a2 2 0 100 4m0 4a2 2 0 100 4m0 4a2 2 0 100 4m0-4V2m0 2a2 2 0 100 4m0 4a2 2 0 100 4m0 4a2 2 0 100 4m0-4V2m0 2a2 2 0 100 4m0 4a2 2 0 100 4m0 4a2 2 0 100 4m0 4a2 2 0 100 4m0-4V2" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-text dark:text-white mb-2">Technology-Focused</h4>
                    <p className="text-secondary-text dark:text-gray-300 text-sm">
                      Modern stacks including React, Tailwind CSS, and AI integration capabilities.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-electric-blue flex-shrink-0">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-text dark:text-white mb-2">Transparent Collaboration</h4>
                    <p className="text-secondary-text dark:text-gray-300 text-sm">
                      Clear communication and regular progress updates throughout your project.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
