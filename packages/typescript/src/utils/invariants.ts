import { VolatilumError, VolatilumErrorCode } from "./errors.js";

export function invariant(condition: unknown, code: VolatilumErrorCode, message: string): asserts condition {
  if (!condition) {
    throw new VolatilumError(code, message);
  }
}

