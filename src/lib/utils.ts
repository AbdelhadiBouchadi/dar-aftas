import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with correct conflict resolution.
 * This is the exact `cn` contract that shadcn/ui and 21st.dev registry
 * components import from `@/lib/utils` — do not rename or change the shape.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Zero-pad a number to a fixed width, for almanac/tide typography. */
export function pad(value: number, width = 2): string {
  return String(value).padStart(width, "0");
}
