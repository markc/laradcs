---
name: add-color-scheme
description: Add a new OKLCH colour scheme to the DCS theme system — covers tokens.css, ThemeProvider, and the appearance panel
---

# Add a new OKLCH colour scheme

The DCS theme system ships with five OKLCH-based colour schemes:
Ocean (default, H=220), Crimson (H=25), Stone (H=60), Forest (H=150),
Sunset (H=45). Adding a sixth is a 4-file change.

## How schemes work

Each scheme is a hue rotation around a shared lightness/chroma recipe.
The CSS classes `.scheme-<name>:not(.dark)` and `.dark.scheme-<name>`
override the `--scheme-*` tokens. The default scheme (Ocean) is
applied at the bare `:root` and `.dark` selectors with no class —
all other schemes use a class.

## Steps

### 1. Pick a hue

Hue is an OKLCH angle in degrees (0-360). Examples used in the kit:

| Scheme | Hue | Position |
|---|---|---|
| Crimson | 25 | red |
| Sunset | 45 | orange-amber |
| Stone | 60 | warm neutral |
| Forest | 150 | green |
| Ocean | 220 | cyan-blue |

For a new scheme, pick a hue that's clearly distinct from these
(at least 30° away from any existing one).

### 2. Add the scheme block to `resources/css/dcs/tokens.css`

Paste this template, replacing `<NAME>` with your scheme name and
`<H>` with the hue degree:

```css
/* ---------- <Name> — H=<H> ---------- */
.scheme-<name>:not(.dark) {
    --scheme-bg-primary: oklch(98% 0.008 <H>);
    --scheme-bg-secondary: oklch(96% 0.012 <H>);
    --scheme-bg-tertiary: oklch(92% 0.018 <H>);
    --scheme-fg-primary: oklch(25% 0.06 <H>);
    --scheme-fg-secondary: oklch(40% 0.08 <H>);
    --scheme-fg-muted: oklch(50% 0.06 <H>);
    --scheme-accent: oklch(55% 0.12 <H>);
    --scheme-accent-hover: oklch(60% 0.14 <H>);
    --scheme-accent-fg: oklch(98% 0.01 <H>);
    --scheme-accent-subtle: oklch(92% 0.025 <H>);
    --scheme-accent-glow: oklch(55% 0.12 <H> / 0.3);
    --scheme-border: oklch(85% 0.02 <H>);
    --scheme-border-muted: oklch(90% 0.015 <H>);
    --glass: oklch(98% 0.008 <H> / 0.9);
    --glass-border: oklch(85% 0.02 <H> / 0.5);
}
.dark.scheme-<name> {
    --scheme-bg-primary: oklch(12% 0.015 <H>);
    --scheme-bg-secondary: oklch(16% 0.02 <H>);
    --scheme-bg-tertiary: oklch(22% 0.025 <H>);
    --scheme-fg-primary: oklch(95% 0.02 <H>);
    --scheme-fg-secondary: oklch(75% 0.05 <H>);
    --scheme-fg-muted: oklch(55% 0.04 <H>);
    --scheme-accent: oklch(75% 0.12 <H>);
    --scheme-accent-hover: oklch(85% 0.1 <H>);
    --scheme-accent-fg: oklch(15% 0.04 <H>);
    --scheme-accent-subtle: oklch(25% 0.04 <H>);
    --scheme-accent-glow: oklch(75% 0.12 <H> / 0.4);
    --scheme-border: oklch(30% 0.03 <H>);
    --scheme-border-muted: oklch(22% 0.02 <H>);
    --glass: oklch(16% 0.02 <H> / 0.85);
    --glass-border: oklch(30% 0.03 <H> / 0.5);
}
```

For low-chroma schemes (like Stone), reduce the chroma values
(e.g. 0.05 → 0.03) across the board. For high-chroma schemes
(like Crimson), increase them.

### 3. Extend the `ColorScheme` type union

File: `resources/js/contexts/theme-context.tsx`

```tsx
export type ColorScheme = 'ocean' | 'crimson' | 'stone' | 'forest' | 'sunset' | '<name>';
```

### 4. Add the scheme to `applySchemeToDOM`

Same file, in the function that toggles the body classes. Add your
scheme to the list of classes to remove (so switching FROM your
scheme TO another scheme cleans up the class):

```tsx
function applySchemeToDOM(scheme: ColorScheme) {
    const html = document.documentElement;
    ['crimson', 'stone', 'forest', 'sunset', '<name>'].forEach(
        (s) => html.classList.remove(`scheme-${s}`),
    );
    if (scheme !== 'ocean') {
        html.classList.add(`scheme-${scheme}`);
    }
}
```

### 5. Register the scheme in the appearance panel

File: `resources/js/components/dcs/panels/theme-panel.tsx`

Append an entry to the `schemes` array. The `hue` is for the colour
swatch shown next to the label:

```tsx
const schemes: { id: ColorScheme; label: string; hue: number }[] = [
    { id: 'ocean', label: 'Ocean', hue: 220 },
    { id: 'crimson', label: 'Crimson', hue: 25 },
    { id: 'stone', label: 'Stone', hue: 60 },
    { id: 'forest', label: 'Forest', hue: 150 },
    { id: 'sunset', label: 'Sunset', hue: 45 },
    { id: '<name>', label: '<Name>', hue: <H> },  // NEW
];
```

### 6. Verify

```bash
npx vite build
```

Reload the dashboard, open the Appearance panel (RHS R2), and
click the new scheme. Every `--scheme-*` reference (sidebars,
panels, hero shimmer, all marketing cards) should adopt the new
hue. Toggle dark/light to verify both modes work.

## Don't break the OKLCH-only rule

See `css-oklch-only.md`. Every value you add must be an `oklch(...)`
call. Mixing in `hsl()` or `rgb()` will make the scheme inconsistent
with the rest of the system.
