/**
 * Shared utility — cn() function.
 * Merges Tailwind classes safely, resolving conflicts.
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
