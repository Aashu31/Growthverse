import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
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
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-charcoal dark:text-white font-display mb-3">Invalid reset link</h1>
        <p className="text-sm text-muted dark:text-gray-400 mb-8">
          This link is missing its token. Request a new password reset email to continue.
        </p>
        <Link to="/forgot-password" className="btn-primary inline-flex px-6 py-3">Request a new link</Link>
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
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-forest-light dark:bg-forest/20 text-forest-dark dark:text-forest-light flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-charcoal dark:text-white font-display mb-3">Password reset</h1>
        <p className="text-sm text-muted dark:text-gray-400 mb-8">
          Your password has been changed and all existing sessions were revoked. Sign in with your
          new password.
        </p>
        <Link to="/login" className="btn-primary inline-flex px-6 py-3">Sign in</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-forest-light dark:bg-forest/20 text-forest-dark dark:text-forest-light flex items-center justify-center mx-auto mb-4">
          <KeyRound className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-charcoal dark:text-white font-display">Choose a new password</h1>
        <p className="text-sm text-muted dark:text-gray-400 mt-2">
          This link can be used once. All other sessions will be signed out.
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

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormInput
          label="New password"
          type="password"
          name="password"
          id="reset-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          placeholder="New password"
          autoComplete="new-password"
          required
        />
        <ul className="grid grid-cols-2 gap-1.5 text-xs">
          {checks.map((check) => {
            const passed = check.test(password);
            return (
              <li key={check.label} className={passed ? "text-green-600 dark:text-green-400" : "text-muted dark:text-gray-500"}>
                {passed ? "✓" : "•"} {check.label}
              </li>
            );
          })}
        </ul>
        <FormInput
          label="Confirm new password"
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
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 disabled:opacity-60">
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
