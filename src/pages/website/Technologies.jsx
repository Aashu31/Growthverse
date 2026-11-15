import React from "react";
import { TECHNOLOGIES_DATA } from "../../data";

export default function Technologies() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      <section className="py-20 lg:py-32">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-h2 mb-4">Technology Expertise</h2>
            <p className="text-lg text-secondary-text max-w-2xl mx-auto">
              Capabilities and technologies we work with across digital solutions.
            </p>
          </div>
          <p className="text-secondary-text dark:text-gray-300 text-center max-w-2xl mx-auto mb-16">
            Technology listings represent company service capabilities and
            intended expertise. Not every technology listed is used in the
            GrowthVerse application itself.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(TECHNOLOGIES_DATA).map(([category, items], catIdx) => (
              <div key={category} className="col-span-full lg:col-span-1">
                <h3 className="text-lg font-semibold text-primary-text dark:text-white mb-6 border-b border-border dark:border-gray-700 pb-3 uppercase tracking-wider text-xs font-bold text-secondary-text dark:text-gray-400">
                  {category.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <div className="space-y-3">
                  {items.map((tech, idx) => (
                    <div
                      key={tech.name}
                      className="p-4 rounded-xl border border-border dark:border-gray-700 bg-white dark:bg-dark-secondary hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-electric-blue">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
                          </svg>
                        </div>
                        <span className="font-medium text-primary-text dark:text-white">{tech.name}</span>
                      </div>
                      <p className="text-xs text-secondary-text dark:text-gray-400">
                        {tech.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
