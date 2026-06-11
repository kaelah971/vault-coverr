import { VAULTS } from "@/lib/mock-data";
import { VaultCard } from "@/components/VaultCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Metric } from "@/components/Metric";

export default function VaultsPage() {
  const totalTVL = VAULTS.reduce((sum, v) => sum + v.tvl, 0);
  const avgRiskScore = Math.round(
    VAULTS.reduce((sum, v) => sum + v.riskScore, 0) / VAULTS.length
  );

  return (
    <div className="mx-auto max-w-[1280px]">
      <SectionHeader
        eyebrow="Vault Explorer"
        title="Parametric Cover Available"
        body="Select a vault to view risk metrics, supported triggers, and buy cover."
      />

      {/* Summary metrics */}
      <div className="mb-12 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border-subtle bg-surface p-5">
          <Metric label="Total Vaults" value={String(VAULTS.length)} />
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-5">
          <Metric
            label="Total TVL"
            value={`$${(totalTVL / 1_000_000).toFixed(1)}M`}
          />
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-5">
          <Metric
            label="Avg Risk Score"
            value={`${avgRiskScore} / 100`}
          />
        </div>
      </div>

      {/* Vault cards grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {VAULTS.map((vault) => (
          <VaultCard
            key={vault.id}
            vault={vault}
            href={`/vaults/${vault.id}`}
          />
        ))}
      </div>
    </div>
  );
}
