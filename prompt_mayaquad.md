# Claude Code prompt — pitch-mayaquad branch

I am on branch `pitch-mayaquad`. I have placed raw client photos in
`intake/mayaquad/photos/` and their factual business profile in
`intake/mayaquad/data.json`.

Before writing any code, read `AGENTS.md`, `CLAUDE.md`, and `ART-DIRECTION.md`
in full, and read `src/lib/types.ts` and the property config file to
understand the current schema, its constraints, and the type-safety approach
already in use (an incomplete swap should fail the build — preserve that
guarantee in anything you add).

This client is a quad/buggy rental business, not a surf camp or guest house.
Several existing sections are ocean- or lodging-specific and will not fit.
Do not force this data into the existing surf-shaped fields.

## PHASE 0 — Schema assessment (do this first, then STOP and show me your plan before writing any code)

- Identify which existing pieces transfer directly as-is: design tokens,
  typography, identity/seo/nav config, the motion/scroll architecture, the
  photo-slot mechanism.
- Identify which fields need renaming only — e.g. the break/point cards
  becoming route/trail cards — and propose the new field names, keeping the
  same type-safe, build-fails-on-mismatch approach already used.
- Identify components with business logic that doesn't apply — the live
  almanac's marine-specific swell/tide/wind-vs-shore calls — and propose
  either (a) a replacement module (e.g. `conditions.ts` using the same free
  Open-Meteo endpoint for temperature/wind/sunset, no marine calls) or
  (b) omitting the live band entirely. Tell me which you recommend and why.
- Identify sections that don't apply at all, since this business has no
  accommodation or dining component (rooms, the table), and propose what
  replaces them — e.g. "The Fleet" for available quad/buggy models, "The
  Ride" replacing "A Day" as a structured excursion walkthrough.
- Present this plan concisely and wait for my go-ahead before Phase 1.

## PHASE 1 — Content & copywriting integration

- Read `intake/mayaquad/data.json`.
- Update the config file(s) identified in Phase 0 with the exact business
  details: name, phone, packages/pricing, partnership mention.
- For testimonials: paraphrase the sentiment of real reviews in your own
  words. Do not quote review text verbatim — it's copyrighted third-party
  writing, not ours to reproduce.
- Write section copy in the same editorial register as the existing sections
  (per ART-DIRECTION.md), but reflect this business's actual voice — their
  Instagram bio is playful and adventurous ("Clean clothes were a bad idea").
  Lean into that where it fits rather than defaulting to the surf-camp tone.

## PHASE 2 — Image curation & vision analysis

- Scan all images in `intake/mayaquad/photos/` — this exact path, not any
  prior client's path.
- Select the best wide desert/trail photo for the hero slot (21:9 ratio),
  prioritizing a clean top half for text legibility.
- Select 3–4 additional photos for section/grid use (4:5 ratio).
- For each proposed selection, tell me which slot it's going to and why, and
  wait for my confirmation before processing anything.
- Only bind a slot if a photo genuinely matches its art-direction brief. If
  nothing available fits well, leave that slot on its placeholder rather than
  forcing in a mediocre image.

## PHASE 3 — Image processing & optimization

- Check `next.config.ts` for existing image optimization settings before
  deciding how to process. If `next/image` already handles responsive sizing,
  save cropped high-resolution sources rather than pre-baking one fixed-size
  WebP output.
- Use attention/entropy-based cropping (`sharp`'s `gravity: sharp.strategy.attention`),
  not fixed center-gravity, so subjects aren't cut off.
- Write real, section-specific alt text for every new image, tied to the
  copy in that section.
- Save processed images using the actual slot IDs from `src/lib/photos.ts`.
  Do not invent filenames like `room-1`/`room-2`.

## PHASE 4 — Build verification

- Delete any temporary scripts created during processing.
- Run `npm run build`, `npx tsc --noEmit`, and `npx eslint .` — all three.
- Start the dev server and list which sections you'd like me to visually
  check at `localhost:3000`. Do not commit until I confirm.
- Once I confirm, stage all updated files and commit with message:
  `feat: full intake build for MayaQuad quad rental`
