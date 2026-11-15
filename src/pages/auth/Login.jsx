import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
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
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-light-text">
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm text-warm-grey mt-2">
          Sign in to access your GrowthVerse account & project portal.
        </p>
      </div>

      {verified && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-900/20 p-4 text-xs text-green-300">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-green-400" />
          <span>Your email address is verified. You can sign in now.</span>
        </div>
      )}

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
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs font-bold uppercase tracking-wider text-warm-grey mb-1.5"
          >
            Email Address <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey/60 pointer-events-none" />
            <input
              id="login-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              autoComplete="email"
              required
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                errors.email ? "border-red-500 ring-2 ring-red-500/20" : "border-champagne/30"
              } bg-espresso text-light-text text-sm focus:outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/20 transition-all`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-400 font-medium">{errors.email}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="login-password"
              className="block text-xs font-bold uppercase tracking-wider text-warm-grey"
            >
              Password <span className="text-red-400">*</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-champagne hover:text-light-gold font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey/60 pointer-events-none" />
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              placeholder="Your password"
              required
              className={`w-full pl-10 pr-11 py-3 rounded-xl border ${
                errors.password ? "border-red-500 ring-2 ring-red-500/20" : "border-champagne/30"
              } bg-espresso text-light-text text-sm focus:outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/20 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warm-grey hover:text-light-text transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-400 font-medium">{errors.password}</p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-champagne via-caramel to-champagne bg-[length:200%_auto] hover:bg-[position:right_center] text-espresso font-bold text-sm shadow-md hover:shadow-glow-gold hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign In to GrowthVerse ↗"}
          </button>
        </div>
      </form>
    </div>
  );
}
