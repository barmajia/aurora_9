"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, leftIcon, showPasswordToggle, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    
    return (
      <div className="space-y-2">
        {label ? (
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {label}
          </label>
        ) : null}
        <div className="relative">
          <input
            ref={ref}
            type={isPassword && showPasswordToggle ? (showPassword ? "text" : "password") : type}
            className={`w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-primary focus:ring-2 focus:ring-primary/15 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder:text-white/30 dark:focus:border-primary dark:focus:ring-primary/20 ${
              error ? "border-red-500" : ""
            } ${className} ${leftIcon ? "pl-10" : ""} ${isPassword && showPasswordToggle ? "pr-10" : ""}`}
            {...props}
          />
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-white/40">
              {leftIcon}
            </div>
          )}
          {isPassword && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 transition-colors dark:text-white/40 dark:hover:text-white/70"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
