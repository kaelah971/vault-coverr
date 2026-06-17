import type { Policy } from "@/lib/types";
import { TriggerBadge } from "@/components/TriggerBadge";

interface PolicyCardProps {
  policy: Policy;
  onClaim?: (policyId: string) => void;
}

const statusStyles: Record<Policy["status"], { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "text-safe bg-[rgba(118,217,156,0.08)] border-[rgba(118,217,156,0.24)]",
  },
  claimed: {
    label: "Claimed",
    className: "text-gold bg-[rgba(230,192,138,0.08)] border-[rgba(230,192,138,0.24)]",
  },
  expired: {
    label: "Expired",
    className: "text-text-muted bg-[rgba(141,122,93,0.08)] border-[rgba(141,122,93,0.24)]",
  },
};

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PolicyCard({ policy, onClaim }: PolicyCardProps) {
  const st = statusStyles[policy.status];
  const isWalletLinked = policy.signedByWallet === true || !!policy.ownerPublicKey;

  return (
    <article className="rounded-2xl border border-border-default bg-surface p-6 transition hover:-translate-y-0.5 hover:border-[rgba(230,192,138,0.38)]">
      {/* Header: vault name + status + wallet badge */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold text-text-primary">
            {policy.vaultName}
          </h3>
          <p className="mt-1 font-mono text-xs text-text-muted">{policy.id}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span
            className={`inline-flex rounded-[4px] border px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${st.className}`}
          >
            {st.label}
          </span>
          {isWalletLinked ? (
            <span className="inline-flex rounded-[4px] border border-[rgba(230,192,138,0.24)] bg-[rgba(230,192,138,0.06)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-gold">
              Wallet-linked demo policy
            </span>
          ) : (
            <span className="inline-flex rounded-[4px] border border-[rgba(166,172,205,0.3)] bg-[rgba(166,172,205,0.06)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#A6ACCD]">
              Legacy demo policy
            </span>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-6 grid grid-cols-2 gap-4">
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
            Premium
          </span>
          <span className="mt-1 block font-mono text-xl font-semibold text-text-primary">
            {policy.premiumFormatted}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
          Expires
        </span>
        <span className="mt-1 block text-sm text-text-secondary">
          {formatDate(policy.expiryTimestamp)}
        </span>
      </div>

      {/* Triggers */}
      <div className="mt-4 flex flex-wrap gap-2">
        {policy.selectedTriggers.map((trigger) => (
          <TriggerBadge key={trigger} label={trigger} />
        ))}
      </div>

      {/* Covered Asset */}
      <div className="mt-4 rounded-[6px] border border-gold/15 bg-[rgba(230,192,138,0.04)] px-4 py-3">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-gold">
          Covered Asset
        </span>
        {policy.coveredAsset ? (
          <div className="mt-2 space-y-1 text-xs">
            <p className="text-text-primary">{policy.coveredAsset.assetName}</p>
            <p className="text-text-muted">Exposure: {policy.coveredAsset.exposureValue} {policy.coveredAsset.currency}</p>
          </div>
        ) : (
          <p className="mt-1 text-xs text-text-muted">Not linked to demo asset</p>
        )}
      </div>

      {/* Wallet Identity Section */}
      <div className="mt-5 rounded-[6px] border border-border-subtle bg-deep px-4 py-3">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">
          Wallet Identity
        </span>
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted">Owner wallet</span>
            <span className="font-mono text-text-secondary">
              {isWalletLinked
                ? policy.ownerShortAddress
                : "No wallet owner recorded"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted">Network</span>
            <span className="text-text-secondary">
              {policy.network ?? "Casper Testnet"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted">Mode</span>
            <span className="text-text-secondary">
              {policy.mode ?? "Demo Mode"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted">Wallet-linked</span>
            <span className={isWalletLinked ? "text-safe" : "text-text-muted"}>
              {isWalletLinked ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>

      {/* Footer: TX + actions */}
      <div className="mt-5 border-t border-border-subtle pt-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-text-muted">
            TX: {policy.txHash.slice(0, 10)}...
          </span>
          {policy.status === "active" && onClaim && (
            <button
              type="button"
              onClick={() => onClaim(policy.id)}
              className="rounded-[6px] border border-[rgba(230,192,138,0.55)] px-4 py-2 text-sm font-semibold text-gold transition hover:bg-[rgba(230,192,138,0.08)]"
            >
              File Claim &rarr;
            </button>
          )}
          {policy.status === "claimed" && (
            <span className="text-sm text-text-muted">Claim processed</span>
          )}
          {policy.status === "expired" && (
            <span className="text-sm text-text-muted">Cover expired</span>
          )}
        </div>
      </div>
    </article>
  );
}
