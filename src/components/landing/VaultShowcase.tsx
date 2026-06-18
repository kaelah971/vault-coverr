import Link from "next/link";

const vaults = [
  {
    name: "RWA Invoice Vault",
    tag: "RWA · Featured",
    description:
      "Invoice-backed real-world asset yield with cover against payment delay, oracle failure, TVL drain, and strategy deviation.",
    apy: "8.4%",
    tvl: "$2.1M",
    policies: "34",
    risk: 47,
    riskLabel: "Medium",
    color: "#00BAE2",
    href: "/vaults/rwa-invoice-vault",
    action: "Cover this vault",
    triggers: ["TVL Drop", "RWA Payment Delay", "Oracle Failure"],
  },
  {
    name: "Stable Yield Vault",
    tag: "Stable DeFi",
    description:
      "Consistent APY and deep TVL for conservative on-chain depositors seeking parametric downside cover.",
    apy: "5.2%",
    tvl: "$4.7M",
    policies: "—",
    risk: 18,
    riskLabel: "Low",
    color: "#ABFF84",
    href: "/vaults/stable-yield-vault",
    action: "View vault",
    triggers: ["APY Collapse", "TVL Drop"],
  },
  {
    name: "High APY Experimental",
    tag: "Experimental",
    description:
      "A high-volatility vault demonstrating live trigger events. A risk signal is active on Casper Testnet.",
    apy: "38.7%",
    tvl: "$0.8M",
    policies: "—",
    risk: 83,
    riskLabel: "High",
    color: "#FFFCE1",
    href: "/risk",
    action: "View signal",
    triggers: ["Withdrawal Spike", "Risk Score Breach"],
  },
];

export function VaultShowcase() {
  return (
    <section id="vault-explorer" aria-labelledby="vault-title" className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          kicker="01 / VAULT EXPLORER"
          title="See the risk before you deposit."
          body="Every vault exposes its risk score, cover availability, and supported triggers—not just the headline yield."
          id="vault-title"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {vaults.map((vault) => (
            <article
              key={vault.name}
              className="group flex min-h-[420px] flex-col rounded-lg border border-[#42433D] bg-[#0E100F] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-1 hover:border-[#BBBAA6] motion-reduce:transform-none motion-reduce:transition-none"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-[10px] text-[#7C7C6F]">{vault.tag}</span>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: vault.color }} aria-hidden="true" />
              </div>
              <h3 className="mt-8 text-2xl font-normal leading-tight">{vault.name}</h3>
              <p className="mt-3 text-sm leading-6 text-[#BBBAA6]">{vault.description}</p>
              <dl className="mt-8 grid grid-cols-3 border-y border-[#42433D] py-4">
                <Metric label="APY" value={vault.apy} />
                <Metric label="TVL" value={vault.tvl} />
                <Metric label="Policies" value={vault.policies} />
              </dl>
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#7C7C6F]">Risk score</span>
                  <span>{vault.risk} / 100 · {vault.riskLabel}</span>
                </div>
                <div
                  className="mt-3 h-px bg-[#42433D]"
                  role="progressbar"
                  aria-label={`${vault.name} risk score`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={vault.risk}
                  aria-valuetext={`${vault.risk} out of 100, ${vault.riskLabel} risk`}
                >
                  <div className="h-px" style={{ width: `${vault.risk}%`, backgroundColor: vault.color }} />
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {vault.triggers.map((trigger) => (
                  <span key={trigger} className="rounded-full border border-[#42433D] px-3 py-1 text-[10px] text-[#BBBAA6]">
                    {trigger}
                  </span>
                ))}
              </div>
              <Link
                href={vault.href}
                className="mt-auto flex min-h-11 items-end justify-between border-b border-[#42433D] pt-8 text-sm transition hover:border-[#ABFF84] hover:text-[#ABFF84] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00BAE2]"
              >
                {vault.action} <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-[#42433D] px-3 first:border-l-0 first:pl-0">
      <dt className="text-[9px] text-[#7C7C6F]">{label}</dt>
      <dd className="mt-1 text-base">{value}</dd>
    </div>
  );
}

export function SectionIntro({
  kicker,
  title,
  body,
  id,
}: {
  kicker: string;
  title: string;
  body: string;
  id: string;
}) {
  return (
    <div className="mb-10 grid gap-5 border-t border-[#42433D] pt-5 md:grid-cols-[1fr_2fr]">
      <p className="text-xs text-[#ABFF84]">{kicker}</p>
      <div>
        <h2 id={id} className="max-w-3xl text-[clamp(2rem,5vw,4.5rem)] font-normal leading-[0.95]">
          {title}
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-7 text-[#BBBAA6] sm:text-base">{body}</p>
      </div>
    </div>
  );
}
