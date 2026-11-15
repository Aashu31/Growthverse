import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout() {
  const location = useLocation();
  const isLogin = location.pathname === "/login" || location.pathname === "/";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-charcoal-dark px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-forest rounded-2xl flex items-center justify-center shadow-lg shadow-forest/25">
            <span className="text-white font-bold text-xl">GV</span>
          </div>
          <div>
            <span className="block text-xl font-bold text-charcoal dark:text-white font-display leading-tight">
              GrowthVerse
            </span>
            <span className="block text-xs text-muted dark:text-gray-400">
              Build Digital. Grow Business.
            </span>
          </div>
        </Link>

        <div className="bg-white dark:bg-charcoal rounded-3xl border border-border dark:border-dark-border shadow-xl p-8 md:p-10">
          <Outlet />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted dark:text-gray-400">
            {isLogin ? (
              <>
                New to GrowthVerse?{" "}
                <Link to="/signup" className="text-forest-dark dark:text-forest-light font-medium hover:underline">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link to="/login" className="text-forest-dark dark:text-forest-light font-medium hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted dark:text-gray-500">
          <ShieldCheck className="h-4 w-4" />
          Secure session with HttpOnly cookies and CSRF protection
        </p>
      </div>
    </div>
  );
}
