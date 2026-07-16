# AGENTS.md — Traka Frontend Conventions

## Package Management

- **All installs must use `bun`** — never `npm`, `yarn`, or `pnpm`.
- **Never remove or add any package** without explicit permission from the team first.
- **No `lucide-react`** — we use `@phosphor-icons/react` exclusively as our icon library.

## TypeScript

- **Strict mode is always on.** Do not add `@ts-ignore` or `@ts-expect-error` unless the reasoning is documented inline.
- Prefer `interface` for object shapes; use `type` for unions/intersections and utility types.
- Do not use `any`. If unsure, type the value explicitly or use `unknown` + narrowing.
- All component props must be explicitly typed (no bare `{}` or implicit `any`).

## Styling

- **Tailwind CSS v4** — configuration lives in `src/index.css` via `@theme`. There is no `tailwind.config.js`.
- Use the `cn()` utility from `@/lib/utils` to compose class names.
- Prefer Tailwind utility classes over inline styles or CSS modules.

## Component Conventions

- Components live in `src/components/`.
- shadcn/ui components are in `src/components/ui/`.
- Use named exports, not default exports.

## PWA

- Icons (`pwa-192x192.png`, `pwa-512x512.png`) must be added to `public/` before production builds.
- Service worker auto-updates — no manual refresh UI needed.

## Testing

- Run `bun run build` before pushing to verify TypeScript compiles and Vite builds cleanly.
