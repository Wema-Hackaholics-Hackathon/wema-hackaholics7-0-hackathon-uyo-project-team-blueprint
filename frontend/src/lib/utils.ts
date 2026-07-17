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
  "bg-primary text-white font-semibold tracking-wide rounded-xl px-8 py-3.5 shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.25)] border-b-[3px] border-black/35 flex items-center justify-center gap-2 hover:brightness-105 transition-all active:translate-y-[1px] active:border-b-[1.5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"

interface ApiErrorBody {
  detail?: unknown;
  message?: string;
}

function extractApiBody(err: unknown): ApiErrorBody | null {
  if (!err || typeof err !== "object" || !("response" in err)) return null;
  const response = (err as { response?: unknown }).response;
  if (!response || typeof response !== "object" || !("data" in response)) return null;
  const data = (response as { data?: unknown }).data;
  if (!data || typeof data !== "object") return null;
  return data as ApiErrorBody;
}

/**
 * Pulls the real message the backend returned (FastAPI `detail` or `message`)
 * instead of axios' generic "Request failed with status code NNN".
 */
export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  const body = extractApiBody(err);
  if (body) {
    const detail = body.detail;
    if (typeof detail === "string" && detail.trim()) return detail;
    if (Array.isArray(detail)) {
      const messages = detail
        .map((item) => {
          if (item && typeof item === "object" && "msg" in item) {
            return String((item as { msg: unknown }).msg);
          }
          return null;
        })
        .filter((m): m is string => Boolean(m));
      if (messages.length > 0) return messages.join(" ");
    }
    if (typeof body.message === "string" && body.message.trim()) {
      return body.message;
    }
  }
  if (err instanceof Error && err.message && !err.message.includes("status code")) {
    return err.message;
  }
  return fallback;
}
