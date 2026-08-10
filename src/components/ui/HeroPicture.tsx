import { cn } from '@/lib/utils';

export interface HeroPictureProps {
  readonly className?: string;
  readonly alt?: string;
}

const ALT =
  'Five surfers sitting on their boards in the line-up, holding hands with their arms raised, in flat grey Atlantic light.';

/**
 * The hero frame, art-directed across breakpoints.
 *
 * A 21/9 landscape composition is right on a desktop and destroys itself on a
 * phone — `object-cover` would crop a wide frame to roughly its centre fifth.
 * So phones get a separately composed 3/4 frame (the beach fire at sundown)
 * rather than a squeezed version of the wide one.
 *
 * `next/image` scales a single source and cannot express that, so this is a
 * real <picture>: the browser evaluates `media` before fetching and downloads
 * exactly one file. AVIF first, WebP next, JPEG as the floor.
 *
 * **The widths below are the real pixel widths of the client's source frames**
 * — 1024px wide, 576px portrait — and are the ceiling, not a choice. These came
 * in off a phone via Instagram and Booking.com, so there is no more detail to
 * serve; declaring a `2800w` candidate would be a false descriptor over an
 * upscale that invents nothing. The film grain and the scrim carry it at
 * display size. A real shoot is the only fix.
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
        srcSet="/hero/hero-wide-640.avif 640w, /hero/hero-wide-1024.avif 1024w"
      />
      <source
        media="(min-width: 1024px)"
        type="image/webp"
        sizes="100vw"
        srcSet="/hero/hero-wide-640.webp 640w, /hero/hero-wide-1024.webp 1024w"
      />

      {/* Phone and tablet: portrait frame */}
      <source
        type="image/avif"
        sizes="100vw"
        srcSet="/hero/hero-portrait-400.avif 400w, /hero/hero-portrait-576.avif 576w"
      />
      <source
        type="image/webp"
        sizes="100vw"
        srcSet="/hero/hero-portrait-400.webp 400w, /hero/hero-portrait-576.webp 576w"
      />

      <img
        src="/hero/hero-wide-1024.jpg"
        alt={alt}
        width={1024}
        height={439}
        // This is the LCP element on every visit.
        fetchPriority="high"
        decoding="async"
        className={cn('h-full w-full object-cover', className)}
      />
    </picture>
  );
}
