"use client";

import { useSyncExternalStore, useState } from "react";
import Link from "next/link";
import { VAULTS, DEMO_CLAIM_SIGNAL } from "@/lib/mock-data";
import { getClaimSignalSnapshot, subscribeClaimSignal, saveClaimSignal } from "@/lib/demo-state";
import type { ClaimSignal } from "@/lib/types";
import { SectionHeader } from "@/components/SectionHeader";
import { AgentSignalCard } from "@/components/AgentSignalCard";
import { DemoModeBadge } from "@/components/DemoModeBadge";

export default function RiskPage() {
  const storedSignal = useSyncExternalStore(
    subscribeClaimSignal,
    getClaimSignalSnapshot,
    () => null
  );
  const [justTriggered, setJustTriggered] = useState<ClaimSignal | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const claimSignal = justTriggered ?? storedSignal;

  const handleTriggerDemo = () => {
    const signal: ClaimSignal = {
      ...DEMO_CLAIM_SIGNAL,
      timestamp: Date.now(),
    };
    saveClaimSignal(signal);
    setJustTriggered(signal);
    setShowSuccess(true);
  };

  const firstActivePolicyId = "rwa-invoice-vault";

  const scoreColor = (score: number) => {
    if (score <= 30) return "text-safe";
    if (score <= 65) return "text-gold";
    return "text-danger";
  };

  const scoreBar = (score: number) => {
    if (score <= 30) return "bg-safe";
    if (score <= 65) return "bg-gold";
    return "bg-danger";
  };

  return (
    <div className="px-5 py-20 sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-center gap-4">
          <SectionHeader
            eyebrow="AI Risk Monitor"
            title="Vault Health Dashboard"
            body="Monitor vault risk scores, active triggers, and agent-generated claim signals."
          />
          <div className="shrink-0 self-start pt-2">
            <DemoModeBadge />
          </div>
        </div>

        {/* Mini Vault Health Cards */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          {VAULTS.map((vault) => (
            <div
              key={vault.id}
              className="rounded-xl border border-border-default bg-surface p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-text-primary">
                  {vault.name.split(" ")[0]}
                  <br />
                  <span className="text-xs font-normal text-text-secondary">Vault</span>
                </h3>
                <span
                  className={`font-mono text-2xl font-semibold ${scoreColor(vault.riskScore)}`}
                >
                  {vault.riskScore}
                </span>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-[0.08em] text-text-muted">
                  <span>Status</span>
                  <span className={`font-mono ${scoreColor(vault.riskScore)}`}>
                    {vault.riskLabel} RISK
                  </span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-elevated">
                  <div
                    className={`h-full ${scoreBar(vault.riskScore)}`}
                    style={{ width: `${vault.riskScore}%` }}
                  />
                </div>
              </div>
              <Link
                href={`/vaults/${vault.id}`}
                className="mt-4 inline-block text-xs text-gold transition hover:underline"
              >
                View Vault &rarr;
              </Link>
            </div>
          ))}
        </div>

        {/* Trigger Demo Risk Event */}
        <div className="overflow-hidden rounded-2xl border border-border-default bg-surface p-6 lg:p-8">
          <h2 className="font-display text-2xl font-bold text-gold">
            Simulate AI Risk Agent Detection
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
            Trigger a demo risk event on the RWA Invoice Vault to see how the AI
            Risk Agent detects TVL drops and generates claim signals.
          </p>

          {!showSuccess ? (
            <button
              type="button"
              onClick={handleTriggerDemo}
              className="mt-6 rounded-[6px] border border-white/10 bg-gold px-7 py-4 font-semibold text-obsidian transition hover:-translate-y-0.5 hover:bg-[#F0CCA0] hover:shadow-[0_0_24px_rgba(230,192,138,0.16)]"
            >
              Trigger Demo Risk Event
            </button>
          ) : (
            <div className="mt-8 max-w-2xl">
              {justTriggered && <AgentSignalCard signal={justTriggered} />}
              <Link
                href={`/claim/${firstActivePolicyId}`}
                className="mt-6 inline-block rounded-[6px] border border-[rgba(230,192,138,0.55)] px-6 py-3 font-semibold text-gold transition hover:bg-[rgba(230,192,138,0.08)]"
              >
                View Claim &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Bottom: Active Claim Signal */}
        <div className="mt-12">
          <h2 className="font-display mb-6 text-xl font-bold text-text-primary">
            Active Risk Signals
          </h2>
          {claimSignal ? (
            <div className="max-w-2xl">
              <AgentSignalCard signal={claimSignal} />
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border-default bg-surface p-10 text-center">
              <p className="text-text-secondary">
                No active risk signals. Trigger a demo event above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
