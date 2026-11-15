import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, AlertCircle, ExternalLink } from "lucide-react";
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
        // Keep the response generic even for validation or network issues.
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
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-forest-light dark:bg-forest/20 text-forest-dark dark:text-forest-light flex items-center justify-center mx-auto mb-6">
          <Mail className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-charcoal dark:text-white font-display mb-3">Check your email</h1>
        <p className="text-sm text-muted dark:text-gray-400 mb-6">{message}</p>

        {devResetUrl && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-200">
            <p className="font-medium mb-2">Development email delivery is not configured.</p>
            <a href={devResetUrl} className="inline-flex items-center gap-1 font-medium underline break-all">
              Open reset link <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </a>
          </div>
        )}

        <Link to="/login" className="btn-primary inline-flex px-6 py-3">Back to sign in</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-charcoal dark:text-white font-display">Forgot your password?</h1>
        <p className="text-sm text-muted dark:text-gray-400 mt-2">
          Enter your email and we will send a single-use reset link.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-300"
        >
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <FormInput
          label="Email address"
          type="email"
          name="email"
          id="forgot-email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          required
        />
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 disabled:opacity-60">
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-6 text-xs text-center text-muted dark:text-gray-500">
        For your security, the response is the same whether or not an account exists.
      </p>
    </div>
  );
}
