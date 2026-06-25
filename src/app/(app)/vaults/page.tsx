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
    <div className="mx-auto min-w-0 max-w-[1280px] overflow-x-hidden bg-[#0E100F] [font-family:Mori,var(--font-geist-sans),-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-[#FFFCE1]">
      <header
        aria-labelledby="vaults-title"
        className="relative isolate overflow-hidden rounded-lg border border-[#42433D] bg-[#0E100F] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.24)] sm:p-8 lg:p-10"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_8%,rgba(171,255,132,0.18),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(0,186,226,0.14),transparent_30%),linear-gradient(rgba(255,252,225,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,252,225,0.035)_1px,transparent_1px)] bg-[size:auto,auto,48px_48px,48px_48px] [mask-image:linear-gradient(to_bottom_right,black,transparent_88%)]"
        />
        <div
          aria-hidden="true"
          className="absolute right-6 top-6 hidden h-28 w-28 rounded-full border border-[#ABFF84]/30 shadow-[0_0_48px_rgba(171,255,132,0.16)] lg:block"
        >
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#ABFF84] shadow-[0_0_18px_rgba(171,255,132,0.8)]" />
          <span className="absolute inset-[28%] rounded-full border border-[#00BAE2]/25" />
        </div>

        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <p className="flex items-center gap-3 text-xs text-[#BBBAA6]">
            <span className="h-px w-8 bg-[#ABFF84]" aria-hidden="true" />
            Vault explorer / Casper Testnet
          </p>
          <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#42433D] bg-[#ABFF84]/[0.035] px-4 text-[11px] font-semibold text-[#BBBAA6] shadow-[0_4px_16px_rgba(0,0,0,0.24)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00BAE2]" aria-hidden="true" />
            Demo mode
          </span>
        </div>

        <div className="relative mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.55fr)] lg:items-end">
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

          <div className="rounded-lg border border-[#42433D] bg-[#0E100F]/70 p-5 shadow-[0_4px_16px_rgba(0,0,0,0.24)] sm:p-6">
            <p className="text-[10px] text-[#7C7C6F]">PORTFOLIO RISK SIGNAL</p>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-5xl font-normal leading-none text-[#FFFCE1]">
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
                className="h-full bg-[linear-gradient(90deg,#ABFF84,#00BAE2,#F7BDF8)]"
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

      <ContractStatusPanel />
    </div>
  );
}
