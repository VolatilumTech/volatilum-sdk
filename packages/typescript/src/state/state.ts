/**
 * State module.
 *
 * Purpose: provides typed shapes used to represent on-chain configuration.
 * Determinism: no implicit defaults; callers must supply concrete inputs.
 */
export type VolatilumStateLayoutVersion = {
  readonly major: number;
  readonly minor: number;
};
