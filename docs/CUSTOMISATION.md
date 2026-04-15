# Customisation

laradcs is a starter kit, not a runtime library — you own every
file the moment you clone it. This document covers the most common
customisations.

For step-by-step recipes (each ~50-150 lines, action-oriented),
see the **`.claude/skills/`** directory. Claude Code loads them
automatically when you ask for a relevant task.

## Common tasks

| I want to... | See |
|---|---|
| Add a sidebar panel | [`add-dcs-panel`](../.claude/skills/add-dcs-panel.md) |
| Add a colour scheme | [`add-color-scheme`](../.claude/skills/add-color-scheme.md) + [`THEMING.md`](THEMING.md) |
| Add a new authenticated page | [`add-inertia-page`](../.claude/skills/add-inertia-page.md) |
| Add a route + controller | [`add-route-controller`](../.claude/skills/add-route-controller.md) |
| Add an LLM tool to the chat | [`add-laravel-ai-tool`](../.claude/skills/add-laravel-ai-tool.md) |
| Add a shadcn primitive | [`add-shadcn-primitive`](../.claude/skills/add-shadcn-primitive.md) |
| Add a brand icon (lucide v1 dropped them) | [`write-svg-icon`](../.claude/skills/write-svg-icon.md) |
| Upgrade dependencies | [`upgrade-deps`](../.claude/skills/upgrade-deps.md) |
| Bump a Laravel major version | [`bump-laravel-major`](../.claude/skills/bump-laravel-major.md) |

## Sidebar panel layout

The DCS shell hosts up to 8 panels per side via carousels. The
defaults that ship with the kit:

**Left sidebar:**
1. `nav-panel` — dcs.spa-style anchor nav (Home, GitHub, Features, Architecture, Color Schemes, Components, Usage)
2. `about-panel` — links to dcs.spa, docs, motd.com, renta.net, SPE
3. `app-panel` — Dashboard, Profile, Password, Appearance

**Right sidebar:**
1. `chat-panel` — Anthropic Haiku chat via `laravel/ai`
2. `theme-panel` — light/dark, slide/fade, scheme picker, sidebar width slider
3. `components-panel` — anchor nav for the dashboard's marketing sections
4. `user-panel` — user menu

To remove a panel: delete its entry from `leftPanels` or
`rightPanels` in `resources/js/layouts/app/app-dual-sidebar-layout.tsx`,
then optionally delete the unused `*-panel.tsx` file.

To reorder: just rearrange the array entries. The `L1:`/`R1:`
prefix on the label is purely cosmetic for ordering and is
stripped from the rendered title.

## Themes

The five OKLCH schemes are defined in
`resources/css/dcs/tokens.css`. To customise:

- **Tweak an existing scheme:** edit the OKLCH values for that
  scheme's `.scheme-<name>` and `.dark.scheme-<name>` blocks.
  All `--scheme-*` tokens auto-propagate to every component
  using them.
- **Add a new scheme:** see
  [`add-color-scheme`](../.claude/skills/add-color-scheme.md).
- **Replace the default:** change `defaults.scheme` in
  `theme-context.tsx`. New users see this scheme on first load.

The OKLCH-only rule is **non-negotiable** — see
[`css-oklch-only`](../.claude/skills/css-oklch-only.md).

## Hero background image

The dashboard's fixed background (`public/Server_Room_Dark.webp`)
is applied via `body.dcs-shell` in
`resources/css/dcs/components.css`. To replace it:

1. Drop your image at `public/<your-image>.webp` (or .jpg/.png)
2. Update `body.dcs-shell { background-image: url('/<your-image>.webp'); }`
3. The dark overlays on `.hero-bg::before` and
   `.bg-image-section::before` (currently 0.6 / 0.5 alpha black)
   may need adjusting depending on your image's contrast

## Auth

laradcs uses **Laravel Fortify** for auth. The defaults are:

- Email + password login
- Registration with email verification (configurable in
  `config/fortify.php`)
- Password reset via email
- Profile updates (in `app/Http/Controllers/Settings/`)
- Two-factor auth available via Fortify (not wired into the UI
  yet — extension opportunity)

To customise:
- Change which Fortify features are enabled in
  `config/fortify.php`
- Custom validation in `app/Actions/Fortify/`
- Custom redirects via the Fortify provider

## Authentication-gated pages

Inside `routes/web.php`:

```php
Route::middleware(['auth'])->group(function () {
    // your routes here
});
```

Inside `routes/settings.php` and `routes/auth.php`:
shipped as separate route files; auth.php has registration and
login routes, settings.php has profile/password/appearance.

## The chat panel

The right sidebar's R1 panel is a working Anthropic Haiku chat
implementation. To customise:

- **Change the model:** edit `app/Http/Controllers/ChatController.php`
  and change `model: 'claude-haiku-4-5'` to any supported Claude
  model (or any provider supported by `laravel/ai` — OpenAI,
  Gemini, Groq, Mistral, etc.).
- **Change the system prompt:** edit the `instructions:` arg.
- **Add tools:** see [`add-laravel-ai-tool`](../.claude/skills/add-laravel-ai-tool.md).
- **Use a different provider:** add the provider's API key to
  `.env` and reference it in the `agent()` call. `laravel/ai`'s
  `config/ai.php` lists all supported providers.
- **Disable entirely:** delete `chat-panel.tsx` from the
  `rightPanels` array in `app-dual-sidebar-layout.tsx`. The
  `/chat` route can be removed from `routes/web.php` too.

## File naming conventions

- **React components:** `kebab-case.tsx` (matches upstream
  Laravel React starter kit, NOT PascalCase)
- **PHP classes:** `PascalCase.php`
- **Route files:** `lower-case.php`
- **Markdown docs:** `YYYY-MM-DD-lower-case-title.md` for `_doc/`
  and `_journal/`, plain UPPERCASE for `docs/`

## What NOT to customise

(per the kit's design philosophy — see CLAUDE.md)

- **Don't replace the DCS layout** with a different pattern.
  Wrap a page in a different page-level layout if needed.
- **Don't introduce another UI library** (Material UI, Mantine,
  etc.). shadcn/ui primitives only.
- **Don't add HSL or RGB to CSS.** OKLCH only.
- **Don't reintroduce the inline `<AppLayout>` wrap pattern** —
  use the persistent layout static instead. See
  [`inertia-persistent-layout`](../.claude/skills/inertia-persistent-layout.md).
- **Don't pin a dependency backwards** to dodge a breaking change.
  Fix code forward — see [`upgrade-deps`](../.claude/skills/upgrade-deps.md).

## Where to ask for help

- **Issues:** [github.com/markc/laradcs/issues](https://github.com/markc/laradcs/issues)
- **Discussions:** [github.com/markc/laradcs/discussions](https://github.com/markc/laradcs/discussions)
- **dcs.spa reference implementation:** <https://dcs.spa>
