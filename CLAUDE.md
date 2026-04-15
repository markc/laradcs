# CLAUDE.md — laradcs

## Project overview

laradcs is an MIT-licensed Laravel + Inertia + React starter kit that will
feature the DCS (Dual Carousel Sidebar) layout pattern. Consumers install
it via `laravel new my-app --using=markc/laradcs` (or
`composer create-project markc/laradcs`) and own every file from day one —
there is no runtime dependency on laradcs itself.

## Current status

**Phase 1 — scaffolding.** The repository is a clean fork of
`laravel/react-starter-kit` with laradcs identity, MIT license, and an
extended README. The DCS layout components have **not yet** been extracted
from `~/.gh/wg-admin`; that's Phase 2. Until then, the kit is functionally
equivalent to the official React starter kit.

## Stack

- Laravel 12 (PHP 8.2+) — upstream will bump to 13 when the React starter
  kit does; track upstream rather than forking ahead
- Inertia 2 (React adapter)
- React 19 + TypeScript
- Tailwind CSS 4 with OKLCH tokens (once Phase 2 lands)
- shadcn/ui primitives + Lucide icons
- Vite build, Bun or npm package manager
- Pest 3 for backend tests, Playwright planned for DCS interaction tests

## DCS layout conventions (Phase 2 onward)

The DCS layout has three zones plus a top bar:

- **Top bar:** brand, search, sidebar toggles, user menu, theme toggle
- **Left sidebar:** one or more panels accessed via a carousel switcher
- **Right sidebar:** one or more panels accessed via a carousel switcher
- **Content area:** Inertia page content

Panels are React components registered with the sidebar via a DCS
configuration file in `resources/js/lib/dcs-config.ts`.

## Where to add things

- **New page:** `resources/js/pages/` + route in `routes/web.php`
- **New sidebar panel:** `resources/js/components/examples/` + register in
  `dcs-config.ts`
- **New theme variant:** `resources/css/dcs/tokens.css` + `useTheme` hook
- **New UI primitive:** `resources/js/components/ui/` (shadcn conventions)
- **Backend models/controllers:** standard Laravel locations

## File naming

- React components: `PascalCase.tsx`
- Hooks: `useXxx.ts`
- Types: camelCase in `resources/js/types/`
- PHP classes: `PascalCase.php`

## What NOT to do

- Do **not** replace the DCS layout with a different pattern. If a specific
  page needs a different layout, wrap it in a page-level layout that sits
  inside `AppLayout`.
- Do **not** use HSL or RGB in CSS. Use OKLCH tokens from
  `resources/css/dcs/tokens.css` (once present).
- Do **not** add a UI component library other than shadcn/ui primitives.
- Do **not** use Vue, Svelte, or plain JS. React + TypeScript only.
- Do **not** install heavy state libraries (Redux, Zustand) unless genuinely
  needed — Inertia shared data + React hooks handle most cases.
- Do **not** re-introduce runtime coupling to an upstream laradcs package.
  This kit is copy-paste by design.

## Testing

- Feature tests in `tests/Feature/` via Pest
- Browser tests (once added) in `tests/Browser/` via Playwright
- Run: `php artisan test` (backend), `bun test` (frontend)

## Style

- Prettier + ESLint for TS/TSX
- Laravel Pint for PHP
- Pre-commit hooks will run both once Phase 6 lands

## Relationship to other projects

- **`~/.gh/wg-admin`** — canonical reference implementation of DCS. New DCS
  features are battle-tested there first, then extracted here.
- **`~/.gh/laradcs-plan.md`** — the full build plan for this repository.
  Review it before making structural changes.
