"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useMemo, useSyncExternalStore, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LandingNav } from "./LandingNav";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const NAV_OFFSET = 84;
const trackedSections = [
  "how-it-works",
  "ai-agent",
  "docs",
  "about",
] as const;

type LandingMotionProps = {
  children: ReactNode;
};

export function LandingMotion({ children }: LandingMotionProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const animationTargets = useMemo(() => trackedSections, []);

  useLayoutEffect(() => {
    const scope = document.querySelector<HTMLElement>("[data-landing-shell]");

    if (!scope) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const sectionById = new Map(
      trackedSections.map((sectionId) => [
        sectionId,
        document.getElementById(sectionId),
      ]),
    );

    const scrollToHash = (hash: string) => {
      const targetId = hash.replace("#", "");
      const target =
        sectionById.get(targetId) ?? document.getElementById(targetId);

      if (!target) {
        return;
      }

      const targetTop =
        window.scrollY + target.getBoundingClientRect().top - NAV_OFFSET;

      if (prefersReducedMotion) {
        window.scrollTo({ top: targetTop });
        window.history.pushState(null, "", hash);
        return;
      }

      gsap.to(window, {
        duration: 1.05,
        ease: "power3.inOut",
        overwrite: "auto",
        scrollTo: {
          y: targetTop,
          autoKill: true,
        },
        onComplete: () => {
          window.history.pushState(null, "", hash);
        },
      });
    };

    (window as typeof window & {
      __landingScrollTo?: (hash: string) => void;
    }).__landingScrollTo = scrollToHash;

    if (prefersReducedMotion) {
      return () => {
        delete (window as typeof window & {
          __landingScrollTo?: (hash: string) => void;
        }).__landingScrollTo;
      };
    }

    const navItems = Array.from(
      scope.querySelectorAll<HTMLElement>("[data-nav-load]"),
    );
    const revealGroups = gsap.utils.toArray<HTMLElement>(
      "[data-landing-section]",
      scope,
    );
    const hoverCardCleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const loadTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      loadTimeline
        .set(navItems, { autoAlpha: 0, y: 16, filter: "blur(10px)" })
        .to(navItems, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.75,
          stagger: 0.065,
        });

      revealGroups.forEach((section) => {
        const sectionId = section.getAttribute("id");
        if (!sectionId) {
          return;
        }

        const titleTargets = section.querySelectorAll<HTMLElement>(
          '[data-motion-reveal="title"]',
        );
        const liftTargets = section.querySelectorAll<HTMLElement>(
          '[data-motion-reveal="lift"]',
        );
        const cardTargets = section.querySelectorAll<HTMLElement>(
          '[data-motion-reveal="card"]',
        );
        const lineTargets = section.querySelectorAll<HTMLElement>(
          '[data-motion-reveal="line"]',
        );

        const sectionTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            end: "bottom 22%",
            toggleActions: "play reverse play reverse",
            invalidateOnRefresh: true,
          },
          defaults: { ease: "power3.out" },
        });

        const buildTargets = (
          elements: NodeListOf<HTMLElement>,
          fromVars: gsap.TweenVars,
          toVars: gsap.TweenVars,
          offset = 0,
        ) => {
          if (!elements.length) {
            return;
          }

          sectionTimeline.fromTo(
            elements,
            fromVars,
            {
              ...toVars,
              duration: 0.85,
              stagger: 0.08,
            },
            offset,
          );
        };

        buildTargets(
          titleTargets,
          {
            autoAlpha: 0,
            y: 28,
            clipPath: "inset(0 0 100% 0)",
          },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
          },
        );

        buildTargets(
          liftTargets,
          { autoAlpha: 0, y: 24, filter: "blur(8px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)" },
          0.08,
        );

        buildTargets(
          cardTargets,
          { autoAlpha: 0, y: 36, scale: 0.985, filter: "blur(10px)" },
          { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)" },
          0.12,
        );

        buildTargets(
          lineTargets,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0 },
          0.05,
        );

        ScrollTrigger.create({
          trigger: section,
          start: "top 42%",
          end: "bottom 42%",
          onEnter: () => setActiveSectionId(sectionId),
          onEnterBack: () => setActiveSectionId(sectionId),
          onLeaveBack: () => {
            const previousIndex = animationTargets.indexOf(
              sectionId as (typeof animationTargets)[number],
            );
            const previousId =
              previousIndex > 0 ? animationTargets[previousIndex - 1] : null;

            setActiveSectionId(previousId ?? null);
          },
        });
      });

      const heroSection = scope.querySelector<HTMLElement>('[data-landing-section="hero"]');
      if (heroSection) {
        const heroTimeline = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        const heroTargets = heroSection.querySelectorAll<HTMLElement>(
          "[data-hero-reveal]",
        );

        heroTimeline
          .set(heroTargets, { autoAlpha: 0, y: 26, filter: "blur(10px)" })
          .to(heroTargets, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.08,
          });
      }

      if (!prefersReducedMotion) {
        const hoverCards = Array.from(
          scope.querySelectorAll<HTMLElement>("[data-hover-card]"),
        );

        hoverCards.forEach((card) => {
          const layers = Array.from(
            card.querySelectorAll<HTMLElement>("[data-card-layer]"),
          );
          const cardEnter = () => {
            gsap.to(card, {
              y: -10,
              scale: 1.02,
              rotateX: 4,
              rotateY: -4,
              duration: 0.45,
              ease: "power3.out",
              transformPerspective: 1200,
              borderColor: "#BBBAA6",
              boxShadow: "0 18px 50px rgba(0,0,0,0.38)",
              overwrite: "auto",
            });

            layers.forEach((layer, index) => {
              gsap.to(layer, {
                y: -(index + 1) * 2,
                duration: 0.45,
                ease: "power3.out",
                overwrite: "auto",
              });
            });
          };

          const cardLeave = () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              rotateX: 0,
              rotateY: 0,
              duration: 0.35,
              ease: "power3.out",
              overwrite: "auto",
              borderColor: "#42433D",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            });

            layers.forEach((layer) => {
              gsap.to(layer, {
                y: 0,
                duration: 0.35,
                ease: "power3.out",
                overwrite: "auto",
              });
            });
          };

          card.addEventListener("mouseenter", cardEnter);
          card.addEventListener("mouseleave", cardLeave);
          card.addEventListener("focusin", cardEnter);
          card.addEventListener("focusout", cardLeave);

          hoverCardCleanups.push(() => {
            card.removeEventListener("mouseenter", cardEnter);
            card.removeEventListener("mouseleave", cardLeave);
            card.removeEventListener("focusin", cardEnter);
            card.removeEventListener("focusout", cardLeave);
          });
        });
      }
    }, scope);

    return () => {
      ctx.revert();
      hoverCardCleanups.forEach((cleanup) => cleanup());
      delete (window as typeof window & {
        __landingScrollTo?: (hash: string) => void;
      }).__landingScrollTo;
    };
  }, [animationTargets]);

  return (
    <main
      data-landing-shell
      className="min-h-screen overflow-hidden bg-[#0E100F] [font-family:Mori,var(--font-geist-sans),-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-[#FFFCE1]"
    >
      <LandingNav
        activeId={activeSectionId}
        reducedMotion={reducedMotion}
        onNavigate={(hash) => {
          const scrollToHash = (window as typeof window & {
            __landingScrollTo?: (hash: string) => void;
          }).__landingScrollTo;

          if (scrollToHash) {
            scrollToHash(hash);
            setActiveSectionId(hash.replace("#", ""));
            return;
          }

          const target = document.querySelector<HTMLElement>(hash);

          if (!target) {
            return;
          }

          const targetTop =
            window.scrollY + target.getBoundingClientRect().top - NAV_OFFSET;

          window.scrollTo({
            top: targetTop,
            behavior: reducedMotion ? "auto" : "smooth",
          });
          window.history.pushState(null, "", hash);
        }}
      />
      {children}
    </main>
  );
}

function useReducedMotion() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      mediaQuery.addEventListener("change", onStoreChange);
      return () => mediaQuery.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
