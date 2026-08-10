import type { StaticImageData } from "next/image";

import place from "@/assets/photos/place.jpg";
import roomBed from "@/assets/photos/room-bed.jpg";
import roomCourtyard from "@/assets/photos/room-courtyard.jpg";
import roomNiche from "@/assets/photos/room-niche.jpg";
import roomTerrace from "@/assets/photos/room-terrace.jpg";
import table from "@/assets/photos/table.jpg";

/**
 * Photographs keyed by `PhotoBrief.id`.
 *
 * These are **static imports**, not string paths: Next reads the file at build
 * time, so each entry carries its real width, height and a generated
 * `blurDataURL`. That gives a true blur-up on load and makes layout shift
 * impossible — neither is available when you pass a `/public` string.
 *
 * Slots are named for **what the frame contains** — `room-terrace`, not
 * `room-tamri`. Room names change with every client this template is pitched
 * to; the photograph of a terrace is still a photograph of a terrace. Keying on
 * content is what lets `property.config.ts` be rewritten end to end without
 * orphaning a single image.
 *
 * The hero is deliberately absent. It is art-directed across breakpoints
 * (a 21/9 frame on desktop, a separately composed 3/4 frame on phones), which
 * requires a real <picture> element — see `HeroPicture`.
 *
 * A brief with no entry here renders its art-direction placeholder instead, so
 * adding or removing photography needs no component changes.
 */
export const PHOTOS: Readonly<Record<string, StaticImageData>> = {
  place,
  table,
  "room-bed": roomBed,
  "room-niche": roomNiche,
  "room-courtyard": roomCourtyard,
  "room-terrace": roomTerrace,
};

/**
 * Alt text. Written as description, not keyword stuffing — these are read
 * aloud, so they say what is in the frame and stop.
 */
export const PHOTO_ALT: Readonly<Record<string, string>> = {
  place:
    "Ochre and whitewashed houses stacked on a hillside above a beach, fishing boats drawn up on the sand below.",
  table:
    "A long table seen from above, mid-meal: shared dishes, candles and glasses spread across the whole surface.",
  "room-bed":
    "Hard parallel stripes of morning sunlight falling across rumpled bed linen.",
  "room-niche":
    "A deep rectangular niche cut into a thick sand-coloured plaster wall, lit from one side.",
  "room-courtyard":
    "A tree throwing dappled shade across a whitewashed courtyard wall beside a blue-painted door.",
  "room-terrace":
    "Low wicker chairs on a terrace facing a hazy sea, the horizon a flat band behind them.",
};
