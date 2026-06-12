import Link from "next/link";
import { notFound } from "next/navigation";
import { getVaultById } from "@/lib/mock-data";
import { RiskScoreBar } from "@/components/RiskScoreBar";
import { TriggerBadge } from "@/components/TriggerBadge";
import { Metric } from "@/components/Metric";
import { DemoModeBadge } from "@/components/DemoModeBadge";

type Params = Promise<{ id: string }>;

export default async function VaultDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const vault = getVaultById(id);

  if (!vault) {
    notFound();
  }

  const riskExplanation = getRiskExplanation(vault.id);
  const protectionDetails = getProtectionDetails(vault.id);
  const triggerConsequence = getTriggerConsequence(vault.id);

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="flex items-center justify-between">
        <Link
          href="/vaults"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-gold"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Vaults
        </Link>
        <DemoModeBadge />
      </div>

      {/* Header */}
      <span className="mb-4 inline-flex rounded-[4px] border border-[rgba(230,192,138,0.24)] bg-[rgba(230,192,138,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-gold">
        {vault.tag}
      </span>
      <h1 className="font-display text-4xl font-bold text-gold lg:text-5xl">
        {vault.name}
      </h1>
      <p className="mt-4 max-w-3xl leading-7 text-text-secondary">
        {vault.description}
      </p>

      {/* Two-column grid */}
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Left column */}
        <div className="space-y-10">
          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-5">
            <Metric label="APY" value={`${vault.apy}%`} muted />
            <Metric label="TVL" value={vault.tvlFormatted} />
            <Metric
              label="Active Policies"
              value={String(vault.activePolicies)}
            />
          </div>

          {/* Risk score */}
          <div className="rounded-xl border border-border-subtle bg-surface p-6">
            <RiskScoreBar
              score={vault.riskScore}
              label={vault.riskLabel}
              showValue
            />
          </div>

          {/* Features list */}
          <div className="rounded-xl border border-border-subtle bg-surface p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-text-primary">
              Vault Features
            </h2>
            <ul className="space-y-3">
              {vault.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-safe"
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-6 text-text-secondary">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Why this vault has risk */}
          <div className="rounded-xl border border-border-subtle bg-surface p-6">
            <h2 className="mb-3 font-display text-lg font-bold text-text-primary">
              Why this vault has risk
            </h2>
            <p className="leading-7 text-text-secondary">{riskExplanation}</p>
          </div>

          {/* What this cover protects against */}
          <div className="rounded-xl border border-border-subtle bg-surface p-6">
            <h2 className="mb-3 font-display text-lg font-bold text-text-primary">
              What this cover protects against
            </h2>
            <p className="leading-7 text-text-secondary">{protectionDetails}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {vault.triggers.map((trigger) => (
                <TriggerBadge key={trigger} label={trigger} />
              ))}
            </div>
          </div>

          {/* What happens if a trigger fires */}
          <div className="rounded-xl border border-border-subtle bg-surface p-6">
            <h2 className="mb-3 font-display text-lg font-bold text-text-primary">
              What happens if a trigger fires
            </h2>
            <p className="leading-7 text-text-secondary">
              {triggerConsequence}
            </p>
          </div>

          {/* Payout simulation disclaimer */}
          <div className="rounded-xl border border-border-default bg-deep p-6">
            <h2 className="mb-3 font-display text-lg font-bold text-gold">
              Payout simulation disclaimer
            </h2>
            <p className="leading-7 text-text-secondary">
              If a covered trigger is breached, VaultCover generates a claim
              signal and records the event on Casper. The MVP uses payout
              simulation only and does not provide guaranteed payouts.
            </p>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Supported Triggers */}
          <div className="rounded-xl border border-border-subtle bg-surface p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-text-primary">
              Supported Triggers
            </h2>
            <div className="flex flex-wrap gap-2">
              {vault.triggers.map((trigger) => (
                <TriggerBadge key={trigger} label={trigger} />
              ))}
            </div>
          </div>

          {/* Buy Cover CTA */}
          <div className="rounded-xl border border-border-default bg-surface p-6">
            <h2 className="font-display text-lg font-bold text-text-primary">
              Protect this vault
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Purchase parametric cover for the {vault.name}. Premium is 1.5% of
              the cover amount, paid in CSPR on Casper Testnet.
            </p>
            <div className="mt-4 rounded-[6px] border border-border-subtle bg-raised px-4 py-3">
              <p className="text-xs uppercase tracking-[0.12em] text-text-muted">
                Premium example
              </p>
              <p className="mt-1 font-mono text-sm text-text-primary">
                $150 CSPR for $10K cover
              </p>
            </div>
            <Link
              href={`/vaults/${vault.id}/buy`}
              className="mt-5 flex w-full items-center justify-center rounded-[6px] border border-white/10 bg-gold px-6 py-3.5 text-center font-semibold text-obsidian transition hover:-translate-y-0.5 hover:bg-[#F0CCA0] hover:shadow-[0_0_24px_rgba(230,192,138,0.16)]"
            >
              Buy Cover &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom: what you get preview */}
      <div className="mt-16 border-t border-border-subtle pt-12">
        <h2 className="font-display text-2xl font-bold text-gold">
          What You Get With Cover
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-text-secondary">
          After purchasing cover for this vault, you&apos;ll receive a verifiable
          Cover Receipt on Casper Testnet with continuous AI monitoring and
          automated claim signal generation when triggers fire.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-border-subtle bg-surface p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[6px] border border-[rgba(230,192,138,0.18)] bg-[rgba(230,192,138,0.06)]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4 14V6L10 2L16 6V14L10 18L4 14Z"
                  stroke="#E6C08A"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 10V12"
                  stroke="#E6C08A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="8" r="0.5" fill="#E6C08A" />
              </svg>
            </div>
            <h3 className="font-semibold text-text-primary">
              Cover Receipt
            </h3>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              A verifiable receipt with policy details, transaction hashes, and
              payout simulation recorded on-chain.
            </p>
          </div>
          <div className="rounded-xl border border-border-subtle bg-surface p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[6px] border border-[rgba(230,192,138,0.18)] bg-[rgba(230,192,138,0.06)]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="14"
                  height="14"
                  rx="3"
                  stroke="#E6C08A"
                  strokeWidth="1.5"
                />
                <path
                  d="M7 10H13M10 7V13"
                  stroke="#E6C08A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-text-primary">
              AI Monitoring
            </h3>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              Continuous vault health scoring by the AI Risk Agent against your
              selected trigger conditions.
            </p>
          </div>
          <div className="rounded-xl border border-border-subtle bg-surface p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[6px] border border-[rgba(230,192,138,0.18)] bg-[rgba(230,192,138,0.06)]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M3 15L7 11L10 13L16 6"
                  stroke="#E6C08A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="16"
                  cy="6"
                  r="2"
                  stroke="#E6C08A"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-text-primary">
              Claim Signals
            </h3>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              When a trigger condition fires, you&apos;ll receive a hashable
              claim signal with confidence score and recommended action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Vault-specific risk copy ── */

function getRiskExplanation(vaultId: string): string {
  switch (vaultId) {
    case "stable-yield-vault":
      return "Even conservative yield vaults carry TVL concentration risk and APY erosion from protocol changes or market rate compression. This vault is lower risk, but not risk-free.";
    case "rwa-invoice-vault":
      return "Real-world asset vaults face invoice payment delays, oracle data failures, TVL concentration, and automated strategy deviations. The RWA layer introduces off-chain dependency risk.";
    case "high-apy-experimental":
      return "Experimental vaults target high yields using leveraged strategies with rapid rotation. This creates APY volatility, sudden withdrawal spikes, and elevated risk score breaches.";
    default:
      return "Every vault carries measurable risk from market conditions, protocol mechanics, and user behavior. Parametric cover provides protection against specific triggerable events.";
  }
}

function getProtectionDetails(vaultId: string): string {
  switch (vaultId) {
    case "stable-yield-vault":
      return "This cover protects against TVL drops that signal a liquidity crisis and APY collapse below sustainable thresholds. If either trigger fires, a claim signal is generated.";
    case "rwa-invoice-vault":
      return "This cover protects against TVL drain, RWA invoice payment delays, oracle feed failures, and strategy deviations outside defined parameters. Multiple trigger types provide comprehensive parametric coverage.";
    case "high-apy-experimental":
      return "This cover protects against APY collapse, sudden TVL drops, unexpected withdrawal spikes, and risk score breaches. Designed for users who want parametric cover on high-yield strategies.";
    default:
      return "Parametric cover protects against specific measurable risk triggers tracked by the AI Risk Agent. Each trigger has a defined threshold — when breached, a claim signal is generated.";
  }
}

function getTriggerConsequence(vaultId: string): string {
  switch (vaultId) {
    case "stable-yield-vault":
      return "The AI Risk Agent continuously monitors vault health. If APY collapses below threshold or TVL drops significantly, a claim signal is generated with a confidence score. The event is recorded on Casper along with a cover receipt containing a payout simulation.";
    case "rwa-invoice-vault":
      return "When any covered trigger fires — TVL drop, payment delay, oracle failure, or strategy deviation — the AI Risk Agent detects the breach and generates a claim signal. The event, including risk report hash and confidence metrics, is recorded on Casper for full auditability.";
    case "high-apy-experimental":
      return "Given the volatile nature of this vault, triggers can fire rapidly. The AI Risk Agent monitors APY, TVL, withdrawal activity, and composite risk scores. When a breach occurs, a claim signal is generated and the parametric cover response is recorded on-chain.";
    default:
      return "If a covered trigger is breached, VaultCover generates a claim signal and records the event on Casper. The MVP uses payout simulation only and does not provide guaranteed payouts.";
  }
}
