import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

/**
 * Single registration point for GSAP plugins.
 *
 * `registerPlugin` is idempotent, but centralising it means a component can
 * never forget to register and fail silently in production only.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

  // Mobile browsers fire resize when the URL bar shows/hides. Without this,
  // every scroll direction change re-runs ScrollTrigger layout maths.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Shared easing — one motion rhythm across the whole site. */
export const EASE = {
  out: "expo.out",
  inOut: "expo.inOut",
  soft: "power3.out",
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
