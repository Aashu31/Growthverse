import React from "react";
import { LuPlus } from "lucide-react";
import { Button } from "./Button";

export function Toast({ id, type = "info", message, duration = 4000, onDismiss }) {
  const typeConfig = {
    success: { bg: "bg-green-500", text: "text-white", icon: "CheckCircle" },
    error: { bg: "bg-red-500", text: "text-white", icon: "AlertCircle" },
    warning: { bg: "bg-yellow-500", text: "text-white", icon: "AlertTriangle" },
    info: { bg: "bg-blue-600", text: "text-white", icon: "Info" },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 ${config.bg} ${config.text} px-6 py-4 rounded-xl shadow-xl flex items-start gap-3 animate-slide-up transform transition-all duration-300`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-shrink-0 mt-0.5">
        {config.icon === "CheckCircle" && (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
        {config.icon === "AlertCircle" && (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.908-1.742 2.908H4.42c-1.53 0-2.493-1.574-1.743-2.908l5.58-9.92zM11 13a1 1 0 11-2 0v-2a1 1 0 012 0v2zm-1.886-8.814c1.632-2.903 6.173-2.903 7.805 0l3.102 5.525c.292.52.589 1.052.886 1.581-.341.595-.676 1.168-.997 1.7l-3.3 5.595a1.317 1.317 0 01-1.92 0l-3.3-5.595a1.317 1.317 0 01-.997-1.7c.298-.529.594-1.062.887-1.581z" clipRule="evenodd" />
          </svg>
        )}
        {config.icon === "AlertTriangle" && (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.908-1.742 2.908H4.42c-1.53 0-2.493-1.574-1.743-2.908l5.58-9.92zM11 13a1 1 0 11-2 0v-2a1 1 0 012 0v2zm-1.886-8.814c1.632-2.903 6.173-2.903 7.805 0l3.102 5.525c.292.52.589 1.052.886 1.581-.341.595-.676 1.168-.997 1.7l-3.3 5.595a1.317 1.317 0 01-1.92 0l-3.3-5.595a1.317 1.317 0 01-.997-1.7c.298-.529.594-1.062.887-1.581z" clipRule="evenodd" />
          </svg>
        )}
        {config.icon === "Info" && (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <div>
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="ml-auto flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity p-1"
        aria-label="Dismiss"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default Toast;
