# Portfolio Starter System

Status: source-tested foundation, 2026-07-21. This document is the durable
plan and contract for turning the public portfolio into reusable building
blocks for Armalo App. It is intentionally explicit about what is implemented
and what still requires the private Armalo control plane.

## Ownership boundary

The portfolio is a public discovery and provenance surface. Armalo App is the
private registry, composition, entitlement, billing, policy, installation, and
audit authority. Hermes is the durable operator inside an authorized workspace;
it is not the tenancy or installation authority.

```text
portfolio product record
  -> signed starter manifest
  -> Armalo registry import
  -> dependency/conflict resolution
  -> composition draft and credit quote
  -> approval and entitlement
  -> isolated buildout plan
  -> Hermes pack materialization
  -> tests, deploy/export, and receipts
```

The public machine surface is `/agents/starters.json`. It is discovery-only and
must never be treated as an install endpoint. The private installation URL is
`https://app.armalo.ai`.

## Bundle contract

Each starter under `starters/<product>/` has a `manifest.json`, reference
artifacts, and a Hermes pack:

```text
starters/<product>/
  manifest.json
  source-reference.txt
  modules/                  # public reference artifacts, digest-pinned
  hermes/
    soul.md                 # identity and boundaries
    goals.md                # measurable operator outcomes
    skills/*/SKILL.md       # bounded reusable behaviors
    loops/*.md              # observe/choose/act/verify/record/stop cycles
```

The manifest is `armalo.starter.manifest.v1`. It declares an immutable source
reference, maturity, capabilities, modules, dependencies, conflicts, artifact
digests, Hermes files, and acceptance commands. The portfolio validates the
shape and exposes a sanitized projection. Armalo must re-validate the bundle,
verify the bytes, scan it, and sign its private registry record before use.

## Lego composition

Modules are the unit of reuse. A large request is resolved as one graph rather
than as several independent template installs. A module declares:

- stable ID and kind (`foundation`, `ui`, `data`, `auth`, `integration`,
  `billing`, `deployment`, or `hermes`);
- capabilities it provides and requires;
- dependencies and conflicts;
- exact artifact path and digest.

`composeStarters()` is a deterministic planning function. It rejects missing
dependencies, duplicate IDs, conflicts, and cycles, then emits dependency order,
deduplicated capabilities, and the combined Hermes skill/loop set. It has no
tenant, billing, secret, install, or external-provider authority by design.

If a request does not fit the catalogue, Armalo creates a private custom module
and runs the same validation, sandbox, security, evaluation, approval, and
receipt path. A successful custom module can later be promoted into this
catalogue with provenance and creator attribution.

## Hermes pack rules

Every product operator pack must:

1. state its identity and authority limits in `soul.md`;
2. state measurable outcomes and stop conditions in `goals.md`;
3. keep one behavior per `SKILL.md` with explicit inputs, outputs, and failure
   handling;
4. make recurring behavior a bounded loop with a stop condition;
5. never contain credentials or tenant-specific secrets;
6. leave receipts for build, test, approval, export, and deployment actions;
7. escalate missing capabilities instead of inventing integrations.

## Armalo integration plan

The App implementation should consume this contract through the existing
product-kit/extension seams, not create a parallel template registry:

1. import the public manifest by product slug and commit;
2. copy the exact referenced bytes into the private registry and verify digests;
3. map the manifest to a signed Product Kit / extension bundle;
4. resolve one composition draft for the user's request;
5. show the module graph, capability diff, risk, and credit estimate;
6. require entitlement, approval, and policy checks;
7. create an isolated buildout plan in dependency order;
8. materialize the Hermes pack into the tenant's project namespace;
9. execute tests and promotion gates;
10. emit immutable receipts and support rollback/revocation.

The registry and buildout services remain the authority. The portfolio endpoint
must remain safe if unavailable; an Armalo workspace can use a previously
imported, signed snapshot and must not silently fetch mutable `main` content.

## External developer path

Community builders submit the same bundle format. Publication requires schema,
license, dependency, secret, malware, capability, sandbox, evaluation, and
human-review gates. Usage attribution is version- and digest-specific. A later
marketplace can pay creators from an audited ledger after refunds, fraud holds,
tax/KYC, and revocation rules are applied. A public listing never grants runtime
authority.

## Build-out checklist

### Implemented in this repository

- [x] Versioned starter manifest schema.
- [x] Deterministic dependency/conflict/cycle resolver.
- [x] Two reference starter manifests.
- [x] Digest-pinned reference artifacts.
- [x] Per-product Hermes soul, goals, skills, and loops.
- [x] Sanitized `/agents/starters.json` discovery projection.
- [x] Contract tests for shape, digest integrity, composition, and privacy.

### Next Armalo control-plane slices

- [ ] Private registry importer with exact-byte verification and signed snapshot.
- [ ] Composition authoring service backed by the existing extension/product-kit
      ports (no compatibility shim around persist-only database functions).
- [ ] Dependency resolver adapter that consumes this manifest without importing
      the public portfolio at runtime.
- [ ] Credit quote, reservation, entitlement, and approval receipts for a draft.
- [ ] Buildout planner and idempotent materializer bound to tenant/project scope.
- [ ] Hermes pack installer with version pinning, restart recovery, and rollback.
- [ ] Conformance, security, browser, integration, and acceptance gates.
- [ ] GitHub export with provenance and license notices intact.
- [ ] Custom-module fallback for unsupported requests.
- [ ] Revocation, upgrade, and migration receipts.
- [ ] Developer submission, attribution, revenue-share, and payout ledger.
- [ ] Abuse monitoring for suspicious composition, export, credential, and spend
      patterns, with fail-closed policy decisions.

### Proof gates

- Portfolio source: `npm test`, `npm run check`, `npm run proof`.
- App source: contract/type/unit/integration tests for registry, authoring,
  billing, buildout, materialization, and Hermes admission.
- Runtime: signed snapshot, tenant isolation, sandbox execution, browser proof,
  deployment proof, and receipt readback. A local green test is not deployment
  or business proof.

## Adding a new starter

1. Add or update the public product record with honest status/proof.
2. Add a new `starters/<slug>/manifest.json` and exact reference artifacts.
3. Write the Hermes pack and acceptance commands.
4. Run the starter contract test and full portfolio proof.
5. Import the digest into Armalo's private registry through its review path.
6. Do not claim the starter is installable until the private snapshot and runtime
   proof exist.
