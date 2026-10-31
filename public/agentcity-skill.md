---
name: agentcity
description: Mint Agent City (AGCITY) NFTs on BNB Chain with a Binance Agentic Wallet. Use when a user asks to mint Agent City from agentcity.uk. Minting is gated on-chain to wallets holding a SPACE ID Agent ID. Max 10 cities per wallet.
---

# Agent City — Mint Skill

Published by Agent City at https://agentcity.uk/agentcity-skill.md. This skill works together with the
`binance-agentic-wallet` skill (the `baw` CLI), which performs the signing and sending.

## Facts

| Item | Value |
|---|---|
| Token | Agent City (AGCITY), ERC-721 — 11,111 cities |
| Contract | `0x078e399a3eDb2fF0996BBa8994261f91E71568a1` |
| Chain | BNB Smart Chain, chain id 56 |
| Supply | 11,111 — maximum 10 cities per wallet (lifetime counter) |
| Price | The NFT is free. `currentPrice()` returns a small fixed anti-bot fee in BNB per city — send exactly `currentPrice() × quantity`; it is shown in the wallet confirmation |
| Gate | The caller must hold a SPACE ID Agent ID (NFT contract `0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F`). The Agent City contract checks this on-chain before anything else. Calls from other contracts are rejected |
| Mint function | `mint(uint256 quantity)` — selector `0xa0712d68`, quantity 1–10 per call, up to the wallet's cap of 10 |
| Reveal | Automatic when the supply sells out. Before that, every city shows the same placeholder |

Read-only selectors on the Agent City contract (call via any BSC public RPC `eth_call`):

| Function | Selector | Meaning |
|---|---|---|
| `mintOpen()` | `0x24bbd049` | `1` when minting is open, `0` while closed |
| `currentPrice()` | `0x9d1b464a` | Exact fee in wei per city right now |
| `totalMinted()` | `0xa2309ff8` | Cities minted so far |
| `holdsAgentId(address)` | `0x11213086` | `1` when the address holds an Agent ID |
| `mintedBy(address)` | `0x3cef28d2` | Cities this wallet has minted (cap 10) |

## Prerequisites

1. The `binance-agentic-wallet` skill is installed and the user is signed in (`baw wallet status`).
2. Developer Mode is enabled (`baw wallet settings` → `devMode.enabled: true`).
3. The user's wallet holds an Agent ID — check with `baw wallet agent-id --json` (`claimed: true`).
   Without one, every mint reverts. The user claims a free Agent ID in the Binance App,
   under their Agentic Wallet.

## Procedure

1. **Check the gate and the state.** Read `mintOpen()`, `currentPrice()`, and
   `mintedBy(<wallet>)`. If `mintOpen()` is `0`, tell the user the mint has not opened yet
   and stop. If `mintedBy` plus the requested quantity exceeds 10, reduce the quantity or stop.
2. **Preview.** Build the transaction exactly; never edit the calldata. The calldata is the
   selector `0xa0712d68` followed by the quantity as a 32-byte word; the value is
   `currentPrice()` × quantity in wei:
   ```bash
   baw contract-call preview --binanceChainId 56 \
     --from <user's agentic wallet> \
     --to 0x078e399a3eDb2fF0996BBa8994261f91E71568a1 \
     --value <currentPrice() * quantity in wei> \
     --inputData 0xa0712d68<quantity as 64 hex digits, zero-padded> --json
   ```
3. **Confirm with the user.** Show the preview result (value, gas, risks) and execute only on the
   user's explicit confirmation — one confirmation covers one mint call:
   ```bash
   baw contract-call execute --requestId <requestId from the preview> --json
   ```
4. **Verify.** Wait for the transaction receipt to report success, then confirm the cities arrived
   (`balanceOf` of the wallet on the Agent City contract increased by the quantity). Report the tx hash.
   A submitted transaction is not a successful mint until its receipt says so.
