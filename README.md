# volatilum-sdk

Authoritative, read-only SDK for Volatilum institutional liquidity infrastructure on Solana (mainnet-compatible).

This repository is intentionally infrastructure-first and audit-oriented: it exposes deterministic, execution-aware liquidity state while explicitly forbidding any behavior that could be construed as custody, execution, or financial output.

## What This SDK Is

- A programmatic interface for observing Volatilum on-chain state.
- A slot-consistent read layer for multi-account observations.
- A deterministic surface for protocol engineering, validator/RPC operations, research, and risk analysis.

## What This SDK Is Not

The following are explicit non-goals and must not be added:

- Wallet interaction (no key management, no wallet adapters).
- Transaction signing (no `signTransaction`, no `sendTransaction`).
- Fund movement (no transfers, swaps, deposits/withdrawals).
- Yield rates, APRs, or projections.
- Retail dashboards, trading bots, or yield marketing tooling.

Liquidity is treated as infrastructure, not a product.

## Design Axioms (Non-Negotiable)

1. **Read-Only First**: no state mutation.
2. **Deterministic Outputs**: same input, same output.
3. **Zero Mock Data Policy**: no fake addresses, pools, metrics, or endpoints.
4. **Audit-First Engineering**: clarity over abstraction.

Violation of any axiom is a hard error.

## Supported Environments

- TypeScript/Node.js: Node.js >= 20.
- Rust: edition 2021.
- Solana network: mainnet-compatible.

The SDK does not embed an RPC endpoint. All RPC URLs and account addresses must be supplied by the caller.

## Repository Structure

TypeScript (Primary)

`packages/typescript/src/`

- `client/` — slot-consistent RPC reads, no signing
- `state/` — global configuration & layouts (typed)
- `liquidity/` — topology & exposure (observational)
- `execution/` — execution signal observation
- `yield/` — structural yield mechanics (non-financial)
- `risk/` — volatility bounds & constraints
- `types/` — shared types
- `utils/` — invariants and typed errors

Rust (Secondary)

`packages/rust/src/`

- `client.rs` — read-only trait surface + client
- `state.rs`, `liquidity.rs`, `execution.rs`, `yield.rs`, `risk.rs`, `types.rs`

## Security Model / Threat Model

### Trust Assumptions

- Solana RPC behaves correctly for the selected commitment.
- On-chain state is immutable for the observed slot.
- No custody and no signing exist inside this repository.

### Threat Surfaces

- Malformed account data (unexpected lengths, invalid discriminators).
- RPC slot inconsistency across multi-read workflows.
- Layout version mismatch.

### Explicit Non-Goals

- MEV extraction.
- Profit optimization.
- Front-running prevention.

## Determinism & Slot Consistency

All observational methods are required to be slot-bound.

- TypeScript: `VolatilumClient` reads multiple accounts via a single RPC context and returns raw bytes keyed by account public key, along with the slot.
- Rust: the `ReadOnlyRpc` trait requires implementations to return a slot-consistent `SlotConsistentRead`.

If a consumer needs reproducible observations, they must pin:

- the RPC endpoint(s)
- commitment level
- any minimum context slot constraints

## API Contract

Allowed conceptual methods:

- `getLiquidityTopology()`
- `observeExecutionSignals()`
- `deriveYieldCurve()`
- `getRiskConstraints()`

These methods are observational and return raw account bytes (plus slot) for external decoding. No financial outputs are produced.

## Governance & Contribution Rules

- Semantic versioning is enforced.
- Breaking changes require a major version bump.
- PRs must include:
	- linked Issue
	- tests
	- documentation updates for public API changes

Issue/PR templates live under `.github/`.

## Install / Build / Test

TypeScript:

1. `npm install`
2. `npm run build`
3. `npm run test`

Rust:

1. `cd packages/rust`
2. `cargo test`

## How to Use

This SDK is intentionally read-only. You must provide:

- an RPC endpoint (as a URL string)
- real on-chain addresses (program id + relevant account keys)

The SDK will not generate addresses, will not embed endpoints, and will not sign or send transactions.

### TypeScript (Node.js)

Install:

- From the repo root: `npm install`

Usage pattern:

1. Provide required inputs via environment variables (no defaults):
	 - `SOLANA_RPC_URL`
	 - `VOLATILUM_PROGRAM_ID`
	 - `VOLATILUM_ACCOUNT_KEYS` (comma-separated base58 public keys)
2. Construct a Solana `Connection`.
3. Instantiate `VolatilumClient`.
4. Call observational methods.

Example (no embedded endpoints or addresses):

```ts
import { Connection, PublicKey } from "@solana/web3.js";
import { VolatilumClient } from "@volatilum/sdk-typescript";

function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`Missing required env var: ${name}`);
	return value;
}

const rpcUrl = requireEnv("SOLANA_RPC_URL");
const programId = new PublicKey(requireEnv("VOLATILUM_PROGRAM_ID"));

const accountKeys = requireEnv("VOLATILUM_ACCOUNT_KEYS")
	.split(",")
	.map((s) => s.trim())
	.filter((s) => s.length > 0)
	.map((s) => new PublicKey(s));

const connection = new Connection(rpcUrl, {
	commitment: "confirmed"
});

const client = new VolatilumClient({
	connection,
	config: {
		commitment: "confirmed",
		// Optional: pin to a minimum slot for multi-read workflows.
		// minContextSlot: 0
	}
});

// Observational reads (returns raw account bytes keyed by address + a slot).
const topology = await client.getLiquidityTopology({ programId, accountKeys });
const signals = await client.observeExecutionSignals({ programId, accountKeys });
const yieldDefinition = await client.deriveYieldCurve({ programId, accountKeys });
const risk = await client.getRiskConstraints({ programId, accountKeys });

// Determinism boundary: each result is slot-bound.
console.log({
	topologySlot: topology.slot,
	signalsSlot: signals.slot,
	yieldSlot: yieldDefinition.slot,
	riskSlot: risk.slot
});
```

Determinism notes:

- Slot determinism depends on RPC behavior and commitment selection.
- For reproducible multi-step workflows, pin `commitment` and enforce `minContextSlot`.
- The SDK returns raw bytes for auditability; decoding/layout interpretation is intentionally explicit and version-aware.

### Rust

The Rust crate defines a minimal read-only trait surface (`ReadOnlyRpc`) and a `VolatilumClient` that depends on it.

- No RPC endpoint is embedded.
- You must provide an implementation of `ReadOnlyRpc` in your application (e.g., backed by your own RPC stack).

High-level usage:

1. Implement `ReadOnlyRpc::get_multiple_accounts_slot_consistent` such that it returns:
	 - a single `slot`
	 - raw account bytes keyed by base58 address
2. Instantiate `VolatilumClient` with your RPC implementation.
3. Call read-only methods (topology/signals/yield definition/risk constraints).

This keeps dependencies minimal and keeps network policy under the caller’s control.

