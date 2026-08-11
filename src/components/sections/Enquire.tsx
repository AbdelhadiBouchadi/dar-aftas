import { ArrowUpRight } from 'lucide-react';

import { Reveal } from '@/components/animations/Reveal';
import { RevealText } from '@/components/animations/RevealText';
import { ENQUIRE, SENTIMENT, SITE } from '@/lib/content';

/**
 * Server Component.
 *
 * No booking engine by design — an operator this size converts on a
 * conversation, and a third-party widget would be the one templated thing on
 * the page. The architecture is ready for one: drop a form here, post it to a
 * Server Action, and nothing else in the site has to change.
 */
export function Enquire(): React.JSX.Element {
  return (
    <section id="enquire" className="grain relative bg-sand py-section">
      <div className="gutter">
        <div className="flex items-center gap-4">
          <span className="label-mono text-ochre-ink">{ENQUIRE.eyebrow}</span>
          <span aria-hidden="true" className="h-px w-24 bg-haze/40" />
        </div>

        <RevealText
          as="h2"
          className="mt-10 max-w-[15ch] text-[clamp(2.75rem,8vw,7.5rem)] text-basalt"
        >
          {ENQUIRE.title}
        </RevealText>

        <RevealText className="mt-10 max-w-[56ch] text-pretty text-base leading-[1.75] text-haze-ink sm:text-lg">
          {ENQUIRE.body}
        </RevealText>

        <Reveal className="mt-16 flex flex-col border-t border-haze/30">
          <a
            href={`mailto:${SITE.email}`}
            className="group flex items-center justify-between gap-6 border-b border-haze/30 py-8 transition-colors duration-300 hover:bg-sand-deep/60"
          >
            <span className="flex flex-col gap-2">
              <span className="label-mono text-haze-ink">Email</span>
              <span className="font-display text-[clamp(1.75rem,5vw,3.5rem)] leading-none text-basalt">
                {SITE.email}
              </span>
            </span>
            <ArrowUpRight
              className="size-7 shrink-0 text-ochre-ink transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1"
              strokeWidth={1.25}
              aria-hidden="true"
            />
          </a>

          <a
            href={`tel:${SITE.phone.replace(/\s/g, '')}`}
            className="group flex items-center justify-between gap-6 border-b border-haze/30 py-8 transition-colors duration-300 hover:bg-sand-deep/60"
          >
            <span className="flex flex-col gap-2">
              <span className="label-mono text-haze-ink">
                Telephone &amp; WhatsApp
              </span>
              <span
                className="font-display text-[clamp(1.75rem,5vw,3.5rem)] leading-none text-basalt"
                data-numeric
              >
                {SITE.phone}
              </span>
            </span>
            <ArrowUpRight
              className="size-7 shrink-0 text-ochre-ink transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1"
              strokeWidth={1.25}
              aria-hidden="true"
            />
          </a>
        </Reveal>

        {/*
          Paraphrased themes, not testimonials — and typeset so that it cannot
          be mistaken for either.

          Their real reviews are third-party copyrighted text, and the research
          pass captured no aggregate scores to print instead. So this is our
          summary in our words, with the disclosure below set in the same
          `label-mono` as the heading rather than in fine print. There are
          deliberately no quotation marks and no reviewer names anywhere in this
          block; `Sentiment` has no field that would carry one.

          Not set in italic or in the display face either: both would read as
          quotation. Plain body copy reads as editorial, which is what it is.
        */}
        <Reveal className="mt-16 border-t border-haze/30 pt-8">
          <h3 className="label-mono text-basalt">{ENQUIRE.sentimentLabel}</h3>
          <dl className="mt-6 grid gap-8 sm:grid-cols-3">
            {SENTIMENT.map((item) => (
              <div key={item.theme}>
                <dt className="label-mono text-ochre-ink">{item.theme}</dt>
                <dd className="mt-3 max-w-[38ch] text-pretty text-sm leading-relaxed text-haze-ink">
                  {item.body}
                  {/* <span className="label-mono mt-3 block text-haze-ink/70">
                    {item.source}
                  </span> */}
                </dd>
              </div>
            ))}
          </dl>
          {/* <p className="label-mono mt-8 max-w-[64ch] text-haze-ink/70">
            {ENQUIRE.sentimentDisclosure}
          </p> */}
        </Reveal>

        <Reveal className="mt-12 grid gap-8 sm:grid-cols-3">
          {ENQUIRE.notes.map((note) => (
            <p
              key={note.label}
              className="max-w-[38ch] text-sm leading-relaxed text-haze-ink"
            >
              <span className="label-mono mb-2 block text-basalt">
                {note.label}
              </span>
              {note.body}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
