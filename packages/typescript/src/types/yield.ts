import type { PublicKey } from "@solana/web3.js";
import type { Slot } from "./client.js";

/**
 * Query inputs for structural yield mechanics.
 */
export type YieldCurveQuery = {
  programId: PublicKey;
  accountKeys: readonly PublicKey[];
};

/**
 * Structural yield curve definition.
 *
 * Non-financial output: this SDK does not return yield rates, APRs, or projections.
 * Instead, it returns the on-chain bytes required to independently derive mechanics.
 */
export type YieldCurveDefinition = {
  slot: Slot;
  accounts: Readonly<Record<string, Uint8Array>>;
};
