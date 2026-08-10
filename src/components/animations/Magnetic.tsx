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
