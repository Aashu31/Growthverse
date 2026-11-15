import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuMail, LuLock, LuUser, LuEye, LuEyeOff } from "lucide-react";
import { validateAuthForm } from "../../utils/validators";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateAuthForm(formData, "signup");
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        // Frontend-only demo signup - NOT secure
        const demoUser = { name: formData.fullName, email: formData.email };
        localStorage.setItem("growthverse-demo-user", JSON.stringify(demoUser));
        navigate("/dashboard");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark px-4">
      <div className="max-w-md w-full bg-white dark:bg-dark-secondary rounded-3xl border border-border dark:border-gray-700 shadow-2xl p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/25">
            <span className="text-white font-bold text-2xl">GV</span>
          </div>
          <h2 className="text-h3 text-primary-text dark:text-white">Create Account</h2>
          <p className="text-secondary-text dark:text-gray-300 text-sm mt-2">
            Join GrowthVerse and start managing your business
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-text dark:text-white block">
              Full Name
            </label>
            <div className="relative">
              <LuUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.fullName ? "border-red-500" : "border-border"} bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 ${errors.fullName ? "ring-red-500/20" : ""}`}
                placeholder="John Doe"
              />
            </div>
            {errors.fullName && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-text dark:text-white block">
              Email Address
            </label>
            <div className="relative">
              <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.email ? "border-red-500" : "border-border"} bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 ${errors.email ? "ring-red-500/20" : ""}`}
                placeholder="you@company.com"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-text dark:text-white block">
              Password
            </label>
            <div className="relative">
              <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-3 rounded-xl border ${errors.password ? "border-red-500" : "border-border"} bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 ${errors.password ? "ring-red-500/20" : ""}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-text dark:text-white block">
              Confirm Password
            </label>
            <div className="relative">
              <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-3 rounded-xl border ${errors.confirmPassword ? "border-red-500" : "border-border"} bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 ${errors.confirmPassword ? "ring-red-500/20" : ""}`}
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-4"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border dark:border-gray-700">
          <p className="text-sm text-secondary-text dark:text-gray-400 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 dark:text-electric-blue font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
