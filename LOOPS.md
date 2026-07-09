# Portfolio Loops

Saved loops for the portfolio hub. These are repo-local improvement cycles that
keep this site tasteful, fast, and consistently driven through the captain
stack. They mirror the workspace captain-stack loops but are scoped to this
repo.

A loop is a small, repeatable Observe -> Choose -> Act -> Verify -> Record ->
Stop prompt. Add a loop when the same correction has been needed twice.

## Non-Vibe-Coded Quality Loop

Use before any visual or content change ships to the public site.

```text
Observe: Open the affected page and read its source. Check for AI-slop patterns: emoji as feature icons, gradient wash backgrounds, "🚀 built with X" footer noise, centered-everything layouts, generic stock copy, low-contrast text.
Choose: Pick the one change that most raises craft: tighter type scale, restrained palette, real whitespace, semantic structure, one defensible accent color.
Act: Make the change in source (Astro component / Tailwind tokens), not via inline hacks.
Verify: Run npm run check && npm run build && ./scripts/portfolio-doctor.sh. Re-open the page and confirm it reads as a senior designer's work.
Record: Note the pattern fixed in this loop or a GOALS.md entry so the slop does not return.
Stop: Stop when the page is defensible, not when it is merely "fine".
```

## Captain-Stack Intake Loop (portfolio)

Use when starting non-trivial portfolio work.

```text
Observe: Read AGENTS.md, then run git status --short --branch and treehouse status. If the work is broad, read the Firstmate session digest.
Choose: Decide if this is a direct local edit, a treehouse-isolated change, a Firstmate scout/ship task, or a no-mistakes promotion run.
Act: Make one bounded change through the established owner surface.
Verify: Run ./scripts/portfolio-doctor.sh. For shippable code, route through no-mistakes axi run --intent "<goal>".
Record: Update Firstmate backlog, GOALS.md, or a Brain note with outcome, proof, and next bottleneck.
Stop: Stop at success, clean no-op, blocked with exact blocker, or approval-required.
```

## Lavish Review Reliability Loop (portfolio)

Use when a portfolio decision (layout, IA, content model, design system) deserves
a visual artifact. This is the loop that keeps Lavish from ever dying silently.

```text
Observe: Run the relevant lavish-axi playbook <id> before writing HTML. Inspect the portfolio's own design tokens (src/styles, tailwind config) to match them.
Choose: Pick the smallest artifact that makes the decision easier: diagram, table, comparison, plan, or input.
Act: Create the artifact under .lavish/. Open it with lavish-axi <file>.
Verify: Run lavish-axi poll <file>. Fix fresh error-severity layout warnings. If interrupted, rerun the poll. If SERVER_ERROR, follow the exact recovery sequence documented in AGENTS.md ("Lavish Must Work For Real") and report any residual failure.
Record: In the chat/PR, include artifact path, design source used, feedback status, and any residual low-severity warnings.
Stop: Stop when no fresh error-severity warnings remain, Ryan ends the session, or a real blocker is named.
```

## Mini-App Link Integrity Loop

Use whenever a new Armalo mini-app subdomain is added or a link changes.

```text
Observe: Read src/content/apps (the content collection that backs the homepage grid). List each entry's url, status, and blurb.
Choose: Pick the entry that is most likely stale or underspecified.
Act: Update the frontmatter (name, url, status: live|wip|planned, category, description, year). Keep copy tight and free of hype.
Verify: Run npm run build to validate the content schema. If the link is "live", confirm the subdomain resolves before flipping status.
Record: Note the mini-app and its status in GOALS.md so the portfolio roadmap stays accurate.
Stop: Stop when the collection matches reality and the build passes.
```
