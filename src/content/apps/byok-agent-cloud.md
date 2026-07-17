---
name: "BYOK Agent Cloud"
status: planned
access: unavailable
proof: not-yet-proven
flywheel: build
lastVerified: "2026-07-15"
category: "Managed agent infrastructure"
description: "A managed agent control plane with customer-supplied model keys, predictable platform pricing, backups, and messaging gateway integrations."
year: 2026
order: 30
tags: ["BYOK", "orchestration", "gateways"]
audiences:
  ["Agent operators", "Small businesses", "Agencies", "Technical teams"]
deliveryModes: ["hosted", "custom-build", "dfy", "partner"]
offerModes: ["pilot", "team", "agency", "enterprise", "partner"]
salesPosition: "Separate the managed platform fee from volatile model spend: customers bring their own model API key while Armalo manages orchestration, recovery, and gateway connections."
owner: "Armalo AI"
platform: "Managed BYOK agent control plane"
ctaLabel: "Plan a BYOK pilot"
highlights:
  - "Keep model usage on a customer-controlled model account."
  - "Manage agent configuration, encrypted backup, and recovery centrally."
  - "Connect approved messaging gateways without exposing server administration."
---

BYOK Agent Cloud is the planned managed-service layer for operators who want
reliable agent orchestration without bundling unpredictable model consumption
into a marked-up hosting bill. Customers bring your own key for a supported
model provider; the product separates customer-controlled model spend from the
flat managed-platform charge.

## The job

The intended control plane manages agent configuration, deployment lifecycle,
encrypted backup and recovery, health visibility, and approved gateway
integrations such as Telegram, Slack, or Discord. Customers keep a direct
relationship with their model provider while Armalo operates the surrounding
agent service.

## The boundary

Provider credentials remain scoped to the customer's deployment and must be
encrypted at rest and redacted from logs. The platform does not silently absorb
token spend, promise unlimited usage, or turn a customer key into authority over
unrelated systems. Compute, model usage, support, and optional implementation
work remain legible as separate cost lines.

## Availability

This offer is planned and not yet live or generally available. Backups,
recovery, supported-provider behavior, gateway integrations, service levels, and
unit economics require implementation and runtime proof before availability is
claimed. Read the [managed agent infrastructure operating
thesis](https://github.com/fongryan/portfolio/blob/main/docs/managed-agent-infrastructure.md).
