import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, KeyRound, ArrowRight } from "lucide-react";
import { FormInput } from "../../components/common/Forms";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../api/client";

const checks = [
  { label: "At least 10 characters", test: (value) => value.length >= 10 },
  { label: "One uppercase letter", test: (value) => /[A-Z]/.test(value) },
  { label: "One lowercase letter", test: (value) => /[a-z]/.test(value) },
  { label: "One number", test: (value) => /[0-9]/.test(value) },
];

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!completed && !token) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-light-text">Invalid Reset Link</h1>
        <p className="text-xs sm:text-sm text-warm-grey">
          This security link is missing its authorization token. Please request a new recovery email.
        </p>
        <div className="pt-2">
          <Link
            to="/forgot-password"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-champagne to-caramel text-espresso font-bold text-xs inline-flex items-center justify-center gap-2 shadow"
          >
            <span>Request New Reset Link</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    const failed = checks.filter((check) => !check.test(password));
    if (!password) nextErrors.password = "Password is required.";
    else if (failed.length > 0) nextErrors.password = failed[0].label + " is required.";
    if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setError("");
    try {
      await resetPassword({ token, newPassword: password });
      setCompleted(true);
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setErrors(requestError.fieldErrors());
        setError(requestError.message || "This reset link is invalid or has expired.");
      } else {
        setError("Unable to reach the server. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completed) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-champagne/15 border border-champagne/30 text-champagne flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-light-text">Password Updated</h1>
        <p className="text-xs sm:text-sm text-warm-grey">
          Your credentials have been securely reset. You can now access your account with
          the new password.
        </p>
        <div className="pt-2">
          <Link
            to="/login"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-champagne to-caramel text-espresso font-bold text-xs inline-flex items-center justify-center gap-2 shadow"
          >
            <span>Sign In Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-champagne/15 border border-champagne/30 text-champagne flex items-center justify-center mx-auto mb-3">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-light-text">
          Set New Password
        </h1>
        <p className="text-xs sm:text-sm text-warm-grey mt-2">
          Choose a strong password to safeguard your account.
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
          label="New Password"
          type="password"
          name="password"
          id="reset-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          placeholder="New secure password"
          autoComplete="new-password"
          required
        />

        <ul className="grid grid-cols-2 gap-1.5 text-[11px] py-1">
          {checks.map((check) => {
            const passed = check.test(password);
            return (
              <li
                key={check.label}
                className={passed ? "text-champagne font-medium" : "text-warm-grey/60"}
              >
                {passed ? "✓" : "•"} {check.label}
              </li>
            );
          })}
        </ul>

        <FormInput
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          id="reset-confirm-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={errors.confirmPassword}
          placeholder="Repeat new password"
          autoComplete="new-password"
          required
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-champagne via-caramel to-champagne bg-[length:200%_auto] hover:bg-[position:right_center] text-espresso font-bold text-sm shadow-md hover:shadow-glow-gold hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? "Updating Password..." : "Update Password ↗"}
          </button>
        </div>
      </form>
    </div>
  );
}
