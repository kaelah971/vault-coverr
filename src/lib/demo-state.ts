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
