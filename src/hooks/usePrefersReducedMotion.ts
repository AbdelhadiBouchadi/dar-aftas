"use client";

import { useCallback, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/**
 * Tracks the OS reduced-motion setting, and keeps tracking it — users can
 * toggle it mid-session and the site must respond without a reload.
 *
 * Returns `false` during SSR so the server markup matches the common case;
 * the first client render corrects it before any timeline is built.
 */
export function usePrefersReducedMotion(): boolean {
  const getServerSnapshot = useCallback((): boolean => false, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
