---
name: write-svg-icon
description: Hand-write an inline SVG icon component when a needed icon isn't in lucide-react (e.g. brand marks)
---

# Write an inline SVG icon component

`lucide-react` v1 dropped brand icons (GitHub, Discord, X, Apple,
etc.) for trademark/design-grammar reasons. When you need a brand
or custom icon, the kit's pattern is to hand-write a tiny inline
SVG component rather than pull in another dep.

## Pattern

File: `resources/js/components/icons/<name>-icon.tsx`

```tsx
import type { SVGProps } from 'react';

export default function GithubIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            {...props}
        >
            <path d="M12 .5C5.37.5 0 5.87 0 12.5a12 12 0 0 0 8.21 11.4..."/>
        </svg>
    );
}
```

Three things matter:

1. **`viewBox="0 0 24 24"`** — match lucide-react's default 24-unit
   grid so the icon composes with sibling lucide icons at the same
   visual weight.
2. **`fill="currentColor"`** — inherits the colour from the parent
   element via CSS, so `style={{ color: 'var(--scheme-accent)' }}`
   on the parent works.
3. **`{...props}`** spread last — lets callers pass `className`,
   `width`, `height`, `aria-label`, etc.

## Where to find clean SVG paths

- **Brand marks:** [Simple Icons](https://simpleicons.org/) — MIT-licensed,
  trademark-compliant brand SVGs. Copy the `<path>` d attribute.
- **Custom icons:** Figma + "Copy as SVG" → strip styles, keep
  the `<path>` only.
- **Anthropic / Claude:** no public API for the logo; ask a designer.

## Usage

```tsx
import GithubIcon from '@/components/icons/github-icon';

<a href="https://github.com/markc/laradcs">
    <GithubIcon className="h-5 w-5" />
    View on GitHub
</a>
```

Pair it with text labels for accessibility (the `aria-hidden` on
the SVG defers the label to the surrounding text).

## When to write a new icon vs use lucide

| Need | Use |
|---|---|
| Standard UI icon (chevron, settings, user) | lucide-react |
| Brand mark (GitHub, Discord, npm, etc.) | inline SVG |
| Custom logo for the app | inline SVG (or reference a file in `public/`) |
| Animated icon | inline SVG with SMIL or CSS |

If you're adding more than 3 brand icons, install `simple-icons`
instead and import from there — at that point the package pays
for itself.

## Verify

```bash
npx tsc --noEmit
npx vite build
```

Then render the component on a page and confirm it sizes correctly
and inherits colour from its parent.
