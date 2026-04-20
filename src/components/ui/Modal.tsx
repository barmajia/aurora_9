import { forwardRef } from "react";

export const Modal = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
    {...props}
  >
    <div className="w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
      {children}
    </div>
  </div>
));

Modal.displayName = "Modal";
