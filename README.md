# portfolio

Ryan Fong's portfolio hub — a fast, content-first site that links the subdomains
hosting the mini-apps built for Armalo, and the public strategy board for the
studio's product flywheel (build → launch → acquire → monetize → compound).
See [`docs/flywheel-operating-model.md`](./docs/flywheel-operating-model.md).

The canonical live URL is `https://portfolio.armalo.ai/` (hosted on the Armalo
vibe Hetzner box behind the unified Caddy; see `infra/handoff.md` for the
cutover packet). The historical `portfolio-peach-sigma-85.vercel.app`
preview URL still resolves while the Vercel project is being archived.

The reusable starter-bundle and Hermes composition contract lives in
[`docs/PORTFOLIO-STARTER-SYSTEM.md`](./docs/PORTFOLIO-STARTER-SYSTEM.md). The
public machine-readable starter index is `/agents/starters.json`; it is a
discovery surface, never a runtime installation authority.

This is a **public** repo. It is a product surface, not a private memory vault.
Read [`AGENTS.md`](./AGENTS.md) before doing anything non-trivial here; it is the
single source of truth for every coding agent and locks in the cracked dev
workflow (Firstmate, repo-native proof, lavish-axi, and Brain).

Security reports: see [`SECURITY.md`](./SECURITY.md). The dependency-update
policy lives at
[`docs/security/dependency-updates.md`](./docs/security/dependency-updates.md);
the regression guards are `scripts/portfolio-deps-security.test.mjs`
(in-tree) and `scripts/portfolio-production-smoke.test.mjs` (opt-in via
`PORTFOLIO_VERIFY_PRODUCTION=1 npm test`).

## Stack

- **Astro 7** — content-first, static output, zero client JS for static content.
- **Tailwind CSS v4** — utility-first styling, CSS-first token config.
- **TypeScript** — strict.

The homepage is a quiet hero plus a grid of products. The grid is driven
entirely by the `apps` content collection, so adding a product is a content
edit, never a code change.

## Product catalogue foundation

This repo is the public-safe index for the broader Armalo product catalogue.
Read [`docs/product-catalogue-public-foundation.md`](./docs/product-catalogue-public-foundation.md)
for the boundary between this portfolio hub and the private catalogue/control
plane hosted through `app.armalo.ai`. Internal strategy, pricing, customer
research, and operator playbooks do not belong in this public repo.

## Add a product

Create one Markdown file under `src/content/apps/`. The filename becomes the
slug. Frontmatter schema lives in `src/content.config.ts`.

```md
---
name: "Your Mini-App"
url: "https://app.example.com"
status: beta # live | beta | wip | planned
access: public # public | sign-in | private-beta | waitlist | unavailable
proof: public-live # strongest verified public claim
flywheel: launch # build | launch | acquire | monetize | compound
lastVerified: "2026-07-15"
category: "Finance"
description: "One tight sentence on what it does."
year: 2026
order: 10 # lower renders first
tags: ["solana"] # optional, max 3
audiences: ["Example buyers"]
deliveryModes: ["hosted"] # hosted | custom-build | dfy | licensed | partner
offerModes: ["pilot"] # pilot | team | agency | enterprise | commission
salesPosition: "One concise reason a seller should lead with this product."
ctaLabel: "Open product"
highlights:
  - "One concise, defensible visitor benefit."
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
npm test             # deterministic source and deploy contracts
                      # (also runs scripts/portfolio-deps-security.test.mjs,
                      #  the regression guard for the three Dependabot
                      #  advisories closed in commit 5f43656; see
                      #  docs/security/dependency-updates.md for the policy)
npm run budget       # built homepage under 96 KB; review-desk enhancement is scoped to index
npm run proof        # canonical local proof (also wired into scripts/deploy-vibe.sh)
npm run doctor       # standalone repo health + public-safety gate
npm run format       # format with prettier
npm run format:check # verify formatting without changing files
npm run format:vercel # verify committed Vercel config formatting
```

`npm run proof` is the authoritative release command. It serializes concurrent
runs, checks authored-source formatting, checks the committed Vercel config,
runs deterministic contracts, type-checks, builds once, checks generated routes
and metadata, enforces the performance budget, and then runs the public-safety
doctor without rebuilding. A successful proof leaves `dist/` intact for
publication. The lock records its owner PID atomically,
allows a two-second grace window while owner metadata is established, and
recovers abandoned locks without deleting a replacement owner's lock.

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
- The workspace's current **mainline-yolo** policy permits deliberate direct
  work on `main`; preserve unrelated work and never force-push.
- **treehouse** remains available when isolation is explicitly required.
- **repo-native proof** (`npm run proof`) is the promotion gate used locally and
  by `scripts/deploy-vibe.sh` (the Hetzner `vibe` box is the live target;
  `infra/handoff.md` is the operator packet for the cutover from Vercel).
  GitHub Actions is intentionally disabled while the owner billing
  gate is closed; do not add workflows or re-enable Actions without Ryan's
  direct approval. `no-mistakes` is an optional legacy wrapper.
- **lavish-axi** is used for dense plans, comparisons, and visual review — and
  must always work (recovery loop in `AGENTS.md`).
- **Obsidian Brain** holds durable cross-repo memory.

Before committing or pushing:

```sh
npm run proof
```

The doctor can still run independently with `npm run doctor`; it fails on
secrets, private topology, divergent agent instructions, or a broken build.
