# Contributing

This repository is infrastructure SDK code intended for long-term maintenance and external audit.

## Hard Constraints

- Read-only only: no signing, no transaction sending, no wallet integration.
- Deterministic outputs: same input yields same output.
- Zero mock data: no fake endpoints, addresses, pools, metrics, or fixtures that imply chain state.
- Audit-first: prefer explicit types, explicit failure boundaries, and minimal dependencies.

Any change that violates these constraints will be rejected.

## Required Process

- Open an Issue before a PR.
- Use the Issue template and include testable acceptance criteria.
- Keep PRs scoped to the issue.

## Versioning (Semantic Versioning)

- Patch: bugfix or doc changes that do not change public behavior.
- Minor: backwards-compatible API additions.
- Major: breaking API changes.

Breaking changes require:

- explicit label `breaking-change`
- documentation update
- migration notes

## Tests

- Unit tests: determinism, boundary conditions, serialization/decoding.
- Integration tests: live Solana RPC reads only (no stubs, no fake endpoints).

If integration tests require an RPC URL, they must read it from an environment variable and must not ship a default endpoint.

## Documentation Contract

Every public symbol must document:

- Purpose
- Inputs/outputs
- Determinism guarantees
- Failure boundaries
