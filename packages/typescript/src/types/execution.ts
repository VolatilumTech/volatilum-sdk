import type { PublicKey } from "@solana/web3.js";
import type { Slot } from "./client.js";

/**
 * Query inputs for execution signal observation.
 */
export type ExecutionSignalsQuery = {
  programId: PublicKey;
  accountKeys: readonly PublicKey[];
};

/**
 * Execution signals observed from chain.
 *
 * Non-goal: this does not provide execution or trading capabilities.
 */
export type ExecutionSignals = {
  slot: Slot;
  accounts: Readonly<Record<string, Uint8Array>>;
};
