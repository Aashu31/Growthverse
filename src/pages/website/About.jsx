import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Sparkles, Target, Compass, Award, ShieldCheck, HeartHandshake } from "lucide-react";
import { SectionHeader } from "../../components/website/Hero";
import workspaceImg from "../../assets/growthverse/about/growthverse-about-workspace.webp";

const TEAM_MEMBERS = [
  {
    name: "Product Architect",
    role: "System Architecture & Engineering",
    bio: "Specializes in high-performance React architectures, database schemas, and enterprise cloud deployments.",
  },
  {
    name: "Design Lead",
    role: "Creative Direction & UI/UX",
    bio: "Directs brand identity, typography systems, and high-conversion editorial interface experiences.",
  },
  {
    name: "Digital Growth Strategist",
    role: "Business Solutions & Scaling",
    bio: "Guides clients through digital modernization, organic search optimization, and technology growth levers.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-espresso text-light-text selection:bg-champagne selection:text-espresso">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-espresso via-deep-coffee to-espresso overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container-premium relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-champagne/10 text-champagne border border-champagne/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Story</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-light-text">
            A Digital Agency That Builds for{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-champagne via-light-gold to-caramel">
              Real Growth.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-warm-grey leading-relaxed">
            GrowthVerse is a digital technology studio dedicated to helping businesses,
            founders, and enterprises establish and scale their presence through
            thoughtful creative direction and modern engineering.
          </p>
        </div>
      </section>

      {/* Editorial Company Introduction (Warm Cream Section) */}
      <section className="py-20 lg:py-28 bg-[#FFF8ED] text-dark-text relative">
        <div className="container-premium">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-champagne/20 text-caramel border border-champagne/30">
                <Compass className="w-3.5 h-3.5" />
                <span>Who We Are</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-dark-text leading-tight">
                Crafting Digital Assets That Drive Measurable Outcomes
              </h2>

              <p className="text-sm sm:text-base text-dark-mocha/80 leading-relaxed">
                GrowthVerse was founded with a singular conviction: too many digital projects
                are either beautiful but technically broken, or technically competent yet
                uninspiring. We combine technical excellence with bespoke visual storytelling.
              </p>

              <p className="text-sm sm:text-base text-dark-mocha/80 leading-relaxed">
                Our team delivers frontend and full-stack solutions built with React,
                clean modern CSS, robust backend APIs, and deliberate design psychology. We
                believe that your digital product is your most powerful growth catalyst.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/services"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-champagne to-caramel text-espresso font-semibold text-xs inline-flex items-center gap-2 shadow-md hover:shadow-glow-gold transition-all"
                >
                  <span>Explore Our Services</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to="/contact"
                  className="px-6 py-3 rounded-full border border-gv-border text-dark-text font-semibold text-xs hover:border-champagne hover:bg-champagne/10 transition-all"
                >
                  Schedule a Consultation
                </Link>
              </div>
            </div>

            {/* Visual Panel with Workspace Photograph & Core Disciplines */}
            <div className="lg:col-span-6 space-y-6">
              <div className="relative rounded-3xl overflow-hidden border border-champagne/30 shadow-2xl group">
                <img
                  src={workspaceImg}
                  alt="GrowthVerse Design & Engineering Studio"
                  className="w-full h-64 sm:h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-espresso/80 backdrop-blur-md border border-champagne/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-champagne tracking-widest block">
                      Creative Studio & Labs
                    </span>
                    <span className="text-sm font-serif font-bold text-light-text">
                      GrowthVerse Engineering Headquarters
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-champagne/20 flex items-center justify-center text-champagne">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-espresso p-6 sm:p-8 border border-champagne/30 text-light-text shadow-xl space-y-4">
                <h3 className="text-lg font-serif font-bold text-light-text border-b border-white/10 pb-3">
                  GrowthVerse Core Disciplines
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { title: "Custom Web & SaaS", desc: "Performant React web applications" },
                    { title: "UI/UX Architecture", desc: "Design systems for conversion" },
                    { title: "AI & Automation", desc: "Process bots & smart workflows" },
                    { title: "Cloud & CI/CD", desc: "Scalable hosting & zero downtime" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-md bg-champagne/20 flex items-center justify-center text-champagne shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-light-text">{item.title}</div>
                        <div className="text-[11px] text-warm-grey mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission (Dark Interruption) */}
      <section className="py-20 lg:py-28 bg-deep-coffee text-light-text relative border-t border-b border-champagne/15">
        <div className="container-premium">
          <SectionHeader
            title="Our Strategic Foundations"
            description="Clear principles that govern every client engagement, architecture decision, and line of code."
            badge="Vision & Mission"
            dark={true}
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 sm:p-10 rounded-3xl bg-espresso/80 border border-champagne/25 shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-champagne/15 border border-champagne/30 flex items-center justify-center text-champagne mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-light-text">Our Vision</h3>
              <p className="text-sm text-warm-grey leading-relaxed">
                To become the benchmark for digital technology studios—where businesses
                partner to turn complex digital challenges into elegant, highly profitable,
                and scalable digital assets.
              </p>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl bg-espresso/80 border border-champagne/25 shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-champagne/15 border border-champagne/30 flex items-center justify-center text-champagne mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-light-text">Our Mission</h3>
              <p className="text-sm text-warm-grey leading-relaxed">
                To build high-converting digital products, transparent systems, and
                durable software that deliver real ROI without tech debt, bloated timelines,
                or generic templates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values (Warm Cream) */}
      <section className="py-20 lg:py-28 bg-[#FFF8ED] text-dark-text relative">
        <div className="container-premium">
          <SectionHeader
            title="Values That Guide Our Craft"
            description="The foundational standards that define our work and communication."
            badge="Culture"
            dark={false}
          />

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Engineering Excellence",
                desc: "We prioritize clean architecture, lightning-fast rendering, accessibility, and robust security in every system.",
                icon: Award,
              },
              {
                title: "Absolute Reliability",
                desc: "Transparent timelines, clear scopes, guaranteed 3 months free maintenance, and zero hidden surprises.",
                icon: ShieldCheck,
              },
              {
                title: "Partnership Focus",
                desc: "We treat your business with the care of a co-founder, aligning technology decisions directly with revenue growth.",
                icon: HeartHandshake,
              },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="p-8 rounded-2xl bg-white border border-gv-border shadow-sm hover:shadow-card-warm-lg hover:border-champagne transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-sand-beige/60 border border-champagne/30 flex items-center justify-center text-caramel mb-6 group-hover:bg-caramel group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-serif font-bold text-dark-text mb-2">
                    {v.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-dark-mocha/70 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Profiles */}
      <section className="py-20 lg:py-28 bg-espresso text-light-text relative border-t border-champagne/15">
        <div className="container-premium">
          <SectionHeader
            title="The Leadership & Engineering Core"
            description="A multidisciplinary collective dedicated to digital craft and performance."
            badge="Team"
            dark={true}
          />

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="p-8 rounded-3xl bg-deep-coffee/70 border border-champagne/20 text-center hover:border-champagne/50 transition-all group"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-champagne via-caramel to-deep-coffee p-[2px] mx-auto mb-6 shadow-glow-gold">
                  <div className="w-full h-full rounded-full bg-espresso flex items-center justify-center font-serif text-2xl font-bold text-champagne">
                    {member.name.charAt(0)}
                  </div>
                </div>
                <h4 className="text-lg font-serif font-bold text-light-text mb-1">
                  {member.name}
                </h4>
                <div className="text-xs font-semibold text-champagne uppercase tracking-wider mb-3">
                  {member.role}
                </div>
                <p className="text-xs text-warm-grey leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-deep-coffee to-espresso text-light-text border-t border-champagne/15 text-center">
        <div className="container-premium max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-light-text">
            Ready to Build Something Extraordinary?
          </h2>
          <p className="text-sm text-warm-grey">
            Let's discuss your requirements and design a digital solution that scales.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-champagne via-caramel to-champagne text-espresso font-bold text-sm inline-flex items-center gap-2 shadow-lg hover:shadow-glow-gold transition-all"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
