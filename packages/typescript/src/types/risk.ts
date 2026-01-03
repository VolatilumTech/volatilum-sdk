import type { PublicKey } from "@solana/web3.js";
import type { Slot } from "./client.js";

/**
 * Query inputs for risk constraint observation.
 */
export type RiskConstraintsQuery = {
  programId: PublicKey;
  accountKeys: readonly PublicKey[];
};

/**
 * Risk constraints as observed on-chain.
 *
 * Non-financial: provides bounds/constraints, not profit outcomes.
 */
export type RiskConstraints = {
  slot: Slot;
  accounts: Readonly<Record<string, Uint8Array>>;
};
