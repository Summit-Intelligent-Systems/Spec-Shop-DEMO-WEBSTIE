'use client';

import { forwardRef, useState } from 'react';
import { Eye, EyeOff, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      fullWidth = true,
      disabled,
      id,
      value,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const isPasswordType = type === 'password';
    const computedType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'inline-flex')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium uppercase tracking-wider text-obsidian-700 select-none"
          >
            {label}
            {props.required && <span className="ml-1 text-error-500">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-obsidian-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={computedType}
            value={value}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={cn(
              'w-full h-11 px-4 py-2 text-sm bg-white text-obsidian-900 border rounded-md transition-all duration-200 placeholder:text-obsidian-400',
              'focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-obsidian-900',
              'disabled:bg-obsidian-50 disabled:text-obsidian-400 disabled:cursor-not-allowed',
              error
                ? 'border-error-500 focus:ring-error-500/20 focus:border-error-500'
                : 'border-obsidian-200 hover:border-obsidian-300',
              leftIcon && 'pl-10',
              (rightIcon || isPasswordType || clearable) && 'pr-11',
              className,
            )}
            {...props}
          />

          <div className="absolute right-3 flex items-center gap-1.5 text-obsidian-400">
            {clearable && value && !disabled && (
              <button
                type="button"
                onClick={onClear}
                tabIndex={-1}
                className="hover:text-obsidian-700 transition-colors p-0.5 rounded focus:outline-none"
                aria-label="Clear input"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}

            {isPasswordType && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="hover:text-obsidian-700 transition-colors p-0.5 rounded focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}

            {!isPasswordType && rightIcon && (
              <span className="pointer-events-none">{rightIcon}</span>
            )}
          </div>
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-error-600 font-medium">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-obsidian-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
