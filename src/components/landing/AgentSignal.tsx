import Link from "next/link";
import { SectionIntro } from "./VaultShowcase";

const capabilities = [
  ["Continuous health scoring", "Updates a 0-100 risk score against predefined trigger rules."],
  ["Plain-language explanations", "States what changed and why a danger condition fired."],
  ["Hashable claim signals", "Packages evidence, confidence, and a recommended action."],
  ["Permanent evidence", "Records risk events to Casper Testnet with a transaction hash."],
];

const riskReport = `{
  "vault_id": "rwa-invoice-vault",
  "risk_score": 84,
  "triggered": true,
  "trigger_type": "TVL_DROP",
  "confidence": 91,
  "summary": "Liquidity fell 45% in 6h.",
  "recommended_action": "Submit claim signal",
  "risk_report_hash": "0xd4f8...3a91"
}`;

export function AgentSignal() {
  return (
    <section
      data-landing-section="ai-agent"
      id="ai-agent"
      aria-labelledby="agent-title"
      className="scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          kicker="03 / AI RISK AGENT"
          title="Reads the vault. Not just the APY."
          body="The agent evaluates liquidity, withdrawal velocity, strategy deviation, and trigger thresholds before producing a claim signal."
          id="agent-title"
        />
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-lg border border-[#42433D]">
            {capabilities.map(([title, body], index) => (
              <div
                key={title}
                data-motion-reveal="card"
                className="grid grid-cols-[32px_1fr] gap-4 border-b border-[#42433D] p-5 last:border-b-0"
              >
                <span className="text-xs text-[#ABFF84]">0{index + 1}</span>
                <div>
                  <h3 className="text-base font-normal">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#7C7C6F]">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <div
            data-motion-reveal="card"
            className="overflow-hidden rounded-lg border border-[#42433D] bg-black shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between border-b border-[#42433D] px-5 py-4 text-xs text-[#7C7C6F]">
              <span>risk_agent_output.json</span>
              <span className="flex items-center gap-2 text-[#ABFF84]">
                <span
                  className="h-2 w-2 rounded-full bg-[#ABFF84] motion-safe:animate-pulse"
                  aria-hidden="true"
                />
                Live signal
              </span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-xs leading-6 text-[#BBBAA6] sm:p-8 sm:text-sm">
              <code>{riskReport}</code>
            </pre>
            <div
              data-motion-reveal="lift"
              className="flex flex-col gap-3 border-t border-[#ABFF84]/25 bg-[#ABFF84]/[0.05] px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-[#ABFF84]">
                Claim signal generated · event recorded
              </span>
              <Link
                href="/risk"
                className="min-h-11 py-3 text-[#FFFCE1] underline decoration-[#00BAE2] underline-offset-4 hover:text-[#00BAE2] focus-visible:outline-2 focus-visible:outline-[#00BAE2]"
              >
                Review signal -&gt;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
