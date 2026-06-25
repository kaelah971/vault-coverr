"use client";

import { useState } from "react";
import { useWallet } from "@/components/WalletProvider";

type RowStatus = "ready" | "pending" | "live" | "completed";

interface HashRowData {
  label: string;
  value: string;
  truncate?: boolean;
}

const DEPLOY_HASH =
  "ff23737d43dca7740e197f8d1f0de2be107840c27d059e707272ac313b46ef32";
const PACKAGE_HASH =
  "hash-9dace66d4ce2d19118b46aa8e194a553ba1d8ad8f881a6e378f71c49751d16d8";
const CONTRACT_HASH =
  "hash-2f485675833c0abd6faa96803dd3cd02a35e6afc363fc545d2cdb4a05733b68a";

const LIFECYCLE_PROOF = [
  { label: "Contract deploy", hash: DEPLOY_HASH },
  { label: "Register vault - Stable Yield", hash: "4258b56777f47a35d24711b84e71c1171898e895e3306fc744148775454491d6" },
  { label: "Register vault - RWA Invoice", hash: "7385f81f5d466e1a12129df80e199941bf1f91a70a45e178993da394398f3782" },
  { label: "Register vault - High APY", hash: "2d1f755f5b0bb04a9c454ad4f68707db386d78d796eb29501bb2989b17bf88fa" },
  { label: "Update metrics - Stable Yield", hash: "42fcee4b985a992b3707dfbd1bd9f3e7efeda740da99ba6e924594fd2061e9f4" },
  { label: "Update metrics - RWA Invoice", hash: "80c7a784d257d61b364e37899c3daf1ff9042f600546944e1b29498893a34856" },
  { label: "Update metrics - High APY", hash: "0d9be7de86601cef8ef2913f5ee20f928bb449c0963d4112b58497694fa2f1c1" },
  { label: "Create cover policy", hash: "0f26e6ba09022d0f2054434a34a496c1f46f0b19c10fda2894ad53e2a2972bd6" },
  { label: "Submit risk event", hash: "c89a2b8fabba93dbb50694d1eb2bad9aca7a1a4871008051ae1d8436f6dc19dc" },
  { label: "Submit claim", hash: "4fd73edfa2ac903477f45df3608fdd98f747bd1ce224f70b3253aec898ca541d" },
  { label: "Process claim / payout", hash: "07ad7bed10f69531f142499654e1ca37c275f68bcc6b8aceeb8e6c98ef33ab79" },
];

function StatusDot({ status }: { status: RowStatus }) {
  const color = status === "pending" ? "bg-[#F7BDF8]" : "bg-[#ABFF84]";
  return <span className={`h-1.5 w-1.5 rounded-full ${color}`} />;
}

function statusColors(status: RowStatus) {
  switch (status) {
    case "live":
      return "border-[#00BAE2]/40 bg-[#00BAE2]/[0.06] text-[#00BAE2]";
    case "completed":
      return "border-[#ABFF84]/40 bg-[#ABFF84]/[0.06] text-[#ABFF84]";
    case "ready":
      return "border-[#ABFF84]/35 bg-[#ABFF84]/[0.05] text-[#ABFF84]";
    case "pending":
      return "border-[#F7BDF8]/35 bg-[#F7BDF8]/[0.05] text-[#F7BDF8]";
  }
}

function statusLabel(status: RowStatus) {
  switch (status) {
    case "live":
      return "Live";
    case "completed":
      return "Completed";
    case "ready":
      return "Ready";
    case "pending":
      return "Pending";
  }
}

function StatusRow({ label, status }: { label: string; status: RowStatus }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <span className="text-sm font-normal text-[#FFFCE1]">{label}</span>
      <span
        className={`inline-flex min-h-7 items-center gap-2 rounded-full border px-3 text-[10px] font-semibold ${statusColors(status)}`}
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
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HashRow({ label, value, truncate = true }: HashRowData) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be unavailable in restricted browser contexts.
    }
  };

  return (
    <div className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <span className="text-sm font-normal text-[#FFFCE1]">{label}</span>
      <div className="flex min-w-0 items-center gap-2">
        <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg border border-[#42433D] bg-black/20 px-2 py-1 font-mono text-xs text-[#BBBAA6] sm:flex-none">
          {truncate ? truncateHash(value) : value}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#7C7C6F] transition-colors hover:bg-[#00BAE2]/10 hover:text-[#00BAE2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BAE2] motion-reduce:transition-none"
          aria-label={copied ? "Copied" : `Copy ${label}`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  );
}

export function ContractStatusPanel() {
  const { isConnected } = useWallet();

  return (
    <div className="mt-16 space-y-12 border-t border-[#42433D] pt-12">
      <section>
        <p className="text-xs text-[#00BAE2]">CONTRACT PROOF</p>
        <h2 className="mt-3 text-3xl font-normal leading-tight text-[#FFFCE1] sm:text-4xl">
          Contract status
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#BBBAA6] sm:text-base">
          Current state of the Casper smart contract and frontend integration.
        </p>
        <div className="mt-8 rounded-lg border border-[#42433D] bg-[#0E100F]/50 p-6 shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-colors hover:border-[#BBBAA6] sm:p-8">
          <div className="divide-y divide-[#42433D]">
            <StatusRow label="Contract source" status="ready" />
            <StatusRow label="Tests" status="ready" />
            <StatusRow label="WASM artifact" status="ready" />
            <StatusRow label="Wallet" status={isConnected ? "ready" : "pending"} />
            <StatusRow label="Testnet deployment" status="live" />
            <StatusRow label="On-chain lifecycle" status="completed" />
            <HashRow label="Deploy hash" value={DEPLOY_HASH} />
            <HashRow label="Package hash" value={PACKAGE_HASH} />
            <HashRow label="Contract hash" value={CONTRACT_HASH} />
          </div>
          <p className="mt-6 text-xs leading-5 text-[#7C7C6F]">
            VaultCover&apos;s contract is deployed on Casper Testnet. This MVP uses
            wallet-linked demo records for the live product flow, while Casper
            Testnet proof hashes demonstrate the protocol lifecycle.
          </p>
        </div>
      </section>

      <section>
        <p className="text-xs text-[#ABFF84]">ON-CHAIN LIFECYCLE</p>
        <h2 className="mt-3 text-3xl font-normal leading-tight text-[#FFFCE1] sm:text-4xl">
          On-chain demo proof
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#BBBAA6] sm:text-base">
          Every step of the VaultCover protocol was executed on Casper Testnet.
          Each row below links to a verifiable deploy hash.
        </p>
        <div className="mt-8 rounded-lg border border-[#42433D] bg-[#0E100F]/50 p-6 shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-colors hover:border-[#BBBAA6] sm:p-8">
          <div className="divide-y divide-[#42433D]">
            {LIFECYCLE_PROOF.map((entry) => (
              <HashRow key={entry.hash} label={entry.label} value={entry.hash} />
            ))}
          </div>
          <p className="mt-6 text-xs leading-5 text-[#7C7C6F]">
            Twelve deploys trace the full lifecycle: three vault registrations,
            three metric updates, a cover policy, a risk event, a claim, and a
            payout simulation. All deploys are recorded on Casper Testnet and
            independently verifiable. The demo UI still uses local state for
            interaction - policy creation and claims are not yet wired to on-chain
            write calls.
          </p>
        </div>
      </section>
    </div>
  );
}
