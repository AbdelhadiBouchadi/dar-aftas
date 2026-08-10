import { ImageReveal } from '@/components/animations/ImageReveal';
import { Parallax } from '@/components/animations/Parallax';
import { Reveal } from '@/components/animations/Reveal';
import { RevealText } from '@/components/animations/RevealText';
import { PhotoPlate } from '@/components/ui/PhotoPlate';
import { MANIFESTO, PLACE_PHOTO } from '@/lib/content';

/** Server Component — animation lives entirely in the leaf wrappers. */
export function Manifesto(): React.JSX.Element {
  return (
    <section id="school" className="grain relative bg-sand py-section">
      <div className="gutter">
        <div className="flex items-center gap-4">
          <span className="label-mono text-ochre-ink">{MANIFESTO.eyebrow}</span>
          <span aria-hidden="true" className="h-px w-24 bg-haze/40" />
        </div>

        <RevealText
          as="h2"
          className="mt-10 max-w-[18ch] text-[clamp(2.5rem,7.5vw,7rem)] text-basalt"
        >
          {MANIFESTO.statement}
        </RevealText>

        <div className="mt-20 grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5 lg:col-start-1">
            <Parallax amount={40} className="h-full">
              <ImageReveal>
                <PhotoPlate
                  brief={PLACE_PHOTO}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </ImageReveal>
            </Parallax>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-6 lg:col-start-7 lg:pt-16">
            {MANIFESTO.body.map((paragraph, index) => (
              <RevealText
                key={paragraph.slice(0, 24)}
                className="max-w-[62ch] text-pretty text-base leading-[1.75] text-haze-ink sm:text-lg"
                delay={index * 0.05}
              >
                {paragraph}
              </RevealText>
            ))}

            <Reveal className="mt-4 border-t border-haze/30 pt-8">
              <p className="max-w-[48ch] font-display text-2xl italic leading-snug text-clay sm:text-3xl">
                {MANIFESTO.pullQuote}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
