//! Read-only, deterministic interface to Volatilum liquidity infrastructure.
//!
//! Non-goals:
//! - Wallet integration
//! - Transaction signing
//! - Fund movement
//! - Yield rates, APRs, or projections

pub mod client;
pub mod execution;
pub mod liquidity;
pub mod risk;
pub mod state;
pub mod types;
pub mod r#yield;
