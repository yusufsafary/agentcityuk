# Agent City Contract

Skeleton ERC-721 contract for the Agent City collection on BNB Smart Chain.

- Supply: 11,111
- Max per wallet: 10
- Eligibility: owner-managed on-chain allowlist of Binance Agentic Wallet addresses (`setEligible`)
- Anti-bot: fixed BNB fee per city, and contract wallets cannot mint
- Reveal: automatic when the supply sells out (owner can also reveal early)

Before mainnet: install OpenZeppelin v5 (`@openzeppelin/contracts`), compile with Solidity 0.8.24, write tests, get an audit, and deploy to BNB testnet first.
