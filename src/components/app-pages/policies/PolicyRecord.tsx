import type { Policy } from "@/lib/types";

interface PolicyRecordProps {
  policy: Policy;
  onClaim: (policyId: string) => void;
}

const statusStyles: Record<
  Policy["status"],
  { label: string; className: string; dot: string }
> = {
  active: {
    label: "Active",
    className: "border-[#ABFF84]/40 bg-[#ABFF84]/[0.06] text-[#ABFF84]",
    dot: "bg-[#ABFF84]",
  },
  claimed: {
    label: "Claimed",
    className: "border-[#00BAE2]/40 bg-[#00BAE2]/[0.06] text-[#00BAE2]",
    dot: "bg-[#00BAE2]",
  },
  expired: {
    label: "Expired",
    className: "border-[#7C7C6F] bg-[#7C7C6F]/[0.06] text-[#BBBAA6]",
    dot: "bg-[#7C7C6F]",
  },
};

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ProofTrail({ status }: { status: Policy["status"] }) {
  const steps =
    status === "claimed"
      ? [
          ["Policy activated", "complete"],
          ["Triggers monitored", "complete"],
          ["Claim processed", "complete"],
          ["Receipt generated", "complete"],
        ]
      : status === "expired"
        ? [
            ["Policy activated", "complete"],
            ["Monitoring ended", "muted"],
            ["No active claim", "muted"],
            ["Cover expired", "muted"],
          ]
        : [
            ["Policy activated", "complete"],
            ["Triggers monitored", "current"],
            ["Claim signal", "pending"],
            ["Cover receipt", "pending"],
          ];

  return (
    <ol
      aria-label="Policy proof trail"
      className="grid gap-0 overflow-hidden rounded-lg border border-[#42433D] sm:grid-cols-4"
    >
      {steps.map(([label, state], index) => (
        <li
          key={label}
          className="relative flex min-h-20 items-center gap-3 border-b border-[#42433D] px-4 py-3 last:border-b-0 sm:block sm:border-b-0 sm:border-r sm:last:border-r-0"
        >
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[9px] ${
              state === "complete"
                ? "border-[#ABFF84]/50 bg-[#ABFF84]/10 text-[#ABFF84]"
                : state === "current"
                  ? "border-[#00BAE2]/60 bg-[#00BAE2]/10 text-[#00BAE2]"
                  : "border-[#42433D] text-[#7C7C6F]"
            }`}
          >
            {state === "complete" ? "✓" : `0${index + 1}`}
          </span>
          <div className="min-w-0 sm:mt-3">
            <span
              className={`block text-xs ${
                state === "current"
                  ? "text-[#00BAE2]"
                  : state === "complete"
                    ? "text-[#FFFCE1]"
                    : "text-[#7C7C6F]"
              }`}
            >
              {label}
            </span>
            {state === "current" && (
              <span className="mt-1 block text-[10px] text-[#7C7C6F]">
                Live demo state
              </span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function PolicyRecord({ policy, onClaim }: PolicyRecordProps) {
  const status = statusStyles[policy.status];
  const isWalletLinked =
    policy.signedByWallet === true || Boolean(policy.ownerPublicKey);

  return (
    <article className="overflow-hidden rounded-lg border border-[#42433D] bg-[#0E100F] shadow-[0_4px_16px_rgba(0,0,0,0.24)] transition-colors hover:border-[#BBBAA6]">
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex min-h-7 items-center gap-2 rounded-full border px-3 text-[10px] font-semibold ${status.className}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
            <span className="inline-flex min-h-7 items-center rounded-full border border-[#42433D] px-3 text-[10px] text-[#BBBAA6]">
              {isWalletLinked
                ? "Wallet-linked demo policy"
                : "Legacy demo policy"}
            </span>
          </div>
          <h2 className="mt-5 text-2xl font-normal leading-tight text-[#FFFCE1] sm:text-3xl">
            {policy.vaultName}
          </h2>
          <p className="mt-2 break-all font-mono text-[11px] text-[#7C7C6F]">
            {policy.id}
          </p>
        </div>

        <dl className="grid grid-cols-2 border-y border-[#42433D] py-4 lg:min-w-[340px] lg:border-y-0 lg:border-l lg:py-0 lg:pl-6">
          <div className="pr-4">
            <dt className="text-[10px] text-[#7C7C6F]">Cover amount</dt>
            <dd className="mt-2 font-mono text-xl text-[#FFFCE1]">
              {policy.coverAmountFormatted}
            </dd>
          </div>
          <div className="border-l border-[#42433D] pl-4">
            <dt className="text-[10px] text-[#7C7C6F]">Premium</dt>
            <dd className="mt-2 font-mono text-xl text-[#FFFCE1]">
              {policy.premiumFormatted}
            </dd>
          </div>
        </dl>
      </div>

      <div className="border-t border-[#42433D] px-5 py-5 sm:px-6">
        <ProofTrail status={policy.status} />
      </div>

      <div className="grid border-t border-[#42433D] lg:grid-cols-[1.15fr_0.85fr]">
        <section
          aria-labelledby={`${policy.id}-coverage`}
          className="border-b border-[#42433D] p-5 sm:p-6 lg:border-b-0 lg:border-r"
        >
          <h3
            id={`${policy.id}-coverage`}
            className="text-xs text-[#ABFF84]"
          >
            COVERAGE TERMS
          </h3>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-[10px] text-[#7C7C6F]">Expires</dt>
              <dd className="mt-1 text-sm text-[#FFFCE1]">
                {formatDate(policy.expiryTimestamp)}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] text-[#7C7C6F]">Covered asset</dt>
              <dd className="mt-1 text-sm text-[#FFFCE1]">
                {policy.coveredAsset
                  ? policy.coveredAsset.assetName
                  : "Not linked to demo asset"}
              </dd>
              {policy.coveredAsset && (
                <dd className="mt-1 text-xs text-[#7C7C6F]">
                  Exposure: {policy.coveredAsset.exposureValue}{" "}
                  {policy.coveredAsset.currency}
                </dd>
              )}
            </div>
          </dl>
          <div className="mt-5">
            <p className="text-[10px] text-[#7C7C6F]">Selected triggers</p>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Selected triggers">
              {policy.selectedTriggers.map((trigger) => (
                <li
                  key={trigger}
                  className="rounded-full border border-[#42433D] px-3 py-1.5 text-[10px] text-[#BBBAA6]"
                >
                  {trigger}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby={`${policy.id}-identity`}
          className="p-5 sm:p-6"
        >
          <h3
            id={`${policy.id}-identity`}
            className="text-xs text-[#00BAE2]"
          >
            IDENTITY &amp; PROOF
          </h3>
          <dl className="mt-5 divide-y divide-[#42433D] text-xs">
            <ProofRow
              label="Owner wallet"
              value={
                isWalletLinked
                  ? policy.ownerShortAddress ?? "Wallet linked"
                  : "No wallet owner recorded"
              }
              mono
            />
            <ProofRow label="Network" value={policy.network ?? "Casper Testnet"} />
            <ProofRow label="Mode" value={policy.mode ?? "Demo Mode"} />
            <ProofRow
              label="Wallet-linked"
              value={isWalletLinked ? "Yes" : "No"}
              accent={isWalletLinked}
            />
            <ProofRow
              label="Transaction"
              value={`TX: ${policy.txHash.slice(0, 10)}...`}
              mono
            />
          </dl>
        </section>
      </div>

      <footer className="flex flex-col gap-3 border-t border-[#42433D] bg-black/15 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs text-[#7C7C6F]">
          Local demo record · Casper Testnet proof reference
        </p>
        {policy.status === "active" ? (
          <button
            type="button"
            onClick={() => onClaim(policy.id)}
            className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[#FFFCE1] px-5 text-[11px] font-semibold text-[#FFFCE1] transition-colors hover:border-[#ABFF84] hover:bg-[#ABFF84]/10 hover:text-[#ABFF84] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00BAE2]"
          >
            File claim <span className="ml-2" aria-hidden="true">→</span>
          </button>
        ) : (
          <span className="text-sm text-[#7C7C6F]">
            {policy.status === "claimed" ? "Claim processed" : "Cover expired"}
          </span>
        )}
      </footer>
    </article>
  );
}

function ProofRow({
  label,
  value,
  mono = false,
  accent = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4 py-3 first:pt-0 last:pb-0">
      <dt className="text-[#7C7C6F]">{label}</dt>
      <dd
        className={`min-w-0 break-words text-right ${
          mono ? "font-mono" : ""
        } ${accent ? "text-[#ABFF84]" : "text-[#BBBAA6]"}`}
      >
        {value}
      </dd>
    </div>
  );
}
