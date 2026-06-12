"use client";

import { useSyncExternalStore, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getClaimSignalSnapshot, subscribeClaimSignal, saveReceipt, getPolicyById, savePolicy } from "@/lib/demo-state";
import { generateReceipt, generatePolicyId, generateTxHash, getVaultById, formatCurrency } from "@/lib/mock-data";
import type { Policy } from "@/lib/types";
import { AgentSignalCard } from "@/components/AgentSignalCard";
import { SectionHeader } from "@/components/SectionHeader";
import { TriggerBadge } from "@/components/TriggerBadge";
import { DemoModeBadge } from "@/components/DemoModeBadge";
import { OnchainPendingBadge } from "@/components/OnchainPendingBadge";

export default function ClaimPage({
  params,
}: {
  params: Promise<{ policyId: string }>;
}) {
  const { policyId } = use(params);
  const router = useRouter();

  const claimSignal = useSyncExternalStore(
    subscribeClaimSignal,
    getClaimSignalSnapshot,
    () => null
  );

  const [policy] = useState<Policy | undefined>(() => getPolicyById(policyId));
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitClaim = () => {
    if (!claimSignal) return;
    setSubmitting(true);

    let activePolicy = policy;
    if (!activePolicy) {
      const vault = getVaultById(claimSignal.vaultId);
      if (vault) {
        const DEFAULT_COVER = 10_000;
        const premium = Math.round(DEFAULT_COVER * 0.015);
        const id = generatePolicyId();
        const thirtyDays = Date.now() + 30 * 24 * 60 * 60 * 1000;
        activePolicy = {
          id,
          vaultId: vault.id,
          vaultName: vault.name,
          coverAmount: DEFAULT_COVER,
          coverAmountFormatted: formatCurrency(DEFAULT_COVER),
          premium,
          premiumFormatted: `${premium} CSPR`,
          expiryTimestamp: thirtyDays,
          status: "active" as const,
          selectedTriggers: [claimSignal.triggerType],
          createdAt: Date.now(),
          txHash: generateTxHash(),
        };
        savePolicy(activePolicy);
      } else {
        setSubmitting(false);
        return;
      }
    }

    const receipt = generateReceipt(activePolicy!, claimSignal);
    saveReceipt(receipt);

    router.push(`/receipt/${activePolicy!.id}`);
  };

  return (
    <div className="px-5 py-20 sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1280px]">
        <Link
          href="/risk"
          className="mb-8 inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-gold"
        >
          &larr; Back to Risk Monitor
        </Link>

        {!claimSignal ? (
          <div className="overflow-hidden rounded-2xl border border-border-default bg-surface p-12 text-center">
            <h2 className="font-display text-2xl font-bold text-text-primary">
              No active claim signal detected
            </h2>
            <p className="mt-3 text-text-secondary">
              Visit the Risk Monitor to trigger a demo event first.
            </p>
            <Link
              href="/risk"
              className="mt-6 inline-block rounded-[6px] border border-[rgba(230,192,138,0.55)] px-6 py-3 font-semibold text-gold transition hover:bg-[rgba(230,192,138,0.08)]"
            >
              Go to Risk Monitor &rarr;
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-4">
              <SectionHeader
                eyebrow="Claim Submission"
                title="Submit Claim Signal"
                body="Review the AI Risk Agent's claim signal and submit your parametric cover claim."
              />
              <div className="flex shrink-0 flex-wrap gap-2 self-start pt-2">
                <DemoModeBadge />
                <OnchainPendingBadge />
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
              {/* Claim Signal */}
              <div>
                <AgentSignalCard signal={claimSignal} />
              </div>

              {/* Policy Summary + Submit */}
              <div className="self-start rounded-2xl border border-border-default bg-surface p-6 lg:p-8">
                <h2 className="font-display text-xl font-bold text-gold">
                  Policy Summary
                </h2>
                {policy ? (
                  <div className="mt-4 space-y-4">
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                        Policy ID
                      </span>
                      <span className="mt-1 block font-mono text-sm text-text-primary">
                        {policy.id}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                        Vault
                      </span>
                      <span className="mt-1 block text-sm text-text-primary">
                        {policy.vaultName}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                        Cover Amount
                      </span>
                      <span className="mt-1 block font-mono text-xl font-semibold text-text-primary">
                        {policy.coverAmountFormatted}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                        Selected Triggers
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {policy.selectedTriggers.map((t) => (
                          <TriggerBadge
                            key={t}
                            label={t}
                            variant={
                              t === claimSignal.triggerType ? "active" : "default"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                        Premium
                      </span>
                      <span className="mt-1 block font-mono text-xl font-semibold text-text-primary">
                        {policy.premiumFormatted}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-text-muted">
                    No policy found for this vault. A policy will be created
                    automatically when you submit the claim.
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSubmitClaim}
                  disabled={submitting}
                  className="mt-8 w-full rounded-[6px] border border-white/10 bg-gold px-7 py-4 text-center font-semibold text-obsidian transition hover:-translate-y-0.5 hover:bg-[#F0CCA0] hover:shadow-[0_0_24px_rgba(230,192,138,0.16)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Claim"}
                </button>
                <p className="mt-3 text-center text-xs text-text-muted">
                  Simulated claim submission on Casper Testnet
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
