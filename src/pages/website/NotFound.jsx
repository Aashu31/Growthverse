import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-espresso text-light-text relative overflow-hidden px-4 selection:bg-champagne selection:text-espresso">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="text-center max-w-md relative z-10 space-y-6">
        <div className="text-8xl sm:text-9xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-champagne via-light-gold to-caramel">
          404
        </div>
        <h1 className="text-3xl font-serif font-bold text-light-text">
          Page Not Found
        </h1>
        <p className="text-sm text-warm-grey leading-relaxed">
          The requested page could not be found. It may have been relocated, updated, or
          removed.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="px-7 py-3.5 rounded-full bg-gradient-to-r from-champagne to-caramel text-espresso font-bold text-xs inline-flex items-center gap-2 shadow-lg hover:shadow-glow-gold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
