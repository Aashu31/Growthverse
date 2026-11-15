import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Menu, User, X, LayoutDashboard } from "lucide-react";
import { Button } from "../common/Button";
import { useAuth } from "../../context/AuthContext";
import { isStaffRole } from "../../utils/permissions";

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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path) => location.pathname === path;
  const staff = isStaffRole(user?.role);
  const initials = (user?.name || user?.email || "GV")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    setIsMobileOpen(false);
    setIsUserMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen((previous) => !previous);
  const closeDropdown = () => setIsDropdownOpen(false);
  const openDropdown = () => setIsDropdownOpen(true);

  const handleWrapperBlur = (event) => {
    if (!dropdownRef.current?.contains(event.relatedTarget)) {
      closeDropdown();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const authLinks = (mobile = false) => {
    if (!isAuthenticated) {
      return (
        <>
          <Link
            to="/login"
            className={`${mobile ? "block px-2 py-3" : ""} text-sm font-medium text-charcoal dark:text-white hover:text-forest dark:hover:text-forest-light`}
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className={`${mobile ? "block" : "inline-flex"} items-center justify-center rounded-xl bg-forest px-4 py-2 text-sm font-medium text-white hover:bg-forest-dark transition-colors`}
          >
            Get started
          </Link>
        </>
      );
    }

    return (
      <>
        <Link
          to="/account"
          className={`${mobile ? "block px-2 py-3" : ""} text-sm font-medium text-charcoal dark:text-white hover:text-forest dark:hover:text-forest-light`}
        >
          My account
        </Link>
        {staff && (
          <Link
            to="/dashboard"
            className={`${mobile ? "block" : "inline-flex"} items-center gap-2 justify-center rounded-xl bg-forest px-4 py-2 text-sm font-medium text-white hover:bg-forest-dark transition-colors`}
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
        )}
      </>
    );
  };

  return (
    <nav className="sticky top-0 w-full z-40 bg-ivory dark:bg-charcoal-dark border-b border-border dark:border-dark-border">
      <div className="container-premium">
        <div className="flex items-center justify-between h-20 px-4">
          <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileOpen(false)}>
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
                      className={`text-sm font-medium text-charcoal dark:text-white transition-colors inline-flex items-center ${
                        isActive(link.path) ? "text-forest dark:text-forest-light" : ""
                      }`}
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
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((previous) => !previous)}
                  className="flex items-center gap-2 rounded-xl border border-border dark:border-dark-border px-2 py-1.5 hover:bg-surface dark:hover:bg-charcoal transition-colors"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="menu"
                >
                  <span className="w-8 h-8 rounded-lg bg-forest text-white flex items-center justify-center text-xs font-semibold">
                    {initials}
                  </span>
                  <span className="max-w-[10rem] truncate text-sm font-medium text-charcoal dark:text-white">
                    {user?.name || user?.email}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted" />
                </button>
                {isUserMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-charcoal-dark rounded-xl border border-border dark:border-dark-border shadow-xl py-2 z-50"
                  >
                    <Link
                      to="/account"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal dark:text-white hover:bg-surface dark:hover:bg-charcoal"
                      role="menuitem"
                    >
                      <User className="h-4 w-4" /> My account
                    </Link>
                    {staff && (
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal dark:text-white hover:bg-surface dark:hover:bg-charcoal"
                        role="menuitem"
                      >
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-charcoal dark:text-white hover:text-forest dark:hover:text-forest-light">
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-forest px-4 py-2 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
                >
                  Get started
                </Link>
              </>
            )}
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-border dark:border-dark-border px-4 py-2 text-sm font-medium text-charcoal dark:text-white hover:bg-surface dark:hover:bg-charcoal transition-colors"
            >
              Start a Project
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated && (
              <Link to="/account" className="w-9 h-9 rounded-lg bg-forest text-white flex items-center justify-center text-xs font-semibold">
                {initials}
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsMobileOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-charcoal-dark border-l border-border dark:border-dark-border shadow-2xl flex flex-col">
            <div className="p-6 border-b border-border dark:border-dark-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-forest rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GV</span>
                </div>
                <span className="font-bold text-charcoal dark:text-white font-display">GrowthVerse</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-3 flex-1 overflow-y-auto">
              {NAV_LINKS.map((link) => {
                if (link.hasDropdown) {
                  return (
                    <div key={link.name} className="border-b border-border dark:border-dark-border pb-2">
                      <button
                        onClick={toggleDropdown}
                        className="w-full flex items-center justify-between text-sm font-medium text-charcoal dark:text-white"
                      >
                        {link.name}
                        <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
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

              <div className="pt-6 border-t border-border dark:border-dark-border space-y-3">
                {authLinks(true)}
                <Link
                  to="/contact"
                  className="block rounded-xl border border-border dark:border-dark-border px-4 py-2.5 text-center text-sm font-medium text-charcoal dark:text-white"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Start a Project
                </Link>
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
