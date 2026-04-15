---
name: add-inertia-page
description: Add a new authenticated Inertia page that lives inside the DCS shell using the persistent layout pattern
---

# Add a new Inertia page inside the DCS shell

Every authenticated page in laradcs renders inside the DCS dual
sidebar layout via Inertia's **persistent layout** pattern. This
matters because the wrong-pattern (`<AppLayout>{children}</AppLayout>`
inline) remounts the entire layout on every navigation, which
defeats the persistent sidebars and looks like a full page reload.

## The persistent layout pattern

```tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'My Page', href: '/my-page' },
];

export default function MyPage() {
    return (
        <>
            <Head title="My Page" />
            <div className="px-4 py-6">
                <h1 className="text-2xl font-bold">My Page</h1>
                {/* page content */}
            </div>
        </>
    );
}

MyPage.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
```

**Critical:** the static `.layout` property on the function. Inertia
detects this and treats the layout as persistent — only the inner
page swaps on navigation, the AppLayout, ThemeProvider, and sidebars
all stay mounted.

## Anti-pattern to avoid

```tsx
// ❌ DO NOT DO THIS — remounts the layout on every navigation
export default function MyPage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Page" />
            <div>...</div>
        </AppLayout>
    );
}
```

The Laravel React starter kit ships with the wrong pattern. Every
page in laradcs has been converted to the static-layout form —
match that, don't reintroduce the inline-wrap.

## Steps

### 1. Create the page component

File: `resources/js/pages/<name>.tsx` (or
`resources/js/pages/<group>/<name>.tsx` for nested routes)

Use the template above. **No padding wrapper** — the DCS layout's
`<main>` is full-bleed by design (so the dashboard hero can be
edge-to-edge). Add your own `px-4 py-6` if you want a contained
layout, or use `SettingsLayout` if it's a settings page.

### 2. Register the route

File: `routes/web.php`

Inside the `Route::middleware(['auth'])->group(...)` block:

```php
Route::get('my-page', function () {
    return Inertia::render('my-page');
})->name('my-page');
```

For controller-based routes, see `add-route-controller.md`.

### 3. Add a nav link

File: `resources/js/components/dcs/panels/app-panel.tsx`

Add an entry to the appropriate group in `groups` so the page is
reachable from the LHS App panel:

```tsx
items: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Page', href: '/my-page', icon: SomeIcon },
    // ...
],
```

### 4. Verify

```bash
npx vite build
php artisan test
```

Then start `composer dev`, log in, click the nav link. The sidebars
should NOT visibly remount (no flash) — only the main content area
should swap. Open dev tools Network tab and confirm the request is
an Inertia XHR (`X-Inertia: true`), not a full document load.

## When NOT to use AppLayout

- **Guest pages** (login, register, welcome) — use `AuthLayout` instead
- **Pages with intentionally different chrome** (full-screen viewer,
  print view) — define a new layout component and reference it via
  `MyPage.layout = (page) => <PrintLayout>{page}</PrintLayout>`
