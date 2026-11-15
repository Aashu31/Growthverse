import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function AuthLayout() {
  const location = useLocation();
  const isLogin = location.pathname === "/login" || location.pathname === "/";

  return (
    <div className="min-h-screen bg-espresso text-light-text px-4 py-12 flex items-center justify-center relative overflow-hidden selection:bg-champagne selection:text-espresso">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-caramel/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Logo Header */}
        <Link to="/" className="flex flex-col items-center justify-center gap-3 mb-8 group text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-champagne via-caramel to-deep-coffee p-[1px] shadow-glow-gold transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-espresso rounded-[15px] flex items-center justify-center">
              <span className="font-serif font-bold text-champagne text-2xl italic">G</span>
            </div>
          </div>
          <div>
            <span className="block text-2xl font-bold font-serif tracking-tight text-light-text group-hover:text-champagne transition-colors">
              GrowthVerse
            </span>
            <span className="block text-xs text-warm-grey mt-0.5">
              Build Digital. Grow Business.
            </span>
          </div>
        </Link>

        {/* Auth Glass Card */}
        <div className="bg-deep-coffee/90 backdrop-blur-2xl rounded-3xl border border-champagne/20 shadow-glass-lg p-8 sm:p-10">
          <Outlet />
        </div>

        {/* Footer switch prompt */}
        <div className="mt-6 text-center">
          <p className="text-sm text-warm-grey">
            {isLogin ? (
              <>
                New to GrowthVerse?{" "}
                <Link
                  to="/signup"
                  className="text-champagne font-semibold hover:text-light-gold transition-colors"
                >
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-champagne font-semibold hover:text-light-gold transition-colors"
                >
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-warm-grey/70">
          <ShieldCheck className="w-4 h-4 text-champagne/70" />
          <span>Secure session with HttpOnly cookies & CSRF protection</span>
        </p>
      </div>
    </div>
  );
}
