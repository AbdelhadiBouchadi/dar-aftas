"use client";

import { useRef, type ReactNode } from "react";

import { gsap, SplitText, useGSAP } from "@/lib/gsap";

export interface HeroChoreographyProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * The page-load sequence.
 *
 * One orchestrated timeline rather than several independent entrance
 * animations — a single arrival reads as intent, scattered fades read as
 * decoration. Order is deliberate: the ground settles, the name arrives
 * letter by letter, then the supporting copy, then the instrument data last.
 *
 * Elements are addressed by `data-hero-*` attributes so the markup stays a
 * plain Server Component and only the motion lives on the client.
 */
export function HeroChoreography({
  children,
  className,
}: HeroChoreographyProps): React.JSX.Element {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const mark = root.querySelector<HTMLElement>("[data-hero-mark]");
        const eyebrow = root.querySelector<HTMLElement>("[data-hero-eyebrow]");
        const sub = root.querySelector<HTMLElement>("[data-hero-sub]");
        const cue = root.querySelector<HTMLElement>("[data-hero-cue]");
        const image = document.querySelector<HTMLElement>("[data-hero-image]");
        const readings = gsap.utils.toArray<HTMLElement>("[data-hero-reading]");

        const split = mark
          ? new SplitText(mark, { type: "chars", mask: "chars" })
          : null;

        gsap.set([eyebrow, sub, cue].filter(Boolean), { visibility: "visible" });
        if (mark) gsap.set(mark, { visibility: "visible" });
        if (readings.length > 0) gsap.set(readings, { visibility: "visible" });

        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          // Let the first frame paint before moving anything.
          delay: 0.15,
        });

        if (image) {
          // The ground settles: a slow release of scale, never a fade-in.
          tl.from(image, { scale: 1.14, duration: 2.2, ease: "expo.out" }, 0);
        }

        if (eyebrow) {
          tl.from(eyebrow, { autoAlpha: 0, y: 14, duration: 1 }, 0.35);
        }

        if (split) {
          tl.from(
            split.chars,
            { yPercent: 110, duration: 1.4, stagger: 0.055 },
            0.5,
          );
        }

        if (sub) {
          tl.from(sub, { autoAlpha: 0, y: 18, duration: 1.1 }, 1.05);
        }

        if (readings.length > 0) {
          tl.from(
            readings,
            { autoAlpha: 0, y: 10, duration: 0.8, stagger: 0.05 },
            1.2,
          );
        }

        if (cue) {
          tl.from(cue, { autoAlpha: 0, duration: 0.8 }, 1.5);
        }

        /**
         * Safety net for the almanac.
         *
         * Readings are hidden by a CSS gate until this timeline un-hides them,
         * and they are collected once, above. If a reading ever arrives after
         * mount — a streamed/uncached almanac, a client-side refresh — it would
         * never be collected and would stay invisible forever. This sweeps any
         * stragglers into view once the entrance has finished.
         */
        const sweep = gsap.delayedCall(2.5, () => {
          const stragglers = document.querySelectorAll<HTMLElement>(
            "[data-hero-reading]",
          );
          if (stragglers.length > 0) {
            gsap.set(stragglers, { visibility: "visible" });
          }
        });

        return () => {
          tl.kill();
          sweep.kill();
          split?.revert();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // No entrance. Everything is simply already here.
        gsap.set(root.querySelectorAll("[data-hero-mark], [data-hero-eyebrow], [data-hero-sub], [data-hero-cue]"), {
          visibility: "visible",
        });
        gsap.set(document.querySelectorAll("[data-hero-reading]"), {
          visibility: "visible",
        });
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
