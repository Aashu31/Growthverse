import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  Menu,
  User,
  X,
  LayoutDashboard,
  ArrowUpRight,
  Sparkles,
  Layers,
  Code2,
  Palette,
  Smartphone,
  Bot,
  Cloud,
  Megaphone,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { isStaffRole } from "../../utils/permissions";

const SERVICES_MENU = [
  {
    name: "Website Development",
    path: "/services/website-development",
    desc: "Custom high-converting marketing & corporate sites",
    icon: Code2,
  },
  {
    name: "Web Application Development",
    path: "/services/web-application-development",
    desc: "Scalable SaaS & full-stack web platforms",
    icon: Layers,
  },
  {
    name: "UI/UX Design",
    path: "/services/ui-ux-design",
    desc: "User research, wireframing & design systems",
    icon: Palette,
  },
  {
    name: "Mobile App Development",
    path: "/services/mobile-application-development",
    desc: "Native iOS & Android mobile applications",
    icon: Smartphone,
  },
  {
    name: "AI & Automation",
    path: "/services/ai-and-automation",
    desc: "Smart workflows, LLM agents & process bots",
    icon: Bot,
  },
  {
    name: "Cloud & DevOps",
    path: "/services/cloud-and-devops",
    desc: "AWS, CI/CD automation & scalable architecture",
    icon: Cloud,
  },
  {
    name: "Digital Branding",
    path: "/services/digital-branding",
    desc: "Visual identities, guidelines & collateral",
    icon: Sparkles,
  },
  {
    name: "Digital Marketing",
    path: "/services/digital-marketing",
    desc: "SEO, growth strategies & digital campaigns",
    icon: Megaphone,
  },
];

const SOLUTIONS_MENU = [
  {
    name: "Sarthi",
    path: "/sarthi",
    desc: "Complete digital school management platform",
    icon: GraduationCap,
  },
  {
    name: "Technology Stack",
    path: "/technologies",
    desc: "Modern frameworks, cloud engines & tooling",
    icon: Code2,
  },
  {
    name: "Features & Capabilities",
    path: "/features",
    desc: "Engineered for security, speed & scalability",
    icon: Layers,
  },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'services' | 'solutions' | null
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const servicesTimeoutRef = useRef(null);
  const solutionsTimeoutRef = useRef(null);
  const userMenuRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const staff = isStaffRole(user?.role);
  const initials = (user?.name || user?.email || "GV")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsUserMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (menu) => {
    if (menu === "services") {
      clearTimeout(servicesTimeoutRef.current);
      setActiveDropdown("services");
    } else if (menu === "solutions") {
      clearTimeout(solutionsTimeoutRef.current);
      setActiveDropdown("solutions");
    }
  };

  const handleMouseLeave = (menu) => {
    if (menu === "services") {
      servicesTimeoutRef.current = setTimeout(() => {
        setActiveDropdown((prev) => (prev === "services" ? null : prev));
      }, 150);
    } else if (menu === "solutions") {
      solutionsTimeoutRef.current = setTimeout(() => {
        setActiveDropdown((prev) => (prev === "solutions" ? null : prev));
      }, 150);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav
      className={`sticky top-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-espresso/90 backdrop-blur-xl border-b border-champagne/15 shadow-2xl py-3"
          : "bg-espresso/80 backdrop-blur-md border-b border-white/5 py-4"
      }`}
    >
      <div className="container-premium">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="GrowthVerse Home"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-champagne via-caramel to-deep-coffee p-[1px] shadow-glow-gold transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-espresso rounded-[11px] flex items-center justify-center">
                <span className="font-serif font-bold text-champagne text-lg italic tracking-tight">
                  G
                </span>
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-bold font-serif tracking-tight text-light-text group-hover:text-champagne transition-colors">
                GrowthVerse
              </span>
              <span className="text-[10px] font-sans text-champagne/80 font-semibold ml-0.5 relative -top-2">
                ®
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-full text-sm font-sans font-medium transition-all duration-200 relative ${
                isActive("/") && location.pathname === "/"
                  ? "text-champagne"
                  : "text-warm-grey hover:text-light-text"
              }`}
            >
              Home
              {isActive("/") && location.pathname === "/" && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-champagne rounded-full" />
              )}
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("services")}
              onMouseLeave={() => handleMouseLeave("services")}
            >
              <button
                type="button"
                className={`px-3.5 py-2 rounded-full text-sm font-sans font-medium inline-flex items-center gap-1.5 transition-all duration-200 ${
                  activeDropdown === "services" || isActive("/services")
                    ? "text-champagne"
                    : "text-warm-grey hover:text-light-text"
                }`}
                aria-expanded={activeDropdown === "services"}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "services" ? "rotate-180 text-champagne" : ""
                  }`}
                />
              </button>

              {activeDropdown === "services" && (
                <div className="absolute top-full -left-20 pt-2 w-[540px] animate-fade-in z-50">
                  <div className="bg-deep-coffee/95 backdrop-blur-2xl border border-champagne/20 rounded-2xl p-4 shadow-glass-lg">
                    <div className="grid grid-cols-2 gap-2">
                      {SERVICES_MENU.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 hover:bg-white/5 group/item"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="w-8 h-8 rounded-lg bg-champagne/10 border border-champagne/20 flex items-center justify-center shrink-0 text-champagne group-hover/item:bg-champagne group-hover/item:text-espresso transition-all">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-light-text group-hover/item:text-champagne transition-colors truncate">
                                {item.name}
                              </div>
                              <p className="text-[11px] text-warm-grey line-clamp-1 mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between px-2">
                      <span className="text-[11px] text-warm-grey">
                        Looking for all capabilities?
                      </span>
                      <Link
                        to="/services"
                        className="text-xs font-semibold text-champagne hover:text-light-gold inline-flex items-center gap-1"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <span>Explore all services</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("solutions")}
              onMouseLeave={() => handleMouseLeave("solutions")}
            >
              <button
                type="button"
                className={`px-3.5 py-2 rounded-full text-sm font-sans font-medium inline-flex items-center gap-1.5 transition-all duration-200 ${
                  activeDropdown === "solutions" ||
                  isActive("/sarthi") ||
                  isActive("/technologies") ||
                  isActive("/features")
                    ? "text-champagne"
                    : "text-warm-grey hover:text-light-text"
                }`}
                aria-expanded={activeDropdown === "solutions"}
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "solutions" ? "rotate-180 text-champagne" : ""
                  }`}
                />
              </button>

              {activeDropdown === "solutions" && (
                <div className="absolute top-full -left-10 pt-2 w-80 animate-fade-in z-50">
                  <div className="bg-deep-coffee/95 backdrop-blur-2xl border border-champagne/20 rounded-2xl p-3 shadow-glass-lg space-y-1">
                    {SOLUTIONS_MENU.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 hover:bg-white/5 group/item"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-champagne/10 border border-champagne/20 flex items-center justify-center shrink-0 text-champagne group-hover/item:bg-champagne group-hover/item:text-espresso transition-all">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-light-text group-hover/item:text-champagne transition-colors">
                              {item.name}
                            </div>
                            <p className="text-[11px] text-warm-grey mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/portfolio"
              className={`px-3.5 py-2 rounded-full text-sm font-sans font-medium transition-all duration-200 ${
                isActive("/portfolio")
                  ? "text-champagne"
                  : "text-warm-grey hover:text-light-text"
              }`}
            >
              Portfolio
            </Link>

            <Link
              to="/pricing"
              className={`px-3.5 py-2 rounded-full text-sm font-sans font-medium transition-all duration-200 ${
                isActive("/pricing")
                  ? "text-champagne"
                  : "text-warm-grey hover:text-light-text"
              }`}
            >
              Pricing
            </Link>

            <Link
              to="/about"
              className={`px-3.5 py-2 rounded-full text-sm font-sans font-medium transition-all duration-200 ${
                isActive("/about")
                  ? "text-champagne"
                  : "text-warm-grey hover:text-light-text"
              }`}
            >
              About
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-champagne/20 bg-dark-mocha/60 hover:bg-dark-mocha text-light-text transition-all focus:outline-none"
                  aria-expanded={isUserMenuOpen}
                >
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-champagne to-caramel text-espresso font-bold text-xs flex items-center justify-center">
                    {initials}
                  </span>
                  <span className="text-xs font-medium max-w-[120px] truncate text-light-text">
                    {user?.name || user?.email}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-warm-grey" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-deep-coffee/95 backdrop-blur-xl border border-champagne/20 rounded-2xl shadow-glass-lg py-2 z-50 animate-fade-in">
                    <Link
                      to="/account"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-light-text hover:bg-white/5 hover:text-champagne transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 text-champagne" />
                      <span>My Account</span>
                    </Link>

                    {staff && (
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-light-text hover:bg-white/5 hover:text-champagne transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 text-champagne" />
                        <span>Staff Dashboard</span>
                      </Link>
                    )}

                    <div className="my-1 border-t border-white/10" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 rounded-full border border-champagne/30 text-xs font-semibold text-light-text hover:text-champagne hover:border-champagne/60 hover:bg-champagne/5 transition-all"
              >
                Login
              </Link>
            )}

            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-champagne via-caramel to-champagne bg-[length:200%_auto] hover:bg-[position:right_center] text-espresso font-sans font-semibold text-xs inline-flex items-center gap-1.5 shadow-md shadow-champagne/20 hover:shadow-glow-gold hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {isAuthenticated && (
              <Link
                to="/account"
                className="w-8 h-8 rounded-full bg-gradient-to-br from-champagne to-caramel text-espresso font-bold text-xs flex items-center justify-center mr-1"
                aria-label="My account"
              >
                {initials}
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              className="p-2 rounded-xl border border-champagne/20 text-light-text hover:text-champagne hover:bg-white/5 transition-colors"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 top-[60px] z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setIsMobileOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-espresso border-l border-champagne/20 shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="space-y-4 flex-1">
              <Link
                to="/"
                className="block text-base font-medium text-light-text hover:text-champagne py-2 border-b border-white/5"
                onClick={() => setIsMobileOpen(false)}
              >
                Home
              </Link>

              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-champagne mb-2">
                  Services
                </span>
                <div className="grid grid-cols-1 gap-1 pl-2">
                  {SERVICES_MENU.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="text-sm text-warm-grey hover:text-light-text py-1.5"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-champagne mb-2">
                  Solutions
                </span>
                <div className="grid grid-cols-1 gap-1 pl-2">
                  {SOLUTIONS_MENU.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="text-sm text-warm-grey hover:text-light-text py-1.5"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/portfolio"
                className="block text-base font-medium text-light-text hover:text-champagne py-2 border-b border-white/5"
                onClick={() => setIsMobileOpen(false)}
              >
                Portfolio
              </Link>

              <Link
                to="/pricing"
                className="block text-base font-medium text-light-text hover:text-champagne py-2 border-b border-white/5"
                onClick={() => setIsMobileOpen(false)}
              >
                Pricing
              </Link>

              <Link
                to="/about"
                className="block text-base font-medium text-light-text hover:text-champagne py-2 border-b border-white/5"
                onClick={() => setIsMobileOpen(false)}
              >
                About
              </Link>
            </div>

            <div className="pt-6 border-t border-champagne/20 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="block w-full py-2.5 text-center rounded-xl bg-dark-mocha text-light-text text-sm font-semibold border border-champagne/20"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    My Account
                  </Link>

                  {staff && (
                    <Link
                      to="/dashboard"
                      className="block w-full py-2.5 text-center rounded-xl bg-champagne/15 text-champagne text-sm font-semibold border border-champagne/30"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Staff Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full py-2.5 text-center rounded-xl bg-red-900/30 text-red-300 text-sm font-semibold border border-red-500/30"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block w-full py-2.5 text-center rounded-xl border border-champagne/30 text-light-text text-sm font-semibold hover:border-champagne"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/signup"
                    className="block w-full py-2.5 text-center rounded-xl bg-white/10 text-light-text text-sm font-semibold hover:bg-white/20"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}

              <Link
                to="/contact"
                className="block w-full py-3 text-center rounded-xl bg-gradient-to-r from-champagne to-caramel text-espresso text-sm font-bold shadow-lg"
                onClick={() => setIsMobileOpen(false)}
              >
                Start a Project ↗
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
