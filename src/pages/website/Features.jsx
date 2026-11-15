import React from "react";
import { FEATURES_DATA } from "../../data";
import { SectionHeader } from "../../components/website/Hero";

export default function Features() {
  return (
    <div className="min-h-screen bg-ivory text-charcoal dark:bg-charcoal-dark dark:text-white">
      <section className="py-20 lg:py-32">
        <div className="container-premium">
          <SectionHeader
            title="Our Features & Capabilities"
            description="Qualities that define GrowthVerse digital solutions."
          />
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES_DATA.map((feature, idx) => (
              <div
                key={feature.id}
                className="card-premium"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-forest-light text-forest-dark">
                  <span className="text-[20px]">●</span>
                </div>
                <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-3">
                  {feature.name}
                </h3>
                <p className="text-muted dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <span className="mt-4 inline-block px-3 py-1 rounded-full text-xs font-medium bg-forest-light text-forest-dark">
                  {feature.category}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-20 lg:mt-24">
            <div className="text-center mb-16">
              <h2 className="text-h3 mb-6">What Makes Our Solutions Different</h2>
              <p className="text-muted dark:text-gray-400 max-w-2xl mx-auto">
                A business-first approach to every digital project.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-forest-light flex items-center justify-center text-forest-dark flex-shrink-0">
                    <span className="text-[16px]">●</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal dark:text-white mb-2">Responsive by Default</h4>
                    <p className="text-muted dark:text-gray-400 text-sm">
                      Every interface adapts seamlessly to desktop, tablet, and mobile devices.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-forest-light flex items-center justify-center text-forest-dark flex-shrink-0">
                    <span className="text-[16px]">●</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal dark:text-white mb-2">Scalable Architecture</h4>
                    <p className="text-muted dark:text-gray-400 text-sm">
                      Built to grow with your business from startup to enterprise scale.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-forest-light flex items-center justify-center text-forest-dark flex-shrink-0">
                    <span className="text-[16px]">●</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal dark:text-white mb-2">Technology-Focused</h4>
                    <p className="text-muted dark:text-gray-400 text-sm">
                      Modern stacks including React, Tailwind CSS, and AI integration capabilities.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-forest-light flex items-center justify-center text-forest-dark flex-shrink-0">
                    <span className="text-[16px]">●</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal dark:text-white mb-2">Transparent Collaboration</h4>
                    <p className="text-muted dark:text-gray-400 text-sm">
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
