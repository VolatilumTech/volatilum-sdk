import type { Commitment, Connection, PublicKey } from "@solana/web3.js";
import { VolatilumError, VolatilumErrorCode } from "../utils/errors.js";

export type SlotConsistentAccountsRead = {
  slot: number;
  accounts: Readonly<Record<string, Uint8Array>>;
};

/**
 * Reads multiple accounts and binds the results to a single RPC context slot.
 *
 * Purpose: enforce slot-consistent, read-only observations.
 * Determinism: the same RPC + commitment + inputs yields the same slot-bound bytes.
 * Failure boundaries: missing accounts, RPC failures, slot below `minContextSlot`.
 */
export async function readAccountsSlotConsistent(params: {
  connection: Connection;
  accountKeys: readonly PublicKey[];
  commitment: Commitment;
  minContextSlot?: number;
}): Promise<SlotConsistentAccountsRead> {
  const { connection, accountKeys, commitment, minContextSlot } = params;

  try {
    const res = await connection.getMultipleAccountsInfoAndContext(
      [...accountKeys],
      {
        commitment,
        ...(minContextSlot !== undefined ? { minContextSlot } : {})
      }
    );

    const slot = res.context.slot;
    if (minContextSlot !== undefined && slot < minContextSlot) {
      throw new VolatilumError(
        VolatilumErrorCode.RpcSlotInconsistency,
        `RPC returned slot ${slot} below minContextSlot ${minContextSlot}`
      );
    }

    const accounts: Record<string, Uint8Array> = {};
    for (let i = 0; i < accountKeys.length; i++) {
      const key = accountKeys[i]!;
      const info = res.value[i];
      if (!info) {
        throw new VolatilumError(
          VolatilumErrorCode.MissingAccount,
          `Missing account data for ${key.toBase58()}`
        );
      }
      accounts[key.toBase58()] = new Uint8Array(info.data);
    }

    return { slot, accounts };
  } catch (cause) {
    if (cause instanceof VolatilumError) throw cause;
    throw new VolatilumError(VolatilumErrorCode.RpcError, "RPC read failed", { cause });
  }
}
