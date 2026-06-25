interface VaultSummaryProps {
  totalTVL: number;
  averageRisk: number;
  activeVaults: number;
}

export function VaultSummary({
  totalTVL,
  averageRisk,
  activeVaults,
}: VaultSummaryProps) {
  const metrics = [
    { label: "Average risk", value: `${averageRisk} / 100`, accent: true },
    { label: "Total demo TVL", value: `${totalTVL} CSPR` },
    { label: "Active vaults", value: String(activeVaults) },
    { label: "Network", value: "Casper Testnet" },
  ];

  return (
    <section
      aria-label="Vault summary"
      className="mt-4 grid overflow-hidden rounded-lg border border-[#42433D] bg-[#ABFF84]/[0.025] shadow-[0_4px_16px_rgba(0,0,0,0.2)] sm:grid-cols-2 lg:grid-cols-4"
    >
      {metrics.map((metric, index) => (
        <div
          key={metric.label}
          className={`border-t border-[#42433D] bg-[#0E100F]/70 p-5 first:border-t-0 transition-colors duration-300 hover:bg-[#FFFCE1]/[0.035] motion-reduce:transition-none sm:first:border-t-0 lg:border-l lg:border-t-0 lg:first:border-l-0 ${
            index % 2 === 0 ? "sm:border-l-0" : "sm:border-l"
          } ${index === 2 ? "lg:border-l" : ""}`}
        >
          <p className="text-[9px] text-[#7C7C6F]">{metric.label}</p>
          <p
            className={`mt-2 text-base ${
              metric.accent ? "text-[#ABFF84]" : "text-[#FFFCE1]"
            }`}
          >
            {metric.value}
          </p>
        </div>
      ))}
    </section>
  );
}

const flow = [
  ["Vault", "Yield product"],
  ["Cover policy", "Parametric cover"],
  ["AI Risk Agent", "Monitor triggers"],
  ["Claim signal", "Trigger fired"],
  ["Cover receipt", "Recorded on-chain"],
];

export function ProtectionFlow() {
  return (
    <section aria-labelledby="vault-model-title" className="border-t border-[#42433D] py-12 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[0.7fr_1.5fr]">
        <div>
          <p className="text-xs text-[#00BAE2]">THE COVER MODEL</p>
          <h2 id="vault-model-title" className="mt-4 text-3xl font-normal leading-tight sm:text-4xl">
            Yield product below.
            <span className="block text-[#BBBAA6]">Protection layer above.</span>
          </h2>
        </div>
        <div>
          <p className="max-w-3xl text-sm leading-7 text-[#BBBAA6] sm:text-base">
            These Casper Testnet demo vaults represent yield products a user
            might deposit into. VaultCover sits on top as a parametric cover
            layer that monitors measurable risk and records the protection trail.
          </p>
          <ol className="mt-8 grid gap-px overflow-hidden rounded-lg border border-[#42433D] bg-[#42433D] shadow-[0_4px_16px_rgba(0,0,0,0.24)] sm:grid-cols-2 xl:grid-cols-5">
            {flow.map(([label, detail], index) => (
              <li
                key={label}
                className="group relative min-h-32 overflow-hidden bg-[#0E100F] p-4 transition-colors duration-300 hover:bg-[#ABFF84]/[0.035] motion-reduce:transition-none"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,#ABFF84,#00BAE2)] transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none"
                />
                <span className="text-[10px] text-[#7C7C6F]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-6 text-sm text-[#FFFCE1]">{label}</p>
                <p className="mt-1 text-xs text-[#7C7C6F]">{detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const protectionSteps = [
  [
    "Select a vault",
    "Browse available vaults and choose one that matches your risk profile and yield expectations.",
  ],
  [
    "Buy cover against specific triggers",
    "Choose which risk triggers you want parametric cover for. Premium is 1.5% of the cover amount.",
  ],
  [
    "AI Risk Agent monitors vault health",
    "The AI Risk Agent continuously scores vault health, tracking TVL, APY, oracle feeds, and other metrics.",
  ],
  [
    "Claim signal generated if trigger breached",
    "When a covered trigger condition is met, the AI Risk Agent generates a claim signal with confidence score.",
  ],
  [
    "Casper records the protection trail",
    "The policy, risk event, claim signal, and cover receipt are all recorded immutably on Casper.",
  ],
  [
    "Cover Receipt issued",
    "You receive a verifiable cover receipt with payout simulation details and transaction hashes.",
  ],
];

export function ProtectionSteps() {
  return (
    <section aria-labelledby="protection-title" className="border-t border-[#42433D] py-12 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[0.7fr_1.5fr]">
        <div>
          <p className="text-xs text-[#ABFF84]">HOW PROTECTION WORKS</p>
          <h2 id="protection-title" className="mt-4 text-3xl font-normal leading-tight sm:text-4xl">
            From risk selection to verifiable receipt.
          </h2>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-lg border border-[#42433D] bg-[#42433D] shadow-[0_4px_16px_rgba(0,0,0,0.24)] sm:grid-cols-2">
          {protectionSteps.map(([title, body], index) => (
            <li
              key={title}
              className="group relative min-h-52 overflow-hidden bg-[#0E100F] p-5 transition-colors duration-300 hover:bg-[#FFFCE1]/[0.025] motion-reduce:transition-none sm:p-6"
            >
              <span
                aria-hidden="true"
                className="absolute right-5 top-5 h-2 w-2 rounded-full bg-[#42433D] transition-colors duration-300 group-hover:bg-[#ABFF84] motion-reduce:transition-none"
              />
              <span className="text-xs text-[#00BAE2]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-8 text-lg font-normal text-[#FFFCE1]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#7C7C6F]">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
