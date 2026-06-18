"use client";

import { useState, useSyncExternalStore } from "react";
import {
  RiskConsoleHeader,
  RiskFleet,
  SignalEvidence,
  SimulationPanel,
} from "@/components/app-pages/risk/RiskConsole";
import {
  getClaimSignalSnapshot,
  getPoliciesSnapshot,
  saveClaimSignal,
  subscribeClaimSignal,
  subscribePolicies,
} from "@/lib/demo-state";
import { DEMO_CLAIM_SIGNAL, VAULTS } from "@/lib/mock-data";
import type { ClaimSignal } from "@/lib/types";

const EMPTY_POLICIES: ReturnType<typeof getPoliciesSnapshot> = [];

export default function RiskPage() {
  const storedSignal = useSyncExternalStore(
    subscribeClaimSignal,
    getClaimSignalSnapshot,
    () => null
  );
  const [justTriggered, setJustTriggered] = useState<ClaimSignal | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const policies = useSyncExternalStore(
    subscribePolicies,
    getPoliciesSnapshot,
    () => EMPTY_POLICIES
  );

  const claimSignal = justTriggered ?? storedSignal;
  const matchingPolicy = policies.find(
    (policy) =>
      policy.vaultId === "rwa-invoice-vault" && policy.status === "active"
  );

  const handleTriggerDemo = () => {
    const signal: ClaimSignal = {
      ...DEMO_CLAIM_SIGNAL,
      timestamp: Date.now(),
    };

    saveClaimSignal(signal);
    setJustTriggered(signal);
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen min-w-0 max-w-full overflow-x-hidden bg-[#0E100F] text-[#FFFCE1] [font-family:Mori,var(--font-geist-sans),-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]">
      <div className="mx-auto min-w-0 max-w-[1280px]">
        <RiskConsoleHeader
          activeSignal={claimSignal}
          monitoredVaults={VAULTS.length}
        />

        <div className="mt-8 space-y-8">
          <RiskFleet vaults={VAULTS} />

          <div className="grid gap-8 xl:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)]">
            <SimulationPanel
              hasTriggered={showSuccess}
              onTrigger={handleTriggerDemo}
            />

            <section aria-labelledby="active-signal-title" className="min-w-0">
              <div className="mb-4 flex items-end justify-between gap-4 border-t border-[#42433D] pt-4">
                <div>
                  <p className="text-xs text-[#F7BDF8]">02 / EVIDENCE STREAM</p>
                  <h2
                    id="active-signal-title"
                    className="mt-2 text-2xl font-normal leading-tight"
                  >
                    Active risk signal
                  </h2>
                </div>
                <span className="text-right text-xs text-[#7C7C6F]">
                  risk_agent_output.json
                </span>
              </div>

              {claimSignal ? (
                <SignalEvidence
                  signal={claimSignal}
                  claimHref={
                    matchingPolicy
                      ? `/claim/${matchingPolicy.id}`
                      : "/vaults/rwa-invoice-vault/buy"
                  }
                  claimLabel={
                    matchingPolicy ? "View claim" : "Buy cover to claim"
                  }
                />
              ) : (
                <div
                  className="rounded-lg border border-[#42433D] bg-black/20 p-8"
                  role="status"
                >
                  <p className="text-sm text-[#BBBAA6]">
                    No active risk signals. Trigger a demo event to inspect the
                    agent evidence.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
