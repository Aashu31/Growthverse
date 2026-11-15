import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { PERMISSIONS, roleLabel } from "../utils/permissions";
import {
  Briefcase,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Moon,
  Settings,
  ShoppingBag,
  Sparkles,
  Sun,
  Tags,
  User,
  UserCog,
  Users,
  Wrench,
  X,
  ExternalLink,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Overview", path: "/dashboard", icon: LayoutDashboard, permission: PERMISSIONS.DASHBOARD_VIEW, end: true },
  { name: "Services", path: "/dashboard/services", icon: Wrench, permission: PERMISSIONS.CONTENT_VIEW },
  { name: "Pricing", path: "/dashboard/pricing", icon: Tags, permission: PERMISSIONS.CONTENT_VIEW },
  { name: "Features", path: "/dashboard/features", icon: Sparkles, permission: PERMISSIONS.CONTENT_VIEW },
  { name: "Portfolio", path: "/dashboard/portfolio", icon: Briefcase, permission: PERMISSIONS.CONTENT_VIEW },
  { name: "Orders", path: "/dashboard/orders", icon: ShoppingBag, permission: PERMISSIONS.ORDERS_VIEW },
  { name: "Customers", path: "/dashboard/customers", icon: Users, permission: PERMISSIONS.CUSTOMERS_VIEW },
  { name: "Contacts", path: "/dashboard/contacts", icon: Mail, permission: PERMISSIONS.CONTACTS_VIEW },
  { name: "Users & Roles", path: "/dashboard/users", icon: UserCog, permission: PERMISSIONS.USERS_MANAGE },
  { name: "Company Profile", path: "/dashboard/profile", icon: User, permission: PERMISSIONS.SETTINGS_VIEW },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout, hasPermission, isSuperAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const isActive = (item) =>
    item.end ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const visibleItems = NAV_ITEMS.filter((item) => !item.permission || hasPermission(item.permission));
  const current = visibleItems.find((item) => isActive(item));
  const initials = (user?.name || user?.email || "GV")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#1A0E09] text-light-text selection:bg-champagne selection:text-espresso">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-espresso border-r border-champagne/15 shadow-2xl transform transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand in Sidebar */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-champagne/15">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-champagne via-caramel to-deep-coffee p-[1px] shadow-glow-gold">
              <div className="w-full h-full bg-espresso rounded-[7px] flex items-center justify-center">
                <span className="font-serif font-bold text-champagne text-sm italic">G</span>
              </div>
            </div>
            <span className="font-serif font-bold text-light-text text-base">GrowthVerse</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 text-warm-grey hover:text-champagne transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-14rem)]">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-champagne/15 text-champagne border border-champagne/30 shadow-sm"
                    : "text-warm-grey hover:bg-white/5 hover:text-light-text"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-champagne" : "text-warm-grey"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer User Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-champagne/15 bg-espresso/95 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-champagne to-caramel text-espresso flex items-center justify-center font-bold text-xs shadow-md">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-light-text truncate">
                {user?.name || "Staff User"}
              </p>
              <p className="text-[10px] text-champagne/80 truncate font-medium">
                {roleLabel(user?.role)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/account"
              className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-deep-coffee border border-champagne/20 text-[11px] font-medium text-warm-grey hover:text-light-text hover:border-champagne/50 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Account</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-900/20 border border-red-500/20 text-[11px] font-medium text-red-300 hover:bg-red-900/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-espresso/90 backdrop-blur-xl border-b border-champagne/15">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2 text-warm-grey hover:bg-white/5 rounded-lg"
                aria-label="Open navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-base font-serif font-bold text-light-text">
                {current?.name || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {isSuperAdmin && (
                <span className="hidden sm:inline-flex items-center rounded-full bg-champagne/15 border border-champagne/30 px-3 py-0.5 text-[11px] font-semibold text-champagne">
                  Super Admin
                </span>
              )}

              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-warm-grey hover:text-champagne transition-colors"
              >
                <span>View Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={toggleTheme}
                className="p-2 text-warm-grey hover:text-champagne rounded-lg hover:bg-white/5 transition-colors"
                title="Toggle Theme"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <Link
                to="/account"
                className="w-8 h-8 rounded-full bg-gradient-to-br from-champagne to-caramel text-espresso flex items-center justify-center font-bold text-xs shadow-md"
                title="My Account"
              >
                {initials}
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="p-4 lg:p-8 bg-[#150A06] min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
