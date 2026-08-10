import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';

import { HERO, SITE } from '@/lib/content';

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The social card.
 *
 * Composed rather than screenshotted, so it holds the brand at thumbnail size:
 * the hero frame under the same two-part scrim the page uses, the wordmark in
 * Bodoni, and a mono strapline. A link with no card is a broken first
 * impression, and it is the one asset judges and clients see before the site.
 *
 * Assets are read from disk rather than fetched, so the build never depends on
 * a font CDN being reachable.
 */
export default async function OpengraphImage(): Promise<ImageResponse> {
  // A *static* WOFF, deliberately. Satori cannot parse variable fonts — the
  // upstream Bodoni Moda is variable-only and fails with an opentype table
  // error, so this is the Fontsource static latin instance (19KB).
  const [bodoni, background] = await Promise.all([
    readFile(path.join(process.cwd(), 'src/assets/fonts/BodoniModa-400.woff')),
    readFile(path.join(process.cwd(), 'src/assets/og-background.jpg')),
  ]);

  const backgroundSrc = `data:image/jpeg;base64,${background.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#1c2321',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backgroundSrc}
          alt=""
          width={1200}
          height={630}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            objectFit: 'cover',
          }}
        />

        {/* Same scrim logic as the hero: vertical anchor plus a directional
            wash that protects the type zone and releases the right side.
            `backgroundImage`, not the `background` shorthand — satori ignores
            gradients declared via the shorthand and renders nothing. */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage:
              'linear-gradient(to top, rgba(28,35,33,0.95), rgba(28,35,33,0.55) 55%, rgba(28,35,33,0.50))',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage:
              'linear-gradient(96deg, rgba(28,35,33,0.90) 0%, rgba(28,35,33,0.66) 34%, rgba(28,35,33,0.16) 64%, rgba(28,35,33,0) 82%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '64px 72px',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 20,
              letterSpacing: '0.2em',
              color: 'rgba(232,223,211,0.75)',
              textTransform: 'uppercase',
              marginBottom: 18,
            }}
          >
            {SITE.tagline}
          </div>

          <div
            style={{
              display: 'flex',
              fontFamily: 'Bodoni',
              fontSize: 176,
              lineHeight: 0.8,
              letterSpacing: '-0.045em',
              color: '#e8dfd3',
            }}
          >
            {SITE.wordmark}
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 30,
              paddingTop: 22,
              borderTop: '1px solid rgba(232,223,211,0.22)',
              fontSize: 22,
              letterSpacing: '0.16em',
              color: 'rgba(232,223,211,0.72)',
              textTransform: 'uppercase',
            }}
          >
            {HERO.ogStrapline}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Bodoni', data: bodoni, style: 'normal', weight: 400 }],
    },
  );
}
