import type { PublicKey } from "@solana/web3.js";
import { VolatilumError, VolatilumErrorCode } from "./errors.js";

export function assertNonEmptyKeys(keys: readonly PublicKey[], label: string): void {
  if (keys.length === 0) {
    throw new VolatilumError(
      VolatilumErrorCode.InvalidInput,
      `${label} must contain at least one public key`
    );
  }
}
