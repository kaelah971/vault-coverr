"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ── Constants ────────────────────────────────────────────────────────────────────

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

const dropPercent = (
  ((BASELINE.tvl - DEGRADED.tvl) / BASELINE.tvl) *
  100
).toFixed(1);

// ── Sub-components ───────────────────────────────────────────────────────────────

function truncateHash(hash: string) {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2L3 7V12C3 17.5228 7.02944 21 12 22C16.9706 21 21 17.5228 21 12V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LoaderSpinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path d="M12 2C6.47715 2 2 6.47715 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowTrendDown({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 7L9 13L13 9L21 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 17H21V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Copyable hash ────────────────────────────────────────────────────────────────

function CopyableHash({ label, hash }: { label: string; hash: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs text-text-muted">{label}</span>
      <div className="flex items-center gap-1.5">
        <code className="rounded-[4px] bg-surface-elevated px-2 py-0.5 font-mono text-[11px] text-text-secondary">
          {truncateHash(hash)}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="text-text-muted transition-colors hover:text-gold"
          aria-label={copied ? "Copied" : "Copy"}
        >
          {copied ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" strokeWidth="1.5" /></svg>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────────

export default function HealthMonitorPage() {
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

  return (
    <div className="mx-auto max-w-[1280px]">
      {/* ── Back link ──────────────────────────────────────────────────── */}
      <Link
        href="/vaults/rwa-invoice-vault"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-gold"
      >
        <ChevronLeft />
        Back to RWA Invoice Vault
      </Link>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-block rounded-[4px] border border-[rgba(159,183,199,0.24)] bg-[rgba(159,183,199,0.06)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#9FB7C7]">
            AI Watch
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-gold sm:text-4xl lg:text-5xl">
            Vault Health Monitor
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-text-secondary">
            RWA Invoice Vault under active surveillance. The AI watch cycle
            monitors TVL, APY, and risk metrics against cover policy triggers.
          </p>
        </div>

        {/* Status badge */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.06em] ${
            status === "Stable"
              ? "border-safe/20 bg-safe/10 text-safe"
              : "border-[rgba(214,106,94,0.25)] bg-[rgba(214,106,94,0.08)] text-danger"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status === "Stable" ? "bg-safe" : "bg-danger"}`} />
          {status}
        </span>
      </div>

      {/* ── Metrics grid ───────────────────────────────────────────────── */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border-subtle bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">TVL (USD)</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-bold text-text-primary">{tvl.toLocaleString()}</span>
            <span className="text-sm text-text-secondary">USDC</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            {cycleComplete ? (
              <>
                <ArrowTrendDown className="text-danger" />
                <span className="text-xs text-danger">Declining</span>
              </>
            ) : (
              <span className="text-xs text-text-muted">Stable</span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">APY</p>
          <div className="mt-2">
            <span className="font-mono text-2xl font-bold text-text-primary">{apy}%</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            {cycleComplete ? (
              <>
                <ArrowTrendDown className="text-danger" />
                <span className="text-xs text-danger">Declining</span>
              </>
            ) : (
              <span className="text-xs text-text-muted">Stable</span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Risk Score</p>
          <div className="mt-2">
            <span className="font-mono text-2xl font-bold text-text-primary">{riskScore}/100</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            {cycleComplete ? (
              <>
                <ArrowTrendDown className="text-danger" />
                <span className="text-xs text-danger">Elevated</span>
              </>
            ) : (
              <span className="text-xs text-text-muted">Low</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Trigger state row ───────────────────────────────────────────── */}
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-border-subtle bg-surface px-5 py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Trigger State</span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.06em] ${
            triggerState === "No breach"
              ? "border-safe/20 bg-safe/10 text-safe"
              : "border-[rgba(214,106,94,0.25)] bg-[rgba(214,106,94,0.08)] text-danger"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${triggerState === "No breach" ? "bg-safe" : "bg-danger"}`} />
          {triggerState}
        </span>
      </div>

      {/* ── Trigger rule ───────────────────────────────────────────────── */}
      <div className="mt-6 rounded-xl border border-border-subtle bg-surface p-6">
        <h3 className="font-display text-lg font-bold text-text-primary">Trigger Rule</h3>
        <p className="mt-2 leading-7 text-text-secondary">
          TVL_DROP triggers when vault TVL falls more than{" "}
          <span className="font-semibold text-gold">{TRIGGER_THRESHOLD}%</span>{" "}
          from its protected baseline. RWA Invoice Vault is monitored against
          policy{" "}
          <span className="font-mono text-sm text-gold">policy-rwa-001</span>{" "}
          with a cover amount of{" "}
          <span className="font-semibold text-text-primary">10,000 USDC</span>.
        </p>
      </div>

      {/* ── Action buttons ─────────────────────────────────────────────── */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        {isBeforeCycle && !cycleRunning && (
          <button
            type="button"
            onClick={runCycle}
            className="inline-flex items-center gap-3 rounded-[6px] border border-white/10 bg-gold px-6 py-3.5 text-center font-semibold text-obsidian transition hover:-translate-y-0.5 hover:bg-[#F0CCA0] hover:shadow-[0_0_24px_rgba(230,192,138,0.16)]"
          >
            <ShieldIcon className="text-obsidian" />
            Run AI Watch Cycle
          </button>
        )}

        {cycleComplete && (
          <button
            type="button"
            onClick={resetScenario}
            className="rounded-[6px] border border-[rgba(230,192,138,0.55)] px-6 py-3.5 text-center font-semibold text-gold transition hover:border-gold hover:-translate-y-0.5"
          >
            Reset Scenario
          </button>
        )}
      </div>

      {/* ── Progressive reveal ─────────────────────────────────────────── */}
      {cycleRunning && (
        <div className="mt-6 rounded-xl border border-border-default bg-deep p-6">
          <div className="space-y-3">
            {REVEAL_STEPS.map((step, index) => (
              <div
                key={step}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all duration-500 ${
                  index <= currentStep
                    ? "bg-surface text-text-primary"
                    : "text-text-muted"
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="shrink-0 text-safe" />
                ) : index === currentStep ? (
                  <LoaderSpinner />
                ) : (
                  <span className="inline-block h-3.5 w-3.5 shrink-0 rounded-full border border-border-subtle" />
                )}
                <span className="text-sm">{step}</span>
                {index <= currentStep && (
                  <span className="ml-auto text-xs text-safe">OK</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Post-cycle results ─────────────────────────────────────────── */}
      {cycleComplete && (
        <div className="mt-8 space-y-6">
          {/* Protected Baseline vs Current State */}
          <div className="rounded-2xl border border-border-default bg-surface p-6 lg:p-8">
            <h3 className="font-display text-lg font-bold text-gold">
              Protected Baseline vs Current State
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-safe/15 bg-safe/[0.04] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-safe">Baseline</p>
                <div className="mt-3 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">TVL</span>
                    <span className="font-mono text-sm text-text-primary">{BASELINE.tvl.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">APY</span>
                    <span className="font-mono text-sm text-text-primary">{BASELINE.apy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">Risk Score</span>
                    <span className="font-mono text-sm text-text-primary">{BASELINE.riskScore}/100</span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-[rgba(214,106,94,0.20)] bg-[rgba(214,106,94,0.04)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-danger">Current</p>
                <div className="mt-3 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">TVL</span>
                    <span className="font-mono text-sm text-danger">{DEGRADED.tvl.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">APY</span>
                    <span className="font-mono text-sm text-danger">{DEGRADED.apy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-muted">Risk Score</span>
                    <span className="font-mono text-sm text-danger">{DEGRADED.riskScore}/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drop summary */}
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <div className="rounded-lg bg-deep px-4 py-2.5 text-center">
                <p className="text-[10px] uppercase tracking-[0.08em] text-text-muted">TVL Drop</p>
                <p className="mt-0.5 font-mono text-sm font-semibold text-danger">{dropPercent}%</p>
              </div>
              <div className="rounded-lg bg-deep px-4 py-2.5 text-center">
                <p className="text-[10px] uppercase tracking-[0.08em] text-text-muted">Threshold</p>
                <p className="mt-0.5 font-mono text-sm font-semibold text-text-primary">{TRIGGER_THRESHOLD}%</p>
              </div>
              <div className="rounded-lg bg-deep px-4 py-2.5 text-center">
                <p className="text-[10px] uppercase tracking-[0.08em] text-text-muted">Confidence</p>
                <p className="mt-0.5 font-mono text-sm font-semibold text-text-primary">{DEGRADED.confidence}%</p>
              </div>
              <div className="rounded-lg bg-deep px-4 py-2.5 text-center">
                <p className="text-[10px] uppercase tracking-[0.08em] text-text-muted">Result</p>
                <p className="mt-0.5 font-mono text-sm font-semibold text-danger">Breached</p>
              </div>
            </div>
          </div>

          {/* Why this user is protected */}
          <div className="rounded-2xl border border-border-default bg-surface p-6 lg:p-8">
            <h3 className="font-display text-lg font-bold text-gold">
              Why this user is protected
            </h3>
            <p className="mt-3 leading-7 text-text-secondary">
              The user had an active cover policy for RWA Invoice Vault. The
              policy included TVL_DROP as a covered trigger. When the vault TVL
              dropped {dropPercent}%, VaultCover matched the trigger, generated
              a claim signal, and verified the claim lifecycle against Casper
              Testnet proof.
            </p>
          </div>

          {/* Claim Eligibility */}
          <div className="rounded-2xl border border-border-default bg-surface p-6 lg:p-8">
            <div className="flex items-center gap-3">
              <ShieldIcon className="text-gold" />
              <h3 className="font-display text-lg font-bold text-gold">Claim Eligibility</h3>
            </div>
            <div className="mt-4 divide-y divide-border-subtle">
              {[
                "Active cover policy found",
                "Vault matches policy",
                "Covered trigger matched",
                "Risk event recorded on Casper",
                "Claim processed on Casper",
              ].map((label) => (
                <div key={label} className="flex items-center justify-between py-3">
                  <span className="text-sm text-text-secondary">{label}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-safe">
                    <CheckCircle className="text-safe" />
                    Passed
                  </span>
                </div>
              ))}
            </div>

            {/* Casper proof trail */}
            <div className="mt-5 rounded-xl border border-border-subtle bg-deep p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                Casper Testnet Proof Trail
              </p>
              <CopyableHash label="Policy created" hash={CASPER_PROOF.policy} />
              <CopyableHash label="Risk event submitted" hash={CASPER_PROOF.riskEvent} />
              <CopyableHash label="Claim submitted" hash={CASPER_PROOF.claimSubmitted} />
              <CopyableHash label="Claim processed" hash={CASPER_PROOF.claimProcessed} />
            </div>
          </div>

          {/* Honest disclaimer */}
          <p className="rounded-xl border border-border-subtle bg-surface px-6 py-4 text-center text-sm leading-6 text-text-muted">
            This MVP uses a scenario-based AI watch cycle. Live external vault
            feeds are a future integration. The protection lifecycle shown here
            has already been executed on Casper Testnet.
          </p>
        </div>
      )}
    </div>
  );
}
