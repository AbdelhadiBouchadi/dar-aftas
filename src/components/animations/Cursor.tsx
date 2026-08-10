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
