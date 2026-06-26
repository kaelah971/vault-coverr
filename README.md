VaultCover

AI-monitored parametric cover for Casper vaults.

VaultCover is an agentic risk protection prototype built for the Casper Agentic Buildathon. It helps users understand vault risk before entering a yield product, buy cover for an asset exposure, and receive AI-generated claim signals when predefined risk conditions are triggered.

The core idea is simple:

Don’t just chase APY. Cover the risk.

The Problem:

DeFi and real-world asset yield products can look attractive from the outside, but users often do not see the risk building underneath.

A vault might show strong APY while its TVL is dropping.
A real-world asset vault might depend on invoice payments that can be delayed.
A strategy might become unsafe before normal users know what changed.

Most users are not monitoring vault health, oracle status, liquidity movement, payment delays, or withdrawal behavior every hour.

That creates a gap.

Users can enter risk, but they do not always have a clear way to monitor that risk, protect against it, or respond when something breaks.

VaultCover is built to close that gap.

What VaultCover Does

VaultCover turns vault risk into an agent-monitored, coverable, and claimable user flow.

The product has four main parts:

1. Vault Explorer
    Users can compare vaults by APY, TVL, risk score, active policies, and supported risk triggers.
2. Asset Exposure Receipts
    Before buying cover, users claim a wallet-linked demo asset exposure. This represents the asset or yield position they want to protect.
3. Cover Policy Flow
    Users create and activate a cover policy for a selected vault, asset exposure, cover amount, and set of risk triggers.
4. AI Risk Agent + Claim Signal
    VaultCover’s AI Risk Agent watches vault conditions, detects trigger breaches, generates a structured claim signal, and guides the user toward claim submission.

The Agentic Layer

VaultCover is not just a static vault dashboard.

The agentic core is the AI Risk Agent.

The agent follows this loop:

Observe → Evaluate → Signal → Guide Action

Observe

The agent reads vault health signals such as APY, TVL, risk score, trigger status, and vault-specific danger conditions.

Evaluate

It checks those signals against predefined cover triggers, including:

* TVL drop
* APY collapse
* Oracle failure
* Withdrawal spike
* RWA payment delay
* Strategy deviation
* Risk score breach

Signal

When a risk condition is breached, the agent generates a structured claim signal containing:

* vault ID
* risk score
* trigger type
* confidence level
* risk summary
* recommended action
* risk report hash

Guide Action

The user can then submit the claim signal and generate a cover receipt showing the policy, wallet identity, trigger, cover amount, payout simulation, and proof references.

This makes the user flow feel less like manual monitoring and more like an intelligent cover assistant.

The user does not have to constantly ask, “Is my vault still safe?”

VaultCover’s agent watches for them.

Why This Matters

VaultCover is useful for any user who wants exposure to DeFi or RWA yield, but does not want to blindly accept the risk.

A normal user does not want to inspect vault metrics every day.
A builder does not want users to panic after risk has already happened.
A protocol does not want risk protection to feel like an afterthought.

VaultCover gives users a clearer flow:

Choose vault → claim asset exposure → buy cover → agent monitors risk → claim if trigger fires → receive receipt

That is the product loop.

Demo Mode

This build is an MVP demo, so some parts are simulated while still preserving the real product logic.

In the current version:

* Cover policies are wallet-linked demo records.
* Asset exposures are demo receipts tied to the connected wallet.
* Payouts are simulated for the MVP.
* AI risk signals are represented through structured demo outputs.
* Casper Testnet proof records are shown to demonstrate deployed contract activity and protocol lifecycle execution.

The goal of the demo is not to pretend the full production system is complete.

The goal is to show the working product loop:

asset exposure → cover policy → AI risk signal → claim submission → cover receipt

Casper Integration

VaultCover includes a deployed Casper Testnet smart contract and proof records for key protocol lifecycle actions.

The app shows contract status, deployment information, and demo lifecycle hashes so judges and users can see that the protocol logic is connected to Casper rather than being only a frontend mock.

The current demo uses Casper as the trust and proof layer for the cover protocol lifecycle.

Current MVP Features

* Casper-themed landing page
* Vault Explorer
* Vault detail pages
* Wallet connection flow
* Demo asset exposure receipts
* Wallet-linked cover policy creation
* Policy activation
* Policy dashboard
* AI Risk Agent claim signal page
* Claim submission flow
* Cover receipt page
* Contract status and Casper proof section
* Demo TVL logic based on base liquidity and claimed exposure
* README and demo flow prepared for judging

What We Are Building Next

VaultCover will continue moving from demo-mode into a fuller on-chain product.

Planned next steps include:

* Real on-chain policy creation from the frontend
* On-chain claim submission and claim state tracking
* Dynamic vault TVL based on real deposits and protected exposure
* More advanced AI Risk Agent monitoring
* Better oracle/data feeds for vault health
* Real RWA or tokenized asset integrations on Casper
* Admin controls for vault registration and risk trigger updates
* Stronger policy and receipt verification
* Production-ready user dashboard for active cover positions

Final Summary

VaultCover is an AI cover agent for risky vault exposure on Casper.

It helps users understand vault risk, protect the assets they hold, receive AI-generated claim signals when danger conditions are triggered, and produce a clear receipt trail for the cover lifecycle.

The MVP is intentionally demo-mode, but the core product direction is clear:

VaultCover turns vault risk into an agent-monitored, coverable, and claimable user flow.
