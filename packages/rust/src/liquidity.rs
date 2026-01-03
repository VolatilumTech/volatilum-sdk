//! Liquidity module.
//!
//! Purpose: types for topology and exposure.
//!
//! Non-financial: this crate does not compute PnL, returns, or projections.

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ExposureKind {
    Unknown,
}
