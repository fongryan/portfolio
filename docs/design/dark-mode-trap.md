# Design system: dark-mode traps to avoid

## The `@theme` inside `@media` trap (learned 2026-07-23)

In `src/styles/global.css`, the dark-mode block was originally written
as:

```css
@theme {
  --color-ink: oklch(0.22 0.012 75); /* light mode default */
  --color-paper: oklch(0.985 0.004 75);
  /* ... */
}

@media (prefers-color-scheme: dark) {
  @theme {
    --color-ink: oklch(0.95 0.004 75); /* dark mode override */
    --color-paper: oklch(0.16 0.008 75);
    /* ... */
  }
}
```

This **silently broke light mode**. The user observed
`https://portfolio.armalo.ai/` rendering with near-white text on a
white background (contrast ratio under 1.5:1, effectively
unreadable) in the catalogue cards.

### Why it broke

Tailwind v4 emits every `@theme` block to the `:root` selector with
last-wins precedence, regardless of any wrapping media query. So both
blocks above produce this at `:root`:

```css
:root {
  --color-ink: oklch(0.22);
  --color-paper: oklch(0.985);
}
:root {
  --color-ink: oklch(0.95);
  --color-paper: oklch(0.16);
}
```

Second declaration wins. The dark-mode values clobber the light-mode
defaults at `:root` unconditionally. Light-mode browsers see
near-white text (95% lightness) on near-white background (98.5%
lightness), and the contrast is gone.

### The fix

Use `:root` directly inside the media query so the override is
properly media-scoped:

```css
@theme {
  --color-ink: oklch(0.22 0.012 75); /* light mode default */
  --color-paper: oklch(0.985 0.004 75);
  /* ... */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-ink: oklch(0.95 0.004 75); /* dark mode override */
    --color-paper: oklch(0.16 0.008 75);
    /* ... */
  }
}
```

Now Tailwind emits:

```css
:root {
  --color-ink: oklch(0.22);
  --color-paper: oklch(0.985); /* ... */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-ink: oklch(0.95);
    --color-paper: okl(0.16); /* ... */
  }
}
```

The dark-mode override is media-scoped — light-mode browsers never
see it, dark-mode browsers do.

### Regression guard

`scripts/site-output.test.mjs` includes two tests that lock the
contract:

1. **`compiled CSS keeps light-mode token values at :root (dark
mode only via media query)`** — reads `dist/_astro/Base.<hash>.css`,
   asserts that:
   - Both light-mode (`oklch(22%)` ink) and dark-mode (`oklch(95%)`
     ink) values are present in the bundle.
   - The light-mode values survive after stripping every
     `@media ... { ... }` block (proves they're at `:root`).
   - The dark-mode values are GONE after stripping `@media` blocks
     (proves they're scoped to a media query).
   - The dark-mode block is wrapped in a real
     `@media (prefers-color-scheme: dark)` selector.
     The test uses a small `stripBlocks(source, isOpening)` helper
     that counts braces (the obvious `@media[^{]+{` regex doesn't
     handle nested `:root { ... }`).

2. **`homepage body uses dark text on light background in
light-mode browser`** — the higher-level guard. Asserts that
   `body { background-color: var(--color-paper); color: var(--color-ink); }`
   is in the bundle, the `<body>` tag has no inline color/background
   style, and `.demand-card` uses `var(--color-ink)` (not a literal
   color). Catches future regressions that paint the body light for
   a different reason (e.g. an inline `style="color: white"` on the
   body, a stray `dark` class on `<html>`, or a Tailwind class that
   hardcodes `oklch(95%)`).

Both tests run as part of `npm run proof` (via `npm test`).

## Token discipline

The portfolio's design system is intentionally minimal: one ink,
one paper, one accent, three status colors (live / wip / planned).
Every new surface should reuse these tokens instead of inventing new
ones. New surfaces that hardcode a color value (e.g. a literal
`#2346d8` or `oklch(95%)`) regress the system toward AI-slop
vibes. The contrast guard test enforces this for `.demand-card`; if
you add a new surface, add a similar test that asserts it uses
`var(--color-*)` and not a literal.

## When to use `@theme` vs `:root`

- `@theme { --token: value; }` is the Tailwind v4 idiomatic way to
  declare design tokens that should also be exposed as Tailwind
  utilities (e.g. `text-ink`, `bg-paper`). Use it for the baseline
  (light-mode) values.
- `:root { --token: value; }` is the vanilla CSS way. Use it inside
  `@media` queries to override tokens conditionally.
- Do NOT use `@theme` inside `@media` — the override is silently
  hoisted to `:root` and clobbers the baseline.
- Do NOT use `:root` for the baseline either — Tailwind won't pick
  up the token and your `text-ink` utility won't work.
