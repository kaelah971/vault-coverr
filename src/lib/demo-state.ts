"use client";

import type { Policy, ClaimSignal, CoverReceipt } from "./types";

const POLICIES_KEY = "vaultcover_policies";
const CLAIM_SIGNAL_KEY = "vaultcover_claim_signal";
const RECEIPTS_KEY = "vaultcover_receipts";

/* ------------------------------------------------------------------ */
/*  Subscriber system                                                  */
/* ------------------------------------------------------------------ */

type Listener = () => void;
const listeners = new Set<Listener>();

function notify(): void {
  listeners.forEach((fn) => fn());
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

/* ------------------------------------------------------------------ */
/*  Module-level caches (stable references for useSyncExternalStore)    */
/* ------------------------------------------------------------------ */

let policiesCache: Policy[] = [];
let claimSignalCache: ClaimSignal | null = null;
let receiptsCache: CoverReceipt[] = [];

/* ------------------------------------------------------------------ */
/*  Cache hydration – called once on first read and after each write    */
/* ------------------------------------------------------------------ */

function hydratePolicies(): void {
  if (typeof window === "undefined") {
    policiesCache = [];
    return;
  }
  const raw = localStorage.getItem(POLICIES_KEY);
  policiesCache = raw ? JSON.parse(raw) : [];
}

function hydrateClaimSignal(): void {
  if (typeof window === "undefined") {
    claimSignalCache = null;
    return;
  }
  const raw = localStorage.getItem(CLAIM_SIGNAL_KEY);
  claimSignalCache = raw ? JSON.parse(raw) : null;
}

function hydrateReceipts(): void {
  if (typeof window === "undefined") {
    receiptsCache = [];
    return;
  }
  const raw = localStorage.getItem(RECEIPTS_KEY);
  receiptsCache = raw ? JSON.parse(raw) : [];
}

/* hydrate once at module init (safe – only runs on client) */
if (typeof window !== "undefined") {
  hydratePolicies();
  hydrateClaimSignal();
  hydrateReceipts();
}

/* ------------------------------------------------------------------ */
/*  Public helpers – cached getSnapshot + subscribe (for React)         */
/* ------------------------------------------------------------------ */

export function subscribePolicies(cb: Listener): () => void {
  return subscribe(cb);
}

export function getPoliciesSnapshot(): Policy[] {
  return policiesCache;
}

export function subscribeClaimSignal(cb: Listener): () => void {
  return subscribe(cb);
}

export function getClaimSignalSnapshot(): ClaimSignal | null {
  return claimSignalCache;
}

export function subscribeReceipts(cb: Listener): () => void {
  return subscribe(cb);
}

export function getReceiptByPolicyIdSnapshot(
  policyId: string
): CoverReceipt | undefined {
  return receiptsCache.find((r) => r.policyId === policyId);
}

/* ------------------------------------------------------------------ */
/*  Mutations – write to localStorage, hydrate cache, notify           */
/* ------------------------------------------------------------------ */

export function savePolicy(policy: Policy): void {
  if (typeof window === "undefined") return;
  hydratePolicies();
  policiesCache.push(policy);
  localStorage.setItem(POLICIES_KEY, JSON.stringify(policiesCache));
  notify();
}

export function getPolicyById(id: string): Policy | undefined {
  return policiesCache.find((p) => p.id === id);
}

export function saveClaimSignal(signal: ClaimSignal): void {
  if (typeof window === "undefined") return;
  claimSignalCache = signal;
  localStorage.setItem(CLAIM_SIGNAL_KEY, JSON.stringify(signal));
  notify();
}

export function clearClaimSignal(): void {
  if (typeof window === "undefined") return;
  claimSignalCache = null;
  localStorage.removeItem(CLAIM_SIGNAL_KEY);
  notify();
}

export function saveReceipt(receipt: CoverReceipt): void {
  if (typeof window === "undefined") return;
  hydrateReceipts();
  receiptsCache.push(receipt);
  localStorage.setItem(RECEIPTS_KEY, JSON.stringify(receiptsCache));
  notify();
}

export function resetDemoState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(POLICIES_KEY);
  localStorage.removeItem(CLAIM_SIGNAL_KEY);
  localStorage.removeItem(RECEIPTS_KEY);
  policiesCache = [];
  claimSignalCache = null;
  receiptsCache = [];
  notify();
}

/* ------------------------------------------------------------------ */
/*  Demo assets — wallet-linked claimed receipts                       */
/* ------------------------------------------------------------------ */

const ASSETS_KEY_PREFIX = "vaultcover:demo-assets:";

export interface DemoAsset {
  assetId: string;
  assetName: string;
  vaultId: string;
  vaultName: string;
  exposureValue: number;
  currency: string;
}

export interface ClaimedAsset extends DemoAsset {
  wallet: string;
  claimedAt: number;
}

const BASE_LIQUIDITY: Record<string, number> = {
  "stable-yield-vault": 500,
  "rwa-invoice-vault": 500,
  "high-apy-experimental": 500,
};

export const DEMO_ASSETS: Record<string, DemoAsset[]> = {
  "stable-yield-vault": [
    { assetId: "demo-tbill-receipt", assetName: "Demo Treasury Bill Receipt", vaultId: "stable-yield-vault", vaultName: "Stable Yield Vault", exposureValue: 10, currency: "CSPR" },
    { assetId: "demo-stable-yield-note", assetName: "Demo Stablecoin Yield Note", vaultId: "stable-yield-vault", vaultName: "Stable Yield Vault", exposureValue: 10, currency: "CSPR" },
  ],
  "rwa-invoice-vault": [
    { assetId: "demo-invoice-note", assetName: "Demo Invoice Note", vaultId: "rwa-invoice-vault", vaultName: "RWA Invoice Vault", exposureValue: 10, currency: "CSPR" },
    { assetId: "demo-trade-finance-receipt", assetName: "Demo Trade Finance Receipt", vaultId: "rwa-invoice-vault", vaultName: "RWA Invoice Vault", exposureValue: 10, currency: "CSPR" },
  ],
  "high-apy-experimental": [
    { assetId: "demo-tsla-exposure", assetName: "Demo TSLA Exposure Receipt", vaultId: "high-apy-experimental", vaultName: "High APY Experimental Vault", exposureValue: 10, currency: "CSPR" },
    { assetId: "demo-aapl-exposure", assetName: "Demo AAPL Exposure Receipt", vaultId: "high-apy-experimental", vaultName: "High APY Experimental Vault", exposureValue: 10, currency: "CSPR" },
  ],
};

function assetStoreKey(wallet: string): string {
  return `${ASSETS_KEY_PREFIX}${wallet}`;
}

export function getClaimedAssets(wallet: string | null): ClaimedAsset[] {
  if (typeof window === "undefined" || !wallet) return [];
  try {
    const raw = localStorage.getItem(assetStoreKey(wallet));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getClaimedAssetsForVault(
  wallet: string | null,
  vaultId: string
): ClaimedAsset[] {
  return getClaimedAssets(wallet).filter((a) => a.vaultId === vaultId);
}

export function claimDemoAsset(
  wallet: string,
  asset: DemoAsset
): ClaimedAsset {
  const existing = getClaimedAssets(wallet);
  if (existing.find((a) => a.assetId === asset.assetId)) {
    return existing.find((a) => a.assetId === asset.assetId)!;
  }
  const claimed: ClaimedAsset = {
    ...asset,
    wallet,
    claimedAt: Date.now(),
  };
  existing.push(claimed);
  localStorage.setItem(assetStoreKey(wallet), JSON.stringify(existing));
  notify();
  return claimed;
}

export function getDemoVaultTVL(
  vaultId: string,
  wallet: string | null
): number {
  const base = BASE_LIQUIDITY[vaultId] ?? 0;
  const claimed = getClaimedAssetsForVault(wallet, vaultId);
  const exposure = claimed.reduce((s, a) => s + a.exposureValue, 0);
  return base + exposure;
}
