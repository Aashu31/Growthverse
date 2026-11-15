import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Layout,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Bell,
  User,
} from "lucide-react";

const DASHBOARD_NAV = [
  { name: "Overview", path: "/dashboard", icon: Layout },
  { name: "Services", path: "/dashboard/services", icon: Layout },
  { name: "Pricing", path: "/dashboard/pricing", icon: Layout },
  { name: "Features", path: "/dashboard/features", icon: Layout },
  { name: "Orders", path: "/dashboard/orders", icon: Layout },
  { name: "Customers", path: "/dashboard/customers", icon: Layout },
  { name: "Contacts", path: "/dashboard/contacts", icon: Layout },
  { name: "Portfolio", path: "/dashboard/portfolio", icon: Layout },
  { name: "Profile", path: "/dashboard/profile", icon: User },
  { name: "Settings", path: "/dashboard/settings", icon: Layout },
];

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(window.innerWidth >= 1024);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark text-primary-text dark:text-white">
      <div className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm hidden md:hidden" onClick={() => setIsMobileOpen(false)} />
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-dark-secondary border-r border-border dark:border-gray-700 shadow-lg transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GV</span>
            </div>
            <span className="font-bold text-primary-text dark:text-white">GrowthVerse</span>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-2 text-gray-500 hover:text-primary-text dark:text-gray-400 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-1">
          {DASHBOARD_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-electric-blue"
                    : "text-secondary-text dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-text dark:hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </button>
            );
          })}
        </div>
        <div className="p-6 border-t border-border dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-text dark:text-white">
                {user?.name || "Demo User"}
              </p>
              <p className="text-xs text-secondary-text dark:text-gray-400">
                {user?.email || "demo@growthverse.example"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-dark-secondary/80 backdrop-blur-md border-b border-border dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold text-primary-text dark:text-white hidden sm:block">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-border dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 w-64"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-text dark:hover:text-white relative">
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-text dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-border dark:border-gray-700">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                  {user?.name?.charAt(0) || "D"}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">{<Outlet />}</main>
      </div>
    </div>
  );
}
