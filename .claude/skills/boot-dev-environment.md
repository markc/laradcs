---
name: boot-dev-environment
description: Boot the laradcs dev environment from a fresh clone — install deps, set up database, seed admin user, start vite + artisan
---

# Boot the dev environment

For a brand new clone of laradcs, or a freshly-restored backup,
follow these steps to get to a working dev server.

## Steps

### 1. PHP deps

```bash
composer install
```

Installs Laravel, Inertia, Fortify, laravel/ai, laravel/mcp,
all the dev tooling. Should complete with "Generating optimized
autoload files" and no errors.

### 2. Environment

```bash
cp .env.example .env
php artisan key:generate
```

This creates `.env` with a fresh `APP_KEY`. The `.env.example`
already has sensible defaults: `APP_NAME=Laravel`, sqlite,
local debug. Edit if you need to.

**Optional but recommended:** drop a real Anthropic API key in
`.env` so the chat panel works:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Without it the chat panel renders but every message gets a
friendly 503 error bubble.

### 3. Database

```bash
touch database/database.sqlite       # if it doesn't already exist
php artisan migrate --seed
```

The seeder creates `admin@example.com` / `password` (see
`database/seeders/DatabaseSeeder.php`). Use those creds to log in.

### 4. JS deps

```bash
/usr/sbin/bun install
```

Use `/usr/sbin/bun` not bare `bun` — the user's `~/.bun/bin/bun`
is a dead symlink on cachyos. See `verify-build.md` for the
background.

Alternative: `npm install` works too. The kit is package-manager-
neutral.

### 5. Start the dev server

```bash
composer dev
```

This runs `php artisan serve` on `127.0.0.1:8000` and `npx vite`
on `127.0.0.1:5173` together via `concurrently`. Both terminals'
output shows up colourised.

**Visit** `http://127.0.0.1:8000/` — should show the welcome page.
Click "Log in", use admin@example.com / password, and you'll land
on the dashboard inside the DCS shell.

### 6. (Optional) Visual smoke test

- Welcome page renders with full hero
- Login redirects to dashboard
- Dashboard hero animates the shimmer wordmark
- Both sidebars open / close via the hamburger buttons
- Carousel dots cycle panels
- Theme picker switches schemes live
- Chat panel (R1) accepts input (errors with 503 if no API key)

If any step fails, see `verify-build.md` for the recovery path.

## Common boot failures

### "Class not found" after composer install

Run `composer dump-autoload` and retry.

### Vite errors immediately on start

See `fix-vite-ipv6-binding.md` (config has been fixed in laradcs
already, but if you've checked out an old branch this may apply).

### "These credentials do not match our records" on login

The browser is autofilling an old saved password. Open the field,
clear it, type `password` manually. Or use the eye-icon toggle
on the login form to confirm what's in the field before submitting.
The seeder default is the literal word `password`.

### Black screen on dashboard

Vite dev server isn't reachable. Check `public/hot` — should
contain `http://127.0.0.1:5173`, NOT `http://[::1]:5173`. If
IPv6, see `fix-vite-ipv6-binding.md`.
