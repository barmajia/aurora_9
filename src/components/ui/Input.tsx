import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, ...props }, ref) => (
    <div className="space-y-2">
      {label ? (
        <label className="block text-sm font-medium text-zinc-700">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        className={`w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 ${className}`}
        {...props}
      />
    </div>
  ),
);

Input.displayName = "Input";
