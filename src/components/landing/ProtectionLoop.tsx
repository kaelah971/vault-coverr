import { SectionIntro } from "./VaultShowcase";

const steps = [
  ["01", "Browse vaults", "Compare APY, TVL, risk score, and cover availability."],
  ["02", "Buy cover", "Choose an amount and predefined trigger conditions."],
  ["03", "AI monitors", "The risk agent evaluates vault health continuously."],
  ["04", "Trigger detected", "A threshold breach generates a recorded risk event."],
  ["05", "Cover receipt", "Review policy status, evidence, and transaction hashes."],
];

export function ProtectionLoop() {
  return (
    <section id="how-it-works" aria-labelledby="loop-title" className="scroll-mt-20 border-y border-[#42433D] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          kicker="02 / PROTECTION LOOP"
          title="Five actions. One verifiable trail."
          body="From vault selection to cover receipt, each meaningful action produces evidence you can inspect on Casper Testnet."
          id="loop-title"
        />
        <ol className="grid border-l border-t border-[#42433D] sm:grid-cols-2 lg:grid-cols-5">
          {steps.map(([number, title, body]) => (
            <li key={number} className="min-h-56 border-b border-r border-[#42433D] p-5">
              <span className="text-xs text-[#00BAE2]">{number}</span>
              <h3 className="mt-12 text-lg font-normal">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#7C7C6F]">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
