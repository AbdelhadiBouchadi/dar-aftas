import { HeroChoreography } from '@/components/animations/HeroChoreography';
import { AlmanacBand } from '@/components/sections/AlmanacBand';
import { HeroPicture } from '@/components/ui/HeroPicture';
import { getLiveAlmanacData } from '@/lib/almanac';
import { HERO, SITE } from '@/lib/content';

/**
 * Server Component. All copy is in the initial HTML for SEO; only the
 * choreography wrapper crosses to the client.
 *
 * The thesis: this is a house that runs on the ocean's schedule, so the first
 * thing the page states — before rooms, before price — is the morning's
 * actual conditions. The almanac band is the site's structural device, and it
 * encodes something true rather than decorating the layout.
 *
 * Async because the almanac is now live. The fetch inside carries a
 * `revalidate`, so the route stays prerendered and refreshes hourly — awaiting
 * here costs a visitor nothing.
 */
export async function Hero(): Promise<React.JSX.Element> {
  const readings = await getLiveAlmanacData();

  return (
    <section id="top" className="relative">
      <div className="relative min-h-dvh overflow-hidden">
        {/* Full-bleed ground. Art-directed per breakpoint; see HeroPicture. */}
        <div data-hero-image className="photo-film absolute inset-0">
          <HeroPicture />
        </div>

        {/* Scrim, in two parts, measured against the real photograph rather
            than guessed.

            Vertical: anchors the almanac band and the base of the wordmark.
            Directional: protects the bottom-left type zone specifically and
            falls away to nothing by the right third, so the surfer and the
            lit spray stay bright. A single flat scrim heavy enough to carry
            the type would have greyed out the whole frame. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-basalt/92 via-basalt/45 to-basalt/40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(96deg,rgba(28,35,33,0.86)_0%,rgba(28,35,33,0.62)_30%,rgba(28,35,33,0.18)_58%,rgba(28,35,33,0)_78%)]"
        />

        <HeroChoreography className="relative z-10 flex min-h-dvh flex-col justify-end">
          <div className="gutter pb-14 sm:pb-20">
            <p data-hero-eyebrow className="label-mono mb-8 w-fit text-sand/75">
              {SITE.tagline}
            </p>

            <h1
              data-hero-mark
              className="w-fit font-display text-[clamp(4.5rem,20vw,17rem)] leading-[0.78] tracking-[-0.045em] text-sand"
            >
              {SITE.wordmark}
            </h1>

            <p
              data-hero-sub
              className="mt-8 max-w-lg text-pretty text-base leading-relaxed text-sand/85 sm:text-lg"
            >
              {HERO.subtitle}
            </p>
          </div>

          {/* The almanac. Instrument data set as instrument data — and it is
              actually instrument data: live Open-Meteo readings for the
              coordinates in the property config, revalidated hourly, falling
              back per-reading to the static set on failure. */}
          <AlmanacBand readings={readings} />
        </HeroChoreography>

        <span
          data-hero-cue
          aria-hidden="true"
          className="absolute bottom-32 right-gutter z-10 hidden origin-bottom-right rotate-90 label-mono text-sand/50 lg:block"
        >
          Scroll
        </span>
      </div>
    </section>
  );
}
