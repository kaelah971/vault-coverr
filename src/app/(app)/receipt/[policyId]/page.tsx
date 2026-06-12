"use client";

import { useSyncExternalStore, use, useState } from "react";
import Link from "next/link";
import { getReceiptByPolicyIdSnapshot, subscribeReceipts } from "@/lib/demo-state";
import type { CoverReceipt } from "@/lib/types";
import { TxHashRow } from "@/components/TxHashRow";
import { DemoModeBadge } from "@/components/DemoModeBadge";

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

  const [copiedJson, setCopiedJson] = useState(false);

  const isWalletLinked =
    receipt?.walletLinked === true || !!receipt?.ownerPublicKey;

  const handleCopyJson = async () => {
    if (!receipt) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(receipt, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

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
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <DemoModeBadge />
            {isWalletLinked ? (
              <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-[rgba(230,192,138,0.24)] bg-[rgba(230,192,138,0.06)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-gold">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Wallet-linked demo receipt
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-[rgba(166,172,205,0.3)] bg-[rgba(166,172,205,0.06)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#A6ACCD]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A6ACCD]" />
                Legacy demo receipt
              </span>
            )}
          </div>
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
            <span className="inline-flex items-center gap-2 rounded-[4px] border border-[rgba(166,172,205,0.3)] bg-[rgba(166,172,205,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#A6ACCD]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A6ACCD]" />
              Demo Receipt
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

            {/* ── Wallet Identity Section ── */}
            <div className="rounded-[6px] border border-border-subtle bg-deep px-4 py-4">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                Wallet Identity
              </span>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Owner wallet</span>
                  <span className="font-mono text-text-secondary">
                    {receipt.ownerShortAddress ?? "No wallet owner recorded"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Wallet-linked</span>
                  <span
                    className={
                      isWalletLinked ? "text-safe" : "text-text-muted"
                    }
                  >
                    {isWalletLinked ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Network</span>
                  <span className="text-text-secondary">
                    {receipt.network ?? "Casper Testnet"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Mode</span>
                  <span className="text-text-secondary">
                    {receipt.mode ?? "Demo Receipt"}
                  </span>
                </div>
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
              <p className="mt-3 text-xs leading-5 text-text-muted">
                This is a simulated payout amount. Parametric cover receipts use
                payout simulation in the MVP and do not represent guaranteed
                payouts.
              </p>
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
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                Casper Testnet Transactions
              </h3>
              <span className="rounded-[4px] border border-[rgba(166,172,205,0.2)] bg-[rgba(166,172,205,0.04)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[#A6ACCD]">
                Demo Hashes
              </span>
            </div>
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

        {/* Action row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/policies"
            className="inline-flex items-center gap-2 rounded-[6px] border border-border-subtle bg-surface px-4 py-2 text-sm text-text-secondary transition hover:border-border-default hover:text-text-primary"
          >
            &larr; Back to Policies
          </Link>
          <Link
            href="/risk"
            className="inline-flex items-center gap-2 rounded-[6px] border border-border-subtle bg-surface px-4 py-2 text-sm text-text-secondary transition hover:border-border-default hover:text-text-primary"
          >
            &larr; Risk Monitor
          </Link>
          <button
            type="button"
            onClick={handleCopyJson}
            className="inline-flex items-center gap-2 rounded-[6px] border border-border-subtle bg-surface px-4 py-2 text-sm text-text-secondary transition hover:border-border-default hover:text-text-primary"
          >
            {copiedJson ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="#76D99C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect
                    x="9"
                    y="9"
                    width="13"
                    height="13"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Copy Receipt JSON
              </>
            )}
          </button>
        </div>

        {/* Casper deployment disclaimer */}
        <div className="mt-8 rounded-2xl border border-border-default bg-deep p-6 text-center">
          <p className="text-sm leading-6 text-text-secondary">
            Verified Casper Receipt will appear here after contract deployment
            is connected. The receipt above uses demo transaction hashes and
            simulated payouts for prototype demonstration.
          </p>
        </div>
      </div>
    </div>
  );
}
