"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { ClearPoliciesDialog } from "@/components/app-pages/policies/ClearPoliciesDialog";
import { PoliciesHero } from "@/components/app-pages/policies/PoliciesHero";
import { PolicyRecord } from "@/components/app-pages/policies/PolicyRecord";
import { useWallet } from "@/components/WalletProvider";
import {
  getPoliciesSnapshot,
  resetDemoState,
  subscribePolicies,
} from "@/lib/demo-state";

const EMPTY_POLICIES: never[] = [];
const pillButton =
  "inline-flex min-h-11 items-center justify-center rounded-full border-2 px-4 text-[11px] font-semibold leading-none transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00BAE2] motion-reduce:transition-none";

function formatUSD(amount: number) {
  return `$${(amount / 1000).toFixed(amount >= 1000 ? 1 : 0)}${
    amount >= 1000 ? "K" : ""
  }`;
}

export default function PoliciesPage() {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const policies = useSyncExternalStore(
    subscribePolicies,
    getPoliciesSnapshot,
    () => EMPTY_POLICIES
  );
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  const filteredPolicies =
    showOnlyMine && address
      ? policies.filter((policy) => policy.ownerPublicKey === address)
      : policies;
  const activePolicies = filteredPolicies.filter(
    (policy) => policy.status === "active"
  );
  const totalCover = filteredPolicies.reduce(
    (sum, policy) => sum + policy.coverAmount,
    0
  );
  const totalPremium = filteredPolicies.reduce(
    (sum, policy) => sum + policy.premium,
    0
  );
  const walletLinkedCount = policies.filter(
    (policy) => policy.signedByWallet || policy.ownerPublicKey
  ).length;
  const legacyCount = policies.length - walletLinkedCount;

  function handleReset() {
    resetDemoState();
    window.location.reload();
  }

  return (
    <div className="min-w-0 max-w-full overflow-x-hidden bg-[#0E100F] text-[#FFFCE1] [font-family:Mori,var(--font-geist-sans),-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]">
      <div className="mx-auto min-w-0 max-w-7xl">
        <PoliciesHero />

        <section
          aria-labelledby="policy-summary-title"
          className="mt-8 overflow-hidden rounded-lg border border-[#42433D] bg-[#0E100F] shadow-[0_4px_16px_rgba(0,0,0,0.24)]"
        >
          <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 id="policy-summary-title" className="text-sm text-[#FFFCE1]">
                  Local policy register
                </h2>
                <span className="inline-flex min-h-7 items-center gap-2 rounded-full border border-[#00BAE2]/40 bg-[#00BAE2]/[0.06] px-3 text-[10px] text-[#00BAE2]">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[#00BAE2]"
                    aria-hidden="true"
                  />
                  Demo mode
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-xs leading-5 text-[#7C7C6F]">
                These policies are wallet-linked demo records stored locally
                until Casper contract deployment is connected.
              </p>
              {policies.length > 0 && (
                <p className="mt-2 text-xs text-[#7C7C6F]">
                  {walletLinkedCount} wallet-linked / {legacyCount} legacy
                </p>
              )}
            </div>

            {policies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {isConnected && (
                  <button
                    type="button"
                    onClick={() => setShowOnlyMine((value) => !value)}
                    aria-pressed={showOnlyMine}
                    className={`${pillButton} gap-2 ${
                      showOnlyMine
                        ? "border-[#ABFF84]/60 bg-[#ABFF84]/[0.06] text-[#ABFF84] hover:border-[#ABFF84]"
                        : "border-[#42433D] text-[#BBBAA6] hover:border-[#00BAE2] hover:bg-[#00BAE2]/10 hover:text-[#FFFCE1]"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        showOnlyMine ? "bg-[#ABFF84]" : "bg-[#7C7C6F]"
                      }`}
                      aria-hidden="true"
                    />
                    {showOnlyMine
                      ? "My wallet policies"
                      : "Show only my wallet policies"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className={`${pillButton} border-[#42433D] text-[#7C7C6F] hover:border-[#F7BDF8]/70 hover:bg-[#F7BDF8]/10 hover:text-[#F7BDF8]`}
                >
                  Clear demo policies
                </button>
              </div>
            )}
          </div>
          <div
            className="h-px bg-[linear-gradient(90deg,#ABFF84,#00BAE2,#F7BDF8,transparent)]"
            aria-hidden="true"
          />
        </section>

        {policies.length === 0 ? (
          <section className="mt-8 overflow-hidden rounded-lg border border-[#42433D] bg-[#ABFF84]/[0.025] shadow-[0_4px_16px_rgba(0,0,0,0.24)]">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end lg:p-10">
              <div>
                <p className="text-xs text-[#00BAE2]">POLICY TRAIL / EMPTY</p>
                <h2 className="mt-5 text-[clamp(2rem,5vw,4rem)] font-normal leading-[0.96]">
                  No active cover policies
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#BBBAA6]">
                  Buy cover for a vault to see your policies here.
                </p>
              </div>
              <Link
                href="/vaults"
                className={`${pillButton} border-[#FFFCE1] px-6 py-3 text-[#FFFCE1] hover:border-[#ABFF84] hover:bg-[#ABFF84]/10 hover:text-[#ABFF84]`}
              >
                Browse vaults <span className="ml-2" aria-hidden="true">-&gt;</span>
              </Link>
            </div>
            <div
              className="h-1 bg-[linear-gradient(90deg,#ABFF84_0_25%,#00BAE2_25%_50%,#F7BDF8_50%_65%,#42433D_65%_100%)]"
              aria-hidden="true"
            />
          </section>
        ) : (
          <>
            <p className="mt-5 max-w-3xl text-xs leading-5 text-[#7C7C6F]">
              Policies in this MVP are demo-mode records linked to your
              connected wallet. They show the intended VaultCover lifecycle
              before full contract write integration.
            </p>

            <dl className="mt-8 grid overflow-hidden rounded-lg border border-[#42433D] bg-[#42433D] shadow-[0_4px_16px_rgba(0,0,0,0.24)] sm:grid-cols-3">
              <SummaryMetric label="Active policies" value={activePolicies.length} />
              <SummaryMetric label="Total cover" value={formatUSD(totalCover)} />
              <SummaryMetric
                label="Total premium"
                value={formatUSD(totalPremium)}
              />
            </dl>

            {filteredPolicies.length === 0 ? (
              <section className="mt-8 rounded-lg border border-[#42433D] bg-[#0E100F] p-8 text-center shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                <p className="text-sm text-[#BBBAA6]">
                  {showOnlyMine
                    ? "No wallet-linked policies found for your connected wallet."
                    : "No policies match the current filter."}
                </p>
              </section>
            ) : (
              <section aria-label="Cover policies" className="mt-8 space-y-5">
                {filteredPolicies.map((policy) => (
                  <PolicyRecord
                    key={policy.id}
                    policy={policy}
                    onClaim={(policyId) => router.push(`/claim/${policyId}`)}
                  />
                ))}
              </section>
            )}
          </>
        )}
      </div>

      {showClearConfirm && (
        <ClearPoliciesDialog
          onCancel={() => setShowClearConfirm(false)}
          onConfirm={handleReset}
        />
      )}
    </div>
  );
}

function SummaryMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="border-b border-[#42433D] bg-[#0E100F] p-5 transition-colors duration-300 last:border-b-0 hover:bg-[#FFFCE1]/[0.035] motion-reduce:transition-none sm:border-b-0 sm:border-r sm:last:border-r-0">
      <dt className="text-[10px] text-[#7C7C6F]">{label}</dt>
      <dd className="mt-2 font-mono text-3xl font-normal text-[#FFFCE1]">
        {value}
      </dd>
    </div>
  );
}
