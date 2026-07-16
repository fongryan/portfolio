# The Flywheel Operating Model

This portfolio is the strategy board for a small, two-person product studio.
Every Armalo mini-app runs the same revenue loop, and the catalogue tracks
where each product sits on it. This document is the public-safe definition of
that loop: it teaches the pattern and the interfaces. Spend, revenue, campaign
structure, and account details live in the private operating system, never in
this repository.

## The loop

```text
build → launch → acquire → monetize → compound → (build the next one)
```

| Stage    | What it means                                                           | Advance when                                                          |
| -------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Build    | In production on the app.armalo.ai cloud editor; no public surface yet. | The public surface is live and verified on its own subdomain.         |
| Launch   | Public surface live on its own subdomain, earning first users.          | Real users hold the surface up and a paid campaign has a clear job.   |
| Acquire  | Paid social campaigns on Meta are driving measured traffic.             | Paid traffic converts well enough to justify switching checkout on.   |
| Monetize | A Stripe checkout funnel is live and collecting revenue.                | The funnel covers its own ad spend, with business-verified proof.     |
| Compound | Profitable; profit is reinvested into ads and the next build.           | Profit is funding campaigns and the next product — the loop restarts. |

The loop is deliberately a cycle, not a ladder: the output of `compound` is
the input of the next `build`. The portfolio compounds when each product
funds more attention for the whole catalogue and the next mini-app.

## Where the flywheel lives in this repo

- `src/content/app-schema.ts` — every product declares a `flywheel` stage.
  Stages are status-gated (a planned product can only be `build`; only a live
  product can be `compound`) and the `compound` claim requires
  `business-verified` proof, so the board can never get ahead of reality.
- `/flywheel` — the human strategy board: the loop, the promotion criteria,
  and every product placed at its honest stage.
- `/agents/portfolio.json` and `/agents/portfolio.md` — the machine catalogue
  projects the stage slug (`launch`, `monetize`, …) so agents can reason about
  the portfolio without any private funnel detail.
- Product cards and detail pages show the stage next to access and proof.

## Division of labor

Two loops, one board:

- **Product loop** — new mini-apps are vibe-coded in the app.armalo.ai cloud
  editor, launched on an `*.armalo.ai` subdomain, and added to the catalogue
  once a real public surface exists.
- **Growth loop** — paid social and the checkout funnel are operated against
  launched products, and the results decide which product gets the next unit
  of attention.

Either loop can move a product forward, but only evidence moves a stage.

## Public-safety boundary

What is public here: the loop itself, stage definitions, promotion criteria,
and each product's current stage and proof level.

What is never public here: ad spend, budgets, revenue, conversion rates,
campaign structure, audience definitions, pricing experiments, payment or ad
account configuration, and anything with a credential. Those belong in the
private Brain/workspace. `./scripts/portfolio-doctor.sh` remains the gate
before every commit.

## Adding the next product

1. Create `src/content/apps/<slug>.md` with honest `status`, `access`,
   `proof`, and `flywheel: build` (or `launch` once the subdomain is live and
   verified in a real browser).
2. Run `npm run proof`; the schema will reject any stage the evidence does not
   support.
3. Move the stage forward only when the promotion criterion above is met, and
   bump `lastVerified` when you re-verify the public surface.
