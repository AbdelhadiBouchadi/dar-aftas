# Photography credits

**All eight slots are photographs from [Pexels](https://www.pexels.com/license/).**
Nothing on this site is AI-generated, and nothing is photography of a real
trading business presented as this fictional one.

Sources are stored at `src/assets/photos/*.jpg` (cropped to the layout's
reserved ratios) and `public/hero/*` (pre-encoded AVIF/WebP/JPEG for the
art-directed hero). Machine-readable credits: `src/assets/photos/CREDITS.json`.

| Slot | Photographer | Source |
|---|---|---|
| `hero` | Gilberto Olimpio | [A person swimming in the sea](https://www.pexels.com/photo/a-person-swimming-in-the-sea-8050362/) |
| `hero-portrait` | Gilberto Olimpio | Same negative as `hero`, cropped 3/4 |
| `place` | AXP Photography | [Town at sunset](https://www.pexels.com/photo/mykonos-town-at-sunset-16563672/) |
| `table` | Keegan Checks | [Mediterranean feast](https://www.pexels.com/photo/delicious-mediterranean-feast-in-tanzania-34104575/) |
| `room-bed` | Akva Mushka | [Striped light on bed sheet](https://www.pexels.com/photo/black-and-white-close-up-of-a-striped-bed-sheet-14567693/) |
| `room-niche` | Ricardo Cacho | [Bed in a plastered room](https://www.pexels.com/photo/bed-in-a-hotel-room-15303766/) |
| `room-courtyard` | Ayşegül Aytören | [Blue gate beside a tree](https://www.pexels.com/photo/a-blue-steel-gate-beside-a-tree-13458950/) |
| `room-terrace` | George Zografidis | [Chairs and tables on a terrace](https://www.pexels.com/photo/chairs-and-tables-on-terrace-on-sea-shore-17285308/) |

## Licence

Used under the [Pexels License](https://www.pexels.com/license/): free for
commercial use, modification permitted, and **attribution is optional** —
"giving credit to the photographer or Pexels is not necessary but always
appreciated." Credited above anyway, as good practice.

The licence restrictions that bear on this project: no unaltered resale, no
implied endorsement by the people depicted, no redistribution to competing
stock platforms, and imagery may not form part of a trade mark or business
name. Photographs here are page content only — the wordmark is type, not a
photograph — so all four are satisfied.

## How these were chosen

Candidates were pulled via the Pexels API using each slot's `direction` field
from `src/lib/property.config.ts` as the search basis, across three to five
query angles per slot. Roughly 310 unique candidates were rendered as contact
sheets and judged against the brief in [ART-DIRECTION.md](./ART-DIRECTION.md).

Two slots — `table` and `room-niche` — were re-queried with a second, darker
and more interior-weighted set of angles after the first pass returned bright
styled flat-lays and generic hotel rooms, which the brief rules out explicitly.

## The hero is one negative, cut twice

`hero` and `hero-portrait` are the same photograph. The wide cut is anchored to
the **top** of the plate rather than attention-cropped: attention selects for
detail, which here meant the water, and it discarded the ochre sky band and the
headland silhouette that carry the whole palette. The portrait cut is
attention-based, which drops it into the water and keeps the two surfers at a
readable size on a phone.

Cutting both from one negative is also what makes the breakpoints read as one
moment. An earlier pass paired the wide dawn frame with a separate emerald
aerial; the grades did not match and the switch was visible on resize.

## Honest limitations

**`room-bed` is cool, not warm.** ART-DIRECTION asks for warm ochre against
cold Atlantic. This frame is the best match in the library for the brief's
defining element — hard parallel stripes of light across linen — but its cast
is grey. It was left ungraded rather than tinted warm, because inventing a
colour temperature the negative never had is how the previous AI-generated set
went wrong.

**`room-niche` is not a Moroccan guest house.** No stock library has a
lime-plaster room on the Souss coast. This is a real plastered interior with an
arched window, which is closer than the material study it replaces, but it is
not the property. The slot can also be left unbound — `PhotoPlate` renders the
art-direction brief instead, which is a designed behaviour.

**`place` is deliberately not Morocco.** The frame it replaces was shot in
Taghazout, which meant a fictional property was illustrated with a real
village's real businesses. This one reads as the right kind of coast without
documenting anyone's actual street.

**The rooms are still not the property.** For a real client deliverable, every
room slot should be replaced with commissioned photography of the actual house.
Stock interiors presented as bookable rooms are misleading regardless of
licence.
