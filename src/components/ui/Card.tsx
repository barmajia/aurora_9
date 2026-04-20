"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, glass = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "p-6 transition-all duration-500",
          glass ? "aurora-card" : "bg-card-bg rounded-[2.5rem]",
          !hover && "hover:transform-none hover:shadow-none translate-y-0",
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
  <div ref={ref} className={cn("mb-4", className)} {...props}>
    {children}
  </div>
));

const CardTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-bold text-zinc-900", className)}
    {...props}
  >
    {children}
  </h3>
));

const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props}>
    {children}
  </div>
));

const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-zinc-500", className)} {...props}>
    {children}
  </p>
));

const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-4 pt-4 border-t border-zinc-100", className)}
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
