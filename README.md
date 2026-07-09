# portfolio

Ryan Fong's portfolio hub — a fast, content-first site that links the subdomains
hosting the mini-apps built for Armalo.

This is a **public** repo. It is a product surface, not a private memory vault.
Read [`AGENTS.md`](./AGENTS.md) before doing anything non-trivial here; it is the
single source of truth for every coding agent and locks in the cracked dev
workflow (Firstmate, treehouse, no-mistakes, lavish-axi, Brain).

## Stack

- **Astro 7** — content-first, static output, zero client JS for static content.
- **Tailwind CSS v4** — utility-first styling, CSS-first token config.
- **TypeScript** — strict.

The homepage is a quiet hero plus a grid of mini-apps. The grid is driven
entirely by the `apps` content collection, so adding a mini-app is a content
edit, never a code change.

## Add a mini-app

Create one Markdown file under `src/content/apps/`. The filename becomes the
slug. Frontmatter schema lives in `src/content.config.ts`.

```md
---
name: "Your Mini-App"
url: "https://app.example.com"
status: live        # live | wip | planned
category: "Finance"
description: "One tight sentence on what it does."
year: 2026
order: 10           # lower renders first
tags: ["solana"]    # optional, max 3
---

Optional longer body. Not rendered on the grid today.
```

Delete the two `example-*.md` placeholder files once real entries exist.

## Commands

```sh
npm install          # install dependencies
npm run dev          # local dev server
npm run build        # production build (static)
npm run check        # TypeScript + Astro diagnostics
npm run doctor       # repo health + public-safety gate (run before committing)
npm run format       # format with prettier
```

## Design contract (not vibe-coded)

Deliberate typography, restrained color (one ink, one paper, one accent), real
performance budgets, semantic structure, and zero AI-slop patterns (no emoji
soup, no gradient wash, no "🚀 built with" footer noise). Design tokens live in
`src/styles/global.css`. Reuse them instead of inventing new ones. See
[`LOOPS.md`](./LOOPS.md) → "Non-Vibe-Coded Quality Loop".

## Workflow

This repo participates in Ryan's cross-agent cracked dev workflow:

- **Firstmate** drives prioritization, dispatch, and handoffs (registered in the
  Firstmate fleet).
- **treehouse** isolates implementation and risky investigation.
- **no-mistakes** is the default promotion gate (`npm run doctor` is the proof
  step).
- **lavish-axi** is used for dense plans, comparisons, and visual review — and
  must always work (recovery loop in `AGENTS.md`).
- **Obsidian Brain** holds durable cross-repo memory.

Before committing:

```sh
./scripts/portfolio-doctor.sh
```

The doctor fails on secrets, private topology, or a broken build.
