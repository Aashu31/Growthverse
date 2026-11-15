import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Button } from "../common/Button";

export function Footer() {
  const FOOTER_LINKS = [
    {
      title: "Company",
      items: [
        { name: "About", path: "/about" },
        { name: "Services", path: "/services" },
        { name: "Features", path: "/features" },
        { name: "Technologies", path: "/technologies" },
        { name: "Sarthi", path: "/sarthi" },
      ],
    },
    {
      title: "Resources",
      items: [
        { name: "Pricing", path: "/pricing" },
        { name: "Portfolio", path: "/portfolio" },
        { name: "Contact", path: "/contact" },
        { name: "Login", path: "/login" },
        { name: "Signup", path: "/signup" },
      ],
    },
    {
      title: "Legal",
      items: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms and Conditions", path: "/terms" },
      ],
    },
  ];

  return (
    <footer className="bg-dark text-white border-t border-gray-800 mt-auto">
      <div className="container-premium py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25">
                <span className="text-white font-bold text-lg">GV</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">GrowthVerse</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              GrowthVerse is a modern digital technology and solutions company
              helping businesses establish and improve their digital presence
              through innovative technology and thoughtful design.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/Aashu31/Growthverse"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-600 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-600 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-600 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-gray-400 text-sm hover:text-blue-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-sm">
              Copyright (c) 2026 GrowthVerse. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link to="/privacy" className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-blue-400 transition-colors">
                Terms and Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
