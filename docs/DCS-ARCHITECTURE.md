# DCS Architecture

The Dual Carousel Sidebar shell gives an application two autonomous sidebars. Each sidebar can contain up to eight panels, open as an overlay, or pin as a content column at 960px and wider.

## Geometry

The top navigation is fixed at the top of the viewport, spans the full viewport width, and is never pushed by pinned sidebars. Its height is `--topnav-height` (default `4rem`). The sidebars start below it and use:

```css
top: var(--topnav-height);
height: calc(100vh - var(--topnav-height));
```

The content wrapper has matching top padding. At the `pin` breakpoint (960px), pinned sidebars add `var(--sw-l)` and `var(--sw-r)` margins to that wrapper. Each sidebar's inner rail starts at `top: 0` because the sidebar itself is already below the topnav; there is no scroll-state behaviour.

## Width model

Widths are independent percentages:

```css
--sidebar-width-left: 15%;
--sidebar-width-right: 15%;
--sw-l: clamp(200px, var(--sidebar-width-left), 100%);
--sw-r: clamp(200px, var(--sidebar-width-right), 100%);
```

The Appearance panel spinners accept 10–100% in steps of 5. Inner-edge dragging measures the pointer against `window.innerWidth`, updates the relevant CSS variable live at 1% precision, and persists on release. The 200px CSS floor wins whenever the chosen percentage would be narrower.

## Responsive restore

On first visit, both sidebars are pinned and open at 960px or wider and closed below 960px. Saved state wins on desktop. Below 960px, initial load and breakpoint crossing force the runtime sidebars closed without erasing the saved desktop pin intent; crossing back restores it. The `pin:` Tailwind variant comes from `--breakpoint-pin: 960px` in `resources/css/app.css`.

## Runtime state

`ThemeProvider` owns:

- light/dark theme and six colour schemes;
- slide/fade carousel mode;
- narrow/normal/wide content width;
- `{ open, pinned, panel }` for each side;
- `sidebarWidthLeft` and `sidebarWidthRight` percentages.

The flat JSON state is stored under one localStorage key, `laradcs-state` by default. Corrupt or unavailable storage never stops rendering. `resources/views/app.blade.php` reads the same key before Vite loads and applies theme, scheme, content-width classes and layout variables under `html.preload`; the provider removes `preload` on the next animation frame.

## Provider configuration

`ThemeProvider` accepts only these consumer settings:

```tsx
<ThemeProvider
    storageKey="laradcs-state"
    topnavHeight="4rem"
    defaults={{
        theme: 'dark',
        scheme: 'ocean',
        left: { open: true, pinned: true, panel: 0 },
        right: { open: true, pinned: true, panel: 0 },
    }}
>
    {children}
</ThemeProvider>
```

The breakpoint, percentage width model, hamburger positions, and geometry are fixed. If `storageKey` changes, `config/dcs.php` must use the same value so the pre-paint script and React read one state object.

## Carousel behaviour

Dots jump directly to a panel. Chevrons preserve direction at the boundary: last-to-first temporarily places the first panel beyond the track's right edge, slides forward, then snaps to its canonical position with transitions suppressed; first-to-last mirrors this. A queued cleanup is cancelled before another navigation. A one-panel sidebar renders its title and content without chevrons or dots.

## Content width

At 960px and wider, each direct `main > section` is centred and capped by `--content-max`:

- Narrow: `50vw`
- Normal: `75vw`
- Wide: `none`

Pinned wrapper margins still constrain the available space, so the two systems compose without overlap.

## File responsibilities

| Concern | File |
|---|---|
| State, persistence, provider props | `resources/js/contexts/theme-context.tsx` |
| Sidebar geometry, pin and drag controls | `resources/js/components/dcs/sidebar.tsx` |
| Carousel rendering and wrap animation | `resources/js/components/dcs/panel-carousel.tsx` |
| Fixed full-width topnav | `resources/js/components/dcs/top-nav.tsx` |
| Appearance controls | `resources/js/components/dcs/panels/theme-panel.tsx` |
| Tokens, schemes and container queries | `resources/css/dcs/tokens.css` |
| Panel registration and shell wiring | `resources/js/layouts/app/app-dual-sidebar-layout.tsx` |
| Pre-paint storage key | `config/dcs.php`, `resources/views/app.blade.php` |

Authenticated Inertia pages use persistent layouts (`Page.layout = ...`) so navigation swaps only page content and does not remount DCS state.
