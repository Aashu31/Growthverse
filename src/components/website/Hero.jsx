import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingUp,
  Monitor,
  Code2,
  Palette,
  Smartphone,
  Play,
  Layers,
  ChevronRight,
  GraduationCap,
  CheckCircle2,
  ExternalLink,
  Box,
  PenTool,
} from "lucide-react";
import { Button } from "../common/Button";
import { PORTFOLIO_DATA } from "../../data";
import { SERVICE_IMAGES } from "../../data/serviceImages";
import heroCinematicImg from "../../assets/growthverse/hero/growthverse-hero-cinematic.webp";
import workspaceImg from "../../assets/growthverse/about/growthverse-about-workspace.webp";

// Shared SectionHeader exported for other pages
export function SectionHeader({
  title,
  description,
  badge = "",
  dark = false,
  centered = true,
  className = "",
}) {
  const badgeText = badge || title.split(" ").slice(0, 2).join(" ");
  return (
    <div
      className={`mb-12 lg:mb-16 ${centered ? "text-center mx-auto max-w-3xl" : ""} ${className}`}
    >
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3 bg-champagne/10 text-champagne border border-champagne/20">
        <Sparkles className="w-3 h-3 text-champagne" />
        <span>{badgeText}</span>
      </div>
      <h2
        className={`text-h2 font-serif font-bold mb-4 ${
          dark ? "text-light-text" : "text-dark-text"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-base lg:text-lg leading-relaxed ${
            dark ? "text-warm-grey" : "text-dark-mocha/70"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const [currency, setCurrency] = useState("INR");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-espresso text-light-text selection:bg-champagne selection:text-espresso">
      {/* =========================================================================
          1. HERO SECTION (Espresso Brown × Champagne Gold × Cinematic Mockup)
         ========================================================================= */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-espresso via-deep-coffee to-espresso">
        {/* Ambient lighting & radial glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-caramel/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Botanical leaf silhouette hint in the top right corner */}
        <div className="absolute -top-12 -right-12 w-64 h-64 opacity-15 pointer-events-none">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M190 10C130 30 110 90 90 140C70 90 40 40 10 20C40 60 70 120 80 180C100 120 140 70 190 10Z"
              fill="#E8B875"
            />
          </svg>
        </div>

        <div className="container-premium relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-6 space-y-8">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-deep-coffee/80 border border-champagne/30 text-champagne text-xs font-semibold tracking-wide shadow-glow-gold">
                <Sparkles className="w-3.5 h-3.5 text-champagne" />
                <span>Digital Agency for Modern Businesses</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-serif font-bold tracking-tight leading-[1.08] text-light-text">
                  Build Digital. <br />
                  <span className="italic font-serif font-normal text-transparent bg-clip-text bg-gradient-to-r from-champagne via-light-gold to-caramel">
                    Grow Business.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-warm-grey max-w-xl leading-relaxed pt-3">
                  We design, develop and scale digital experiences that turn ideas into
                  real business growth.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/contact"
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-champagne via-caramel to-champagne bg-[length:200%_auto] hover:bg-[position:right_center] text-espresso font-sans font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-champagne/25 hover:shadow-glow-gold hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span>Start Your Project</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-6 py-3.5 rounded-full border border-champagne/30 bg-deep-coffee/60 hover:bg-dark-mocha text-light-text font-sans font-medium text-sm inline-flex items-center gap-2.5 transition-all hover:border-champagne/60 hover:text-champagne"
                >
                  <span className="w-6 h-6 rounded-full bg-champagne/20 flex items-center justify-center text-champagne">
                    <Play className="w-3 h-3 fill-champagne ml-0.5" />
                  </span>
                  <span>Watch How We Work</span>
                </button>
              </div>

              {/* Three Value Propositions */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-warm-grey font-medium">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-champagne" />
                  <span className="text-light-text font-semibold">Custom Solutions</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-champagne" />
                  <span className="text-light-text font-semibold">Business Focused</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-champagne" />
                  <span className="text-light-text font-semibold">Reliable Support</span>
                </div>
              </div>
            </div>

            {/* Right Column: Reference-Accurate Cinematic 3D Photographic Hero Asset */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-[620px] xl:max-w-[680px]">
                {/* Ambient warm radial backlight diffusion */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-gradient-to-tr from-caramel/25 via-champagne/20 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

                {/* Cinematic Photographic Hero Visual (Laptop on stone ledge with orbital glow) */}
                <div className="relative rounded-2xl overflow-hidden group">
                  <img
                    src={heroCinematicImg}
                    alt="GrowthVerse Next-Gen Digital Solutions"
                    className="w-full h-auto object-contain select-none drop-shadow-[0_20px_45px_rgba(0,0,0,0.7)] transition-transform duration-700 hover:scale-[1.01]"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          3. SERVICES SECTION (Transition to Warm Cream × Distinctive Cards)
         ========================================================================= */}
      <section className="relative py-20 lg:py-28 bg-[#F6EBDD] text-dark-text overflow-hidden">
        {/* Soft flowing silk/curved background accents on left and right */}
        <div className="absolute -left-20 top-1/4 w-72 h-72 bg-gradient-to-tr from-caramel/20 via-sand-beige/40 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-10 w-96 h-96 bg-champagne/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container-premium relative z-10">
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 bg-champagne/25 text-caramel border border-champagne/35">
              <Sparkles className="w-3 h-3 text-caramel" />
              <span>Our Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-dark-text leading-tight mb-4">
              End-to-End Digital Solutions for Growth
            </h2>
            <p className="text-base sm:text-lg text-dark-mocha/75 leading-relaxed">
              From strategy to execution, we help you build, launch and grow with
              powerful digital solutions.
            </p>
          </div>

          {/* 4 Featured Services Cards matching the reference layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Featured Dark Espresso Mocha Card (Asset 03) */}
            <Link
              to="/services/website-development"
              className="group rounded-2xl bg-gradient-to-br from-[#381F15] via-[#2A160E] to-[#1E0F08] p-6 border border-champagne/35 text-light-text shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative mb-5 aspect-[16/10] rounded-xl overflow-hidden border border-champagne/25 shadow-inner">
                  <img
                    src={SERVICE_IMAGES["website-development"]}
                    alt="Website Development"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 w-8 h-8 rounded-lg bg-espresso/85 backdrop-blur-md border border-champagne/30 flex items-center justify-center text-champagne">
                    <Monitor className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold text-light-text mb-2 group-hover:text-champagne transition-colors">
                  Website Development
                </h3>
                <p className="text-xs sm:text-sm text-warm-grey leading-relaxed mb-4">
                  Modern, responsive and business-focused websites.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end">
                <span className="w-9 h-9 rounded-full bg-champagne text-espresso flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-md">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* Card 2: Warm Cream Card (Asset 04) */}
            <Link
              to="/services/web-application-development"
              className="group rounded-2xl bg-[#FFF9F0] p-6 border border-[#E8D4BD] text-dark-text shadow-sm hover:shadow-card-warm-lg hover:border-champagne hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative mb-5 aspect-[16/10] rounded-xl overflow-hidden border border-[#E8D4BD] shadow-inner">
                  <img
                    src={SERVICE_IMAGES["web-application-development"]}
                    alt="Web Application Development"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sand-beige/40 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md border border-sand-beige flex items-center justify-center text-caramel">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold text-dark-text mb-2 group-hover:text-caramel transition-colors">
                  Web Application Development
                </h3>
                <p className="text-xs sm:text-sm text-dark-mocha/70 leading-relaxed mb-4">
                  Scalable web applications and SaaS solutions.
                </p>
              </div>

              <div className="pt-4 border-t border-sand-beige/60 flex items-center justify-end">
                <span className="w-9 h-9 rounded-full bg-sand-beige text-dark-text flex items-center justify-center group-hover:bg-caramel group-hover:text-white group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* Card 3: Warm Cream Card (Asset 05) */}
            <Link
              to="/services/ui-ux-design"
              className="group rounded-2xl bg-[#FFF9F0] p-6 border border-[#E8D4BD] text-dark-text shadow-sm hover:shadow-card-warm-lg hover:border-champagne hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative mb-5 aspect-[16/10] rounded-xl overflow-hidden border border-[#E8D4BD] shadow-inner">
                  <img
                    src={SERVICE_IMAGES["ui-ux-design"]}
                    alt="UI/UX Design"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sand-beige/40 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md border border-sand-beige flex items-center justify-center text-caramel">
                    <PenTool className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold text-dark-text mb-2 group-hover:text-caramel transition-colors">
                  UI/UX Design
                </h3>
                <p className="text-xs sm:text-sm text-dark-mocha/70 leading-relaxed mb-4">
                  User-centric, modern and impactful design.
                </p>
              </div>

              <div className="pt-4 border-t border-sand-beige/60 flex items-center justify-end">
                <span className="w-9 h-9 rounded-full bg-sand-beige text-dark-text flex items-center justify-center group-hover:bg-caramel group-hover:text-white group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* Card 4: Warm Cream Card (Asset 06) */}
            <Link
              to="/services/mobile-application-development"
              className="group rounded-2xl bg-[#FFF9F0] p-6 border border-[#E8D4BD] text-dark-text shadow-sm hover:shadow-card-warm-lg hover:border-champagne hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative mb-5 aspect-[16/10] rounded-xl overflow-hidden border border-[#E8D4BD] shadow-inner">
                  <img
                    src={SERVICE_IMAGES["mobile-application-development"]}
                    alt="Mobile App Development"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sand-beige/40 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md border border-sand-beige flex items-center justify-center text-caramel">
                    <Smartphone className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold text-dark-text mb-2 group-hover:text-caramel transition-colors">
                  Mobile App Development
                </h3>
                <p className="text-xs sm:text-sm text-dark-mocha/70 leading-relaxed mb-4">
                  iOS and Android app development.
                </p>
              </div>

              <div className="pt-4 border-t border-sand-beige/60 flex items-center justify-end">
                <span className="w-9 h-9 rounded-full bg-sand-beige text-dark-text flex items-center justify-center group-hover:bg-caramel group-hover:text-white group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>

          {/* Secondary Services Pill Row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              { name: "AI & Automation", path: "/services/ai-and-automation" },
              { name: "Cloud & DevOps", path: "/services/cloud-and-devops" },
              { name: "Digital Branding", path: "/services/digital-branding" },
              { name: "Digital Marketing", path: "/services/digital-marketing" },
            ].map((svc) => (
              <Link
                key={svc.name}
                to={svc.path}
                className="px-4 py-2 rounded-full border border-[#E8D4BD] bg-white/90 text-xs font-semibold text-dark-text hover:border-champagne hover:bg-champagne/10 hover:text-caramel transition-all"
              >
                + {svc.name}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. ABOUT GROWTHVERSE (Editorial Storytelling Section)
         ========================================================================= */}
      <section className="py-20 lg:py-28 bg-espresso text-light-text relative overflow-hidden border-t border-b border-champagne/15">
        <div className="container-premium relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-champagne/10 text-champagne border border-champagne/20">
                <Sparkles className="w-3 h-3 text-champagne" />
                <span>About GrowthVerse</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-light-text leading-tight">
                A Digital Agency That Builds for Real Growth
              </h2>

              <p className="text-base text-warm-grey leading-relaxed">
                GrowthVerse was founded with an uncompromising mission: to help
                entrepreneurs, fast-scaling startups, and modern businesses build digital
                presence that drives tangible enterprise revenue.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-deep-coffee/60 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-champagne/20 flex items-center justify-center text-champagne shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-light-text">Who We Are</h4>
                    <p className="text-xs text-warm-grey mt-0.5">
                      Elite engineers, product architects, and designers obsessed with craft and outcome.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-deep-coffee/60 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-champagne/20 flex items-center justify-center text-champagne shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-light-text">What We Do</h4>
                    <p className="text-xs text-warm-grey mt-0.5">
                      High-converting web platforms, full-stack React systems, brand identity, and AI automation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-deep-coffee/60 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-champagne/20 flex items-center justify-center text-champagne shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-light-text">Who We Serve</h4>
                    <p className="text-xs text-warm-grey mt-0.5">
                      Businesses worldwide requiring premium quality without agency bloat.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-champagne/30 text-champagne font-semibold text-xs hover:bg-champagne/10 hover:border-champagne transition-all"
                >
                  <span>Discover GrowthVerse</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Editorial Showcase Panel with Genuine Workspace Photo (Asset 02) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="relative rounded-3xl overflow-hidden border border-champagne/30 shadow-2xl group">
                <img
                  src={workspaceImg}
                  alt="GrowthVerse Creative Engineering Studio"
                  className="w-full h-64 sm:h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-espresso/85 backdrop-blur-md border border-champagne/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-champagne tracking-widest block">
                      Creative Studio & Labs
                    </span>
                    <span className="text-xs sm:text-sm font-serif font-bold text-light-text">
                      GrowthVerse Engineering Headquarters
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-champagne/20 flex items-center justify-center text-champagne">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-gradient-to-br from-deep-coffee via-dark-mocha to-espresso border border-champagne/30 shadow-xl relative">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-champagne">
                      Our Philosophy
                    </span>
                    <span className="text-xs text-warm-grey font-serif italic">
                      Zero Fluff. Pure Craft.
                    </span>
                  </div>

                  <blockquote className="text-lg font-serif italic text-light-text leading-relaxed">
                    "If they have built their own website this beautifully, imagine what they
                    could build for my business."
                  </blockquote>

                  <p className="text-xs text-warm-grey leading-relaxed">
                    Every line of code, animation curve, and typography scale is
                    engineered to communicate authority, build deep customer trust, and
                    accelerate transaction velocity.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <div className="text-xl font-serif font-bold text-champagne">100%</div>
                      <div className="text-[11px] text-warm-grey">Modern React & Clean CSS</div>
                    </div>
                    <div>
                      <div className="text-xl font-serif font-bold text-champagne">3 Months</div>
                      <div className="text-[11px] text-warm-grey">Included Free Maintenance</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FEATURED WORK (Real Repository Projects)
         ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#FFF8ED] text-dark-text relative">
        <div className="container-premium">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 bg-champagne/20 text-caramel border border-champagne/30">
                <Sparkles className="w-3 h-3 text-caramel" />
                <span>Featured Work</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-dark-text">
                Crafted for Digital Leaders
              </h2>
            </div>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-caramel hover:text-champagne transition-colors"
            >
              <span>View all projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PORTFOLIO_DATA.slice(0, 4).map((project) => (
              <Link
                key={project.id}
                to={`/portfolio/${project.slug}`}
                className="group rounded-3xl overflow-hidden bg-white border border-gv-border shadow-sm hover:shadow-card-warm-lg hover:border-champagne transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-sand-beige">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-espresso/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-champagne text-espresso font-semibold text-xs flex items-center gap-1.5 shadow-lg">
                      <span>View Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-caramel mb-2 block">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-dark-text mb-2 group-hover:text-caramel transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-dark-mocha/70 leading-relaxed mb-4">
                      {project.shortDescription}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-sand-beige/60">
                    {project.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-sand-beige/60 text-dark-mocha"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. HOW WE WORK (6-Step Structured Workflow)
         ========================================================================= */}
      <section className="py-20 lg:py-28 bg-espresso text-light-text relative border-t border-champagne/15">
        <div className="container-premium">
          <SectionHeader
            title="A Systematic Path to Scale"
            description="Our proven six-stage framework transforms vision into high-yield digital execution."
            badge="Process"
            dark={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Discover",
                desc: "We analyze your audience, unit economics, market positioning, and tech bottlenecks.",
              },
              {
                step: "02",
                title: "Strategize",
                desc: "Architecture blueprints, conversion funnels, and precision project roadmap design.",
              },
              {
                step: "03",
                title: "Design",
                desc: "Editorial aesthetics, user-tested wireframes, and distinctive bespoke UI systems.",
              },
              {
                step: "04",
                title: "Develop",
                desc: "Performant React engineering, robust database models, and accessible code.",
              },
              {
                step: "05",
                title: "Launch",
                desc: "Hardened CI/CD deployments, SEO audits, speed optimizations, and security checks.",
              },
              {
                step: "06",
                title: "Grow",
                desc: "Three months free maintenance, analytics telemetry, and ongoing conversion iteration.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-7 rounded-2xl bg-deep-coffee/60 border border-champagne/20 hover:border-champagne/50 transition-all hover:-translate-y-1 group"
              >
                <div className="text-3xl font-serif font-bold text-champagne/40 group-hover:text-champagne transition-colors mb-3">
                  {item.step}
                </div>
                <h4 className="text-lg font-serif font-bold text-light-text mb-2">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-warm-grey leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. PRICING PREVIEW (Preserving Exact Approved Pricing)
         ========================================================================= */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-espresso via-deep-coffee to-espresso text-light-text relative border-t border-champagne/15">
        <div className="container-premium">
          <SectionHeader
            title="Honest, Transparent Pricing"
            description="No hidden fees or unexpected billing. One-time project pricing with free support included."
            badge="Pricing"
            dark={true}
          />

          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1 rounded-full bg-deep-coffee border border-champagne/30">
              <button
                type="button"
                onClick={() => setCurrency("INR")}
                className={`px-6 py-2 rounded-full text-xs font-semibold transition-all ${
                  currency === "INR"
                    ? "bg-gradient-to-r from-champagne to-caramel text-espresso shadow"
                    : "text-warm-grey hover:text-light-text"
                }`}
              >
                India (INR)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`px-6 py-2 rounded-full text-xs font-semibold transition-all ${
                  currency === "USD"
                    ? "bg-gradient-to-r from-champagne to-caramel text-espresso shadow"
                    : "text-warm-grey hover:text-light-text"
                }`}
              >
                International (USD)
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl bg-deep-coffee/90 border border-champagne/30 p-8 sm:p-12 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-champagne block mb-2">
                  Website Development Package
                </span>
                <div className="text-4xl lg:text-5xl font-serif font-bold text-light-text mb-3">
                  {currency === "INR" ? "₹4,000 – ₹6,000" : "$1,000 – $1,500"}
                </div>
                <p className="text-xs text-warm-grey mb-6">
                  One-time full project development charge. Includes modern responsive
                  design and 3 months of complimentary support.
                </p>

                <ul className="space-y-2.5 text-xs text-light-text">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-champagne" />
                    <span>Custom responsive web development</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-champagne" />
                    <span>SEO friendly structure & speed optimization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-champagne" />
                    <span className="font-semibold text-champagne">
                      Three months of free support & maintenance
                    </span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-espresso/80 border border-white/10 space-y-4">
                <h4 className="text-sm font-serif font-bold text-light-text">
                  Ongoing Maintenance (Optional)
                </h4>
                <p className="text-xs text-warm-grey">
                  After your 3 months of free support, flexible support packages keep your digital
                  assets current.
                </p>
                <div className="text-xs text-champagne font-medium">
                  {currency === "INR"
                    ? "Plans from ₹1,000/mo or ₹11,000/year"
                    : "Plans from $300/mo or $2,200/year"}
                </div>
                <div className="pt-2">
                  <Link
                    to="/pricing"
                    className="w-full py-3 text-center rounded-xl bg-gradient-to-r from-champagne to-caramel text-espresso font-bold text-xs block shadow-md hover:shadow-glow-gold transition-all"
                  >
                    View Complete Pricing Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. SARTHI SPOTLIGHT SECTION
         ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#FFF8ED] text-dark-text relative">
        <div className="container-premium">
          <div className="rounded-3xl bg-espresso p-8 sm:p-14 border border-champagne/30 text-light-text shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-champagne/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-champagne/15 text-champagne border border-champagne/30">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>GrowthVerse Proprietary Offering</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-light-text">
                  Sarthi — Digital School Management Solution
                </h3>
                <p className="text-sm text-warm-grey leading-relaxed max-w-2xl">
                  A tailored platform built for modern educational institutions to automate
                  student records, attendance, fee collections, and parent communications.
                </p>
              </div>

              <div className="lg:col-span-4 flex lg:justify-end">
                <Link
                  to="/sarthi"
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-champagne to-caramel text-espresso font-bold text-xs inline-flex items-center gap-2 shadow-lg hover:shadow-glow-gold transition-all"
                >
                  <span>Explore Sarthi</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. FINAL CTA SECTION (Cinematic Conversion Closer)
         ========================================================================= */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-espresso via-deep-coffee to-espresso text-light-text relative overflow-hidden border-t border-champagne/20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container-premium relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-deep-coffee border border-champagne/30 text-champagne text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for Real Growth?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-light-text leading-tight">
            Your Next Big Idea Deserves a Better Digital Experience.
          </h2>

          <p className="text-base sm:text-lg text-warm-grey leading-relaxed">
            Let's design and build something extraordinary together. Fast delivery,
            clean engineering, and business-focused results.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-champagne via-caramel to-champagne bg-[length:200%_auto] hover:bg-[position:right_center] text-espresso font-sans font-bold text-sm inline-flex items-center gap-2 shadow-xl shadow-champagne/25 hover:shadow-glow-gold hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>Let's Build Something Extraordinary</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              to="/services"
              className="px-7 py-4 rounded-full border border-champagne/30 text-light-text hover:text-champagne hover:border-champagne/60 font-sans font-semibold text-sm transition-all"
            >
              View Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Video Modal (Optional / Friendly) */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-deep-coffee rounded-2xl border border-champagne/30 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-serif font-bold text-light-text">How We Work at GrowthVerse</h4>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="text-warm-grey hover:text-light-text"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video rounded-xl bg-espresso border border-champagne/20 flex flex-col items-center justify-center text-center p-6">
              <Sparkles className="w-10 h-10 text-champagne mb-3 animate-pulse" />
              <h5 className="font-serif font-bold text-light-text mb-1">
                Precision Digital Engineering
              </h5>
              <p className="text-xs text-warm-grey max-w-md">
                We combine architectural discipline, user-tested interface design, and modern
                React performance to build digital solutions that accelerate real business growth.
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="px-5 py-2 rounded-full bg-champagne text-espresso text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
