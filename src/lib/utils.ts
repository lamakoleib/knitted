import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to conditionally join class names using `clsx`,
 * then merge them with Tailwind's conflict resolution via `twMerge`.
 *
 * @param inputs - List of class values (strings, arrays, conditionals)
 * @returns A merged class name string with Tailwind overrides applied
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
