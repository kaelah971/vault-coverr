"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWallet } from "@/components/ConnectWallet";

const appLinks = [
  { href: "/vaults", label: "Vaults" },
  { href: "/policies", label: "Policies" },
  { href: "/health", label: "Vault Health Monitor" },
  { href: "/risk", label: "Risk Monitor" },
];

function isActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href === "/vaults") return pathname === href;
  return pathname.startsWith(href);
}

function NavItems({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  return (
    <ul className="space-y-1" role="list">
      {appLinks.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onClick}
              className={`block rounded-[6px] px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "border-l-2 border-gold bg-[rgba(230,192,138,0.08)] text-gold"
                  : "text-text-secondary hover:bg-[rgba(230,192,138,0.06)] hover:text-gold"
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function NavSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col border-r border-border-subtle bg-deep lg:flex">
        <Link
          href="/"
          className="flex h-20 shrink-0 items-center px-6"
          aria-label="VaultCover — return to home"
        >
          <span className="font-display text-xl font-bold text-gold">
            Vault<span className="text-text-secondary">Cover</span>
          </span>
        </Link>

        <nav className="flex-1 px-3 py-4" aria-label="Dashboard navigation">
          <ul className="space-y-1" role="list">
            <li>
              <Link
                href="/"
                className="flex items-center gap-1.5 rounded-[6px] px-4 py-2.5 text-sm font-medium text-text-muted transition hover:bg-[rgba(230,192,138,0.06)] hover:text-gold"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M11 4L7 8L11 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 4H5V12H7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back to Site
              </Link>
            </li>
          </ul>
          <div className="my-4 border-t border-border-subtle" />
          <NavItems />
        </nav>

        <div className="border-t border-border-subtle px-3 py-4">
          <ConnectWallet />
          <p className="mt-3 flex items-center gap-2 px-3 text-xs text-text-muted">
            <span className="h-2 w-2 rounded-full bg-safe" />
            Casper Testnet
          </p>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border-subtle bg-deep px-4 lg:hidden">
        <Link href="/" aria-label="VaultCover — return to home">
          <span className="font-display text-lg font-bold text-gold">
            Vault<span className="text-text-secondary">Cover</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-[6px] border border-border-default p-2 text-text-secondary transition hover:border-gold hover:text-gold"
          aria-label="Open navigation menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 6H17M3 10H17M3 14H17"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-[rgba(8,10,12,0.86)] backdrop-blur-sm"
            onClick={closeMobile}
            aria-hidden="true"
          />
          {/* drawer */}
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-border-subtle bg-deep">
            <div className="flex h-16 items-center justify-between border-b border-border-subtle px-5">
              <Link
                href="/"
                onClick={closeMobile}
                className="font-display text-lg font-bold text-gold"
              >
                Vault<span className="text-text-secondary">Cover</span>
              </Link>
              <button
                type="button"
                onClick={closeMobile}
                className="rounded-[6px] border border-border-subtle p-1.5 text-text-muted transition hover:border-gold hover:text-gold"
                aria-label="Close navigation menu"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4L14 14M14 4L4 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile navigation">
              <ul className="space-y-1" role="list">
                <li>
                  <Link
                    href="/"
                    onClick={closeMobile}
                    className="flex items-center gap-1.5 rounded-[6px] px-4 py-2.5 text-sm font-medium text-text-muted transition hover:bg-[rgba(230,192,138,0.06)] hover:text-gold"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M11 4L7 8L11 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 4H5V12H7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Back to Site
                  </Link>
                </li>
              </ul>
              <div className="my-4 border-t border-border-subtle" />
              <NavItems onClick={closeMobile} />
            </nav>

            <div className="border-t border-border-subtle px-5 py-4">
              <ConnectWallet />
              <p className="mt-3 flex items-center gap-2 text-xs text-text-muted">
                <span className="h-2 w-2 rounded-full bg-safe" />
                Casper Testnet
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
