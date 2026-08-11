import { cn } from '@/lib/utils';

export interface HeroPictureProps {
  readonly className?: string;
  readonly alt?: string;
}

/**
 * One alt for two different photographs.
 *
 * A `<picture>` has exactly one `<img>`, so it carries exactly one alt — but
 * the browser may serve either the wide convoy frame or the portrait
 * single-rider frame depending on viewport. Describing only the desktop frame
 * would read a photograph to a phone user that they are not being shown.
 *
 * So this is written to be true of **both** frames rather than precise about
 * one. Specificity is worth less here than accuracy.
 */
const ALT =
  'A MayaQuad rider in a full-face helmet out on the dusty trails above Imi Ouaddar.';

/**
 * The hero frame, art-directed across breakpoints.
 *
 * A 21/9 landscape composition is right on a desktop and destroys itself on a
 * phone — `object-cover` would crop a wide frame to roughly its centre fifth.
 * So phones get a separately composed 3/4 frame (a rider looking out over the
 * coast) rather than a squeezed version of the wide one.
 *
 * `next/image` scales a single source and cannot express that, so this is a
 * real <picture>: the browser evaluates `media` before fetching and downloads
 * exactly one file. AVIF first, WebP next, JPEG as the floor.
 *
 * **The largest descriptor in each set is the real pixel width of the crop**
 * — 2048×878 wide, 1230×1640 portrait — and is the ceiling, not a choice.
 * Both are cropped from 2048px Instagram originals, so unlike the previous
 * client's 1024px set there is genuine detail here: the wide frame is sharp at
 * full width on a laptop. Declaring a candidate beyond these would be a false
 * descriptor over an upscale that invents nothing.
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
        srcSet="/hero/hero-wide-640.avif 640w, /hero/hero-wide-1024.avif 1024w, /hero/hero-wide-1600.avif 1600w, /hero/hero-wide-2048.avif 2048w"
      />
      <source
        media="(min-width: 1024px)"
        type="image/webp"
        sizes="100vw"
        srcSet="/hero/hero-wide-640.webp 640w, /hero/hero-wide-1024.webp 1024w, /hero/hero-wide-1600.webp 1600w, /hero/hero-wide-2048.webp 2048w"
      />

      {/* Phone and tablet: portrait frame */}
      <source
        type="image/avif"
        sizes="100vw"
        srcSet="/hero/hero-portrait-400.avif 400w, /hero/hero-portrait-576.avif 576w, /hero/hero-portrait-900.avif 900w, /hero/hero-portrait-1230.avif 1230w"
      />
      <source
        type="image/webp"
        sizes="100vw"
        srcSet="/hero/hero-portrait-400.webp 400w, /hero/hero-portrait-576.webp 576w, /hero/hero-portrait-900.webp 900w, /hero/hero-portrait-1230.webp 1230w"
      />

      <img
        src="/hero/hero-wide-1600.jpg"
        alt={alt}
        width={1600}
        height={686}
        // This is the LCP element on every visit.
        fetchPriority="high"
        decoding="async"
        className={cn('h-full w-full object-cover', className)}
      />
    </picture>
  );
}
