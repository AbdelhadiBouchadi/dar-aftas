import { HorizontalTrack } from "@/components/animations/HorizontalTrack";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BREAKS, POINTS_COPY } from "@/lib/content";
import type { BreakLevel, SurfBreak } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Level is encoded by a rule weight as well as colour — never colour alone. */
const LEVEL_RULE: Record<BreakLevel, string> = {
  Beginner: "h-px bg-haze-dim",
  Intermediate: "h-0.5 bg-ochre-light",
  Advanced: "h-1 bg-ochre",
};

interface BreakCardProps {
  readonly surfBreak: SurfBreak;
}

function BreakCard({ surfBreak }: BreakCardProps): React.JSX.Element {
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
          <span className="label-mono text-ochre-light">{surfBreak.hand}</span>
          <span className="label-mono text-haze-dim" data-numeric>
            {surfBreak.minutesAway} min
          </span>
        </div>

        <h3 className="mt-8 text-balance font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.95] text-sand">
          {surfBreak.name}
        </h3>

        {/* Weight carries the difficulty; the label states it in words. */}
        <div
          aria-hidden="true"
          className={cn(
          "mt-6 w-full origin-left transition-transform duration-700 ease-out",
          "motion-safe:scale-x-[0.42] motion-safe:group-hover/card:scale-x-100",
          LEVEL_RULE[surfBreak.level],
        )}
        />
        <p className="label-mono mt-3 text-haze-dim">{surfBreak.level}</p>

        <p className="mt-8 text-pretty text-sm leading-relaxed text-sand/80">
          {surfBreak.note}
        </p>
      </div>

      <dl className="mt-10 border-t border-sand/15 pt-5">
        <dt className="label-mono text-haze-dim">Works on</dt>
        <dd className="mt-2 font-mono text-sm text-sand" data-numeric>
          {surfBreak.worksOn}
        </dd>
      </dl>
    </article>
  );
}

/**
 * Server Component. The pinned horizontal mechanic is isolated in
 * `HorizontalTrack`, which is the only client code in this section.
 */
export function Points(): React.JSX.Element {
  return (
    <section id="points" data-ground="dark" className="grain relative bg-basalt">
      <div className="gutter pt-section">
        <SectionHeading
          eyebrow={POINTS_COPY.eyebrow}
          title={POINTS_COPY.title}
          inverse
          titleClassName="max-w-[24ch]"
        />
        <p className="mt-8 max-w-[58ch] text-pretty text-base leading-relaxed text-sand/70">
          {POINTS_COPY.intro}
        </p>
      </div>

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
    </section>
  );
}
