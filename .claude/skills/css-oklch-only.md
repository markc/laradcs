---
name: css-oklch-only
description: Guardrail rule — never add HSL or RGB to CSS, always use OKLCH for any new colour
---

# CSS: OKLCH only, never HSL or RGB

The DCS theme system is OKLCH-native. Every colour in
`resources/css/dcs/tokens.css`, `resources/css/dcs/components.css`,
and `resources/css/app.css` is an `oklch()` call. The rule is
absolute: **no HSL, no RGB, no hex** in CSS files, except for:

- The empty fallback `background-color: #000` used as a flash-
  prevention fallback before a webp image loads
- Explicit `rgb(0 0 0 / 0.6)` overlays where alpha matters and
  the colour itself is pure black/white

## Why

OKLCH is **perceptually uniform**. Two colours with the same `L`
value have the same perceived lightness, regardless of hue.
Two colours with the same `C` value have the same perceived
chroma. This makes building a coherent colour scheme — especially
across light and dark modes — dramatically easier than HSL.

HSL has the well-known problem that yellow at 50% lightness
appears brighter than blue at 50% lightness, because HSL is
based on monitor RGB primaries, not human vision. This is why
HSL-based dark modes always look "muddy" — same lightness values
visually translate to different brightnesses.

OKLCH solves this by using the OKLab perceptual colour space.

## Enforcement

Grep for forbidden colour functions:

```bash
grep -rE 'hsl\(|rgb\(' resources/css/ \
    | grep -v 'rgb(0 0 0 / 0\.[0-9]' \
    | grep -v '#[0-9a-fA-F]\{3,8\}'
```

If anything turns up, it's a violation. Fix it.

## How to convert HSL/RGB to OKLCH

### Use a converter

Reliable web converters:

- https://oklch.com/ — visual, includes a slider and a colour
  picker
- https://www.smashingmagazine.com/2023/08/oklch-color-spaces-gamuts/
  — has a chart of OKLCH equivalents for common hex codes

### Use Python

```python
import math

def srgb_to_oklch(r, g, b):
    """sRGB hex -> OKLCH (L%, C, H°). Inputs r,g,b in [0,255]."""
    def linear(u):
        u /= 255
        return u/12.92 if u <= 0.04045 else ((u + 0.055) / 1.055) ** 2.4

    r, g, b = linear(r), linear(g), linear(b)

    # linear sRGB -> LMS
    l = 0.4122214708*r + 0.5363325363*g + 0.0514459929*b
    m = 0.2119034982*r + 0.6806995451*g + 0.1073969566*b
    s = 0.0883024619*r + 0.2817188376*g + 0.6299787005*b

    l_, m_, s_ = l**(1/3), m**(1/3), s**(1/3)

    L = 0.2104542553*l_ + 0.7936177850*m_ - 0.0040720468*s_
    a = 1.9779984951*l_ - 2.4285922050*m_ + 0.4505937099*s_
    b2 = 0.0259040371*l_ + 0.7827717662*m_ - 0.8086757660*s_

    C = math.sqrt(a*a + b2*b2)
    h = math.degrees(math.atan2(b2, a))
    if h < 0: h += 360

    return f"oklch({L*100:.0f}% {C:.3f} {h:.0f})"

print(srgb_to_oklch(0x1E, 0x88, 0xC1))   # blue
```

## Don't

- **Don't add Tailwind colour utilities like `bg-red-500`** in
  DCS components — those are hardcoded RGB. Use inline `style`
  with `var(--scheme-*)` tokens.
- **Don't use shadcn/ui's default colours raw** — they're already
  mapped to OKLCH in `resources/css/app.css`. Don't override
  them with HSL.
- **Don't introduce a new colour token without adding it to
  every scheme** — see `add-color-scheme.md`. A new token added
  only to `:root` will fall back to undefined for non-default
  schemes.

## Reference

- `resources/css/dcs/tokens.css` — the canonical OKLCH palette
- `resources/css/app.css` — shadcn token mapping (also OKLCH)
- `_doc/2026-04-15-evening-session.md` (in this journal) — the
  background of why we went all-in on OKLCH
