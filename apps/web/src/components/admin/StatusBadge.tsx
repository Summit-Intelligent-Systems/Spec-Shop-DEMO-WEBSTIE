'use client';

import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

const statusStyles: Record<string, string> = {
  // Orders
  PENDING: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  CONFIRMED: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  PROCESSING: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  SHIPPED: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  OUT_FOR_DELIVERY: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  DELIVERED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  CANCELLED: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  RETURN_REQUESTED: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  RETURNED: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  REFUNDED: 'bg-pink-500/15 text-pink-300 border-pink-500/30',

  // Products
  DRAFT: 'bg-gray-500/15 text-gray-300 border-gray-500/30',
  ACTIVE: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  ARCHIVED: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  OUT_OF_STOCK: 'bg-rose-500/15 text-rose-300 border-rose-500/30',

  // Payment
  INITIATED: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  SUCCESS: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  FAILED: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  PARTIALLY_REFUNDED: 'bg-orange-500/15 text-orange-300 border-orange-500/30',

  // Reviews
  APPROVED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  REJECTED: 'bg-rose-500/15 text-rose-300 border-rose-500/30',

  // Promotions
  SCHEDULED: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  EXPIRED: 'bg-slate-500/15 text-slate-300 border-slate-500/30',

  // Boolean-like
  PUBLISHED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  UNPUBLISHED: 'bg-gray-500/15 text-gray-300 border-gray-500/30',
  ENABLED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  DISABLED: 'bg-gray-500/15 text-gray-300 border-gray-500/30',

  // Defaults
  LOW: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  MEDIUM: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  HIGH: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
};

const formatStatus = (status: string): string => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

export function StatusBadge({ status, size = 'sm', className = '' }: StatusBadgeProps) {
  const style = statusStyles[status] || 'bg-obsidian-700/50 text-obsidian-400 border-obsidian-600/30';
  const sizeClass = size === 'sm'
    ? 'px-2 py-0.5 text-[10px]'
    : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold tracking-wider uppercase border ${style} ${sizeClass} ${className}`}
    >
      {formatStatus(status)}
    </span>
  );
}
