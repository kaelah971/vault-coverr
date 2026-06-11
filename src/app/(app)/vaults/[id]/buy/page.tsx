"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VAULTS, generatePolicyId, generateTxHash, formatCurrency } from "@/lib/mock-data";
import { savePolicy } from "@/lib/demo-state";
import type { Policy } from "@/lib/types";
import { Metric } from "@/components/Metric";
import { RiskScoreBar } from "@/components/RiskScoreBar";

const COVER_AMOUNTS = [
  { label: "$1K", value: 1_000 },
  { label: "$5K", value: 5_000 },
  { label: "$10K", value: 10_000 },
  { label: "$25K", value: 25_000 },
  { label: "$50K", value: 50_000 },
];

const PREMIUM_RATE = 0.015;
const EXPIRY_DAYS = 30;

function createPolicyPayload(
  vault: (typeof VAULTS)[number],
  coverAmount: number,
  premium: number,
  selectedTriggers: string[]
): Policy {
  const now = Date.now();
  return {
    id: generatePolicyId(),
    vaultId: vault.id,
    vaultName: vault.name,
    coverAmount,
    coverAmountFormatted: formatCurrency(coverAmount),
    premium,
    premiumFormatted: `${premium} CSPR`,
    expiryTimestamp: now + EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    status: "active",
    selectedTriggers,
    createdAt: now,
    txHash: generateTxHash(),
  };
}

export default function BuyCoverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const vault = VAULTS.find((v) => v.id === id);

  const [coverAmount, setCoverAmount] = useState(10_000);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(
    vault?.triggers ?? []
  );
  const [submitting, setSubmitting] = useState(false);

  if (!vault) {
    return (
      <div className="mx-auto max-w-[800px]">
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
        <div className="rounded-xl border border-border-subtle bg-surface p-8 text-center">
          <p className="font-display text-2xl font-bold text-text-primary">
            Vault Not Found
          </p>
          <p className="mt-2 text-text-secondary">
            The vault you&apos;re looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  const premium = Math.round(coverAmount * PREMIUM_RATE);

  const handleTriggerToggle = (trigger: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger)
        ? prev.filter((t) => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleSubmit = () => {
    if (selectedTriggers.length === 0) return;
    setSubmitting(true);

    const policy = createPolicyPayload(
      vault,
      coverAmount,
      premium,
      selectedTriggers
    );

    savePolicy(policy);
    router.push("/policies");
  };

  return (
    <div className="mx-auto max-w-[1024px]">
      {/* Back link */}
      <Link
        href={`/vaults/${vault.id}`}
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
        Back to {vault.name}
      </Link>

      <h1 className="font-display text-3xl font-bold text-gold lg:text-4xl">
        Buy Cover
      </h1>
      <p className="mt-3 max-w-xl leading-7 text-text-secondary">
        Select your cover amount and triggers to purchase parametric protection
        for the {vault.name}.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Left: Vault summary card */}
        <div className="h-fit rounded-xl border border-border-subtle bg-surface p-6">
          <span className="inline-flex rounded-[4px] border border-[rgba(230,192,138,0.24)] bg-[rgba(230,192,138,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-gold">
            {vault.tag}
          </span>
          <h2 className="mt-3 font-display text-xl font-bold text-text-primary">
            {vault.name}
          </h2>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            {vault.description}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Metric label="APY" value={`${vault.apy}%`} muted />
            <Metric label="TVL" value={vault.tvlFormatted} />
          </div>

          <div className="mt-6">
            <RiskScoreBar
              score={vault.riskScore}
              label={vault.riskLabel}
              showValue
            />
          </div>
        </div>

        {/* Right: Purchase form */}
        <div className="rounded-xl border border-border-default bg-surface p-6 lg:p-8">
          <h2 className="font-display text-xl font-bold text-text-primary">
            Cover Configuration
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Configure your cover parameters and submit the transaction.
          </p>

          <div className="mt-8 space-y-6">
            {/* Cover Amount */}
            <div>
              <label
                htmlFor="cover-amount"
                className="block text-sm font-semibold text-text-primary"
              >
                Cover Amount
              </label>
              <select
                id="cover-amount"
                value={coverAmount}
                onChange={(e) => setCoverAmount(Number(e.target.value))}
                className="mt-2 block w-full rounded-[6px] border border-border-default bg-raised px-4 py-3 text-sm text-text-primary transition focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              >
                {COVER_AMOUNTS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Premium */}
            <div className="rounded-[6px] border border-border-subtle bg-raised p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-text-muted">
                Premium (1.5%)
              </p>
              <p className="mt-1 font-mono text-lg font-semibold text-text-primary">
                {premium} CSPR
              </p>
            </div>

            {/* Triggers */}
            <fieldset>
              <legend className="text-sm font-semibold text-text-primary">
                Select Triggers
              </legend>
              <p className="mt-1 text-xs text-text-muted">
                Choose which conditions you want cover for. At least one is
                required.
              </p>
              <div className="mt-3 space-y-2">
                {vault.triggers.map((trigger) => {
                  const checked = selectedTriggers.includes(trigger);
                  return (
                    <label
                      key={trigger}
                      className={`flex cursor-pointer items-center gap-3 rounded-[6px] border p-3 transition ${
                        checked
                          ? "border-gold bg-[rgba(230,192,138,0.06)]"
                          : "border-border-subtle bg-raised hover:border-border-default"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleTriggerToggle(trigger)}
                        className="h-4 w-4 rounded-[3px] border-border-default bg-raised text-gold focus:ring-gold"
                      />
                      <span className="text-sm font-medium text-text-primary">
                        {trigger}
                      </span>
                    </label>
                  );
                })}
              </div>
              {selectedTriggers.length === 0 && (
                <p className="mt-2 text-xs text-danger">
                  Please select at least one trigger.
                </p>
              )}
            </fieldset>

            {/* Expiry */}
            <div className="rounded-[6px] border border-border-subtle bg-raised p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-text-muted">
                Policy Expiry
              </p>
              <p className="mt-1 font-mono text-sm text-text-primary">
                30 days from purchase
              </p>
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || selectedTriggers.length === 0}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-[6px] border border-white/10 bg-gold px-6 py-3.5 text-center font-semibold text-obsidian transition hover:-translate-y-0.5 hover:bg-[#F0CCA0] hover:shadow-[0_0_24px_rgba(230,192,138,0.16)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Buy Cover \u2192"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
