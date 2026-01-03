# Security

## Security Model

This SDK is read-only and must not:

- manage keys
- request signatures
- sign transactions
- send transactions
- move funds

## Threat Model

### Trust Assumptions

- Correct Solana RPC behavior
- Immutable on-chain state for the observed slot
- No custody

### Threat Surfaces

- Malformed account data
- RPC slot inconsistency
- Layout version mismatch

## Reporting

If you discover a security issue, do not open a public issue.

Instead, contact the maintainers using the repository’s private security reporting channel (GitHub Security Advisories) or the contact method specified by the organization.
