# VaultCover Agent

AI-monitored parametric cover for demo tokenized assets and DeFi/RWA vault exposure on Casper.

VaultCover Agent is a Casper-native prototype that shows how users can protect vault or tokenized asset exposure through an AI-monitored cover lifecycle.

The product lets a user connect a Casper wallet, claim a wallet-linked demo asset exposure, buy cover for that asset, activate protection, receive AI risk signals, submit a claim, and generate a structured cover receipt.

The MVP uses demo assets because real-world tokenized asset markets are still early on Casper. Instead of pretending the assets already exist, VaultCover creates wallet-linked demo receipts for assets like stablecoin yield notes, treasury bill exposure, invoice-backed exposure, and equity-style demo assets. These receipts let the full protection flow be demonstrated end-to-end.

---

## What VaultCover Solves

As tokenized assets, RWA vaults, and DeFi yield products grow, users need a simple way to understand and manage risk.

Most users do not want to manually track:

* vault TVL drops
* APY collapses
* oracle failures
* abnormal withdrawals
* delayed RWA payments
* strategy deviation
* risk score breaches

VaultCover acts as a parametric cover layer on top of these assets and vaults.

The core idea is simple:

```txt
User holds an asset
→ User buys cover for that asset
→ AI Risk Agent monitors risk triggers
→ Trigger event is detected
→ User submits a claim signal
→ Cover receipt is generated
```

---

## Core Feature

VaultCover’s core feature is a wallet-linked cover lifecycle.

A user can:

1. Connect Casper Wallet
2. Select a vault
3. Claim a demo asset exposure linked to their wallet
4. Create a demo cover policy for that asset
5. Activate cover
6. View the policy in their dashboard
7. Submit a claim when the AI Risk Agent detects a trigger
8. Receive a cover receipt showing the protected asset, claim status, payout simulation, and Casper Testnet proof references

This gives judges a clear product flow:

```txt
Asset → Cover → Risk Signal → Claim → Receipt
```

---

## Demo Assets

Each vault includes demo assets that represent the kind of exposure VaultCover is designed to protect.

Examples include:

* Demo Stablecoin Yield Note
* Demo Treasury Bill Receipt
* Demo RWA Invoice Exposure
* Demo TSLA Exposure Receipt
* Demo AAPL Exposure Receipt

Each claimed asset is wallet-linked and shown inside the policy and receipt flow.

The demo asset receipt proves the user has an exposure before they can create cover for it.

---

## Vaults

VaultCover currently includes three demo vaults:

### Stable Yield Vault

A lower-risk vault for stable yield exposure.

Example protected risks:

* APY collapse
* TVL drop

### RWA Invoice Vault

A real-world asset style vault for invoice-backed exposure.

Example protected risks:

* RWA payment delay
* oracle failure
* TVL drop
* strategy deviation

### High APY Experimental Vault

A higher-risk vault for aggressive yield strategies.

Example protected risks:

* APY collapse
* TVL drop
* withdrawal spike
* risk score breach

---

## AI Risk Agent

The AI Risk Agent is responsible for detecting whether a cover trigger has been breached.

In the MVP, the AI Risk Agent produces structured risk signals such as:

* vault ID
* risk score
* trigger type
* confidence score
* event summary
* recommended action
* risk report hash

Example:

```json
{
  "vault_id": "rwa-invoice-vault",
  "risk_score": 84,
  "trigger_type": "TVL_DROP",
  "confidence": "91%",
  "summary": "Vault liquidity fell 45% in 6h. TVL_DROP breached.",
  "recommended_action": "Submit claim signal"
}
```

---

## Cover Receipt

After a claim signal is submitted, VaultCover generates a structured cover receipt.

The receipt includes:

* policy ID
* vault name
* covered asset
* wallet owner
* trigger type
* claim status
* cover amount
* payout simulation
* risk report hash
* Casper Testnet transaction/proof references

The receipt is designed to be the user-facing proof that their cover lifecycle completed.

---

## Casper Integration

VaultCover is built for Casper and includes Casper Testnet proof records.

Current Casper-related implementation includes:

* Casper Wallet connection
* Casper Testnet contract deployment
* Casper Testnet proof hashes for the protocol lifecycle
* wallet-linked demo records
* contract status section showing deployment and protocol proof trail

The MVP currently uses a hybrid demo architecture:

### On-chain / Casper Testnet

* Smart contract deployed on Casper Testnet
* Contract proof hashes shown in the app
* Protocol lifecycle proof records displayed
* Casper Wallet connection
* Wallet-linked user flows

### Demo-mode / Frontend Simulation

* demo asset receipts
* demo policy creation
* cover activation
* claim submission
* payout simulation
* receipt generation

This approach keeps the demo smooth while still showing how the final product would work once full contract writes are connected for every user action.

---

## Why Demo Mode Exists

Real tokenized RWA assets are not broadly available on Casper yet.

To still demonstrate the product clearly, VaultCover uses demo asset receipts that represent assets a user might hold in the future, such as tokenized treasury bills, invoice-backed exposure, or equity-style assets.

This lets the MVP show the real product logic:

```txt
I hold this asset.
I bought cover for this asset.
A risk event happened.
I filed a claim.
I received a receipt.
```

---

## User Flow

### 1. Connect Wallet

The user connects their Casper Wallet.

### 2. Select Vault

The user chooses one of the demo vaults.

### 3. Claim Demo Asset

The user claims a wallet-linked demo asset exposure inside that vault.

### 4. Create Demo Policy

The user creates cover for the selected asset.

### 5. Activate Cover

The policy becomes active and appears in the Policies dashboard.

### 6. File Claim

When a risk trigger is active, the user submits a claim signal.

### 7. Receive Receipt

VaultCover generates a cover receipt with policy, claim, asset, and proof details.

---

## Pages

The MVP includes:

* Landing page
* Vault explorer
* Vault detail page
* Buy cover page
* Policies dashboard
* Claim signal page
* Cover receipt page
* Vault health monitor
* Risk monitor
* Contract status / proof section

---

## Tech Stack

* Next.js
* TypeScript
* Tailwind CSS
* Casper Wallet integration
* Casper Testnet
* Odra smart contract framework
* Rust smart contract
* Local wallet-linked demo state for MVP flow

---

## Smart Contract

The VaultCover smart contract was built with Odra for Casper.

Implemented contract concepts include:

* vault registration
* vault metrics
* risk events
* cover policies
* claims
* claim processing

The contract was deployed to Casper Testnet and the app displays contract/protocol proof records.

---

## MVP Scope

This is a hackathon MVP, so the goal is not to ship a production insurance protocol.

The goal is to prove the product loop:

```txt
wallet-linked asset exposure
→ parametric cover policy
→ AI-monitored risk trigger
→ claim signal
→ cover receipt
```

The MVP focuses on showing how VaultCover can become an AI-powered cover layer for tokenized assets, RWA vaults, and DeFi yield products on Casper.

---

## Future Improvements

Planned improvements include:

* full on-chain policy creation
* full on-chain claim submission
* full on-chain payout simulation records
* live vault data feeds
* oracle integration
* real tokenized asset support when available on Casper
* admin dashboard for vault operators
* richer AI risk scoring
* receipt export and verification
* user portfolio view for covered assets

---

## Demo Walkthrough

A typical demo flow:

1. Open VaultCover
2. Connect Casper Wallet
3. Go to Vaults
4. Select a vault
5. Click Buy Cover
6. Claim a demo asset receipt
7. Create a demo policy
8. Activate cover
9. Go to Policies
10. File a claim
11. Review the AI Risk Agent signal
12. Submit claim
13. View the cover receipt

---

## Summary

VaultCover Agent is an AI-monitored parametric cover prototype for Casper.

It shows how users can protect tokenized asset and vault exposure through a simple lifecycle:

```txt
Asset → Cover → Risk Signal → Claim → Receipt
```

The MVP combines Casper Testnet proof records, Casper Wallet connection, AI risk signals, wallet-linked demo assets, and structured cover receipts to demonstrate how parametric cover could work for future DeFi and RWA products on Casper.
