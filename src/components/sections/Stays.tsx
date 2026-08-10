import { ImageReveal } from '@/components/animations/ImageReveal';
import { Parallax } from '@/components/animations/Parallax';
import { Reveal } from '@/components/animations/Reveal';
import { RevealText } from '@/components/animations/RevealText';
import { PhotoPlate } from '@/components/ui/PhotoPlate';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { STAYS, STAYS_COPY } from '@/lib/content';
import type { Stay } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StayEntryProps {
  readonly stay: Stay;
  /** Alternating sides give the section a rhythm without a grid of cards. */
  readonly flipped: boolean;
}

function StayEntry({ stay, flipped }: StayEntryProps): React.JSX.Element {
  return (
    <article className="group/stay grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
      <div
        className={cn(
          'lg:col-span-7',
          flipped ? 'lg:order-2 lg:col-start-6' : 'lg:col-start-1',
        )}
      >
        <Parallax amount={30}>
          <ImageReveal>
            <PhotoPlate
              brief={stay.photo}
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="transition-transform duration-[900ms] ease-out motion-safe:group-hover/stay:scale-[1.03]"
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
          <span className="label-mono text-ochre-ink">{stay.level}</span>
          {stay.nights === undefined ? null : (
            <span className="label-mono text-haze-ink" data-numeric>
              {stay.nights} days
            </span>
          )}
        </Reveal>

        <RevealText
          as="h3"
          className="mt-8 text-[clamp(2.25rem,5vw,3.75rem)] text-basalt"
        >
          {stay.name}
        </RevealText>

        <RevealText className="mt-4 font-display text-lg italic text-clay">
          {stay.summary}
        </RevealText>

        <Reveal className="mt-8" staggerChildren>
          {stay.includes.map((item) => (
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
          A stay with no published price prints its note alone rather than a
          figure we would have had to invent. See `Stay.priceFromUsd`.
        */}
        <Reveal className="mt-8 flex flex-wrap items-baseline gap-3">
          {stay.priceFromUsd === undefined ? null : (
            <>
              <span className="label-mono text-haze-ink">From</span>
              <span className="font-mono text-2xl text-basalt" data-numeric>
                ${stay.priceFromUsd}
              </span>
            </>
          )}
          <span className="label-mono text-haze-ink">{stay.priceNote}</span>
        </Reveal>
      </div>
    </article>
  );
}

/** Server Component. */
export function Stays(): React.JSX.Element {
  return (
    <section id="stays" className="grain relative bg-sand-deep py-section">
      <div className="gutter">
        <SectionHeading
          eyebrow={STAYS_COPY.eyebrow}
          title={STAYS_COPY.title}
          titleClassName="max-w-[20ch]"
        />

        <div className="mt-24 flex flex-col gap-28 sm:gap-36">
          {STAYS.map((stay, index) => (
            <StayEntry key={stay.id} stay={stay} flipped={index % 2 === 1} />
          ))}
        </div>

        <Reveal className="mt-24 border-t border-haze/30 pt-8">
          <p className="max-w-[56ch] text-sm leading-relaxed text-haze-ink">
            {STAYS_COPY.footnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
