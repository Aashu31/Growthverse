import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-charcoal-dark px-4">
      <div className="max-w-md w-full bg-white dark:bg-charcoal rounded-3xl border border-border dark:border-dark-border shadow-xl p-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-h3 text-charcoal dark:text-white mb-3">Access denied</h1>
        <p className="text-muted dark:text-gray-400 mb-8">
          Your account does not have permission to view this area. If you believe this is a
          mistake, contact a GrowthVerse administrator.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary px-6 py-3">Back to website</Link>
          <Link
            to="/account"
            className="px-6 py-3 rounded-xl border border-border dark:border-dark-border text-charcoal dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            My account
          </Link>
        </div>
      </div>
    </div>
  );
}
