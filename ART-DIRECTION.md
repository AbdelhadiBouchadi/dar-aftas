# Photography Brief

> **Status:** all eight slots hold photography from Pexels. See
> [PHOTO-CREDITS.md](./PHOTO-CREDITS.md) for what was chosen, why, and where it
> falls short of the briefs below. The room slots remain the weak point — stock
> has no lime-plaster Moroccan guest house, so they hold the nearest real
> interiors and light studies rather than the property itself.
>
> This document remains the specification: it is what to hand a photographer.

Each unfilled slot renders its own brief on the page, so nothing is a grey box
and nothing is guessed at later.

Slots are named for **what the frame contains** (`room-terrace`), never for the
room that uses it — room names change with every client this template is pitched
to, so keying on content means rewriting `property.config.ts` never orphans a
photograph.

**Swapping in real photography is a one-line change per slot.** The brief lives
in `src/lib/property.config.ts`; `PhotoPlate` renders the placeholder when no
file is bound to the slot id in `src/lib/photos.ts`, and `next/image` when one
is:

```tsx
<PhotoPlate brief={HERO_PHOTO} src="/photos/hero.jpg" alt="Dawn at Anchor Point" />
```

Aspect ratio is reserved either way, so swapping causes **zero layout shift**.

---

## The frames to shoot

| Slot | Ratio | Time of day | The frame |
|---|---|---|---|
| `hero` | 21/9 | Dawn | Anchor Point from the cliff path: the point peeling right, offshore spray lit from behind, two surfers small in a very large ocean. Cold blue water against warm ochre rock. Horizon low, room at the top for the wordmark. |
| `place` | 3/2 | Last light | The village from above. Flat roofs, satellite dishes, whitewash going gold, Atlantic filling the top third. Documentary, not aspirational. |
| `room-bed` | 4/5 | Morning | Low sun through half-closed cedar shutters, hard stripes of light across a linen bed. Wet wetsuit on the terrace rail, just in frame. |
| `room-niche` | 3/2 | Late afternoon | Wide interior showing both windows at once. Warm plaster, cool ocean light — the whole palette in one frame. |
| `room-courtyard` | 4/5 | Midday | Courtyard, argan tree throwing dappled shade on lime plaster. Three boards on the rack. Shot from inside the doorway so the room frames the light. |
| `room-terrace` | 3/2 | Golden hour | Roof terrace. Low furniture, long shadows, ocean as a hard horizontal band. One person, small in frame, looking at the water — never at camera. |
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
`src/assets/photos/` and bind to a slot id in `src/lib/photos.ts`.
