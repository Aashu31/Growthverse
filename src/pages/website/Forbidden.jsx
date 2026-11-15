import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, User } from "lucide-react";

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-espresso text-light-text px-4 relative overflow-hidden selection:bg-champagne selection:text-espresso">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-red-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full bg-deep-coffee/90 backdrop-blur-2xl rounded-3xl border border-champagne/20 shadow-2xl p-10 text-center relative z-10 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-serif font-bold text-light-text">Access Denied</h1>

        <p className="text-xs sm:text-sm text-warm-grey leading-relaxed">
          Your account does not possess the necessary role permissions to access this
          restricted administrative partition.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-champagne to-caramel text-espresso font-bold text-xs inline-flex items-center justify-center gap-2 shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Site</span>
          </Link>

          <Link
            to="/account"
            className="px-6 py-3 rounded-xl border border-champagne/30 text-light-text font-semibold text-xs inline-flex items-center justify-center gap-2 hover:border-champagne"
          >
            <User className="w-4 h-4 text-champagne" />
            <span>My Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
