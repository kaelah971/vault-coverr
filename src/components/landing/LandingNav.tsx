"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { BrandLogo } from "@/components/brand/BrandLogo";

const navigation = [
  { label: "Vaults", href: "/vaults" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Protection", href: "#ai-agent" },
  { label: "Docs", href: "#docs" },
  { label: "About", href: "#about" },
] as const;

const focusStyles =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BAE2]";

type LandingNavProps = {
  activeId: string | null;
  reducedMotion: boolean;
  onNavigate: (hash: string) => void;
};

export function LandingNav({ activeId, reducedMotion, onNavigate }: LandingNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const navRowRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});

  useLayoutEffect(() => {
    const indicator = indicatorRef.current;
    const navRow = navRowRef.current;
    const targetId = hoverId ?? activeId;

    if (!indicator || !navRow || !targetId) {
      if (indicator) {
        gsap.to(indicator, {
          autoAlpha: 0,
          duration: 0.2,
          ease: "power2.out",
        });
      }
      return;
    }

    const target = itemRefs.current[targetId];

    if (!target) {
      return;
    }

    const navRect = navRow.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const x = targetRect.left - navRect.left - 10;
    const width = targetRect.width + 20;

    if (reducedMotion) {
      indicator.style.transform = `translate(${x}px, -50%)`;
      indicator.style.width = `${width}px`;
      indicator.style.opacity = "1";
      return;
    }

    gsap.to(indicator, {
      x,
      width,
      autoAlpha: 1,
      duration: 0.35,
      ease: "power3.out",
    });
  }, [activeId, hoverId, reducedMotion]);

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 top-0 z-50 border-b border-[#FFFCE1]/10 bg-[#0E100F]/95 text-[#FFFCE1] backdrop-blur-sm"
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="VaultCover home"
          data-nav-load
          className={`flex min-h-11 shrink-0 items-center ${focusStyles}`}
        >
          <BrandLogo className="w-36 sm:w-40" priority sizes="(max-width: 640px) 9rem, 10rem" />
        </Link>

        <div ref={navRowRef} className="relative hidden items-center gap-2 md:flex">
          <span
            ref={indicatorRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 h-10 -translate-y-1/2 rounded-full border border-[#ABFF84]/20 bg-[#ABFF84]/10 opacity-0"
          />
          {navigation.map((item) => {
            const itemId = item.href.startsWith("#") ? item.href.slice(1) : item.href;
            const isActive = activeId === itemId;

            if (item.href.startsWith("#")) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  scroll={false}
                  ref={(node) => {
                    itemRefs.current[itemId] = node;
                  }}
                  aria-current={isActive ? "page" : undefined}
                  data-nav-load
                  onMouseEnter={(event) => {
                    setHoverId(itemId);
                    if (!reducedMotion) {
                      gsap.to(event.currentTarget, {
                        y: -2,
                        duration: 0.2,
                        ease: "power2.out",
                      });
                    }
                  }}
                  onMouseLeave={(event) => {
                    setHoverId(null);
                    if (!reducedMotion) {
                      gsap.to(event.currentTarget, {
                        y: 0,
                        duration: 0.2,
                        ease: "power2.out",
                      });
                    }
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate(item.href);
                  }}
                  className={`relative z-10 flex min-h-11 items-center px-3 text-base font-normal transition-colors hover:text-[#ABFF84] ${focusStyles} ${
                    isActive ? "text-[#ABFF84]" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(node) => {
                  itemRefs.current[itemId] = node;
                }}
                aria-current={isActive ? "page" : undefined}
                data-nav-load
                onMouseEnter={(event) => {
                  setHoverId(itemId);
                  if (!reducedMotion) {
                    gsap.to(event.currentTarget, {
                      y: -2,
                      duration: 0.2,
                      ease: "power2.out",
                    });
                  }
                }}
                onMouseLeave={(event) => {
                  setHoverId(null);
                  if (!reducedMotion) {
                    gsap.to(event.currentTarget, {
                      y: 0,
                      duration: 0.2,
                      ease: "power2.out",
                    });
                  }
                }}
                onClick={(event) => {
                  if (item.href.startsWith("#")) {
                    event.preventDefault();
                    onNavigate(item.href);
                  }
                }}
                className={`relative z-10 flex min-h-11 items-center px-3 text-base font-normal transition-colors hover:text-[#ABFF84] ${focusStyles} ${
                  isActive ? "text-[#ABFF84]" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/vaults"
            data-nav-load
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
            item.href.startsWith("#") ? (
              <Link
                key={item.href}
                href={item.href}
                scroll={false}
                data-nav-load
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(item.href);
                  setIsOpen(false);
                }}
                className={`flex min-h-11 items-center border-b border-[#FFFCE1]/10 text-base transition-colors last:border-b-0 hover:text-[#ABFF84] ${focusStyles}`}
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                data-nav-load
                onClick={() => setIsOpen(false)}
                className={`flex min-h-11 items-center border-b border-[#FFFCE1]/10 text-base transition-colors last:border-b-0 hover:text-[#ABFF84] ${focusStyles}`}
              >
                {item.label}
              </Link>
            )
          ))}
          <Link
            href="/vaults"
            data-nav-load
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
