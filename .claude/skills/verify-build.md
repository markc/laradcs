---
name: verify-build
description: The full local CI gate — Pest tests, TypeScript typecheck, Vite build, plus quick smoke tests for the dev server
---

# Verify the build (local CI gate)

Run this gate after any non-trivial change to confirm the kit
still works end-to-end.

## The four checks

### 1. Backend tests

```bash
php artisan test
```

Expected: **26 passed (63 assertions)**. All Fortify auth flows,
profile/password/appearance settings, and the dashboard route.

### 2. TypeScript typecheck

```bash
npx tsc --noEmit
```

There is **no** npm script for typecheck — use `npx tsc` directly.

Pre-existing errors live in:

- `resources/js/pages/welcome.tsx` — JSX intrinsic element noise
  from the upstream React starter kit's heavy welcome page.
- `resources/js/pages/auth/{login,register,reset-password}.tsx` —
  `useForm` generic constraint mismatches from the same upstream.

These predate laradcs's modifications and aren't my problem unless
you specifically touched them. Filter your typecheck output to
just the files you changed:

```bash
npx tsc --noEmit 2>&1 | grep -E "(dcs|theme-context|dual-sidebar|<file-you-edited>)"
```

If your filter returns nothing, you're clean.

### 3. Production Vite build

```bash
npx vite build
```

Expected output ends with `✓ built in <N>ms` (typically 350-450ms
on Vite 8's rolldown backend). Failure modes:

- **Module not found** — usually a missing import or wrong path.
- **Cannot find name `<Icon>`** — lucide-react v1 dropped brand
  icons; see `write-svg-icon.md`.
- **`vite/internal` not found** — the dev-server HMR-after-config-
  edit crash; see `fix-vite-hmr-config-crash.md`.

### 4. (Optional) Manual dashboard smoke test

```bash
composer dev
```

Then visit `http://127.0.0.1:8000/` (vite running on
`http://127.0.0.1:5173/`). Check:

- Welcome page renders (guest landing).
- `/login` accepts admin@example.com / password (per the seeder).
- `/dashboard` renders the DCS shell with hero + 5 sections.
- LHS and RHS sidebars open / pin / scroll.
- Carousel dots cycle panels in both sidebars.
- Theme switching in the Appearance panel updates colours live.
- The Chat panel either talks to Anthropic (if `ANTHROPIC_API_KEY`
  is set in `.env`) or shows a friendly 503 error bubble.

## Verify everything in one shot

```bash
php artisan test && npx tsc --noEmit 2>&1 | grep -v 'welcome.tsx\|auth/login.tsx\|auth/register.tsx\|reset-password.tsx' && npx vite build
```

If all three pass, the kit is healthy.

## Failure recovery

- **Tests fail unexpectedly** — `php artisan migrate:fresh --seed`
  might fix a stale schema. Reseeds admin@example.com / password.
- **Vite build hangs** — kill stale node processes:
  `pkill -f vite; pkill -f node` and retry.
- **`vendor/` is broken** — `rm -rf vendor && composer install`.
- **`node_modules/` is broken** — `rm -rf node_modules && /usr/sbin/bun install`.

## When to run

- Before every commit involving non-trivial code changes
- After every `composer update` or `bun install`
- After fixing a bug — proves the fix didn't regress something else
- Before pushing to main — your last line of defence
