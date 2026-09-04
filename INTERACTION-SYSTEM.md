# Interaction System

A complete, portable record of every animation and interaction pattern implemented
in this project. It is written to be read cold by someone with no memory of this
codebase who wants to lift the motion layer into an unrelated project.

Everything below is **real code copied from source**, including the reasoning
comments that were written alongside it. Where a claim is about behaviour rather
than code, it is derived from the code shown directly above it.

Source of truth, file by file:

| Concern | File |
|---|---|
| Plugin registration, shared easing | `src/lib/gsap.ts` |
| Lenis ↔ GSAP ticker | `src/components/animations/SmoothScroll.tsx` |
| Hero page-load timeline | `src/components/animations/HeroChoreography.tsx` |
| Header condense / hide / reveal | `src/components/layout/SiteHeader.tsx` |
| Custom cursor | `src/components/animations/Cursor.tsx` |
| Line-mask text reveal | `src/components/animations/RevealText.tsx` |
| Block fade-and-rise reveal | `src/components/animations/Reveal.tsx` |
| Clip-path image wipe + overscale | `src/components/animations/ImageReveal.tsx` |
| Scroll-linked parallax | `src/components/animations/Parallax.tsx` |
| Pinned horizontal track | `src/components/animations/HorizontalTrack.tsx` |
| Magnetic pointer attraction | `src/components/animations/Magnetic.tsx` |
| Ground-aware scroll indicator | `src/components/ui/ScrollProgress.tsx` |
| Reduced-motion source of truth | `src/hooks/usePrefersReducedMotion.ts` |
| Pre-paint effect | `src/hooks/useIsomorphicLayoutEffect.ts` |
| No-JS / pre-animation gate | `src/app/globals.css` |
| Mount order, `html.js` script | `src/app/layout.tsx` |
| Production infra | `src/app/opengraph-image.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts` |

---

## 0. Preconditions for a port

### 0.1 Dependencies

From `package.json`:

```json
{
  "dependencies": {
    "@gsap/react": "^2.1.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "gsap": "^3.15.0",
    "lenis": "^1.3.26",
    "lucide-react": "^1.30.0",
    "next": "16.3.0",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "tailwind-merge": "^3.6.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.4.0",
    "typescript": "^5"
  }
}
```

Notes that matter when porting:

- **`gsap` 3.15 includes `SplitText` and `ScrollTrigger` in the free package.** Both
  are imported from `gsap/SplitText` and `gsap/ScrollTrigger`. Older GSAP versions
  put SplitText behind Club GreenSock; a port to `gsap@<3.13` will fail to resolve it.
- **`lenis`, not `@studio-freight/lenis`.** The Studio Freight package is deprecated
  and frozen at 1.0.42; the library moved to the bare `lenis` name.
- **Tailwind v4.1+** is required for the built-in `pointer-fine` variant used by
  `Cursor.tsx` (`motion-safe:pointer-fine:block`) and for `motion-safe:` / `motion-reduce:`.
  There is no `@custom-variant` declaration anywhere in this project — these are stock.
- `tw-animate-css` supplies `animate-in fade-in` used by the mobile menu.

### 0.2 The `cn` helper

Every component below imports it. `src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with correct conflict resolution.
 * This is the exact `cn` contract that shadcn/ui and 21st.dev registry
 * components import from `@/lib/utils` — do not rename or change the shape.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Zero-pad a number to a fixed width, for almanac/tide typography. */
export function pad(value: number, width = 2): string {
  return String(value).padStart(width, "0");
}
```

### 0.3 Single GSAP registration point

`src/lib/gsap.ts` — **every** animation file imports GSAP from here, never from `gsap`
directly. Port this file first.

```ts
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
```

### 0.4 The two hooks

`src/hooks/useIsomorphicLayoutEffect.ts`:

```ts
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
```

`src/hooks/usePrefersReducedMotion.ts` — note this is a **live subscription**, not a
one-shot read, so toggling the OS setting mid-session tears down Lenis without a reload:

```ts
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
```

### 0.5 The `html.js` progressive-enhancement gate

This is load-bearing for **every** reveal in section 4. Elements are hidden
pre-animation by CSS, but only under `html.js`, which is set by a blocking inline
script in `<head>` — so it lands before first paint (no flash of visible-then-hidden
content), and if JavaScript never runs, the class never appears and everything
renders in its final visible state.

From `src/app/layout.tsx`:

```tsx
/**
 * Sets `html.js` before first paint so reveal targets can be hidden without a
 * flash — and, critically, stay visible when JavaScript is unavailable.
 */
const JS_ENABLED_SCRIPT = `document.documentElement.classList.add('js')`;
```

```tsx
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_ENABLED_SCRIPT }} />
```

The matching CSS, from the bottom of `src/app/globals.css`:

```css
/* --------------------------------------------------------------------------
   Progressive enhancement gate.

   `html.js` is set by a blocking inline script in <head>, so it lands before
   first paint (no flash of visible-then-hidden text). If JavaScript is
   disabled or fails to load, the class never appears and every animated
   element renders in its final, fully readable state.
   -------------------------------------------------------------------------- */
/* Photography wipes in from its bottom edge; clipped until GSAP takes over. */
html.js [data-clip-reveal] {
  clip-path: inset(0% 0% 100% 0%);
}

@media (prefers-reduced-motion: reduce) {
  html.js [data-clip-reveal] {
    clip-path: none;
  }
}

html.js [data-reveal],
html.js [data-reveal-fade],
html.js [data-hero-eyebrow],
html.js [data-hero-mark],
html.js [data-hero-sub],
html.js [data-hero-cue],
html.js [data-hero-reading] {
  visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
  html.js [data-reveal],
  html.js [data-reveal-fade],
  html.js [data-hero-eyebrow],
  html.js [data-hero-mark],
  html.js [data-hero-sub],
  html.js [data-hero-cue],
  html.js [data-hero-reading] {
    visibility: visible;
  }
}

/* Respect the OS setting globally as a safety net. GSAP is additionally
   gated via gsap.matchMedia() so timelines are never even built. */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Also required from `@layer base` in the same file — native smooth scrolling must be
off or it fights Lenis:

```css
  html {
    /* Lenis drives scrolling; native smooth would fight it. */
    scroll-behavior: auto;
    -webkit-text-size-adjust: 100%;
  }
```

And two utilities the reveals depend on:

```css
  /* Clip wrapper for GSAP mask reveals. */
  .mask-reveal {
    display: block;
    overflow: hidden;
    clip-path: inset(0 0 -0.25em 0);
  }

  /* SplitText's mask wrapper must clip, or lines are visible above the edge. */
  .reveal-line {
    will-change: transform;
  }
```

### 0.6 Reduced motion is gated at three levels

1. `gsap.matchMedia()` in every component — the timeline is **never constructed**.
2. Lenis is never instantiated; native scrolling is kept.
3. The CSS media-query safety net above.

Every animation component in this project follows the same shape:

```ts
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)", () => { /* build */ return () => {/* teardown */}; });
mm.add("(prefers-reduced-motion: reduce)", () => { /* just make it visible */ });
return () => mm.revert();
```

Copy that shape; do not replace it with a `if (prefersReducedMotion) return` check.
`matchMedia` re-runs the setup function when the query flips, so a mid-session toggle
is handled for free.

### 0.7 Mount order

`src/app/layout.tsx`, `<body>` — the order and nesting matter: everything motion-related
lives inside `<SmoothScroll>`, and `Cursor` / `ScrollProgress` mount last, after the
content they observe.

```tsx
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {/* Keyboard users must be able to bypass the header. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-100 focus:bg-basalt focus:px-5 focus:py-3 focus:text-sand label-mono"
        >
          Skip to content
        </a>

        <SmoothScroll>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          {/* Both self-disable on coarse pointers and under reduced motion. */}
          <Cursor />
          <ScrollProgress />
        </SmoothScroll>
      </body>
```

### 0.8 The z-index stack

Fixed layers, as actually authored. Reproduce these relative orderings or the header
transition in section 3 will collide with hero content:

| Layer | Class | Value |
|---|---|---|
| Skip link (focused) | `focus:z-100` | 100 |
| Custom cursor | `z-90` | 90 |
| Mobile menu overlay | `z-[60]` | 60 |
| Site header | `z-50` | 50 |
| Scroll progress indicator | `z-40` | 40 |
| Hero copy + scroll cue | `z-10` | 10 |
| Hero photo grade overlays | `z-2` / `z-3` (in `.photo-film::before/::after`) | 2, 3 |

---

## 1. Lenis + GSAP integration — the single rAF loop

This is the fix the README refers to. Two independent `requestAnimationFrame` loops
is the usual cause of "jittery" GSAP + smooth-scroll integrations: Lenis interpolates
scroll on its own loop, ScrollTrigger reads scroll position on GSAP's, and the two
sample at different points in the frame.

The fix is that **Lenis is never given its own rAF loop at all**. GSAP's ticker calls
`lenis.raf`, and every Lenis scroll event calls `ScrollTrigger.update()`.

`src/components/animations/SmoothScroll.tsx`, in full:

```tsx
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
```

The five details to preserve verbatim when porting:

1. **`gsap.ticker.add(tick)` with `lenis.raf(time * 1000)`** — GSAP's ticker reports
   seconds, Lenis expects milliseconds. Getting this wrong produces a scroll that
   advances ~1000× too slowly and looks frozen.
2. **`gsap.ticker.lagSmoothing(0)`** — mandatory. Without it, GSAP skips forward in
   time after a slow frame while Lenis keeps interpolating at its own rate, and the
   two desynchronise visibly on pinned sections.
3. **`lenis.on("scroll", () => ScrollTrigger.update())`** — makes ScrollTrigger read
   the *smoothed* position rather than the raw native one.
4. **Teardown restores `lagSmoothing(500, 33)`** — GSAP's default. Leaving it at 0
   after unmount degrades any other GSAP work on the page.
5. **`useIsomorphicLayoutEffect`, not `useEffect`** — the Lenis instance must exist
   before paint.

`useSmoothScroll()` returns a no-op fallback outside the provider, so consumers never
need a null check.

---

## 2. Hero entrance choreography

### 2.1 The markup contract

The hero itself stays a Server Component. Only the choreography wrapper crosses to
the client, and it finds its targets by `data-hero-*` attributes. This is the whole
porting contract — put these attributes on whatever your hero's equivalent elements are.

| Attribute | Element | Queried from |
|---|---|---|
| `data-hero-image` | full-bleed background frame | **`document`** (it is outside the wrapper) |
| `data-hero-eyebrow` | small mono line above the wordmark | wrapper scope |
| `data-hero-mark` | the `<h1>` wordmark | wrapper scope |
| `data-hero-sub` | supporting paragraph | wrapper scope |
| `data-hero-cue` | rotated "Scroll" cue | wrapper scope |
| `data-hero-reading` | each instrument-data item in the band | **`document`** (rendered by a sibling component) |

From `src/components/sections/Hero.tsx` (abridged to the animated nodes; the scrims
and picture are kept because the `data-hero-image` wrapper is one of them):

```tsx
    <section id="top" className="relative">
      <div className="relative min-h-dvh overflow-hidden">
        {/* Full-bleed ground. Art-directed per breakpoint; see HeroPicture. */}
        <div data-hero-image className="photo-film absolute inset-0">
          <HeroPicture />
        </div>

        {/* ...two scrim layers, absolute inset-0... */}

        <HeroChoreography className="relative z-10 flex min-h-dvh flex-col justify-end">
          <div className="gutter pb-14 sm:pb-20">
            <p data-hero-eyebrow className="label-mono mb-8 w-fit text-sand/75">
              {SITE.tagline}
            </p>

            <h1
              data-hero-mark
              className="w-fit font-display text-[clamp(4.5rem,20vw,17rem)] leading-[0.78] tracking-[-0.045em] text-sand"
            >
              {SITE.wordmark}
            </h1>

            <p
              data-hero-sub
              className="mt-8 max-w-lg text-pretty text-base leading-relaxed text-sand/85 sm:text-lg"
            >
              {HERO.subtitle}
            </p>
          </div>

          <AlmanacBand readings={readings} />
        </HeroChoreography>

        <span
          data-hero-cue
          aria-hidden="true"
          className="absolute bottom-32 right-gutter z-10 hidden origin-bottom-right rotate-90 label-mono text-sand/50 lg:block"
        >
          Scroll
        </span>
      </div>
    </section>
```

Each reading in the band carries the hook (`src/components/sections/AlmanacBand.tsx`):

```tsx
          {readings.map((reading) => (
            <li
              key={reading.label}
              data-hero-reading
              className="shrink-0 snap-start"
            >
```

### 2.2 The timeline

`src/components/animations/HeroChoreography.tsx`, in full:

```tsx
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
```

### 2.3 The exact schedule

Timeline defaults: `ease: "expo.out"`, `delay: 0.15` (one frame of paint before
anything moves). All positions below are **absolute timeline positions** — every
`.from()` passes an explicit position parameter, so nothing is sequential-by-default
and the overlaps are intentional.

| At | Target | From-state | Duration | Ease | Stagger |
|---|---|---|---|---|---|
| `0` | `[data-hero-image]` | `scale: 1.14` | 2.2 | `expo.out` | — |
| `0.35` | `[data-hero-eyebrow]` | `autoAlpha: 0, y: 14` | 1 | (default) | — |
| `0.5` | `[data-hero-mark]` split chars | `yPercent: 110` | 1.4 | (default) | 0.055 |
| `1.05` | `[data-hero-sub]` | `autoAlpha: 0, y: 18` | 1.1 | (default) | — |
| `1.2` | `[data-hero-reading]` (all) | `autoAlpha: 0, y: 10` | 0.8 | (default) | 0.05 |
| `1.5` | `[data-hero-cue]` | `autoAlpha: 0` | 0.8 | (default) | — |
| `2.5` | `gsap.delayedCall` straggler sweep | — | — | — | — |

Total wall-clock: the image tween ends at `0.15 + 0 + 2.2 = 2.35s`; the straggler
sweep fires at `0.15 + 2.5 = 2.65s`.

Design decisions embedded in those numbers:

- **The image scales down, it never fades.** A fade-in on the LCP element would both
  look cheap and hurt the LCP measurement. `scale: 1.14 → 1` over 2.2s runs longer
  than everything else so the frame is still settling while the type lands on it.
- **`mask: "chars"`** on SplitText wraps each character in a clipping element, so
  `yPercent: 110` slides the glyph up from *behind an edge* rather than translating
  a visible glyph. This is why 110 rather than 100 — the extra 10% covers descenders.
- **`0.055` char stagger against a `1.4s` duration.** The overlap is deliberate: with
  a wordmark of ~8 characters the last one starts at `0.5 + 7×0.055 = 0.885` while the
  first is still animating until `1.9`. The word arrives as one gesture, not a ticker.
- **Readings last, at `0.05`** — the tightest stagger on the page, because eight items
  at 0.055 each would read as a slow list rather than a band of instrument data.

### 2.4 Reduced-motion gating

Three things happen under `(prefers-reduced-motion: reduce)`:

1. The `no-preference` branch never runs, so **`SplitText` is never constructed** —
   the DOM is not rewritten at all, which matters for screen readers and for text
   selection.
2. The `reduce` branch runs `gsap.set(..., { visibility: "visible" })` on all five
   hooks, defeating the `html.js` CSS gate.
3. The global CSS media query (section 0.5) already sets `visibility: visible` on the
   same selectors, so even if GSAP fails to initialise, the hero is readable.

Note the asymmetry in how targets are collected in the `reduce` branch: hero copy is
found via `root.querySelectorAll` but readings via `document.querySelectorAll`, because
the almanac band's items are rendered by a sibling component and `[data-hero-image]`
lives outside the wrapper entirely.

---

## 3. Header scroll behaviour

`src/components/layout/SiteHeader.tsx`. Three separate mechanisms cooperate:
a GSAP hide/reveal on the header element, a React state flag for the ground swap,
and a body-scroll lock for the mobile menu.

### 3.1 The full component

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Magnetic } from "@/components/animations/Magnetic";
import { useSmoothScroll } from "@/components/animations/SmoothScroll";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { NAV_ITEMS, SITE } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Fixed header that recedes on scroll-down and returns on scroll-up.
 *
 * Client component because it owns Lenis-driven anchor scrolling, a
 * ScrollTrigger, and the mobile menu's open state. It is deliberately the
 * only client boundary in the page chrome.
 */
export function SiteHeader(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  /**
   * True once the header has left the hero. Drives an opaque backdrop.
   *
   * The header used to rely on `mix-blend-difference` to stay legible over
   * anything. That works over very dark or very light grounds and fails
   * exactly in the middle — real photography put a pale grey sky behind the
   * nav and it became grey-on-grey. Two explicit states are predictable:
   * a gradient scrim over the hero, an opaque bar everywhere else.
   */
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { scrollTo } = useSmoothScroll();
  const router = useRouter();

  useGSAP(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    if (!header) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const show = gsap.to(header, {
        yPercent: 0,
        duration: 0.45,
        ease: "power3.out",
        paused: true,
      });

      const trigger = ScrollTrigger.create({
        start: "top -120",
        end: "max",
        onUpdate: (self) => {
          if (self.direction === 1 && self.scroll() > 200) {
            gsap.to(header, { yPercent: -100, duration: 0.4, ease: "power3.in" });
          } else {
            show.restart();
          }
          // Only re-render on an actual state change, not every frame.
          setIsScrolled((prev) => {
            const next = self.scroll() > window.innerHeight * 0.85;
            return prev === next ? prev : next;
          });
        },
      });

      return () => {
        trigger.kill();
        show.kill();
        gsap.set(header, { yPercent: 0 });
      };
    });

    return () => mm.revert();
  });

  // Lock the page while the mobile menu is open, and restore on close.
  useIsomorphicLayoutEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const handleNavigate = (href: string): void => {
    setIsOpen(false);

    // The header also renders on routes that have no sections — /404, for
    // one. Scrolling to a selector that isn't in the document would silently
    // do nothing, so fall back to a real navigation home with the hash.
    if (href.startsWith("#") && !document.querySelector(href)) {
      router.push(`/${href}`);
      return;
    }

    scrollTo(href, -80);
  };

  return (
    <>
      <header
        data-site-header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          isScrolled && "border-b border-sand/10 bg-basalt/90 backdrop-blur-md",
        )}
      >
        {/* Scrim over the hero only. Guarantees the nav reads against any
            photograph without darkening the bar once it goes opaque. */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-b from-basalt/80 via-basalt/40 to-transparent transition-opacity duration-300",
            isScrolled && "opacity-0",
          )}
        />

        <div className="gutter relative flex h-20 items-center justify-between sm:h-24">
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              handleNavigate("body");
            }}
            className="font-display text-lg tracking-[0.28em] text-sand"
            aria-label={`${SITE.name} — back to top`}
          >
            {SITE.wordmark}
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavigate(item.href);
                    }}
                    className="label-mono text-sand/80 transition-colors duration-200 hover:text-ochre-light"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <Magnetic className="hidden lg:inline-block" strength={10}>
            <a
              href="#enquire"
              onClick={(event) => {
                event.preventDefault();
                handleNavigate("#enquire");
              }}
              className="label-mono inline-block border border-sand/45 px-5 py-3 text-sand transition-colors duration-200 hover:border-sand hover:bg-sand hover:text-basalt"
            >
              Enquire
            </a>
          </Magnetic>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="-mr-2 flex size-11 items-center justify-center text-sand lg:hidden"
            aria-label="Open menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="size-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile menu. Full-bleed basalt so contrast is unambiguous. */}
      <div
        id="mobile-menu"
        hidden={!isOpen}
        className={cn(
          "fixed inset-0 z-[60] bg-basalt lg:hidden",
          isOpen && "animate-in fade-in duration-300",
        )}
      >
        <div className="gutter flex h-20 items-center justify-between sm:h-24">
          <span className="font-display text-lg tracking-[0.28em] text-sand">
            {SITE.wordmark}
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="-mr-2 flex size-11 items-center justify-center text-sand"
            aria-label="Close menu"
          >
            <X className="size-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile" className="gutter mt-10">
          <ul className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(event) => {
                    event.preventDefault();
                    handleNavigate(item.href);
                  }}
                  className="block py-3 font-display text-[clamp(2rem,9vw,3.25rem)] leading-none text-sand"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#enquire"
            onClick={(event) => {
              event.preventDefault();
              handleNavigate("#enquire");
            }}
            className="label-mono mt-12 inline-block border border-sand/40 px-7 py-4 text-sand"
          >
            Enquire
          </a>
        </nav>
      </div>
    </>
  );
}
```

### 3.2 Exact ScrollTrigger config

```ts
ScrollTrigger.create({
  start: "top -120",
  end: "max",
  onUpdate: (self) => { /* ... */ },
});
```

- **No `trigger` is passed.** ScrollTrigger therefore defaults to the viewport/scroller
  itself, which is what you want for a global scroll observer — this trigger is not
  attached to the header element and does not measure it.
- **`start: "top -120"`** — the trigger becomes active only once the page has scrolled
  past 120px. Above that, `onUpdate` does not fire, so the header cannot hide during
  the hero entrance (which runs for the first ~2.35s at scroll 0).
- **`end: "max"`** — stays active to the bottom of the document.
- **`self.direction === 1`** is scroll-down; `-1` is up.
- **`self.scroll() > 200`** is a second, independent floor. Together with `start: "top -120"`
  it means: the header can only recede once you are 200px down *and* moving down.
- **`show` is a pre-created paused tween**, restarted on every scroll-up frame rather
  than a fresh `gsap.to()` per frame. `restart()` on an already-playing tween is cheap;
  allocating a tween per rAF frame is not.

Timings:

| Motion | Property | Duration | Ease |
|---|---|---|---|
| Hide (scroll down past 200) | `yPercent: -100` | 0.4 | `power3.in` |
| Reveal (any scroll up) | `yPercent: 0` | 0.45 | `power3.out` |

`power3.in` on the way out and `power3.out` on the way in: the header accelerates as it
leaves (it is getting out of the way) and decelerates as it returns (it is arriving).

Teardown resets `yPercent: 0` so a reduced-motion toggle mid-scroll can never leave the
header stranded off-screen.

### 3.3 How it avoids colliding with hero content

Four independent guards, all of which need to be reproduced together:

**1. z-index separation.** The header is `z-50`; hero copy and the scroll cue are `z-10`;
the hero's photo grade overlays are `z-2`/`z-3`. The header is unconditionally above the
hero, so the transition can never be occluded mid-flight.

**2. The 120px / 200px dead zone.** `start: "top -120"` plus `self.scroll() > 200` means
no header motion at all during the entire hero entrance. The hero timeline finishes at
~2.35s; a visitor who scrolls before then only sees the header hide once they are 200px
down, by which point the hero copy has left the header's band.

**3. Opacity sequencing, not a hard swap.** Two elements crossfade over the same 300ms:

```tsx
// The bar itself gains an opaque background:
"fixed inset-x-0 top-0 z-50 transition-colors duration-300",
isScrolled && "border-b border-sand/10 bg-basalt/90 backdrop-blur-md",

// The hero-only gradient scrim fades out:
"pointer-events-none absolute inset-0 bg-linear-to-b from-basalt/80 via-basalt/40 to-transparent transition-opacity duration-300",
isScrolled && "opacity-0",
```

Both are `duration-300`, both fire off the same `isScrolled` flip, so at every point in
the transition there is *some* dark ground behind the nav. The scrim's top stop is
`from-basalt/80` and the bar's is `bg-basalt/90`; they are close enough in value that
the crossfade midpoint never dips to an illegible contrast.

The reason this exists at all is in the comment on the state:

> The header used to rely on `mix-blend-difference` to stay legible over anything. That
> works over very dark or very light grounds and fails exactly in the middle — real
> photography put a pale grey sky behind the nav and it became grey-on-grey. Two explicit
> states are predictable: a gradient scrim over the hero, an opaque bar everywhere else.

**4. Timing overlap with the hero's own exit.** The flip threshold is
`self.scroll() > window.innerHeight * 0.85` — 85% of a viewport, not 100%. The hero is
`min-h-dvh`, so the swap **completes** (300ms transition started at 85vh) while the last
15% of the hero is still on screen. Waiting for 100% would put the swap exactly at the
seam, where the header would briefly sit over the next section's ground with the wrong
treatment.

**5. Re-render suppression.** `onUpdate` fires every scroll frame, but:

```ts
setIsScrolled((prev) => {
  const next = self.scroll() > window.innerHeight * 0.85;
  return prev === next ? prev : next;
});
```

Returning the identical `prev` reference makes React bail out of the re-render. Without
this the header component re-renders at 60–120fps for the entire page.

### 3.4 Mobile menu

- `hidden={!isOpen}` — the real HTML attribute, so it is removed from the a11y tree
  rather than just visually hidden.
- `animate-in fade-in duration-300` from `tw-animate-css` on open.
- Body scroll lock via `useIsomorphicLayoutEffect`, which **saves and restores the
  previous value** rather than blindly resetting to `""`:

```ts
useIsomorphicLayoutEffect(() => {
  if (!isOpen) return;
  const previous = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = previous;
  };
}, [isOpen]);
```

- `aria-expanded` and `aria-controls="mobile-menu"` on the open button.

---

## 4. The custom cursor

`src/components/animations/Cursor.tsx`, in full. The reasoning is already in the file's
docblock.

```tsx
'use client';

import { useRef } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';

/** Cursor modes, driven by what the pointer is currently over. */
type CursorMode = 'default' | 'interactive' | 'drag';

const MODE_LABEL: Record<CursorMode, string> = {
  default: '',
  interactive: '',
  drag: 'Drag',
};

/**
 * A cursor that reports what the pointer can do.
 *
 * Three states only, because each one has to mean something:
 *   default      — a small ochre disc
 *   interactive  — expands to a ring over anything clickable
 *   drag         — expands to a filled disc labelled "Drag" over the pinned
 *                  breaks track, which is the one region whose affordance is
 *                  genuinely not obvious
 *
 * Ochre is chosen because it is the one brand colour legible on both grounds:
 * 2.8:1 on sand and 4.4:1 on basalt. As a graphic mark rather than text that
 * clears the 3:1 non-text bar on the dark half and stays clearly visible on
 * the light half.
 *
 * Strictly opt-in: only mounts under `(pointer: fine)` and
 * `(prefers-reduced-motion: no-preference)`. Touch devices and anyone who has
 * asked for less motion keep their native cursor and never download the
 * behaviour. Text inputs keep the native caret — see globals.css.
 *
 * Position is driven by `gsap.quickTo`, which reuses one tween per axis
 * instead of allocating a new one per pointermove.
 */
export function Cursor(): React.JSX.Element | null {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(
      '(pointer: fine) and (prefers-reduced-motion: no-preference)',
      () => {
        const root = rootRef.current;
        const ring = ringRef.current;
        const label = labelRef.current;
        if (!root || !ring || !label) return;

        document.documentElement.classList.add('has-custom-cursor');
        gsap.set(root, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

        const xTo = gsap.quickTo(root, 'x', { duration: 0.32, ease: 'power3' });
        const yTo = gsap.quickTo(root, 'y', { duration: 0.32, ease: 'power3' });

        let revealed = false;
        const onMove = (event: PointerEvent): void => {
          xTo(event.clientX);
          yTo(event.clientY);
          if (!revealed) {
            revealed = true;
            gsap.to(root, { autoAlpha: 1, duration: 0.3 });
          }
        };

        let mode: CursorMode = 'default';
        const applyMode = (next: CursorMode): void => {
          if (next === mode) return;
          mode = next;

          const size = next === 'drag' ? 84 : next === 'interactive' ? 46 : 10;
          gsap.to(ring, {
            width: size,
            height: size,
            borderWidth: next === 'default' ? 5 : 1,
            backgroundColor:
              next === 'drag' ? 'var(--sand)' : 'rgba(196,112,58,0)',
            duration: 0.4,
            ease: 'expo.out',
          });
          gsap.to(label, {
            autoAlpha: next === 'drag' ? 1 : 0,
            duration: 0.25,
          });
          label.textContent = MODE_LABEL[next];
        };

        const onOver = (event: PointerEvent): void => {
          const target = event.target;
          if (!(target instanceof Element)) return;
          if (target.closest('[data-cursor="drag"]')) {
            applyMode('drag');
            return;
          }
          if (
            target.closest('a, button, [role="button"], input, select, textarea')
          ) {
            applyMode('interactive');
            return;
          }
          applyMode('default');
        };

        // Leaving the window should take the cursor with it.
        const onLeave = (): void => {
          gsap.to(root, { autoAlpha: 0, duration: 0.2 });
          revealed = false;
        };

        window.addEventListener('pointermove', onMove, { passive: true });
        document.addEventListener('pointerover', onOver, { passive: true });
        document.addEventListener('pointerleave', onLeave);

        return () => {
          window.removeEventListener('pointermove', onMove);
          document.removeEventListener('pointerover', onOver);
          document.removeEventListener('pointerleave', onLeave);
          document.documentElement.classList.remove('has-custom-cursor');
        };
      },
    );

    return () => mm.revert();
  });

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      // `hidden` by default so a no-JS or coarse-pointer visitor never sees a
      // stray dot; the variant only reveals it where the behaviour mounts.
      className="pointer-events-none fixed left-0 top-0 z-90 hidden motion-safe:pointer-fine:block"
    >
      <div
        ref={ringRef}
        className="flex size-2.5 items-center justify-center rounded-full border-[5px] border-ochre"
      >
        <span
          ref={labelRef}
          className="label-mono invisible whitespace-nowrap text-basalt"
        />
      </div>
    </div>
  );
}
```

### 4.1 The CSS half

The component adds `html.has-custom-cursor` when it mounts. That class — and nothing
else — hides the native cursor, so the native pointer is never lost if the component
fails to mount. From `src/app/globals.css`:

```css
  /* ------------------------------------------------------------------
     Custom cursor.

     The class is added by `Cursor` only under `(pointer: fine)` and
     `(prefers-reduced-motion: no-preference)`, so touch users and anyone who
     asked for less motion keep the native pointer untouched.

     Text-entry elements are excluded: the I-beam and the blinking caret carry
     information a decorative dot cannot replace, and hiding them would make
     fields genuinely harder to use.
     ------------------------------------------------------------------ */
  html.has-custom-cursor,
  html.has-custom-cursor a,
  html.has-custom-cursor button,
  html.has-custom-cursor [role="button"] {
    cursor: none;
  }

  html.has-custom-cursor input,
  html.has-custom-cursor textarea,
  html.has-custom-cursor select,
  html.has-custom-cursor [contenteditable="true"] {
    cursor: auto;
  }
```

The `.label-mono` utility the label uses:

```css
  /* Small uppercase mono label — the site's structural voice. */
  .label-mono {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    line-height: 1;
  }
```

### 4.2 Mode table

| Mode | Trigger selector | Ring size | Border | Background | Label |
|---|---|---|---|---|---|
| `default` | anything else | 10px | 5px | `rgba(196,112,58,0)` | — |
| `interactive` | `a, button, [role="button"], input, select, textarea` | 46px | 1px | `rgba(196,112,58,0)` | — |
| `drag` | `[data-cursor="drag"]` | 84px | 1px | `var(--sand)` | `Drag` |

Mode transition: `duration: 0.4, ease: "expo.out"`; label crossfade `duration: 0.25`.
Position: `gsap.quickTo` per axis, `duration: 0.32, ease: "power3"`.

Porting notes:

- **`gsap.quickTo`, not `gsap.to`, for position.** `quickTo` reuses a single tween per
  axis; `gsap.to` on every `pointermove` allocates a tween per event and will jank.
- **`xPercent: -50, yPercent: -50` is set once**, so `x`/`y` can be the raw
  `clientX`/`clientY` and the disc stays centred on the hot spot regardless of its
  current size.
- **`applyMode` early-returns when the mode is unchanged**, so `pointerover` (which
  fires constantly while moving within one element) does not restart the size tween.
- **`pointerover` on `document`, not `pointerenter` per element** — one delegated
  listener, and `target.closest()` handles nested markup (an icon inside a button).
- **`backgroundColor: 'rgba(196,112,58,0)'`** rather than `'transparent'`: GSAP can
  interpolate between two rgba values but not reliably between a colour and the
  `transparent` keyword.
- **The `revealed` flag** means the cursor fades in on first movement rather than
  appearing at `0,0` on mount.
- The only contract other components need is the attribute `data-cursor="drag"`.

---

## 5. Section reveal patterns

Five distinct scroll-triggered patterns, plus two pointer patterns and the CSS-only
hover treatments. Every one of them is a leaf client component wrapping Server
Component children — no client boundary sits above a page section.

### 5.1 Line-mask text reveal — `RevealText`

The primary heading and body-copy pattern. Splits into **lines** (recalculated on
resize by SplitText) and slides each out from behind a mask edge.

```tsx
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
```

**Values:** `yPercent: 115`, `duration: 1.1`, `ease: "expo.out"`, `stagger: 0.045`
(default), ScrollTrigger `start: "top 85%"`, `once: true`.

**Gotchas that cost real time:**

- `split.revert()` in teardown is mandatory. SplitText rewrites the DOM; without the
  revert, a reduced-motion toggle or a fast-refresh leaves duplicated line wrappers.
- `once: true` everywhere. Nothing on this site re-animates on scroll-back.
- The `delay` prop is applied **only** in `trigger === "mount"` mode. In scroll mode
  callers stagger sections by passing `delay={index * 0.05}`, which is a no-op on the
  tween itself — the visual stagger between adjacent paragraphs comes from them
  crossing the 85% line at different moments. (This is what the code does; if you want
  a true per-block delay in scroll mode you must add it.)
- Measure constraints (`max-w-[Nch]`) must go on the **heading element**, not a wrapper.
  From `SectionHeading`:

  > Measure constraints belong here, not on `className`: `ch` resolves against the
  > element's own font-size, so `max-w-[20ch]` on the wrapper would be measured in 16px
  > body text and crush the display type into a ~175px column (which the line mask then
  > clips).

### 5.2 Block fade-and-rise — `Reveal`

For non-text blocks: cards, rules, lists, media frames. Has a `staggerChildren` mode
that animates direct children instead of the wrapper.

```tsx
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
```

**Values:** `y: ±28` (0 for `direction="none"`), `autoAlpha: 0`, `duration: 1`,
`ease: "power3.out"`, `stagger: 0.08` (default, only in `staggerChildren` mode),
`start: "top 85%"`, `once: true`.

**Note the visibility trick in `staggerChildren` mode:** `gsap.set(el, { visibility: "visible" })`
is applied to the *wrapper*, while the tween targets `el.children`. The wrapper carries
`data-reveal-fade` and therefore the CSS `visibility: hidden`; children inherit it until
the wrapper is un-hidden.

Real usage — a staggered list of day moments, from `src/components/sections/Day.tsx`:

```tsx
        <Reveal className="mt-20" staggerChildren stagger={0.06}>
          {DAY.map((moment) => (
            <MomentRow key={moment.time} moment={moment} />
          ))}
        </Reveal>
```

And a staggered detail list inside a room entry, from `src/components/sections/Rooms.tsx`:

```tsx
        <Reveal className="mt-8" staggerChildren>
          {room.details.map((detail) => (
            <p
              key={detail}
              className="flex gap-4 border-t border-haze/20 py-3.5 text-sm leading-relaxed text-haze-ink first:border-t-0 first:pt-0"
            >
              <span
                aria-hidden="true"
                className="mt-2 size-1 shrink-0 rounded-full bg-ochre"
              />
              {detail}
            </p>
          ))}
        </Reveal>
```

### 5.3 Clip-path wipe + overscale — `ImageReveal`

The photography counterpart to `RevealText`: the frame wipes up from its bottom edge
while the image inside settles back from an overscale, on a **slower** tween so the
frame keeps moving after the wipe lands.

```tsx
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
```

**Values:** wipe `clipPath: inset(0% 0% 100% 0%) → inset(0% 0% 0% 0%)`, `duration: 1.35`;
inner `scale: 1.12 → 1`, `duration: 1.9`; both at timeline position `0` with
`ease: "expo.out"`; ScrollTrigger `start: "top 88%"`, `once: true`.

Both tweens are placed at position `0` — they start together and the scale simply
outlasts the wipe by 0.55s. The teardown sets `clipPath: "none"` (not the final inset)
so a torn-down component never leaves a clip that could trap the image.

### 5.4 Scroll-linked parallax — `Parallax`

```tsx
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
```

**Config:** `start: "top bottom"` → `end: "bottom top"` (the element's entire pass
through the viewport), `scrub: true`, `ease: "none"`, `invalidateOnRefresh: true`.
Travel is symmetric about the midpoint: `-amount/2` → `+amount/2`.

**There is no `reduce` branch** in this component — parallax simply does not exist under
reduced motion, and nothing needs un-hiding because the wrapper has no CSS gate.

`overscan` applies `scale-[1.15]` to the inner element so the drift never exposes an
edge. If you raise `amount` past ~18 you must raise the overscan scale to match.

Real usage — note the amounts actually used in this project are well above the doc
comment's recommended band, because these wrap tall `ImageReveal` frames:

```tsx
// Manifesto.tsx
<Parallax amount={40} className="h-full">
  <ImageReveal>
    <PhotoPlate brief={PLACE_PHOTO} sizes="(min-width: 1024px) 40vw, 100vw" />
  </ImageReveal>
</Parallax>

// Rooms.tsx and Table.tsx
<Parallax amount={30}>
  <ImageReveal>
    <PhotoPlate brief={room.photo} sizes="(min-width: 1024px) 58vw, 100vw" />
  </ImageReveal>
</Parallax>
```

The nesting order matters: `Parallax` **outside**, `ImageReveal` **inside**. Parallax
owns `overflow-hidden` and the scrubbed transform; ImageReveal owns the clip-path.
Reversing them would clip the parallax travel.

### 5.5 Pinned horizontal track — `HorizontalTrack`

```tsx
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
```

**Config:** media query `(min-width: 1024px) and (prefers-reduced-motion: no-preference)`,
`start: "top top"`, `end: () => "+=" + getDistance()`, `pin: true`, `scrub: 0.8`,
`anticipatePin: 1`, `invalidateOnRefresh: true`, `ease: "none"`.

Six things to preserve:

1. **`x` and `end` are both functions.** With `invalidateOnRefresh: true` they are
   re-evaluated on every ScrollTrigger refresh, so resize and font-swap don't strand
   the track mid-travel.
2. **`scrub: 0.8`, not `true`.** The slight lag is what makes the pinned travel feel
   coupled to Lenis' easing rather than mechanically locked to raw scroll.
3. **`anticipatePin: 1`** removes the one-frame jump at the moment of pinning.
4. **`document.fonts?.ready.then(() => ScrollTrigger.refresh())`** — display type changes
   the track's `scrollWidth` when the webfont lands. Without this refresh the end
   distance is measured against fallback metrics and the last card is unreachable.
5. **Two mechanics, one markup.** Below 1024px (and under reduced motion at any width)
   the track is a native `overflow-x-auto snap-x snap-mandatory` row; above it, GSAP
   owns the transform and native scrolling is turned off with
   `lg:overflow-x-visible lg:motion-safe:snap-none`. Note the `motion-safe:` on the snap
   reset — a reduced-motion desktop user keeps snap scrolling.
6. **`role="region"` + `aria-label` + `tabIndex={0}`** so the row is keyboard-scrollable
   and announced in both modes. `data-cursor="drag"` is what triggers the cursor's
   third state.

The consuming section adds gutter spacers so the first and last card clear the viewport
edge (`src/components/sections/Points.tsx`):

```tsx
      <HorizontalTrack
        label={POINTS_COPY.trackLabel}
        className="mt-16 pb-section lg:mt-0 lg:flex lg:min-h-dvh lg:items-center lg:pb-0"
      >
        {/* Leading gutter spacer keeps the first card off the viewport edge. */}
        <div aria-hidden="true" className="w-gutter shrink-0" />
        {BREAKS.map((surfBreak) => (
          <BreakCard key={surfBreak.id} surfBreak={surfBreak} />
        ))}
        <div aria-hidden="true" className="w-gutter shrink-0" />
      </HorizontalTrack>
```

### 5.6 Magnetic pointer attraction — `Magnetic`

```tsx
'use client';

import { useRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { gsap, useGSAP } from '@/lib/gsap';

export interface MagneticProps {
  readonly children: ReactNode;
  readonly className?: string;
  /**
   * How far the element may travel toward the pointer, in pixels.
   * Kept small on purpose — past ~14px the element stops feeling attracted
   * and starts feeling broken, because it detaches from its own hit area.
   */
  readonly strength?: number;
}

/**
 * Pulls its child gently toward the pointer while the pointer is inside it.
 *
 * The hit area never moves — only the visual child is transformed — so the
 * element remains exactly as clickable as it looks, which is the failure mode
 * most magnetic buttons have.
 *
 * `pointer: fine` and reduced-motion gated: on touch this is inert and costs
 * nothing, since there is no hover state to express.
 */
export function Magnetic({
  children,
  className,
  strength = 12,
}: MagneticProps): React.JSX.Element {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const childRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const child = childRef.current;
      if (!wrapper || !child) return;

      const mm = gsap.matchMedia();

      mm.add(
        '(pointer: fine) and (prefers-reduced-motion: no-preference)',
        () => {
          const xTo = gsap.quickTo(child, 'x', {
            duration: 0.5,
            ease: 'power3',
          });
          const yTo = gsap.quickTo(child, 'y', {
            duration: 0.5,
            ease: 'power3',
          });

          const onMove = (event: PointerEvent): void => {
            const rect = wrapper.getBoundingClientRect();
            const relativeX = event.clientX - (rect.left + rect.width / 2);
            const relativeY = event.clientY - (rect.top + rect.height / 2);
            // Normalise by half-size so the pull is proportional to how far
            // across the element the pointer is, not to the element's size.
            xTo((relativeX / (rect.width / 2)) * strength);
            yTo((relativeY / (rect.height / 2)) * strength);
          };

          const onLeave = (): void => {
            // Springs home rather than snapping — the release is the part
            // that reads as physical.
            gsap.to(child, {
              x: 0,
              y: 0,
              duration: 0.9,
              ease: 'elastic.out(1, 0.4)',
            });
          };

          wrapper.addEventListener('pointermove', onMove, { passive: true });
          wrapper.addEventListener('pointerleave', onLeave);

          return () => {
            wrapper.removeEventListener('pointermove', onMove);
            wrapper.removeEventListener('pointerleave', onLeave);
            gsap.set(child, { x: 0, y: 0 });
          };
        },
      );

      return () => mm.revert();
    },
    { scope: wrapperRef },
  );

  return (
    <span ref={wrapperRef} className={cn('inline-block', className)}>
      <span ref={childRef} className="inline-block will-change-transform">
        {children}
      </span>
    </span>
  );
}
```

**Values:** follow `duration: 0.5, ease: "power3"` via `quickTo`; release
`duration: 0.9, ease: "elastic.out(1, 0.4)"`; default `strength: 12`
(the header's Enquire button passes `strength={10}`).

The structural point: the **outer** span holds the hit area and the listeners; the
**inner** span is what moves. Most magnetic-button implementations transform the element
that also owns the hit area, which means the clickable region drifts away from the pixels
and the button becomes harder to hit the closer you get.

### 5.7 Ground-aware scroll indicator — `ScrollProgress`

Three ScrollTriggers in one component: a fade-in, a scrubbed progress readout, and one
trigger per dark-ground section that flips the indicator's palette.

```tsx
'use client';

import { useRef } from 'react';

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

/**
 * Reading position, set as instrument data.
 *
 * Deliberately the same visual language as the hero almanac — a hairline rule
 * and a mono figure — because this site's structural device is "readings", and
 * a generic top-of-page bar would be a second design talking over the first.
 * It sits on the right edge, vertically, picking up where the hero's rotated
 * "Scroll" cue leaves off.
 *
 * **Ground-aware.** The page alternates sand, basalt and clay grounds, and no
 * single ink is legible on all three — ochre-ink reads 4.5:1 on sand but 2.7:1
 * on basalt. Sections that render dark are tagged `data-ground="dark"`, and a
 * ScrollTrigger per section flips the indicator's palette as each one passes
 * the middle of the viewport.
 *
 * Desktop only: on a phone this duplicates the native scrollbar.
 */
export function ScrollProgress(): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const fill = fillRef.current;
      const value = valueRef.current;
      if (!root || !fill || !value) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 1024px)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop, reduced } = context.conditions as {
            isDesktop: boolean;
            reduced: boolean;
          };
          if (!isDesktop) return;

          gsap.set(root, { autoAlpha: 0 });
          gsap.set(fill, { scaleY: 0, transformOrigin: 'top center' });

          const fade = ScrollTrigger.create({
            start: () => `top -${String(window.innerHeight * 0.8)}`,
            end: 'max',
            onEnter: () => gsap.to(root, { autoAlpha: 1, duration: 0.4 }),
            onLeaveBack: () => gsap.to(root, { autoAlpha: 0, duration: 0.3 }),
          });

          const progress = ScrollTrigger.create({
            start: 0,
            end: 'max',
            // Unsmoothed, the figure flickers every frame. Scrubbed, the rule
            // tracks Lenis' easing rather than the raw scroll position.
            scrub: reduced ? true : 0.4,
            onUpdate: (self) => {
              gsap.set(fill, { scaleY: self.progress });
              value.textContent = String(
                Math.round(self.progress * 100),
              ).padStart(2, '0');
            },
          });

          // Flip the palette while a dark-ground section owns the midline.
          //
          // Membership is tracked in a set rather than each trigger writing
          // the attribute directly: `onToggle` fires for every trigger on
          // refresh, so an unrelated section going inactive would otherwise
          // clobber the active one and reset the indicator to light.
          const activeGrounds = new Set<Element>();
          const syncGround = (): void => {
            root.dataset.ground = activeGrounds.size > 0 ? 'dark' : 'light';
          };

          // `document.querySelectorAll`, not `gsap.utils.toArray` — useGSAP
          // resolves selector strings against its `scope`, which is this
          // indicator, so a scoped lookup would match nothing.
          const grounds = Array.from(
            document.querySelectorAll<HTMLElement>('[data-ground="dark"]'),
          ).map((section) =>
              ScrollTrigger.create({
                trigger: section,
                start: 'top center',
                end: 'bottom center',
                onToggle: (self) => {
                  if (self.isActive) activeGrounds.add(section);
                  else activeGrounds.delete(section);
                  syncGround();
                },
              }),
            );

          return () => {
            fade.kill();
            progress.kill();
            for (const trigger of grounds) trigger.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      data-ground="light"
      aria-hidden="true"
      className="group pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex"
    >
      <span className="relative block h-28 w-px bg-basalt/15 transition-colors duration-500 group-data-[ground=dark]:bg-sand/20">
        <span
          ref={fillRef}
          className="absolute inset-0 block w-px origin-top bg-ochre-ink transition-colors duration-500 group-data-[ground=dark]:bg-ochre-light"
        />
      </span>
      <span
        ref={valueRef}
        className="label-mono text-basalt/45 transition-colors duration-500 group-data-[ground=dark]:text-sand/55 [writing-mode:vertical-rl]"
        data-numeric
      >
        00
      </span>
    </div>
  );
}
```

Four transferable techniques here:

1. **`mm.add({...}, ctx => ...)` with a conditions object**, so one setup function reads
   *two* media queries and branches internally (`scrub: reduced ? true : 0.4`) instead of
   duplicating the whole body across two `mm.add` calls.
2. **The `activeGrounds` Set.** This is the non-obvious bug fix, spelled out in the
   comment: `onToggle` fires for *every* trigger on a ScrollTrigger refresh, so a naive
   `root.dataset.ground = self.isActive ? 'dark' : 'light'` inside each trigger lets an
   unrelated section clobber the active one.
3. **`document.querySelectorAll`, not `gsap.utils.toArray`.** Inside `useGSAP` with a
   `scope`, selector *strings* are resolved against the scope element. Since the scope
   here is the indicator itself, a scoped lookup for page sections matches nothing.
4. **Palette flipping is CSS, not GSAP.** The triggers only write `data-ground` on the
   root; `group-data-[ground=dark]:` variants with `transition-colors duration-500` do
   the actual colour work. GSAP owns transform and opacity; CSS owns colour.

The contract for consuming sections is a single attribute — from `Points.tsx`,
`Table.tsx` and `SiteFooter.tsx`:

```tsx
<section id="points" data-ground="dark" className="grain relative bg-basalt">
<section id="table" data-ground="dark" className="grain relative bg-clay py-section text-bone">
<footer data-ground="dark" className="grain relative bg-basalt text-sand">
```

### 5.8 CSS-only interaction patterns

Not everything is GSAP. These carry no JS cost and are worth porting as-is.

**Card hover — transform and colour only, never geometry** (`Points.tsx`):

```tsx
      className={cn(
        "group/card flex w-[80vw] shrink-0 snap-start flex-col justify-between",
        "border border-sand/15 bg-basalt-soft p-8 sm:w-[62vw] sm:p-10",
        "lg:w-[38vw] xl:w-[30vw]",
        // Transform and colour only — never width/height — so the row never
        // reflows mid-scroll while the track is pinned.
        "transition-[transform,border-color,background-color] duration-500 ease-out",
        "motion-safe:hover:-translate-y-1.5 hover:border-sand/35 hover:bg-basalt-soft/80",
      )}
```

**A rule that grows on hover, encoding data by weight as well as colour** (`Points.tsx`):

```tsx
/** Level is encoded by a rule weight as well as colour — never colour alone. */
const LEVEL_RULE: Record<BreakLevel, string> = {
  Beginner: "h-px bg-haze-dim",
  Intermediate: "h-0.5 bg-ochre-light",
  Advanced: "h-1 bg-ochre",
};
```

```tsx
        {/* Weight carries the difficulty; the label states it in words. */}
        <div
          aria-hidden="true"
          className={cn(
          "mt-6 w-full origin-left transition-transform duration-700 ease-out",
          "motion-safe:scale-x-[0.42] motion-safe:group-hover/card:scale-x-100",
          LEVEL_RULE[surfBreak.level],
        )}
        />
```

Note `motion-safe:scale-x-[0.42]` — the *resting* state is also behind `motion-safe`, so
a reduced-motion user sees the rule at full width rather than a permanently shrunken one.

**Photo scale on hover, driven from a named group two levels up** (`Rooms.tsx`):

```tsx
  <article className="group/room grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
    …
        <Parallax amount={30}>
          <ImageReveal>
            <PhotoPlate
              brief={room.photo}
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="transition-transform duration-[900ms] ease-out motion-safe:group-hover/room:scale-[1.03]"
            />
          </ImageReveal>
        </Parallax>
```

Hovering anywhere in the room entry — including the copy column — scales the photograph.
`group/room` is a *named* group because `group/card` also exists elsewhere on the page.

**Icon nudge on link hover** (`Enquire.tsx`):

```tsx
            <ArrowUpRight
              className="size-7 shrink-0 text-ochre-ink transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1"
              strokeWidth={1.25}
              aria-hidden="true"
            />
```

**Opacity-only skeleton pulse, with a per-item delay** (`AlmanacSkeleton.tsx` — note
`motion-reduce:animate-none` on every pulsing element):

```tsx
              <span
                className={cn(
                  'block h-[0.6875rem] animate-pulse rounded-[1px] bg-sand/25 motion-reduce:animate-none',
                  width.label,
                )}
                style={{ animationDelay: `${String(index * 90)}ms` }}
              />
```

**Focus ring — never removed, only offset** (`globals.css`):

```css
  /* Never remove the focus ring — offset it so it reads as designed. */
  :focus-visible {
    outline: 2px solid var(--color-ring);
    outline-offset: 3px;
    border-radius: 1px;
  }
```

### 5.9 Pattern selection guide

| You are animating | Use | Why |
|---|---|---|
| Headings, paragraphs | `RevealText` | Line masks, resize-safe via SplitText |
| Cards, rules, lists, contact rows | `Reveal` (+ `staggerChildren`) | Transform/opacity only |
| A photograph entering | `ImageReveal` | Same mask gesture as the type |
| A photograph while scrolling past | `Parallax` wrapping `ImageReveal` | Depth without layout cost |
| A row that should read as a journey | `HorizontalTrack` | Pinned desktop, native touch |
| A single high-value button | `Magnetic` | Pointer affordance, hit area intact |
| Hover states | Tailwind `transition-*` + `motion-safe:` | No JS cost |

---

## 6. Scroll and anchor handling

This is the section most likely to be got wrong in a port, so it is stated explicitly.

### 6.1 What does **not** happen

Verified by an exhaustive search of `src/` for `scrollIntoView`, `location.hash`,
`window.location`, `hashchange` and `scrollRestoration`:

- **Nothing calls `scrollIntoView()` anywhere in the project.**
- **Nothing reads `location.hash` anywhere in the project.**
- **There is no `hashchange` listener.**
- **Nothing touches `history.scrollRestoration`.**
- **No effect scrolls the page on mount.** The only mount-time scroll-adjacent work is
  `ScrollTrigger.refresh()` inside `SmoothScroll`, which measures; it does not move.

The complete set of matches for scroll APIs in `src/`:

```
src/components/layout/SiteHeader.tsx:33:  const { scrollTo } = useSmoothScroll();
src/components/layout/SiteHeader.tsx:98:    scrollTo(href, -80);
src/components/animations/SmoothScroll.tsx:99:      lenis.scrollTo(target, { offset, duration: 1.4 });
src/components/animations/SmoothScroll.tsx:105:      window.scrollTo({ top: target + offset, behavior: "auto" });
src/components/animations/SmoothScroll.tsx:110:      window.scrollTo({ top: el.offsetTop + offset, behavior: "auto" });
```

All five are inside the click-driven `scrollTo` path. None run on mount.

### 6.2 Why that is the design

A fresh page load must land at the top with the hero entrance intact. Any mount-time
`scrollIntoView` or `location.hash` read is the standard way that breaks:

- The hero timeline runs for ~2.35s from `delay: 0.15`. A mount-time scroll would fire
  underneath it, so the visitor sees a half-played entrance sliding away.
- Lenis is constructed in a layout effect. A scroll issued before or during that
  construction is either applied natively and then contradicted by Lenis, or swallowed.
- ScrollTrigger's `refresh()` runs right after Lenis mounts. Moving the page in the same
  frame invalidates the measurements it just took.

So the page delegates to the platform: on a fresh load with a URL fragment, **the browser
performs its own native fragment scroll**, before any of this code runs. `scroll-behavior: auto`
in `globals.css` guarantees that jump is instant rather than a native smooth scroll racing
Lenis. The header's ScrollTrigger has `start: "top -120"`, so if the browser did land the
visitor deep in the page, the trigger is simply already active — there is no first-frame
correction to see.

### 6.3 In-page anchor navigation

Every nav link is a real `<a href="#section">` — correct semantics, correct
middle-click/copy-link behaviour, and a working target with JS disabled. The click
handler then preempts the default:

```tsx
  const handleNavigate = (href: string): void => {
    setIsOpen(false);

    // The header also renders on routes that have no sections — /404, for
    // one. Scrolling to a selector that isn't in the document would silently
    // do nothing, so fall back to a real navigation home with the hash.
    if (href.startsWith("#") && !document.querySelector(href)) {
      router.push(`/${href}`);
      return;
    }

    scrollTo(href, -80);
  };
```

```tsx
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavigate(item.href);
                    }}
```

Three behaviours fall out of this:

1. **Target exists** → `scrollTo(href, -80)` → Lenis animates over `duration: 1.4`, with
   an 80px negative offset so the section heading clears the fixed header (which is
   `h-20` / `sm:h-24`, i.e. 80–96px).
2. **Target does not exist on this route** (the header also renders on the 404 page) →
   `router.push("/#rooms")`, a real navigation. On arrival the browser handles the
   fragment natively; there is no client-side hash handler to take over, by design.
3. **Reduced motion** → Lenis was never constructed, so `scrollTo` falls through to the
   native branch: `window.scrollTo({ top: el.offsetTop + offset, behavior: "auto" })` —
   an instant jump, which is the correct accessible behaviour.

The wordmark passes the selector `"body"` rather than `"#top"`, so back-to-top works via
the same Lenis path:

```tsx
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              handleNavigate("body");
            }}
```

### 6.4 Port checklist for scroll handling

- [ ] `html { scroll-behavior: auto; }` — do not use `scroll-smooth`.
- [ ] Keep real `href="#…"` on every nav link; `preventDefault()` in the handler.
- [ ] Pass a negative offset equal to your header height (here: `-80`).
- [ ] Guard `document.querySelector(href)` before scrolling, and fall back to a route
      navigation when the section isn't on the current route.
- [ ] Do **not** add a mount-time hash reader. If you later need one, gate it behind the
      hero timeline completing, and route it through `scrollTo` so Lenis owns the motion.

---

## 7. Metadata and production infrastructure

### 7.1 `src/app/opengraph-image.tsx`

```tsx
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';

import { HERO, SITE } from '@/lib/content';

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The social card.
 *
 * Composed rather than screenshotted, so it holds the brand at thumbnail size:
 * the hero frame under the same two-part scrim the page uses, the wordmark in
 * Bodoni, and a mono strapline. A link with no card is a broken first
 * impression, and it is the one asset judges and clients see before the site.
 *
 * Assets are read from disk rather than fetched, so the build never depends on
 * a font CDN being reachable.
 */
export default async function OpengraphImage(): Promise<ImageResponse> {
  // A *static* WOFF, deliberately. Satori cannot parse variable fonts — the
  // upstream Bodoni Moda is variable-only and fails with an opentype table
  // error, so this is the Fontsource static latin instance (19KB).
  const [bodoni, background] = await Promise.all([
    readFile(path.join(process.cwd(), 'src/assets/fonts/BodoniModa-400.woff')),
    readFile(path.join(process.cwd(), 'src/assets/og-background.jpg')),
  ]);

  const backgroundSrc = `data:image/jpeg;base64,${background.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#1c2321',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backgroundSrc}
          alt=""
          width={1200}
          height={630}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            objectFit: 'cover',
          }}
        />

        {/* Same scrim logic as the hero: vertical anchor plus a directional
            wash that protects the type zone and releases the right side.
            `backgroundImage`, not the `background` shorthand — satori ignores
            gradients declared via the shorthand and renders nothing. */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage:
              'linear-gradient(to top, rgba(28,35,33,0.95), rgba(28,35,33,0.55) 55%, rgba(28,35,33,0.50))',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage:
              'linear-gradient(96deg, rgba(28,35,33,0.90) 0%, rgba(28,35,33,0.66) 34%, rgba(28,35,33,0.16) 64%, rgba(28,35,33,0) 82%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '64px 72px',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 20,
              letterSpacing: '0.2em',
              color: 'rgba(232,223,211,0.75)',
              textTransform: 'uppercase',
              marginBottom: 18,
            }}
          >
            {SITE.tagline}
          </div>

          <div
            style={{
              display: 'flex',
              fontFamily: 'Bodoni',
              fontSize: 176,
              lineHeight: 0.8,
              letterSpacing: '-0.045em',
              color: '#e8dfd3',
            }}
          >
            {SITE.wordmark}
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 30,
              paddingTop: 22,
              borderTop: '1px solid rgba(232,223,211,0.22)',
              fontSize: 22,
              letterSpacing: '0.16em',
              color: 'rgba(232,223,211,0.72)',
              textTransform: 'uppercase',
            }}
          >
            {HERO.ogStrapline}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Bodoni', data: bodoni, style: 'normal', weight: 400 }],
    },
  );
}
```

Four satori constraints encoded above, each of which costs an hour to rediscover:

1. **Static WOFF only.** Satori cannot parse variable fonts. Bodoni Moda upstream is
   variable-only and throws an opentype table error; the file here is the Fontsource
   static latin instance (19KB).
2. **`backgroundImage`, never the `background` shorthand.** Satori silently renders
   nothing for gradients declared via the shorthand.
3. **`display: 'flex'` on every element with children**, including plain text blocks.
   Satori has no block layout.
4. **Assets read from disk with `node:fs/promises`**, not fetched, so the build never
   depends on a font CDN being reachable.

Companion metadata in `src/app/layout.tsx` — `metadataBase` is required for the OG image
to resolve to an absolute URL:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SEO.keywords],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Never cap zoom — pinch-zoom is an accessibility requirement.
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8dfd3" },
    { media: "(prefers-color-scheme: dark)", color: "#1c2321" },
  ],
};
```

### 7.2 `src/app/error.tsx` — **not present in this project**

There is no `error.tsx`. `src/app/` contains exactly: `globals.css`, `icon.svg`,
`layout.tsx`, `not-found.tsx`, `opengraph-image.tsx`, `page.tsx`, `robots.ts`, `sitemap.ts`.
No `error.tsx`, `global-error.tsx` or `loading.tsx` exists anywhere in the tree.

Recorded rather than invented, because a port that assumes one exists will go looking
for it. What the project *does* establish, and what an added `error.tsx` should follow,
is the `not-found.tsx` principle below: **an error boundary must not depend on the motion
layer**. If you add one, note that Next.js requires `error.tsx` to be a Client Component
(`"use client"`) and to accept `{ error, reset }` — neither of which any file here does
today.

### 7.3 `src/app/not-found.tsx`

```tsx
import type { Metadata } from 'next';

import { ButtonLink } from '@/components/ui/Button';
import { SITE } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Not found',
  robots: { index: false, follow: false },
};

/**
 * 404, written in the voice of the house rather than the framework.
 *
 * Server Component with no motion dependencies: a page that exists because
 * something already went wrong should not also depend on GSAP initialising.
 */
export default function NotFound(): React.JSX.Element {
  return (
    <div className="grain relative flex min-h-dvh flex-col justify-between bg-basalt text-sand">
      <div className="gutter flex flex-1 flex-col justify-center py-section">
        <div className="flex items-center gap-4">
          <span className="label-mono text-ochre-light">Off the map</span>
          <span aria-hidden="true" className="h-px w-24 bg-sand/25" />
        </div>

        <h1 className="mt-10 max-w-[14ch] font-display text-[clamp(2.75rem,9vw,8rem)] leading-[0.88] tracking-[-0.035em]">
          This page is not one of ours.
        </h1>

        <p className="mt-8 max-w-[52ch] text-pretty text-base leading-[1.75] text-sand/75 sm:text-lg">
          Nothing here. The tide takes things occasionally. Head back to the
          house, or write to us and we will point you at whatever you were
          looking for.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <ButtonLink href="/" variant="inverse">
            Back to the house
          </ButtonLink>
          <ButtonLink href={`mailto:${SITE.email}`} variant="outlineInverse">
            Write to us
          </ButtonLink>
        </div>
      </div>

      {/* Echoes the hero's almanac band, so even the error page is in the
          same structural language. */}
      <div className="border-t border-sand/20 bg-basalt/55">
        <div className="gutter flex flex-wrap gap-x-12 gap-y-3 py-5">
          <span className="label-mono text-sand/55">Error</span>
          <span className="font-mono text-sm text-sand" data-numeric>
            404
          </span>
          <span className="label-mono self-center text-sand/40">
            {SITE.location}
          </span>
        </div>
      </div>
    </div>
  );
}
```

The transferable rule is in the docblock: **no `RevealText`, no `Reveal`, no GSAP
anywhere on this page.** It is a Server Component with zero motion dependencies, because
a page that only renders when something has already gone wrong must not also depend on
GSAP initialising. It still renders inside `layout.tsx`, so `SiteHeader` is present —
which is exactly why `handleNavigate` has the "selector isn't in the document" fallback
described in §6.3.

`robots: { index: false, follow: false }` in the route's own metadata overrides the
layout's `index: true`.

### 7.4 `src/app/robots.ts`

```ts
import type { MetadataRoute } from 'next';

import { SITE } from '@/lib/content';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
```

### 7.5 `src/app/sitemap.ts`

```ts
import type { MetadataRoute } from 'next';

import { SITE } from '@/lib/content';

/**
 * One route today. Declared properly anyway — a sitemap is cheap, and the
 * anchors below are the page's real sections, which is what search engines use
 * to build sublinks for a single-page site.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
```

### 7.6 Supporting infra worth porting alongside

**`next.config.ts`** — image pipeline tuned to the real slot widths:

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // AVIF first — it wins decisively on photographic content. The hero is
    // pre-encoded and served via <picture>; this covers the six photographs
    // that go through next/image.
    formats: ['image/avif', 'image/webp'],
    // Matches the real slot widths: 40vw, 58vw and 100vw across our
    // breakpoints. Trimming the default ladder avoids generating variants
    // nothing ever requests.
    deviceSizes: [640, 828, 1080, 1200, 1600, 1920, 2560],
    imageSizes: [256, 384, 512, 768],
  },
};

export default nextConfig;
```

**Structured data**, injected from `layout.tsx`:

```tsx
/** Structured data — hospitality search results lean heavily on this. */
const lodgingJsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: SITE.name,
  /* … */
} as const;
```

```tsx
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingJsonLd) }}
        />
```

**Art-directed hero `<picture>`** (`src/components/ui/HeroPicture.tsx`) — this is the
element the hero timeline scales, so its LCP characteristics are part of the motion story:

```tsx
/**
 * The hero frame, art-directed across breakpoints.
 *
 * A 21/9 landscape composition is right on a desktop and destroys itself on a
 * phone — `object-cover` would crop a 2800×1200 frame to roughly its centre
 * fifth. So phones get a separately composed 3/4 frame rather than a squeezed
 * version of the wide one.
 *
 * Both frames are cut from the same negative, which is what makes the two
 * breakpoints read as one moment: the wide cut is anchored to the top of the
 * plate so the ochre sky band and headland survive the 21/9 crop, while the
 * portrait cut drops into the water to keep the surfers at a readable size.
 *
 * `next/image` scales a single source and cannot express that, so this is a
 * real <picture>: the browser evaluates `media` before fetching and downloads
 * exactly one file. AVIF first, WebP next, JPEG as the floor.
 *
 * At 2800px the AVIF is 88KB — smaller than the 640px portrait JPEG would be.
 */
export function HeroPicture({ className, alt = ALT }: HeroPictureProps): React.JSX.Element {
  return (
    // `display: contents` — a <picture> is inline by default, which gives the
    // <img> no percentage height to resolve `h-full` against.
    <picture className="contents">
      <source media="(min-width: 1024px)" type="image/avif" sizes="100vw"
        srcSet="/hero/hero-wide-1280.avif 1280w, /hero/hero-wide-1920.avif 1920w, /hero/hero-wide-2800.avif 2800w" />
      <source media="(min-width: 1024px)" type="image/webp" sizes="100vw"
        srcSet="/hero/hero-wide-1280.webp 1280w, /hero/hero-wide-1920.webp 1920w, /hero/hero-wide-2800.webp 2800w" />

      <source type="image/avif" sizes="100vw"
        srcSet="/hero/hero-portrait-640.avif 640w, /hero/hero-portrait-900.avif 900w, /hero/hero-portrait-1200.avif 1200w" />
      <source type="image/webp" sizes="100vw"
        srcSet="/hero/hero-portrait-640.webp 640w, /hero/hero-portrait-900.webp 900w, /hero/hero-portrait-1200.webp 1200w" />

      <img
        src="/hero/hero-wide-2800.jpg"
        alt={alt}
        width={2800}
        height={1200}
        // This is the LCP element on every visit.
        fetchPriority="high"
        decoding="async"
        className={cn('h-full w-full object-cover', className)}
      />
    </picture>
  );
}
```

The `contents` note matters for the hero timeline: `[data-hero-image]` is the wrapping
`<div>`, not the `<picture>`, so `scale: 1.14` transforms a block-level element with a
resolvable box.

---

## 8. Port checklist

In order. Each step is independently verifiable.

1. Install `gsap@^3.15`, `@gsap/react`, `lenis`, `clsx`, `tailwind-merge`. Tailwind ≥ 4.1.
2. Copy `src/lib/utils.ts` and `src/lib/gsap.ts` verbatim.
3. Copy both hooks (`useIsomorphicLayoutEffect`, `usePrefersReducedMotion`).
4. Add the `html.js` inline script to `<head>` and the progressive-enhancement CSS block
   (§0.5). **Verify:** disable JS — all content is visible.
5. Copy `SmoothScroll.tsx`. Wrap the app in it. **Verify:** scroll is smoothed; toggling
   OS reduced motion mid-session reverts to native without a reload.
6. Copy the reveal leaves: `RevealText`, `Reveal`, `ImageReveal`, `Parallax`. Apply to
   sections. **Verify:** each element animates once, at 85%/88% of the viewport.
7. Copy `SiteHeader`'s `useGSAP` block and the two `isScrolled`-driven className blocks.
   Adjust `window.innerHeight * 0.85` if your hero is not full-height, and the `-80`
   offset to your header height.
8. Copy `Cursor.tsx` **plus** the `html.has-custom-cursor` CSS. Both halves are required.
   **Verify:** touch device and reduced-motion desktop both keep the native cursor.
9. Copy `Magnetic`, `HorizontalTrack`, `ScrollProgress` as needed. Tag dark sections with
   `data-ground="dark"` and draggable regions with `data-cursor="drag"`.
10. Copy `HeroChoreography` and add the six `data-hero-*` attributes to your hero.
11. Copy the metadata routes. Replace the `SITE`/`HERO`/`SEO` imports with your own content
    module; **remember `error.tsx` does not exist here and must be written from scratch.**

### Attribute contracts, in one place

| Attribute | Read by | Effect |
|---|---|---|
| `html.js` | `globals.css` | Enables all pre-animation hidden states |
| `html.has-custom-cursor` | `globals.css` | `cursor: none`, except text inputs |
| `data-hero-image` | `HeroChoreography` (via `document`) | Scale-settle at t=0 |
| `data-hero-eyebrow` / `-mark` / `-sub` / `-cue` | `HeroChoreography` (scoped) | Entrance beats |
| `data-hero-reading` | `HeroChoreography` (via `document`) | Staggered band, + straggler sweep |
| `data-reveal` | `RevealText` + CSS gate | Line-mask reveal |
| `data-reveal-fade` | `Reveal` + CSS gate | Fade-and-rise |
| `data-clip-reveal` / `data-clip-inner` | `ImageReveal` + CSS gate | Wipe + overscale |
| `data-site-header` | `SiteHeader` | Hide/reveal target |
| `data-ground="dark"` | `ScrollProgress` | Flips indicator palette at the midline |
| `data-cursor="drag"` | `Cursor` | Third cursor state |
| `data-numeric` | `globals.css` | `font-variant-numeric: tabular-nums` |

### Values reference

| Motion | Duration | Ease | Stagger | Trigger point |
|---|---|---|---|---|
| Hero image settle | 2.2 | `expo.out` | — | t=0 (+0.15 delay) |
| Hero eyebrow | 1 | `expo.out` | — | t=0.35 |
| Hero wordmark chars | 1.4 | `expo.out` | 0.055 | t=0.5 |
| Hero sub | 1.1 | `expo.out` | — | t=1.05 |
| Hero readings | 0.8 | `expo.out` | 0.05 | t=1.2 |
| Hero cue | 0.8 | `expo.out` | — | t=1.5 |
| Header hide | 0.4 | `power3.in` | — | down + scroll > 200 |
| Header reveal | 0.45 | `power3.out` | — | any scroll up |
| Header ground swap | 0.3 (CSS) | — | — | scroll > 0.85 × innerHeight |
| Text line reveal | 1.1 | `expo.out` | 0.045 | `top 85%`, once |
| Block reveal | 1 | `power3.out` | 0.08 | `top 85%`, once |
| Image wipe | 1.35 | `expo.out` | — | `top 88%`, once |
| Image overscale | 1.9 | `expo.out` | — | `top 88%`, once |
| Parallax | scrubbed | `none` | — | `top bottom` → `bottom top` |
| Horizontal track | scrub 0.8 | `none` | — | `top top`, pinned |
| Cursor follow | 0.32 | `power3` | — | `pointermove` |
| Cursor mode change | 0.4 | `expo.out` | — | `pointerover` |
| Magnetic follow | 0.5 | `power3` | — | `pointermove` |
| Magnetic release | 0.9 | `elastic.out(1, 0.4)` | — | `pointerleave` |
| Lenis `scrollTo` | 1.4 | (Lenis default) | — | anchor click |
| Lenis wheel | 1.15 | `1.001 - 2^(-10t)` | — | wheel |
