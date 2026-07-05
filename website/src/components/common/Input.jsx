"use client";

import { forwardRef } from "react";

export const Input = forwardRef(({ label, error, helperText, className = "", ...props }, ref) => {
  return (
    <div className={`w-full flex flex-col ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
          ${error 
            ? "border-error-500 focus:ring-error-500 bg-error-50 dark:bg-error-900/20" 
            : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 bg-white dark:bg-gray-800"
          }
        `}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-sm text-error-600">{error.message}</p>
      ) : helperText ? (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = "Input";
