import type { AlmanacReading } from '@/lib/types';

export interface AlmanacBandProps {
  readonly readings: readonly AlmanacReading[];
}

/**
 * The morning almanac band.
 *
 * Server Component. Lifted out of `Hero.tsx` unchanged so the readings can be
 * supplied live — every Tailwind class, the `data-hero-reading` hook on each
 * item and the `data-numeric` hook on each value are identical to the static
 * version, because the hero's GSAP timeline and the tabular-figures rule both
 * select on them.
 */
export function AlmanacBand({ readings }: AlmanacBandProps): React.JSX.Element {
  return (
    <div className="border-t border-sand/20 bg-basalt/55 backdrop-blur-md">
      <div className="gutter">
        <ul className="flex snap-x snap-mandatory gap-8 overflow-x-auto py-5 sm:gap-12 sm:py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <li className="label-mono shrink-0 snap-start self-center text-ochre-light">
            This morning
          </li>
          {readings.map((reading) => (
            <li
              key={reading.label}
              data-hero-reading
              className="shrink-0 snap-start"
            >
              <span className="label-mono block text-sand/55">
                {reading.label}
              </span>
              <span
                className="mt-1.5 block font-mono text-lg text-sand sm:text-xl"
                data-numeric
              >
                {reading.value}
                {reading.unit ? (
                  <span className="ml-0.5 text-xs text-sand/60">
                    {reading.unit}
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
