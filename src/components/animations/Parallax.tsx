"use client";

import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { gsap, useGSAP } from "@/lib/gsap";

export interface ParallaxProps {
  readonly children: ReactNode;
  readonly className?: string;
  /**
   * Drift distance as a percentage of the element's own height, across the
   * full scroll pass. Keep it small — 8–18% reads as depth, 40% reads as a
   * broken sticky element and can cause motion discomfort.
   */
  readonly amount?: number;
  /** Scale the inner content so the drift never exposes an edge. */
  readonly overscan?: boolean;
}

/**
 * Subtle scroll-linked parallax for media.
 *
 * `scrub: true` ties progress directly to scroll position, which — because
 * Lenis and GSAP share one ticker — stays locked to the smoothed scroll
 * rather than lagging a frame behind it.
 *
 * Disabled entirely under reduced motion: parallax is the single most common
 * trigger for vestibular discomfort.
 */
export function Parallax({
  children,
  className,
  amount = 12,
  overscan = true,
}: ParallaxProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const inner = innerRef.current;
      if (!el || !inner) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          inner,
          { yPercent: -amount / 2 },
          {
            yPercent: amount / 2,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

        return () => {
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <div
        ref={innerRef}
        className={cn("h-full w-full", overscan && "scale-[1.15]")}
      >
        {children}
      </div>
    </div>
  );
}
