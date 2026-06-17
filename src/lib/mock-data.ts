import type { Vault, Policy, ClaimSignal, CoverReceipt } from "./types";

export const VAULTS: Vault[] = [
  {
    id: "stable-yield-vault",
    name: "Stable Yield Vault",
    tag: "Stable DeFi",
    description:
      "Low-risk vault with consistent APY and deep TVL for conservative on-chain depositors seeking parametric downside cover.",
    apy: 5.2,
    tvl: 500,
    tvlFormatted: "500 CSPR",
    baseLiquidity: 500,
    riskScore: 18,
    riskLabel: "Low",
    activePolicies: 51,
    triggers: ["APY Collapse", "TVL Drop"],
    features: [
      "Conservative yield strategy",
      "Deep liquidity pool",
      "Low volatility assets",
      "24/7 AI monitoring",
    ],
  },
  {
    id: "rwa-invoice-vault",
    name: "RWA Invoice Vault",
    tag: "RWA · Featured",
    description:
      "Invoice-backed real-world asset yield with cover available against payment delay, oracle failure, TVL drain, and strategy deviation.",
    apy: 8.4,
    tvl: 500,
    tvlFormatted: "500 CSPR",
    baseLiquidity: 500,
    riskScore: 47,
    riskLabel: "Medium",
    activePolicies: 34,
    triggers: ["TVL Drop", "RWA Payment Delay", "Oracle Failure", "Strategy Deviation"],
    features: [
      "Real-world asset backing",
      "Invoice diversification",
      "Multi-oracle price feeds",
      "Automated strategy rebalancing",
    ],
  },
  {
    id: "high-apy-experimental",
    name: "High APY Experimental Vault",
    tag: "Experimental",
    description:
      "High-risk vault demonstrating live trigger events and APY volatility. A trigger signal is active on Casper Testnet.",
    apy: 38.7,
    tvl: 500,
    tvlFormatted: "500 CSPR",
    baseLiquidity: 500,
    riskScore: 83,
    riskLabel: "High",
    activePolicies: 12,
    triggers: ["APY Collapse", "TVL Drop", "Withdrawal Spike", "Risk Score Breach"],
    features: [
      "Aggressive yield strategies",
      "High leverage exposure",
      "Rapid strategy rotation",
      "Real-time risk scoring",
    ],
  },
];

export function getVaultById(id: string): Vault | undefined {
  return VAULTS.find((v) => v.id === id);
}

export function generatePolicyId(): string {
  const chars = "abcdef0123456789";
  let id = "POL-";
  for (let i = 0; i < 16; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export function generateTxHash(): string {
  const chars = "abcdef0123456789";
  let hash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export const PAYOUT_RATE = 0.85;

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
  }
  return `$${amount}`;
}

export const DEMO_CLAIM_SIGNAL: ClaimSignal = {
  vaultId: "rwa-invoice-vault",
  vaultName: "RWA Invoice Vault",
  riskScore: 84,
  triggered: true,
  triggerType: "TVL_DROP",
  confidence: 91,
  summary: "Vault liquidity fell 45% in 6h. TVL_DROP breached.",
  recommendedAction: "Submit claim signal",
  riskReportHash: "0xd4f8a2b9c1e36547f09d82ab716ce93584f7a2b1093c6e58d1f472ba36e93a91",
  timestamp: Date.now(),
};

export function generateReceipt(policy: Policy, claimSignal: ClaimSignal): CoverReceipt {
  const payoutAmount = Math.round(policy.coverAmount * PAYOUT_RATE);

  return {
    id: `RCPT-${Date.now().toString(36).toUpperCase()}`,
    policyId: policy.id,
    vaultId: claimSignal.vaultId,
    vaultName: claimSignal.vaultName,
    triggerType: claimSignal.triggerType,
    claimStatus: "simulated",
    payoutAmount,
    payoutAmountFormatted: formatCurrency(payoutAmount),
    payoutPercentage: Math.round(PAYOUT_RATE * 100),
    coverAmount: policy.coverAmount,
    coverAmountFormatted: policy.coverAmountFormatted,
    riskReportHash: claimSignal.riskReportHash,
    transactions: [
      {
        id: "tx-1",
        type: "premium",
        hash: policy.txHash,
        label: "Cover Premium Payment",
      },
      {
        id: "tx-2",
        type: "claim",
        hash: generateTxHash(),
        label: "Claim Signal Submission",
      },
      {
        id: "tx-3",
        type: "payout",
        hash: generateTxHash(),
        label: "Payout Simulation",
      },
      {
        id: "tx-4",
        type: "receipt",
        hash: generateTxHash(),
        label: "Cover Receipt Recorded",
      },
    ],
    createdAt: Date.now(),
    ownerPublicKey: policy.ownerPublicKey,
    ownerShortAddress: policy.ownerShortAddress,
    network: policy.network ?? "Casper Testnet",
    mode: policy.mode ?? "Demo Mode",
    walletLinked: policy.signedByWallet ?? false,
  };
}
