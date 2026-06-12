"use client";

import { useWallet } from "@/components/WalletProvider";

// ── Sub-component ──────────────────────────────────────────────────────────────

function StatusRow({
  label,
  status,
}: {
  label: string;
  status: "ready" | "pending";
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <span className="text-sm font-medium text-text-primary">{label}</span>
      <span
        className={`inline-flex items-center gap-2 rounded-[4px] border px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] ${
          status === "ready"
            ? "border-[rgba(118,217,156,0.24)] bg-[rgba(118,217,156,0.08)] text-safe"
            : "border-[rgba(230,192,138,0.24)] bg-[rgba(230,192,138,0.06)] text-gold"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            status === "ready" ? "bg-safe" : "bg-gold"
          }`}
        />
        {status === "ready" ? "Ready" : "Pending"}
      </span>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export function ContractStatusPanel() {
  const { isConnected } = useWallet();

  return (
    <div className="mt-16 border-t border-border-subtle pt-12">
      <h2 className="font-display text-2xl font-bold text-gold">
        Contract Status
      </h2>
      <p className="mt-3 max-w-2xl leading-7 text-text-secondary">
        Current state of the Casper smart contract and frontend integration.
        All items are updated as the build progresses.
      </p>
      <div className="mt-8 rounded-2xl border border-border-default bg-surface p-6 lg:p-8">
        <div className="divide-y divide-border-subtle">
          <StatusRow label="Contract source" status="ready" />
          <StatusRow label="Tests" status="ready" />
          <StatusRow label="WASM artifact" status="ready" />
          <StatusRow label="Wallet" status={isConnected ? "ready" : "pending"} />
          <StatusRow
            label="Testnet deployment"
            status="pending"
          />
          <StatusRow
            label="Frontend wallet connection"
            status={isConnected ? "ready" : "pending"}
          />
        </div>
        <p className="mt-6 text-xs leading-5 text-text-muted">
          The Casper smart contract source is written, tested, and compiles to
          a WASM artifact. Testnet deployment and frontend wallet integration
          are the next steps. The current app uses demo state stored in your
          browser to simulate the full parametric cover flow.
        </p>
      </div>
    </div>
  );
}
