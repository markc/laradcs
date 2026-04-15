# laradcs Claude Code skills

Project-specific skills loaded by Claude Code when working on this
repository. Each `.md` file in this directory is a self-contained
recipe for a recurring task — **add a panel**, **bump dependencies**,
**recover after a `git filter-repo`**, etc.

The frontmatter `description` field is what Claude Code's skill
loader matches against incoming user requests, so keep them
specific. Skills are deliberately **terse and action-oriented** —
they exist to be read fully into context, not skimmed.

## Index

### Build skills (the "self-building" half)

| File | What it does |
|---|---|
| `add-dcs-panel.md` | Add a new sidebar carousel panel and register it |
| `add-color-scheme.md` | Add a sixth (or nth) OKLCH colour scheme to the theme system |
| `add-inertia-page.md` | Add a new authenticated Inertia page that lives inside the DCS shell |
| `add-route-controller.md` | Add a new Laravel route + controller pair |
| `add-laravel-ai-tool.md` | Define a `Laravel\Ai\Contracts\Tool` for the chat panel agent |
| `add-shadcn-primitive.md` | Add a shadcn/ui primitive to `resources/js/components/ui/` |
| `write-svg-icon.md` | Hand-write an inline SVG icon component |

### Heal skills (the "self-healing" half)

| File | What it does |
|---|---|
| `upgrade-deps.md` | The canonical bleeding-edge upgrade loop (composer + bun + fix-forward) |
| `verify-build.md` | The full local CI gate — tests, typecheck, vite build |
| `fix-vite-hmr-config-crash.md` | Recover when editing `vite.config.js` crashes the dev server |
| `fix-after-filter-repo.md` | Recover uncommitted edits after `git-filter-repo` resets the working tree |
| `fix-vite-ipv6-binding.md` | Vite 8's IPv6-only default vs IPv4 `php artisan serve` |

### Convention skills (the "memory" half)

| File | What it does |
|---|---|
| `inertia-persistent-layout.md` | Why and how every page must use `Page.layout = (page) => ...` |
| `css-oklch-only.md` | Guardrail: never add HSL/RGB to CSS, always use OKLCH tokens |
| `write-journal-entry.md` | Append-style journal format and the "read last 3 on startup" rule |

## Conventions for writing new skills

- **Frontmatter:** `name`, `description`. The description should answer
  "when should this skill be loaded?" in one sentence.
- **Imperative voice:** "Run X", "Edit Y", not "You should run X".
- **Exact paths and snippets** — not "the layout file", but
  `resources/js/layouts/app/app-dual-sidebar-layout.tsx`.
- **End with verification** — every skill that mutates files should
  finish with a "verify" step that proves the change worked.
- **Reference, don't duplicate** — link to other skills for shared
  steps rather than copying.

## What's NOT a skill

- One-off bug fixes (those go in the journal)
- Generic Laravel/React knowledge (Claude already has it)
- Anything covered exhaustively in CLAUDE.md (link to it instead)
