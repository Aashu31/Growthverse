import React from "react";
import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  {
    title: "Explore",
    items: [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Services", path: "/services" },
      { name: "Portfolio", path: "/portfolio" },
      { name: "Technologies", path: "/technologies" },
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
      { name: "Sarthi", path: "/sarthi" },
      { name: "Pricing", path: "/pricing" },
      { name: "Contact", path: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal-dark text-white border-t border-dark-border mt-auto">
      <div className="container-premium py-12 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-forest rounded-lg flex items-center justify-center shadow-lg shadow-forest/25">
                <span className="text-white font-bold text-lg">GV</span>
              </div>
              <span className="text-xl font-bold text-white font-display tracking-tight">
                GrowthVerse
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              GrowthVerse is a digital technology and solutions company
              helping businesses establish and improve their digital presence
              through thoughtful design and modern development.
            </p>
          </div>

          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-gray-400 text-sm hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-dark-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-sm">
              Copyright (c) 2026 GrowthVerse. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
