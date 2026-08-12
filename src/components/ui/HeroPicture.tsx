import { cn } from '@/lib/utils';

export interface HeroPictureProps {
  readonly className?: string;
  readonly alt?: string;
}

const ALT =
  'Two surfers sitting out beyond the break at dawn, a dark headland behind them under an ochre sky.';

/**
 * The hero frame, art-directed across breakpoints.
 *
 * A 21/9 landscape composition is right on a desktop and destroys itself on a
 * phone — `object-cover` would crop a 2800×1200 frame to roughly its centre
 * fifth. So phones get a separately composed 3/4 frame rather than a squeezed
 * version of the wide one.
 *
 * Both frames are cut from the same negative, which is what makes the two
 * breakpoints read as one moment: the wide cut is anchored to the top of the
 * plate so the ochre sky band and headland survive the 21/9 crop, while the
 * portrait cut drops into the water to keep the surfers at a readable size.
 *
 * `next/image` scales a single source and cannot express that, so this is a
 * real <picture>: the browser evaluates `media` before fetching and downloads
 * exactly one file. AVIF first, WebP next, JPEG as the floor.
 *
 * At 2800px the AVIF is 88KB — smaller than the 640px portrait JPEG would be.
 */
export function HeroPicture({
  className,
  alt = ALT,
}: HeroPictureProps): React.JSX.Element {
  return (
    // `display: contents` — a <picture> is inline by default, which gives the
    // <img> no percentage height to resolve `h-full` against.
    <picture className="contents">
      {/* Desktop: wide frame */}
      <source
        media="(min-width: 1024px)"
        type="image/avif"
        sizes="100vw"
        srcSet="/hero/hero-wide-1280.avif 1280w, /hero/hero-wide-1920.avif 1920w, /hero/hero-wide-2800.avif 2800w"
      />
      <source
        media="(min-width: 1024px)"
        type="image/webp"
        sizes="100vw"
        srcSet="/hero/hero-wide-1280.webp 1280w, /hero/hero-wide-1920.webp 1920w, /hero/hero-wide-2800.webp 2800w"
      />

      {/* Phone and tablet: portrait frame */}
      <source
        type="image/avif"
        sizes="100vw"
        srcSet="/hero/hero-portrait-640.avif 640w, /hero/hero-portrait-900.avif 900w, /hero/hero-portrait-1200.avif 1200w"
      />
      <source
        type="image/webp"
        sizes="100vw"
        srcSet="/hero/hero-portrait-640.webp 640w, /hero/hero-portrait-900.webp 900w, /hero/hero-portrait-1200.webp 1200w"
      />

      <img
        src="/hero/hero-wide-2800.jpg"
        alt={alt}
        width={2800}
        height={1200}
        // This is the LCP element on every visit.
        fetchPriority="high"
        decoding="async"
        className={cn('h-full w-full object-cover', className)}
      />
    </picture>
  );
}
