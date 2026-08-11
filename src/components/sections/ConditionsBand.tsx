import type { ConditionsReading } from '@/lib/types';

export interface ConditionsBandProps {
  readonly readings: readonly ConditionsReading[];
  /** Lead-in label, e.g. "Out there now". Comes from the config, never here. */
  readonly label: string;
}

/**
 * The live conditions band.
 *
 * Server Component. Every Tailwind class, the `data-hero-reading` hook on each
 * item and the `data-numeric` hook on each value are load-bearing: the hero's
 * GSAP timeline selects on the first and the tabular-figures rule on the
 * second. Change the markup here and the hero choreography stops finding its
 * targets.
 */
export function ConditionsBand({
  readings,
  label,
}: ConditionsBandProps): React.JSX.Element {
  return (
    <div className="border-t border-sand/20 bg-basalt/55 backdrop-blur-md">
      <div className="gutter">
        <ul className="flex snap-x snap-mandatory gap-8 overflow-x-auto py-5 sm:gap-12 sm:py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <li className="label-mono shrink-0 snap-start self-center text-ochre-light">
            {label}
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
