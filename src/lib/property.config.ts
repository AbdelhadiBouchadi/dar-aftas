import type { PropertyConfig } from "@/lib/types";

/**
 * ============================================================================
 *  THE ONLY FILE A NEW CLIENT NEEDS.
 * ============================================================================
 *
 * This site is a template for small hospitality on the Agadir coast — surf
 * camps, guest houses, riads and lodges from Anza north to Imsouane. Everything
 * that identifies a property lives in this object: the name, the coastline the
 * live almanac reads from, the rooms, the breaks, and every line of section
 * copy. No component holds a property-specific string.
 *
 * To pitch a new prospect:
 *
 *   1. Edit `identity` — name, wordmark, contact, url.
 *   2. Edit `coast` — the real latitude/longitude of the house, and the bearing
 *      its shore faces. The almanac band retargets itself; nothing else to do.
 *   3. Edit `rooms` and `breaks` to what they actually have and actually surf.
 *   4. Rewrite the copy blocks in their voice.
 *   5. Drop photography into `src/assets/photos/` against the slot ids in
 *      `@/lib/photos`. Unbound slots render their art-direction brief, so an
 *      unshot property is still presentable.
 *
 * The demo property below — Dar Talwit — is deliberately fictional and
 * deliberately not tied to one village. It sits in Taghazout Bay because that
 * is the middle of the coast, and its rooms and breaks are named across the
 * whole stretch, so any prospect between Anza and Imsouane can see their own
 * house in it.
 */
export const PROPERTY: PropertyConfig = {
  identity: {
    name: "Dar Talwit",
    wordmark: "TALWIT",
    tagline: "Guest house & surf — Taghazout Bay",
    /**
     * Amazigh for calm/tranquility — attested in Kabyle lexicography; the
     * cognate is shared across the Amazigh family. Deliberately says "Amazigh"
     * rather than "Tachelhit": the narrower attribution is not verified, and
     * this string ships as a factual claim on a public page. Chosen because a
     * condition names the whole coast, not one village.
     */
    provenance:
      "Talwit — Amazigh for the calm: the flat hour at dusk when the wind drops and the water goes to oil.",
    description:
      "A six-room guest house on the Taghazout Bay coast, Morocco. The house keeps the ocean's hours: swell, tide and first light decide the day.",
    location: "Taghazout Bay, Agadir Ida-Outanane, Morocco",
    locality: "Taghazout",
    region: "Souss-Massa",
    countryCode: "MA",
    country: "Morocco",
    coordinates: "30.5683° N, 9.7346° W",
    email: "hello@dartalwit.ma",
    phone: "+212 6 00 00 00 00",
    url: "https://dartalwit.ma",
  },

  /**
   * Taghazout Bay. The points along this stretch look roughly due west, which
   * puts the land at 90° — the reciprocal the wind classifier measures against.
   *
   * The point is deliberately set just off the shoreline rather than on a plot.
   * `layout.tsx` publishes this as `LodgingBusiness` structured data, and a
   * fictional business must not assert itself at a real address. Being a little
   * offshore also suits the marine model the almanac reads from. A real client
   * replaces this with their actual position.
   */
  coast: {
    latitude: 30.5683,
    longitude: -9.7346,
    coastFacingDegrees: 270,
  },

  seo: {
    keywords: [
      "Taghazout guest house",
      "surf camp Morocco",
      "Taghazout Bay boutique hotel",
      "Agadir surf accommodation",
      "Imsouane surf stay",
      "Morocco surf retreat",
    ],
    amenities: ["Surf guiding", "Roof terrace", "Half board", "Board storage"],
  },

  nav: [
    { label: "The House", href: "#house" },
    { label: "Rooms", href: "#rooms" },
    { label: "The Points", href: "#points" },
    { label: "A Day", href: "#day" },
    { label: "The Table", href: "#table" },
  ],

  /**
   * Fallback almanac — representative autumn readings for this coast.
   *
   * The band is live: `getLiveAlmanacData()` in `@/lib/almanac` pulls real
   * conditions from Open-Meteo. This set renders when a source is unreachable,
   * and it is resolved per-reading, so a marine outage does not blank the wind.
   * Keep these labels in sync with the live builder — it looks fallbacks up by
   * label, and a mismatch silently prints an em dash.
   */
  almanacFallback: [
    { label: "Swell", value: "1.8", unit: "m" },
    { label: "Period", value: "14", unit: "s" },
    { label: "Direction", value: "NW 305", unit: "°" },
    { label: "Wind", value: "Offshore 8", unit: "kt" },
    { label: "Low water", value: "06:44" },
    { label: "High water", value: "12:58" },
    { label: "Sunrise", value: "07:21" },
    { label: "Sea", value: "19", unit: "°C" },
  ],

  hero: {
    subtitle:
      "Six rooms above the points at Taghazout Bay. The house keeps the ocean's hours — swell, tide and first light decide the day.",
    ogStrapline: "Six rooms above the points",
  },

  heroPhoto: {
    id: "hero",
    direction:
      "The defining frame of the site. Dawn from the cliff path: a point peeling right, offshore spray lit from behind, two surfers small in a very large ocean. Cold blue water against warm ochre rock — the entire brand palette occurring naturally. Shot wide, horizon low, room at the top for the wordmark.",
    tone: "dawn",
    ratio: "21/9",
  },

  placePhoto: {
    id: "place",
    direction:
      "The village from above at last light. Flat roofs, satellite dishes, whitewash going gold, the Atlantic filling the top third of the frame. Documentary, not aspirational — this is a working fishing coast and it should look like one.",
    tone: "dusk",
    ratio: "3/2",
  },

  manifesto: {
    eyebrow: "The House",
    statement:
      "Six rooms, one long table, and a terrace that faces the swell window.",
    body: [
      "Dar Talwit is a working guest house, not a resort. The building is old coast — thick walls, lime-washed tadelakt, a stair that climbs to the roof where everyone ends up at six in the evening. We rebuilt it slowly, with masons who had spent thirty years on mosque walls inland and had opinions about every one of ours, using the materials the coast already had.",
      "There is no schedule pinned to the wall. There is a tide table. Breakfast is whenever the morning session ends, and it is still hot when you get back, because the kitchen has been watching the water too.",
    ],
    pullQuote:
      "There is no schedule pinned to the wall. There is a tide table.",
  },

  roomsCopy: {
    eyebrow: "Rooms",
    title: "Six rooms, each named for a piece of this coast.",
    footnote:
      "Rates are per room per night and include breakfast, dinner at the long table, and boards. Two remaining rooms — Tamraght and Imsouane — are held for longer stays and shown on request.",
  },

  rooms: [
    {
      id: "anza",
      name: "Anza",
      meaning: "For the black-sand beach where the coast road leaves Agadir",
      sleeps: 2,
      aspect: "Sea-facing, first floor",
      details: [
        "Tadelakt bathroom, poured and polished by hand",
        "Bed set to catch the offshore through the shutters",
        "Private terrace, two chairs, no table — deliberate",
      ],
      nightlyFrom: 180,
      photo: {
        id: "room-bed",
        direction:
          "Morning. Low sun through half-closed cedar shutters, hard stripes of light across a linen bed. Wet wetsuit hanging on the terrace rail, just in frame.",
        tone: "dawn",
        ratio: "4/5",
      },
    },
    {
      id: "imouran",
      name: "Imouran",
      meaning: "For the bay north of the village that goes glassy at dawn",
      sleeps: 2,
      aspect: "Corner room, second floor",
      details: [
        "Two aspects — sunrise over the hills, sunset on the water",
        "Deep window seat cut into a metre of wall",
        "Berber wool blanket off the Tuesday souk, beaten soft over ten winters",
      ],
      nightlyFrom: 210,
      photo: {
        id: "room-niche",
        direction:
          "Interior, late afternoon. Wide shot showing both windows at once. Warm plaster, cool ocean light — the whole palette in one frame.",
        tone: "interior",
        ratio: "3/2",
      },
    },
    {
      id: "imi-ouaddar",
      name: "Imi Ouaddar",
      meaning: "For the fishing village up the coast and its long empty sand",
      sleeps: 3,
      aspect: "Garden level, argan courtyard",
      details: [
        "Opens onto the courtyard and its one old argan tree",
        "Coolest room in the house through August",
        "Board rack at the door, rinse tap outside it",
      ],
      nightlyFrom: 165,
      photo: {
        id: "room-courtyard",
        direction:
          "Courtyard at midday. Argan tree throwing dappled shade on lime plaster. Three boards on the rack. Shot from inside the doorway looking out, so the room frames the light.",
        tone: "noon",
        ratio: "4/5",
      },
    },
    {
      id: "tamri",
      name: "Tamri",
      meaning: "For the river mouth an hour north, and the bananas behind it",
      sleeps: 4,
      aspect: "Roof suite, full terrace",
      details: [
        "Whole top floor, private stair, outdoor shower",
        "Terrace of forty square metres facing due west",
        "The only room you can watch the sets from, in bed",
      ],
      nightlyFrom: 340,
      photo: {
        id: "room-terrace",
        direction:
          "Golden hour on the roof terrace. Low furniture, long shadows, the ocean as a hard horizontal band behind. One person, small in frame, looking at the water — never at camera.",
        tone: "dusk",
        ratio: "3/2",
      },
    },
  ],

  pointsCopy: {
    eyebrow: "The Points",
    title: "Most of the coast inside half an hour, and the rest worth the drive.",
    intro:
      "Seven breaks we actually use, roughly in the order we tend to reach for them. Which one you surf on any given morning is decided the night before, by the buoy — not by us.",
    trackLabel: "Surf breaks near the house",
  },

  breaks: [
    {
      id: "anchor-point",
      name: "Anchor Point",
      hand: "Right",
      level: "Advanced",
      minutesAway: 5,
      worksOn: "NW 2–4m, 12s+",
      note: "The wave that put this coast on the map. Four sections, and on the right day it joins them all the way to the boulders. Crowded by eight — which is why we leave at six.",
    },
    {
      id: "panoramas",
      name: "Panoramas",
      hand: "Right",
      level: "Intermediate",
      minutesAway: 7,
      worksOn: "NW 1–2.5m, any period",
      note: "Softer point break over sand and rock, between Taghazout and Tamraght. Where our guiding happens most mornings. Forgiving take-off, long wall, easy paddle back.",
    },
    {
      id: "banana",
      name: "Banana Point",
      hand: "Right",
      level: "Beginner",
      minutesAway: 11,
      worksOn: "NW 0.8–2m, low tide",
      note: "Where first-timers stand up, below Aourir. Sandy bottom, slow shoulder, and the plantations behind it that give it the name.",
    },
    {
      id: "boilers",
      name: "Boilers",
      hand: "Right",
      level: "Advanced",
      minutesAway: 14,
      worksOn: "NW 2–4m, high tide",
      note: "Fast reef wave over urchins, marked by the rusted boiler of a wrecked ship. Boots on. Not a beginner's wave on any day of the year.",
    },
    {
      id: "imi-ouaddar",
      name: "Imi Ouaddar",
      hand: "Right",
      level: "Intermediate",
      minutesAway: 20,
      worksOn: "NW 1–3m, mid tide",
      note: "Point and beach break sharing one bay, twenty minutes north. Half the crowd of Taghazout for two thirds of the wave, and the fish at the village is the reason to stay past the session.",
    },
    {
      id: "tamri",
      name: "Tamri",
      hand: "Right",
      level: "Advanced",
      minutesAway: 35,
      worksOn: "NW 2.5–5m, low to mid",
      note: "The river mouth that holds size when everything south of it has closed out. Cold, exposed, and the first place we look when the chart turns properly dark.",
    },
    {
      id: "imsouane",
      name: "Imsouane",
      hand: "Right",
      level: "Beginner",
      minutesAway: 70,
      worksOn: "NW 1–3m, all tides",
      note: "The Bay — arguably the longest ride in Morocco. An hour and a bit north, so we go when the forecast earns it and we make a day of it.",
    },
  ],

  dayCopy: {
    eyebrow: "A Day",
    title: "The tide writes the timetable.",
    intro:
      "An ordinary Tuesday in October, which is to say the best month here. Nothing on this list is compulsory, including the six-twelve.",
    footnote: "Times shown for October · sunrise shifts ~90 min across the season",
  },

  day: [
    {
      time: "06:12",
      title: "First light",
      body: "Coffee on the terrace in the dark, the kind you can stand a spoon in. Someone reads the buoy out loud. The van leaves at twenty past whether or not you are in it.",
    },
    {
      time: "06:40",
      title: "Dawn patrol",
      body: "Five minutes to the point, or half an hour north if the chart says so. Two hours before the crowd, three before the wind. This is the session the whole house is organised around.",
    },
    {
      time: "09:30",
      title: "The long table",
      body: "Msemen, eggs from the smallholding over the ridge, argan oil from the women's co-operative up the valley, amlou, and a flat bread that never quite makes it to the middle of the table.",
    },
    {
      time: "11:00",
      title: "The flat hours",
      body: "The wind comes onshore and the day opens up. Hammam, the Tuesday souk inland, or nothing at all on the roof, which is the correct answer.",
    },
    {
      time: "16:30",
      title: "Evening glass",
      body: "The wind drops and the water goes to oil for ninety minutes. Shorter session, softer light, fewer people. Boards are back on the rack by sunset.",
    },
    {
      time: "19:45",
      title: "Dinner, one sitting",
      body: "One menu, one time, one table. Tagine of the day from the market, and whatever the boats landed at the harbour that afternoon.",
    },
  ],

  table: {
    eyebrow: "The Table",
    statement: "One menu. One sitting. Whatever the boats brought in.",
    body: [
      "We do not run a restaurant. We run a table, and you are at it. Dinner is a single seating at a quarter to eight, cooked by Izza, who fed the masons through the whole rebuild and stayed on when the first guests turned up.",
      "The fish comes off the boats at the harbour below, chosen the same afternoon it is cooked. The vegetables come from the Tuesday souk inland — whatever is stacked highest that morning, which in October means tomatoes. The oil is argan, pressed cold by a women's co-operative up the valley, and it is on the table at every meal including breakfast.",
    ],
    photo: {
      id: "table",
      direction:
        "Overhead, dusk, warm lamplight only. A long table mid-meal — hands reaching, bread torn, tagine open and steaming. Deliberately imperfect: spills, crumbs, mismatched glasses. Never styled flat-lay.",
      tone: "dusk",
      ratio: "16/9",
    },
    facts: [
      { label: "Dinner", value: "19:45" },
      { label: "Sittings", value: "One" },
    ],
  },

  enquire: {
    eyebrow: "Stay",
    title: "Write to us. We answer the same day.",
    body: "Tell us when you are thinking of coming and how much of the water you want. We will tell you honestly what the swell tends to do that week, and whether the house is the right one for you.",
    notes: [
      {
        label: "Minimum stay",
        body: "Three nights, or five over Christmas and New Year.",
      },
      {
        label: "Getting here",
        body: "Agadir Al Massira (AGA) is fifty minutes by road. We arrange the transfer.",
      },
      {
        label: "Best swell",
        body: "October to March. September and April are quieter and still good.",
      },
    ],
  },
};
