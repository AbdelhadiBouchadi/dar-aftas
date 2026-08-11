import { Reveal } from "@/components/animations/Reveal";
import { RevealText } from "@/components/animations/RevealText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RIDE, RIDE_COPY } from "@/lib/content";
import type { RideStage } from "@/lib/types";

interface StageRowProps {
  readonly stage: RideStage;
}

function StageRow({ stage }: StageRowProps): React.JSX.Element {
  return (
    <article className="group grid gap-4 border-t border-haze/30 py-9 sm:grid-cols-12 sm:gap-8">
      {/*
        Elapsed time, not wall-clock time. An excursion is a duration — it
        starts when your group starts — so "+00:35" is the honest marker and
        "09:35" would be a scheduling claim we cannot make.

        `<time datetime>` accepts an ISO 8601 duration, so this stays
        machine-readable: the printed "+00:35" is not itself valid `datetime`,
        which is why `RideStage` carries both forms.
      */}
      <time
        dateTime={stage.markIso}
        className="font-mono text-sm text-ochre-ink sm:col-span-2"
        data-numeric
      >
        {stage.mark}
      </time>

      <h3 className="font-display text-2xl leading-tight text-basalt sm:col-span-3 sm:text-3xl">
        {stage.title}
      </h3>

      <p className="max-w-[62ch] text-pretty text-sm leading-relaxed text-haze-ink sm:col-span-7 sm:text-base">
        {stage.body}
      </p>
    </article>
  );
}

/** Server Component. */
export function Ride(): React.JSX.Element {
  return (
    <section id="ride" className="grain relative bg-sand py-section">
      <div className="gutter">
        <div className="grid gap-12 lg:grid-cols-12">
          <SectionHeading
            eyebrow={RIDE_COPY.eyebrow}
            title={RIDE_COPY.title}
            className="lg:col-span-5"
          />

          <RevealText className="max-w-[54ch] self-end text-pretty text-base leading-[1.75] text-haze-ink lg:col-span-6 lg:col-start-7 sm:text-lg">
            {RIDE_COPY.intro}
          </RevealText>
        </div>

        <Reveal className="mt-20" staggerChildren stagger={0.06}>
          {RIDE.map((stage) => (
            <StageRow key={stage.markIso} stage={stage} />
          ))}
        </Reveal>

        <Reveal className="border-t border-haze/30 pt-8">
          <p className="label-mono text-haze-ink">{RIDE_COPY.footnote}</p>
        </Reveal>
      </div>
    </section>
  );
}
