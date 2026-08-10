import type { PropertyConfig } from "@/lib/types";

/**
 * ============================================================================
 *  THE ONLY FILE A NEW CLIENT NEEDS.
 * ============================================================================
 *
 * This site is a template for small hospitality on the Agadir coast — surf
 * camps, guest houses, riads and lodges from Anza north to Imsouane. Everything
 * that identifies a property lives in this object: the name, the coastline the
 * live almanac reads from, the stays, the breaks, and every line of section
 * copy. No component holds a property-specific string.
 *
 * To pitch a new prospect:
 *
 *   1. Edit `identity` — name, wordmark, contact, url.
 *   2. Edit `coast` — the real latitude/longitude of the house, and the bearing
 *      its shore faces. The almanac band retargets itself; nothing else to do.
 *   3. Edit `stays` and `breaks` to what they actually sell and actually surf.
 *   4. Rewrite the copy blocks in their voice.
 *   5. Drop photography into `src/assets/photos/` against the slot ids in
 *      `@/lib/photos`. Unbound slots render their art-direction brief, so an
 *      unshot property is still presentable.
 *
 * ----------------------------------------------------------------------------
 *  CURRENT OCCUPANT: Maghrib Nomads, Tamraght — a real prospect, not the demo.
 * ----------------------------------------------------------------------------
 *
 * Sourced from `intake/maghrib-nomads/data.json`. That file is a research pass,
 * not a briefing from the client, so its fields differ in how far they can be
 * trusted. Anything below that was *not* in it is marked `TO CONFIRM` at the
 * point of use. Two things are worth knowing before this goes in front of
 * Youssef:
 *
 *   - **No daily schedule was captured.** The `day` block is written copy,
 *     built to the intake's own instruction to put yoga alongside the surf.
 *     Every time in it is a proposal.
 *   - **No review quotes were captured**, only aggregate scores. So there are
 *     no testimonials here. `reviews` carries the scores with their platform
 *     and sample size, which is the version a reader can verify. Do not
 *     "fill in" guest quotes later — transcribe real ones or leave it.
 */
export const PROPERTY: PropertyConfig = {
  identity: {
    name: "Maghrib Nomads",
    /** From `wordmark_candidates`. One word, because it is set at 17rem. */
    wordmark: "NOMADS",
    tagline: "Surf camp & guest house — Tamraght",
    /**
     * Maghrib is the Arabic for the west, and for sunset — the same root names
     * this whole end of North Africa. It is a real etymology of their own name,
     * which is what this line is for.
     */
    provenance:
      "Maghrib — Arabic for the west, and for sundown: the hour, and the country it names. Nomads, because nobody here holds still for long.",
    description:
      "A surf house in Tamraght, on the Agadir coast of Morocco. Stay, surf, and the local end of the country you would not find alone — with the day's session, the yoga mat and the evening table all decided by the water.",
    location: "Tamraght, Agadir Ida-Outanane, Morocco 80023",
    locality: "Tamraght",
    region: "Souss-Massa",
    countryCode: "MA",
    country: "Morocco",
    coordinates: "30.5102° N, 9.6775° W",
    email: "contact@maghribnomads.com",
    /** `phone_found_search` in the intake. Maps had no listing to cross-check. */
    phone: "+212 602 474 458",
    /**
     * Their own domain. NOTE for outreach: as of the intake pass this URL
     * bounced through a bot-check to an unrelated host before landing on a
     * Booking.com page that was not taking reservations. That break is the
     * pitch — verify it still reproduces before citing it.
     */
    url: "https://maghribnomads.com",
  },

  /**
   * Tamraght. The intake put the house at these coordinates, and the shore
   * along this stretch looks the same way as the rest of the bay — due west,
   * which puts the land at 90°, the reciprocal the wind classifier measures
   * against.
   */
  coast: {
    latitude: 30.5101753,
    longitude: -9.6775172,
    coastFacingDegrees: 270,
  },

  seo: {
    keywords: [
      "Tamraght surf camp",
      "surf camp Morocco",
      "surf and yoga Morocco",
      "Agadir surf accommodation",
      "Taghazout Bay surf house",
      "Banana Point surf",
    ],
    /** From the Booking.com facility list plus the services the intake names. */
    amenities: [
      "Free WiFi",
      "Rooftop terrace",
      "Shared kitchen",
      "Surf guiding",
      "Yoga",
      "Day trips",
    ],
  },

  nav: [
    { label: "The House", href: "#house" },
    { label: "Stays", href: "#stays" },
    { label: "The Waves", href: "#points" },
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
      "A surf house in Tamraght, five minutes from the point. Stay, surf, and the local half of Morocco you would never find on your own.",
    ogStrapline: "Stay · Surf · Tamraght",
  },

  heroPhoto: {
    id: "hero",
    direction:
      "The defining frame of the site. The line-up at chest height: a row of beginners sitting on their boards between sets, hands up, in flat grey Atlantic light. Cold water filling the frame, no horizon, no shoreline — the ocean as ground rather than backdrop, with clean water above the heads for the wordmark.",
    tone: "ocean",
    ratio: "21/9",
  },

  placePhoto: {
    id: "place",
    direction:
      "The beach at Tamraght from the sand at mid-morning. Foam boards upright in a rough line, a lesson breaking up around them, the hills and the white village stacked behind. Documentary, not aspirational — this is a working beach and it should look like one.",
    tone: "noon",
    ratio: "3/2",
  },

  manifesto: {
    eyebrow: "The House",
    statement: "One house, one table, and a five-minute walk to the water.",
    body: [
      "Maghrib Nomads is a surf house in Tamraght, the village between Aourir and Taghazout that most people drive through on the way to somewhere more famous. Youssef runs it. The rooms are white and plain and cool, the roof is where everyone ends up, and the wifi — improbably, and to the evident relief of every guest who has ever scored it — is faultless.",
      "What is actually being sold here is not a bed. It is a week of somebody local deciding, each morning, which of six breaks is worth your time, and a table you eat at with the rest of the house afterwards.",
    ],
    pullQuote:
      "Nobody here asks what you do. They ask what the tide is doing.",
  },

  staysCopy: {
    eyebrow: "Stays",
    title: "Booked by the week, not by the night.",
    footnote:
      "Prices are the listed lead-in per person in US dollars, as published on BookRetreats, and move with the season and the room. Everything else on this page — the guiding, the yoga, the table, the trips — is arranged direct. Write to us and we will price the week you actually want.",
  },

  /**
   * The two priced entries are verbatim from `packages_found` in the intake,
   * including their prices, which is why the shorter week is the dearer one.
   * That is what the listing says; it is not a transcription error, and it is
   * the first thing to query with Youssef.
   *
   * The two unpriced entries are offerings the intake evidences (Booking.com
   * and Hostelworld listings; the "Daytrip" highlight and `inferred_offering`)
   * but for which no public rate was captured. They carry no number rather
   * than a guessed one.
   */
  stays: [
    {
      id: "surf-yoga-5",
      name: "5 Day Surf & Yoga",
      summary: "The one to book if you have never stood up on a board",
      nights: 5,
      level: "Beginners",
      includes: [
        "Daily lessons on the beach break, boards and suits included",
        "Yoga alongside the surf, not instead of it",
        "Bed, breakfast and the evening table",
      ],
      priceFromUsd: 469,
      priceNote: "per person, listed lead-in",
      photo: {
        id: "stay-surf",
        direction:
          "Gear and going. A guest carrying a floral longboard across the yard, pickups behind her stacked with foam boards, the whale mural on the house wall. Late morning, hard light, nobody looking at the camera.",
        tone: "noon",
        ratio: "4/5",
      },
    },
    {
      id: "yoga-surf-8",
      name: "8 Day Yoga & Surf Camp",
      summary: "A longer week, weighted toward the mat",
      nights: 8,
      level: "All levels",
      includes: [
        "Eight days of guided surf across the Tamraght and Taghazout breaks",
        "Daily yoga, on the sand when the wind allows",
        "A day inland — the valley, the souk, or the dunes",
      ],
      priceFromUsd: 409,
      priceNote: "per person, listed lead-in",
      photo: {
        id: "stay-yoga",
        direction:
          "Yoga on the beach after a session. A line of guests in half-peeled wetsuits balanced in tree pose on wet sand, the shorebreak behind them, blue mid-morning sky. Joyful and slightly ragged — not a studio.",
        tone: "noon",
        ratio: "4/5",
      },
    },
    {
      id: "room-and-board",
      name: "Bed & Board",
      summary: "The house on its own, for as long as you want it",
      level: "Any",
      includes: [
        "Private double, twin or single — all with the shared kitchen and roof",
        "Breakfast, and dinner at the table when the house is eating",
        "Board storage, rinse tap, and a lift to whichever break is working",
      ],
      priceNote: "Nightly rate on request",
      photo: {
        id: "stay-house",
        direction:
          "A room in the morning. White walls, a Berber blanket thrown across a made bed, straw hats and painted plates hung above the headboard, warm light coming through one small window. Plain, cool, and entirely real.",
        tone: "interior",
        ratio: "4/5",
      },
    },
    {
      id: "day-trips",
      name: "The Inland Days",
      summary: "For the flat spells, and the reason people extend",
      level: "Any",
      includes: [
        "Paradise Valley and the red rock pools, an hour up the river road",
        "The Tuesday souk at Aourir, and the argan co-operatives past it",
        "The long one: the dunes, and dinner on a rug as the sun goes",
      ],
      priceNote: "Arranged in the house, priced per trip",
      photo: {
        id: "stay-trip",
        direction:
          "Dinner in the dunes at sundown. A low table dressed on a red rug, shared dishes and glasses laid out, leather poufs pushed around it, a camel train crossing the ridge behind against a flat orange sun.",
        tone: "dusk",
        ratio: "4/5",
      },
    },
  ],

  /**
   * Aggregate scores only. `reviews_signal` in the intake carried no quotes, so
   * there are none here — see the file header. Counts are as at the intake pass
   * and should be refreshed before this is sent.
   */
  reviews: [
    { source: "Booking.com", score: "7.3", scale: "10", count: 74 },
    { source: "Google", score: "4.5", scale: "5", count: 58 },
    { source: "BookRetreats", score: "5.0", scale: "5", count: 7 },
  ],

  pointsCopy: {
    eyebrow: "The Waves",
    title: "Six breaks inside twenty minutes, and one worth the drive.",
    intro:
      "Tamraght sits in the middle of the best-served stretch of coast in Morocco. These are the breaks we actually use, roughly in the order we reach for them. Which one you surf on any given morning is decided the night before, by the buoy.",
    trackLabel: "Surf breaks near the house",
  },

  /**
   * Tamraght-centred, per the intake's instruction to reuse this coastline.
   * Drive times are re-measured from Tamraght rather than Taghazout — Banana
   * and Devil's Rock are on the doorstep here, and Anchor Point is not.
   */
  breaks: [
    {
      id: "banana",
      name: "Banana Point",
      hand: "Right",
      level: "Beginner",
      minutesAway: 3,
      worksOn: "NW 0.8–2m, low tide",
      note: "The village's own wave, named for the plantations behind it. Sandy bottom, slow shoulder, and the place almost everyone in this house stands up for the first time. You can walk it.",
    },
    {
      id: "devils-rock",
      name: "Devil's Rock",
      hand: "Right",
      level: "Intermediate",
      minutesAway: 5,
      worksOn: "NW 1–2.5m, mid tide",
      note: "Straight down from Tamraght, over rock and sand. Picks up more swell than Banana and empties out fast once the wind turns onshore. The default second session.",
    },
    {
      id: "panoramas",
      name: "Panoramas",
      hand: "Right",
      level: "Intermediate",
      minutesAway: 7,
      worksOn: "NW 1–2.5m, any period",
      note: "Softer point break between here and Taghazout, and where most of our guiding happens. Forgiving take-off, a long wall, and an easy paddle back that matters more than beginners expect.",
    },
    {
      id: "anchor-point",
      name: "Anchor Point",
      hand: "Right",
      level: "Advanced",
      minutesAway: 12,
      worksOn: "NW 2–4m, 12s+",
      note: "The wave that put this coast on the map. Four sections, and on the right day it joins them all the way to the boulders. Crowded by eight, which is why the van leaves at six.",
    },
    {
      id: "boilers",
      name: "Boilers",
      hand: "Right",
      level: "Advanced",
      minutesAway: 18,
      worksOn: "NW 2–4m, high tide",
      note: "Fast reef wave over urchins, marked by the rusted boiler of a wrecked ship. Boots on. Not a beginner's wave on any day of the year, and we will say so.",
    },
    {
      id: "tamri",
      name: "Tamri",
      hand: "Right",
      level: "Advanced",
      minutesAway: 40,
      worksOn: "NW 2.5–5m, low to mid",
      note: "The river mouth that holds size when everything south of it has closed out. Cold, exposed, and the first place we look when the chart turns properly dark.",
    },
    {
      id: "imsouane",
      name: "Imsouane",
      hand: "Right",
      level: "Beginner",
      minutesAway: 65,
      worksOn: "NW 1–3m, all tides",
      note: "The Bay — arguably the longest ride in Morocco. An hour north, so we go when the forecast earns it and we make a whole day of it.",
    },
  ],

  dayCopy: {
    eyebrow: "A Day",
    title: "The tide writes the timetable.",
    intro:
      "An ordinary Tuesday in October, which is to say the best month here. Nothing on this list is compulsory, including the six-thirty.",
    footnote: "Times shown for October · sunrise shifts ~90 min across the season",
  },

  /**
   * TO CONFIRM — the intake captured no schedule. This is written to its
   * instruction to run yoga alongside the surf, and every time in it is a
   * proposal. Replace wholesale with Youssef's actual day before sending.
   */
  day: [
    {
      time: "06:30",
      title: "Coffee, and the call",
      body: "Someone reads the buoy out loud on the roof while it is still dark. Banana if it is small, north if it is not. The van goes at seven whether or not you are in it.",
    },
    {
      time: "07:00",
      title: "Dawn patrol",
      body: "Three minutes to the point, or twenty up the coast if the chart says so. Two hours before the crowd and three before the wind — this is the session the whole house is arranged around.",
    },
    {
      time: "09:30",
      title: "The long table",
      body: "Msemen, eggs, olives, amlou and argan oil from the co-operative up the Tamri road, and a flat bread that never quite makes it to the middle of the table.",
    },
    {
      time: "11:30",
      title: "Mat on the roof",
      body: "Ninety minutes while the wind is wrong for the water anyway. Shoulders first, because everybody's shoulders are wrecked. On the sand instead when the morning is still.",
    },
    {
      time: "13:30",
      title: "The flat hours",
      body: "The souk at Aourir on Tuesdays, the hammam, the valley if enough people want it — or nothing at all on the roof, which is the correct answer.",
    },
    {
      time: "17:00",
      title: "Evening glass",
      body: "The wind drops and the water goes to oil for ninety minutes. Shorter session, softer light, fewer people. Boards back on the rack by sunset.",
    },
    {
      time: "20:00",
      title: "Dinner, one sitting",
      body: "One pot, one time, one table. Tagine of the day from the market, and afterwards the fire on the beach for whoever is still standing.",
    },
  ],

  table: {
    eyebrow: "The Table",
    statement: "One pot. One sitting. Then the fire.",
    body: [
      "We do not run a restaurant. We run a table, and you are at it. Dinner is a single seating, cooked in the house, and it is the reason people who booked five nights are still here on the twelfth.",
      "The vegetables come from the Tuesday souk at Aourir and the fish from the harbour down the coast, chosen the same afternoon. Afterwards somebody carries wood down to the sand, and the evening ends where the day started — looking at the water, in the dark, arguing about the forecast.",
    ],
    photo: {
      id: "table",
      direction:
        "Night, firelight only. A ring of guests sitting around a fire bowl on the sand, faces half-lit, two more close in the foreground. No flash, no styling — the light source is in the frame and everything else falls off to black.",
      tone: "dusk",
      ratio: "16/9",
    },
    facts: [
      { label: "Dinner", value: "20:00" },
      { label: "Sittings", value: "One" },
    ],
  },

  enquire: {
    eyebrow: "Stay",
    title: "Write to us. We answer the same day.",
    body: "Tell us when you are thinking of coming and how much of the water you want. We will tell you honestly what the swell tends to do that week, which of the packages actually fits, and whether this is the right house for you.",
    reviewsLabel: "Scored by the people who came",
    notes: [
      {
        label: "Getting here",
        body: "Agadir Al Massira (AGA) is forty minutes by road. We arrange the transfer.",
      },
      {
        label: "Best swell",
        body: "October to March. September and April are quieter and still good.",
      },
      {
        label: "Also listed on",
        body: "Booking.com, Hostelworld and BookRetreats — though it is cheaper and easier to write to us directly.",
      },
    ],
  },
};
