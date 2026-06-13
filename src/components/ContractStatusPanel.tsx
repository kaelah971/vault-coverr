"use client";

import { useState } from "react";
import { useWallet } from "@/components/WalletProvider";

// ── Types ────────────────────────────────────────────────────────────────────────

type RowStatus = "ready" | "pending" | "live";

interface HashRow {
  label: string;
  value: string;
  truncate?: boolean;
}

// ── Sub-components ───────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: RowStatus }) {
  const color =
    status === "ready" || status === "live"
      ? "bg-safe"
      : "bg-gold";
  return <span className={`h-1.5 w-1.5 rounded-full ${color}`} />;
}

function statusColors(status: RowStatus) {
  switch (status) {
    case "live":
      return "border-[rgba(118,217,156,0.32)] bg-[rgba(118,217,156,0.10)] text-safe";
    case "ready":
      return "border-[rgba(118,217,156,0.24)] bg-[rgba(118,217,156,0.08)] text-safe";
    case "pending":
      return "border-[rgba(230,192,138,0.24)] bg-[rgba(230,192,138,0.06)] text-gold";
  }
}

function statusLabel(status: RowStatus) {
  switch (status) {
    case "live":
      return "Live";
    case "ready":
      return "Ready";
    case "pending":
      return "Pending";
  }
}

function StatusRow({
  label,
  status,
}: {
  label: string;
  status: RowStatus;
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <span className="text-sm font-medium text-text-primary">{label}</span>
      <span
        className={`inline-flex items-center gap-2 rounded-[4px] border px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] ${statusColors(status)}`}
      >
        <StatusDot status={status} />
        {statusLabel(status)}
      </span>
    </div>
  );
}

function truncateHash(hash: string): string {
  if (hash.length <= 20) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="9" y="9" width="13" height="13" rx="2"
        stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5"
        stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12" height="12"
      viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 6L9 17L4 12"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function HashRow({ label, value, truncate = true }: HashRow) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div className="flex items-center justify-between py-4">
      <span className="text-sm font-medium text-text-primary">{label}</span>
      <div className="flex items-center gap-2">
        <code className="rounded-[4px] border border-border-subtle bg-surface-elevated px-2 py-1 font-mono text-xs text-text-secondary">
          {truncate ? truncateHash(value) : value}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-6 w-6 items-center justify-center rounded-[4px] text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-primary"
          aria-label={copied ? "Copied" : `Copy ${label}`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  );
}

// ── Deployment hashes ────────────────────────────────────────────────────────────

const DEPLOY_HASH =
  "ff23737d43dca7740e197f8d1f0de2be107840c27d059e707272ac313b46ef32";
const PACKAGE_HASH =
  "hash-9dace66d4ce2d19118b46aa8e194a553ba1d8ad8f881a6e378f71c49751d16d8";
const CONTRACT_HASH =
  "contract-2f485675833c0abd6faa96803dd3cd02a35e6afc363fc545d2cdb4a05733b68a";

// ── Component ────────────────────────────────────────────────────────────────────

export function ContractStatusPanel() {
  const { isConnected } = useWallet();

  return (
    <div className="mt-16 border-t border-border-subtle pt-12">
      <h2 className="font-display text-2xl font-bold text-gold">
        Contract Status
      </h2>
      <p className="mt-3 max-w-2xl leading-7 text-text-secondary">
        Current state of the Casper smart contract and frontend integration.
      </p>
      <div className="mt-8 rounded-2xl border border-border-default bg-surface p-6 lg:p-8">
        <div className="divide-y divide-border-subtle">
          <StatusRow label="Contract source" status="ready" />
          <StatusRow label="Tests" status="ready" />
          <StatusRow label="WASM artifact" status="ready" />
          <StatusRow label="Wallet" status={isConnected ? "ready" : "pending"} />
          <StatusRow label="Testnet deployment" status="live" />
          <HashRow label="Deploy hash" value={DEPLOY_HASH} />
          <HashRow label="Package hash" value={PACKAGE_HASH} />
          <HashRow label="Contract hash" value={CONTRACT_HASH} />
        </div>
        <p className="mt-6 text-xs leading-5 text-text-muted">
          The VaultCover smart contract is deployed and live on Casper Testnet.
          Frontend write calls to the contract are pending integration.
          The current app uses demo state stored in your browser to simulate
          the full parametric cover flow — policy creation and claims are not
          yet on-chain.
        </p>
      </div>
    </div>
  );
}
