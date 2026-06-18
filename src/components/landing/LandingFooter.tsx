import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

const footerLinks = [
  { label: "Vaults", href: "/vaults" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Protection", href: "#ai-agent" },
  { label: "Docs", href: "#docs" },
  { label: "About", href: "#about" },
] as const;

const externalLinks = [
  {
    label: "GitHub",
    href: "https://github.com/kaelah971/vault-coverr",
  },
  {
    label: "Casper Network",
    href: "https://casper.network",
  },
] as const;

const linkStyles =
  "flex min-h-11 items-center text-sm text-[#BBBAA6] transition-colors hover:text-[#ABFF84] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BAE2]";

export function LandingFooter() {
  return (
    <footer
      data-landing-section="about"
      id="about"
      className="scroll-mt-20 border-t border-[#FFFCE1]/10 bg-[#0E100F] px-4 py-10 text-[#FFFCE1] sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-8 border-b border-[#FFFCE1]/10 pb-8 md:grid-cols-[1fr_auto_auto] md:gap-12">
          <div data-motion-reveal="lift">
            <Link
              href="/"
              aria-label="VaultCover home"
              className="inline-flex min-h-11 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BAE2]"
            >
              <BrandLogo className="w-40 sm:w-48" sizes="(max-width: 640px) 10rem, 12rem" />
            </Link>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[#BBBAA6]">
              AI-monitored parametric protection for DeFi and real-world asset
              vaults.
            </p>
          </div>

          <nav aria-label="Footer navigation" data-motion-reveal="lift">
            <p className="mb-2 text-xs font-semibold text-[#FFFCE1]">Explore</p>
            <div className="grid grid-cols-2 gap-x-8 md:grid-cols-1">
              {footerLinks.map((item) => (
                <Link key={item.href} href={item.href} className={linkStyles}>
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div data-motion-reveal="lift">
            <p className="mb-2 text-xs font-semibold text-[#FFFCE1]">Connect</p>
            <div className="flex flex-col">
              {externalLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={linkStyles}
                >
                  {item.label}
                  <span aria-hidden="true" className="ml-2 text-[#00BAE2]">
                    -&gt;
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          data-motion-reveal="line"
          className="flex flex-col gap-3 pt-6 text-xs leading-5 text-[#7C7C6F] md:flex-row md:items-start md:justify-between"
        >
          <p>&copy; 2026 VaultCover.</p>
          <p className="max-w-3xl md:text-right">
            VaultCover is a Casper Testnet prototype for demonstration purposes.
            It is not insurance or financial advice, and payouts are not
            guaranteed.
          </p>
        </div>
      </div>
    </footer>
  );
}
