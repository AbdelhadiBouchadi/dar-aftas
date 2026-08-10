import { Reveal } from "@/components/animations/Reveal";
import { RevealText } from "@/components/animations/RevealText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DAY, DAY_COPY } from "@/lib/content";
import type { DayMoment } from "@/lib/types";

interface MomentRowProps {
  readonly moment: DayMoment;
}

function MomentRow({ moment }: MomentRowProps): React.JSX.Element {
  return (
    <article className="group grid gap-4 border-t border-haze/30 py-9 sm:grid-cols-12 sm:gap-8">
      {/*
        The phase of the day is the structural marker, and it is legitimate:
        the day is a real sequence and the reader needs to know where in it
        they are. Arbitrary 01 / 02 / 03 numbering would not be. It is not a
        <time> and carries no clock value, because the school does not promise
        one — sessions move with the swell.
      */}
      <span className="label-mono text-ochre-ink sm:col-span-2">
        {moment.marker}
      </span>

      <h3 className="font-display text-2xl leading-tight text-basalt sm:col-span-3 sm:text-3xl">
        {moment.title}
      </h3>

      <p className="max-w-[62ch] text-pretty text-sm leading-relaxed text-haze-ink sm:col-span-7 sm:text-base">
        {moment.body}
      </p>
    </article>
  );
}

/** Server Component. */
export function Day(): React.JSX.Element {
  return (
    <section
      id="day"
      className="grain relative bg-sand py-section"
    >
      <div className="gutter">
        <div className="grid gap-12 lg:grid-cols-12">
          <SectionHeading
            eyebrow={DAY_COPY.eyebrow}
            title={DAY_COPY.title}
            className="lg:col-span-5"
          />

          <RevealText className="max-w-[54ch] self-end text-pretty text-base leading-[1.75] text-haze-ink lg:col-span-6 lg:col-start-7 sm:text-lg">
            {DAY_COPY.intro}
          </RevealText>
        </div>

        <Reveal className="mt-20" staggerChildren stagger={0.06}>
          {DAY.map((moment) => (
            <MomentRow key={moment.marker} moment={moment} />
          ))}
        </Reveal>

        <Reveal className="border-t border-haze/30 pt-8">
          <p className="label-mono text-haze-ink">{DAY_COPY.footnote}</p>
        </Reveal>
      </div>
    </section>
  );
}
