import Image from "next/image";

import { PHOTOS, PHOTO_ALT } from "@/lib/photos";
import type { AspectRatio, PhotoBrief, PhotoTone } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Tonal grounds derived from the brand ramp, used when a brief has no
 * photograph yet. Each stands in for a real frame shot at that time of day, so
 * a plate never reads as "missing image".
 */
const TONE_GROUND: Record<PhotoTone, string> = {
  dawn: "linear-gradient(168deg, #3a4a5c 0%, #6f7f90 38%, #c4a98c 78%, #e8dfd3 100%)",
  noon: "linear-gradient(172deg, #e8dfd3 0%, #ddd2c3 44%, #c4a98c 76%, #85543f 100%)",
  dusk: "linear-gradient(166deg, #1f2b3a 0%, #85543f 46%, #b0764f 74%, #d99a68 100%)",
  interior:
    "linear-gradient(150deg, #f5f0e8 0%, #e8dfd3 40%, #ddd2c3 70%, #85543f 100%)",
  // Replaces `ocean`, whose deep blue-black was right for an Atlantic line-up
  // and wrong for every frame this client has. Ochre haze over dry ground:
  // pale sky at the top, dust through the middle, warm track at the bottom.
  dust:
    "linear-gradient(178deg, #ddd2c3 0%, #c4a98c 34%, #b0764f 70%, #85543f 100%)",
};

/**
 * Tones with an open horizon get a rule at the optical third.
 *
 * `dust` qualifies for the same reason `ocean` did: a piste under open sky has
 * a hard, visible horizon line, and the rule is what stops the placeholder
 * reading as an abstract gradient.
 */
const HAS_HORIZON: ReadonlySet<PhotoTone> = new Set<PhotoTone>([
  "dawn",
  "dusk",
  "dust",
]);

const RATIO_CLASS: Record<AspectRatio, string> = {
  "3/4": "aspect-[3/4]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
  "16/9": "aspect-video",
  "21/9": "aspect-[21/9]",
};

export interface PhotoPlateProps {
  readonly brief: PhotoBrief;
  /** `sizes` hint. Must match the slot's real rendered width. */
  readonly sizes?: string;
  readonly priority?: boolean;
  readonly className?: string;
  /** Show the shot brief. Only applies to the placeholder state. */
  readonly showBrief?: boolean;
  /** Apply the unified film grade. Off only for deliberately raw frames. */
  readonly graded?: boolean;
}

/**
 * An image slot that resolves to a real photograph when one exists for the
 * brief's id (see `@/lib/photos`), and to an art-directed placeholder when it
 * does not. Aspect ratio is reserved in both states, so photography can be
 * added or swapped with zero layout shift.
 */
export function PhotoPlate({
  brief,
  sizes = "100vw",
  priority = false,
  className,
  showBrief = true,
  graded = true,
}: PhotoPlateProps): React.JSX.Element {
  const ratioClass = RATIO_CLASS[brief.ratio];
  const photo = PHOTOS[brief.id];

  if (photo) {
    return (
      <figure
        className={cn(
          "relative overflow-hidden bg-sand-deep",
          graded && "photo-film",
          ratioClass,
          className,
        )}
      >
        <Image
          src={photo}
          alt={PHOTO_ALT[brief.id] ?? brief.direction}
          fill
          sizes={sizes}
          priority={priority}
          // Static import → Next generates the blurDataURL at build time.
          placeholder="blur"
          className="object-cover"
        />
      </figure>
    );
  }

  return (
    <figure
      className={cn("grain relative overflow-hidden", ratioClass, className)}
      style={{ backgroundImage: TONE_GROUND[brief.tone] }}
      role="img"
      aria-label={`Photography to be shot: ${brief.direction}`}
    >
      {HAS_HORIZON.has(brief.tone) ? (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-[38%] h-px bg-bone/25"
        />
      ) : null}

      {showBrief ? (
        <figcaption className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1.5 bg-linear-to-t from-basalt/80 to-transparent p-4 pt-12 sm:p-6 sm:pt-16">
          <span className="label-mono text-bone/60">
            Frame to shoot · {brief.ratio}
          </span>
          <span className="max-w-prose text-[0.8125rem] leading-snug text-bone/90">
            {brief.direction}
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
}
