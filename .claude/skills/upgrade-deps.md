---
name: upgrade-deps
description: The canonical bleeding-edge upgrade loop for laradcs — composer + bun + fix-forward, never pin backwards
---

# Upgrade dependencies (bleeding-edge dogfooding)

laradcs's explicit policy is to **track latest released majors of
every dep and fix code forward when bumps break things**. Never
pin backwards to dodge a breaking change unless the upstream itself
is broken. See the "Bleeding-edge tracking" section in `CLAUDE.md`.

## The 4-step loop

### 1. JS deps (full latest)

```bash
npx npm-check-updates --target latest -u
/usr/sbin/bun install
```

`ncu --target latest -u` rewrites `package.json` to the absolute
latest of every dep including major bumps. **Do not use** the
default ncu target (`latest` minor only) — that misses majors.

### 2. PHP deps (composer)

For minor/patch bumps only:

```bash
composer update -W
```

For major bumps, **edit `composer.json` first** by hand to raise
the constraint (e.g. `"laravel/framework": "^12.0"` →
`"^13.0"`), then run `composer update -W`.

After the update settles, lock the constraints to the actually-
installed versions:

```bash
composer bump
```

This rewrites `composer.json` so the constraints are floors
matching what's installed, not the loose `^N.0` ranges you typed.

### 3. Verify the build

See `verify-build.md` for the full gate, but the short version:

```bash
php artisan test         # 26/26 should pass
npx vite build           # should compile clean
npx tsc --noEmit         # should pass on new files
```

### 4. Fix the breakage

Major bumps WILL break things. The known patterns:

- **Removed APIs** — search the codebase for the old name and
  replace with the new one. Example: `lucide-react` v1 dropped
  brand icons; the fix was an inline `GithubIcon` component (see
  `write-svg-icon.md`), NOT pinning to v0.475.
- **Renamed methods** — most majors include a CHANGELOG.md or
  UPGRADE.md in the package; read it before guessing.
- **Deprecated PHP constants** — example: PHP 8.5 deprecated
  `PDO::MYSQL_ATTR_SSL_CA` → `Pdo\Mysql::ATTR_SSL_CA`. Fix in
  `config/database.php` rather than silencing the warning.
- **Vite/build tool config drift** — example: Vite 8 changed the
  default server host to IPv6. See `fix-vite-ipv6-binding.md`.

### 5. Commit as a focused upgrade

One commit per upgrade group:

- `chore(deps): Laravel <X> + <related composer bumps>`
- `chore(deps): <core JS framework bump> + <breakage fixes>`

Include the breakage notes in the commit body. Include WHY the fix
works, not just what — future you needs to understand.

## Known sharp edges

- **`composer bump` doesn't unconstraint** — if you start with
  `^12.0` and update to 13.5, then `composer bump`, you'll get
  `^13.5`. Good. But if you start with `~12.0` (tilde) and update,
  you'll get `~13.0` which doesn't allow further patch bumps.
  Stick with caret `^`.
- **JS `bun.lock` is gitignored** — `.gitignore` has `/bun.lock`,
  `/package-lock.json`, `/yarn.lock`. The kit is package-manager-
  neutral; consumers pick. Don't commit lockfiles.
- **`/usr/sbin/bun` not bare `bun`** — on cachyos the user's
  `~/.bun/bin/bun` is a dead symlink. Always use `/usr/sbin/bun`
  explicitly, or use `npx vite` directly.

## When to skip

- **Right before a release tag** — freeze deps in the days before
  cutting v1.0.0. Bleeding-edge during dev, stable during release.
- **When CI is red** — fix the existing red before bumping more.

## Don't

- Don't pin a dep backwards to dodge a breaking change unless the
  upstream is itself broken.
- Don't bump only some deps "selectively" — bump in groups so the
  composer.lock and bun.lock evolve coherently.
- Don't forget `composer bump` after a manual major edit. The
  constraint and the lock will drift if you skip it.
