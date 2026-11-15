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
    <div className="min-h-screen bg-gray-50 dark:bg-charcoal-dark text-primary-text dark:text-white">
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-dark-secondary border-r border-border dark:border-gray-700 shadow-lg transform transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border dark:border-gray-700">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-forest rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GV</span>
            </div>
            <span className="font-bold text-primary-text dark:text-white">GrowthVerse</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 text-gray-500 hover:text-primary-text dark:text-gray-400 dark:hover:text-white"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-13rem)]">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(item)
                    ? "bg-forest-light dark:bg-forest/20 text-forest-dark dark:text-forest-light"
                    : "text-secondary-text dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-text dark:hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border dark:border-gray-700 bg-white dark:bg-dark-secondary">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-forest text-white flex items-center justify-center font-medium text-sm">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-primary-text dark:text-white truncate">
                {user?.name || "Staff user"}
              </p>
              <p className="text-xs text-secondary-text dark:text-gray-400 truncate">{roleLabel(user?.role)}</p>
            </div>
          </div>
          <Link
            to="/account"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-secondary-text dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-text dark:hover:text-white transition-colors"
          >
            <User className="h-4 w-4" /> My account
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-dark-secondary/80 backdrop-blur-md border-b border-border dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold text-primary-text dark:text-white">
                {current?.name || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {isSuperAdmin && (
                <span className="hidden sm:inline-flex items-center rounded-full bg-forest-light dark:bg-forest/20 px-3 py-1 text-xs font-medium text-forest-dark dark:text-forest-light">
                  Super administrator
                </span>
              )}
              <Link
                to="/"
                className="hidden sm:inline-block px-3 py-2 text-sm font-medium text-secondary-text dark:text-gray-400 hover:text-primary-text dark:hover:text-white"
              >
                View website
              </Link>
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-text dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Toggle theme"
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Link
                to="/account"
                className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center font-medium text-sm ml-1"
                title="My account"
              >
                {initials}
              </Link>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
