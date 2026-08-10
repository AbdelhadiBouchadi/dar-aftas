"use client";

import { useRef, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

export interface RevealTextProps {
  readonly children: ReactNode;
  /** Element to render. Headings should pass their real level for a11y. */
  readonly as?: ElementType;
  readonly className?: string;
  /** Delay before the first line, in seconds. */
  readonly delay?: number;
  /** Gap between consecutive lines. 30–50ms is the readable band. */
  readonly stagger?: number;
  /** Play on scroll (default) or immediately on mount. */
  readonly trigger?: "scroll" | "mount";
}

/**
 * Line-by-line mask reveal: each line rises out from behind a clipping edge.
 *
 * Uses GSAP SplitText so lines are recalculated on resize — a hand-rolled
 * split breaks the moment the text rewraps at a different width.
 *
 * Robustness: the pre-animation hidden state is applied by CSS scoped to
 * `html.js`, a class set by a blocking inline script in the document head.
 * With JavaScript disabled or broken, the class never lands and every word
 * stays visible. Under reduced motion the text is shown with no split.
 */
export function RevealText({
  children,
  as: Tag = "p",
  className,
  delay = 0,
  stagger = 0.045,
  trigger = "scroll",
}: RevealTextProps): React.JSX.Element {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = new SplitText(el, {
          type: "lines",
          linesClass: "reveal-line",
          // Wraps each line so overflow clips it without affecting layout.
          mask: "lines",
        });

        // Inline style beats the `html.js [data-reveal]` rule.
        gsap.set(el, { visibility: "visible" });

        const tween = gsap.from(split.lines, {
          yPercent: 115,
          duration: 1.1,
          ease: "expo.out",
          stagger,
          delay: trigger === "mount" ? delay : 0,
          ...(trigger === "scroll"
            ? {
                scrollTrigger: {
                  trigger: el,
                  start: "top 85%",
                  once: true,
                },
              }
            : {}),
        });

        return () => {
          tween.kill();
          split.revert();
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
    <Tag ref={ref} data-reveal="" className={cn(className)}>
      {children}
    </Tag>
  );
}
