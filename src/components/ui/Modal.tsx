"use client";

import { forwardRef } from "react";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ className = "", children, isOpen = true, onClose, ...props }, ref) => {
    if (!isOpen) {
      return null;
    }

    return (
      <div
        ref={ref}
        onClick={
          onClose
            ? (e: React.MouseEvent<HTMLDivElement>) => {
                if (e.target === e.currentTarget) onClose();
              }
            : undefined
        }
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
        {...props}
      >
        <div
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          className="w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl"
        >
          {children}
        </div>
      </div>
    );
  },
);

Modal.displayName = "Modal";
