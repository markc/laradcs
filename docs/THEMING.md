# Theming

laradcs is built on **OKLCH** colours throughout — never HSL or
RGB. This is the price of admission for a coherent multi-scheme,
multi-mode theme system. This document covers what that means,
the token catalogue, and how to add a new scheme.

## Why OKLCH

OKLCH is **perceptually uniform**: two colours with the same `L`
(lightness) value look equally bright regardless of hue. Two
colours with the same `C` (chroma) value have the same perceived
saturation. HSL doesn't have this property — yellow at 50%
lightness looks brighter than blue at 50% lightness because HSL
is based on monitor RGB primaries, not human vision.

In practice, this means:

- **Dark mode looks coherent.** All darks have the same
  perceived darkness, regardless of accent hue.
- **Switching schemes is just a hue rotation.** Define a
  template (lightness/chroma values) and pick a hue. Every
  scheme automatically has the same visual weight.
- **Accessibility contrast is predictable.** Same `L` =
  same brightness, so contrast ratios behave as expected.

## Token catalogue

All tokens live in `resources/css/dcs/tokens.css`. They use the
prefix `--scheme-*` to avoid collision with shadcn/ui's
`--background`, `--accent`, etc. (which live in `app.css`).

### Background layers (3)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--scheme-bg-primary` | 98% L | 12% L | Page body background |
| `--scheme-bg-secondary` | 96% L | 16% L | Cards, sidebars, content sections |
| `--scheme-bg-tertiary` | 92% L | 22% L | Hover surfaces, message bubbles |

### Foreground layers (3)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--scheme-fg-primary` | 25% L | 95% L | Body text, headings |
| `--scheme-fg-secondary` | 40% L | 75% L | Secondary text, panel content |
| `--scheme-fg-muted` | 50% L | 55% L | Tertiary text, captions, labels |

### Accent (5)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--scheme-accent` | 55% L 0.12 C | 75% L 0.12 C | Primary brand colour |
| `--scheme-accent-hover` | 60% L 0.14 C | 85% L 0.10 C | Hover state |
| `--scheme-accent-fg` | 98% L (white) | 15% L (dark) | Text on accent surfaces |
| `--scheme-accent-subtle` | 92% L 0.025 C | 25% L 0.04 C | Selected/active backgrounds |
| `--scheme-accent-glow` | 55% L 0.12 C / 0.3α | 75% L 0.12 C / 0.4α | Card hover glow |

### Borders (2)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--scheme-border` | 85% L | 30% L | Standard borders |
| `--scheme-border-muted` | 90% L | 22% L | Subtle dividers |

### Glassmorphism (2)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--glass` | 98% L 0.008 / 0.9α | 16% L 0.02 / 0.85α | Glass card background |
| `--glass-border` | 85% L 0.02 / 0.5α | 30% L 0.03 / 0.5α | Glass card border |

### Layout metrics (2)

| Token | Default |
|---|---|
| `--topnav-height` | `3.5rem` |
| `--sidebar-width` | `300px` (overridable via theme panel slider 200-500) |

## The five default schemes

Each scheme is a hue rotation around the same template. The
default is **Ocean** (no class on `<html>`), the others are
applied via `.scheme-<name>` classes.

| Scheme | Hue | Position | Class |
|---|---|---|---|
| **Ocean** (default) | 220 | cyan-blue | (no class) |
| Crimson | 25 | red | `.scheme-crimson` |
| Sunset | 45 | orange-amber | `.scheme-sunset` |
| Stone | 60 | warm neutral | `.scheme-stone` |
| Forest | 150 | green | `.scheme-forest` |

Stone uses lower chroma values than the others (it's a near-grey
neutral); the rest use the same chroma template.

## Light vs dark

Light/dark is a separate axis from scheme. Toggle via the
`.dark` class on `<html>` (added/removed by `applyThemeToDOM`
in `theme-context.tsx`). Combined with scheme classes:

- `<html>` (no classes) = Ocean light
- `<html class="dark">` = Ocean dark
- `<html class="scheme-crimson">` = Crimson light
- `<html class="dark scheme-crimson">` = Crimson dark

Each scheme defines tokens for both modes via the
`.scheme-<name>:not(.dark) { ... }` and `.dark.scheme-<name> { ... }`
selectors in `tokens.css`.

## Adding a new scheme

See `.claude/skills/add-color-scheme.md` for the step-by-step
recipe. Summary: add a `.scheme-<name>:not(.dark)` and
`.dark.scheme-<name>` block to `tokens.css`, extend the
`ColorScheme` union in `theme-context.tsx`, update
`applySchemeToDOM`, and append to the schemes list in
`theme-panel.tsx`.

## The shadcn/ui token bridge

shadcn/ui primitives use their own token names (`--background`,
`--foreground`, `--primary`, `--accent`, `--border`, `--ring`,
etc.). These live in `resources/css/app.css` as a separate set
of OKLCH-defined tokens that adopt light/dark mode but **not**
the active scheme.

If you want a shadcn primitive to react to the scheme accent
(e.g. a button that uses the active scheme's blue), override
inline:

```tsx
<Button style={{
    background: 'var(--scheme-accent)',
    color: 'var(--scheme-accent-fg)',
}}>
    Scheme-aware button
</Button>
```

Don't try to redefine shadcn's `--accent` — that breaks every
default shadcn primitive across the kit.

## The forbidden colour functions

**Never use these in CSS files:**

- `hsl()` — perceptually nonuniform, breaks dark mode coherence
- `rgb()` — same problem (allowed only for pure black/white
  overlays where alpha matters: `rgb(0 0 0 / 0.5)` is fine)
- Hex literals like `#ff5500` — opaque hex is fine for SVGs and
  inline JSX style attributes where you need a specific value,
  but never in a CSS token file

The OKLCH-only rule has its own skill: `.claude/skills/css-oklch-only.md`.

## Reference tools

- **[oklch.com](https://oklch.com/)** — visual OKLCH picker with
  L/C/H sliders and a hex/HSL converter
- **Tailwind 4 docs** — Tailwind 4 is OKLCH-native and a great
  reference for which OKLCH values map to which visual weight
- **`docs/DCS-ARCHITECTURE.md`** — for how the tokens fit into
  the full layout system

## Related skills

- `.claude/skills/add-color-scheme.md` — adding a new scheme
- `.claude/skills/css-oklch-only.md` — the guardrail rule
