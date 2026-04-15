---
name: bump-laravel-major
description: Bump Laravel framework to a new major version (e.g. 13 → 14) — handles tinker, fortify, inertia-laravel, and other Laravel-package compatibility constraints
---

# Bump Laravel to a new major version

When a new Laravel major releases, follow this loop. The trick
is that several Laravel-maintained packages (Tinker, Fortify,
Pail, Sail, Pint, etc.) need their own bumps to be compatible —
composer's resolver will refuse to upgrade Laravel if any of
them lock the old `illuminate/support` constraint.

## Steps

### 1. Inventory the current state

```bash
composer show laravel/framework laravel/tinker laravel/fortify \
    laravel/pail laravel/pint laravel/sail \
    inertiajs/inertia-laravel tightenco/ziggy 2>&1 | grep -E "^name|^versions"
```

This shows what's installed and what versions are available.

### 2. Edit composer.json

Bump `php` and `laravel/framework`:

```json
"require": {
    "php": "^8.4",
    "laravel/framework": "^14.0",
    ...
}
```

Check the new Laravel's PHP requirement at packagist:

```bash
curl -fsSL https://repo.packagist.org/p2/laravel/framework.json \
    | python3 -c "
import json,sys
d=json.load(sys.stdin)
for p in d['packages']['laravel/framework'][:3]:
    print(p['version'], '— PHP:', p.get('require',{}).get('php','?'))
"
```

### 3. First attempt at update

```bash
composer update -W
```

This will likely FAIL with a constraint error. Read it carefully
— the resolver tells you which transitive dep is blocking. Common
culprits:

- **`laravel/tinker` ^2.x** can't satisfy ^L13/^L14 → bump to ^3.0
- **`inertiajs/inertia-laravel` ^2.x** can't satisfy ^L13 → bump to ^3.0
- **`pestphp/pest` ^2.x** can't satisfy newer phpunit → bump to ^3.x

For each blocker, edit composer.json to bump it, then re-run
`composer update -W`. Repeat until it resolves.

### 4. Read the upgrade guide

Visit `https://laravel.com/docs/<new-version>/upgrade` and skim
the "Impact: High" sections. Common Laravel major changes:

- **Removed deprecated APIs** — Eloquent methods, Carbon helpers
- **Renamed config files** — verify `config/*` doesn't reference
  removed config keys
- **Middleware aliases** — `app/Http/Kernel.php` (or the
  bootstrap/app.php in modern Laravel) may need updates
- **Route helper changes** — `route('name')` signature, etc.

### 5. Run the test suite

```bash
php artisan test
```

Tests will catch most breakage. For each failure, fix the code
to match the new API. **Don't** silence the test or pin
backwards.

### 6. PHP version deprecations

If the bump came with a PHP minimum bump (e.g. 8.3 → 8.4 or 8.5),
PHP itself may deprecate things in your config:

```bash
php artisan test 2>&1 | grep -i "deprecated\|deprecation"
```

Example: PHP 8.5 deprecated `PDO::MYSQL_ATTR_SSL_CA` →
`Pdo\Mysql::ATTR_SSL_CA`. Fix in `config/database.php`:

```php
'options' => extension_loaded('pdo_mysql') ? array_filter([
    Pdo\Mysql::ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
]) : [],
```

### 7. Bump and verify

```bash
composer bump        # tighten constraints to installed versions
composer dump-autoload
php artisan about    # confirm Laravel version reports correctly
php artisan test     # one more pass — should be clean
npx vite build       # ensure the JS side still builds
```

### 8. Commit as a focused upgrade

```
chore(deps): Laravel <X> + <related composer bumps>

- Bump laravel/framework ^<old> -> ^<new>
- Bump laravel/tinker ^<old> -> ^<new> for Laravel <X> compatibility
- ...
- <breakage fix 1>
- <breakage fix 2>

Tests: 26/26 pass. composer bump tightened all constraints.
```

## Reference: the laradcs L12 → L13 bump

In commit `0ee3434` we did exactly this loop: bumped
`laravel/framework: ^12 → ^13.5`, also bumped `laravel/tinker:
^2.10 → ^3.0.2` (its old constraint blocked L13's resolver),
fixed `config/database.php` for PHP 8.5's PDO deprecation, and
no other breakage. 26/26 tests pass after.

The journal entry is at `_journal/2026-04-15.md`.

## Don't

- Don't bump only `laravel/framework` and leave the related
  packages — the resolver will rage and you'll be confused
- Don't skip the upgrade guide
- Don't ignore deprecation warnings in test output — they're
  free intelligence about future-breaking patterns
