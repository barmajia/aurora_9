import { forwardRef, type HTMLAttributes } from "react";

export type MagneticProps = HTMLAttributes<HTMLDivElement> & {
  strength?: number;
};

export const Magnetic = forwardRef<HTMLDivElement, MagneticProps>(
  ({ className = "", children, strength = 0, ...props }, ref) => (
    <div
      ref={ref}
      className={`transform transition duration-300 hover:-translate-y-1 ${className}`}
      {...props}
    >
      {children}
    </div>
  ),
);

Magnetic.displayName = "Magnetic";
