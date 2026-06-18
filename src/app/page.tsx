import Link from "next/link";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { AgentSignal } from "@/components/landing/AgentSignal";
import { ProtectionLoop } from "@/components/landing/ProtectionLoop";
import { RiskOrbit } from "@/components/landing/RiskOrbit";
import { VaultShowcase } from "@/components/landing/VaultShowcase";

const buttonBase =
  "inline-flex min-h-11 items-center justify-center rounded-full border-2 px-6 py-3 text-[11px] font-semibold leading-none transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00BAE2] motion-reduce:transition-none";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0E100F] [font-family:Mori,var(--font-geist-sans),-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-[#FFFCE1]">
      <LandingNav />

      <section
        aria-labelledby="hero-title"
        className="relative isolate w-full min-w-0 max-w-full border-b border-[#42433D] px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8 lg:pb-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,252,225,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,252,225,0.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]"
        />
        <div className="mx-auto grid min-w-0 max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.82fr)]">
          <div className="min-w-0 max-w-3xl">
            <p className="mb-6 flex items-center gap-3 text-xs text-[#BBBAA6]">
              <span className="h-px w-8 bg-[#ABFF84]" aria-hidden="true" />
              AI-monitored parametric cover for DeFi &amp; RWA vaults
            </p>
            <h1
              id="hero-title"
              className="max-w-full whitespace-normal break-words text-[2.5rem] font-normal leading-[0.92] sm:max-w-[900px] sm:text-[clamp(3rem,7.4vw,7.25rem)] sm:leading-[0.88]"
            >
              Don&apos;t just chase APY.{" "}
              <span className="text-[#ABFF84]">Cover the risk.</span>
            </h1>
            <p className="mt-8 max-w-full break-words text-base leading-7 text-[#BBBAA6] sm:max-w-xl sm:text-lg sm:leading-8">
              Compare vault health before depositing, buy protection against
              predefined danger conditions, and receive verifiable AI claim
              signals when risk changes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/vaults"
                className={`${buttonBase} border-[#FFFCE1] text-[#FFFCE1] hover:border-[#ABFF84] hover:bg-[#ABFF84]/10 hover:text-[#ABFF84]`}
              >
                Explore vaults <span aria-hidden="true">↗</span>
              </Link>
              <Link
                href="/risk"
                className={`${buttonBase} border-[#42433D] text-[#BBBAA6] hover:border-[#00BAE2] hover:bg-[#00BAE2]/10 hover:text-[#FFFCE1]`}
              >
                View live signal
              </Link>
            </div>
            <div className="mt-10 grid min-w-0 max-w-xl grid-cols-1 border-y border-[#42433D] py-2 sm:grid-cols-3 sm:py-4">
              <HeroMetric label="Network" value="Casper Testnet" />
              <HeroMetric label="Cover model" value="Parametric" />
              <HeroMetric label="Signal" value="AI + on-chain" />
            </div>
          </div>

          <RiskOrbit />
        </div>
      </section>

      <section
        aria-label="Live risk signal"
        className="border-b border-[#42433D] bg-[#ABFF84]/[0.04] py-3"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6 lg:px-8">
          <span className="shrink-0 rounded-full border border-[#ABFF84]/40 px-3 py-1 text-[#ABFF84]">
            LIVE
          </span>
          <div className="flex min-w-max items-center gap-6 text-[#BBBAA6]">
            <span>RWA-INVOICE-01</span>
            <span className="text-[#FFFCE1]">TVL −45.2% / 6H</span>
            <span>TRIGGER: TVL_DROP</span>
            <span>CONFIDENCE 91%</span>
            <span className="text-[#00BAE2]">CLAIM SIGNAL READY →</span>
          </div>
        </div>
      </section>

      <VaultShowcase />
      <ProtectionLoop />
      <AgentSignal />

      <section id="docs" className="scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-lg border border-[#42433D] bg-[#ABFF84]/[0.035] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.25)] sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end lg:p-12">
          <div>
            <p className="mb-4 text-xs text-[#ABFF84]">LIVE ON CASPER TESTNET</p>
            <h2 className="max-w-3xl text-[clamp(2rem,5vw,4rem)] font-normal leading-[0.98]">
              Stop depositing blind. Cover the vault.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#BBBAA6] sm:text-base">
              Browse three demo vaults, buy a cover policy, and follow an
              AI-generated claim signal from detection to on-chain evidence.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href="/vaults"
              className={`${buttonBase} border-[#FFFCE1] hover:border-[#ABFF84] hover:text-[#ABFF84]`}
            >
              Explore demo vaults <span aria-hidden="true">↗</span>
            </Link>
            <a
              href="https://github.com/kaelah971/vault-coverr#readme"
              target="_blank"
              rel="noreferrer"
              className={`${buttonBase} border-[#42433D] text-[#BBBAA6] hover:border-[#00BAE2] hover:text-[#FFFCE1]`}
            >
              Read the docs
            </a>
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-t border-[#42433D] px-0 py-3 first:border-t-0 sm:border-l sm:border-t-0 sm:px-3 sm:py-0 sm:first:border-l-0 sm:first:pl-0">
      <span className="block text-[10px] text-[#7C7C6F]">{label}</span>
      <span className="mt-1 block text-xs text-[#FFFCE1] sm:text-sm">{value}</span>
    </div>
  );
}
