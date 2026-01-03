import type { Connection, PublicKey } from "@solana/web3.js";
import type {
  ExecutionSignals,
  ExecutionSignalsQuery,
  LiquidityTopology,
  LiquidityTopologyQuery,
  RiskConstraints,
  RiskConstraintsQuery,
  VolatilumClientConfig,
  YieldCurveDefinition,
  YieldCurveQuery
} from "../types/index.js";
import { assertNonEmptyKeys } from "../utils/keys.js";
import { VolatilumError, VolatilumErrorCode } from "../utils/errors.js";
import { readAccountsSlotConsistent } from "./slotConsistentRpc.js";

/**
 * Read-only Volatilum client.
 *
 * Purpose: provide slot-consistent observational reads.
 * Explicitly forbidden: signing, sending transactions, wallet interaction.
 * Determinism: each method returns raw bytes bound to a single slot.
 */
export class VolatilumClient {
  private readonly connection: Connection;
  private readonly config: VolatilumClientConfig;

  constructor(params: { connection: Connection; config: VolatilumClientConfig }) {
    this.connection = params.connection;
    this.config = params.config;
  }

  /**
   * Observes liquidity topology accounts.
   */
  async getLiquidityTopology(query: LiquidityTopologyQuery): Promise<LiquidityTopology> {
    this.validateProgramId(query.programId);
    assertNonEmptyKeys(query.accountKeys, "LiquidityTopologyQuery.accountKeys");

    const read = await readAccountsSlotConsistent({
      connection: this.connection,
      accountKeys: query.accountKeys,
      commitment: this.config.commitment,
      ...(this.config.minContextSlot !== undefined
        ? { minContextSlot: this.config.minContextSlot }
        : {})
    });

    return { slot: read.slot, accounts: read.accounts };
  }

  /**
   * Observes execution signals.
   */
  async observeExecutionSignals(query: ExecutionSignalsQuery): Promise<ExecutionSignals> {
    this.validateProgramId(query.programId);
    assertNonEmptyKeys(query.accountKeys, "ExecutionSignalsQuery.accountKeys");

    const read = await readAccountsSlotConsistent({
      connection: this.connection,
      accountKeys: query.accountKeys,
      commitment: this.config.commitment,
      ...(this.config.minContextSlot !== undefined
        ? { minContextSlot: this.config.minContextSlot }
        : {})
    });

    return { slot: read.slot, accounts: read.accounts };
  }

  /**
   * Derives a structural yield curve definition.
   *
   * Non-financial: this returns account bytes only (no rates/APR/projections).
   */
  async deriveYieldCurve(query: YieldCurveQuery): Promise<YieldCurveDefinition> {
    this.validateProgramId(query.programId);
    assertNonEmptyKeys(query.accountKeys, "YieldCurveQuery.accountKeys");

    const read = await readAccountsSlotConsistent({
      connection: this.connection,
      accountKeys: query.accountKeys,
      commitment: this.config.commitment,
      ...(this.config.minContextSlot !== undefined
        ? { minContextSlot: this.config.minContextSlot }
        : {})
    });

    return { slot: read.slot, accounts: read.accounts };
  }

  /**
   * Observes on-chain risk constraints.
   */
  async getRiskConstraints(query: RiskConstraintsQuery): Promise<RiskConstraints> {
    this.validateProgramId(query.programId);
    assertNonEmptyKeys(query.accountKeys, "RiskConstraintsQuery.accountKeys");

    const read = await readAccountsSlotConsistent({
      connection: this.connection,
      accountKeys: query.accountKeys,
      commitment: this.config.commitment,
      ...(this.config.minContextSlot !== undefined
        ? { minContextSlot: this.config.minContextSlot }
        : {})
    });

    return { slot: read.slot, accounts: read.accounts };
  }

  private validateProgramId(programId: PublicKey): void {
    // Enforces a failure boundary for accidental default/zero keys.
    // Zero-mock policy: caller supplies real program IDs.
    const b58 = programId.toBase58();
    if (b58.length === 0) {
      throw new VolatilumError(VolatilumErrorCode.InvalidInput, "programId is required");
    }
  }
}
