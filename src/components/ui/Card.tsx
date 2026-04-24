"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
  variant?:
    | "default"
    | "elevated"
    | "outline"
    | "gradient"
    | "gloss"
    | "simple";
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      hover = true,
      glass = true,
      variant = "default",
      size = "md",
      interactive = false,
      children,
      ...props
    },
    ref,
  ) => {
    const variantStyles = {
      default: "aurora-card",
      elevated:
        "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-lg hover:shadow-2xl",
      outline:
        "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl",
      gradient:
        "bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-lg",
      gloss:
        "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border border-white/20 dark:border-zinc-700/20 rounded-2xl shadow-xl",
      simple:
        "bg-white dark:bg-slate-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-200",
    };

    const sizeStyles = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "transition-all duration-300 ease-out",
          variantStyles[variant],
          sizeStyles[size],
          hover && "hover:-translate-y-1 hover:shadow-xl",
          interactive && "cursor-pointer active:scale-95",
          !hover && "hover:transform-none hover:shadow-none",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("mb-6", className)} {...props}>
    {children}
  </div>
));

const CardTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold text-foreground dark:text-white",
      className,
    )}
    {...props}
  >
    {children}
  </h3>
));

const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-4", className)} {...props}>
    {children}
  </div>
));

const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-zinc-500 dark:text-zinc-400", className)}
    {...props}
  >
    {children}
  </p>
));

const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardContent.displayName = "CardContent";
CardDescription.displayName = "CardDescription";
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
