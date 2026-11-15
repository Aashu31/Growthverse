import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ExternalLink, AlertCircle, ArrowRight } from "lucide-react";
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
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-champagne/15 border border-champagne/30 text-champagne flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-light-text">Account Created</h1>
        <p className="text-xs sm:text-sm text-warm-grey">{result.message}</p>

        {result.devVerificationUrl && (
          <div className="rounded-xl border border-champagne/30 bg-espresso/60 p-4 text-left text-xs text-warm-grey">
            <p className="font-semibold text-champagne mb-1.5">Development Environment Note:</p>
            <a
              href={result.devVerificationUrl}
              className="inline-flex items-center gap-1 font-medium text-light-text underline break-all hover:text-champagne"
            >
              Click here to verify email in local dev mode <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>
        )}

        <div className="pt-4">
          <Link
            to="/login"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-champagne to-caramel text-espresso font-bold text-xs inline-flex items-center justify-center gap-2 shadow"
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-light-text">
          Create Client Account
        </h1>
        <p className="text-xs sm:text-sm text-warm-grey mt-2">
          Track project milestones, tickets and deliverables.
        </p>
      </div>

      {formError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-900/20 p-4 text-xs text-red-300"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormInput
          label="Full Name"
          name="name"
          id="signup-name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="e.g. Eleanor Vance"
          autoComplete="name"
          required
        />

        <FormInput
          label="Email Address"
          type="email"
          name="email"
          id="signup-email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="eleanor@company.com"
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
          placeholder="Create a secure passphrase"
          autoComplete="new-password"
          required
        />

        <ul className="grid grid-cols-2 gap-1.5 text-[11px] py-1">
          {passwordChecks.map((check) => {
            const passed = check.test(formData.password);
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
          label="Confirm Password"
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

        <p className="text-[11px] text-warm-grey/70 leading-relaxed">
          Public signup creates a client account. Staff and administrator roles are
          assigned exclusively by a super administrator.
        </p>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-champagne via-caramel to-champagne bg-[length:200%_auto] hover:bg-[position:right_center] text-espresso font-bold text-sm shadow-md hover:shadow-glow-gold hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Create Account ↗"}
          </button>
        </div>
      </form>
    </div>
  );
}
