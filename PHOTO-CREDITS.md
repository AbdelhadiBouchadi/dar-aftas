# Photography credits

Every frame on the site is **client photography of Maghrib Nomads**, collected
by hand into `intake/maghrib-nomads/photos/` (45 frames, from their Instagram
grid and their Booking.com listing) and processed to the ratios the layout
reserves. No stock, no AI generation — both were used in the earlier Dar Aftas
demo and both are gone.

Sources are stored at `src/assets/photos/*.webp` and `public/hero/*`
(pre-encoded AVIF/WebP/JPEG for the art-directed hero). Machine-readable:
`src/assets/photos/CREDITS.json`.

| Slot | Ratio | Frame | Source |
|---|---|---|---|
| `hero` | 21/9 | The line-up: five beginners sitting on their boards between sets | `652003027.jpg` |
| `hero-portrait` | 3/4 | Building the beach fire at sundown, Atlantic behind | `651747141.jpg` |
| `place` | 3/2 | Boards upright on Tamraght beach, village stacked on the hill behind | `651747187.jpg` |
| `table` | 16/9 | The ring of faces around the fire bowl, firelight only | `651747176.jpg` |
| `stay-surf` | 4/5 | Floral longboard carried past the loaded pickups, whale mural behind | `651747007.jpg` |
| `stay-yoga` | 4/5 | Tree pose on wet sand in half-peeled wetsuits | `652002985.jpg` |
| `stay-house` | 4/5 | Berber blanket on a made bed, straw hats on the wall | `651746992.jpg` |
| `stay-trip` | 4/5 | Dinner laid on a rug in the dunes, camel train on the ridge | `651747316.jpg` |

## How these were chosen

All 45 frames were rendered as labelled contact sheets and scanned, then the
finalists were opened at full resolution — a 300px thumbnail cannot tell you
whether a top half is clean enough to hold a wordmark, or whether a burnt-in
caption sits inside the crop.

The library is roughly two thirds Booking.com room interiors (white walls,
wicker sun discs, platform beds) and one third Instagram experience shots. The
interiors are competent and nearly interchangeable; the experience shots carry
the whole brand, so the selection leans hard on them and spends exactly one
slot on a room.

**The hero was the constrained choice.** Only nine frames in the set are
landscape at all, and only one is a wide ocean frame with a top half empty
enough to set type over: `652003027`. Its 21/9 centre crop drops the horizon
entirely, which turns out to be the making of it — the result is open water as
ground, surfers low in the frame, and a clean band of sea exactly where the
wordmark lands. The bottom-left type zone falls on flat water.

`table` is the one crop that is not centred. Centring a 16/9 window on a square
frame decapitated the ring of people behind the fire, so it is offset 48px up.

`stay-surf` had an Instagram caption burnt into the bottom of the frame; the
4/5 centre crop removes it. Worth checking for on any frame added later — several
others in the intake set have them.

## Honest limitations

**Resolution is the real ceiling, and it is low.** These arrived through
Instagram and Booking.com, so the largest frame in the entire set is 1024px on
the long edge and most are 576px. After cropping, the hero is **1024×439** and
it is the full-bleed LCP element on every visit. `HeroPicture` therefore
declares candidates at 640w/1024w and stops — an upscale to the old 2800w
descriptor would invent no detail and lie to the browser's selection algorithm.
On a large desktop display the hero **is** visibly soft. The film grain and the
two-part scrim carry it at normal viewing distance, and it is fine for a pitch,
but a real shoot is the only fix and should be the first line of any proposal.

**`stay-trip` and the dunes are not Tamraght.** That frame is from one of their
Saharan day trips, roughly a day's drive inland, and it is used in the section
that describes exactly that. It should not be allowed to migrate into a slot
that implies it is the view from the house.

**The rooms are undersold.** The intake never captured room names, counts or
rates from the Booking.com "Info & prices" tab, so the section sells packages
instead and spends one frame on the house. If room-level detail arrives later
there is plenty of interior photography here to support it.
