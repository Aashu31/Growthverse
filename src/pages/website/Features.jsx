import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, Layers, Code2, Users } from "lucide-react";
import { FEATURES_DATA } from "../../data";
import { SectionHeader } from "../../components/website/Hero";

export default function Features() {
  return (
    <div className="min-h-screen bg-espresso text-light-text selection:bg-champagne selection:text-espresso">
      {/* Hero Header */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-espresso via-deep-coffee to-espresso overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container-premium relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-champagne/10 text-champagne border border-champagne/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Architectural Standards</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-light-text">
            Features & Engineering{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-champagne via-light-gold to-caramel">
              Capabilities.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-warm-grey leading-relaxed">
            The technical qualities and architectural standards that distinguish GrowthVerse
            digital products in real-world performance.
          </p>
        </div>
      </section>

      {/* Features Grid (Warm Cream Palette) */}
      <section className="py-20 lg:py-28 bg-[#FFF8ED] text-dark-text relative">
        <div className="container-premium">
          <SectionHeader
            title="Engineered for Scalable Performance"
            description="Every website and application we deploy conforms to these core benchmarks."
            badge="Specifications"
            dark={false}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES_DATA.map((feature, idx) => (
              <div
                key={feature.id}
                className="p-8 rounded-3xl bg-white border border-gv-border shadow-sm hover:shadow-card-warm-lg hover:border-champagne transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-sand-beige/60 border border-champagne/30 flex items-center justify-center text-caramel group-hover:bg-caramel group-hover:text-white transition-colors">
                      <Zap className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sand-beige/60 text-caramel border border-champagne/20">
                      {feature.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-dark-text mb-2 group-hover:text-caramel transition-colors">
                    {feature.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-dark-mocha/70 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-sand-beige/60 flex items-center gap-2 text-xs font-semibold text-caramel">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Standard on all deployments</span>
                </div>
              </div>
            ))}
          </div>

          {/* Differentiating Deep Dive */}
          <div className="mt-20 lg:mt-28 p-8 sm:p-14 rounded-3xl bg-espresso text-light-text border border-champagne/30 shadow-2xl">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-champagne block mb-2">
                Why It Matters
              </span>
              <h3 className="text-3xl font-serif font-bold text-light-text">
                What Makes Our Solutions Different
              </h3>
              <p className="text-xs sm:text-sm text-warm-grey mt-2">
                A business-first approach that directly translates technical performance into
                customer retention.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-champagne/15 border border-champagne/30 flex items-center justify-center text-champagne shrink-0 mt-1">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-light-text mb-1">
                      Responsive by Default
                    </h4>
                    <p className="text-xs text-warm-grey leading-relaxed">
                      Every layout is designed across mobile, tablet, laptop, and ultra-wide
                      screens without awkward clipping or horizontal scroll.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-champagne/15 border border-champagne/30 flex items-center justify-center text-champagne shrink-0 mt-1">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-light-text mb-1">
                      Scalable Component Architecture
                    </h4>
                    <p className="text-xs text-warm-grey leading-relaxed">
                      Built with modern modular React and Tailwind CSS tokens, ensuring your
                      team can maintain and extend the codebase effortlessly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-champagne/15 border border-champagne/30 flex items-center justify-center text-champagne shrink-0 mt-1">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-light-text mb-1">
                      High-Velocity Loading Speed
                    </h4>
                    <p className="text-xs text-warm-grey leading-relaxed">
                      Optimized asset bundling, minimal re-renders, and fast page response
                      elevate your Core Web Vitals and organic search rank.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-champagne/15 border border-champagne/30 flex items-center justify-center text-champagne shrink-0 mt-1">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-light-text mb-1">
                      Transparent Collaboration & Support
                    </h4>
                    <p className="text-xs text-warm-grey leading-relaxed">
                      Direct engineering access, weekly milestone updates, and three months
                      of complimentary maintenance after launch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-deep-coffee text-light-text text-center border-t border-champagne/15">
        <div className="container-premium max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-serif font-bold text-light-text">
            Build With Modern Architectural Quality
          </h2>
          <p className="text-sm text-warm-grey">
            Let's discuss how our capabilities fit your upcoming digital milestones.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-champagne via-caramel to-champagne text-espresso font-bold text-xs inline-flex items-center gap-2 shadow-lg hover:shadow-glow-gold transition-all"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
