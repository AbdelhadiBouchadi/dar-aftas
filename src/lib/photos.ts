import type { StaticImageData } from "next/image";

import place from "@/assets/photos/place.webp";
import stayHouse from "@/assets/photos/stay-house.webp";
import staySurf from "@/assets/photos/stay-surf.webp";
import stayTrip from "@/assets/photos/stay-trip.webp";
import stayYoga from "@/assets/photos/stay-yoga.webp";
import table from "@/assets/photos/table.webp";

/**
 * Photographs keyed by `PhotoBrief.id`.
 *
 * These are **static imports**, not string paths: Next reads the file at build
 * time, so each entry carries its real width, height and a generated
 * `blurDataURL`. That gives a true blur-up on load and makes layout shift
 * impossible — neither is available when you pass a `/public` string.
 *
 * Slots are named for **what the frame contains** — `stay-surf`, not
 * `stay-5-day`. Package names and prices change every season; the photograph of
 * a board being carried across a yard is still that photograph. Keying on
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
  "stay-surf": staySurf,
  "stay-yoga": stayYoga,
  "stay-house": stayHouse,
  "stay-trip": stayTrip,
};

/**
 * Alt text. Written as description, not keyword stuffing — these are read
 * aloud, so they say what is in the frame and stop.
 */
export const PHOTO_ALT: Readonly<Record<string, string>> = {
  place:
    "Surfboards standing upright in the sand at the end of a beginners' lesson, with hills and a white hillside village behind the beach.",
  table:
    "A ring of people sitting around a fire bowl on the sand at night, their faces lit only by the flames.",
  "stay-surf":
    "A surfer in a wetsuit carrying a floral-patterned longboard past pickup trucks stacked with boards, in front of a wall painted with a whale.",
  "stay-yoga":
    "A line of people in wetsuits balancing in tree pose on wet sand, with the shorebreak behind them.",
  "stay-house":
    "A made bed with a patterned Berber blanket across it, under straw hats and painted plates hung on a white wall.",
  "stay-trip":
    "A low table laid with shared dishes on a red rug in the dunes, leather poufs around it and a camel train crossing the ridge at sunset.",
};
