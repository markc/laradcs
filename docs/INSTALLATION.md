# Installation

laradcs is a Laravel starter kit. Installing it means cloning the
repository into a new project directory — there is no runtime
dependency on `markc/laradcs`. You own every file from day one.

## Requirements

- **PHP 8.3+** (tested on 8.5)
- **Composer 2.x**
- **Node 20+** or **Bun 1.x**
- **SQLite, MySQL, MariaDB, or PostgreSQL** (SQLite is default)
- *(Optional)* **`ANTHROPIC_API_KEY`** for the dashboard chat panel

## Option 1 — Composer (works today)

```bash
composer create-project markc/laradcs my-app
cd my-app
bun install            # or: npm install
bun run dev            # or: npm run dev
```

In another terminal:

```bash
php artisan serve
```

Visit <http://127.0.0.1:8000>. Default login is
`admin@example.com` / `password` (set in `database/seeders/DatabaseSeeder.php`).

## Option 2 — Laravel installer (community starter kit)

```bash
laravel new my-app --using=markc/laradcs
```

> **Note:** the `--using=` form requires laradcs to be listed in
> the official Laravel community starter kits registry. This is
> available from v1.0.0 onward. Until then, use Option 1.

## Option 3 — Git clone (for tinkerers)

```bash
git clone https://github.com/markc/laradcs my-app
cd my-app
cp .env.example .env
composer install
bun install            # or: npm install
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
bun run dev            # or: npm run dev
```

In another terminal: `php artisan serve`. Visit <http://127.0.0.1:8000>.

## Composer dev script

For a single-command dev environment, laradcs ships a
`composer dev` script that runs `php artisan serve` and
`npx vite` together via `concurrently`:

```bash
composer dev
```

This is the recommended way to develop. `Ctrl+C` stops both.

## Database setup

The default `.env.example` uses SQLite — zero-config and works
on any machine without a separate DB server:

```env
DB_CONNECTION=sqlite
```

To use MySQL/MariaDB/PostgreSQL instead, edit `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laradcs
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

Then run `php artisan migrate --seed` to bootstrap.

## The Anthropic chat panel

The dashboard's right sidebar includes a chat panel that calls
**Claude Haiku** via the first-party `laravel/ai` SDK. To enable
it, drop your Anthropic API key in `.env`:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

Get a key at <https://console.anthropic.com>. Without it the
panel renders but every message returns a friendly 503 error
bubble.

## Verifying the install

```bash
php artisan test          # 26 tests should pass
npx vite build            # production assets build
php artisan about         # confirm Laravel 13.5, PHP 8.3+
```

If all three are clean, the install is healthy.

## Troubleshooting

### "These credentials do not match our records" on first login

Browser autofill is filling in an old saved password. Clear the
field and type `password` manually. The login form has an
eye-icon toggle that shows what's actually in the field — use
it to confirm.

### Black/blank dashboard after upgrade

Vite 8 changed its dev server default to IPv6-only `[::1]:5173`
which is unreachable from `127.0.0.1`. The kit's `vite.config.js`
already pins `server.host: '127.0.0.1'`. If you're seeing this,
restart `composer dev` after editing the config.

### `lucide-react` import errors after upgrading

Lucide v1 dropped brand icons (GitHub, Discord, X, etc.). The
kit replaces the GitHub usage with an inline SVG at
`resources/js/components/icons/github-icon.tsx`. If you upgrade
lucide and import a brand icon you need, write your own inline
SVG component in the same directory.

### `composer dev` says `vite: command not found`

Your Bun shim can't resolve `node_modules/.bin/vite`. The fixed
`composer.json` calls `npx vite` directly to avoid this. Pull
the latest.

## Next steps

- See [`DCS-ARCHITECTURE.md`](DCS-ARCHITECTURE.md) for how the
  layout works.
- See [`CUSTOMISATION.md`](CUSTOMISATION.md) for adding panels,
  pages, and tools.
- See [`THEMING.md`](THEMING.md) for the OKLCH token system and
  adding new colour schemes.
- See `.claude/skills/` for runnable recipes for common tasks.
