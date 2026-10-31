# Agent City Contract

ERC-721 contract for the Agent City collection on BNB Smart Chain. Deployed on mainnet at 0x078e399a3eDb2fF0996BBa8994261f91E71568a1 (mint closed until launch).

- Supply: 11,111
- Max per wallet: 10
- Eligibility: Binance Agent ID gate — minters must hold a SPACE ID Agent ID NFT, checked on-chain (`holdsAgentId`)
- Anti-bot: fixed BNB fee per city, and contract wallets cannot mint
- Reveal: automatic when the supply sells out (owner can also reveal early)

Compiled with Solidity 0.8.24 against OpenZeppelin v5 and deployed through the deterministic CREATE2 deployer. Mint opens only when the owner calls `setMintOpen(true)`.
