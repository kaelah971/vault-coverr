import { ContractStatusPanel } from "@/components/ContractStatusPanel";
import {
  ProtectionFlow,
  ProtectionSteps,
  VaultSummary,
} from "@/components/app-pages/vaults/VaultsOverview";
import { VaultExplorerCard } from "@/components/app-pages/vaults/VaultExplorerCard";
import { VAULTS } from "@/lib/mock-data";

export default function VaultsPage() {
  const totalTVL = VAULTS.reduce((sum, vault) => sum + vault.tvl, 0);
  const avgRiskScore = Math.round(
    VAULTS.reduce((sum, vault) => sum + vault.riskScore, 0) / VAULTS.length,
  );

  return (
    <div className="mx-auto min-w-0 max-w-[1280px] overflow-x-hidden [font-family:Mori,var(--font-geist-sans),-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-[#FFFCE1]">
      <header
        aria-labelledby="vaults-title"
        className="relative isolate overflow-hidden border-b border-[#42433D] pb-10 sm:pb-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,252,225,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,252,225,0.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
        />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="flex items-center gap-3 text-xs text-[#BBBAA6]">
            <span className="h-px w-8 bg-[#ABFF84]" aria-hidden="true" />
            Vault explorer / Casper Testnet
          </p>
          <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#42433D] px-4 text-[11px] font-semibold text-[#BBBAA6]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00BAE2]" aria-hidden="true" />
            Demo mode
          </span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.55fr)] lg:items-end">
          <div>
            <h1
              id="vaults-title"
              className="max-w-4xl break-words text-[clamp(2.4rem,7vw,6.5rem)] font-normal leading-[0.9]"
            >
              Compare the risk.
              <span className="block text-[#ABFF84]">Then consider the yield.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#BBBAA6] sm:text-base">
              Select a vault to inspect its health, supported triggers, and
              available parametric cover before you deposit.
            </p>
          </div>

          <div className="border-l border-[#42433D] pl-5 sm:pl-6">
            <p className="text-[10px] text-[#7C7C6F]">PORTFOLIO RISK SIGNAL</p>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-5xl font-normal text-[#FFFCE1]">
                {avgRiskScore}
              </span>
              <span className="text-sm text-[#BBBAA6]">/ 100 average</span>
            </div>
            <div
              className="mt-5 h-1 overflow-hidden bg-[#42433D]"
              role="progressbar"
              aria-label="Average vault risk score"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={avgRiskScore}
              aria-valuetext={`${avgRiskScore} out of 100 average risk`}
            >
              <div
                className="h-full bg-[#00BAE2]"
                style={{ width: `${avgRiskScore}%` }}
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-[#7C7C6F]">
              Risk scores combine vault health, liquidity, strategy behavior,
              and trigger conditions.
            </p>
          </div>
        </div>
      </header>

      <VaultSummary
        totalTVL={totalTVL}
        averageRisk={avgRiskScore}
        activeVaults={VAULTS.length}
      />

      <section aria-labelledby="available-vaults-title" className="py-12 sm:py-14">
        <div className="mb-8 grid gap-5 border-t border-[#42433D] pt-5 md:grid-cols-[0.7fr_1.5fr]">
          <p className="text-xs text-[#ABFF84]">AVAILABLE COVER</p>
          <div>
            <h2
              id="available-vaults-title"
              className="max-w-3xl text-[clamp(2rem,5vw,4rem)] font-normal leading-[0.95]"
            >
              Read the danger conditions first.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#BBBAA6] sm:text-base">
              Each vault exposes its risk score, active state, cover triggers,
              liquidity, policies, and APY in that order.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {VAULTS.map((vault) => (
            <VaultExplorerCard
              key={vault.id}
              vault={vault}
              href={`/vaults/${vault.id}`}
            />
          ))}
        </div>
      </section>

      <ProtectionFlow />
      <ProtectionSteps />

      <div className="[&_.font-display]:font-normal [&_.text-gold]:text-[#ABFF84] [&_.bg-surface]:bg-[#0E100F] [&_.bg-surface-elevated]:bg-[#191919] [&_.border-border-default]:border-[#42433D] [&_.border-border-subtle]:border-[#42433D] [&_.text-text-primary]:text-[#FFFCE1] [&_.text-text-secondary]:text-[#BBBAA6] [&_.text-text-muted]:text-[#7C7C6F] [&_.rounded-2xl]:rounded-lg">
        <ContractStatusPanel />
      </div>
    </div>
  );
}
