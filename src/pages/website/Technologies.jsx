import React from "react";
import { TECHNOLOGIES_DATA } from "../../data";
import { SectionHeader } from "../../components/website/Hero";

export default function Technologies() {
  return (
    <div className="min-h-screen bg-ivory text-charcoal dark:bg-charcoal-dark dark:text-white">
      <section className="py-20 lg:py-32">
        <div className="container-premium">
          <SectionHeader
            title="Technology Expertise"
            description="Capabilities and technologies we work with across digital solutions."
          />
          <p className="text-muted dark:text-gray-400 text-center max-w-2xl mx-auto mb-16">
            Technology listings represent company service capabilities and
            intended expertise. Not every technology listed is used in the
            GrowthVerse application itself.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(TECHNOLOGIES_DATA).map(([category, items], catIdx) => (
              <div key={category} className="col-span-full lg:col-span-1">
                <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-6 border-b border-border dark:border-dark-border pb-3 uppercase tracking-wider text-xs font-bold text-muted dark:text-gray-400">
                  {category.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <div className="space-y-3">
                  {items.map((tech, idx) => (
                    <div
                      key={tech.name}
                      className="p-4 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-charcoal-dark hover:bg-surface dark:hover:bg-charcoal transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-forest-light flex items-center justify-center text-forest-dark">
                          <span className="text-[12px]">●</span>
                        </div>
                        <span className="font-medium text-charcoal dark:text-white">{tech.name}</span>
                      </div>
                      <p className="text-xs text-muted dark:text-gray-400">
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
