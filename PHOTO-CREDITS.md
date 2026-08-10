# Photography credits

Two sources:

- **Four photographs from Pexels** — hero, hero-portrait, place, table — used
  under the [Pexels License](https://www.pexels.com/license/): free for
  commercial use, no attribution required, modification permitted. Credited
  below anyway, as good practice.
- **Four AI-generated room frames** — see [Generated rooms](#generated-rooms).

Sources are stored at `src/assets/photos/*.jpg` (cropped to the layout's
reserved ratios) and `public/hero/*` (pre-encoded AVIF/WebP/JPEG for the
art-directed hero). Machine-readable credits: `src/assets/photos/CREDITS.json`.

| Slot | Photographer | Source |
|---|---|---|
| `hero` | Jimmy Boos | [Surfers on the beach](https://www.pexels.com/photo/people-wearing-black-wetsuits-while-surfing-on-the-beach-12343310/) |
| `hero-portrait` | Red Zeppelin | [Aerial surfer on the coastline](https://www.pexels.com/photo/aerial-view-of-surfer-on-the-jurassic-coastline-34596817/) |
| `place` | Zak Mogel | [Beachfront with boats in **Taghazout**](https://www.pexels.com/photo/bustling-beachfront-with-boats-in-taghazout-37138791/) |
| `table` | Askar Abayev | [Food on a decorated table](https://www.pexels.com/photo/food-on-decorated-table-during-party-5638752/) |

## How these were chosen

Candidates were pulled via the Pexels API across several query angles per slot,
rendered as contact sheets, and judged against the brief in
[ART-DIRECTION.md](./ART-DIRECTION.md). The hero finalists were additionally
composited into a mock of the real hero — actual scrim, actual wordmark — because
a square thumbnail cannot tell you whether the bottom-left survives the type.

`place` is the one literal match: it was shot in Taghazout.

## Generated rooms

The four room frames are **AI-generated**, not photographed.

| Slot | Prompt source | Seed |
|---|---|---|
| `room-bed` | [ART-DIRECTION.md](./ART-DIRECTION.md) | 47 |
| `room-niche` | ART-DIRECTION.md | 47 |
| `room-courtyard` | ART-DIRECTION.md | 11 |
| `room-terrace` | ART-DIRECTION.md | 11 |

**Method.** Generated with [Pollinations](https://pollinations.ai) running
Flux — free, no API key, no billing. Three seeds per room, selected on a
contact sheet for matching light direction so the four read as one shoot. The
prompts are the briefs from `ART-DIRECTION.md` plus a shared grade paragraph.

**Why not Gemini.** Every Gemini image model returned HTTP 429 on the free
tier; image generation there requires billing. AI Horde was tried as a
higher-resolution alternative — it offers RealESRGAN 4× post-processing — but
anonymous requests are capped at 790×790 and queued at roughly 17 minutes per
image, which is over an hour for four with no quality guarantee.

**The real limitation: resolution.** Pollinations hard-caps output at ~686px
on the long edge regardless of the size requested. Each winner is upscaled to
its slot size (≈2.1×) with a Lanczos-3 kernel plus unsharp masking. Smooth
subjects — plaster, linen, shade — interpolate well and the site's film grain
restores high-frequency texture, so at display size the result holds. **Under
1:1 scrutiny it is visibly soft**, particularly on fine detail like shutter
louvres and foliage. No processing invents detail the source never had.

Saturation is also knocked back to 0.84 during ingestion: Flux renders
Mediterranean blues far harder than the Pexels frames beside them, and the CSS
grade alone could not close the gap.

**Licensing.** Flux outputs are generally usable commercially, and this is a
prototype. For a real client deliverable, replace these with commissioned
photography of the actual property — an AI-generated interior presented as a
bookable room is misleading regardless of licence.

## Honest limitations

**The rooms are generated, and capped at 686px.** See above. The upgrade path,
cheapest first: enable billing on the Gemini key (~$0.50 for all four, prompts
already written), or Midjourney with `--ar 4:5` / `--ar 3:2`, or a real shoot —
the only option that produces the actual property.

**The table shot is not Moroccan food.** It is a communal overhead that reads
correctly as "one table, one sitting", but the dishes are Western. Fine for a
prototype; replace before any real client sees it as their own.
