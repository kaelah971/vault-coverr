"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getPoliciesSnapshot, subscribePolicies, resetDemoState } from "@/lib/demo-state";
import { SectionHeader } from "@/components/SectionHeader";
import { PolicyCard } from "@/components/PolicyCard";

const EMPTY_POLICIES: never[] = [];

export default function PoliciesPage() {
  const router = useRouter();
  const policies = useSyncExternalStore(
    subscribePolicies,
    getPoliciesSnapshot,
    () => EMPTY_POLICIES
  );

  const handleReset = () => {
    resetDemoState();
    window.location.reload();
  };

  const activePolicies = policies.filter((p) => p.status === "active");
  const totalCover = policies.reduce((sum, p) => sum + p.coverAmount, 0);
  const totalPremium = policies.reduce((sum, p) => sum + p.premium, 0);

  const formatUSD = (amount: number) =>
    `$${(amount / 1000).toFixed(amount >= 1000 ? 1 : 0)}${amount >= 1000 ? "K" : ""}`;

  return (
    <div className="px-5 py-20 sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="Your Protection"
          title="Cover Policies"
          body="Active parametric cover policies with AI-monitored trigger detection."
        />

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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {policies.map((policy) => (
                <PolicyCard
                  key={policy.id}
                  policy={policy}
                  onClaim={(policyId) => router.push(`/claim/${policyId}`)}
                />
              ))}
            </div>
          </>
        )}

        {/* Reset Demo */}
        <div className="mt-16 text-center">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-text-muted underline transition hover:text-gold"
          >
            Reset Demo
          </button>
        </div>
      </div>
    </div>
  );
}
