import test from "node:test";
import assert from "node:assert/strict";
import { VolatilumError, VolatilumErrorCode } from "./errors.js";

test("VolatilumError carries a typed code", () => {
  const err = new VolatilumError(VolatilumErrorCode.InvalidInput, "bad input");
  assert.equal(err.code, VolatilumErrorCode.InvalidInput);
});
