---
name: fix-vite-hmr-config-crash
description: Recover when editing vite.config.js crashes the running dev server with "vite/internal is not defined"
---

# Fix Vite 8 HMR config-reload crash

## Symptom

While `composer dev` is running, you edit `vite.config.js`. The
vite output shows:

```
[vite] vite.config.js changed, restarting server...
[vite] failed to load config from /home/.../vite.config.js
[vite] Package subpath './internal' is not defined by "exports" in
       /home/.../node_modules/vite/package.json imported from
       node_modules/@vitejs/plugin-react/dist/index.js
[vite] server restart failed
```

The dev server stops working. Hot reload stops. Browser shows
stale assets.

## Cause

Vite 8's HMR-on-config-change path has a bug where it reuses
cached module state. `@vitejs/plugin-react@6.x` imports
`vite/internal` (which is a valid export in vite 8.0.8), but the
restart path gets confused about the module registry and reports
the export as undefined. First-time boot is fine; the issue is
ONLY with the reload-on-config-change path.

## Fix

Restart the dev server cleanly:

1. **Ctrl+C** in the terminal where `composer dev` is running —
   this kills both `php artisan serve` AND `vite` together (they
   are managed by `concurrently`).
2. Run `composer dev` again.

Fresh boot avoids the broken HMR path. Subsequent edits to source
files (TSX/PHP) will hot-reload normally. Only editing
`vite.config.js` triggers the crash.

## Why not work around it

- Pinning vite back to 7.x violates the bleeding-edge dogfooding
  policy and would block other Vite 8 benefits (rolldown backend,
  370ms production builds).
- Patching `@vitejs/plugin-react` would break on the next bump.
- The bug is upstream and minor (one Ctrl+C and re-run).

If this becomes painful, watch for the upstream fix in
`@vitejs/plugin-react` 6.x or vite 8.x patch releases.

## Avoid by

- Editing `vite.config.js` BEFORE starting `composer dev` for the
  session
- Or use `npx vite` directly when iterating on the config so a
  crash is just a single-process restart, not a concurrently
  re-orchestration

## Related

- `verify-build.md` — production `npx vite build` is unaffected
  by this bug (it's only the dev server HMR path)
- `fix-vite-ipv6-binding.md` — the OTHER vite 8 sharp edge
