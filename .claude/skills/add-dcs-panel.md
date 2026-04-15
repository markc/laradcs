---
name: add-dcs-panel
description: Add a new sidebar carousel panel to the DCS shell — covers component file, registration, and panel index numbering
---

# Add a new DCS sidebar panel

The DCS shell exposes two sidebars (left and right), each holding 1-8
React components ("panels") that the user can swipe between via the
carousel header. Adding a new panel is a 2-file operation.

## Where panels live

```
resources/js/components/dcs/panels/
├── about-panel.tsx       (L2)
├── app-panel.tsx         (L3)
├── chat-panel.tsx        (R1)
├── components-panel.tsx  (R3)
├── nav-panel.tsx         (L1)
├── theme-panel.tsx       (R2)
└── user-panel.tsx        (R4)
```

## Steps

### 1. Create the panel component

File: `resources/js/components/dcs/panels/<name>-panel.tsx`

Write a default-exported React component. **Use only `--scheme-*`
CSS variables for colours** so the panel inherits the active scheme:

```tsx
import { Sparkles } from 'lucide-react';

export default function MyPanel() {
    return (
        <div className="space-y-4 p-4">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--scheme-fg-primary)' }}>
                My Panel
            </h3>
            <p className="text-sm" style={{ color: 'var(--scheme-fg-secondary)' }}>
                Content using --scheme-* tokens for theme awareness.
            </p>
        </div>
    );
}
```

For inspiration, read a neighbour first — `theme-panel.tsx` shows
form controls, `chat-panel.tsx` shows a list + input layout,
`nav-panel.tsx` shows the active-route highlight pattern.

### 2. Register the panel in the layout

File: `resources/js/layouts/app/app-dual-sidebar-layout.tsx`

Add the import at the top, then add a new entry to either
`leftPanels` or `rightPanels`. **The label MUST start with `L<n>:`
or `R<n>:`** — the prefix is stripped from the visible title but
used as the React key and the `aria-label` for the carousel dot.

```tsx
import MyPanel from '@/components/dcs/panels/my-panel';

const rightPanels = [
    { label: 'R1: Chat', content: <ChatPanel /> },
    { label: 'R2: Appearance', content: <ThemePanel /> },
    { label: 'R3: Components', content: <ComponentsPanel /> },
    { label: 'R4: Account', content: <UserPanel /> },
    { label: 'R5: My Panel', content: <MyPanel /> },  // NEW
];
```

`MAX_PANELS = 8` is set in `resources/js/contexts/theme-context.tsx`.
Don't exceed 8 panels per side without raising that constant.

### 3. Verify

```bash
npx vite build         # should compile clean
php artisan test       # should still pass 26/26
```

Then start the dev server (`composer dev`), reload the dashboard,
and click through the right sidebar's carousel dots — your new
panel should be the last one and should render with the active
scheme colours.

## File naming

Match the existing convention: **kebab-case `.tsx`**, suffix `-panel`.
This is per `CLAUDE.md` — laradcs follows the upstream
`laravel/react-starter-kit` kebab-case convention, **not** PascalCase.

## Common mistakes

- **Don't import `LucideIcon` from `lucide-react`** — that named
  export was removed in v1. Use `import type { LucideIcon } from 'lucide-react'`
  type-only, or just type your icon prop as `ComponentType<SVGProps<SVGSVGElement>>`.
- **Don't use `bg-zinc-*` or other hardcoded Tailwind colour utilities**
  — use `--scheme-*` so the panel reacts to scheme switches.
- **Don't use `<a href=...>` for internal navigation** — use
  `<Link href=...>` from `@inertiajs/react` so navigation stays
  inside the persistent layout (no full page reload).
