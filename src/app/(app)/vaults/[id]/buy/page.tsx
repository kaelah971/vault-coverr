"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VAULTS, generatePolicyId, generateTxHash, formatCurrency } from "@/lib/mock-data";
import { savePolicy, DEMO_ASSETS, getClaimedAssetsForVault, claimDemoAsset, getDemoVaultTVL } from "@/lib/demo-state";
import type { Policy } from "@/lib/types";
import { Metric } from "@/components/Metric";
import { RiskScoreBar } from "@/components/RiskScoreBar";
import { DemoModeBadge } from "@/components/DemoModeBadge";
import { OnchainPendingBadge } from "@/components/OnchainPendingBadge";
import { useWallet } from "@/components/WalletProvider";
import { formatAddress } from "@/lib/casper-wallet";

const COVER_AMOUNTS = [
  { label: "$1K", value: 1_000 },
  { label: "$5K", value: 5_000 },
  { label: "$10K", value: 10_000 },
  { label: "$25K", value: 25_000 },
  { label: "$50K", value: 50_000 },
];

const PREMIUM_RATE = 0.015;
const EXPIRY_DAYS = 30;

function createPolicyPayload(
  vault: (typeof VAULTS)[number],
  coverAmount: number,
  premium: number,
  selectedTriggers: string[],
  wallet?: { address: string | null },
  coveredAsset?: { assetId: string; assetName: string; exposureValue: number; currency: string; claimedAt: number }
): Policy {
  const now = Date.now();
  const ownerPublicKey = wallet?.address ?? undefined;
  const ownerShortAddress = ownerPublicKey
    ? formatAddress(ownerPublicKey)
    : undefined;
  return {
    id: generatePolicyId(),
    vaultId: vault.id,
    vaultName: vault.name,
    coverAmount,
    coverAmountFormatted: formatCurrency(coverAmount),
    premium,
    premiumFormatted: `${premium} CSPR`,
    expiryTimestamp: now + EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    status: "active",
    selectedTriggers,
    createdAt: now,
    txHash: generateTxHash(),
    ownerPublicKey,
    ownerShortAddress,
    network: "Casper Testnet",
    signedByWallet: !!ownerPublicKey,
    mode: "Demo Mode",
    coveredAsset,
  };
}

export default function BuyCoverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { address, isConnected, connect } = useWallet();
  const vault = VAULTS.find((v) => v.id === id);

  const [coverAmount, setCoverAmount] = useState(10_000);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(
    vault?.triggers ?? []
  );
  const [submitting, setSubmitting] = useState(false);
  const [demoPolicyCreated, setDemoPolicyCreated] = useState(false);
  const [demoPolicyId, setDemoPolicyId] = useState("");

  // ── Demo assets ──────────────────────────────────────────────────
  const demoAssets = vault ? DEMO_ASSETS[vault.id] ?? [] : [];
  const claimedAssets = getClaimedAssetsForVault(address, vault?.id ?? "");
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");

  const handleClaimAsset = (assetId: string) => {
    if (!address) return;
    const asset = demoAssets.find((a) => a.assetId === assetId);
    if (!asset) return;
    claimDemoAsset(address, asset);
    if (!selectedAssetId) setSelectedAssetId(assetId);
  };

  const selectedAsset = claimedAssets.find((a) => a.assetId === selectedAssetId) ?? claimedAssets[0] ?? null;
  const hasClaimedAsset = claimedAssets.length > 0;

  // ── Create demo policy ───────────────────────────────────────────
  const handleCreateDemoPolicy = () => {
    const v = vault!;
    const policyId = `demo-${v.id}-${new Date().getTime()}`;
    setDemoPolicyId(policyId);
    setDemoPolicyCreated(true);
    try {
      localStorage.setItem(
        `vaultcover_demo_${v.id}_${address ?? "anon"}`,
        JSON.stringify({ policyId, vaultId: v.id, createdAt: new Date().getTime(), mode: "demo", selectedAssetId })
      );
    } catch { /* noop */ }
  };

  const handleResetDemoPolicy = () => {
    const v = vault!;
    setDemoPolicyCreated(false);
    setDemoPolicyId("");
    try {
      localStorage.removeItem(`vaultcover_demo_${v.id}_${address ?? "anon"}`);
    } catch { /* noop */ }
  };

  // ── Activate cover ───────────────────────────────────────────────
  const handleActivateCover = () => {
    if (selectedTriggers.length === 0 || !isConnected || !demoPolicyCreated) return;
    setSubmitting(true);
    const policy = createPolicyPayload(
      vault!,
      coverAmount,
      premium,
      selectedTriggers,
      { address },
      selectedAsset ? { assetId: selectedAsset.assetId, assetName: selectedAsset.assetName, exposureValue: selectedAsset.exposureValue, currency: selectedAsset.currency, claimedAt: selectedAsset.claimedAt } : undefined
    );
    savePolicy(policy);
    router.push("/policies");
  };

  // ── Demo TVL ─────────────────────────────────────────────────────
  const baseTVL = getDemoVaultTVL(vault?.id ?? "", address);
  const premium = Math.round(coverAmount * PREMIUM_RATE);

  if (!vault) {
    return (
      <div className="mx-auto max-w-[800px]">
        <Link href="/vaults" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-gold">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Back to Vaults
        </Link>
        <div className="rounded-xl border border-border-subtle bg-surface p-8 text-center">
          <p className="font-display text-2xl font-bold text-text-primary">Vault Not Found</p>
          <p className="mt-2 text-text-secondary">The vault you&apos;re looking for does not exist.</p>
        </div>
      </div>
    );
  }

  const canActivate = isConnected && demoPolicyCreated && selectedTriggers.length > 0;

  return (
    <div className="mx-auto max-w-[1024px]">
      <Link href={`/vaults/${vault.id}`} className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-gold">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Back to {vault.name}
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-bold text-gold lg:text-4xl">Buy Cover</h1>
        <DemoModeBadge />
        <OnchainPendingBadge />
      </div>
      <p className="mt-3 max-w-xl leading-7 text-text-secondary">
        Select your cover amount and triggers to purchase parametric protection for the {vault.name}.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Left: Vault summary */}
        <div className="h-fit rounded-xl border border-border-subtle bg-surface p-6">
          <span className="inline-flex rounded-[4px] border border-[rgba(230,192,138,0.24)] bg-[rgba(230,192,138,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-gold">{vault.tag}</span>
          <h2 className="mt-3 font-display text-xl font-bold text-text-primary">{vault.name}</h2>
          <p className="mt-3 text-sm leading-6 text-text-muted">{vault.description}</p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Metric label="APY" value={`${vault.apy}%`} muted />
            <div className="rounded-xl border border-border-subtle bg-surface p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Demo TVL</p>
              <p className="mt-1 font-mono text-lg font-bold text-text-primary">{baseTVL.toLocaleString()} CSPR</p>
              <p className="mt-0.5 text-[10px] text-text-muted">Base + claimed exposure</p>
            </div>
          </div>
          <div className="mt-6"><RiskScoreBar score={vault.riskScore} label={vault.riskLabel} showValue /></div>
        </div>

        {/* Right: Purchase form */}
        <div className="space-y-6">
          {/* Cover Configuration */}
          <div className="rounded-xl border border-border-default bg-surface p-6 lg:p-8">
            <h2 className="font-display text-xl font-bold text-text-primary">Cover Configuration</h2>
            <p className="mt-1 text-sm text-text-muted">Configure your cover parameters before creating the demo policy.</p>
            <div className="mt-8 space-y-6">
              <div>
                <label htmlFor="cover-amount" className="block text-sm font-semibold text-text-primary">Cover Amount</label>
                <select id="cover-amount" value={coverAmount} onChange={(e) => setCoverAmount(Number(e.target.value))} className="mt-2 block w-full rounded-[6px] border border-border-default bg-raised px-4 py-3 text-sm text-text-primary transition focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold">
                  {COVER_AMOUNTS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
              </div>
              <div className="rounded-[6px] border border-border-subtle bg-raised p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-text-muted">Premium (1.5%)</p>
                <p className="mt-1 font-mono text-lg font-semibold text-text-primary">{premium} CSPR</p>
              </div>
              <fieldset>
                <legend className="text-sm font-semibold text-text-primary">Select Triggers</legend>
                <p className="mt-1 text-xs text-text-muted">At least one trigger is required.</p>
                <div className="mt-3 space-y-2">
                  {vault.triggers.map((trigger) => {
                    const checked = selectedTriggers.includes(trigger);
                    return (
                      <label key={trigger} className={`flex cursor-pointer items-center gap-3 rounded-[6px] border p-3 transition ${checked ? "border-gold bg-[rgba(230,192,138,0.06)]" : "border-border-subtle bg-raised hover:border-border-default"}`}>
                        <input type="checkbox" checked={checked} onChange={() => setSelectedTriggers((prev) => prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger])} className="h-4 w-4 rounded-[3px] border-border-default bg-raised text-gold focus:ring-gold" />
                        <span className="text-sm font-medium text-text-primary">{trigger}</span>
                      </label>
                    );
                  })}
                </div>
                {selectedTriggers.length === 0 && <p className="mt-2 text-xs text-danger">Please select at least one trigger.</p>}
              </fieldset>
              <div className="rounded-[6px] border border-border-subtle bg-raised p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-text-muted">Policy Expiry</p>
                <p className="mt-1 font-mono text-sm text-text-primary">30 days from purchase</p>
              </div>
            </div>
          </div>

          {/* ── Claim Demo Asset Receipt ──────────────────────────── */}
          <div className="rounded-2xl border border-border-default bg-surface p-6 lg:p-8">
            <h3 className="font-display text-lg font-bold text-gold">Claim Demo Asset Receipt</h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Claim a wallet-linked demo asset receipt before activating cover. This represents the RWA or yield exposure VaultCover is protecting in the MVP.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {demoAssets.map((asset) => {
                const owned = claimedAssets.some((a) => a.assetId === asset.assetId);
                const selected = selectedAssetId === asset.assetId;
                return (
                  <div key={asset.assetId} className={`rounded-xl border p-4 transition ${selected ? "border-gold bg-[rgba(230,192,138,0.06)]" : "border-border-subtle bg-deep"}`}>
                    <p className="text-sm font-semibold text-text-primary">{asset.assetName}</p>
                    <p className="mt-1 text-xs text-text-muted">{asset.exposureValue} {asset.currency} exposure</p>
                    <div className="mt-3 flex items-center gap-2">
                      {owned ? (
                        <span className="inline-flex items-center gap-1 rounded-[4px] border border-safe/20 bg-safe/10 px-2 py-0.5 text-[11px] font-semibold text-safe">Claimed</span>
                      ) : (
                        <button type="button" onClick={() => handleClaimAsset(asset.assetId)} disabled={!isConnected} className="rounded-[4px] border border-[rgba(159,183,199,0.55)] px-3 py-1 text-xs font-semibold text-[#9FB7C7] transition hover:border-[#9FB7C7] disabled:cursor-not-allowed disabled:opacity-50">
                          Claim Demo Asset
                        </button>
                      )}
                      {owned && !selected && (
                        <button type="button" onClick={() => setSelectedAssetId(asset.assetId)} className="rounded-[4px] border border-gold/30 px-3 py-1 text-xs font-semibold text-gold transition hover:border-gold">
                          Cover this
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Step 1: Demo Policy ────────────────────────────────── */}
          <div className="rounded-xl border border-[rgba(159,183,199,0.15)] bg-[rgba(159,183,199,0.04)] p-4">
            <p className="text-xs leading-5 text-[#9FB7C7]">
              Demo Mode: Policy creation and activation are simulated in-app for a smooth judge walkthrough. Receipts are wallet-linked locally and mapped to Casper Testnet proof records from the deployed VaultCover contract.
            </p>
          </div>

          <div className="rounded-2xl border border-border-default bg-surface p-6 lg:p-8">
            <h3 className="font-display text-lg font-bold text-gold">Step 1 — Create Demo Policy</h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              This creates a simulated cover policy for the selected vault. No gas is required. The demo is linked to Casper Testnet proof records shown in Contract Status.
            </p>

            <div className="mt-5">
              {!hasClaimedAsset ? (
                <div className="rounded-xl border border-[rgba(214,106,94,0.15)] bg-[rgba(214,106,94,0.04)] p-4 text-center">
                  <p className="text-sm text-danger">Claim a demo asset receipt first. VaultCover protects assets your wallet already holds.</p>
                </div>
              ) : !demoPolicyCreated ? (
                <div>
                  {selectedAsset && (
                    <div className="mb-4 rounded-lg border border-gold/15 bg-[rgba(230,192,138,0.04)] p-3">
                      <p className="text-xs text-text-muted">Covered Asset</p>
                      <p className="text-sm font-semibold text-text-primary">{selectedAsset.assetName}</p>
                      <p className="text-xs text-text-muted">{selectedAsset.exposureValue} {selectedAsset.currency} &middot; claimed {new Date(selectedAsset.claimedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                  <button type="button" onClick={handleCreateDemoPolicy} className="rounded-[6px] border border-[rgba(159,183,199,0.55)] px-6 py-3 text-center font-semibold text-[#9FB7C7] transition hover:border-[#9FB7C7] hover:-translate-y-0.5">
                    Create Demo Policy
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl border border-safe/20 bg-safe/[0.04] p-5 text-center">
                    <p className="text-sm font-semibold text-safe">Demo policy created</p>
                    <p className="mt-1 text-xs text-text-muted">{demoPolicyId}</p>
                  </div>
                  <button type="button" onClick={handleResetDemoPolicy} className="text-xs text-text-muted underline transition hover:text-gold">Create new policy</button>
                </div>
              )}
            </div>
          </div>

          {/* ── Step 2: Activate Cover ───────────────────────────────── */}
          <div className="rounded-2xl border border-border-default bg-surface p-6 lg:p-8">
            <h3 className="font-display text-lg font-bold text-gold">Step 2 — Activate Cover</h3>
            {demoPolicyCreated ? (
              <p className="mt-2 text-sm leading-6 text-text-secondary">Activate this wallet-linked demo cover and generate a receipt.</p>
            ) : (
              <p className="mt-2 text-sm leading-6 text-text-muted">Create a demo policy first. Then you can activate cover.</p>
            )}
            <div className="mt-5">
              {canActivate ? (
                <button type="button" onClick={handleActivateCover} disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-white/10 bg-gold px-6 py-3.5 text-center font-semibold text-obsidian transition hover:-translate-y-0.5 hover:bg-[#F0CCA0] hover:shadow-[0_0_24px_rgba(230,192,138,0.16)] disabled:cursor-not-allowed disabled:opacity-50">
                  {submitting ? "Processing..." : "Activate Cover \u2192"}
                </button>
              ) : (
                <div className="space-y-3">
                  <button type="button" disabled className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-border-divider bg-raised px-6 py-3.5 text-center font-semibold text-text-muted cursor-not-allowed">Activate Cover &rarr;</button>
                  {!isConnected && (
                    <>
                      <p className="text-center text-xs leading-5 text-text-muted">Connect Casper Wallet and create a demo policy first.</p>
                      <button type="button" onClick={connect} className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-[rgba(230,192,138,0.55)] bg-gold px-5 py-2.5 text-sm font-semibold text-obsidian transition hover:bg-[#F0CCA0] hover:shadow-[0_0_24px_rgba(230,192,138,0.16)]">Connect Wallet</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
