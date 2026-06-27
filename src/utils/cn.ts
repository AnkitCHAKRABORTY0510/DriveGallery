import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge tailwind classes
 * Combines clsx and tailwind-merge to gracefully handle conditional classes and style overrides
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
