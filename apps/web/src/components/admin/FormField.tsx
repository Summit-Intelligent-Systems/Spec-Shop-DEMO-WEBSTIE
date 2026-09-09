'use client';

import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  description,
  error,
  required,
  className = '',
  children,
}: FormFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider"
      >
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
      {description && !error && (
        <p className="text-[11px] text-obsidian-600">{description}</p>
      )}
      {error && (
        <p className="text-[11px] text-rose-400 font-medium">{error}</p>
      )}
    </div>
  );
}

// ─── Styled Input ─────────────────────────────────────────────────────────────

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function AdminInput({ error, className = '', ...props }: AdminInputProps) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2.5 bg-obsidian-800/60 border rounded-xl text-sm text-white placeholder-obsidian-500 focus:outline-none transition-colors ${
        error
          ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
          : 'border-obsidian-700/50 focus:border-gold/50 focus:ring-1 focus:ring-gold/20'
      } ${className}`}
    />
  );
}

// ─── Styled Select ────────────────────────────────────────────────────────────

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function AdminSelect({ error, className = '', children, ...props }: AdminSelectProps) {
  return (
    <select
      {...props}
      className={`w-full px-3.5 py-2.5 bg-obsidian-800/60 border rounded-xl text-sm text-white focus:outline-none transition-colors appearance-none ${
        error
          ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
          : 'border-obsidian-700/50 focus:border-gold/50 focus:ring-1 focus:ring-gold/20'
      } ${className}`}
    >
      {children}
    </select>
  );
}

// ─── Styled Textarea ──────────────────────────────────────────────────────────

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function AdminTextarea({ error, className = '', ...props }: AdminTextareaProps) {
  return (
    <textarea
      {...props}
      className={`w-full px-3.5 py-2.5 bg-obsidian-800/60 border rounded-xl text-sm text-white placeholder-obsidian-500 focus:outline-none transition-colors resize-none ${
        error
          ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
          : 'border-obsidian-700/50 focus:border-gold/50 focus:ring-1 focus:ring-gold/20'
      } ${className}`}
    />
  );
}

export default FormField;
