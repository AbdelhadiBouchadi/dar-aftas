import { ArrowUpRight } from 'lucide-react';

import { Reveal } from '@/components/animations/Reveal';
import { RevealText } from '@/components/animations/RevealText';
import { ENQUIRE, SITE } from '@/lib/content';

/**
 * Server Component.
 *
 * No booking engine by design — a school this size converts on a conversation,
 * and a third-party widget would be the one templated thing on the page. The
 * architecture is ready for one: drop a form here, post it to a Server Action,
 * and nothing else in the site has to change.
 *
 * Telephone leads, email follows. That is the order the client actually works
 * in — the profile we were given lists a WhatsApp number and no mailbox — and
 * putting the second-choice channel first would cost enquiries.
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

          <a
            href={`mailto:${SITE.email}`}
            className="group flex items-center justify-between gap-6 border-b border-haze/30 py-8 transition-colors duration-300 hover:bg-sand-deep/60"
          >
            <span className="flex flex-col gap-2">
              <span className="label-mono text-haze-ink">Email</span>
              <span className="break-all font-display text-[clamp(1.5rem,4.5vw,3rem)] leading-none text-basalt">
                {SITE.email}
              </span>
            </span>
            <ArrowUpRight
              className="size-7 shrink-0 text-ochre-ink transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1"
              strokeWidth={1.25}
              aria-hidden="true"
            />
          </a>
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
