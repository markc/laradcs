# Contributing to laradcs

Thanks for considering a contribution. laradcs is a starter kit
that **aggressively tracks bleeding-edge versions** of every
dependency, and one of its explicit aims is to dogfood the
latest Laravel + Inertia + React stack. Contributions that align
with that posture are very welcome.

## Quick start

1. **Fork** the repo: <https://github.com/markc/laradcs>
2. **Clone** your fork
3. Follow [`docs/INSTALLATION.md`](INSTALLATION.md) Option 3 to
   bootstrap a local dev environment
4. Create a feature branch: `git checkout -b feature/my-thing`
5. Make your changes
6. **Verify the build** — see below
7. **Open a PR** against `main`

## Verify the build before submitting

```bash
php artisan test          # 26/26 should pass
npx tsc --noEmit          # TypeScript clean (filter to your files)
npx vite build            # production build clean
vendor/bin/pint           # PHP formatting
bun run lint              # JS/TS formatting + eslint
```

If all five pass, your PR will be in good shape. The CI workflow
in `.github/workflows/` runs the same checks.

For more detail see [`.claude/skills/verify-build.md`](../.claude/skills/verify-build.md).

## What we welcome

- **Bug fixes** — particularly anything that cleans up edge
  cases in the DCS shell, theme system, or chat panel
- **Accessibility improvements** — keyboard nav, ARIA roles,
  focus management
- **New colour schemes** — see [`add-color-scheme`](../.claude/skills/add-color-scheme.md)
- **New example panels** — anything that demonstrates a useful
  pattern in the DCS shell
- **Documentation improvements** — typo fixes, expanded
  recipes, screenshots
- **Bleeding-edge dep bumps** — ahead-of-the-curve upgrades
  that include the breakage fixes
- **New skills in `.claude/skills/`** — recipes for tasks that
  recur in laradcs development

## What we politely decline

- **Replacing the DCS layout** with a different pattern. If you
  want a different layout, that's a fork, not a contribution.
- **Adding another UI primitive library.** shadcn/ui only.
- **Pinning a dep backwards** to dodge a breaking change. Fix
  forward — see [`upgrade-deps`](../.claude/skills/upgrade-deps.md).
- **Adding HSL or RGB colours to CSS.** OKLCH only — see
  [`css-oklch-only`](../.claude/skills/css-oklch-only.md).
- **Reintroducing the inline `<AppLayout>` anti-pattern** in
  pages. Use the persistent layout static — see
  [`inertia-persistent-layout`](../.claude/skills/inertia-persistent-layout.md).
- **Heavy state libraries** (Redux, Zustand). Inertia shared
  data + React hooks handle everything DCS needs.

## Code style

### TypeScript / React

- **kebab-case file names** (`my-component.tsx`, not
  `MyComponent.tsx`). Matches the upstream Laravel React starter
  kit convention.
- **Default-export** for page and panel components. Named
  exports for hooks and utilities.
- **Theme tokens** via `--scheme-*` CSS variables, never
  hardcoded Tailwind colour utilities like `bg-blue-500`.
- **Inertia `Link`** for internal navigation, never bare `<a>`.
- **Persistent layouts** for every authenticated page (the
  `Page.layout = (page) => ...` static).

### PHP

- **PSR-12** via Laravel Pint (`vendor/bin/pint`). Run before
  committing.
- **Form requests** in `app/Http/Requests/<Resource>/<Action>Request.php`
  for non-trivial validation.
- **Type hints everywhere** — return types on every method,
  parameter types on every argument.

### CSS

- **OKLCH only.** No HSL, no RGB, no hex tokens (raw hex in
  inline JSX style is fine for one-off colours).
- **CSS variables for everything theme-related**, prefixed
  `--scheme-*` to avoid colliding with shadcn's tokens.
- **No `<style>` blocks in JSX**, no inline `style="..."` strings
  in markdown — use Tailwind classes or `--scheme-*` CSS vars.

### Comments

- **Default to no comments.** Code should be self-explanatory.
- **Document the WHY**, not the WHAT, when a comment is
  necessary — non-obvious constraints, hidden invariants,
  workarounds for upstream bugs.
- **Never write XML comments containing `--`** (double-hyphen)
  inside SVG files. The XML spec forbids it and Firefox
  silently degrades the file's render quality.

## Commits

- **One concern per commit.** Don't bundle a feature with a
  formatting cleanup with a dep bump.
- **Conventional commit prefixes** are encouraged but not
  required: `feat:`, `fix:`, `chore(deps):`, `docs:`, `refactor:`.
- **Imperative mood** for the subject line: "Add chat panel"
  not "Added chat panel".
- **Body explains WHY**, not just WHAT. The diff shows the what.
- **Co-author footer** if Claude Code (or any other AI agent)
  helped:
  ```
  Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
  ```

## Pull request template

Title: short, imperative, ≤70 chars

Body:

```markdown
## Summary
- 1-3 bullets on what changed and why

## Test plan
- [ ] `php artisan test` passes
- [ ] `npx vite build` clean
- [ ] Manual smoke test in browser (specify which pages)
- [ ] (Other relevant checks)

## Related
- Closes #<issue>
- See `_journal/YYYY-MM-DD.md` for context

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Journal entries

Significant work sessions should leave a `_journal/YYYY-MM-DD.md`
entry. See [`write-journal-entry`](../.claude/skills/write-journal-entry.md)
for the format. The journal is the audit trail — it captures the
WHY that doesn't fit in commit messages, and the gotchas that
future-you will be grateful for.

## Code of conduct

Be kind. Assume good intent. Critique code, not people. Disagree
respectfully. We follow the [Contributor Covenant](https://www.contributor-covenant.org/).

## Licence

By contributing, you agree your contributions will be licensed
under the same MIT licence as laradcs itself.
