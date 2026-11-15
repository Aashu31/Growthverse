import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Github, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { COMPANY_DATA } from "../../data";

const FOOTER_LINKS = [
  {
    title: "Explore",
    items: [
      { name: "Home", path: "/" },
      { name: "About GrowthVerse", path: "/about" },
      { name: "Our Services", path: "/services" },
      { name: "Portfolio & Case Studies", path: "/portfolio" },
      { name: "Technology Stack", path: "/technologies" },
      { name: "Features & Architecture", path: "/features" },
    ],
  },
  {
    title: "Services",
    items: [
      { name: "Website Development", path: "/services/website-development" },
      { name: "Web Application Development", path: "/services/web-application-development" },
      { name: "UI/UX Design", path: "/services/ui-ux-design" },
      { name: "Mobile App Development", path: "/services/mobile-application-development" },
      { name: "AI & Automation", path: "/services/ai-and-automation" },
      { name: "Cloud & DevOps", path: "/services/cloud-and-devops" },
      { name: "Digital Branding", path: "/services/digital-branding" },
      { name: "Digital Marketing", path: "/services/digital-marketing" },
    ],
  },
  {
    title: "Company",
    items: [
      { name: "Sarthi (EdTech)", path: "/sarthi" },
      { name: "Transparent Pricing", path: "/pricing" },
      { name: "Contact & Enquiry", path: "/contact" },
      { name: "Customer Login", path: "/login" },
      { name: "Client Signup", path: "/signup" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-espresso text-light-text border-t border-champagne/15 relative overflow-hidden mt-auto">
      {/* Subtle ambient glow in background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-champagne/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-caramel/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-premium py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group inline-flex">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-champagne via-caramel to-deep-coffee p-[1px] shadow-glow-gold">
                <div className="w-full h-full bg-espresso rounded-[11px] flex items-center justify-center">
                  <span className="font-serif font-bold text-champagne text-xl italic">G</span>
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold font-serif tracking-tight text-light-text group-hover:text-champagne transition-colors">
                  GrowthVerse
                </span>
                <span className="text-[10px] font-sans text-champagne/80 font-semibold ml-0.5 relative -top-2">
                  ®
                </span>
              </div>
            </Link>

            <p className="text-warm-grey text-sm leading-relaxed max-w-sm">
              GrowthVerse is a premier digital engineering and creative technology agency.
              We build scalable web platforms, high-impact brands, and modern software that
              turn ambitious ideas into sustainable business growth.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-mocha/70 border border-champagne/20 text-xs text-champagne">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Build Digital. Grow Business.</span>
            </div>

            {/* Social links where actual URLs exist */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={COMPANY_DATA.website}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-champagne/20 bg-deep-coffee/60 flex items-center justify-center text-warm-grey hover:text-champagne hover:border-champagne/60 hover:bg-champagne/10 transition-all"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <Link
                to="/contact"
                className="w-9 h-9 rounded-xl border border-champagne/20 bg-deep-coffee/60 flex items-center justify-center text-warm-grey hover:text-champagne hover:border-champagne/60 hover:bg-champagne/10 transition-all"
                aria-label="Contact Email"
              >
                <Mail className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Navigation Links Columns */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-champagne font-sans">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-warm-grey hover:text-light-text text-sm transition-colors duration-200 inline-flex items-center gap-1 group/link"
                    >
                      <span className="group-hover/link:translate-x-0.5 transition-transform">
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-warm-grey">
          <p>© 2026 GrowthVerse. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-warm-grey/80">
              <ShieldCheck className="w-4 h-4 text-champagne/80" />
              <span>Enterprise-grade Architecture & Security</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
