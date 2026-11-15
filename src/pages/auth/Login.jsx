import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { FormInput } from "../../components/common/Forms";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../api/client";
import { roleHome } from "../../utils/permissions";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const params = new URLSearchParams(location.search);
  const verified = params.get("verified") === "1";
  const redirect = params.get("redirect");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!formData.email.trim()) nextErrors.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!formData.password) nextErrors.password = "Password is required.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setFormError("");
    try {
      const user = await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      const target =
        redirect && redirect.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : roleHome(user?.role);
      navigate(target, { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.fieldErrors());
        setFormError(error.message || "Sign in failed. Please try again.");
      } else {
        setFormError("Unable to reach the server. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-charcoal dark:text-white font-display">Welcome back</h1>
        <p className="text-sm text-muted dark:text-gray-400 mt-2">
          Sign in to manage your projects and account.
        </p>
      </div>

      {verified && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-300">
          <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
          <span>Your email address is verified. You can sign in now.</span>
        </div>
      )}

      {formError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-300"
        >
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="relative">
          <FormInput
            label="Email address"
            type="email"
            name="email"
            id="login-email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@company.com"
            autoComplete="email"
            required
            className="pl-10"
          />
          <Mail className="absolute left-3 top-[42px] h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="login-password" className="block text-sm font-medium text-primary-text dark:text-white">
              Password <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="text-xs text-forest-dark dark:text-forest-light hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              placeholder="Your password"
              required
              aria-invalid={Boolean(errors.password)}
              className={`w-full pl-10 pr-11 py-3 rounded-xl border ${
                errors.password ? "border-red-500 ring-red-500/20" : "border-border"
              } bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-forest/40`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-sm text-forest-dark dark:text-forest-light hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 disabled:opacity-60">
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
