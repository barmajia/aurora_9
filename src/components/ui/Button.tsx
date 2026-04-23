'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, children, disabled, type = 'button', onClick }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative';

    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-lg',
      secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-200 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10 dark:border-white/10',
      ghost: 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10',
      outline: 'border border-zinc-200 text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/10 dark:text-white dark:hover:border-white/20 dark:hover:bg-white/10',
      danger: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/15 dark:border-rose-500/20',
    };

    const sizes = { 
      sm: 'px-5 py-2 text-xs', 
      md: 'px-8 py-3 text-sm', 
      lg: 'px-10 py-4 text-base' 
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        onClick={onClick}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
