import React from "react";

export function Loader({
  className = "",
  size = "md",
  text,
  ...props
}) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${className}`}
      role="status"
      aria-label={text || "Loading"}
      {...props}
    >
      <div
        className={`animate-spin rounded-full border-2 border-current ${sizes[size]} ${text ? "text-blue-600" : "text-current"}`}
      />
      {text && <span className="text-sm text-secondary-text dark:text-gray-300">{text}</span>}
    </div>
  );
}

export function Skeleton({
  className = "",
  shape = "rect",
  height = "1rem",
  width = "100%",
  ...props
}) {
  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-xl";
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${shapeClass} h-${height.replace(/[^\d]/g, "")} w-${width} ${className}`}
      {...props}
    />
  );
}

export function EmptyState({
  title = "No Data Available",
  description = "There are no items to display.",
  icon,
  action,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-20 text-center ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
        {icon || (
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-semibold text-primary-text dark:text-white mb-2">{title}</h3>
      <p className="text-secondary-text dark:text-gray-300 mb-8 max-w-sm mx-auto">{description}</p>
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export default Loader;
