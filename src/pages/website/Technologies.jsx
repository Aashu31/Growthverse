import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Code2, Server, Cloud, Database, Cpu, Palette } from "lucide-react";
import { TECHNOLOGIES_DATA } from "../../data";
import { SectionHeader } from "../../components/website/Hero";

export default function Technologies() {
  return (
    <div className="min-h-screen bg-espresso text-light-text selection:bg-champagne selection:text-espresso">
      {/* Hero Header */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-espresso via-deep-coffee to-espresso overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container-premium relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-champagne/10 text-champagne border border-champagne/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modern Stacks</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-light-text">
            Technology{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-champagne via-light-gold to-caramel">
              Expertise.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-warm-grey leading-relaxed">
            Capabilities and frameworks we utilize across custom web applications, cloud
            infrastructure, and digital solutions.
          </p>

          <p className="text-xs text-warm-grey/70 max-w-xl mx-auto italic">
            Technology listings represent company service capabilities and intended expertise.
          </p>
        </div>
      </section>

      {/* Technology Category Grids (Warm Cream Palette) */}
      <section className="py-20 lg:py-28 bg-[#FFF8ED] text-dark-text relative">
        <div className="container-premium">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(TECHNOLOGIES_DATA).map(([category, items]) => (
              <div
                key={category}
                className="p-6 rounded-3xl bg-white border border-gv-border shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-6 border-b border-sand-beige/60 pb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-champagne" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-dark-mocha">
                      {category.replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {items.map((tech) => (
                      <div
                        key={tech.name}
                        className="p-3.5 rounded-xl bg-[#F6EBDD]/60 border border-gv-border/50 hover:border-champagne hover:bg-white transition-all group"
                      >
                        <div className="text-xs font-bold text-dark-text group-hover:text-caramel transition-colors">
                          {tech.name}
                        </div>
                        <p className="text-[11px] text-dark-mocha/70 mt-0.5 leading-relaxed">
                          {tech.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-sand-beige/60 text-[10px] text-dark-mocha/50 font-medium">
                  {items.length} Production Technologies
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-deep-coffee text-light-text text-center border-t border-champagne/15">
        <div className="container-premium max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-serif font-bold text-light-text">
            Have a Specific Stack in Mind?
          </h2>
          <p className="text-sm text-warm-grey">
            We adapt to your team's existing tech stack and infrastructure preferences.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-champagne via-caramel to-champagne text-espresso font-bold text-xs inline-flex items-center gap-2 shadow-lg hover:shadow-glow-gold transition-all"
            >
              <span>Consult Our Architects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
