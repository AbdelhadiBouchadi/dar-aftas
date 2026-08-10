import type { Metadata } from 'next';

import { ButtonLink } from '@/components/ui/Button';
import { SITE } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Not found',
  robots: { index: false, follow: false },
};

/**
 * 404, written in the voice of the house rather than the framework.
 *
 * Server Component with no motion dependencies: a page that exists because
 * something already went wrong should not also depend on GSAP initialising.
 */
export default function NotFound(): React.JSX.Element {
  return (
    <div className="grain relative flex min-h-dvh flex-col justify-between bg-basalt text-sand">
      <div className="gutter flex flex-1 flex-col justify-center py-section">
        <div className="flex items-center gap-4">
          <span className="label-mono text-ochre-light">Off the map</span>
          <span aria-hidden="true" className="h-px w-24 bg-sand/25" />
        </div>

        <h1 className="mt-10 max-w-[14ch] font-display text-[clamp(2.75rem,9vw,8rem)] leading-[0.88] tracking-[-0.035em]">
          This page is not one of ours.
        </h1>

        <p className="mt-8 max-w-[52ch] text-pretty text-base leading-[1.75] text-sand/75 sm:text-lg">
          Nothing here. The tide takes things occasionally. Head back to the
          house, or write to us and we will point you at whatever you were
          looking for.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <ButtonLink href="/" variant="inverse">
            Back to the house
          </ButtonLink>
          <ButtonLink href={`mailto:${SITE.email}`} variant="outlineInverse">
            Write to us
          </ButtonLink>
        </div>
      </div>

      {/* Echoes the hero's almanac band, so even the error page is in the
          same structural language. */}
      <div className="border-t border-sand/20 bg-basalt/55">
        <div className="gutter flex flex-wrap gap-x-12 gap-y-3 py-5">
          <span className="label-mono text-sand/55">Error</span>
          <span className="font-mono text-sm text-sand" data-numeric>
            404
          </span>
          <span className="label-mono self-center text-sand/40">
            {SITE.location}
          </span>
        </div>
      </div>
    </div>
  );
}
