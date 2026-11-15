import React from "react";
import { Button } from "./Button";

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  ...props
}) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-champagne/30 bg-deep-coffee/80 text-light-text placeholder-warm-grey/60 text-xs font-medium focus:outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/20 transition-all ${className}`}
        {...props}
      />
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-grey"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  );
}

export function FormInput({
  label,
  type = "text",
  id,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  className = "",
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold uppercase tracking-wider text-warm-grey mb-1.5"
        >
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 rounded-xl border ${
          error ? "border-red-500 ring-2 ring-red-500/20" : "border-champagne/30"
        } bg-deep-coffee/70 text-light-text placeholder-warm-grey/50 text-sm focus:outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/20 transition-all ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-400 font-medium">{error}</p>
      )}
    </div>
  );
}

export function Select({
  label,
  id,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder = "Select an option",
  className = "",
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold uppercase tracking-wider text-warm-grey mb-1.5"
        >
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 rounded-xl border ${
          error ? "border-red-500 ring-2 ring-red-500/20" : "border-champagne/30"
        } bg-deep-coffee text-light-text text-sm focus:outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/20 transition-all ${className}`}
        {...props}
      >
        <option value="" disabled className="bg-espresso text-warm-grey">
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value || option}
            value={option.value || option}
            className="bg-espresso text-light-text"
          >
            {option.label || option}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-red-400 font-medium">{error}</p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  id,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  rows = 4,
  className = "",
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold uppercase tracking-wider text-warm-grey mb-1.5"
        >
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`w-full px-4 py-3 rounded-xl border ${
          error ? "border-red-500 ring-2 ring-red-500/20" : "border-champagne/30"
        } bg-deep-coffee/70 text-light-text placeholder-warm-grey/50 text-sm focus:outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/20 transition-all ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-400 font-medium">{error}</p>
      )}
    </div>
  );
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <Button
        variant="secondary-dark"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span className="text-xs font-semibold text-warm-grey">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="secondary-dark"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}

export default { SearchInput, FormInput, Select, Textarea, Pagination };
