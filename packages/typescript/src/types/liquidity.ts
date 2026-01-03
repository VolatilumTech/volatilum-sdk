import type { PublicKey } from "@solana/web3.js";
import type { Slot } from "./client.js";

/**
 * Query inputs for liquidity topology observation.
 *
 * Failure boundaries:
 * - invalid inputs (missing program IDs/account addresses)
 * - RPC errors
 * - malformed or version-mismatched account data
 */
export type LiquidityTopologyQuery = {
  /**
   * Volatilum program id.
   */
  programId: PublicKey;
  /**
   * Accounts to read as topology sources (e.g., global config, registries).
   *
   * Zero-mock policy: caller supplies real account addresses.
   */
  accountKeys: readonly PublicKey[];
};

/**
 * Observed liquidity topology.
 *
 * Non-financial: represents structure and connectivity only.
 */
export type LiquidityTopology = {
  slot: Slot;
  /**
   * Raw account payloads as observed, keyed by base58 public key.
   *
   * Auditability: preserves original bytes to enable external decoding and verification.
   */
  accounts: Readonly<Record<string, Uint8Array>>;
};
