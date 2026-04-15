# DCS Architecture

The **Dual Carousel Sidebar** layout pattern is the centrepiece of
laradcs. This document explains what it is, how it's structured,
and how a request becomes a rendered page.

## What is DCS?

Most Laravel apps ship with a single collapsible sidebar — clean,
but limiting. DCS gives every app **two sidebars** (left and right)
where each sidebar holds **multiple panels** the user swipes
between horizontally like a carousel.

```
+-------------------------------------------------------------+
|  TopBar                                                     |
+--------+----------------------------------------+-----------+
|        |                                        |           |
|  L1    |                                        |    R1     |
|  Nav   |          Page Content                  |   Chat    |
|  L2    |                                        |    R2     |
|  About |                                        |  Theme    |
|  L3    |                                        |    R3     |
|  App   |                                        | Components|
|        |                                        |    R4     |
|        |                                        |  Account  |
|        |                                        |           |
+--------+----------------------------------------+-----------+
   ↑           ↑                                       ↑
 L sidebar   content area                         R sidebar
 (3 panels,  (full-bleed, scrolls under            (4 panels,
  carousel)  the topnav)                             carousel)
```

Both sidebars are off-canvas by default and **pinnable** on
desktop (≥1280px). Below that breakpoint they auto-unpin and
become slide-in overlays.

## File layout

```
resources/
├── css/
│   ├── app.css                    Tailwind 4 + shadcn token mapping
│   └── dcs/
│       ├── tokens.css             OKLCH scheme tokens (5 schemes)
│       └── components.css         Hero, service-card, section-header
├── js/
│   ├── app.tsx                    Inertia bootstrap
│   ├── contexts/
│   │   └── theme-context.tsx      ThemeProvider with sidebar/scheme state
│   ├── components/
│   │   ├── dcs/                   DCS-specific components
│   │   │   ├── sidebar.tsx
│   │   │   ├── panel-carousel.tsx
│   │   │   ├── top-nav.tsx
│   │   │   └── panels/
│   │   │       ├── nav-panel.tsx
│   │   │       ├── about-panel.tsx
│   │   │       ├── app-panel.tsx
│   │   │       ├── chat-panel.tsx
│   │   │       ├── theme-panel.tsx
│   │   │       ├── components-panel.tsx
│   │   │       └── user-panel.tsx
│   │   ├── ui/                    shadcn/ui primitives
│   │   └── icons/
│   │       └── github-icon.tsx    Hand-written brand SVGs
│   ├── layouts/
│   │   ├── app-layout.tsx         Thin delegate
│   │   └── app/
│   │       └── app-dual-sidebar-layout.tsx   The shell
│   └── pages/
│       ├── dashboard.tsx          Demo page (faithful dcs.spa port)
│       ├── welcome.tsx            Guest landing (NOT inside DCS)
│       └── settings/...
```

## How a request becomes a rendered page

1. **Laravel** receives a request to (e.g.) `/dashboard`. The
   route in `routes/web.php` is inside the `auth` middleware
   group; if the user isn't logged in they're redirected to login.

2. **Controller** (or closure for simple pages) returns
   `Inertia::render('dashboard', $props)`. Inertia detects the
   request is an XHR (with `X-Inertia: true`) and returns JSON
   instead of HTML on subsequent navigations; on first page load
   it returns the full HTML shell.

3. **`resources/views/app.blade.php`** renders the HTML shell
   with the Inertia root div, font links (Inter + Quicksand), CSRF
   meta tag, favicon links, and Vite asset tags.

4. **`resources/js/app.tsx`** boots Inertia. Each Inertia page
   component declares its layout via the static
   `Page.layout = (page) => <AppLayout>{page}</AppLayout>` form
   (NOT inline JSX — see "Persistent layouts" below).

5. **`resources/js/layouts/app-layout.tsx`** is a thin delegate
   that renders `AppDualSidebarLayout`.

6. **`resources/js/layouts/app/app-dual-sidebar-layout.tsx`** is
   the actual shell. It mounts `<ThemeProvider>`, registers the
   left and right panel arrays, and renders:
   - Two sidebar toggle buttons (`Menu` icons) at top-left/right
   - `<Sidebar side="left" panels={leftPanels} />` and right
   - `<TopNav />` (full-width, opaque)
   - The `<main>` content area with `marginInlineStart/End`
     conditional on whether each sidebar is pinned
   - A `useEffect` that toggles `body.dcs-shell` so the fixed
     server-room background image is scoped to authenticated
     pages only (not welcome/login)
   - Another `useEffect` that toggles `body.scrolled` based on
     `window.scrollY > 0` for the scroll-reactive sidebar borders

7. **`ThemeProvider`** (`resources/js/contexts/theme-context.tsx`)
   owns all DCS runtime state:
   - `theme: 'light' | 'dark'`
   - `scheme: 'ocean' | 'crimson' | 'stone' | 'forest' | 'sunset'`
   - `carouselMode: 'slide' | 'fade'`
   - `left: { open, pinned, panel }` and `right: { ... }`
   - `sidebarWidth: number` (200-500px, default 300)

   State persists to `localStorage` under key `laradcs-state` and
   is applied to the DOM via class toggles (`.dark`, `.scheme-*`)
   and the `--sidebar-width` custom property.

8. **The page component's content** renders inside `<main>`.
   Because the layout is persistent (set via `.layout` static),
   only the inner content swaps on navigation — the sidebars,
   ThemeProvider, and chat panel state all stay mounted.

## The carousel pattern

Each sidebar wraps its panels in a `PanelCarousel` component that:

- Renders a horizontal track with all panels side-by-side
- Translates the track via CSS `transform: translate3d` to bring
  the active panel into view
- Renders carousel dots at the top of the sidebar (one per
  panel) — clicking a dot makes that panel active
- Supports two modes: `slide` (default, smooth horizontal
  translate) and `fade` (cross-fade between panels)
- The active panel index per side is held in `theme-context`
  state and persisted

`MAX_PANELS = 8` is set in the theme context. Don't exceed that
without bumping the constant.

## The scroll-reactive border

Each sidebar has a 1px **vertical** strip on its inner edge
(right edge of left sidebar, left edge of right sidebar). The
strip's `top` value animates between two states:

- Default (page at top): `top: var(--topnav-height)` — strip
  starts BELOW the topnav, leaving the topnav region clean
- Scrolled (`body.scrolled` class): `top: 0` — strip extends up
  into the topnav region for a continuous full-height rail

The CSS lives in `resources/css/dcs/tokens.css` and the JS that
toggles `body.scrolled` lives in `app-dual-sidebar-layout.tsx`.
Faithful port of dcs.spa's `base.css:384`.

## Persistent layouts (Inertia)

Every authenticated page MUST use Inertia's static layout form:

```tsx
export default function Dashboard() {
    return <>{/* page content */}</>;
}

Dashboard.layout = (page) => <AppLayout>{page}</AppLayout>;
```

NOT this anti-pattern (which the upstream Laravel React starter
kit ships with):

```tsx
// ❌
export default function Dashboard() {
    return (
        <AppLayout>
            {/* page content */}
        </AppLayout>
    );
}
```

The wrong form remounts `AppLayout` on every navigation, which
unmounts the ThemeProvider, sidebars, and chat panel — defeating
the whole point of persistent state.

See `.claude/skills/inertia-persistent-layout.md` for details
and `.claude/skills/add-inertia-page.md` for the recipe.

## Responsive behaviour

| Viewport | Sidebars |
|---|---|
| **≥1280px (xl)** | Can be pinned. Pinned sidebars push content inward via `margin-inline-start/end: var(--sidebar-width)`. |
| **<1280px** | Auto-unpinned (forced by a `matchMedia` listener in the theme context). Sidebars become slide-in overlays via `transform: translateX(±100%)`. |

The breakpoint is hardcoded at 1280px in
`theme-context.tsx`. Change in one place (the `useEffect` matchMedia
expression) if you need a different threshold.

## What lives where

| Concern | File |
|---|---|
| Adding a new sidebar panel | `.claude/skills/add-dcs-panel.md` |
| Adding a new colour scheme | `.claude/skills/add-color-scheme.md` |
| Adding a new Inertia page | `.claude/skills/add-inertia-page.md` |
| Adding an LLM tool | `.claude/skills/add-laravel-ai-tool.md` |
| Theme tokens | `resources/css/dcs/tokens.css` |
| Marketing/section CSS | `resources/css/dcs/components.css` |
| Shell mount + sidebar wiring | `resources/js/layouts/app/app-dual-sidebar-layout.tsx` |
| Shell state | `resources/js/contexts/theme-context.tsx` |
