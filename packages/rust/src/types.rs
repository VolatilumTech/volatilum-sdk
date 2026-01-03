//! Shared types.

/// Solana slot number.
pub type Slot = u64;

/// Strongly typed SDK error codes for auditability.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ErrorCode {
    InvalidInput,
    RpcError,
    RpcSlotInconsistency,
    MissingAccount,
    MalformedAccountData,
    LayoutVersionMismatch,
}

/// SDK error.
#[derive(Debug)]
pub struct Error {
    pub code: ErrorCode,
    pub message: &'static str,
}

impl Error {
    pub fn new(code: ErrorCode, message: &'static str) -> Self {
        Self { code, message }
    }
}

/// Raw account bytes keyed by base58 public key string.
///
/// Auditability: the SDK does not reinterpret bytes without explicit layout information.
pub type RawAccounts = std::collections::BTreeMap<String, Vec<u8>>;
