import { Reveal } from '@/components/animations/Reveal';
import { RevealText } from '@/components/animations/RevealText';
import { TESTIMONIALS, TESTIMONIALS_COPY } from '@/lib/content';
import type { Testimonial } from '@/lib/types';

interface QuoteProps {
  readonly testimonial: Testimonial;
}

function Quote({ testimonial }: QuoteProps): React.JSX.Element {
  return (
    <figure className="flex h-full flex-col justify-between gap-8 border-t border-haze/30 pt-8">
      {/*
        `lang` is not decoration. These reviews are French on an English page,
        and without it a screen reader pronounces them with English phonemes.
      */}
      <blockquote
        lang={testimonial.lang}
        className="max-w-[38ch] text-pretty font-display text-xl italic leading-snug text-basalt sm:text-2xl"
      >
        {testimonial.quote}
      </blockquote>

      <figcaption className="label-mono text-haze-ink">
        {testimonial.author}
      </figcaption>
    </figure>
  );
}

/**
 * Server Component.
 *
 * Quoted verbatim and untranslated. A French review rendered in French is
 * evidence; the same review smoothed into marketing English is copy, and the
 * reader can tell the difference.
 */
export function Testimonials(): React.JSX.Element {
  return (
    <section id="reviews" className="grain relative bg-sand-deep py-section">
      <div className="gutter">
        <div className="grid items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4">
              <span className="label-mono text-ochre-ink">
                {TESTIMONIALS_COPY.eyebrow}
              </span>
              <span aria-hidden="true" className="h-px w-24 bg-haze/40" />
            </div>

            <RevealText
              as="h2"
              className="mt-10 max-w-[16ch] text-[clamp(2.5rem,7vw,6rem)] text-basalt"
            >
              {TESTIMONIALS_COPY.title}
            </RevealText>
          </div>

          <Reveal className="lg:col-span-4 lg:col-start-9">
            <div className="flex items-baseline gap-4 border-t border-haze/30 pt-6">
              <span
                className="font-mono text-[clamp(2.5rem,6vw,4rem)] leading-none text-ochre-ink"
                data-numeric
              >
                {TESTIMONIALS_COPY.ratingValue.toFixed(1)}
              </span>
              <span className="label-mono text-haze-ink">
                out of 5 · {TESTIMONIALS_COPY.reviewCount}{' '}
                {TESTIMONIALS_COPY.source.toLowerCase()}
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal
          className="mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16"
          staggerChildren
          stagger={0.08}
        >
          {TESTIMONIALS.map((testimonial) => (
            <Quote key={testimonial.author} testimonial={testimonial} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
