import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";
import { FormInput } from "../../components/common/Forms";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../api/client";

const passwordChecks = [
  { label: "At least 10 characters", test: (value) => value.length >= 10 },
  { label: "One uppercase letter", test: (value) => /[A-Z]/.test(value) },
  { label: "One lowercase letter", test: (value) => /[a-z]/.test(value) },
  { label: "One number", test: (value) => /[0-9]/.test(value) },
];

export default function Signup() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (formData.name.trim().length < 2) nextErrors.name = "Please enter your full name.";
    if (!formData.email.trim()) nextErrors.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    const failedChecks = passwordChecks.filter((check) => !check.test(formData.password));
    if (formData.password.length === 0) nextErrors.password = "Password is required.";
    else if (failedChecks.length > 0) nextErrors.password = failedChecks[0].label + " is required.";
    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setFormError("");
    try {
      const response = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      setResult({
        message: response?.message || "Account created. Please verify your email.",
        devVerificationUrl: response?.devVerificationUrl || null,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.fieldErrors());
        setFormError(error.message || "Registration failed. Please try again.");
      } else {
        setFormError("Unable to reach the server. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-forest-light dark:bg-forest/20 text-forest-dark dark:text-forest-light flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-charcoal dark:text-white font-display mb-3">Account created</h1>
        <p className="text-sm text-muted dark:text-gray-400 mb-6">{result.message}</p>

        {result.devVerificationUrl && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-200">
            <p className="font-medium mb-2">Development email delivery is not configured.</p>
            <a
              href={result.devVerificationUrl}
              className="inline-flex items-center gap-1 font-medium underline break-all"
            >
              Open verification link <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </a>
          </div>
        )}

        <Link to="/login" className="btn-primary inline-flex px-6 py-3">Go to sign in</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-charcoal dark:text-white font-display">Create your account</h1>
        <p className="text-sm text-muted dark:text-gray-400 mt-2">
          Track projects, orders and enquiries in one place.
        </p>
      </div>

      {formError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-300"
        >
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormInput
          label="Full name"
          name="name"
          id="signup-name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Your name"
          autoComplete="name"
          required
        />
        <FormInput
          label="Email address"
          type="email"
          name="email"
          id="signup-email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@company.com"
          autoComplete="email"
          required
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          id="signup-password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Create a strong password"
          autoComplete="new-password"
          required
        />

        <ul className="grid grid-cols-2 gap-1.5 text-xs">
          {passwordChecks.map((check) => {
            const passed = check.test(formData.password);
            return (
              <li
                key={check.label}
                className={passed ? "text-green-600 dark:text-green-400" : "text-muted dark:text-gray-500"}
              >
                {passed ? "✓" : "•"} {check.label}
              </li>
            );
          })}
        </ul>

        <FormInput
          label="Confirm password"
          type="password"
          name="confirmPassword"
          id="signup-confirm-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Repeat your password"
          autoComplete="new-password"
          required
        />

        <p className="text-xs text-muted dark:text-gray-500">
          Public sign-up creates a customer account. Staff and administrative roles are assigned
          only by a super administrator.
        </p>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 disabled:opacity-60">
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
