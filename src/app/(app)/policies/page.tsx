"use client";

import { useSyncExternalStore, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getPoliciesSnapshot, subscribePolicies, resetDemoState } from "@/lib/demo-state";
import { SectionHeader } from "@/components/SectionHeader";
import { PolicyCard } from "@/components/PolicyCard";
import { DemoModeBadge } from "@/components/DemoModeBadge";
import { useWallet } from "@/components/WalletProvider";

const EMPTY_POLICIES: never[] = [];

export default function PoliciesPage() {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const policies = useSyncExternalStore(
    subscribePolicies,
    getPoliciesSnapshot,
    () => EMPTY_POLICIES
  );

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  const handleReset = () => {
    resetDemoState();
    window.location.reload();
  };

  const filteredPolicies = showOnlyMine && address
    ? policies.filter((p) => p.ownerPublicKey === address)
    : policies;

  const activePolicies = filteredPolicies.filter((p) => p.status === "active");
  const totalCover = filteredPolicies.reduce((sum, p) => sum + p.coverAmount, 0);
  const totalPremium = filteredPolicies.reduce((sum, p) => sum + p.premium, 0);

  const walletLinkedCount = policies.filter(
    (p) => p.signedByWallet || p.ownerPublicKey
  ).length;
  const legacyCount = policies.length - walletLinkedCount;

  const formatUSD = (amount: number) =>
    `$${(amount / 1000).toFixed(amount >= 1000 ? 1 : 0)}${amount >= 1000 ? "K" : ""}`;

  return (
    <div className="px-5 py-20 sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-center gap-4">
          <SectionHeader
            eyebrow="Your Protection"
            title="Cover Policies"
            body="Active parametric cover policies with AI-monitored trigger detection."
          />
          <div className="shrink-0 self-start pt-2">
            <DemoModeBadge />
          </div>
        </div>

        {/* Info box */}
        <div className="mb-10 rounded-xl border border-[rgba(230,192,138,0.16)] bg-[rgba(230,192,138,0.04)] p-5">
          <p className="text-sm leading-6 text-text-secondary">
            These policies are wallet-linked demo records stored locally until
            Casper contract deployment is connected.
          </p>
          {policies.length > 0 && (
            <div className="mt-2 flex items-center gap-4 text-xs text-text-muted">
              <span>
                {walletLinkedCount} wallet-linked
              </span>
              <span>
                {legacyCount} legacy
              </span>
            </div>
          )}
        </div>

        {policies.length > 0 && (
          <p className="mt-2 text-xs leading-5 text-text-muted">
            Policies in this MVP are demo-mode records linked to your
            connected wallet. They show the intended VaultCover lifecycle
            before full contract write integration.
          </p>
        )}

        {policies.length === 0 ? (
          <div className="overflow-hidden rounded-2xl border border-border-default bg-surface p-12 text-center">
            <h2 className="font-display text-2xl font-bold text-text-primary">
              No active cover policies
            </h2>
            <p className="mt-3 text-text-secondary">
              Buy cover for a vault to see your policies here.
            </p>
            <Link
              href="/vaults"
              className="mt-6 inline-block rounded-[6px] border border-[rgba(230,192,138,0.55)] px-6 py-3 font-semibold text-gold transition hover:bg-[rgba(230,192,138,0.08)]"
            >
              Browse Vaults &rarr;
            </Link>
          </div>
        ) : (
          <>
            {/* Wallet filter + Clear */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              {isConnected && (
                <button
                  type="button"
                  onClick={() => setShowOnlyMine((v) => !v)}
                  className={`inline-flex items-center gap-2 rounded-[6px] border px-4 py-2 text-xs font-semibold transition ${
                    showOnlyMine
                      ? "border-[rgba(230,192,138,0.45)] bg-[rgba(230,192,138,0.08)] text-gold"
                      : "border-border-subtle bg-surface text-text-muted hover:border-border-default hover:text-text-secondary"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      showOnlyMine ? "bg-gold" : "bg-border-divider"
                    }`}
                  />
                  {showOnlyMine
                    ? "My wallet policies"
                    : "Show only my wallet policies"}
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="rounded-[6px] border border-[rgba(214,106,94,0.20)] bg-[rgba(214,106,94,0.04)] px-4 py-2 text-xs font-semibold text-text-muted transition hover:border-[rgba(214,106,94,0.45)] hover:text-danger"
              >
                Clear Demo Policies
              </button>
            </div>

            {/* Summary Strip */}
            <div className="mb-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border-default bg-surface p-5">
                <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                  Active Policies
                </span>
                <span className="mt-2 block font-mono text-3xl font-semibold text-text-primary">
                  {activePolicies.length}
                </span>
              </div>
              <div className="rounded-xl border border-border-default bg-surface p-5">
                <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                  Total Cover
                </span>
                <span className="mt-2 block font-mono text-3xl font-semibold text-text-primary">
                  {formatUSD(totalCover)}
                </span>
              </div>
              <div className="rounded-xl border border-border-default bg-surface p-5">
                <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                  Total Premium
                </span>
                <span className="mt-2 block font-mono text-3xl font-semibold text-text-primary">
                  {formatUSD(totalPremium)}
                </span>
              </div>
            </div>

            {/* Policy Grid */}
            {filteredPolicies.length === 0 ? (
              <div className="overflow-hidden rounded-2xl border border-border-default bg-surface p-10 text-center">
                <p className="text-text-secondary">
                  {showOnlyMine
                    ? "No wallet-linked policies found for your connected wallet."
                    : "No policies match the current filter."}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {filteredPolicies.map((policy) => (
                  <PolicyCard
                    key={policy.id}
                    policy={policy}
                    onClaim={(policyId) => router.push(`/claim/${policyId}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Clear Demo Policies confirmation modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-[rgba(8,10,12,0.82)] backdrop-blur-sm"
              onClick={() => setShowClearConfirm(false)}
              aria-hidden="true"
            />
            <div className="relative z-10 mx-4 w-full max-w-sm rounded-2xl border border-border-default bg-surface p-6 shadow-[0_12px_48px_rgba(0,0,0,0.56)]">
              <h3 className="font-display text-lg font-bold text-text-primary">
                Clear Demo Policies?
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                This will permanently remove all demo policies, claim signals,
                and receipts stored in this browser. This action cannot be
                undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 rounded-[6px] border border-border-subtle bg-raised px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 rounded-[6px] border border-[rgba(214,106,94,0.30)] bg-[rgba(214,106,94,0.08)] px-4 py-2.5 text-sm font-semibold text-danger transition hover:border-[rgba(214,106,94,0.55)] hover:bg-[rgba(214,106,94,0.14)]"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
