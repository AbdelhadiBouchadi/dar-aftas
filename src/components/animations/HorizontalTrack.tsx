"use client";

import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export interface HorizontalTrackProps {
  readonly children: ReactNode;
  readonly className?: string;
  /** Accessible name for the scrollable region. */
  readonly label: string;
}

/**
 * Pins a section and converts vertical scroll into horizontal travel.
 *
 * Deliberately desktop-only. On touch devices this becomes a plain
 * snap-scrolling row, because hijacking vertical scroll on a phone fights the
 * OS gesture model and is the fastest way to make an expensive site feel
 * broken. Same content, native mechanics.
 *
 * The region is keyboard-scrollable and labelled, so it is reachable without
 * a pointer in both modes.
 */
export function HorizontalTrack({
  children,
  className,
  label,
}: HorizontalTrackProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Recomputed on every refresh so it survives resize and font load.
          const getDistance = (): number =>
            Math.max(0, track.scrollWidth - window.innerWidth);

          const tween = gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: () => `+=${getDistance()}`,
              pin: true,
              // Slight scrub lag smooths the coupling with Lenis' easing.
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // Fonts change measured width; re-measure once they land.
          void document.fonts?.ready.then(() => ScrollTrigger.refresh());

          return () => {
            tween.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={cn("lg:overflow-hidden", className)}>
      <div
        ref={trackRef}
        role="region"
        data-cursor="drag"
        aria-label={label}
        tabIndex={0}
        className={cn(
          "flex gap-6 sm:gap-10",
          // Touch / reduced-motion path: native horizontal scroll with snap.
          "snap-x snap-mandatory overflow-x-auto pb-4",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // Pinned path: GSAP owns the transform, so no native scrolling.
          "lg:overflow-x-visible lg:pb-0 lg:motion-safe:snap-none",
        )}
      >
        {children}
      </div>
    </div>
  );
}
