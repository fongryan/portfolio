# Managed Agent Infrastructure

Armalo's managed-agent infrastructure direction starts from a blunt premise:
installing an open agent runtime on inexpensive cloud compute is not, by itself,
a durable product. Modern coding agents can scaffold deployment quickly, and a
buyer who only receives a server will eventually compare the price with
commodity compute.

This catalogue family packages the parts that remain valuable after deployment
becomes easy: team coordination, reusable operating knowledge, bounded
authority, recovery, and legible cost ownership.

## What Armalo is selling

Armalo is not positioning a generic virtual server or a standard Hermes install
as proprietary value. The intended product is the managed operating layer
around an agent: who can use it, what it knows, what it may do, how its work is
evaluated, how it recovers, and who owns each cost.

The commercial boundary is equally important. A platform fee pays for the
control plane and managed operation. Customer-controlled model spend remains
visible instead of disappearing into an unlimited-use promise that cannot be
sustained.

## The three-product system

1. **Managed Agent Workspaces** organize people and role-specific agents inside
   one company boundary. The product owns team identity, policy, audit, and
   consolidated administration.
2. **Agent Skill Library** packages domain expertise as inspectable, versioned,
   evaluated workflows. The product owns reusable operating knowledge—not the
   runtime credential that authorizes an external action.
3. **BYOK Agent Cloud** operates the agent service while the customer supplies a
   supported model-provider key. The product owns orchestration, backup,
   recovery, and gateway administration while keeping token spend attributable.

The products compose without collapsing into one vague “AI platform.” A team
can use the workspace without buying a vertical skill pack, license a skill for
its own runtime, or use the BYOK cloud for a single governed agent.

## Who buys each product

| Product                  | Primary buyer                             | Trigger                                                              | Value purchased                                                    |
| ------------------------ | ----------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Managed Agent Workspaces | Operations or IT leader                   | Individual agents, keys, and invoices have become unmanageable       | Central identity, policy, visibility, and administration           |
| Agent Skill Library      | Business owner, agency, or domain expert  | A blank agent requires too much tuning to do a valuable job reliably | Reusable domain expertise, evaluations, and workflow logic         |
| BYOK Agent Cloud         | Technical operator or cost-conscious team | They want managed agents but need direct control over model usage    | Predictable platform fee, recovery, and customer-owned model spend |

## Authority and cost boundaries

- A workspace membership does not imply permission to publish, spend money,
  message customers, or mutate production systems.
- A skill describes how to perform work; the deployment decides whether the
  required capability and credential may be used.
- A provider key pays for model inference; it does not grant access to unrelated
  company systems.
- Compute, model usage, managed-platform fees, support, and custom implementation
  remain distinct cost lines.
- Secrets must remain encrypted, scoped, redacted from logs, and excluded from
  public catalogue or machine-readable portfolio surfaces.

## Proof ladder

Every product begins as **planned / unavailable / not-yet-proven**. It can only
advance when the corresponding evidence exists:

1. **Source tested:** schema, isolation, permission, backup, and failure-path
   tests pass against the implementation.
2. **Runtime verified:** a deployed environment proves provisioning, recovery,
   metering, and gateway behavior with receipts.
3. **Public live:** a real buyer can access the stated offer through the public
   route under the published boundary.
4. **Business verified:** retained customers, support burden, gross margin, and
   outcomes support the commercial claim.

Deployment is not business proof. A healthy runtime does not prove buyers will
pay, that a skill creates value, or that support economics work.

## What this is not

- Not commodity compute with a large markup.
- Not an unmanaged root login sold as software.
- Not unlimited model usage hidden behind a flat fee.
- Not an app store claim before skills have evaluations and buyers.
- Not unrestricted agent autonomy or a promise that consequential actions run
  without human approval.
- Not a claim that these planned offers are live today.
