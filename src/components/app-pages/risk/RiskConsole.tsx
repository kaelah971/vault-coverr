import Link from "next/link";
import type { ClaimSignal, Vault } from "@/lib/types";

type RiskTone = {
  accent: string;
  border: string;
  label: string;
};

const panel =
  "rounded-lg border border-[#42433D] bg-[#0E100F]/80 shadow-[0_4px_16px_rgba(0,0,0,0.3)]";
const hoverPanel =
  "transition duration-300 hover:border-[#BBBAA6]/45 hover:bg-[#FFFCE1]/[0.025] motion-reduce:transition-none";
const pillCta =
  "inline-flex min-h-11 items-center justify-center rounded-full border-2 px-5 py-3 text-[11px] font-semibold leading-none transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00BAE2] motion-reduce:transition-none";

const riskTone = (score: number): RiskTone => {
  if (score <= 30) {
    return {
      accent: "#ABFF84",
      border: "border-[#ABFF84]/35",
      label: "Low",
    };
  }

  if (score <= 65) {
    return {
      accent: "#00BAE2",
      border: "border-[#00BAE2]/35",
      label: "Medium",
    };
  }

  return {
    accent: "#F7BDF8",
    border: "border-[#F7BDF8]/35",
    label: "High",
  };
};

export function RiskConsoleHeader({
  activeSignal,
  monitoredVaults,
}: {
  activeSignal: ClaimSignal | null;
  monitoredVaults: number;
}) {
  const elevatedVaults = activeSignal?.triggered ? 1 : 0;

  return (
    <header aria-labelledby="risk-console-title">
      <div className="relative isolate overflow-hidden border-b border-[#42433D] pb-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_8%,rgba(171,255,132,0.14),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(0,186,226,0.12),transparent_28%),linear-gradient(rgba(255,252,225,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,252,225,0.025)_1px,transparent_1px)] bg-[size:auto,auto,48px_48px,48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_92%)]"
        />
        <div className="flex flex-col gap-8 pt-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <p className="flex items-center gap-3 text-xs text-[#BBBAA6]">
              <span className="h-px w-8 bg-[#ABFF84]" aria-hidden="true" />
              AI RISK MONITOR / CASPER TESTNET
            </p>
            <h1
              id="risk-console-title"
              className="mt-5 max-w-full break-words text-[clamp(2.25rem,6vw,5.5rem)] font-normal leading-[0.92]"
            >
              Monitor the threshold.
              <span className="block text-[#ABFF84]">Inspect the evidence.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#BBBAA6] sm:text-base">
              Live vault health, deterministic trigger conditions, and
              agent-generated claim evidence in one risk-first view.
            </p>
          </div>

          <dl className={`${panel} grid min-w-0 grid-cols-3 px-4 py-4 lg:min-w-[360px]`}>
            <HeaderMetric label="Vaults" value={String(monitoredVaults)} />
            <HeaderMetric label="Elevated" value={String(elevatedVaults)} />
            <HeaderMetric
              label="Agent"
              value={activeSignal ? "Signal" : "Standby"}
              accent={activeSignal ? "#ABFF84" : undefined}
            />
          </dl>
        </div>
      </div>
    </header>
  );
}

function HeaderMetric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="border-l border-[#42433D] px-4 first:border-l-0 first:pl-0">
      <dt className="text-[10px] text-[#7C7C6F]">{label}</dt>
      <dd className="mt-2 text-sm" style={accent ? { color: accent } : undefined}>
        {value}
      </dd>
    </div>
  );
}

export function RiskFleet({ vaults }: { vaults: Vault[] }) {
  const orderedVaults = [...vaults].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <section aria-labelledby="fleet-title">
      <div className="mb-6 grid gap-5 border-t border-[#42433D] pt-5 md:grid-cols-[1fr_2fr]">
        <p className="text-xs text-[#00BAE2]">01 / VAULT HEALTH</p>
        <div>
          <h2 id="fleet-title" className="text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[0.95]">
            Risk queue
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#BBBAA6]">
            Highest exposure appears first. Scores map to low, medium, and high
            operating thresholds.
          </p>
        </div>
      </div>

      <div className={`${panel} overflow-hidden`}>
        <div
          className="hidden grid-cols-[minmax(0,1.4fr)_100px_minmax(180px,0.8fr)_120px] gap-6 border-b border-[#42433D] bg-black/20 px-6 py-3 text-[10px] text-[#7C7C6F] md:grid"
          aria-hidden="true"
        >
          <span>VAULT</span>
          <span>SCORE</span>
          <span>THRESHOLD</span>
          <span>ACTION</span>
        </div>

        {orderedVaults.map((vault) => (
          <VaultRiskRow key={vault.id} vault={vault} />
        ))}
      </div>
    </section>
  );
}

function VaultRiskRow({ vault }: { vault: Vault }) {
  const tone = riskTone(vault.riskScore);

  return (
    <article className={`group grid gap-5 border-b border-[#42433D] p-5 last:border-b-0 md:grid-cols-[minmax(0,1.4fr)_100px_minmax(180px,0.8fr)_120px] md:items-center md:gap-6 md:px-6 ${hoverPanel}`}>
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: tone.accent }}
            aria-hidden="true"
          />
          <h3 className="truncate text-base font-normal">{vault.name}</h3>
        </div>
        <p className="mt-2 pl-5 text-xs text-[#7C7C6F]">{vault.tag}</p>
      </div>

      <div className="flex items-baseline justify-between md:block">
        <span className="text-[10px] text-[#7C7C6F] md:hidden">RISK SCORE</span>
        <span className="font-mono text-2xl transition-colors duration-300 group-hover:text-[#FFFCE1] motion-reduce:transition-none" style={{ color: tone.accent }}>
          {vault.riskScore}
          <span className="text-xs text-[#7C7C6F]"> / 100</span>
        </span>
      </div>

      <div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#7C7C6F]">0</span>
          <span style={{ color: tone.accent }}>
            {vault.riskLabel.toUpperCase()} RISK
          </span>
          <span className="text-[#7C7C6F]">100</span>
        </div>
        <div
          className="relative mt-3 h-2 overflow-hidden rounded-full bg-[#42433D]"
          role="meter"
          aria-label={`${vault.name} risk score`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={vault.riskScore}
          aria-valuetext={`${vault.riskScore} out of 100, ${tone.label} risk`}
        >
          <div
            className="h-full rounded-full transition-[width,filter] duration-500 group-hover:brightness-125 motion-reduce:transition-none"
            style={{
              width: `${Math.min(Math.max(vault.riskScore, 0), 100)}%`,
              backgroundColor: tone.accent,
            }}
          />
          <span className="absolute left-[30%] top-0 h-full w-px bg-[#0E100F]" />
          <span className="absolute left-[65%] top-0 h-full w-px bg-[#0E100F]" />
        </div>
      </div>

      <Link
        href={`/vaults/${vault.id}`}
        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 py-3 text-[11px] font-semibold text-[#FFFCE1] transition duration-300 hover:border-[#ABFF84] hover:bg-[#ABFF84]/10 hover:text-[#ABFF84] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00BAE2] motion-reduce:transition-none ${tone.border}`}
      >
        View vault <span aria-hidden="true">-&gt;</span>
      </Link>
    </article>
  );
}

export function SimulationPanel({
  hasTriggered,
  onTrigger,
}: {
  hasTriggered: boolean;
  onTrigger: () => void;
}) {
  return (
    <section aria-labelledby="simulation-title">
      <div className="mb-6 border-t border-[#42433D] pt-5">
        <p className="text-xs text-[#ABFF84]">DEMO CONTROL</p>
        <h2 id="simulation-title" className="mt-2 text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[0.95]">
          Simulate detection
        </h2>
      </div>

      <div className={`${panel} ${hoverPanel} bg-[#ABFF84]/[0.035] p-6`}>
        <div className="flex items-center justify-between gap-4 border-b border-[#42433D] pb-4">
          <span className="text-xs text-[#BBBAA6]">RWA Invoice Vault</span>
          <span className="inline-flex items-center gap-2 text-xs text-[#00BAE2]">
            <span className="h-2 w-2 rounded-full bg-[#00BAE2]" aria-hidden="true" />
            Demo mode
          </span>
        </div>

        <dl className="mt-6 space-y-4 text-sm">
          <ControlRow label="Condition" value="TVL_DROP" />
          <ControlRow label="Observation" value="−45% / 6H" />
          <ControlRow label="Output" value="Claim signal" />
        </dl>

        <p className="mt-6 text-sm leading-6 text-[#BBBAA6]">
          Run the AI risk agent against the predefined liquidity threshold and
          persist its evidence locally.
        </p>

        <button
          type="button"
          onClick={onTrigger}
          className={`${pillCta} mt-6 w-full border-[#FFFCE1] text-[#FFFCE1] hover:border-[#ABFF84] hover:bg-[#ABFF84]/10 hover:text-[#ABFF84]`}
        >
          {hasTriggered ? "Run detection again" : "Trigger demo risk event"}
        </button>

        <p className="mt-4 min-h-5 text-xs text-[#ABFF84]" aria-live="polite">
          {hasTriggered ? "Signal generated and evidence stream updated." : ""}
        </p>
      </div>
    </section>
  );
}

function ControlRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-[#7C7C6F]">{label}</dt>
      <dd className="font-mono text-[#FFFCE1]">{value}</dd>
    </div>
  );
}

export function SignalEvidence({
  signal,
  claimHref,
  claimLabel = "View claim",
}: {
  signal: ClaimSignal;
  claimHref: string;
  claimLabel?: string;
}) {
  const tone = riskTone(signal.riskScore);
  const jsonEvidence = JSON.stringify(
    {
      vault_id: signal.vaultId,
      vault_name: signal.vaultName,
      risk_score: signal.riskScore,
      triggered: signal.triggered,
      trigger_type: signal.triggerType,
      confidence: signal.confidence,
      summary: signal.summary,
      recommended_action: signal.recommendedAction,
      risk_report_hash: signal.riskReportHash,
      timestamp: signal.timestamp,
    },
    null,
    2
  );

  return (
    <div className="overflow-hidden rounded-lg border border-[#42433D] bg-black shadow-[0_16px_48px_rgba(0,0,0,0.45)] transition duration-300 hover:border-[#BBBAA6]/45 motion-reduce:transition-none">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#42433D] px-5 py-4">
        <span className="font-mono text-xs text-[#7C7C6F]">
          {signal.vaultId}
        </span>
        <span
          className="inline-flex items-center gap-2 text-xs"
          style={{ color: tone.accent }}
          role="status"
        >
          <span
            className="h-2 w-2 rounded-full motion-safe:animate-pulse"
            style={{ backgroundColor: tone.accent }}
            aria-hidden="true"
          />
          {signal.triggered ? "TRIGGERED" : "MONITORING"}
        </span>
      </div>

      <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
        <div className="border-b border-[#42433D] p-5 lg:border-b-0 lg:border-r sm:p-6">
          <div className="grid grid-cols-2 gap-3">
            <EvidenceMetric
              label="Risk score"
              value={`${signal.riskScore} / 100`}
              color={tone.accent}
            />
            <EvidenceMetric
              label="Confidence"
              value={`${signal.confidence}%`}
              color="#00BAE2"
            />
          </div>

          <dl className="mt-6 space-y-5">
            <EvidenceField label="Vault" value={signal.vaultName} />
            <EvidenceField label="Trigger type" value={signal.triggerType} mono />
            <EvidenceField label="Summary" value={signal.summary} />
            <EvidenceField
              label="Recommended action"
              value={signal.recommendedAction}
              color="#ABFF84"
            />
            <EvidenceField
              label="Risk report hash"
              value={signal.riskReportHash}
              mono
              breakAll
            />
            <EvidenceField
              label="Observed at"
              value={new Date(signal.timestamp).toLocaleString()}
              mono
            />
          </dl>
        </div>

        <div className="min-w-0">
          <div className="border-b border-[#42433D] px-5 py-3 text-[10px] text-[#7C7C6F]">
            RAW AGENT EVIDENCE
          </div>
          <pre className="max-h-[520px] overflow-auto p-5 font-mono text-xs leading-6 text-[#BBBAA6] sm:p-6">
            <code>{jsonEvidence}</code>
          </pre>
        </div>
      </div>

      {signal.triggered ? (
        <div className="flex flex-col gap-4 border-t border-[#ABFF84]/25 bg-[#ABFF84]/[0.05] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#ABFF84]">
            Claim signal generated / Casper event recorded
          </p>
          <Link
            href={claimHref}
            className={`${pillCta} border-[#42433D] text-[#FFFCE1] hover:border-[#00BAE2] hover:bg-[#00BAE2]/10 hover:text-[#00BAE2]`}
          >
            {claimLabel} <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function EvidenceMetric({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className={`${panel} p-4`}>
      <span className="block text-[10px] text-[#7C7C6F]">{label}</span>
      <strong
        className="mt-2 block font-mono text-xl font-normal"
        style={{ color }}
      >
        {value}
      </strong>
    </div>
  );
}

function EvidenceField({
  label,
  value,
  mono = false,
  color,
  breakAll = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  color?: string;
  breakAll?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] text-[#7C7C6F]">{label}</dt>
      <dd
        className={`mt-1 text-sm leading-6 text-[#FFFCE1] ${mono ? "font-mono" : ""} ${breakAll ? "break-all" : ""}`}
        style={color ? { color } : undefined}
      >
        {value}
      </dd>
    </div>
  );
}
