---
name: fix-vite-ipv6-binding
description: Fix the Vite 8 IPv6-only default that breaks the dev server when php artisan serve is IPv4-only
---

# Fix Vite 8's IPv6-only dev server binding

## Symptom

After bumping to Vite 8, browsing `http://127.0.0.1:8000/` shows
a **black/blank screen**. View source shows `<div id="app"></div>`
with no rendered content. The HTML references the Vite client at
`http://[::1]:5173/@vite/client` — an IPv6 URL.

The browser fails to fetch the Vite assets because:
- `php artisan serve` listens on **IPv4** (`127.0.0.1:8000`)
- `vite` listens on **IPv6** (`[::1]:5173`)
- Mixed-origin or CSP issues prevent the IPv6 fetch from the IPv4
  page

## Cause

Vite 8 changed the dev server's default `server.host` from
`127.0.0.1` to `[::1]` (IPv6 localhost) as part of its IPv6-first
posture. Vite 7 and earlier defaulted to IPv4.

## Fix

File: `vite.config.js`

Pin the host explicitly to `127.0.0.1`:

```js
export default defineConfig({
    server: {
        host: '127.0.0.1',
    },
    plugins: [
        // ...
    ],
});
```

This is already in laradcs's `vite.config.js` — if you're seeing
the bug, either you're working from an older branch or someone
removed the override. Restore it.

## After the fix

1. Restart the dev server (`Ctrl+C` `composer dev`, then
   `composer dev` again).
2. The `public/hot` file should now contain
   `http://127.0.0.1:5173`, not `http://[::1]:5173`.
3. Hard-refresh the browser. The dashboard should render.

## Alternative

Pin to `0.0.0.0` if you want vite reachable from other devices on
your LAN (e.g. mobile testing). Don't use that on a public
network — vite has no auth.

## Don't

- Don't try to make `php artisan serve` listen on IPv6 — that
  works but adds zero value and creates a different mismatch (the
  browser may still resolve `localhost` to IPv4 on some systems).
- Don't disable IPv6 on the OS — too invasive, breaks unrelated
  things.
- Don't downgrade Vite to 7.x — bleeding-edge dogfooding policy
  says fix forward.

## Related

- `fix-vite-hmr-config-crash.md` — the OTHER vite 8 sharp edge
- `verify-build.md` — production builds aren't affected by this,
  only the dev server
