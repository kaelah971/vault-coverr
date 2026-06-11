"use client";

import { useSyncExternalStore, use } from "react";
import Link from "next/link";
import { getReceiptByPolicyIdSnapshot, subscribeReceipts } from "@/lib/demo-state";
import type { CoverReceipt } from "@/lib/types";
import { TxHashRow } from "@/components/TxHashRow";

function truncateHash(hash: string): string {
  if (hash.length <= 20) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ReceiptPage({
  params,
}: {
  params: Promise<{ policyId: string }>;
}) {
  const { policyId } = use(params);

  const receipt = useSyncExternalStore(
    subscribeReceipts,
    () => getReceiptByPolicyIdSnapshot(policyId),
    () => undefined as CoverReceipt | undefined
  );

  if (!receipt) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
        <h1 className="font-display text-3xl font-bold text-gold">
          Receipt Not Found
        </h1>
        <p className="mt-4 text-text-secondary">
          Submit a claim first to generate a cover receipt.
        </p>
        <Link
          href="/risk"
          className="mt-6 rounded-[6px] border border-[rgba(230,192,138,0.55)] px-6 py-3 font-semibold text-gold transition hover:bg-[rgba(230,192,138,0.08)]"
        >
          Go to Risk Monitor &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="px-5 py-20 sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[720px]">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold uppercase leading-none text-gold lg:text-5xl">
            Cover Receipt
          </h1>
          <p className="mt-3 font-mono text-sm text-text-muted">{receipt.id}</p>
        </div>

        {/* Receipt Card */}
        <div className="mt-10 overflow-hidden rounded-[16px] border border-border-default bg-surface">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-border-subtle bg-raised px-5 py-4">
            <span className="font-mono text-xs text-text-muted">
              parametric_cover_receipt.json
            </span>
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-safe">
              <span className="h-2 w-2 rounded-full bg-safe" />
              Verified
            </span>
          </div>

          {/* Receipt Details */}
          <div className="space-y-5 p-6 lg:p-8">
            {/* Policy ID */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                Policy ID
              </span>
              <span className="font-mono text-sm text-gold">{receipt.policyId}</span>
            </div>

            {/* Vault Info */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                Vault
              </span>
              <div className="text-right">
                <span className="block text-sm text-text-primary">
                  {receipt.vaultName}
                </span>
                <span className="block font-mono text-xs text-text-muted">
                  {receipt.vaultId}
                </span>
              </div>
            </div>

            {/* Trigger Type */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                Trigger Type
              </span>
              <span className="font-mono text-xs uppercase text-gold">
                {receipt.triggerType}
              </span>
            </div>

            {/* Claim Status */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                Claim Status
              </span>
              <span className="inline-flex rounded-[4px] border border-[rgba(230,192,138,0.24)] bg-[rgba(230,192,138,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-gold">
                {receipt.claimStatus}
              </span>
            </div>

            {/* Cover Amount */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                Cover Amount
              </span>
              <span className="font-mono text-sm text-text-primary">
                {receipt.coverAmountFormatted}
              </span>
            </div>

            {/* Payout Simulation */}
            <div className="rounded-xl border border-border-default bg-deep p-5">
              <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                Payout Simulation
              </span>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-mono text-3xl font-semibold text-gold">
                  {receipt.payoutAmountFormatted}
                </span>
                <span className="font-mono text-sm text-safe">
                  ({receipt.payoutPercentage}% of cover)
                </span>
              </div>
            </div>

            {/* Risk Report Hash */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-5">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                Risk Report Hash
              </span>
              <span className="font-mono text-sm text-text-secondary">
                {truncateHash(receipt.riskReportHash)}
              </span>
            </div>
          </div>

          {/* Transactions */}
          <div className="border-t border-border-subtle px-6 pb-6 pt-5 lg:px-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
              Casper Testnet Transactions
            </h3>
            <div className="divide-y divide-border-subtle">
              {receipt.transactions.map((tx) => (
                <TxHashRow key={tx.id} tx={tx} />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border-subtle px-6 py-4 lg:px-8">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>Created</span>
              <span className="font-mono">{formatDate(receipt.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/policies"
            className="inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-gold"
          >
            &larr; Back to Policies
          </Link>
        </div>
      </div>
    </div>
  );
}
