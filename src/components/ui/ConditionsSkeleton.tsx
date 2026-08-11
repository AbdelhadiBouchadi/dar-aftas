import { cn } from '@/lib/utils';

/** Approximate glyph widths per reading, so the row does not reflow on swap. */
const PLACEHOLDER_WIDTHS: readonly { label: string; value: string }[] = [
  { label: 'w-6', value: 'w-12' }, // Air
  { label: 'w-10', value: 'w-12' }, // Feels
  { label: 'w-8', value: 'w-20' }, // Wind
  { label: 'w-10', value: 'w-14' }, // Gusts
  { label: 'w-16', value: 'w-14' }, // Visibility
  { label: 'w-5', value: 'w-8' }, // UV
  { label: 'w-20', value: 'w-14' }, // Golden hour
  { label: 'w-12', value: 'w-14' }, // Sunset
];

export interface ConditionsSkeletonProps {
  readonly className?: string;
  /** Lead-in label, matching the band it stands in for. */
  readonly label: string;
}

/**
 * Loading state for the conditions band.
 *
 * Currently unused: `getLiveConditions` is cached with `revalidate`, which
 * makes the route ISR, so the real readings are in the first HTML byte and
 * this never renders. It exists so that switching to an uncached, streamed
 * band (`cache: 'no-store'` behind a Suspense boundary) is a one-line change
 * with a designed loading state already in place.
 *
 * Deliberately reuses the band's own container classes — `bg-basalt/55`,
 * `border-sand/20`, the same paddings, `label-mono` and `text-lg` line boxes —
 * so the skeleton occupies exactly the height the data will, and the swap
 * cannot shift the hero.
 *
 * The pulse is opacity-only, and `motion-reduce:animate-none` stops it for
 * anyone who has asked for less movement.
 */
export function ConditionsSkeleton({
  className,
  label,
}: ConditionsSkeletonProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'border-t border-sand/20 bg-basalt/55 backdrop-blur-md',
        className,
      )}
      aria-hidden="true"
    >
      <div className="gutter">
        <ul className="flex gap-8 py-5 sm:gap-12 sm:py-6">
          <li className="label-mono shrink-0 self-center text-ochre-light/70">
            {label}
          </li>
          {PLACEHOLDER_WIDTHS.map((width, index) => (
            <li key={width.label + String(index)} className="shrink-0">
              {/* Matches `.label-mono`: 0.6875rem type on a 1lh box. */}
              <span
                className={cn(
                  'block h-[0.6875rem] animate-pulse rounded-[1px] bg-sand/25 motion-reduce:animate-none',
                  width.label,
                )}
                style={{ animationDelay: `${String(index * 90)}ms` }}
              />
              {/* Matches the value line: text-lg / sm:text-xl at leading-normal. */}
              <span
                className={cn(
                  'mt-1.5 block h-[1.75rem] animate-pulse rounded-[1px] bg-sand/15 motion-reduce:animate-none sm:h-[1.875rem]',
                  width.value,
                )}
                style={{ animationDelay: `${String(index * 90 + 45)}ms` }}
              />
            </li>
          ))}
        </ul>
      </div>
      <span className="sr-only">Loading current conditions</span>
    </div>
  );
}
