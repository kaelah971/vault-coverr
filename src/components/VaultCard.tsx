import Link from "next/link";
import type { Vault } from "@/lib/types";
import { RiskScoreBar } from "@/components/RiskScoreBar";
import { TriggerBadge } from "@/components/TriggerBadge";
import { Metric } from "@/components/Metric";

interface VaultCardProps {
  vault: Vault;
  href: string;
}

export function VaultCard({ vault, href }: VaultCardProps) {
  return (
    <article className="rounded-2xl border border-border-default bg-surface p-6 transition hover:-translate-y-0.5 hover:border-[rgba(230,192,138,0.38)] lg:p-7">
      <span className="mb-5 inline-flex rounded-[4px] border border-[rgba(230,192,138,0.24)] bg-[rgba(230,192,138,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-gold">
        {vault.tag}
      </span>
      <h3 className="font-display text-2xl font-bold text-text-primary">
        {vault.name}
      </h3>
      <p className="mt-3 text-sm leading-7 text-text-muted">
        {vault.description}
      </p>

      <div className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-3">
        <Metric label="APY" value={`${vault.apy}%`} muted />
        <Metric label="TVL" value={vault.tvlFormatted} />
        <Metric label="Policies" value={String(vault.activePolicies)} />
      </div>

      <div className="mt-7">
        <RiskScoreBar score={vault.riskScore} label={vault.riskLabel} />
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {vault.triggers.map((trigger) => (
          <TriggerBadge key={trigger} label={trigger} />
        ))}
      </div>

      <div className="mt-7 flex items-center justify-between border-t border-border-subtle pt-5 text-sm text-text-secondary">
        <span className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              vault.riskScore > 80 ? "bg-danger" : "bg-safe"
            }`}
          />
          {vault.riskScore > 80 ? "Trigger Active" : "Cover Available"}
        </span>
        <Link
          href={href}
          className="rounded-[6px] border border-[rgba(230,192,138,0.55)] px-4 py-2 font-semibold text-gold transition hover:bg-[rgba(230,192,138,0.08)]"
        >
          View Vault &rarr;
        </Link>
      </div>
    </article>
  );
}
