import React from "react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600/50 shadow-sm hover:shadow-blue-600/25",
    secondary:
      "bg-white text-primary-text border border-border hover:bg-gray-50 dark:bg-dark-secondary dark:text-white dark:border-gray-600 dark:hover:bg-gray-800 focus:ring-gray-300 dark:focus:ring-gray-600",
    ghost:
      "bg-transparent text-primary-text hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-300 dark:focus:ring-gray-600",
    outline:
      "border border-border text-primary-text hover:bg-blue-50 hover:border-blue-600 focus:ring-blue-600/50",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600/50 shadow-sm hover:shadow-red-600/25",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-base",
  };

  const icon = loading ? (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  ) : null;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? <span className="flex items-center">{icon}{children}</span> : children}
    </button>
  );
}

export function IconButton({
  icon: Icon,
  label,
  variant = "ghost",
  size = "md",
  onClick,
  className = "",
  ...props
}) {
  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={`${sizeMap[size]} p-0 ${className}`}
      aria-label={label}
      {...props}
    >
      <Icon className="h-5 w-5" />
      {label && <span className="sr-only">{label}</span>}
    </Button>
  );
}

export function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600",
    success:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-500",
    warning:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500",
    error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-500",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-500",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-500",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
  padding = "p-6",
  hover = false,
  ...props
}) {
  return (
    <div
      className={`bg-white dark:bg-dark-secondary rounded-3xl border border-border shadow-sm ${hover ? "hover:shadow-xl transition-all duration-300 group" : ""} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Button;
