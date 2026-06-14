# VaultCoverContract — Odra Smart Contract

AI-monitored parametric cover prototype for Casper DeFi and RWA vaults.

## Prerequisites

- [Rust toolchain](https://rustup.rs/)
- `wasm32-unknown-unknown` target:

  ```bash
  rustup target add wasm32-unknown-unknown
  ```

- [wasm-strip](https://github.com/WebAssembly/wabt) (wabt)
- [wasm-opt](https://github.com/WebAssembly/binaryen) (binaryen)
- Cargo Odra:

  ```bash
  cargo install cargo-odra --locked
  ```

## Build

```bash
cd contract
cargo odra build
```

Compiled WASM is written to `contract/wasm/`.

To build the Casper Contract Schema:

```bash
cargo odra schema
```

Schema JSON is written to `contract/resources/`.

## Test

Run against the local OdraVM (fast, no Casper node needed):

```bash
cd contract
cargo odra test
```

Run against the CasperVM backend:

```bash
cargo odra test -b casper
```

## Contract Overview

**VaultCoverContract** stores four entity types:

| Entity | Storage | Purpose |
|---|---|---|
| `Vault` | `Mapping<String, Vault>` | Registered DeFi/RWA vaults |
| `CoverPolicy` | `Mapping<String, CoverPolicy>` | Parametric cover policies |
| `RiskEvent` | `Mapping<String, RiskEvent>` | AI agent risk trigger events |
| `Claim` | `Mapping<String, Claim>` | Claim submissions and payouts |

### Entrypoints

| Entrypoint | Args | Description |
|---|---|---|
| `init()` | — | Initializes empty state |
| `register_vault` | vault_id, name_hash, category, metadata_hash | Register a new vault |
| `update_vault_metrics` | vault_id, apy, tvl, risk_score | Update vault APY/TVL/risk |
| `create_cover_policy` | policy_id, vault_id, cover_amount, premium, expiry | Create a cover policy |
| `submit_risk_event` | risk_event_id, vault_id, trigger_type, risk_score, evidence_hash, confidence | Submit AI risk event |
| `submit_claim` | claim_id, policy_id, risk_event_id | Submit a claim signal |
| `process_claim` | claim_id, approved, payout_amount | Process claim (payout simulation) |
| `get_vault` | vault_id | Read vault data |
| `get_policy` | policy_id | Read policy data |
| `get_risk_event` | risk_event_id | Read risk event data |
| `get_claim` | claim_id | Read claim data |

### Events

| Event | Emitted when |
|---|---|
| `VaultRegistered` | A vault is registered |
| `VaultMetricsUpdated` | Vault metrics are updated |
| `CoverPolicyCreated` | A new cover policy is created |
| `RiskEventSubmitted` | A risk event is submitted |
| `ClaimSubmitted` | A claim is submitted |
| `ClaimProcessed` | A claim is processed |

### Errors

| Error | Discriminant |
|---|---|
| `VaultAlreadyExists` | 1 |
| `VaultNotFound` | 2 |
| `VaultNotActive` | 3 |
| `PolicyAlreadyExists` | 4 |
| `PolicyNotFound` | 5 |
| `PolicyExpired` | 6 |
| `RiskEventAlreadyExists` | 7 |
| `RiskEventNotFound` | 8 |
| `ClaimAlreadyExists` | 9 |
| `ClaimNotFound` | 10 |
| `ClaimAlreadyProcessed` | 11 |
| `AccessDenied` | 12 |

## Demo Flow — Example Calls

These calls replicate the VaultCover Agent frontend demo on Casper Testnet.

### 1. Register three demo vaults

```bash
# Stable Yield Vault (low risk)
casper-client put-deploy \
  --chain-name casper-test \
  --node-address http://<NODE_IP>:7777 \
  --secret-key /path/to/secret_key.pem \
  --session-hash <CONTRACT_HASH> \
  --session-entry-point "register_vault" \
  --session-arg "vault_id:string='stable-yield-vault'" \
  --session-arg "name_hash:string='0xabc001'" \
  --session-arg "category:string='Stable DeFi'" \
  --session-arg "metadata_hash:string='0xmeta001'"

# RWA Invoice Vault (medium risk)
casper-client put-deploy \
  ... \
  --session-arg "vault_id:string='rwa-invoice-vault'" \
  --session-arg "name_hash:string='0xdef001'" \
  --session-arg "category:string='RWA · Featured'" \
  --session-arg "metadata_hash:string='0xmeta002'"

# High APY Experimental Vault (high risk)
casper-client put-deploy \
  ... \
  --session-arg "vault_id:string='high-apy-experimental'" \
  --session-arg "name_hash:string='0xghi001'" \
  --session-arg "category:string='Experimental'" \
  --session-arg "metadata_hash:string='0xmeta003'"
```

### 2. Update vault metrics

```bash
# Stable Yield: APY 5.2%, TVL $4.7M, risk 18
casper-client put-deploy \
  --session-hash <CONTRACT_HASH> \
  --session-entry-point "update_vault_metrics" \
  --session-arg "vault_id:string='stable-yield-vault'" \
  --session-arg "apy:u64='520'" \
  --session-arg "tvl:u64='4700000'" \
  --session-arg "risk_score:u8='18'"

# RWA Invoice: APY 8.4%, TVL $2.1M, risk 47
--session-arg "vault_id:string='rwa-invoice-vault'" \
--session-arg "apy:u64='840'" \
--session-arg "tvl:u64='2100000'" \
--session-arg "risk_score:u8='47'"

# High APY Experimental: APY 38.7%, TVL $0.8M, risk 83
--session-arg "vault_id:string='high-apy-experimental'" \
--session-arg "apy:u64='3870'" \
--session-arg "tvl:u64='800000'" \
--session-arg "risk_score:u8='83'"
```

### 3. Create cover policy

```bash
casper-client put-deploy \
  --session-hash <CONTRACT_HASH> \
  --session-entry-point "create_cover_policy" \
  --session-arg "policy_id:string='POL-a1b2c3d4e5f6a7b8'" \
  --session-arg "vault_id:string='rwa-invoice-vault'" \
  --session-arg "cover_amount:u64='10000'" \
  --session-arg "premium:u64='150'" \
  --session-arg "expiry:u64='172800000'"
```

### 4. Submit risk event (AI Risk Agent detects TVL_DROP)

```bash
casper-client put-deploy \
  --session-hash <CONTRACT_HASH> \
  --session-entry-point "submit_risk_event" \
  --session-arg "risk_event_id:string='REV-d4f8a2b9'" \
  --session-arg "vault_id:string='rwa-invoice-vault'" \
  --session-arg "trigger_type:string='TVL_DROP'" \
  --session-arg "risk_score:u8='84'" \
  --session-arg "evidence_hash:string='0xd4f8a2b9c1e36547f09d82ab716ce93584f7a2b1093c6e58d1f472ba36e93a91'" \
  --session-arg "confidence:u8='91'"
```

### 5. Submit claim

```bash
casper-client put-deploy \
  --session-hash <CONTRACT_HASH> \
  --session-entry-point "submit_claim" \
  --session-arg "claim_id:string='CLM-ff1e2d3c4b5a6978'" \
  --session-arg "policy_id:string='POL-a1b2c3d4e5f6a7b8'" \
  --session-arg "risk_event_id:string='REV-d4f8a2b9'"
```

### 6. Process claim as payout simulation

```bash
casper-client put-deploy \
  --session-hash <CONTRACT_HASH> \
  --session-entry-point "process_claim" \
  --session-arg "claim_id:string='CLM-ff1e2d3c4b5a6978'" \
  --session-arg "approved:bool='true'" \
  --session-arg "payout_amount:u64='8500'"
```

### 7. Read claim (verify Cover Receipt)

```bash
casper-client put-deploy \
  --session-hash <CONTRACT_HASH> \
  --session-entry-point "get_claim" \
  --session-arg "claim_id:string='CLM-ff1e2d3c4b5a6978'"
```

## On-chain Demo Proof — Casper Testnet

The full protocol lifecycle has been executed on Casper Testnet. Each deploy is
independently verifiable via the Casper block explorer.

| Step | Deploy Hash |
|---|---|
| Contract deploy | `ff23737d43dca7740e197f8d1f0de2be107840c27d059e707272ac313b46ef32` |
| Register vault — Stable Yield | `4258b56777f47a35d24711b84e71c1171898e895e3306fc744148775454491d6` |
| Register vault — RWA Invoice | `7385f81f5d466e1a12129df80e199941bf1f91a70a45e178993da394398f3782` |
| Register vault — High APY | `2d1f755f5b0bb04a9c454ad4f68707db386d78d796eb29501bb2989b17bf88fa` |
| Update metrics — Stable Yield | `42fcee4b985a992b3707dfbd1bd9f3e7efeda740da99ba6e924594fd2061e9f4` |
| Update metrics — RWA Invoice | `80c7a784d257d61b364e37899c3daf1ff9042f600546944e1b29498893a34856` |
| Update metrics — High APY | `0d9be7de86601cef8ef2913f5ee20f928bb449c0963d4112b58497694fa2f1c1` |
| Create cover policy | `0f26e6ba09022d0f2054434a34a496c1f46f0b19c10fda2894ad53e2a2972bd6` |
| Submit risk event | `c89a2b8fabba93dbb50694d1eb2bad9aca7a1a4871008051ae1d8436f6dc19dc` |
| Submit claim | `4fd73edfa2ac903477f45df3608fdd98f747bd1ce224f70b3253aec898ca541d` |
| Process claim / payout | `07ad7bed10f69531f142499654e1ca37c275f68bcc6b8aceeb8e6c98ef33ab79` |

**Contract hash:** `hash-2f485675833c0abd6faa96803dd3cd02a35e6afc363fc545d2cdb4a05733b68a`
**Package hash:** `hash-9dace66d4ce2d19118b46aa8e194a553ba1d8ad8f881a6e378f71c49751d16d8`

## Legal-Safe Language

This contract implements a **parametric cover prototype**. It does NOT implement insurance, guaranteed payouts, underwritten policies, or regulated claims. All payouts are simulated and recorded as verifiable on-chain events on Casper Testnet.
