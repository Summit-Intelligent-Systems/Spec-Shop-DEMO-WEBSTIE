'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ─── Badge Variants ───────────────────────────────────────────────────────────

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-sans font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-obsidian-900 text-white',
        secondary: 'bg-obsidian-100 text-obsidian-700',
        outline: 'border border-obsidian-300 text-obsidian-700',
        gold: 'bg-gold-50 text-gold-700 border border-gold-200',
        'gold-solid': 'bg-gold text-obsidian-900',
        success: 'bg-success-50 text-success-700',
        warning: 'bg-warning-50 text-warning-700',
        error: 'bg-error-50 text-error-700',
        info: 'bg-info-50 text-info-700',
        cream: 'bg-cream text-obsidian-700',
        new: 'bg-obsidian-900 text-gold text-[10px] font-semibold tracking-widest uppercase',
        sale: 'bg-error-500 text-white',
        trending: 'bg-gold text-obsidian-900',
        bestseller: 'bg-obsidian-900 text-white',
        premium: 'bg-gradient-to-r from-gold-400 to-gold-600 text-obsidian-900',
      },
      size: {
        xs: 'text-[10px] px-2 py-0.5 rounded',
        sm: 'text-xs px-2.5 py-1 rounded-md',
        md: 'text-xs px-3 py-1.5 rounded-md',
        lg: 'text-sm px-4 py-2 rounded-lg',
      },
      pill: {
        true: '!rounded-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
      pill: true,
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, pill, icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, pill, className }))}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

// ─── Discount Badge ────────────────────────────────────────────────────────────

interface DiscountBadgeProps {
  originalPrice: number;
  salePrice: number;
  className?: string;
}

export const DiscountBadge = ({ originalPrice, salePrice, className }: DiscountBadgeProps) => {
  if (originalPrice <= salePrice) return null;
  const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  return (
    <Badge variant="sale" size="sm" pill className={className}>
      -{discount}%
    </Badge>
  );
};
