---
name: inertia-persistent-layout
description: Why every page in laradcs uses Inertia's Page.layout = ... static form, and how to recognise the wrong pattern
---

# Inertia persistent layouts

Every authenticated page in laradcs uses Inertia's **persistent
layout** pattern via the `Page.layout = (page) => ...` static form.
This is **non-negotiable** because the wrong pattern remounts the
DCS shell on every navigation, defeating the persistent sidebars.

## The right pattern

```tsx
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div>{/* page content */}</div>
        </>
    );
}

Dashboard.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
```

The static `.layout` property is what Inertia inspects. If
present, it treats the layout as **persistent** — only the inner
page content swaps on navigation, the layout (and ThemeProvider,
sidebars, Chat panel state, etc.) stay mounted.

## The wrong pattern (anti-pattern)

```tsx
// ❌ DO NOT WRITE THIS
export default function Dashboard() {
    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div>...</div>
        </AppLayout>
    );
}
```

The `<AppLayout>` element is created fresh inside `return()` on
every render, and Inertia treats it as part of the page component.
Every navigation creates a new AppLayout React element, which
unmounts the old AppLayout (with all its state) and mounts a new
one. **The visual effect is a full page flash** — sidebars
collapse and re-expand, ThemeProvider re-reads localStorage, chat
panel scrollback resets, etc.

The Laravel React starter kit ships with this anti-pattern. Every
page in laradcs has been converted. Don't reintroduce it.

## How to recognise the wrong pattern

Grep for it:

```bash
grep -lE '<AppLayout' resources/js/pages/
```

Any file listed should be checked. If the JSX has
`<AppLayout>{children}</AppLayout>` inside the component body
(rather than the `Page.layout = ...` static), it's wrong.

## How to convert a page

1. Move the `<AppLayout>` wrapper out of the `return()` JSX. Wrap
   the returned content in a fragment `<>...</>` instead.
2. Add the static layout assignment at the bottom of the file:
   ```tsx
   PageName.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
   ```
3. Ensure `import type { ReactNode } from 'react'` is at the top.
4. Verify with `npx vite build` and visual smoke test — navigate
   to the page from another page and confirm there's no shell
   flash.

## Pages currently using the persistent pattern

- `resources/js/pages/dashboard.tsx`
- `resources/js/pages/settings/profile.tsx`
- `resources/js/pages/settings/password.tsx`
- `resources/js/pages/settings/appearance.tsx`

`resources/js/pages/welcome.tsx` is the **exception** — it's the
guest landing page with its own full markup, deliberately NOT
inside `AppLayout`. Auth pages (`pages/auth/*`) use `AuthLayout`
inline (not `AppLayout`); they could be converted to persistent
form too if you're refactoring.

## Why this matters

The DCS shell holds:
- Carousel state (which panel is active per side)
- Pin/unpin state (per side)
- Sidebar width (slider in appearance panel)
- Theme (light/dark)
- Scheme (ocean/crimson/...)
- Chat panel scrollback and message history

All of that is in React state inside `ThemeProvider` and
`ChatPanel`. Remounting the layout wipes those state values
back to defaults (or back to localStorage). The persistent layout
pattern is the only thing keeping them alive across nav.
