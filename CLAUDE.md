# AGENTS.md

## Design With Agents

This repo participates in the agent-driven design workflow. Load when work produces UI, visual artifacts, generated front-end, branding, or marketing assets. Canonical methodology: `/Users/ryanfong/workspace/DESIGN-WITH-AGENTS.md`.

Core reflexes: keep a `soul.md` (exhaustive project memory, record+transcribe meetings, don't pre-distill); when output is close-but-wrong build a disposable control surface (slider modal / gallery / generator), dial it in, discard it — never hand-edit blindly; shepherd tightly with maximal context then unleash (rich context unlocks surprise; generic output = thin input); attach a mood board / reference set before prompting; ship dual human+machine surfaces with a do-not-run guard for sample commands; treat feedback as prompt → agent → PR with a human merge gate.


This repository is **public**. It is Ryan Fong's portfolio hub: a fast,
content-first site that links the subdomains hosting the mini-apps built for
Armalo. Treat it as a shareable, production-quality product surface, never as a
private memory vault.

This file is the single source of truth for every coding agent (Codex, Claude
Code, Hermes Agent, OpenCode, and Firstmate crewmates). Read it before acting.

## Prime Directive

Build and maintain a portfolio hub that does **not** look vibe-coded: deliberate
typography, restrained color, real performance budgets, semantic structure, and
zero AI-slop patterns (no emoji soup, no gradient wash, no "🚀 built with X"
footer noise). Every shipped pixel should be defensible to a senior designer.

The captain stack owns the operating system. Do not reinvent any lane it
already covers:

- **Firstmate** — captain/crew layer. Owns the queue, prioritization, context
  switching, dispatch, and handoffs.
- **treehouse** — worktree layer. Owns isolated, reusable checkouts.
- **Repo-native proof** — owns shippable validation; no-mistakes is optional legacy tooling.
- **lavish-axi** — visual review layer. Owns dense plans, architecture maps,
  comparisons, and review surfaces.
- **Obsidian Brain** — durable memory layer. Owns cross-repo history.
- **Loops, goals, skills** — self-improvement layer. Owns recursive tuning.

For broad planning, prioritization, cross-repo work, context switching, or
non-trivial implementation, **consult Firstmate first**. Do not create a second
orchestrator, queue, validator, worktree manager, visual review loop, memory
store, or dashboard when the stack already owns that lane.

## Session Intake (every non-trivial task)

1. Read this file and `CLAUDE.md`.
2. Read `/Users/ryanfong/workspace/DEV_WORKFLOW.md` when the task touches
   planning, implementation, review, proof, or context switching.
3. Run the Firstmate session digest:
   `/Users/ryanfong/workspace/firstmate/bin/fm-session-start.sh`
   Treat its output as the authoritative snapshot for priorities, active work,
   and captain preferences. If Firstmate is locked by another live session,
   operate **read-only** with respect to Firstmate state and report the lock
   holder, watcher state, queued work, and next safe action.
4. Run `git status --short --branch` and preserve unrelated dirty work.
5. Run `treehouse status` before parallel, risky, or implementation work.
6. Run this repo's doctor before promoting changes: `./scripts/portfolio-doctor.sh`.
7. Use Brain when history, prior decisions, or cross-agent continuity matter.

## Firstmate Is The Captain Layer

Use Firstmate for broad planning, cross-repo prioritization, context switching,
parallel work, long-running supervision, and handoffs. Route project-specific
coding, audits, investigations, bug repros, and planning packets to crewmates
via `bin/fm-spawn.sh` with explicit dispatch profiles.

Default dispatch shape:

- **Scout** when the problem is unknown or needs ranked findings.
- **Ship** when acceptance criteria and proof are clear.
- **Secondmate** only when this repo needs persistent supervision; do not create
  idle per-repo homes just because they sound elegant.
- Keep project work in **treehouse worktrees**, not the hot checkout, whenever
  more than one agent could touch the tree.
- Use Firstmate `data/backlog.md`, `data/<task>/brief.md`, and
  `data/<task>/report.md` as durable state; chat is only a cache.

This repo is registered in the Firstmate fleet and uses the `tasks-axi` backlog
backend. Prefer Firstmate backlog / `tasks-axi` over loose markdown TODO sprawl.

## Tool Rules (Non-Negotiable)

- `treehouse` — isolate implementation and risky investigation. Return leases
  after landed or intentionally abandoned. Never run parallel agents in the same
  dirty checkout.
- Repo-native tests, doctor, smoke, and runtime proof are the default validation for shippable work. No-mistakes is optional legacy tooling. A
  task is not done until intent + review/test/lint/CI is recorded. Do not bypass
  unless the repo explicitly authorizes an emergency path.
- `lavish-axi` — use for dense plans, comparisons, architecture maps, code
  review surfaces, product decisions, and reports. See the reliability loop
  below; Lavish must never be left silently broken.
- `gh-axi` — prefer over raw `gh` for GitHub operations.
- `chrome-devtools-axi` — prefer for shell-level browser automation and visual
  QA.
- `tasks-axi` — prefer for task/backlog surfaces.
- `gnhf`, `quota-axi`, `axi`, `wheelhouse` — use when installed and relevant; if
  a tool is not on PATH, record it as environment drift instead of pretending it
  is available.

## Lavish Must Work For Real

For any non-trivial Lavish artifact:

1. Run the relevant `lavish-axi playbook <id>` before writing HTML.
2. Choose design source in priority order: a look Ryan asked for, then this
   project's design system, then the Tailwind/DaisyUI fallback via
   `lavish-axi design`.
3. Write the artifact under this repo's `.lavish/` directory.
4. Open with `lavish-axi <file>` and capture the URL.
5. Poll with `lavish-axi poll <file>` and keep the poll alive.
6. Fix fresh **error-severity** layout warnings before asking Ryan to rely on
   the artifact.
7. If polling is interrupted, rerun it. Queued feedback is never lost.
8. If Ryan ends the session from the browser, stop polling and do not reopen
   uninvited.

Lavish failures are recoverable, never terminal. If a session crashes or
`lavish-axi <file>` returns `SERVER_ERROR`, recover in this exact order:

```sh
lavish-axi stop
lavish-axi <file>            # reopen
lavish-axi poll <file>       # re-poll
# still broken? use Brain's recovery helper:
node /Users/ryanfong/workspace/brain/tools/lavish-reliable.mjs <file> --poll
```

Never silently leave a dead Lavish session. Never claim a visual review passed
without a live, polled artifact.

## Recursive Improvement Loop

After meaningful work, leave one durable improvement in the right owner surface:
this repo's `LOOPS.md`, `GOALS.md`, a skill, Firstmate backlog, no-mistakes
evidence, or the private Brain. Keep the loop small:

```text
Observe -> Choose -> Act -> Verify -> Record -> Repeat or stop
```

Prefer declarative goals that are actionable, measurable, timeboxed, and living.
When an instruction repeats twice, turn it into a loop, skill, test, guard, or
Firstmate backlog item. Always look for ways to be smarter, more autonomous, and
more tasteful.

## Cross-Agent Continuity

Ryan's agents are one system. Codex, Claude Code, Hermes Agent, OpenCode,
Firstmate crewmates, and repo-local agents must inherit the same facts:

- This file is canonical. `CLAUDE.md` symlinks to it so Claude Code and
  Codex/Hermes/OpenCode read identical rules.
- All workflow rules point at `/Users/ryanfong/workspace/DEV_WORKFLOW.md` rather
  than copying the contract inline.
- Durable outcomes (decisions, proof packets, tool-route findings, blockers,
  reusable learnings) live in Brain, not in chat memory.
- When changing workflow rules, update the canonical owner first, then
  propagate small inheritance pointers. Avoid copying huge rules into every repo.

## Public Repo Safety

Never commit secrets, private project internals, private vault contents, local
absolute paths that reveal private topology, credentials, session logs,
screenshots with personal data, customer/family/financial data, browser
cookies, API keys, tokens, `.env` files, or agent transcripts.

Before committing, run:

```sh
./scripts/portfolio-doctor.sh
```

If the doctor flags a possible leak, stop and either remove the content or move
it to the private Brain/workspace. Public docs teach patterns and interfaces,
never expose private operational facts.

## Autonomy Boundaries

Agents may autonomously improve docs, checks, templates, design tokens, and
local tooling in this repo when the scope is public-safe and reversible.

Agents must ask before:

- Publishing, deploying, or posting externally.
- Touching production systems or live credentials.
- Running long-lived autonomous loops (e.g. `gnhf`) without explicit budget and
  stop conditions.
- Initializing a tool that writes secrets, remotes, hooks, or external service
  configuration.
- Importing private Brain/vault content into this public repository.

## Verification

- `npm run build` — Astro production build must pass.
- `npm run check` — TypeScript + Astro diagnostics must pass.
- `./scripts/portfolio-doctor.sh` — repo health + public-safety gate.
- `bash /Users/ryanfong/workspace/check-captain-stack.sh` — workspace audit must
  show `ok workspace AGENTS.md` / `CLAUDE.md` for portfolio.
- For shippable code, run the repo-native proof command and record its receipt.

<!-- BEGIN RYAN CRACKED DEV WORKFLOW -->
## Ryan Cracked Dev Workflow

This repo participates in Ryan's cross-agent development system. Agents in
Codex, Claude Code, Hermes Agent, OpenCode, and related harnesses must preserve
context through Brain and use the strongest applicable tool route before broad
implementation.

Core rules:

1. Start brain-first: search the user's private Brain, GBrain, or the relevant
   canonical project page before planning major work.
2. Use FirstMate as the captain layer for multi-step, multi-agent, cross-repo,
   ambiguous, or high-risk work.
3. Use Treehouse for isolated worktrees. Do not run parallel agents in the same
   dirty checkout.
4. Use No Mistakes for serious ship gates. A task is not done until intent,
   review/test/lint/CI or the named local proof gate is recorded.
5. Use Lavish Editor through `lavish-axi` for dense planning, architecture,
   risk review, UI/product review, diagrams, tables, and PR/readiness packets.
   Open the artifact, poll for feedback/layout warnings, and fix fresh
   error-severity layout warnings before asking Ryan to review.
   If `lavish-axi <file>` returns `SERVER_ERROR`, stop/reopen/poll before
   falling back, then use Brain's recovery helper
   `node /Users/ryanfong/workspace/brain/tools/lavish-reliable.mjs <file> --poll`,
   and report the exact residual failure if recovery is blocked.
6. Keep creating better declarative goals, loops, skills, proof gates, and
   retros. Repeated instructions should become repo rules, Brain notes, or
   skills instead of living only in chat.
7. Preserve dirty work and canonical owner seams. Do not invent sidecar systems
   when the repo already has an owner for planning, validation, runtime, or
   memory.
8. Record durable outcomes in Brain: decisions, validation packets, FirstMate
   reports, tool-route findings, blockers, and reusable learnings.

For the full private operating contract, read the local Brain/vault agent docs
when available. Do not copy private paths or documents into this public
repository.
<!-- END RYAN CRACKED DEV WORKFLOW -->
