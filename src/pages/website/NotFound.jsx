import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark">
      <div className="text-center">
        <div className="text-9xl font-bold text-blue-600 dark:text-electric-blue mb-4">404</div>
        <h2 className="text-h2 text-primary-text dark:text-white mb-4">Page Not Found</h2>
        <p className="text-secondary-text dark:text-gray-400 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist. Please check the URL or return to the homepage.
        </p>
        <a
          href="/"
          className="btn-primary"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
}
