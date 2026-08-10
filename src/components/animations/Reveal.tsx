"use client";

import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { gsap, useGSAP } from "@/lib/gsap";

export type RevealDirection = "up" | "down" | "none";

export interface RevealProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
  readonly direction?: RevealDirection;
  /** Stagger direct children instead of animating the wrapper as one block. */
  readonly staggerChildren?: boolean;
  readonly stagger?: number;
  /** Viewport position that fires the reveal. */
  readonly start?: string;
}

/**
 * Fade-and-rise on scroll for non-text blocks (cards, rules, media).
 *
 * Animates transform and opacity only — never width/height/top — so the
 * compositor handles it and no layout reflow is triggered.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  staggerChildren = false,
  stagger = 0.08,
  start = "top 85%",
}: RevealProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets: Element[] = staggerChildren
          ? Array.from(el.children)
          : [el];

        gsap.set(el, { visibility: "visible" });

        const offset = direction === "none" ? 0 : direction === "up" ? 28 : -28;

        const tween = gsap.from(targets, {
          y: offset,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          delay,
          stagger: staggerChildren ? stagger : 0,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        });

        return () => {
          tween.kill();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { visibility: "visible" });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-reveal-fade="" className={cn(className)}>
      {children}
    </div>
  );
}
