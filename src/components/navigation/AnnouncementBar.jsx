import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AnnouncementBar() {
  return (
    <div className="bg-espresso text-light-text text-xs py-2 px-4 border-b border-champagne/15 relative z-50 overflow-hidden">
      <div className="container-premium flex items-center justify-center gap-2 text-center">
        <Sparkles className="w-3.5 h-3.5 text-champagne shrink-0 animate-pulse" />
        <span className="font-sans font-medium text-warm-grey">
          Now taking new client projects for Q1/Q2 2026.
        </span>
        <Link
          to="/contact"
          className="inline-flex items-center gap-1 font-semibold text-champagne hover:text-light-gold transition-colors ml-1"
        >
          <span>Start your project</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
