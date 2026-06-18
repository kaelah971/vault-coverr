"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  { label: "Vaults", href: "/vaults" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Protection", href: "#ai-agent" },
  { label: "Docs", href: "#docs" },
  { label: "About", href: "#about" },
] as const;

const focusStyles =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BAE2]";

export function LandingNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 top-0 z-50 border-b border-[#FFFCE1]/10 bg-[#0E100F] text-[#FFFCE1]"
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="VaultCover home"
          className={`flex min-h-11 shrink-0 items-center text-lg font-semibold ${focusStyles}`}
        >
          Vault<span className="text-[#ABFF84]">Cover</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-11 items-center px-3 text-base font-normal transition-colors hover:text-[#ABFF84] ${focusStyles}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/vaults"
            className={`hidden min-h-11 items-center rounded-full border-2 border-[#FFFCE1] px-4 text-[11px] font-semibold leading-none transition-colors hover:border-[#ABFF84] hover:bg-[#FFFCE1]/10 hover:text-[#ABFF84] sm:flex ${focusStyles}`}
          >
            Launch app
            <span aria-hidden="true" className="ml-2">-&gt;</span>
          </Link>

          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="landing-mobile-menu"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsOpen((open) => !open)}
            className={`flex size-11 items-center justify-center text-[#FFFCE1] transition-colors hover:text-[#00BAE2] md:hidden ${focusStyles}`}
          >
            {isOpen ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        id="landing-mobile-menu"
        hidden={!isOpen}
        className="border-t border-[#FFFCE1]/10 bg-[#0E100F] px-4 pb-4 md:hidden"
      >
        <div className="mx-auto flex max-w-[1280px] flex-col py-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex min-h-11 items-center border-b border-[#FFFCE1]/10 text-base transition-colors last:border-b-0 hover:text-[#ABFF84] ${focusStyles}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/vaults"
            onClick={() => setIsOpen(false)}
            className={`mt-4 flex min-h-11 items-center justify-center rounded-full border-2 border-[#FFFCE1] px-4 text-[11px] font-semibold leading-none transition-colors hover:border-[#00BAE2] hover:bg-[#FFFCE1]/10 hover:text-[#00BAE2] sm:hidden ${focusStyles}`}
          >
            Launch app
            <span aria-hidden="true" className="ml-2">-&gt;</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
