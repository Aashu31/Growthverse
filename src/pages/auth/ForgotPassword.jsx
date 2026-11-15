import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, AlertCircle, ExternalLink, ArrowRight, ArrowLeft } from "lucide-react";
import { FormInput } from "../../components/common/Forms";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../api/client";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [devResetUrl, setDevResetUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await forgotPassword({ email: email.trim() });
      setMessage(
        response?.message ||
          "If an account exists for that email, password reset instructions have been sent."
      );
      setDevResetUrl(response?.devResetUrl || "");
      setSent(true);
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status >= 500) {
        setError("The server could not process the request. Please try again shortly.");
      } else {
        setMessage(
          "If an account exists for that email, password reset instructions have been sent."
        );
        setSent(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-champagne/15 border border-champagne/30 text-champagne flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-light-text">Check Your Email</h1>
        <p className="text-xs sm:text-sm text-warm-grey">{message}</p>

        {devResetUrl && (
          <div className="rounded-xl border border-champagne/30 bg-espresso/60 p-4 text-left text-xs text-warm-grey">
            <p className="font-semibold text-champagne mb-1.5">Development Environment Note:</p>
            <a href={devResetUrl} className="inline-flex items-center gap-1 font-medium text-light-text underline break-all hover:text-champagne">
              Open single-use reset link <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>
        )}

        <div className="pt-4">
          <Link
            to="/login"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-champagne to-caramel text-espresso font-bold text-xs inline-flex items-center justify-center gap-2 shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-light-text">
          Reset Password
        </h1>
        <p className="text-xs sm:text-sm text-warm-grey mt-2">
          Enter your registered email address and we'll transmit a secure recovery token.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-900/20 p-4 text-xs text-red-300"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          id="forgot-email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          required
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-champagne via-caramel to-champagne bg-[length:200%_auto] hover:bg-[position:right_center] text-espresso font-bold text-sm shadow-md hover:shadow-glow-gold hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? "Transmitting..." : "Send Reset Token ↗"}
          </button>
        </div>
      </form>

      <p className="mt-6 text-xs text-center text-warm-grey/60">
        For your security, the response is identical regardless of whether an account exists.
      </p>
    </div>
  );
}
