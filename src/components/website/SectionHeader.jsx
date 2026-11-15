import React from "react";

export function SectionHeader({ title, description, className = "" }) {
  return (
    <div className={`text-center mb-12 lg:mb-16 ${className}`}>
      <h2 className="text-h2 mb-4">{title}</h2>
      <p className="text-lg text-secondary-text max-w-2xl mx-auto">{description}</p>
    </div>
  );
}

export default SectionHeader;
