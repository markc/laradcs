# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

laradcs is an MIT-licensed Laravel + Inertia + React starter kit featuring
the **DCS (Dual Carousel Sidebar)** layout pattern. Consumers install via
`laravel new my-app --using=markc/laradcs` (or
`composer create-project markc/laradcs`) and own every file from day one —
there is no runtime dependency on laradcs itself. Reference implementation
of the DCS pattern: <https://dcs.spa>.

## Status

**Phase 3 shipped** — DCS layout, marketing dashboard (faithful port of
the dcs.spa reference), Anthropic Haiku chat panel via `laravel/ai`,
and a full bleeding-edge stack (Laravel 13.5 / Inertia 3 / Vite 8 /
Tailwind 4.2 / TypeScript 6) are all live. Polished docs land in
`docs/`, runnable recipes for common tasks live in `.claude/skills/`,
and the long-form build plan is at `docs/laradcs-plan.md`.

## Bleeding-edge tracking (dogfooding policy)

One of laradcs's explicit aims is to **aggressively track and fix against
the latest released versions** of its dependencies — Laravel, Inertia,
React, Tailwind, Vite, TypeScript, Radix, lucide-react, Pest, Pint — as
a way of dogfooding the bleeding edge of Laravel + Inertia + React
development.

When a new major of any core dep ships, we bump. If the bump breaks
something, we **fix the code**, not pin the version backwards. The
canonical upgrade loop is:

1. `npx npm-check-updates --target latest -u && bun install` (JS side)
2. Edit `composer.json` to raise any major constraints, then
   `composer update -W` and finally `composer bump` to lock the
   installed versions as the new floor
3. `php artisan test`, `npx vite build`, `npx tsc --noEmit` — fix
   whatever breaks
4. Commit as a single "upgrade X to Y" change with the breakage
   notes in the journal

This means consumers of `laravel new --using=markc/laradcs` inherit a
kit that is, at worst, a few days behind upstream rather than a few
minors. The tradeoff is accepting some churn in the starter kit itself
— that's fine because it's a starter, not a runtime dependency.

Do not pin any dep backwards to dodge a breaking change unless the
upstream itself is broken. When lucide-react v1 dropped brand icons,
the right answer was an inline `GithubIcon` component, not a pin to
0.x.

## Commands

```bash
# First-time setup (after git clone)
bun install                 # or: npm install
composer install
cp .env.example .env && php artisan key:generate
php artisan migrate

# Development — run these in two terminals
bun run dev                 # Vite HMR on port 5173
php artisan serve           # Laravel on port 8000

# Or access via the shared dev server (see ~/.gh/CLAUDE.md):
#   http://laradcs.localhost/

# Build
bun run build               # vite build
bun run build:ssr           # SSR build

# Quality gates
npx tsc --noEmit            # TypeScript typecheck (no script for it)
bun run lint                # eslint --fix
bun run format              # prettier --write resources/
vendor/bin/pint             # PHP formatter
vendor/bin/pest             # Pest test suite
vendor/bin/pest --filter=DashboardTest   # single test
```

No `test` or `typecheck` npm script exists — use the commands above
directly. `npx tsc --noEmit` is the canonical TS check.

## Architecture

### DCS shell — how a request becomes a rendered page

1. Laravel controller returns `Inertia::render('page-name', props)`.
2. `resources/js/app.tsx` boots Inertia with `AppLayout` as the default
   layout for all authenticated pages (pages that don't set their own).
3. `resources/js/layouts/app-layout.tsx` is a thin delegate that renders
   `AppDualSidebarLayout`.
4. `resources/js/layouts/app/app-dual-sidebar-layout.tsx` mounts
   `<ThemeProvider>`, registers the left/right panels, and wires the
   top nav, sidebars, toggle buttons, and scroll-reactive border.
5. `ThemeProvider` (`resources/js/contexts/theme-context.tsx`) owns all
   DCS runtime state: `theme` (light/dark), `scheme` (crimson/ocean/
   forest/sunset/stone), `carouselMode` (slide/fade), per-side sidebar
   `{open, pinned, panel}`, and `sidebarWidth`. State persists to
   `localStorage` under key `laradcs-state` and is applied to the DOM
   via class toggles (`.dark`, `.scheme-*`) and the
   `--sidebar-width` custom property.
6. Below `xl` (1280px) the media query listener auto-unpins both
   sidebars. Above xl they can be pinned, which shifts the content
   via `margin-inline-{start,end}: var(--sidebar-width)`.

### Registering a sidebar panel

Panels are plain React components. Register them in the `leftPanels` /
`rightPanels` arrays in `resources/js/layouts/app/app-dual-sidebar-layout.tsx`.
Each entry is `{ label: 'L1: Name', content: <MyPanel /> }`. The `L1:`
/ `R1:` prefix is stripped from the visible title but used for the
`aria-label` and as a React key, so keep it unique. Existing examples
live in `resources/js/components/dcs/panels/` and show the common
patterns: navigation groups, about/info, theme controls, user menu.

### Theme tokens

All colour decisions flow through OKLCH CSS variables in
`resources/css/dcs/tokens.css`:

- `--scheme-*` — accent, fg, bg, border for the active scheme
- `--glass`, `--glass-border` — glassmorphism surfaces (differ by mode)
- `--topnav-height`, `--sidebar-width` — layout metrics

`resources/css/app.css` maps shadcn primitives
(`--background`, `--foreground`, `--border`, …) to OKLCH values too.
**Never add HSL or RGB**: if you need a new colour, add an OKLCH token.

To add a new scheme: define a `.scheme-<name>` block (and its
`.dark.scheme-<name>` counterpart) in `tokens.css`, extend the
`ColorScheme` union in `theme-context.tsx`, append it to the list in
`panels/theme-panel.tsx`, and update the `applySchemeToDOM` remove-list.

## File naming

laradcs follows the upstream `laravel/react-starter-kit` kebab-case
convention for `.tsx`/`.ts` files under `resources/js/` (not PascalCase).
Match the existing code — check a neighbour before naming a new file.

## What NOT to do

- **No HSL or RGB** in CSS. OKLCH only.
- **Do not replace the DCS layout** with a different pattern. If a
  specific page needs a different shell, wrap its body in a page-level
  layout that still sits inside `AppLayout`.
- **Do not mention the private reference implementation by name** in
  repo files, commits, or docs. Use <https://dcs.spa> as the reference.
- **Do not add another UI library** — shadcn/ui primitives only.
- **No heavy state libraries** (Redux, Zustand) — Inertia shared data +
  React hooks handle everything DCS needs.
- **No runtime coupling** to an upstream laradcs package. This kit is
  copy-paste by design; everything lives in the consumer's project.

## Document conventions

### `_doc/` — design docs and architecture notes

Durable project documentation. File naming: `YYYY-MM-DD-lower-case-title.md`.

### `_journal/` — dated work logs (the history)

- Records what was done, what was found, what changed, on a given day
- Format: `_journal/YYYY-MM-DD.md`
- **Create/append during every work session** — this is the audit trail
- Captures transient details that don't belong in a long-lived doc
  (specific error messages, step-by-step debugging, one-off fixes)
- Invaluable for "what did we do last time this broke?" questions

**On startup: read the last 3 entries in `_journal/` before doing any
non-trivial work**, so you inherit the context from recent sessions.
`ls _journal/ | tail -3` is enough.
