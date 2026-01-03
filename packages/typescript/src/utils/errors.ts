/**
 * Typed error codes for auditability.
 */
export enum VolatilumErrorCode {
  InvalidInput = "INVALID_INPUT",
  RpcError = "RPC_ERROR",
  RpcSlotInconsistency = "RPC_SLOT_INCONSISTENCY",
  MissingAccount = "MISSING_ACCOUNT",
  MalformedAccountData = "MALFORMED_ACCOUNT_DATA",
  LayoutVersionMismatch = "LAYOUT_VERSION_MISMATCH"
}

/**
 * Base SDK error.
 */
export class VolatilumError extends Error {
  readonly code: VolatilumErrorCode;

  constructor(code: VolatilumErrorCode, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "VolatilumError";
    this.code = code;
  }
}
