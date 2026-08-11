import { HorizontalTrack } from "@/components/animations/HorizontalTrack";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ROUTES, ROUTES_COPY } from "@/lib/content";
import type { Route, RouteDifficulty } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Difficulty is encoded by a rule weight as well as colour — never colour alone.
 *
 * Typed as an exhaustive `Record`, so adding a difficulty to the union without
 * giving it a weight here is a build error rather than an undefined class
 * string that renders as no rule at all.
 */
const DIFFICULTY_RULE: Record<RouteDifficulty, string> = {
  Easy: "h-px bg-haze-dim",
  Moderate: "h-0.5 bg-ochre-light",
  Technical: "h-1 bg-ochre",
};

/** Minutes as a rider reads them: "90 min" under two hours, "3 h" over. */
function formatDuration(minutes: number): string {
  if (minutes < 120) return `${String(minutes)} min`;
  const hours = minutes / 60;
  return `${Number.isInteger(hours) ? String(hours) : hours.toFixed(1)} h`;
}

interface RouteCardProps {
  readonly route: Route;
}

function RouteCard({ route }: RouteCardProps): React.JSX.Element {
  return (
    <article
      className={cn(
        "group/card flex w-[80vw] shrink-0 snap-start flex-col justify-between",
        "border border-sand/15 bg-basalt-soft p-8 sm:w-[62vw] sm:p-10",
        "lg:w-[38vw] xl:w-[30vw]",
        // Transform and colour only — never width/height — so the row never
        // reflows mid-scroll while the track is pinned.
        "transition-[transform,border-color,background-color] duration-500 ease-out",
        "motion-safe:hover:-translate-y-1.5 hover:border-sand/35 hover:bg-basalt-soft/80",
      )}
    >
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <span className="label-mono text-ochre-light">{route.terrain}</span>
          <span className="label-mono text-haze-dim" data-numeric>
            {formatDuration(route.durationMinutes)}
          </span>
        </div>

        <h3 className="mt-8 text-balance font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.95] text-sand">
          {route.name}
        </h3>

        {/* Weight carries the difficulty; the label states it in words. */}
        <div
          aria-hidden="true"
          className={cn(
            "mt-6 w-full origin-left transition-transform duration-700 ease-out",
            "motion-safe:scale-x-[0.42] motion-safe:group-hover/card:scale-x-100",
            DIFFICULTY_RULE[route.difficulty],
          )}
        />
        <p className="label-mono mt-3 text-haze-dim">{route.difficulty}</p>

        <p className="mt-8 text-pretty text-sm leading-relaxed text-sand/80">
          {route.note}
        </p>
      </div>

      <dl className="mt-10 border-t border-sand/15 pt-5">
        <dt className="label-mono text-haze-dim">{ROUTES_COPY.bestAtLabel}</dt>
        <dd className="mt-2 font-mono text-sm text-sand" data-numeric>
          {route.bestAt}
        </dd>
      </dl>
    </article>
  );
}

/**
 * Server Component. The pinned horizontal mechanic is isolated in
 * `HorizontalTrack`, which is the only client code in this section.
 */
export function Routes(): React.JSX.Element {
  return (
    <section id="routes" data-ground="dark" className="grain relative bg-basalt">
      <div className="gutter pt-section">
        <SectionHeading
          eyebrow={ROUTES_COPY.eyebrow}
          title={ROUTES_COPY.title}
          inverse
          titleClassName="max-w-[24ch]"
        />
        <p className="mt-8 max-w-[58ch] text-pretty text-base leading-relaxed text-sand/70">
          {ROUTES_COPY.intro}
        </p>
      </div>

      <HorizontalTrack
        label={ROUTES_COPY.trackLabel}
        className="mt-16 pb-section lg:mt-0 lg:flex lg:min-h-dvh lg:items-center lg:pb-0"
      >
        {/* Leading gutter spacer keeps the first card off the viewport edge. */}
        <div aria-hidden="true" className="w-gutter shrink-0" />
        {ROUTES.map((route) => (
          <RouteCard key={route.id} route={route} />
        ))}
        <div aria-hidden="true" className="w-gutter shrink-0" />
      </HorizontalTrack>
    </section>
  );
}
