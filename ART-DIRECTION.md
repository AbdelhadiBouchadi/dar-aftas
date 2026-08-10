# Photography Brief

> **Status:** all slots are filled with the client's own photography — see
> [PHOTO-CREDITS.md](./PHOTO-CREDITS.md) for what was chosen from the 37-frame
> intake, why, and where it falls short of the briefs below. The shortfall is
> resolution and register: the library is social-media content, so no frame is
> the dawn editorial wide this document asks for.
>
> This document remains the specification: it is what to hand a photographer,
> and it is the standard the intake was judged against.

Each unfilled slot renders its own brief on the page, so nothing is a grey box
and nothing is guessed at later.

Slots are named for **what the frame contains** (`lesson-lineup`), never for the
package that uses it — package names change with every client this template is
pitched to, so keying on content means rewriting `property.config.ts` never
orphans a photograph.

**Swapping in real photography is a one-line change per slot.** The brief lives
in `src/lib/property.config.ts`; `PhotoPlate` renders the placeholder when no
file is bound to the slot id in `src/lib/photos.ts`, and `next/image` when one
is:

```tsx
<PhotoPlate brief={HERO_PHOTO} src="/photos/hero.webp" alt="Dawn at Anchor Point" />
```

Aspect ratio is reserved either way, so swapping causes **zero layout shift**.

---

## The frames to shoot

| Slot | Ratio | Time of day | The frame |
|---|---|---|---|
| `hero` | 21/9 | Dawn | The point peeling right, offshore spray lit from behind, two surfers small in a very large ocean. Cold blue water against warm ochre rock. Horizon low, room at the top for the wordmark. |
| `hero-portrait` | 3/4 | Dawn | The same morning composed vertically for phones. Sky in the top third, the lineup across the middle, sand at the base. |
| `place` | 3/2 | Last light | The village from above. Flat roofs, satellite dishes, whitewash going gold, Atlantic filling the top third. Documentary, not aspirational. |
| `lesson-lineup` | 4/5 | Early morning | A class on the sand before it starts: boards laid out, wetsuits half on, the coach pointing at the water rather than at the camera. |
| `boards-dawn` | 4/5 | First light | Equipment as still life. Boards racked and rash vests hung at the school's frontage, ocean beyond, nobody in frame. |
| `shorebreak-walk` | 4/5 | Mid-morning | Coach and students wading out, boards under arms, seen from behind. The headland compresses the background. |
| `warmup-sand` | 4/5 | Golden hour | The warm-up. One figure sharp, the group falling out of focus behind. Movement, not a posed stretch. |
| `common-room` | 16/9 | Midday | The room the table lives in, shot from the doorway so the architecture frames the light. Board rack in shot. |
| `table` | 16/9 | Dusk | Overhead, warm lamplight only. Long table mid-meal — hands reaching, bread torn, tagine open and steaming. Deliberately imperfect: spills, crumbs, mismatched glasses. Never a styled flat-lay. |

---

## Direction that applies to every frame

**Light.** Shoot at the edges of the day. The palette depends on warm ochre
against cool Atlantic grey, and midday sun flattens both into nothing.

**People.** Present but incidental, small in frame, never looking at the lens
and never posed mid-laugh. Guests should read as people who happen to be there,
not models demonstrating leisure.

**Against.** No drone-orbit clichés, no infinity-pool-with-cocktail, no
flat-lay breakfast, no cut-out sky. If the shot would work for any coastal
hotel anywhere, it is the wrong shot.

**Grade.** Keep the warm/cool split intact — do not neutralise it toward a
uniform teal-orange. Skin tones warm, water genuinely cold. Grain is welcome;
plastic skin smoothing is not.

**Delivery.** AVIF or WebP, 2400px on the long edge, sRGB. Drop into
`src/assets/photos/` and bind to a slot id in `src/lib/photos.ts`. The 2400px
floor matters: the current intake tops out at 1440px, which is why the hero
`srcSet` stops there instead of serving the wide displays it should.
