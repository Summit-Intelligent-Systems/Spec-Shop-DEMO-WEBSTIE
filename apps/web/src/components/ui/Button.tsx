'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// ─── Button Variants ──────────────────────────────────────────────────────────

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 font-sans font-medium tracking-wide transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none relative overflow-hidden',
  {
    variants: {
      variant: {
        primary:
          'bg-obsidian-900 text-white hover:bg-obsidian-700 active:scale-[0.98]',
        secondary:
          'bg-transparent text-obsidian-900 border border-obsidian-900 hover:bg-obsidian-900 hover:text-white active:scale-[0.98]',
        gold: 'bg-gold text-obsidian-900 hover:bg-gold-500 shadow-gold hover:shadow-gold-lg active:scale-[0.98]',
        ghost:
          'text-obsidian-600 hover:text-obsidian-900 hover:bg-obsidian-50 active:scale-[0.98]',
        destructive:
          'bg-error-500 text-white hover:bg-error-700 active:scale-[0.98]',
        outline:
          'border border-obsidian-200 text-obsidian-700 hover:border-obsidian-900 hover:text-obsidian-900 active:scale-[0.98]',
        link: 'text-obsidian-900 underline-offset-4 hover:underline p-0 h-auto font-normal',
        cream:
          'bg-cream text-obsidian-900 hover:bg-cream-200 active:scale-[0.98]',
      },
      size: {
        xs: 'text-xs px-3 py-1.5 rounded',
        sm: 'text-sm px-4 py-2 rounded-md',
        md: 'text-sm px-6 py-3 rounded-md',
        lg: 'text-base px-8 py-4 rounded-lg',
        xl: 'text-lg px-10 py-5 rounded-lg',
        icon: 'p-2.5 rounded-md',
        'icon-sm': 'p-2 rounded',
        'icon-lg': 'p-3.5 rounded-lg',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Shimmer effect on hover */}
        <span
          className="absolute inset-0 bg-shimmer opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          aria-hidden="true"
        />

        {isLoading ? (
          <>
            <Spinner size="sm" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

// ─── Motion Button ────────────────────────────────────────────────────────────

export const MotionButton = motion(Button);

// ─── Spinner (used in Button loading state) ───────────────────────────────────

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const spinnerSizes = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
};

export const Spinner = ({ size = 'md', className }: SpinnerProps) => {
  return (
    <span
      className={cn(
        'inline-block rounded-full border-current border-t-transparent animate-spin',
        spinnerSizes[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
};
