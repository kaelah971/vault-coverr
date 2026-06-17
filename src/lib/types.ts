export interface Vault {
  id: string;
  name: string;
  tag: string;
  description: string;
  apy: number;
  tvl: number;
  tvlFormatted: string;
  baseLiquidity: number;
  riskScore: number;
  riskLabel: "Low" | "Medium" | "High";
  activePolicies: number;
  triggers: string[];
  features: string[];
}

export interface CoveredAsset {
  assetId: string;
  assetName: string;
  exposureValue: number;
  currency: string;
  claimedAt: number;
}

export interface Policy {
  id: string;
  vaultId: string;
  vaultName: string;
  coverAmount: number;
  coverAmountFormatted: string;
  premium: number;
  premiumFormatted: string;
  expiryTimestamp: number;
  status: "active" | "claimed" | "expired";
  selectedTriggers: string[];
  createdAt: number;
  txHash: string;
  ownerPublicKey?: string;
  ownerShortAddress?: string;
  network?: string;
  signedByWallet?: boolean;
  mode?: string;
  coveredAsset?: CoveredAsset;
}

export interface ClaimSignal {
  vaultId: string;
  vaultName: string;
  riskScore: number;
  triggered: boolean;
  triggerType: string;
  confidence: number;
  summary: string;
  recommendedAction: string;
  riskReportHash: string;
  timestamp: number;
}

export interface CoverReceipt {
  id: string;
  policyId: string;
  vaultId: string;
  vaultName: string;
  triggerType: string;
  claimStatus: "submitted" | "verified" | "simulated";
  payoutAmount: number;
  payoutAmountFormatted: string;
  payoutPercentage: number;
  coverAmount: number;
  coverAmountFormatted: string;
  riskReportHash: string;
  transactions: TxHash[];
  createdAt: number;
  ownerPublicKey?: string;
  ownerShortAddress?: string;
  network?: string;
  mode?: string;
  walletLinked?: boolean;
  coveredAsset?: CoveredAsset;
}

export interface TxHash {
  id: string;
  type: "premium" | "claim" | "payout" | "receipt";
  hash: string;
  label: string;
}
