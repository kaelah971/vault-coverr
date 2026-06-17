import { VAULTS } from "@/lib/mock-data";
import { VaultCard } from "@/components/VaultCard";
import { SectionHeader } from "@/components/SectionHeader";
import { DemoModeBadge } from "@/components/DemoModeBadge";
import { ContractStatusPanel } from "@/components/ContractStatusPanel";

export default function VaultsPage() {
  const totalTVL = VAULTS.reduce((sum, v) => sum + v.tvl, 0);
  const avgRiskScore = Math.round(
    VAULTS.reduce((sum, v) => sum + v.riskScore, 0) / VAULTS.length
  );

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="mb-8 flex items-center gap-4">
        <SectionHeader
          eyebrow="Vault Explorer"
          title="Parametric Cover Available"
          body="Select a vault to view risk metrics, supported triggers, and buy cover."
        />
        <div className="shrink-0 self-start pt-2">
          <DemoModeBadge />
        </div>
      </div>

      {/* Demo TVL Summary */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border-subtle bg-surface p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Total Demo TVL</p>
          <p className="mt-1 font-mono text-xl font-bold text-text-primary">{totalTVL} CSPR</p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Avg Risk Score</p>
          <p className="mt-1 font-mono text-xl font-bold text-text-primary">{avgRiskScore}/100</p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Active Vaults</p>
          <p className="mt-1 font-mono text-xl font-bold text-text-primary">{VAULTS.length}</p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Network</p>
          <p className="mt-1 font-mono text-lg font-bold text-text-primary">Casper Testnet</p>
        </div>
      </div>

      {/* Product clarity section */}
      <div className="mb-12 rounded-2xl border border-border-default bg-surface p-6 lg:p-8">
        <h2 className="font-display text-2xl font-bold text-gold">
          What are these vaults?
        </h2>
        <p className="mt-3 max-w-3xl leading-7 text-text-secondary">
          These are Casper Testnet demo vaults used to show how VaultCover
          protects users from measurable vault risk. The vaults represent yield
          products a user might deposit into, while VaultCover sits on top as a
          parametric cover layer.
        </p>

        {/* Flow diagram */}
        <div className="mt-8 overflow-x-auto">
          <div className="flex min-w-[640px] items-center gap-3">
            <FlowStep label="Vault" detail="Yield product" />
            <FlowArrow />
            <FlowStep label="Cover Policy" detail="Parametric cover" />
            <FlowArrow />
            <FlowStep label="AI Risk Agent" detail="Monitor triggers" />
            <FlowArrow />
            <FlowStep label="Claim Signal" detail="Trigger fired" />
            <FlowArrow />
            <FlowStep label="Cover Receipt" detail="Recorded on-chain" />
          </div>
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

      {/* How protection works */}
      <div className="mt-16 border-t border-border-subtle pt-12">
        <h2 className="font-display text-2xl font-bold text-gold">
          How protection works
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-text-secondary">
          VaultCover provides AI-monitored parametric cover for on-chain vaults.
          Here is how the protection flow works, step by step.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <HowStep
            step="1"
            title="Select a vault"
            body="Browse available vaults and choose one that matches your risk profile and yield expectations."
          />
          <HowStep
            step="2"
            title="Buy cover against specific triggers"
            body="Choose which risk triggers you want parametric cover for. Premium is 1.5% of the cover amount."
          />
          <HowStep
            step="3"
            title="AI Risk Agent monitors vault health"
            body="The AI Risk Agent continuously scores vault health, tracking TVL, APY, oracle feeds, and other metrics."
          />
          <HowStep
            step="4"
            title="Claim signal generated if trigger breached"
            body="When a covered trigger condition is met, the AI Risk Agent generates a claim signal with confidence score."
          />
          <HowStep
            step="5"
            title="Casper records the protection trail"
            body="The policy, risk event, claim signal, and cover receipt are all recorded immutably on Casper."
          />
          <HowStep
            step="6"
            title="Cover Receipt issued"
            body="You receive a verifiable cover receipt with payout simulation details and transaction hashes."
          />
        </div>
      </div>

      {/* Contract Status Panel */}
      <ContractStatusPanel />
    </div>
  );
}

/* ── Sub-components ── */

function FlowStep({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center rounded-xl border border-border-subtle bg-raised px-5 py-4 text-center">
      <span className="font-display text-base font-bold text-gold">{label}</span>
      <span className="mt-1 text-xs text-text-muted">{detail}</span>
    </div>
  );
}

function FlowArrow() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 text-text-muted"
      aria-hidden="true"
    >
      <path
        d="M5 12H19M19 12L14 7M19 12L14 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HowStep({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-5">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-[4px] border border-[rgba(230,192,138,0.24)] bg-[rgba(230,192,138,0.08)] font-mono text-sm font-bold text-gold">
        {step}
      </span>
      <h3 className="mt-4 font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-text-muted">{body}</p>
    </div>
  );
}
