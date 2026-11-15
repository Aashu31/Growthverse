import React from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark px-4">
      <div className="max-w-md w-full bg-white dark:bg-dark-secondary rounded-3xl border border-border dark:border-gray-700 shadow-2xl p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/25">
            <span className="text-white font-bold text-2xl">GV</span>
          </div>
          <h2 className="text-h3 text-primary-text dark:text-white">GrowthVerse</h2>
          <p className="text-secondary-text dark:text-gray-300 text-sm mt-2">
            Build Digital. Grow Business.
          </p>
        </div>
        <div className="space-y-6">{<Outlet />}</div>
        <div className="mt-8 pt-6 border-t border-border dark:border-gray-700 text-center">
          <p className="text-sm text-secondary-text dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 dark:text-electric-blue font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
