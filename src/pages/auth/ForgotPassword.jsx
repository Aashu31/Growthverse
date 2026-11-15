import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSent(true);
    }, 1000);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-charcoal-dark px-4">
        <div className="max-w-md w-full bg-white dark:bg-charcoal rounded-3xl border border-border dark:border-dark-border shadow-2xl p-8 md:p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-forest-light flex items-center justify-center mx-auto mb-6 text-forest-dark">
            <Mail className="h-8 w-8" />
          </div>
          <h2 className="text-h3 text-charcoal dark:text-white mb-3">Check Your Email</h2>
          <p className="text-muted dark:text-gray-400 mb-8">
            Password reset instructions have been sent to {email}.
            <br />
            <span className="text-xs text-gray-400 block mt-2">
              This is a frontend demonstration. No real email is delivered.
            </span>
          </p>
          <Link to="/login" className="btn-primary">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-charcoal-dark px-4">
      <div className="max-w-md w-full bg-white dark:bg-charcoal rounded-3xl border border-border dark:border-dark-border shadow-2xl p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-forest rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-forest/25">
            <span className="text-white font-bold text-2xl">GV</span>
          </div>
          <h2 className="text-h3 text-charcoal dark:text-white">Forgot Password</h2>
          <p className="text-muted dark:text-gray-400 text-sm mt-2">
            Enter your email to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-charcoal dark:text-white block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-charcoal text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-forest/50"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-4"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border dark:border-dark-border">
          <p className="text-sm text-muted dark:text-gray-400 text-center">
            Remember your password?{" "}
            <Link to="/login" className="text-forest-dark dark:text-forest-light font-medium hover:underline">
              Sign in
            </Link>
          </p>
          <div className="bg-forest-light/50 dark:bg-forest/10 rounded-xl p-4 border border-forest/20 dark:border-forest/20 mt-6">
            <p className="text-xs text-muted dark:text-gray-400 leading-relaxed">
              <strong className="text-charcoal dark:text-white">Demo Mode:</strong>
              Password reset is a frontend demonstration. No real reset email
              is delivered and no backend authentication exists.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
