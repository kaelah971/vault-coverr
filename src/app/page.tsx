import Image from "next/image";
import Link from "next/link";

const vaults = [
  {
    name: "RWA Invoice Vault",
    tag: "RWA · Featured",
    description:
      "Invoice-backed real-world asset yield with cover available against payment delay, oracle failure, TVL drain, and strategy deviation.",
    apy: "8.4%",
    tvl: "$2.1M",
    policies: "34",
    risk: 47,
    riskLabel: "Medium",
    tone: "text-[#E6C08A]",
    bar: "bg-[#E6C08A]",
    featured: true,
    triggers: ["TVL Drop", "RWA Payment Delay", "Oracle Failure", "Strategy Deviation"],
  },
  {
    name: "Stable Yield Vault",
    tag: "Stable DeFi",
    description:
      "Low-risk vault with consistent APY and deep TVL for conservative on-chain depositors seeking parametric downside cover.",
    apy: "5.2%",
    tvl: "$4.7M",
    risk: 18,
    riskLabel: "Low",
    tone: "text-[#76D99C]",
    bar: "bg-[#76D99C]",
    triggers: ["APY Collapse", "TVL Drop"],
  },
  {
    name: "High APY Experimental",
    tag: "Experimental",
    description:
      "High-risk vault demonstrating live trigger events and APY volatility. A trigger signal is active on Casper Testnet.",
    apy: "38.7%",
    tvl: "$0.8M",
    risk: 83,
    riskLabel: "High",
    tone: "text-[#D66A5E]",
    bar: "bg-[#D66A5E]",
    triggers: ["Withdrawal Spike", "Risk Score Breach"],
  },
];

const flow = [
  ["01", "Browse Vaults", "Compare APY, TVL, risk score, and cover availability across Casper demo vaults."],
  ["02", "Buy Cover", "Select a vault, set cover amount, choose predefined triggers, and record the premium transaction."],
  ["03", "AI Monitors", "The AI Risk Agent evaluates vault health against predefined trigger conditions."],
  ["04", "Trigger Detected", "TVL drop, APY collapse, depeg, or withdrawal spike can generate a recorded risk event."],
  ["05", "Cover Receipt", "Receive a Cover Receipt with policy status, payout simulation, and transaction hashes."],
];

const capabilities = [
  {
    title: "Continuous health scoring",
    body: "Reads vault metrics and updates a 0-100 risk score against predefined trigger rules.",
  },
  {
    title: "Plain-language trigger explanations",
    body: "Explains exactly what happened and why when a danger condition fires.",
  },
  {
    title: "Hashable, verifiable claim signals",
    body: "Generates structured risk reports with evidence hash, confidence score, and recommended action.",
  },
  {
    title: "Permanent on-chain evidence",
    body: "Records risk events and claim signals to Casper Testnet with a transaction hash.",
  },
];

const riskReport = `{
  "vault_id": "rwa-invoice-vault",
  "risk_score": 84,
  "triggered": true,
  "trigger_type": "TVL_DROP",
  "confidence": 91,
  "summary": "Vault liquidity fell 45% in 6h. TVL_DROP breached.",
  "recommended_action": "Submit claim signal",
  "risk_report_hash": "0xd4f8...3a91"
}`;

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080A0C] text-[#EAD7B6]">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[rgba(230,192,138,0.10)] bg-[rgba(8,10,12,0.86)] backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-14">
          <Link href="/" aria-label="VaultCover home" className="shrink-0">
            <Image
              src="/vaultcover-wordmark.png"
              alt="VaultCover"
              width={1025}
              height={245}
              priority
              sizes="(min-width: 1024px) 172px, (min-width: 640px) 154px, 132px"
              className="h-auto w-[132px] sm:w-[154px] lg:w-[172px]"
            />
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-[#C8B28C] md:flex">
            <Link className="transition hover:text-[#E6C08A]" href="/vaults">Vaults</Link>
            <Link className="transition hover:text-[#E6C08A]" href="#how-it-works">How It Works</Link>
            <Link className="transition hover:text-[#E6C08A]" href="#ai-agent">Protection</Link>
            <Link className="transition hover:text-[#E6C08A]" href="#docs">Docs</Link>
            <Link className="transition hover:text-[#E6C08A]" href="#about">About</Link>
          </div>
          <Link className="rounded-[6px] border border-[rgba(230,192,138,0.55)] px-4 py-2 text-sm font-semibold text-[#E6C08A] transition hover:border-[#E6C08A] hover:bg-[rgba(230,192,138,0.08)]" href="/vaults">
            Launch App →
          </Link>
        </div>
      </nav>

      <section id="hero" className="relative min-h-screen bg-[#080A0C]">
        <div className="relative z-10 mx-auto grid min-h-screen max-w-[1440px] items-center gap-12 px-5 pb-24 pt-36 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:px-14 lg:pt-40">
          <div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#E6C08A] sm:text-sm">
              AI-Monitored Parametric Cover for DeFi &amp; RWA Vaults
            </p>
            <h1 className="font-display max-w-4xl text-[clamp(2.75rem,6.5vw,5rem)] font-bold uppercase leading-[0.96] tracking-wide text-[#E6C08A]">
              Don&apos;t Just Chase APY.<br />Cover the Risk.
            </h1>
            <p className="mt-7 max-w-2xl text-sm leading-7 text-[#EAD7B6] sm:text-[15px]">
              Compare vault risk before depositing, purchase protection{" "}
              <br className="hidden lg:block" />
              against predefined danger conditions, and receive{" "}
              <br className="hidden lg:block" />
              AI generated claim signals when vault health deteriorates
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link className="rounded-[6px] border border-white/10 bg-[#E6C08A] px-7 py-4 text-center font-semibold text-[#080A0C] transition hover:-translate-y-0.5 hover:bg-[#F0CCA0] hover:shadow-[0_0_24px_rgba(230,192,138,0.16)]" href="/vaults">
                Explore Vaults →
              </Link>
              <Link className="rounded-[6px] border border-[rgba(230,192,138,0.55)] px-7 py-4 text-center font-semibold text-[#E6C08A] transition hover:-translate-y-0.5 hover:bg-[rgba(230,192,138,0.08)]" href="/risk">
                View Demo
              </Link>
            </div>
            <p className="mt-12 flex items-center gap-3 text-sm text-[#8D7A5D]">
              <span className="h-2 w-2 rounded-full bg-[#76D99C]" /> Built on Casper Testnet
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-[rgba(230,192,138,0.10)] px-5 py-24 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeader eyebrow="The Protection Loop" title="From vault browsing to covered claim signal." body="Five steps. Every action produces a Casper transaction hash you can verify. Your Cover Receipt is the proof." />
          <div className="relative grid gap-8 md:grid-cols-5 md:gap-4">
            <div className="absolute left-[10%] right-[10%] top-5 hidden h-px bg-gradient-to-r from-transparent via-[#E6C08A] to-transparent md:block" />
            {flow.map(([num, title, desc]) => (
              <div key={num} className="relative text-center">
                <div className="mx-auto mb-6 flex h-11 w-11 items-center justify-center rounded-full border border-[#E6C08A] bg-[#080A0C] shadow-[0_0_22px_rgba(230,192,138,0.10)]"><span className="h-2 w-2 rounded-full bg-[#E6C08A]" /></div>
                <p className="mb-2 font-mono text-xs text-[#E6C08A]">{num}</p>
                <h3 className="mb-2 font-display text-xl font-bold text-[#F4E7CF]">{title}</h3>
                <p className="text-sm leading-6 text-[#8D7A5D]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="vault-explorer" className="px-5 py-24 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeader eyebrow="Vault Explorer" title="Three vaults. Three risk profiles. Zero guesswork." body="Every vault shows its parametric risk score, cover availability, and supported triggers before you deposit a single CSPR." />
          <div className="grid gap-4 lg:grid-cols-2">
            {vaults.map((vault) => (
              <article key={vault.name} className={`${vault.featured ? "lg:row-span-2 lg:p-10" : "lg:p-7"} rounded-2xl border border-[rgba(230,192,138,0.18)] bg-[#0D1013] p-6 transition hover:-translate-y-0.5 hover:border-[rgba(230,192,138,0.38)]`}>
                <span className="mb-5 inline-flex rounded-[4px] border border-[rgba(230,192,138,0.24)] bg-[rgba(230,192,138,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#E6C08A]">{vault.tag}</span>
                <h3 className="font-display text-2xl font-bold text-[#F4E7CF]">{vault.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[#8D7A5D]">{vault.description}</p>
                <div className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-3">
                  <Metric label="APY" value={vault.apy} muted />
                  <Metric label="TVL" value={vault.tvl} />
                  {vault.policies && <Metric label="Active Policies" value={vault.policies} />}
                </div>
                <div className="mt-7">
                  <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.12em] text-[#8D7A5D]"><span>Risk Score</span><span className={`font-mono ${vault.tone}`}>{vault.risk} / 100 · {vault.riskLabel}</span></div>
                  <div className="h-1 overflow-hidden rounded-full bg-[#171C21]"><div className={`h-full ${vault.bar}`} style={{ width: `${vault.risk}%` }} /></div>
                </div>
                <div className="mt-7 flex flex-wrap gap-2">
                  {vault.triggers.map((trigger) => <span key={trigger} className="rounded-[4px] border border-[rgba(230,192,138,0.12)] bg-[#12161A] px-3 py-1 text-xs text-[#C8B28C]">{trigger}</span>)}
                </div>
                <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(230,192,138,0.10)] pt-5 text-sm text-[#C8B28C]">
                  <span className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${vault.risk > 80 ? "bg-[#D66A5E]" : "bg-[#76D99C]"}`} />{vault.risk > 80 ? "Trigger Active" : "Cover Available"}</span>
                  <Link className="rounded-[6px] border border-[rgba(230,192,138,0.55)] px-4 py-2 font-semibold text-[#E6C08A] transition hover:bg-[rgba(230,192,138,0.08)]" href={vault.featured ? "/vaults/rwa-invoice-vault" : vault.risk > 80 ? "/risk" : "/vaults/stable-yield-vault"}>{vault.featured ? "Cover This Vault →" : vault.risk > 80 ? "View Signal →" : "View Vault →"}</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="ai-agent" className="border-y border-[rgba(230,192,138,0.10)] px-5 py-24 sm:px-8 lg:px-14">
        <div className="mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-2">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#8D7A5D]">The AI Risk Agent</p>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-bold uppercase leading-none text-[#E6C08A]">Reads the vault. Not just the APY.</h2>
            <p className="mt-6 text-base leading-8 text-[#C8B28C]">The agent reads liquidity patterns, withdrawal velocity, strategy deviations, and predefined trigger thresholds before producing a hashable claim signal.</p>
            <div className="mt-10 divide-y divide-[rgba(230,192,138,0.10)] border-y border-[rgba(230,192,138,0.10)]">
              {capabilities.map((capability, index) => (
                <div key={capability.title} className="flex gap-5 py-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-[rgba(230,192,138,0.18)] bg-[rgba(230,192,138,0.08)] font-mono text-xs text-[#E6C08A]">0{index + 1}</span>
                  <div>
                    <h3 className="font-semibold text-[#F4E7CF]">{capability.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#8D7A5D]">{capability.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-[rgba(230,192,138,0.16)] bg-[#050607]">
            <div className="flex items-center justify-between border-b border-[rgba(230,192,138,0.12)] bg-[#12161A] px-5 py-4 font-mono text-xs text-[#8D7A5D]"><span>risk_agent_output.json</span><span className="text-[#76D99C]">● Live Signal</span></div>
            <pre className="overflow-x-auto p-5 font-mono text-xs leading-6 text-[#C8B28C] sm:text-sm">{riskReport}</pre>
            <div className="flex flex-col gap-3 border-t border-[rgba(118,217,156,0.14)] bg-[rgba(118,217,156,0.05)] px-5 py-4 text-sm text-[#76D99C] sm:flex-row sm:items-center sm:justify-between"><span>Claim signal generated · Casper event recorded</span><Link className="font-semibold" href="/claim/rwa-invoice-vault">Submit Claim →</Link></div>
          </div>
        </div>
      </section>

      <section id="cta" className="px-5 py-24 sm:px-8 lg:px-14">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-10 rounded-[18px] border border-[rgba(230,192,138,0.18)] bg-[#0D1013] p-8 lg:flex-row lg:items-center lg:justify-between lg:p-16">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#8D7A5D]">Live Demo</p>
            <h2 className="font-display text-[clamp(2.3rem,4vw,3.5rem)] font-bold uppercase leading-none text-[#E6C08A]">Stop depositing blind. Cover the vault.</h2>
            <p className="mt-5 max-w-xl leading-8 text-[#C8B28C]">VaultCover Agent is live on Casper Testnet. Browse three demo vaults, buy a cover policy, and receive your first AI-generated claim signal, all on-chain and verifiable.</p>
          </div>
          <div className="flex w-full max-w-sm flex-col gap-3">
            <Link className="rounded-[6px] border border-white/10 bg-[#E6C08A] px-7 py-4 text-center font-semibold text-[#080A0C] transition hover:-translate-y-0.5 hover:bg-[#F0CCA0]" href="/vaults">Explore Demo Vaults →</Link>
            <a className="rounded-[6px] border border-[rgba(230,192,138,0.24)] px-7 py-4 text-center font-semibold text-[#C8B28C] transition hover:border-[#E6C08A] hover:text-[#E6C08A]" href="#docs">Read the Docs</a>
            <p className="flex items-center justify-center gap-2 text-center text-xs text-[#8D7A5D]"><span className="h-2 w-2 rounded-full bg-[#76D99C]" />Live on Casper Testnet · No mainnet funds required</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[rgba(230,192,138,0.10)] px-5 py-8 text-sm text-[#8D7A5D] sm:px-8 lg:px-14">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-display text-lg font-bold text-[#E6C08A]">Vault<span className="text-[#C8B28C]">Cover</span></div>
          <div className="flex flex-wrap gap-5">
            <a className="transition hover:text-[#E6C08A]" href="#docs">Docs</a>
            <a className="transition hover:text-[#E6C08A]" href="https://casper.network" rel="noreferrer" target="_blank">Casper Network</a>
            <a className="transition hover:text-[#E6C08A]" href="#">GitHub</a>
            <a className="transition hover:text-[#E6C08A]" href="#">Twitter/X</a>
          </div>
          <p>© 2026 VaultCover. Parametric cover prototype.</p>
        </div>
      </footer>
    </main>
  );
}

function SectionHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mb-14">
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#8D7A5D]">{eyebrow}</p>
      <h2 className="font-display max-w-3xl text-[clamp(2.4rem,5vw,4rem)] font-bold uppercase leading-none text-[#E6C08A]">{title}</h2>
      <p className="mt-5 max-w-xl leading-8 text-[#C8B28C]">{body}</p>
    </div>
  );
}

function Metric({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div>
      <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#8D7A5D]">{label}</span>
      <span className={`mt-2 block font-mono text-2xl font-semibold ${muted ? "text-[#C8B28C]" : "text-[#F4E7CF]"}`}>{value}</span>
    </div>
  );
}
