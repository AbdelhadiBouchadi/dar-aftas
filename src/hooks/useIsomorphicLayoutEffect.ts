import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 *
 * GSAP setup must run before paint to avoid a flash of un-animated content,
 * but React warns when `useLayoutEffect` runs during SSR. This picks the
 * right one without the warning.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
