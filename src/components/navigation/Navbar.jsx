import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "../common/Button";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services", hasDropdown: true },
  { name: "Technologies", path: "/technologies" },
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const closeDropdown = () => setIsDropdownOpen(false);
  const openDropdown = () => setIsDropdownOpen(true);

  const handleWrapperBlur = (e) => {
    if (!dropdownRef.current?.contains(e.relatedTarget)) {
      closeDropdown();
    }
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-ivory dark:bg-charcoal-dark border-b border-border dark:border-dark-border">
      <div className="container-premium">
        <div className="flex items-center justify-between h-20 px-4">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="w-10 h-10 bg-forest rounded-lg flex items-center justify-center shadow-lg shadow-forest/25">
              <span className="text-white font-bold text-lg">GV</span>
            </div>
            <span className="text-xl font-bold text-charcoal dark:text-white tracking-tight font-display">
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
                    ref={dropdownRef}
                    onMouseEnter={openDropdown}
                    onMouseLeave={closeDropdown}
                    onFocus={openDropdown}
                    onBlur={handleWrapperBlur}
                  >
                    <Link
                      to={link.path}
                      className={`text-sm font-medium text-charcoal dark:text-white transition-colors ${
                        isActive(link.path) ? "text-forest dark:text-forest-light" : ""
                      }`}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {link.name} <ChevronDown className="ml-1 h-4 w-4" />
                    </Link>
                    {isDropdownOpen && (
                      <div
                        className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-charcoal-dark rounded-xl border border-border dark:border-dark-border shadow-xl py-3 z-50"
                        onMouseEnter={openDropdown}
                        onMouseLeave={closeDropdown}
                      >
                        {DROPDOWN_ITEMS.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="block px-6 py-2.5 text-sm text-muted dark:text-gray-400 hover:bg-surface dark:hover:bg-charcoal-dark hover:text-forest dark:hover:text-forest-light transition-colors"
                            onClick={closeDropdown}
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
                  className={`text-sm font-medium text-charcoal dark:text-white transition-colors ${
                    isActive(link.path) ? "text-forest dark:text-forest-light" : ""
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
              <Menu className="h-5 w-5" />
              <span className="hidden md:inline ml-2">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="w-full max-w-md bg-white dark:bg-charcoal-dark border-r border-border dark:border-dark-border shadow-2xl transform transition-transform duration-300 translate-x-full md:translate-x-0">
            <div className="p-6 border-b border-border dark:border-dark-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-forest rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GV</span>
                </div>
                <span className="font-bold text-charcoal dark:text-white font-display">GrowthVerse</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              {NAV_LINKS.map((link) => {
                if (link.hasDropdown) {
                  return (
                    <div key={link.name} className="border-b border-border dark:border-dark-border pb-2">
                      <button
                        onClick={toggleDropdown}
                        className="w-full flex items-center justify-between text-sm font-medium text-charcoal dark:text-white"
                      >
                        {link.name}
                        <ChevronDown className={`h-4 w-4 transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`} />
                      </button>
                      {isDropdownOpen && (
                        <div className="pl-4 mt-2 space-y-1">
                          {DROPDOWN_ITEMS.map((item) => (
                            <Link
                              key={item.name}
                              to={item.path}
                              className="block px-2 py-2 text-sm text-muted dark:text-gray-400 hover:text-forest dark:hover:text-forest-light"
                              onClick={() => setIsMobileOpen(false)}
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
                    className="block px-2 py-3 text-sm font-medium text-charcoal dark:text-white hover:text-forest dark:hover:text-forest-light"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="mt-6 pt-6 border-t border-border dark:border-dark-border">
                <Button variant="primary" size="md" className="w-full" onClick={() => setIsMobileOpen(false)}>
                  Start a Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
