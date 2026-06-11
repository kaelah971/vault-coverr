import type { ClaimSignal } from "@/lib/types";

interface AgentSignalCardProps {
  signal: ClaimSignal;
}

function truncateHash(hash: string): string {
  if (hash.length <= 20) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

function scoreColor(score: number) {
  if (score <= 30) return "text-safe";
  if (score <= 65) return "text-gold";
  return "text-danger";
}

export function AgentSignalCard({ signal }: AgentSignalCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-default bg-surface">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border-subtle bg-raised px-5 py-4">
        <span className="font-mono text-xs text-text-muted">
          risk_agent_output.json
        </span>
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-safe">
          <span className="h-2 w-2 rounded-full bg-safe" />
          LIVE SIGNAL
        </span>
      </div>

      {/* Signal fields */}
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
            Vault ID
          </span>
          <span className="font-mono text-sm text-gold">{signal.vaultId}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
            Risk Score
          </span>
          <span
            className={`font-mono text-2xl font-semibold ${scoreColor(signal.riskScore)}`}
          >
            {signal.riskScore}
            <span className="text-sm text-text-muted"> / 100</span>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
            Trigger Type
          </span>
          <span className="font-mono text-xs uppercase text-gold">
            {signal.triggerType}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
            Confidence
          </span>
          <span className="font-mono text-sm text-text-primary">
            {signal.confidence}%
          </span>
        </div>

        <div>
          <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
            Summary
          </span>
          <p className="mt-1 font-mono text-sm leading-6 text-text-secondary">
            {signal.summary}
          </p>
        </div>

        <div className="rounded-xl border border-border-subtle bg-deep p-4">
          <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
            Recommended Action
          </span>
          <p className="mt-1 text-sm font-semibold text-gold">
            {signal.recommendedAction}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border-subtle pt-4">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
            Risk Report Hash
          </span>
          <span className="font-mono text-sm text-text-secondary">
            {truncateHash(signal.riskReportHash)}
          </span>
        </div>
      </div>

      {/* Claim action footer */}
      {signal.triggered && (
        <div className="flex flex-col gap-3 border-t border-[rgba(118,217,156,0.14)] bg-[rgba(118,217,156,0.05)] px-5 py-4 text-sm text-safe sm:flex-row sm:items-center sm:justify-between">
          <span>Claim signal generated &middot; Casper event recorded</span>
          <span className="font-semibold">Submit Claim &rarr;</span>
        </div>
      )}
    </div>
  );
}
