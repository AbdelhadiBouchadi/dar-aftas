"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export interface SmoothScrollContextValue {
  /** Scroll to a selector or offset. Falls back to native when Lenis is off. */
  readonly scrollTo: (target: string | number, offset?: number) => void;
  /** True once Lenis is running — false under reduced motion. */
  readonly isSmooth: boolean;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

export interface SmoothScrollProps {
  readonly children: ReactNode;
}

/**
 * Drives the page with a single Lenis instance, wired into GSAP's ticker.
 *
 * The important detail: Lenis is *not* given its own requestAnimationFrame
 * loop. GSAP's ticker calls `lenis.raf`, so scroll position and every
 * ScrollTrigger read happen in the same frame. Two independent rAF loops is
 * the usual cause of "jittery" GSAP + smooth-scroll integrations.
 *
 * Under `prefers-reduced-motion` Lenis is never constructed at all — the page
 * keeps native scrolling, which is the correct accessible behaviour.
 */
export function SmoothScroll({ children }: SmoothScrollProps): React.JSX.Element {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isSmooth, setIsSmooth] = useState<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) {
      setIsSmooth(false);
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      // Long, decelerating tail. Reads as weight — the "expensive" feel.
      easing: (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      // Never hijack touch. Native momentum is better than any JS emulation
      // and fighting it breaks the OS back-swipe gesture.
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;

    // Every Lenis scroll frame updates ScrollTrigger in the same tick.
    const onScroll = (): void => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", onScroll);

    const tick = (time: number): void => {
      // GSAP ticker reports seconds; Lenis wants milliseconds.
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    // Lag smoothing would let GSAP skip time after a slow frame, which
    // desynchronises it from Lenis' own interpolation.
    gsap.ticker.lagSmoothing(0);

    setIsSmooth(true);
    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
      setIsSmooth(false);
    };
  }, [prefersReducedMotion]);

  const scrollTo = useCallback((target: string | number, offset = 0): void => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { offset, duration: 1.4 });
      return;
    }

    // Reduced motion, or Lenis not yet mounted: jump natively.
    if (typeof target === "number") {
      window.scrollTo({ top: target + offset, behavior: "auto" });
      return;
    }
    const el = document.querySelector(target);
    if (el instanceof HTMLElement) {
      window.scrollTo({ top: el.offsetTop + offset, behavior: "auto" });
    }
  }, []);

  const value = useMemo<SmoothScrollContextValue>(
    () => ({ scrollTo, isSmooth }),
    [scrollTo, isSmooth],
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

/** Access the page's Lenis controls. Safe to call outside the provider. */
export function useSmoothScroll(): SmoothScrollContextValue {
  const ctx = useContext(SmoothScrollContext);
  return (
    ctx ?? {
      scrollTo: (): void => undefined,
      isSmooth: false,
    }
  );
}
