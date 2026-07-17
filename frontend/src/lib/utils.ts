import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Color-agnostic tactile 3D primary button.
 * Inherits the active theme's `--primary` via `bg-primary`; the bottom
 * border + inset highlight create physical depth without hardcoding shades.
 */
export const primaryCta =
  "bg-primary text-white font-semibold tracking-wide rounded-full px-8 py-3.5 shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.25)] border-b-[3px] border-black/35 flex items-center justify-center gap-2 hover:brightness-105 transition-all active:translate-y-[1px] active:border-b-[1.5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
