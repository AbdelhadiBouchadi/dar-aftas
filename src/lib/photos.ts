import type { StaticImageData } from "next/image";

import fleetBuggy from "@/assets/photos/fleet-buggy.webp";
import fleetMoto from "@/assets/photos/fleet-moto.webp";
import fleetQuad from "@/assets/photos/fleet-quad.webp";
import fleetScooter from "@/assets/photos/fleet-scooter.webp";
import night from "@/assets/photos/night.webp";
import place from "@/assets/photos/place.webp";

/**
 * Photographs keyed by `PhotoBrief.id`.
 *
 * These are **static imports**, not string paths: Next reads the file at build
 * time, so each entry carries its real width, height and a generated
 * `blurDataURL`. That gives a true blur-up on load and makes layout shift
 * impossible — neither is available when you pass a `/public` string.
 *
 * Slots are named for **what the frame contains** — `fleet-quad`, not
 * `quad-200dh`. Prices and package names change every season; the photograph of
 * a quad stopped on a stone track is still that photograph. Keying on content
 * is what lets `business.config.ts` be rewritten end to end without orphaning a
 * single image.
 *
 * The files here are cropped high-resolution **sources**, not delivery
 * renditions — `next.config.ts` declares AVIF-first with a real `deviceSizes`
 * ladder, so next/image derives every responsive variant from these at build
 * time. Pre-baking one fixed width would throw that away.
 *
 * The hero is deliberately absent. It is art-directed across breakpoints
 * (a 21/9 frame on desktop, a separately composed 3/4 frame on phones), which
 * requires a real <picture> element — see `HeroPicture`.
 *
 * ----------------------------------------------------------------------------
 *  EVERY SLOT IS BOUND
 * ----------------------------------------------------------------------------
 *
 * Two of these — `fleet-scooter` and `fleet-moto` — remain **substitutions**:
 * the client set contains no photograph of a scooter and none of a motorbike
 * clear of a watermark, so those slots carry the destination and the country
 * respectively rather than the machine. Both briefs say so at the point of use.
 *
 * `night` is no longer a substitution. It was a tyre detail while the only
 * dusk frame available was 206px; the re-curation pass found a real end-of-day
 * ride, which now sits there instead.
 *
 * See `CREDITS.json` beside the files for the per-slot source, safe box and
 * enhancement applied.
 */
export const PHOTOS: Readonly<Record<string, StaticImageData>> = {
  place,
  night,
  "fleet-quad": fleetQuad,
  "fleet-buggy": fleetBuggy,
  "fleet-scooter": fleetScooter,
  "fleet-moto": fleetMoto,
};

/**
 * Alt text. Written as description, not keyword stuffing — these are read
 * aloud, so they say what is in the frame and stop.
 *
 * Each one is tied to the copy of the section it sits in, and each one
 * describes what is actually in the photograph — including where that is less
 * flattering than the heading above it.
 */
export const PHOTO_ALT: Readonly<Record<string, string>> = {
  place:
    "Two riders in sunglasses standing in low evening sun beside a roofless stone building, with a dry hillside behind them.",
  night:
    "Five riders standing with their quads on open stony ground, helmets on, as the sun drops behind the ridge behind them.",
  "fleet-quad":
    "A rider in a full-face helmet sitting on a red quad on a loose stone track, with argan scrub behind.",
  "fleet-buggy":
    "Three riders in full-face helmets and goggles gathered around the roll cage of a grey two-seat buggy.",
  "fleet-scooter":
    "The road sign at the entrance to Taghazout in Arabic, Tifinagh and Latin script, covered in stickers and graffiti, with parked cars behind it in low sun.",
  "fleet-moto":
    "A stony track running up a dry riverbed between palms and scrub, a thin channel of water alongside it.",
};
