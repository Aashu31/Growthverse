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
  asChild = false,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-sans font-semibold rounded-xl transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 gap-2";

  const variants = {
    primary:
      "bg-gradient-to-r from-champagne to-caramel text-espresso hover:from-light-gold hover:to-champagne focus-visible:ring-champagne/50 shadow-md shadow-champagne/20 hover:shadow-lg hover:shadow-champagne/30 hover:-translate-y-0.5",
    secondary:
      "bg-transparent text-dark-text border-[1.5px] border-gv-border hover:border-champagne hover:text-caramel hover:bg-champagne/5 focus-visible:ring-champagne/50",
    ghost:
      "bg-transparent text-dark-text hover:bg-champagne/8 focus-visible:ring-champagne/30",
    outline:
      "border-[1.5px] border-gv-border text-dark-text hover:bg-champagne/5 hover:border-champagne focus-visible:ring-champagne/50",
    danger:
      "bg-status-error text-white hover:bg-red-700 focus-visible:ring-red-600/50 shadow-sm hover:shadow-red-600/25",
    "primary-dark":
      "bg-gradient-to-r from-champagne to-caramel text-espresso hover:from-light-gold hover:to-champagne focus-visible:ring-champagne/50 shadow-md shadow-champagne/20",
    "ghost-dark":
      "bg-transparent text-light-text hover:bg-white/10 focus-visible:ring-white/30",
    "secondary-dark":
      "bg-transparent text-light-text border-[1.5px] border-champagne/20 hover:border-champagne/50 hover:bg-champagne/10 focus-visible:ring-champagne/30",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-[0.95rem]",
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

  // If asChild is true, render children directly with class merge
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className} ${children.props.className || ""}`.trim(),
      ...props,
    });
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
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
    default: "bg-sand-beige/50 text-dark-mocha border-gv-border",
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    error: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    gold: "bg-champagne/10 text-caramel border-champagne/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-sans border ${variants[variant]} ${className}`}
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
  dark = false,
  ...props
}) {
  return (
    <div
      className={`${dark ? "card-dark" : "card-premium"} ${hover ? "hover:shadow-card-warm-lg" : ""} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Button;
