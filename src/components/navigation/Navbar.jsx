import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LuMenu,
  LuX,
  LuPhone,
  LuMail,
  LuMapPin,
  LuClock,
  LuChevronDown,
  LuArrowRight,
  LuGithub,
} from "lucide-react";
import { Button } from "../common/Button";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services", hasDropdown: true },
  { name: "Features", path: "/features" },
  { name: "Pricing", path: "/pricing" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Contact", path: "/contact" },
];

const DROPDOWN_ITEMS = [
  { name: "Website Development", path: "/services/website-development" },
  { name: "Web Application Development", path: "/services/web-application-development" },
  { name: "UI/UX Design", path: "/services/ui-ux-design" },
  { name: "Mobile Application Development", path: "/services/mobile-application-development" },
  { name: "AI and Automation", path: "/services/ai-and-automation" },
  { name: "Cloud and DevOps", path: "/services/cloud-and-devops" },
  { name: "Digital Branding", path: "/services/digital-branding" },
  { name: "Digital Marketing", path: "/services/digital-marketing" },
  { name: "Sarthi", path: "/sarthi" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-dark-secondary/90 backdrop-blur-md shadow-sm border-b border-border dark:border-gray-700"
          : "bg-transparent"
      }`}
    >
      <div className="container-premium">
        <div className="flex items-center justify-between h-20 px-4">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25">
              <span className="text-white font-bold text-lg">GV</span>
            </div>
            <span className="text-xl font-bold text-primary-text dark:text-white tracking-tight">
              GrowthVerse
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative group"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <Link
                      to={link.path}
                      className={`text-sm font-medium text-primary-text dark:text-white transition-colors ${
                        isActive(link.path) ? "text-blue-600 dark:text-electric-blue" : ""
                      }`}
                    >
                      {link.name} <LuChevronDown className="ml-1 h-4 w-4" />
                    </Link>
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-dark-secondary rounded-2xl border border-border dark:border-gray-700 shadow-2xl py-4 z-50">
                        {DROPDOWN_ITEMS.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="block px-6 py-3 text-sm text-secondary-text dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-electric-blue transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium text-primary-text dark:text-white transition-colors ${
                    isActive(link.path) ? "text-blue-600 dark:text-electric-blue" : ""
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            <Button variant="primary" size="sm" onClick={() => setIsMobileOpen(false)}>
              Start a Project
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileOpen(true)}>
              <LuMenu className="h-5 w-5" />
              <span className="hidden md:inline ml-2">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="w-full max-w-md bg-white dark:bg-dark-secondary border-r border-border dark:border-gray-700 shadow-2xl transform transition-transform duration-300 translate-x-full md:translate-x-0">
            <div className="p-6 border-b border-border dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">GV</span>
                </div>
                <span className="font-bold text-primary-text dark:text-white">GrowthVerse</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileOpen(false)}>
                <LuX className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              {NAV_LINKS.map((link) => {
                if (link.hasDropdown) {
                  return (
                    <div key={link.name} className="border-b border-border dark:border-gray-700 pb-2">
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex items-center justify-between text-sm font-medium text-primary-text dark:text-white"
                      >
                        {link.name}
                        <LuChevronDown className={`h-4 w-4 transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`} />
                      </button>
                      {isDropdownOpen && (
                        <div className="pl-4 mt-2 space-y-1">
                          {DROPDOWN_ITEMS.map((item) => (
                            <Link
                              key={item.name}
                              to={item.path}
                              className="block px-2 py-2 text-sm text-secondary-text dark:text-gray-300 hover:text-blue-600 dark:hover:text-electric-blue"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block px-2 py-3 text-sm font-medium text-primary-text dark:text-white hover:text-blue-600 dark:hover:text-electric-blue"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="mt-6 pt-6 border-t border-border dark:border-gray-700">
                <Button variant="primary" size="md" className="w-full" onClick={() => setIsMobileOpen(false)}>
                  Start a Project
                </Button>
              </div>
            </div>
            <div className="p-6 border-t border-border dark:border-gray-700">
              <div className="space-y-3 text-sm">
                <p className="text-secondary-text dark:text-gray-400">Contact</p>
                <div className="flex items-center gap-2 text-primary-text dark:text-white mb-2">
                  <LuMail className="h-4 w-4 text-blue-600" />
                  <span>hello@growthverse.example</span>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-blue-600 dark:hover:text-electric-blue transition-colors">
                  <LuGithub className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
