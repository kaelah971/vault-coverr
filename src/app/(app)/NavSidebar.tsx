"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWallet } from "@/components/ConnectWallet";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  ArrowLeftIcon,
  CloseIcon,
  HealthIcon,
  MenuIcon,
  PolicyIcon,
  RiskIcon,
  VaultIcon,
} from "@/components/app-shell/AppShellIcons";

const appLinks = [
  { href: "/vaults", label: "Vaults", detail: "Browse coverable vaults", icon: VaultIcon },
  { href: "/policies", label: "Policies", detail: "Review your protection", icon: PolicyIcon },
  { href: "/health", label: "Health", detail: "Inspect vault conditions", icon: HealthIcon },
  { href: "/risk", label: "Risk", detail: "Follow agent signals", icon: RiskIcon },
];

const focusStyles =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BAE2]";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={`inline-flex min-h-11 items-center ${focusStyles}`}
      aria-label="VaultCover return to home"
    >
      <BrandLogo className="w-32 sm:w-36" sizes="(max-width: 640px) 8rem, 9rem" />
    </Link>
  );
}

function WorkspaceContext() {
  return (
    <div className="rounded-lg border border-[#42433D] bg-[#ABFF84]/[0.035] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-[#BBBAA6]">Coverage workspace</span>
        <span className="rounded-full border border-[#ABFF84]/35 px-2 py-1 text-[10px] font-semibold leading-none text-[#ABFF84]">
          TESTNET
        </span>
      </div>
      <p className="mt-3 text-sm leading-5 text-[#FFFCE1]">
        AI-monitored parametric cover on Casper.
      </p>
    </div>
  );
}

function NavItems({ pathname, onClick }: { pathname: string; onClick?: () => void }) {
  return (
    <ul className="space-y-2" role="list">
      {appLinks.map((link) => {
        const active = isActive(pathname, link.href);
        const Icon = link.icon;

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onClick}
              aria-current={active ? "page" : undefined}
              className={`group relative flex min-h-14 items-center gap-3 border-l-2 px-4 py-2 transition-colors motion-reduce:transition-none ${focusStyles} ${
                active
                  ? "border-[#ABFF84] bg-[#ABFF84]/[0.06] text-[#FFFCE1]"
                  : "border-transparent text-[#BBBAA6] hover:border-[#42433D] hover:bg-[#FFFCE1]/[0.035] hover:text-[#FFFCE1]"
              }`}
            >
              <Icon className={`shrink-0 ${active ? "text-[#ABFF84]" : "text-[#7C7C6F] group-hover:text-[#00BAE2]"}`} />
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-5">{link.label}</span>
                <span className="block truncate text-xs font-normal leading-4 text-[#7C7C6F]">
                  {link.detail}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function WalletArea() {
  return (
    <div className="border-t border-[#42433D] p-4">
      <p className="mb-3 flex items-center gap-2 text-xs text-[#BBBAA6]">
        <span className="relative flex size-2" aria-hidden="true">
          <span className="absolute inline-flex size-full rounded-full bg-[#ABFF84]/40 motion-safe:animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-[#ABFF84]" />
        </span>
        Casper Testnet
      </p>
      <div className="[&_a]:min-h-11 [&_a]:rounded-full [&_a]:border-[#42433D] [&_a]:!bg-transparent [&_a]:text-[#FFFCE1] [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-[#00BAE2] [&_button]:min-h-11 [&_button]:rounded-full [&_button]:border-[#42433D] [&_button]:!bg-transparent [&_button]:text-[#FFFCE1] [&_button]:shadow-none [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-[#00BAE2] [&_button]:hover:border-[#ABFF84] [&_button]:hover:text-[#ABFF84] [&_div.absolute]:rounded-lg [&_div.absolute]:border-[#42433D] [&_div.absolute]:!bg-[#0E100F]">
        <ConnectWallet />
      </div>
    </div>
  );
}

export default function NavSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerTitleId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    const appMain = document.querySelector("main");
    appMain?.setAttribute("inert", "");

    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(
      drawerRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []
    );
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      appMain?.removeAttribute("inert");
      window.removeEventListener("keydown", handleKeyDown);
      menuButton?.focus();
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-[#42433D] bg-[#0E100F] lg:flex">
        <div className="flex h-20 shrink-0 items-center border-b border-[#42433D] px-6">
          <Brand />
        </div>

        <div className="px-4 pt-5">
          <WorkspaceContext />
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="VaultCover workspace">
          <p className="mb-3 px-4 text-xs text-[#7C7C6F]">Workspace</p>
          <NavItems pathname={pathname} />
        </nav>

        <div className="px-4 pb-4">
          <Link
            href="/"
            className={`flex min-h-11 items-center gap-2 px-4 text-xs text-[#7C7C6F] transition-colors hover:text-[#00BAE2] motion-reduce:transition-none ${focusStyles}`}
          >
            <ArrowLeftIcon className="size-4" />
            Back to public site
          </Link>
        </div>
        <WalletArea />
      </aside>

      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#42433D] bg-[#0E100F]/95 px-4 backdrop-blur sm:px-6 lg:hidden">
        <Brand />
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMobileOpen(true)}
          className={`grid size-11 place-items-center text-[#FFFCE1] transition-colors hover:text-[#ABFF84] motion-reduce:transition-none ${focusStyles}`}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="app-navigation-drawer"
        >
          <MenuIcon />
        </button>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
            onClick={closeMobile}
            aria-label="Close navigation menu"
          />
          <aside
            ref={drawerRef}
            id="app-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={drawerTitleId}
            className="absolute inset-y-0 right-0 flex w-[min(88vw,22rem)] flex-col border-l border-[#42433D] bg-[#0E100F] shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#42433D] px-5">
              <span id={drawerTitleId}>
                <Brand onClick={closeMobile} />
              </span>
              <button
                type="button"
                onClick={closeMobile}
                className={`grid size-11 place-items-center text-[#BBBAA6] transition-colors hover:text-[#00BAE2] motion-reduce:transition-none ${focusStyles}`}
                aria-label="Close navigation menu"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="px-5 pt-5">
              <WorkspaceContext />
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile VaultCover workspace">
              <p className="mb-3 px-4 text-xs text-[#7C7C6F]">Workspace</p>
              <NavItems pathname={pathname} onClick={closeMobile} />
              <Link
                href="/"
                onClick={closeMobile}
                className={`mt-6 flex min-h-11 items-center gap-2 border-t border-[#42433D] px-4 pt-5 text-xs text-[#7C7C6F] hover:text-[#00BAE2] ${focusStyles}`}
              >
                <ArrowLeftIcon className="size-4" />
                Back to public site
              </Link>
            </nav>

            <WalletArea />
          </aside>
        </div>
      ) : null}
    </>
  );
}
