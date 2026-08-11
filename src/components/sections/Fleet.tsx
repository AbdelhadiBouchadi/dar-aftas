import { ImageReveal } from '@/components/animations/ImageReveal';
import { Parallax } from '@/components/animations/Parallax';
import { Reveal } from '@/components/animations/Reveal';
import { RevealText } from '@/components/animations/RevealText';
import { PhotoPlate } from '@/components/ui/PhotoPlate';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FLEET, FLEET_COPY } from '@/lib/content';
import type { FleetUnit } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FleetEntryProps {
  readonly unit: FleetUnit;
  /** Alternating sides give the section a rhythm without a grid of cards. */
  readonly flipped: boolean;
}

function FleetEntry({ unit, flipped }: FleetEntryProps): React.JSX.Element {
  return (
    <article className="group/unit grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
      <div
        className={cn(
          'lg:col-span-7',
          flipped ? 'lg:order-2 lg:col-start-6' : 'lg:col-start-1',
        )}
      >
        <Parallax amount={30}>
          <ImageReveal>
            <PhotoPlate
              brief={unit.photo}
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="transition-transform duration-900 ease-out motion-safe:group-hover/unit:scale-[1.03]"
            />
          </ImageReveal>
        </Parallax>
      </div>

      <div
        className={cn(
          'lg:col-span-4',
          flipped ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-9',
        )}
      >
        <Reveal className="flex items-baseline justify-between gap-6 border-b border-haze/30 pb-4">
          <span className="label-mono text-ochre-ink">{unit.suits}</span>
          {unit.seats === undefined ? null : (
            <span className="label-mono text-haze-ink" data-numeric>
              {unit.seats} seats
            </span>
          )}
        </Reveal>

        <RevealText
          as="h3"
          className="mt-8 text-[clamp(2.25rem,5vw,3.75rem)] text-basalt"
        >
          {unit.name}
        </RevealText>

        <RevealText className="mt-4 font-display text-lg italic text-clay">
          {unit.summary}
        </RevealText>

        <Reveal className="mt-8" staggerChildren>
          {unit.includes.map((item) => (
            <p
              key={item}
              className="flex gap-4 border-t border-haze/20 py-3.5 text-sm leading-relaxed text-haze-ink first:border-t-0 first:pt-0"
            >
              <span
                aria-hidden="true"
                className="mt-2 size-1 shrink-0 rounded-full bg-ochre"
              />
              {item}
            </p>
          ))}
        </Reveal>

        {/*
          Dirham, printed after the figure the way it is written locally — and
          never with a `$`, which is what this slot used to hardcode. A machine
          with no published rate prints its note alone rather than a figure we
          would have had to invent. See `FleetUnit.priceFromMad`.
        */}
        <Reveal className="mt-8 flex flex-wrap items-baseline gap-3">
          {unit.priceFromMad === undefined ? null : (
            <>
              <span className="label-mono text-haze-ink">From</span>
              <span className="font-mono text-2xl text-basalt" data-numeric>
                {unit.priceFromMad}
                <span className="ml-1.5 text-base text-haze-ink">DH</span>
              </span>
            </>
          )}
          <span className="label-mono text-haze-ink">{unit.priceNote}</span>
        </Reveal>
      </div>
    </article>
  );
}

/** Server Component. */
export function Fleet(): React.JSX.Element {
  return (
    <section id="fleet" className="grain relative bg-sand-deep py-section">
      <div className="gutter">
        <SectionHeading
          eyebrow={FLEET_COPY.eyebrow}
          title={FLEET_COPY.title}
          titleClassName="max-w-[20ch]"
        />

        <div className="mt-24 flex flex-col gap-28 sm:gap-36">
          {FLEET.map((unit, index) => (
            <FleetEntry key={unit.id} unit={unit} flipped={index % 2 === 1} />
          ))}
        </div>

        <Reveal className="mt-24 border-t border-haze/30 pt-8">
          <p className="max-w-[56ch] text-sm leading-relaxed text-haze-ink">
            {FLEET_COPY.footnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
