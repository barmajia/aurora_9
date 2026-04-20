"use client";

import { forwardRef } from "react";

export const LanguageSwitcher = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white/90 px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-100 ${className}`}
    {...props}
  >
    {children || "EN"}
  </div>
));

LanguageSwitcher.displayName = "LanguageSwitcher";
