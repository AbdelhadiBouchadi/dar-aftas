import { ImageReveal } from '@/components/animations/ImageReveal';
import { Parallax } from '@/components/animations/Parallax';
import { Reveal } from '@/components/animations/Reveal';
import { RevealText } from '@/components/animations/RevealText';
import { PhotoPlate } from '@/components/ui/PhotoPlate';
import { TABLE } from '@/lib/content';

/** Server Component. */
export function Table(): React.JSX.Element {
  return (
    <section id="table" data-ground="dark" className="grain relative bg-clay py-section text-bone">
      <div className="gutter">
        <div className="flex items-center gap-4">
          <span className="label-mono text-bone/70">{TABLE.eyebrow}</span>
          <span aria-hidden="true" className="h-px w-24 bg-bone/30" />
        </div>

        <RevealText
          as="h2"
          className="mt-10 max-w-[16ch] text-[clamp(2.5rem,7vw,6.5rem)] text-bone"
        >
          {TABLE.statement}
        </RevealText>

        <div className="mt-16">
          <Parallax amount={30}>
            <ImageReveal>
              <PhotoPlate brief={TABLE.photo} sizes="100vw" />
            </ImageReveal>
          </Parallax>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          {TABLE.body.map((paragraph, index) => (
            <RevealText
              key={paragraph.slice(0, 24)}
              className="max-w-[58ch] text-pretty text-base leading-[1.75] text-bone/90 lg:col-span-5"
              delay={index * 0.05}
            >
              {paragraph}
            </RevealText>
          ))}

          <Reveal className="lg:col-span-2 lg:col-start-11">
            <dl className="flex flex-col gap-6 border-t border-bone/25 pt-6">
              {TABLE.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="label-mono text-bone/60">{fact.label}</dt>
                  <dd className="mt-2 font-mono text-lg text-bone" data-numeric>
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
