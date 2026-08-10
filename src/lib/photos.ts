import type { StaticImageData } from 'next/image';

import boardsDawn from '@/assets/photos/boards-dawn.webp';
import commonRoom from '@/assets/photos/common-room.webp';
import lessonLineup from '@/assets/photos/lesson-lineup.webp';
import place from '@/assets/photos/place.webp';
import shorebreakWalk from '@/assets/photos/shorebreak-walk.webp';
import warmupSand from '@/assets/photos/warmup-sand.webp';

/**
 * Photographs keyed by `PhotoBrief.id`.
 *
 * These are **static imports**, not string paths: Next reads the file at build
 * time, so each entry carries its real width, height and a generated
 * `blurDataURL`. That gives a true blur-up on load and makes layout shift
 * impossible — neither is available when you pass a `/public` string.
 *
 * Slots are named for **what the frame contains** — `lesson-lineup`, not
 * `group-class`. Package names change with every client this template is
 * pitched to; a photograph of a class on the sand is still a photograph of a
 * class on the sand. Keying on content is what lets `property.config.ts` be
 * rewritten end to end without orphaning a single image.
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
  'common-room': commonRoom,
  'lesson-lineup': lessonLineup,
  'boards-dawn': boardsDawn,
  'shorebreak-walk': shorebreakWalk,
  'warmup-sand': warmupSand,
};

/**
 * Alt text. Written as description, not keyword stuffing — these are read
 * aloud, so they say what is in the frame and stop.
 */
export const PHOTO_ALT: Readonly<Record<string, string>> = {
  place:
    'A surf class sitting on the sand with their arms raised, the low white buildings of the town stacked along the shore behind them.',
  'common-room':
    "The school's common room: low pale sofas around a wooden table, a rack of surfboards along the right-hand wall, and glass the full width of the room opening onto the garden.",
  'lesson-lineup':
    'Soft-top surfboards laid out in a row on wet sand, a group of students in yellow rash vests sitting beside them before the session.',
  'boards-dawn':
    'Two surfboards resting on the road outside the school at first light, rash vests hung on posts beside them and the sea a flat band beyond.',
  'shorebreak-walk':
    'An instructor and two children wading into the shorebreak carrying blue soft-top boards, a headland in the haze behind them.',
  'warmup-sand':
    'A surf instructor on the beach mid warm-up, arms crossed in front of her and eyes closed, the rest of the group out of focus behind.',
};
