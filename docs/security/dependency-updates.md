# Dependency update policy

This document is the canonical source of truth for how the portfolio
keeps its dependency tree free of known-vulnerable ranges. The repo's
`scripts/portfolio-deps-security.test.mjs` enforces the policy inside
`npm run proof`, so a manifest or lockfile change that re-introduces
one of the listed advisories fails the canonical gate before it can
ship.

## How the policy is enforced

Three layers, in order:

1. **Direct dependency floor** for any package with a known advisory
   we depend on directly. Today that is `astro` (GHSA-4g3v-8h47-v7g6).
   The constraint in `package.json` must use a floor at or past the
   patched version.
2. **`overrides` in `package.json`** for transitive packages whose
   parent constraints would otherwise pin them inside a vulnerable
   range. Today that is `svgo` and `fast-uri` (pulled in by
   `@astrojs/check` and Fastify respectively). `overrides` is npm 8.3+
   syntax and is the deterministic way to force a transitive bump
   without editing the lockfile by hand.
3. **`scripts/portfolio-deps-security.test.mjs`** as the regression
   guard. The test reads the lockfile, asserts the resolved version of
   every guarded package is outside every known vulnerable range, and
   runs `npm audit` (skip with `PORTFOLIO_SKIP_NPM_AUDIT=1` for offline
   runs). The test is wired into the `npm test` step of
   `npm run proof`.

A self-check inside the test pins the range parser against positive
and negative versions, so a future parser refactor that silently
breaks the guard fails the proof before it lands.

## Currently guarded advisories

| GHSA                | Package                 | Severity   | Vulnerable range     | Floor   | Source                                                                                                                                                                                                                      |
| ------------------- | ----------------------- | ---------- | -------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GHSA-4g3v-8h47-v7g6 | `astro` (direct)        | medium     | `>= 2.9.0, <= 7.0.9` | `7.1.0` | CVE not assigned; XSS via unescaped View Transition animation values in server-generated `<style>`. The portfolio is `output: "static"` so the SSR XSS path is not exposed today, but the dep was still in range.           |
| GHSA-2p49-hgcm-8545 | `svgo` (transitive)     | high (8.2) | `>= 4.0.0, < 4.0.2`  | `4.0.2` | SVGO `removeScripts` left namespaced `<svg:script>` and case-variant `JavaScript:` URIs. Plugin is disabled by default, so practical exposure for the build pipeline is low, but the transitive was in range.               |
| GHSA-v2hh-gcrm-f6hx | `fast-uri` (transitive) | high (7.5) | `>= 3.0.0, <= 3.1.3` | `3.1.4` | Backslash not treated as authority delimiter, so `fast-uri` and Node's WHATWG URL extract different hosts from the same string. The portfolio does not enforce host policy via `fast-uri`, but the transitive was in range. |

The lockfile check also covers the lower major ranges of `svgo` and
`fast-uri` (`2.x` and `1.x` for `svgo`, `2.x` and `4.x` for `fast-uri`)
so a future resolution that picks up an older major still fails the
guard.

## When to add a new entry

Add a row to the table and a vulnerable-range entry to the
`vulnerableRanges` object in the test when:

- A new Dependabot alert opens on `default` with a vulnerable range
  the portfolio actually resolves into, **or**
- A `npm audit` high/critical result is reported by a fresh install
  against the lockfile, **or**
- A package the portfolio depends on directly (or transitively via
  `overrides`) releases a security advisory in a range the resolved
  tree touches.

Add a new `overrides` entry when the parent constraint prevents
`npm install` from picking the patched version on its own. Direct deps
should be updated by raising the floor in `dependencies` instead.

## When to remove an entry

Remove the row and the vulnerable-range entry when:

- The advisory is formally withdrawn upstream, **or**
- The package is no longer in the resolved tree (e.g. dropped from
  the direct or override list), **or**
- The repo moves off the package entirely (e.g. `@astrojs/check` is
  replaced).

Do not silence an entry by widening the vulnerable range; the
negative-control test in the file will catch a "tolerance band"
expansion because the floor must stay strictly at the patched
version.

## How to add a new override

```sh
# 1. Edit package.json: add the override floor and (if needed) the
#    direct-dep floor.
# 2. Regenerate the lockfile:
npm install --package-lock-only
# 3. Confirm the audit is clean:
npm audit
# 4. Run the proof; the new test will fail if the override does not
#    force the resolved version past every known vulnerable range:
npm run proof
# 5. Commit, push, and let Vercel deploy.
```

If `npm install` errors with a `~/.npm/_cacache` `EEXIST` / `EACCES`
on a root-owned file, the local npm cache is poisoned (likely from a
prior `sudo npm` invocation). Work around it with a local cache:

```sh
mkdir -p /tmp/npm-cache-portfolio
npm install --cache /tmp/npm-cache-portfolio
```

This is a workstation-level issue, not a portfolio one. If the
collision persists across reboots, the root-owned file can be cleared
with `sudo` outside the repo, but that is the owner's call.

## Relationship to Dependabot

Dependabot is enabled and will open auto-PRs when new advisories
land. The portfolio handles those PRs by:

1. Letting Dependabot open the PR (keeps the audit trail clean).
2. Locally applying the same floor as the PR, running `npm run proof`,
   and pushing the result. This is the path this policy was written
   for; the proof gate catches it.
3. Closing the Dependabot PR as superseded with a comment pointing
   at the local commit. This keeps the dependency history linear and
   avoids two PRs racing to land the same bump.
