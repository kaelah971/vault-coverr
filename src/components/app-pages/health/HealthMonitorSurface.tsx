"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const CASPER_PROOF = {
  policy: "0f26e6ba09022d0f2054434a34a496c1f46f0b19c10fda2894ad53e2a2972bd6",
  riskEvent: "c89a2b8fabba93dbb50694d1eb2bad9aca7a1a4871008051ae1d8436f6dc19dc",
  claimSubmitted: "4fd73edfa2ac903477f45df3608fdd98f747bd1ce224f70b3253aec898ca541d",
  claimProcessed: "07ad7bed10f69531f142499654e1ca37c275f68bcc6b8aceeb8e6c98ef33ab79",
};

const BASELINE = {
  tvl: 2_100_000,
  apy: 8.4,
  riskScore: 47,
};

const DEGRADED = {
  tvl: 1_150_000,
  apy: 6.1,
  riskScore: 84,
  confidence: 91,
};

const TRIGGER_THRESHOLD = 40;

const REVEAL_STEPS = [
  "Reading vault metrics...",
  "Comparing against cover triggers...",
  "Detecting TVL_DROP breach...",
  "Matching policy-rwa-001...",
  "Generating claim signal...",
  "Verifying Casper proof trail...",
];

const CLAIM_CHECKS = [
  "Active cover policy found",
  "Vault matches policy",
  "Covered trigger matched",
  "Risk event recorded on Casper",
  "Claim processed on Casper",
];

const dropPercent = (
  ((BASELINE.tvl - DEGRADED.tvl) / BASELINE.tvl) *
  100
).toFixed(1);

const panel =
  "rounded-lg border border-[#42433D] bg-[#0E100F]/80 shadow-[0_4px_16px_rgba(0,0,0,0.3)]";
const pillButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 px-5 py-3 text-[11px] font-semibold leading-none transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00BAE2] motion-reduce:transition-none";

function truncateHash(hash: string) {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2L3 7V12C3 17.5228 7.02944 21 12 22C16.9706 21 21 17.5228 21 12V7L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 12L11 15L16 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 12L11 15L16 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoaderSpinner() {
  return (
    <svg
      className="animate-spin motion-reduce:animate-none"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CopyableHash({ label, hash }: { label: string; hash: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be unavailable in restricted browser contexts.
    }
  };

  return (
    <div className="grid gap-2 border-t border-[#42433D] py-3 first:border-t-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <span className="text-xs text-[#BBBAA6]">{label}</span>
      <div className="flex min-w-0 items-center gap-2">
        <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[11px] text-[#FFFCE1] sm:flex-none">
          {truncateHash(hash)}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[#42433D] text-[#BBBAA6] transition hover:border-[#00BAE2] hover:text-[#00BAE2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BAE2] motion-reduce:transition-none"
          aria-label={copied ? `${label} hash copied` : `Copy ${label} hash`}
        >
          {copied ? <CheckCircle className="text-[#0AE448]" /> : <CopyIcon />}
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? `${label} hash copied` : ""}
        </span>
      </div>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 15H4C2.9 15 2 14.1 2 13V4C2 2.9 2.9 2 4 2H13C14.1 2 15 2.9 15 4V5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function RiskMeter({ value }: { value: number }) {
  const elevated = value >= 80;

  return (
    <div>
      <div
        role="meter"
        aria-label="Vault risk score"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${value} out of 100, ${elevated ? "elevated risk" : "moderate risk"}`}
        className="h-2 overflow-hidden rounded-full bg-[#191919]"
      >
        <div
          className={`h-full rounded-full transition-[width,background-color] duration-700 motion-reduce:transition-none ${
            elevated ? "bg-[#F7BDF8]" : "bg-[#ABFF84]"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-[#7C7C6F]" aria-hidden="true">
        <span>0 / low</span>
        <span>100 / critical</span>
      </div>
    </div>
  );
}

function SignalNode({
  label,
  timestamp,
  tvl,
  apy,
  riskScore,
  active = false,
}: {
  label: string;
  timestamp: string;
  tvl: number;
  apy: number;
  riskScore: number;
  active?: boolean;
}) {
  return (
    <article
      className={`relative rounded-lg border p-4 sm:p-5 ${
        active
          ? "border-[#F7BDF8]/45 bg-[#F7BDF8]/[0.045]"
          : "border-[#42433D] bg-[#191919]/55"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-xs ${active ? "text-[#F7BDF8]" : "text-[#ABFF84]"}`}>{label}</p>
          <p className="mt-1 text-[10px] text-[#7C7C6F]">{timestamp}</p>
        </div>
        <span
          className={`mt-1 h-2 w-2 rounded-full ${active ? "bg-[#F7BDF8]" : "bg-[#ABFF84]"}`}
          aria-hidden="true"
        />
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-3">
        <SignalValue label="TVL" value={`$${(tvl / 1_000_000).toFixed(2)}m`} />
        <SignalValue label="APY" value={`${apy}%`} />
        <SignalValue label="Risk" value={`${riskScore}/100`} />
      </dl>
    </article>
  );
}

function SignalValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] text-[#7C7C6F]">{label}</dt>
      <dd className="mt-1 font-mono text-xs text-[#FFFCE1] sm:text-sm">{value}</dd>
    </div>
  );
}

function Metric({
  label,
  value,
  note,
  tone = "default",
}: {
  label: string;
  value: string;
  note: string;
  tone?: "default" | "risk";
}) {
  return (
    <div className="border-t border-[#42433D] py-4 first:border-t-0 sm:border-l sm:border-t-0 sm:px-5 sm:py-0 sm:first:border-l-0 sm:first:pl-0">
      <dt className="text-[10px] text-[#7C7C6F]">{label}</dt>
      <dd className={`mt-2 font-mono text-xl ${tone === "risk" ? "text-[#F7BDF8]" : "text-[#FFFCE1]"}`}>
        {value}
      </dd>
      <p className={`mt-1 text-xs ${tone === "risk" ? "text-[#F7BDF8]" : "text-[#BBBAA6]"}`}>{note}</p>
    </div>
  );
}

export function HealthMonitorSurface() {
  const [cycleRunning, setCycleRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [cycleComplete, setCycleComplete] = useState(false);

  const runCycle = useCallback(() => {
    if (cycleRunning || cycleComplete) return;
    setCycleRunning(true);
    setCurrentStep(-1);
  }, [cycleRunning, cycleComplete]);

  const resetScenario = useCallback(() => {
    setCycleRunning(false);
    setCurrentStep(-1);
    setCycleComplete(false);
  }, []);

  useEffect(() => {
    if (!cycleRunning || cycleComplete) return;

    let step = 0;
    const interval = setInterval(() => {
      if (step < REVEAL_STEPS.length) {
        setCurrentStep(step);
        step++;
      } else {
        clearInterval(interval);
        setCycleComplete(true);
        setCycleRunning(false);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [cycleRunning, cycleComplete]);

  const isBeforeCycle = !cycleComplete;
  const tvl = cycleComplete ? DEGRADED.tvl : BASELINE.tvl;
  const apy = cycleComplete ? DEGRADED.apy : BASELINE.apy;
  const riskScore = cycleComplete ? DEGRADED.riskScore : BASELINE.riskScore;
  const status = cycleComplete ? "At Risk" : "Stable";
  const triggerState = cycleComplete ? "TVL_DROP breached" : "No breach";
  const activeStepText = currentStep >= 0 ? REVEAL_STEPS[currentStep] : "AI watch cycle started";

  return (
    <div className="min-h-screen min-w-0 max-w-full overflow-x-hidden bg-[#0E100F] [font-family:Mori,var(--font-geist-sans),-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-[#FFFCE1]">
      <div className="mx-auto min-w-0 max-w-7xl">
        <Link
          href="/vaults/rwa-invoice-vault"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-[#BBBAA6] transition hover:text-[#ABFF84] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00BAE2] motion-reduce:transition-none"
        >
          <ChevronLeft />
          Back to RWA Invoice Vault
        </Link>

        <header className="relative mt-4 overflow-hidden border-y border-[#42433D] py-8 sm:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,252,225,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,252,225,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_right,black,transparent_80%)]"
          />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#00BAE2]/40 px-3 py-1 text-[11px] font-semibold text-[#00BAE2]">
                  AI WATCH / RWA-01
                </span>
                <span className="text-xs text-[#7C7C6F]">Casper Testnet</span>
              </div>
              <h1 className="mt-5 max-w-3xl text-[clamp(2.25rem,6vw,5.5rem)] font-normal leading-[0.92]">
                Risk first.
                <span className="block text-[#ABFF84]">Yield second.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#BBBAA6] sm:text-base">
                RWA Invoice Vault is under active surveillance. The watch cycle compares TVL,
                APY, and risk against the policy&apos;s protected baseline.
              </p>
            </div>

            <div className={`${panel} p-5 sm:p-6`}>
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-[#BBBAA6]">Current risk</p>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold ${
                    cycleComplete
                      ? "border-[#F7BDF8]/40 text-[#F7BDF8]"
                      : "border-[#ABFF84]/40 text-[#ABFF84]"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      cycleComplete ? "bg-[#F7BDF8]" : "bg-[#ABFF84]"
                    }`}
                    aria-hidden="true"
                  />
                  {status}
                </span>
              </div>
              <p className={`mt-4 font-mono text-5xl ${cycleComplete ? "text-[#F7BDF8]" : "text-[#FFFCE1]"}`}>
                {riskScore}
                <span className="text-base text-[#7C7C6F]"> / 100</span>
              </p>
              <div className="mt-4">
                <RiskMeter value={riskScore} />
              </div>
            </div>
          </div>
        </header>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {cycleRunning
            ? activeStepText
            : cycleComplete
              ? `AI watch cycle complete. Status ${status}. ${triggerState}.`
              : "AI watch cycle ready."}
        </div>

        <section aria-labelledby="signal-title" className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs text-[#00BAE2]">SIGNAL TIMELINE</p>
              <h2 id="signal-title" className="mt-2 text-2xl font-normal sm:text-3xl">
                Protected baseline → observed state
              </h2>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-[11px] ${
                cycleComplete
                  ? "border-[#F7BDF8]/40 text-[#F7BDF8]"
                  : "border-[#42433D] text-[#BBBAA6]"
              }`}
            >
              {triggerState}
            </span>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_112px_1fr] lg:items-center">
            <SignalNode
              label="Protected baseline"
              timestamp="T−6H / policy lock"
              tvl={BASELINE.tvl}
              apy={BASELINE.apy}
              riskScore={BASELINE.riskScore}
            />

            <div className="relative flex min-h-12 items-center justify-center" aria-hidden="true">
              <div className="absolute h-px w-full bg-[#42433D]" />
              <div
                className={`relative rounded-full border bg-[#0E100F] px-3 py-1 text-[10px] ${
                  cycleRunning
                    ? "border-[#00BAE2] text-[#00BAE2]"
                    : cycleComplete
                      ? "border-[#F7BDF8] text-[#F7BDF8]"
                      : "border-[#42433D] text-[#7C7C6F]"
                }`}
              >
                {cycleRunning ? "SCANNING" : cycleComplete ? "BREACH" : "READY"}
              </div>
            </div>

            <SignalNode
              label={cycleComplete ? "Observed breach" : "Current observation"}
              timestamp={cycleComplete ? "T+0 / cycle complete" : "Awaiting next cycle"}
              tvl={tvl}
              apy={apy}
              riskScore={riskScore}
              active={cycleComplete}
            />
          </div>
        </section>

        <section className={`${panel} mt-6 p-5 sm:p-6`} aria-labelledby="telemetry-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="telemetry-title" className="text-lg font-normal">
              Live telemetry
            </h2>
            <span className="text-[11px] text-[#7C7C6F]">Policy policy-rwa-001</span>
          </div>
          <dl className="mt-5 grid sm:grid-cols-3">
            <Metric
              label="TVL / USDC"
              value={tvl.toLocaleString("en-US")}
              note={cycleComplete ? "Declining" : "Stable"}
              tone={cycleComplete ? "risk" : "default"}
            />
            <Metric
              label="APY"
              value={`${apy}%`}
              note={cycleComplete ? "Declining" : "Stable"}
              tone={cycleComplete ? "risk" : "default"}
            />
            <Metric
              label="Trigger state"
              value={cycleComplete ? `−${dropPercent}%` : "Clear"}
              note={triggerState}
              tone={cycleComplete ? "risk" : "default"}
            />
          </dl>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.72fr)_minmax(360px,1fr)]">
          <div className={`${panel} p-5 sm:p-6`}>
            <p className="text-xs text-[#ABFF84]">COVER CONDITION</p>
            <h2 className="mt-3 text-xl font-normal">TVL_DROP trigger rule</h2>
            <p className="mt-3 text-sm leading-7 text-[#BBBAA6]">
              A claim signal is generated when vault TVL falls more than{" "}
              <span className="text-[#FFFCE1]">{TRIGGER_THRESHOLD}%</span> from its protected
              baseline. This policy covers <span className="text-[#FFFCE1]">10,000 USDC</span>.
            </p>
            <div className="mt-5">
              <div
                role="meter"
                aria-label="TVL drop against trigger threshold"
                aria-valuemin={0}
                aria-valuemax={50}
                aria-valuenow={cycleComplete ? Number(dropPercent) : 0}
                aria-valuetext={
                  cycleComplete
                    ? `${dropPercent}% TVL drop against a ${TRIGGER_THRESHOLD}% threshold`
                    : `No TVL drop detected against a ${TRIGGER_THRESHOLD}% threshold`
                }
                className="relative h-2 rounded-full bg-[#191919]"
              >
                <div
                  className="h-full rounded-full bg-[#F7BDF8] transition-[width] duration-700 motion-reduce:transition-none"
                  style={{ width: cycleComplete ? `${Math.min(Number(dropPercent) * 2, 100)}%` : "0%" }}
                />
                <span className="absolute left-[80%] top-1/2 h-4 w-px -translate-y-1/2 bg-[#FFFCE1]" />
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-[#7C7C6F]">
                <span>0% drop</span>
                <span>40% trigger</span>
                <span>50%</span>
              </div>
            </div>
          </div>

          <div className={`${panel} p-5 sm:p-6`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#00BAE2]">AI WATCH CYCLE</p>
                <h2 className="mt-2 text-xl font-normal">
                  {cycleRunning ? "Signal analysis in progress" : cycleComplete ? "Breach verified" : "Ready to inspect"}
                </h2>
              </div>
              {isBeforeCycle && !cycleRunning ? (
                <button
                  type="button"
                  onClick={runCycle}
                  className={`${pillButton} border-[#FFFCE1] text-[#FFFCE1] hover:border-[#ABFF84] hover:bg-[#ABFF84]/10 hover:text-[#ABFF84]`}
                >
                  <ShieldIcon />
                  Run AI Watch Cycle
                </button>
              ) : null}
              {cycleComplete ? (
                <button
                  type="button"
                  onClick={resetScenario}
                  className={`${pillButton} border-[#42433D] text-[#BBBAA6] hover:border-[#00BAE2] hover:text-[#FFFCE1]`}
                >
                  Reset Scenario
                </button>
              ) : null}
            </div>

            <ol className="mt-5 grid gap-2" aria-label="AI watch cycle steps">
              {REVEAL_STEPS.map((step, index) => {
                const revealed = index <= currentStep;
                const complete = index < currentStep || cycleComplete;
                const active = index === currentStep && cycleRunning;

                return (
                  <li
                    key={step}
                    className={`grid min-h-11 grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-3 border-t border-[#42433D] py-2 text-sm transition-colors motion-reduce:transition-none ${
                      revealed || cycleComplete ? "text-[#FFFCE1]" : "text-[#7C7C6F]"
                    }`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center">
                      {complete ? (
                        <CheckCircle className="text-[#0AE448]" />
                      ) : active ? (
                        <LoaderSpinner />
                      ) : (
                        <span className="h-2 w-2 rounded-full border border-[#42433D]" />
                      )}
                    </span>
                    <span>{step}</span>
                    <span className={`text-[10px] ${complete ? "text-[#0AE448]" : active ? "text-[#00BAE2]" : "text-[#7C7C6F]"}`}>
                      {complete ? "OK" : active ? "RUN" : "WAIT"}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {cycleComplete ? (
          <section className="mt-8 grid gap-6" aria-labelledby="result-title">
            <div className="border-t border-[#F7BDF8]/45 pt-6">
              <p className="text-xs text-[#F7BDF8]">VERIFIED RESULT</p>
              <h2 id="result-title" className="mt-2 text-3xl font-normal sm:text-4xl">
                The covered condition was breached.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#BBBAA6]">
                Vault TVL fell {dropPercent}%, crossing the {TRIGGER_THRESHOLD}% threshold
                with {DEGRADED.confidence}% confidence. The active policy matched and the
                claim lifecycle was verified on Casper Testnet.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className={`${panel} p-5 sm:p-6`}>
                <div className="flex items-center gap-3">
                  <ShieldIcon className="text-[#ABFF84]" />
                  <h3 className="text-lg font-normal">Claim eligibility</h3>
                </div>
                <div className="mt-4">
                  {CLAIM_CHECKS.map((label) => (
                    <div
                      key={label}
                      className="flex min-h-12 items-center justify-between gap-4 border-t border-[#42433D] text-sm first:border-t-0"
                    >
                      <span className="text-[#BBBAA6]">{label}</span>
                      <span className="inline-flex items-center gap-2 text-xs text-[#0AE448]">
                        <CheckCircle className="shrink-0" />
                        Passed
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${panel} p-5 sm:p-6`}>
                <p className="text-xs text-[#00BAE2]">CASPER TESTNET PROOF TRAIL</p>
                <div className="mt-3">
                  <CopyableHash label="Policy created" hash={CASPER_PROOF.policy} />
                  <CopyableHash label="Risk event submitted" hash={CASPER_PROOF.riskEvent} />
                  <CopyableHash label="Claim submitted" hash={CASPER_PROOF.claimSubmitted} />
                  <CopyableHash label="Claim processed" hash={CASPER_PROOF.claimProcessed} />
                </div>
              </div>
            </div>

            <aside className="rounded-lg border border-[#42433D] bg-[#00BAE2]/[0.035] p-5 text-sm leading-7 text-[#BBBAA6] sm:p-6">
              <span className="text-[#FFFCE1]">Scenario note.</span> This MVP uses a
              scenario-based AI watch cycle. Live external vault feeds are a future integration.
              The protection lifecycle shown here has already been executed on Casper Testnet.
            </aside>
          </section>
        ) : null}
      </div>
    </div>
  );
}
