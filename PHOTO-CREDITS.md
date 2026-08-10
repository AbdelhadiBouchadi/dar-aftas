# Photography credits

**Every photograph on this site is the client's own.** The stock and
AI-generated placeholders that filled these slots during the template phase
have been deleted, not merely unbound — nothing on the page depicts a business
other than Alaïa Surf School.

Sources are the 37 originals supplied at `intake/alaia/photos/`. Processed
files live at `src/assets/photos/*.webp` (cropped to the layout's reserved
ratios, WebP q80) and `public/hero/*` (pre-encoded AVIF/WebP/JPEG for the
art-directed hero). Machine-readable manifest:
`src/assets/photos/CREDITS.json`.

| Slot | Ratio | Frame | Intake original |
|---|---|---|---|
| `hero` (wide) | 21/9 | A student up and riding, coach in the water behind | `imgi_40_468841928_…` |
| `hero-portrait` | 3/4 | A class on the sand watching a lined-up swell | `imgi_35_468793344_…` |
| `place` | 3/2 | Class on the beach, the town stacked behind | `imgi_26_476868594_…` |
| `lesson-lineup` | 4/5 | Boards laid out, students beside them pre-session | `imgi_39_468765789_…` |
| `boards-dawn` | 4/5 | Boards and rash vests at the frontage, first light | `imgi_27_472006320_…` |
| `shorebreak-walk` | 4/5 | Coach walking two students into the shorebreak | `imgi_32_469350697_…` |
| `warmup-sand` | 4/5 | Warm-up on the sand before the session | `imgi_11_681486668_…` |
| `common-room` | 16/9 | The school's common room, board rack, glass wall | `imgi_6_622483690_…` |

`src/assets/photos/hero.webp` and `hero-portrait.webp` are the processed
masters at full crop size. Nothing imports them — the hero is served from
`public/hero/` through a real `<picture>` — but they are the reference the
`public/hero/` ladder is derived from, and they belong beside the slots they
came from.

## How these were chosen

All 37 originals were rendered as labelled contact sheets and reviewed, then a
twelve-frame shortlist was re-rendered at 620px for composition and crop
safety. Selection was judged against [ART-DIRECTION.md](./ART-DIRECTION.md).

The hero was chosen on one criterion above the others: **the top half had to
survive type.** The winning frame is open blue water across its entire upper
half, so the wordmark, the nav and the almanac band read against it without
the scrim having to be heavy enough to grey out the photograph.

Crops are centre-gravity cover crops, capped at the widest the source can fill
without upscaling. Every crop was rendered back out and reviewed before the
slots were bound.

## Honest limitations

**Resolution.** These are social-media originals, and none exceeds 1440px on
the axis the crop needs. The wide hero is therefore 1440×617 and the `srcSet`
stops there rather than advertising widths that would only be upscales. On a
2560px display the browser will stretch it. It holds under the scrim and the
film grain; it would not hold as a clean full-bleed frame. **A single
commissioned wide frame of the point at dawn is the highest-value photographic
upgrade available to this site.**

**No editorial-grade wide ocean or coastline frame exists in the set.** The
library is Instagram content: bright, midday, people at camera. The chosen
frames are the ones that most nearly meet the brief, not ones that meet it.

**Seven of the 37 are marketing posters** with baked-in text (Stage Surf, Black
Friday, Wim Hof, Surf 'n' Yoga) and one is the logo lockup. These are
unusable as photography and were excluded.

**No food photograph exists in the set.** The Table section — which sells the
€35 Surf & Dine package on breakfast and a shared lunch — is illustrated with
the school's common room instead. It is the right room, but it is not the meal.
A single overhead of the long table mid-lunch would close the gap.
