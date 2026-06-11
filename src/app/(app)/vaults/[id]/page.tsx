import Link from "next/link";
import { notFound } from "next/navigation";
import { getVaultById } from "@/lib/mock-data";
import { RiskScoreBar } from "@/components/RiskScoreBar";
import { TriggerBadge } from "@/components/TriggerBadge";
import { Metric } from "@/components/Metric";

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

  return (
    <div className="mx-auto max-w-[1280px]">
      {/* Back link */}
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
