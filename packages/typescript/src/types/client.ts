import type { Commitment as Web3Commitment } from "@solana/web3.js";

/**
 * Solana commitment level for reads.
 *
 * Determinism: commitment selection affects which fork/slot may be observed.
 */
export type Commitment = Web3Commitment;

/**
 * Slot number on Solana.
 */
export type Slot = number;

/**
 * A slot-consistent observation.
 *
 * Determinism: values are bound to the returned `slot`.
 */
export type SlotConsistentRead<T> = {
  slot: Slot;
  value: T;
};

/**
 * Volatilum SDK client configuration.
 *
 * Read-only: this SDK never signs or sends transactions.
 * Determinism: use a fixed `commitment` and enforce slot consistency for multi-read workflows.
 */
export type VolatilumClientConfig = {
  commitment: Commitment;
  /**
   * Optional hard constraint: refuse reads that return data from a slot below this minimum.
   */
  minContextSlot?: Slot;
};
