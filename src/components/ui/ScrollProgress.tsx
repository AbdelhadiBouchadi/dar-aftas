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
