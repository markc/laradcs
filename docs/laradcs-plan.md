# LARADCS-PLAN.md

Plan for `laradcs` — a public, MIT-licensed Laravel 13 + Inertia + React
starter kit featuring the **DCS (Dual Carousel Sidebar)** interface pattern,
distributed as an official community starter kit installable via
`laravel new my-app --using=markc/laradcs`.

Source of truth for the DCS implementation: `~/.gh/wg-admin` (the most mature
and refined port to date).

---

## 1. Project identity

- **Repository:** `github.com/markc/laradcs`
- **Composer name:** `markc/laradcs`
- **Package manager:** Packagist (so `composer create-project` works too)
- **License:** MIT
- **Tagline:** *"The dual carousel sidebar starter kit for Laravel 13 +
  Inertia + React."*
- **Install command:** `laravel new my-app --using=markc/laradcs`
- **Alternative install:** `composer create-project markc/laradcs my-app`

---

## 2. Strategic positioning

### 2.1 What laradcs is

A **cloneable starter repository** that follows Laravel's new starter kit
model (introduced in Laravel 12, now standard in 13). When a developer runs
`laravel new my-app --using=markc/laradcs`, the entire repository is cloned
into their new project and they own every file from day one. There is no
runtime composer dependency on laradcs itself — the code lives in the
consumer's project, fully customisable.

### 2.2 What laradcs is not

- Not a runtime library or framework.
- Not a component package imported via npm.
- Not a Blade template or Livewire kit.
- Not tied to any specific domain (hosting, CMS, admin panel, etc.).
- Not a competitor to Filament or Nova — those are admin panels; laradcs
  is an application shell.

### 2.3 Why this fills a gap

The official Laravel React starter kit (`laravel/react-starter-kit`) uses
shadcn/ui with a standard collapsible sidebar and header layout — clean but
generic. The DCS pattern offers:

- **Dual sidebars** (LHS + RHS) each with multiple "carousel" panels that
  slide horizontally, giving apps much richer navigation and context
  affordances than a single sidebar.
- **OKLCH-based theming** with glassmorphism card aesthetics, a distinct
  visual identity out of the box.
- **Battle-tested patterns** refined across 3–4 iterations in real projects
  (markweb, wg-admin, and others).

There is currently no community starter kit occupying this niche in the
Laravel ecosystem. That's the opportunity.

---

## 3. Stack

Matches the official Laravel React starter kit so upgrades track upstream:

- **Laravel 13** (PHP 8.3+)
- **Inertia.js 2** (React adapter)
- **React 19** + **TypeScript**
- **Tailwind CSS 4** (OKLCH-native)
- **Vite** for bundling
- **Pest** for testing
- **Laravel Fortify** for auth (standard for starter kits)
- **Wayfinder** for type-safe routing
- **shadcn/ui** as the component primitives layer (buttons, dialogs,
  dropdowns, etc. — DCS layout sits *above* these, not instead of them)
- **Lucide React** for icons
- **Dark mode** by default, with system/light/dark toggle

---

## 4. What gets extracted from wg-admin

### 4.1 Keep (the DCS layout itself)

- The main `AppLayout` component (shell with top bar, LHS sidebar, RHS
  sidebar, content area).
- `TopBar` component (app logo, search slot, theme toggle, user menu,
  sidebar toggles).
- `LeftSidebar` + `RightSidebar` components with carousel panel logic.
- `SidebarPanel` component (individual panels within a sidebar's carousel).
- `SidebarToggle` + hamburger button components.
- Theme tokens: OKLCH colour scheme as CSS custom properties.
- Glassmorphism utility classes (semi-transparent cards, backdrop blur).
- Responsive behaviour: sidebars auto-collapse on mobile, touch gestures
  for panel carousel navigation.
- Dark mode handling via `useTheme` hook + CSS variables.
- Keyboard shortcuts for toggling sidebars.

### 4.2 Discard (wg-admin-specific)

- All WireGuard-specific models, controllers, migrations, routes.
- The topology view, server management, peer management pages.
- The `_doc/` and `_journal/` directories (wg-admin development history).
- The `accuion/` directory (whatever that is — confirm before discarding).
- `bin/` scripts related to WireGuard sync.
- `.gemini/` config (unless useful for laradcs; probably not).
- SSH-related config and commands.
- Any Mark-specific branding, logos, or text.

### 4.3 Generalise

- Replace wg-admin's specific sidebar menu items with placeholder example
  items that demonstrate each DCS feature:
  - An expandable tree panel example.
  - A flat list panel example.
  - A filter/search panel example.
  - A settings/profile panel example (on the RHS).
- Replace specific dashboard with a generic "Welcome" page showing the
  DCS layout capabilities.
- Document every customisation point with inline comments.

---

## 5. Repository structure

```
laradcs/
├── .github/
│   ├── workflows/
│   │   ├── tests.yml              # Pest + Playwright
│   │   ├── lint.yml               # Pint + ESLint + TypeScript check
│   │   └── release.yml            # Automated releases
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── app/                            # Standard Laravel backend
│   ├── Http/Controllers/
│   │   ├── Auth/                  # Fortify action classes
│   │   ├── DashboardController.php
│   │   └── SettingsController.php
│   ├── Http/Middleware/
│   │   └── HandleInertiaRequests.php
│   ├── Models/
│   │   └── User.php
│   ├── Actions/Fortify/           # Customisable auth actions
│   └── Providers/
├── bootstrap/
├── config/
├── database/
│   ├── migrations/                # Default Laravel + sessions
│   ├── seeders/
│   │   └── DatabaseSeeder.php    # Example admin user
│   └── factories/
├── public/
├── resources/
│   ├── css/
│   │   ├── app.css                # Entry point
│   │   └── dcs/
│   │       ├── tokens.css         # OKLCH colour variables
│   │       ├── glassmorphism.css  # Utility classes
│   │       └── animations.css     # Sidebar slide/fade animations
│   ├── js/
│   │   ├── app.tsx                # Inertia entry point
│   │   ├── ssr.tsx                # Server-side rendering entry
│   │   ├── layouts/
│   │   │   ├── AppLayout.tsx      # Main DCS shell
│   │   │   └── AuthLayout.tsx     # Login/register shell
│   │   ├── components/
│   │   │   ├── dcs/               # DCS-specific components
│   │   │   │   ├── TopBar.tsx
│   │   │   │   ├── LeftSidebar.tsx
│   │   │   │   ├── RightSidebar.tsx
│   │   │   │   ├── SidebarPanel.tsx
│   │   │   │   ├── SidebarCarousel.tsx
│   │   │   │   ├── SidebarToggle.tsx
│   │   │   │   ├── PanelSwitcher.tsx
│   │   │   │   ├── ThemeToggle.tsx
│   │   │   │   └── UserMenu.tsx
│   │   │   ├── ui/                # shadcn/ui primitives
│   │   │   └── examples/          # Example components for starter pages
│   │   │       ├── ExampleTreePanel.tsx
│   │   │       ├── ExampleListPanel.tsx
│   │   │       └── ExampleSettingsPanel.tsx
│   │   ├── hooks/
│   │   │   ├── useSidebar.ts
│   │   │   ├── useTheme.ts
│   │   │   ├── useCarousel.ts
│   │   │   └── useMediaQuery.ts
│   │   ├── lib/
│   │   │   ├── utils.ts
│   │   │   └── dcs-config.ts      # User-facing DCS configuration
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx      # Demo page showing the DCS layout
│   │   │   ├── Welcome.tsx        # Public landing
│   │   │   ├── auth/
│   │   │   └── settings/
│   │   └── types/
│   │       ├── index.d.ts
│   │       └── dcs.ts             # DCS-specific types
│   └── views/
│       └── app.blade.php          # Inertia root template
├── routes/
│   ├── web.php
│   ├── auth.php
│   └── settings.php
├── tests/
│   ├── Feature/
│   │   ├── Auth/
│   │   └── DashboardTest.php
│   ├── Browser/                   # Playwright for DCS interaction tests
│   │   ├── sidebar-toggle.spec.ts
│   │   ├── carousel-navigation.spec.ts
│   │   └── theme-switch.spec.ts
│   ├── Unit/
│   └── Pest.php
├── docs/
│   ├── README.md                  # Detailed documentation
│   ├── INSTALLATION.md
│   ├── CUSTOMISATION.md
│   ├── DCS-ARCHITECTURE.md        # How the DCS layout works
│   ├── THEMING.md                 # OKLCH token system + customisation
│   ├── CONTRIBUTING.md
│   └── screenshots/
│       ├── dark-mode.png
│       ├── light-mode.png
│       ├── sidebar-collapsed.png
│       ├── sidebar-carousel.png
│       └── mobile.png
├── .editorconfig
├── .env.example
├── .gitignore
├── .prettierrc
├── CHANGELOG.md
├── CLAUDE.md                      # For developers using Claude Code
├── CODE_OF_CONDUCT.md
├── LICENSE                        # MIT
├── README.md                      # Primary docs, screenshots, quick start
├── artisan
├── composer.json
├── package.json
├── phpunit.xml
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 6. Composer.json setup

```json
{
    "name": "markc/laradcs",
    "type": "project",
    "description": "Laravel 13 + Inertia + React starter kit with the DCS (Dual Carousel Sidebar) layout.",
    "keywords": [
        "laravel",
        "starter-kit",
        "inertia",
        "react",
        "typescript",
        "tailwind",
        "dcs",
        "sidebar",
        "layout"
    ],
    "license": "MIT",
    "homepage": "https://github.com/markc/laradcs",
    "support": {
        "issues": "https://github.com/markc/laradcs/issues",
        "source": "https://github.com/markc/laradcs"
    },
    "require": {
        "php": "^8.3",
        "laravel/framework": "^13.0",
        "laravel/fortify": "^1.x",
        "inertiajs/inertia-laravel": "^2.x",
        "tightenco/ziggy": "^2.x"
    },
    "require-dev": {
        "pestphp/pest": "^3.x",
        "pestphp/pest-plugin-laravel": "^3.x",
        "laravel/pint": "^1.x"
    }
}
```

---

## 7. Distribution strategy

### 7.1 Primary install path

```bash
laravel new my-app --using=markc/laradcs
```

This is the official Laravel community starter kit convention. It requires:

1. The repo tagged with semver releases (starting `1.0.0`).
2. Submitted to `tnylea/laravel-new` community registry for discoverability.
3. Published to Packagist.

### 7.2 Alternative install paths

```bash
# Via composer directly
composer create-project markc/laradcs my-app

# Via git clone (for forking / contributing)
git clone https://github.com/markc/laradcs my-app
cd my-app
cp .env.example .env
composer install
bun install
php artisan key:generate
php artisan migrate --seed
bun run dev
```

### 7.3 Post-install automation

Include a post-create-project-cmd script in composer.json that:

1. Copies `.env.example` to `.env`.
2. Runs `php artisan key:generate`.
3. Prompts for the app name and updates `.env`.
4. Optionally runs `php artisan migrate` and prompts for seeding.
5. Prints a friendly welcome message with next steps.

```json
"scripts": {
    "post-create-project-cmd": [
        "@php -r \"file_exists('.env') || copy('.env.example', '.env');\"",
        "@php artisan key:generate --ansi",
        "@php artisan storage:link",
        "@php -r \"print('\\n🎉 laradcs installed! Next steps:\\n');\"",
        "@php -r \"print('  1. Configure your database in .env\\n');\"",
        "@php -r \"print('  2. Run: php artisan migrate --seed\\n');\"",
        "@php -r \"print('  3. Run: bun install && bun run dev\\n');\"",
        "@php -r \"print('  4. Visit http://localhost:8000\\n\\n');\""
    ]
}
```

---

## 8. Documentation plan

### 8.1 README.md (primary)

Structure:

1. **Hero section** — tagline, animated GIF of the DCS layout in action.
2. **Features** — bullet list of what's included.
3. **Screenshots** — dark mode, light mode, sidebar states, mobile view.
4. **Quick start** — one-line install command, then launch.
5. **What is DCS?** — 2–3 paragraph explanation of the pattern with a
   visual diagram.
6. **Stack** — list of all technologies included.
7. **Customising the DCS layout** — pointer to CUSTOMISATION.md.
8. **Theming** — pointer to THEMING.md.
9. **Contributing** — pointer to CONTRIBUTING.md.
10. **Credits** — Mark + contributors + prior art (wg-admin, markweb).
11. **License** — MIT.

### 8.2 docs/INSTALLATION.md

- Prerequisites (PHP 8.3, Composer, Bun/Node, etc.).
- `laravel new --using=` method (recommended).
- `composer create-project` method.
- Manual git clone method.
- First-run checklist.
- Troubleshooting common issues.

### 8.3 docs/DCS-ARCHITECTURE.md

This is the most important doc. Explain:

- What the DCS layout *is* conceptually (with ASCII diagram + images).
- The three zones: top bar, LHS sidebar, RHS sidebar, content area.
- How the carousel concept works — each sidebar holds N panels, user
  switches between panels horizontally.
- Component hierarchy and responsibilities.
- State management: which state lives where (Inertia shared data vs
  client-side hooks).
- Responsive behaviour and breakpoints.
- Accessibility considerations (keyboard nav, ARIA roles, focus management).

### 8.4 docs/CUSTOMISATION.md

How consumers customise laradcs for their own app:

- Defining sidebar panels (with code examples).
- Wiring navigation to Inertia pages.
- Adding a sidebar panel: step-by-step.
- Removing a sidebar panel.
- Switching to LHS-only (no RHS) layout.
- Swapping shadcn/ui primitives for others.
- Adding custom keyboard shortcuts.
- Integrating with existing auth providers.

### 8.5 docs/THEMING.md

- The OKLCH colour token system explained.
- The full list of CSS custom properties.
- How to change the primary accent colour.
- How to add a new theme variant (e.g. "sepia", "high-contrast").
- Tailwind 4 integration notes.
- Glassmorphism utility class reference.
- Dark mode implementation details.

### 8.6 CLAUDE.md (for AI-assisted development)

This is where laradcs differentiates: a comprehensive CLAUDE.md that makes
it trivial for Claude Code to extend the starter kit correctly.

```markdown
# CLAUDE.md — laradcs

## Project overview
A Laravel 13 + Inertia + React starter kit featuring the DCS (Dual Carousel
Sidebar) layout pattern. Used as the foundation for new Laravel applications.

## Stack
- Laravel 13 (PHP 8.3+) with Fortify auth
- Inertia 2 (React adapter)
- React 19 + TypeScript
- Tailwind CSS 4 with OKLCH tokens
- shadcn/ui primitives + Lucide icons
- Vite build, Bun package manager, Pest tests

## DCS layout conventions
The DCS layout has three zones plus a top bar:
- Top bar: App brand, search, sidebar toggles, user menu, theme toggle
- Left sidebar: One or more panels accessed via a carousel switcher
- Right sidebar: One or more panels accessed via a carousel switcher
- Content area: The Inertia page content

Panels are defined as React components and registered with the sidebar via
the DCS configuration in resources/js/lib/dcs-config.ts.

## Where to add things
- New page: resources/js/pages/ + route in routes/web.php
- New sidebar panel: resources/js/components/examples/ + register in dcs-config.ts
- New theme variant: resources/css/dcs/tokens.css + useTheme hook update
- New UI primitive: resources/js/components/ui/ (follow shadcn conventions)
- Backend models/controllers: standard Laravel locations

## File naming
- React components: PascalCase.tsx
- Hooks: camelCase.ts (useXxx.ts)
- Types: camelCase.ts in resources/js/types/
- PHP classes: PascalCase.php

## What NOT to do
- Do not replace the DCS layout with a different layout pattern. If you need
  a different layout for a specific page, wrap it in a page-level layout
  component that sits inside AppLayout.
- Do not use HSL or RGB colours in CSS. Use the OKLCH tokens from
  resources/css/dcs/tokens.css.
- Do not add a UI component library other than shadcn/ui primitives.
- Do not use Vue, Svelte, or plain JS. React + TypeScript only.
- Do not install heavy state libraries (Redux, Zustand) unless genuinely
  needed — Inertia shared data + React hooks handle most cases.

## Testing
- Feature tests in tests/Feature/ via Pest.
- Browser tests for DCS interactions in tests/Browser/ via Playwright.
- Run: bun test (frontend), php artisan test (backend).

## Style
- Prettier + ESLint for TS/TSX.
- Laravel Pint for PHP.
- Pre-commit hooks run both.
```

---

## 9. Build order

Each phase has a concrete acceptance criterion. Complete one before starting
the next.

### Phase 1: Fork the official React starter kit

1. `laravel new laradcs-scratch --using=laravel/react-starter-kit` to
   understand the baseline structure.
2. Create a new repo `markc/laradcs`, initialise from this baseline.
3. Update `composer.json` with laradcs identity.
4. Update `README.md` with placeholder content.
5. Update `package.json` with laradcs name.
6. Verify: `laravel new test --using=markc/laradcs` works locally (via a
   local git URL) and produces a working Laravel app.

**Exit criterion:** Base repo exists and can be installed as a starter kit.

### Phase 2: Extract DCS components from wg-admin

1. In `~/.gh/wg-admin`, identify the DCS-specific files and components.
2. Strip out wg-admin-specific logic from each component.
3. Copy the generic DCS components into `resources/js/components/dcs/` in
   laradcs.
4. Copy the OKLCH theme tokens into `resources/css/dcs/tokens.css`.
5. Copy the Tailwind config extensions.
6. Copy the DCS-related hooks into `resources/js/hooks/`.

**Exit criterion:** All DCS components exist in laradcs with no
WireGuard-specific references.

### Phase 3: Replace default layout with DCS

1. Replace the official starter kit's `AppLayout` with the DCS `AppLayout`.
2. Wire up top bar, LHS sidebar, RHS sidebar, content area.
3. Implement sidebar toggle hamburgers in the top bar.
4. Implement theme toggle.
5. Update `app.tsx` to use the new layout for authenticated pages.
6. Create example panel components for each sidebar.

**Exit criterion:** Running the starter kit shows the DCS layout with
working sidebars, carousel panel switching, and theme toggle.

### Phase 4: Build example pages

1. Replace the default Dashboard with a laradcs demo Dashboard showing
   the DCS capabilities.
2. Add inline explanations and callouts ("This is a sidebar panel. Add
   your own in `resources/js/components/your-panels/`").
3. Include example forms, tables, cards that demonstrate the glassmorphism
   aesthetic.
4. Keep auth pages (login, register, settings) working with DCS AuthLayout
   where appropriate.

**Exit criterion:** A new developer cloning the kit sees a polished demo
that doubles as documentation.

### Phase 5: Documentation

1. Write `README.md` with hero, screenshots, features, install, quick start.
2. Write `docs/INSTALLATION.md`.
3. Write `docs/DCS-ARCHITECTURE.md` with ASCII diagrams and code examples.
4. Write `docs/CUSTOMISATION.md` with common tasks.
5. Write `docs/THEMING.md` with token reference.
6. Write `docs/CONTRIBUTING.md`.
7. Write `CLAUDE.md`.
8. Capture screenshots of all states (dark, light, sidebar open/closed,
   mobile) and add to `docs/screenshots/`.
9. Record a short demo GIF for the README hero.

**Exit criterion:** A developer who has never seen laradcs can install,
understand, and start customising it within 15 minutes using only the docs.

### Phase 6: Testing

1. Write Pest feature tests for all default routes (auth, settings,
   dashboard).
2. Write Playwright tests for:
   - Sidebar toggle works.
   - Panel carousel navigation works.
   - Theme toggle persists.
   - Responsive breakpoints behave correctly.
3. Set up GitHub Actions for:
   - `tests.yml` — run Pest + Playwright on push.
   - `lint.yml` — run Pint + ESLint + TypeScript check.
   - `release.yml` — automate semver releases.

**Exit criterion:** All tests pass. CI is green on main branch.

### Phase 7: Publish and promote

1. Tag `v1.0.0` release.
2. Publish to Packagist: `composer global require laravel/installer`
   should find `markc/laradcs` via Packagist.
3. Submit a PR to `tnylea/laravel-new` to add laradcs to the community
   starter kits registry.
4. Write a launch blog post covering:
   - Why DCS exists (the problem it solves).
   - How to install.
   - What makes it different from the default React starter kit.
   - Screenshots / demos.
5. Share on:
   - Laravel News (submit via their tip form).
   - r/laravel and r/PHP subreddits.
   - Mastodon / Bluesky (dev communities).
   - Laravel Discord.
   - Twitter / X with #Laravel hashtag.
6. Tag v1.0.1, v1.1.0 as improvements land.

**Exit criterion:** laradcs is discoverable via
`laravel new --using=markc/laradcs` and listed on tnylea/laravel-new.

### Phase 8: Maintenance plan

1. Semver: patch for fixes, minor for features, major for breaking changes.
2. Track upstream Laravel React starter kit for upgrade opportunities.
3. Quarterly check: Laravel version, React version, Tailwind version,
   Inertia version — upgrade as needed.
4. Respond to GitHub issues within reasonable time.
5. Accept PRs for:
   - New theme variants.
   - Accessibility improvements.
   - Additional example panels.
   - Documentation improvements.
6. Reject PRs that fundamentally change the DCS concept (that's a fork,
   not a contribution).

**Exit criterion:** Project is healthy, has contributors, and is a
recognised option in the Laravel ecosystem.

---

## 10. Key design decisions

### 10.1 Why fork the official React starter kit rather than build from scratch

Consumers expect feature parity with `laravel/react-starter-kit` (auth,
settings, Fortify, Wayfinder, Pest, dark mode). Forking and replacing only
the layout layer gives laradcs all of that for free, and automatic
compatibility with official documentation and tutorials. Starting from
scratch would mean re-implementing and maintaining auth scaffolding that
already exists and works.

### 10.2 Why use --using= rather than a composer package

Laravel has explicitly moved away from the old `breeze:install` model. The
starter kit is now a cloneable repo consumers own completely. This avoids:
- Composer dependency version conflicts.
- "Surprise" updates when the package is upgraded.
- Opaque behaviour hidden inside vendor/ files.

Consumers customise freely because every file is theirs.

### 10.3 Why OKLCH over HSL

OKLCH is perceptually uniform — equal numeric differences produce equal
visual differences. This makes theming much easier, especially for dark mode
where HSL often produces muddy results. Tailwind 4 has first-class OKLCH
support, making it a natural choice for 2026.

### 10.4 Why shadcn/ui rather than a full component library

shadcn/ui is not a library — it's copy-paste components that live in your
project. This aligns perfectly with the starter kit philosophy (consumer
owns all code) and gives laradcs a way to ship polished primitives without
forcing a runtime dependency.

### 10.5 Why dual sidebars by default

The "Dual" in DCS is part of the value proposition. Apps that don't need
the right sidebar can hide or remove it trivially — but starting with both
demonstrates the full pattern. Starting with one would make laradcs
indistinguishable from the default kit.

---

## 11. Success metrics

Six months after v1.0.0:

- **Downloads:** 500+ on Packagist.
- **Stars:** 100+ on GitHub.
- **Community:** At least 3 external contributors.
- **Listed:** On tnylea/laravel-new community starter kits.
- **Coverage:** A mention or article on Laravel News.
- **Usage:** 3+ public projects built on laradcs (outside Mark's own).

These are modest targets for a niche starter kit. Overshooting them means
DCS has hit a nerve with the community.

---

## 12. Relationship to other Mark projects

- **wg-admin** remains the canonical reference implementation and testing
  ground. New DCS features are battle-tested there first, then extracted
  into laradcs.
- **markweb** uses its own DCS implementation (Blade/PHP) — out of scope
  for laradcs but the visual language should stay coherent.
- **bion-notes** (from BION-NOTES-PLAN.md) becomes the first *consumer* of
  laradcs — eat your own dog food. If bion-notes is built *after*
  laradcs v1.0.0, it simply uses `laravel new bion-notes --using=markc/laradcs`
  and is done with the shell in 30 seconds instead of a whole phase.

This is the clincher: **laradcs v1.0.0 should ship before bion-notes starts**,
because it saves the entire Phase 1 of bion-notes and every future Laravel
project Mark ships.

---

## 13. Open questions

1. **Repo owner:** `markc/laradcs` or a neutral org name? A neutral
   `laradcs-org/laradcs` might be better for community adoption and future
   maintainership transitions. Decision: start with `markc/laradcs`, migrate
   to an org if it takes off.
2. **Logo / branding:** Does laradcs need a logo? A simple wordmark would
   help with the README hero.
3. **Demo site:** Should there be a live demo at `laradcs.dev` or similar?
   Useful for marketing but adds hosting overhead. Could be a simple
   static Vercel/Cloudflare Pages deploy.
4. **WorkOS variant:** The official React starter kit has a WorkOS branch
   for SSO. Should laradcs mirror this? Defer to v1.1 based on demand.
5. **Teams / multi-tenancy:** The old Jetstream had teams. Starter kits
   are moving toward adding this back. If laradcs adds it, when? Defer to
   v2.0, after v1 has proven itself.
