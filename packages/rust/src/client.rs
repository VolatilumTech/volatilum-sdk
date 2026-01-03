//! Client module.
//!
//! Purpose: defines read-only, slot-consistent RPC interfaces.
//!
//! This crate does not ship a concrete Solana RPC implementation to keep dependencies minimal
//! and to avoid embedding endpoint assumptions.

use crate::types::{Error, ErrorCode, RawAccounts, Slot};

/// Read-only client configuration.
#[derive(Debug, Clone, Copy)]
pub struct ClientConfig {
    /// Optional hard constraint: reject observations below this slot.
    pub min_context_slot: Option<Slot>,
}

/// An observation bound to a single slot.
#[derive(Debug, Clone)]
pub struct SlotConsistentRead {
    pub slot: Slot,
    pub accounts: RawAccounts,
}

/// Minimal read-only RPC surface.
///
/// Determinism: implementations must bind all account bytes to a single slot.
pub trait ReadOnlyRpc {
    fn get_multiple_accounts_slot_consistent(
        &self,
        account_keys_base58: &[String],
        config: ClientConfig,
    ) -> Result<SlotConsistentRead, Error>;
}

/// Volatilum read-only client.
pub struct VolatilumClient<R: ReadOnlyRpc> {
    rpc: R,
    config: ClientConfig,
}

impl<R: ReadOnlyRpc> VolatilumClient<R> {
    pub fn new(rpc: R, config: ClientConfig) -> Self {
        Self { rpc, config }
    }

    /// Observes liquidity topology account bytes.
    pub fn get_liquidity_topology(
        &self,
        program_id_base58: &str,
        account_keys_base58: &[String],
    ) -> Result<SlotConsistentRead, Error> {
        if program_id_base58.is_empty() {
            return Err(Error::new(ErrorCode::InvalidInput, "program_id_base58 is required"));
        }
        if account_keys_base58.is_empty() {
            return Err(Error::new(
                ErrorCode::InvalidInput,
                "account_keys_base58 must be non-empty",
            ));
        }
        self.rpc
            .get_multiple_accounts_slot_consistent(account_keys_base58, self.config)
    }

    /// Observes execution signal account bytes.
    pub fn observe_execution_signals(
        &self,
        program_id_base58: &str,
        account_keys_base58: &[String],
    ) -> Result<SlotConsistentRead, Error> {
        if program_id_base58.is_empty() {
            return Err(Error::new(ErrorCode::InvalidInput, "program_id_base58 is required"));
        }
        if account_keys_base58.is_empty() {
            return Err(Error::new(
                ErrorCode::InvalidInput,
                "account_keys_base58 must be non-empty",
            ));
        }
        self.rpc
            .get_multiple_accounts_slot_consistent(account_keys_base58, self.config)
    }

    /// Derives a structural yield curve definition.
    ///
    /// Non-financial: returns bytes only (no yield rates/APR/projections).
    pub fn derive_yield_curve(
        &self,
        program_id_base58: &str,
        account_keys_base58: &[String],
    ) -> Result<SlotConsistentRead, Error> {
        if program_id_base58.is_empty() {
            return Err(Error::new(ErrorCode::InvalidInput, "program_id_base58 is required"));
        }
        if account_keys_base58.is_empty() {
            return Err(Error::new(
                ErrorCode::InvalidInput,
                "account_keys_base58 must be non-empty",
            ));
        }
        self.rpc
            .get_multiple_accounts_slot_consistent(account_keys_base58, self.config)
    }

    /// Observes risk constraint account bytes.
    pub fn get_risk_constraints(
        &self,
        program_id_base58: &str,
        account_keys_base58: &[String],
    ) -> Result<SlotConsistentRead, Error> {
        if program_id_base58.is_empty() {
            return Err(Error::new(ErrorCode::InvalidInput, "program_id_base58 is required"));
        }
        if account_keys_base58.is_empty() {
            return Err(Error::new(
                ErrorCode::InvalidInput,
                "account_keys_base58 must be non-empty",
            ));
        }
        self.rpc
            .get_multiple_accounts_slot_consistent(account_keys_base58, self.config)
    }
}
