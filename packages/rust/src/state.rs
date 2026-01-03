//! State module.
//!
//! Purpose: shared layout/version types used when decoding on-chain configuration.

/// Layout version for deterministic decoding.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct LayoutVersion {
    pub major: u16,
    pub minor: u16,
}
