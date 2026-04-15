---
name: add-shadcn-primitive
description: Add a shadcn/ui primitive to resources/js/components/ui/, including Radix peer dep install
---

# Add a shadcn/ui primitive

The kit ships a curated subset of shadcn/ui primitives under
`resources/js/components/ui/`. New primitives are copy-paste from
ui.shadcn.com — they are NOT a dependency, they live in the
consumer's project. shadcn/ui is also the **only** UI primitive
library laradcs uses; do not introduce another (per CLAUDE.md).

## Steps

### 1. Pick the primitive

Browse ui.shadcn.com/docs/components and pick what you need.
Examples already in the kit: button, input, label, dialog,
dropdown-menu, tooltip, etc.

### 2. Install the Radix peer dep

shadcn/ui primitives are wrappers around Radix UI. Each primitive's
docs page lists the Radix package it needs. Install it via:

```bash
/usr/sbin/bun add @radix-ui/react-<primitive-name>
```

(Use `/usr/sbin/bun` not bare `bun` — see `verify-build.md` for
why the cachyos `~/.bun/bin/bun` symlink is dead.)

### 3. Copy the source

Visit `https://ui.shadcn.com/docs/components/<name>` and copy the
TSX source from the "Copy" button.

Save it to:

```
resources/js/components/ui/<name>.tsx
```

**File naming: kebab-case `.tsx`** matching the rest of the kit.
The shadcn docs sometimes use kebab-case file names, sometimes
not — match laradcs's convention regardless.

### 4. Adjust import paths

shadcn/ui uses `@/lib/utils` for `cn()`, which laradcs already
exports from `resources/js/lib/utils.ts`. The `@/` alias is set up
in `tsconfig.json` and `vite.config.js`. Imports should "just work"
— double-check the `cn` import resolves.

### 5. Theme awareness

Shadcn primitives use the `--background`, `--foreground`,
`--primary`, etc. tokens that live in `resources/css/app.css`.
These are **distinct** from the DCS `--scheme-*` tokens. shadcn
primitives will adopt light/dark mode but NOT the active scheme.

If you want a primitive to react to the scheme accent (e.g. a
custom `Button` variant that uses the scheme accent colour),
override the colour via inline `style` referencing
`var(--scheme-accent)`:

```tsx
<Button style={{ background: 'var(--scheme-accent)', color: 'var(--scheme-accent-fg)' }}>
    Scheme-aware button
</Button>
```

### 6. Verify

```bash
npx vite build
npx tsc --noEmit
```

Both should be clean. Then drop the new primitive into a panel or
page and reload.

## Don't

- Don't install another component library (Material UI, Mantine,
  etc.). shadcn primitives only.
- Don't modify primitive source after install unless you really
  need to — staying close to upstream makes future shadcn
  re-installs easy.
- Don't use the shadcn CLI (`bunx shadcn-ui add ...`) without
  inspecting what it does — it modifies tsconfig and may rewrite
  `lib/utils.ts`. Manual copy is safer for an existing project.
