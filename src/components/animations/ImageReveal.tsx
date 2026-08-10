"use client";

import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { gsap, useGSAP } from "@/lib/gsap";

export interface ImageRevealProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
}

/**
 * Wipes a photograph into view from the bottom edge, while the image itself
 * settles back from a slight overscale.
 *
 * A clip-path wipe rather than a fade, deliberately: the type on this site
 * already arrives from behind a mask edge, so photography using the same
 * gesture makes the page feel authored rather than assembled from effects.
 *
 * The pre-animation clipped state is set in CSS under `html.js`, so it never
 * flashes and never traps the image when JavaScript is unavailable.
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
}: ImageRevealProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const inner = el.querySelector<HTMLElement>("[data-clip-inner]");

        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });

        tl.fromTo(
          el,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.35, delay },
          0,
        );

        if (inner) {
          // Slower than the wipe, so the frame keeps moving after it lands.
          tl.from(inner, { scale: 1.12, duration: 1.9, delay }, 0);
        }

        return () => {
          tl.kill();
          gsap.set(el, { clipPath: "none" });
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { clipPath: "none" });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-clip-reveal="" className={cn("relative", className)}>
      <div data-clip-inner className="h-full w-full">
        {children}
      </div>
    </div>
  );
}
