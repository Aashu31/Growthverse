import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, ArrowRight, CheckCircle2, Sparkles, BookOpen, Clock, Users, ShieldCheck } from "lucide-react";
import { SectionHeader } from "../../components/website/Hero";

const FEATURE_CATEGORIES = [
  {
    title: "Student Lifecycle Management",
    description: "Centralized student profiles, enrollment workflows, and academic histories in a secure cloud database.",
  },
  {
    title: "Smart Attendance Tracking",
    description: "Daily automated attendance tracking with SMS/WhatsApp alerts for parents and administrative anomaly alerts.",
  },
  {
    title: "Curriculum & Timetable Planning",
    description: "Intuitive drag-and-drop schedule builder, teacher allocation, and exam timetable management.",
  },
  {
    title: "Fee Management & Digital Receipts",
    description: "Automated billing cycles, recurring fee reminders, online payments, and instant accounting ledger exports.",
  },
  {
    title: "Parent & Teacher Communication",
    description: "Transparent broadcast notices, direct messaging, report cards, and parent consultation portals.",
  },
  {
    title: "Institutional Analytics & Reports",
    description: "High-level administrative reporting on student retention, staff workloads, and financial metrics.",
  },
];

export default function Sarthi() {
  return (
    <div className="min-h-screen bg-espresso text-light-text selection:bg-champagne selection:text-espresso">
      {/* Hero Header */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-espresso via-deep-coffee to-espresso overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container-premium relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-champagne/10 text-champagne border border-champagne/20">
            <GraduationCap className="w-4 h-4 text-champagne" />
            <span>GrowthVerse EdTech Offering</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-light-text">
            Sarthi — Modern Digital{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-champagne via-light-gold to-caramel">
              School Management.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-warm-grey leading-relaxed">
            A comprehensive school administration platform engineered by GrowthVerse to
            streamline campus operations, fee collection, and parent engagement.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-champagne via-caramel to-champagne text-espresso font-bold text-xs inline-flex items-center gap-2 shadow-lg hover:shadow-glow-gold transition-all"
            >
              <span>Enquire About Sarthi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/services"
              className="px-6 py-3.5 rounded-full border border-champagne/30 text-light-text hover:text-champagne font-semibold text-xs transition-colors"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Breakdown (Warm Cream Palette) */}
      <section className="py-20 lg:py-28 bg-[#FFF8ED] text-dark-text relative">
        <div className="container-premium">
          <SectionHeader
            title="Institutional Modules"
            description="Designed to minimize administrative burden and empower educators, students, and parents."
            badge="Modules"
            dark={false}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURE_CATEGORIES.map((module, idx) => (
              <div
                key={module.title}
                className="p-8 rounded-3xl bg-white border border-gv-border shadow-sm hover:shadow-card-warm-lg hover:border-champagne transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-sand-beige/60 border border-champagne/30 flex items-center justify-center text-caramel mb-6 group-hover:bg-caramel group-hover:text-white transition-colors">
                    <BookOpen className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-serif font-bold text-dark-text mb-2 group-hover:text-caramel transition-colors">
                    {module.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-dark-mocha/70 leading-relaxed mb-6">
                    {module.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-sand-beige/60 flex items-center gap-2 text-xs font-semibold text-caramel">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Integrated Module</span>
                </div>
              </div>
            ))}
          </div>

          {/* Sarthi Architecture Card */}
          <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-espresso text-light-text border border-champagne/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider text-champagne font-bold block">
                Custom Institutional Deployment
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-light-text">
                Ready to Digitize Your Educational Institution?
              </h3>
              <p className="text-xs sm:text-sm text-warm-grey max-w-xl">
                We configure Sarthi to match your exact academic schedules, fee structures,
                and reporting requirements.
              </p>
            </div>

            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-champagne to-caramel text-espresso font-bold text-xs inline-flex items-center gap-2 shadow-lg hover:shadow-glow-gold transition-all shrink-0"
            >
              <span>Schedule Institutional Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
