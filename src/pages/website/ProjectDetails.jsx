import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Sparkles, ExternalLink, Code2 } from "lucide-react";
import { PORTFOLIO_DATA } from "../../data";

export default function ProjectDetails() {
  const { slug } = useParams();
  const project = PORTFOLIO_DATA.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-espresso text-light-text p-6">
        <div className="text-center max-w-md">
          <div className="text-4xl font-serif font-bold text-champagne mb-4">Project Not Found</div>
          <p className="text-sm text-warm-grey mb-6">
            The requested portfolio case study could not be located.
          </p>
          <Link
            to="/portfolio"
            className="px-6 py-3 rounded-full bg-champagne text-espresso text-xs font-bold inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-espresso text-light-text selection:bg-champagne selection:text-espresso">
      {/* Project Hero Header */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-espresso via-deep-coffee to-espresso overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container-premium relative z-10 max-w-4xl space-y-6">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-semibold text-champagne hover:text-light-gold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Portfolio Projects</span>
          </Link>

          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-champagne/15 text-champagne border border-champagne/30">
            {project.category}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-light-text">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-warm-grey leading-relaxed max-w-2xl">
            {project.description}
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-champagne to-caramel text-espresso font-bold text-xs inline-flex items-center gap-2 shadow-lg hover:shadow-glow-gold transition-all"
            >
              <span>Visit Live Platform</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-full border border-champagne/30 text-light-text hover:text-champagne font-semibold text-xs transition-colors"
            >
              Build a Similar Solution
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Visual Image Banner */}
      <section className="bg-espresso pb-12">
        <div className="container-premium max-w-5xl">
          <div className="rounded-3xl overflow-hidden border border-champagne/30 shadow-2xl aspect-[16/9] bg-deep-coffee">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Project Breakdown (Warm Cream Palette) */}
      <section className="py-20 lg:py-28 bg-[#FFF8ED] text-dark-text relative">
        <div className="container-premium max-w-5xl">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-gv-border shadow-sm space-y-6">
                <h2 className="text-2xl font-serif font-bold text-dark-text">Project Overview</h2>
                <p className="text-sm text-dark-mocha/80 leading-relaxed">
                  {project.description}
                </p>

                <h3 className="text-lg font-serif font-bold text-dark-text pt-2">The Objective</h3>
                <p className="text-xs sm:text-sm text-dark-mocha/70 leading-relaxed">
                  To establish a distinctive, trustworthy digital flagship that communicates
                  market leadership, minimizes friction in key user journeys, and increases
                  conversion rates.
                </p>

                <h3 className="text-lg font-serif font-bold text-dark-text pt-2">Our Engineering Solution</h3>
                <p className="text-xs sm:text-sm text-dark-mocha/70 leading-relaxed">
                  Engineered using a modern React component library, responsive Tailwind styling,
                  deliberate typography hierarchy, and performant asset delivery.
                </p>
              </div>
            </div>

            {/* Sidebar Meta */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-8 rounded-3xl bg-espresso text-light-text border border-champagne/30 shadow-xl space-y-6">
                <h3 className="text-lg font-serif font-bold text-light-text border-b border-white/10 pb-3">
                  Engagement Meta
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-warm-grey">Discipline</span>
                    <span className="font-semibold text-champagne">{project.category}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-warm-grey">Status</span>
                    <span className="text-green-400 font-semibold">Production Live</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-champagne block">
                    Technologies Deployed
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-full text-[11px] font-semibold bg-deep-coffee text-light-text border border-champagne/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Link
                    to="/contact"
                    className="w-full py-3 text-center rounded-xl bg-gradient-to-r from-champagne to-caramel text-espresso font-bold text-xs block shadow hover:shadow-glow-gold transition-all"
                  >
                    Start a Similar Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
