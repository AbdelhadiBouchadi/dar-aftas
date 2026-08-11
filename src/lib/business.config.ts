import type { BusinessConfig } from "@/lib/types";

/**
 * ============================================================================
 *  THE ONLY FILE A NEW CLIENT NEEDS.
 * ============================================================================
 *
 * This site is a template for small owner-run tourism on the Agadir coast —
 * excursion operators, rental fleets, guides and guest houses from Anza north
 * to Imsouane. Everything that identifies a business lives in this object: the
 * name, the position the live conditions band reads from, the fleet, the
 * routes, and every line of section copy. No component holds a
 * business-specific string.
 *
 * To pitch a new prospect:
 *
 *   1. Edit `identity` — name, wordmark, contact, url.
 *   2. Edit `terrain` — the real latitude/longitude of the base. The conditions
 *      band retargets itself; nothing else to do.
 *   3. Edit `fleet` and `routes` to what they actually rent and actually ride.
 *   4. Rewrite the copy blocks in their voice.
 *   5. Drop photography into `src/assets/photos/` against the slot ids in
 *      `@/lib/photos`. Unbound slots render their art-direction brief, so an
 *      unshot business is still presentable.
 *
 * ----------------------------------------------------------------------------
 *  CURRENT OCCUPANT: MayaQuad, Imi Ouaddar — a real prospect, not the demo.
 * ----------------------------------------------------------------------------
 *
 * Sourced from `intake/mayaquad/data.json`. That file is a research pass, not a
 * briefing from the client, so its fields differ in how far they can be
 * trusted. Anything below that was *not* in it is marked `TO CONFIRM` at the
 * point of use. Four things are worth knowing before this goes in front of
 * them:
 *
 *   - **The routes are proposed, not given.** The intake names three areas the
 *     business rides (Tamraght, Imi Ouaddar, Taghazout) but no named routes.
 *     Every entry in `routes` is built from real local geography and is a
 *     proposal to be corrected, not a transcription. See the block comment there.
 *   - **The ride timeline is written copy.** No excursion structure was
 *     captured. `ride` is a proposal in the same way.
 *   - **No aggregate review scores exist in the intake** — only that multiple
 *     five-star Google reviews were reposted to Instagram. So `sentiment`
 *     paraphrases themes in our own words and says so on the page. Do not
 *     "upgrade" it later into quotations attributed to named reviewers; that
 *     text is theirs, not ours. See `Sentiment` in `@/lib/types`.
 *   - **The pitch is the broken site.** `mayaquadagency.com` is live and
 *     rendering as unstyled HTML — the Elementor stylesheet 404s. Re-verify it
 *     still reproduces before citing it in outreach.
 */
export const BUSINESS: BusinessConfig = {
  identity: {
    name: "MayaQuad",
    /** From `wordmark_candidates`. One word, because it is set at hero scale. */
    wordmark: "MAYAQUAD",
    tagline: "Quad & buggy excursions — Imi Ouaddar",
    /**
     * TO CONFIRM — the origin of "Maya" is not in the intake and is not
     * guessed at here. This line is about the place instead, which is
     * documented: `imi` is the Tamazight for a mouth or an opening, the word
     * that names half the river valleys on this coast.
     */
    provenance:
      "Imi Ouaddar — the mouth of the valley, in Tamazight. Twenty-seven kilometres north of Agadir, where the tarmac stops mattering and the pistes start.",
    description:
      "Quad and buggy excursions from Imi Ouaddar, twenty-seven kilometres north of Agadir. Insured machines, two up, a guide who knows which riverbed is dry — and dunes, argan forest and Atlantic coast track inside an hour of the door.",
    location: "Imi Ouaddar, 27 km north of Agadir, Morocco",
    locality: "Imi Ouaddar",
    region: "Souss-Massa",
    countryCode: "MA",
    country: "Morocco",
    /**
     * TO CONFIRM — approximate, derived from the intake's "27 km north of
     * Agadir, on the road to Essaouira". Good enough for a forecast (the
     * weather does not change across a kilometre) and printed to four decimals
     * only because the footer sets it in tabular figures. Get the real pin
     * before this is treated as an address.
     */
    coordinates: "30.6333° N, 9.7333° W",
    /** TO CONFIRM — intake gives this, but note the live site is on a *different* domain. */
    email: "contact@mayaquad.com",
    phone: "+212 6 93 96 93 96",
    /**
     * Their live domain, and the reason for the pitch: as of the intake pass it
     * serves the page as raw unstyled HTML — 22 console errors, 31 warnings,
     * the theme stylesheet never loads. This is not an expired domain; it is a
     * working business with a broken shopfront.
     */
    url: "https://mayaquadagency.com",
  },

  /**
   * Imi Ouaddar. See the `coordinates` note above — these are the same
   * approximate position, and they are what the conditions band queries.
   */
  terrain: {
    latitude: 30.6333,
    longitude: -9.7333,
  },

  seo: {
    keywords: [
      "quad biking Agadir",
      "buggy rental Taghazout",
      "quad excursion Imi Ouaddar",
      "ATV Morocco Agadir",
      "scooter hire Taghazout",
      "guided moto tours Morocco",
    ],
    /** From the services the intake names, plus the access detail it flags. */
    features: [
      "Insured machines",
      "Guided excursions",
      "Helmets and goggles provided",
      "Two riders per machine",
      "Night rides",
      "Reachable by public bus",
    ],
  },

  nav: [
    { label: "Who We Are", href: "#about" },
    { label: "The Fleet", href: "#fleet" },
    { label: "The Routes", href: "#routes" },
    { label: "The Ride", href: "#ride" },
    { label: "After Dark", href: "#night" },
  ],

  /**
   * Fallback conditions — representative late-summer readings for this coast.
   *
   * The band is live: `getLiveConditions()` in `@/lib/conditions` pulls real
   * readings from Open-Meteo's forecast API. This set renders when the source
   * is unreachable, and it is resolved per-reading, so one missing field does
   * not blank the row. Keep these labels in sync with the live builder — it
   * looks fallbacks up by label, and a mismatch silently prints an em dash.
   */
  conditionsFallback: [
    { label: "Air", value: "27", unit: "°C" },
    { label: "Feels", value: "29", unit: "°C" },
    { label: "Wind", value: "NNE 11", unit: "kt" },
    { label: "Gusts", value: "18", unit: "kt" },
    { label: "Visibility", value: "24", unit: "km" },
    { label: "UV", value: "8" },
    { label: "Golden hour", value: "18:57" },
    { label: "Sunset", value: "19:42" },
  ],

  hero: {
    subtitle:
      "Quads and buggies out of Imi Ouaddar, twenty-seven kilometres north of Agadir. Insured, two up, and pointed at country you cannot reach in a hire car.",
    ogStrapline: "Quad · Buggy · Imi Ouaddar",
    conditionsLabel: "Out there now",
  },

  /**
   * BOUND — see `@/lib/photos` and `HeroPicture`. The direction below describes
   * the frame that is actually on the page, not one still to be shot: briefs
   * and photographs have to agree, or the brief stops being a spec and becomes
   * a stale note.
   */
  heroPhoto: {
    id: "hero",
    direction:
      "The defining frame of the site. A line of quads riding away up a dusty piste, lead rider in an orange helmet, argan trees and a dry ridge stacked behind, the village just visible off the right of the track. Ochre on ochre, with open cloud across the top third for the wordmark.",
    tone: "dust",
    ratio: "21/9",
  },

  /** BOUND — `place.webp`, 2048×1365. */
  placePhoto: {
    id: "place",
    direction:
      "The stop, not the ride. Two riders in sunglasses standing in low evening sun in front of a roofless stone building, dry hillside behind, rubble and cane underfoot. Documentary and unposed — this is the sort of place the tarmac does not reach.",
    tone: "dusk",
    ratio: "3/2",
  },

  manifesto: {
    eyebrow: "Who We Are",
    statement: "Everything worth seeing here is off the tarmac.",
    body: [
      "MayaQuad runs quads and buggies out of Imi Ouaddar, the village twenty-seven kilometres north of Agadir that most people pass at seventy on the way to Essaouira. Behind it the argan hills go back a long way, the riverbeds run dry most of the year, and none of it is reachable in a hire car with a deposit on it.",
      "What we sell is not really a machine. It is somebody who already knows which riverbed is dry this week, which track the wind has filled in, and where to stop so the light is behind you. The machine is how you get there. The helmets, the goggles and the insurance are not extras — they are the price.",
    ],
    pullQuote: "Clean clothes were a bad idea.",
  },

  fleetCopy: {
    eyebrow: "The Fleet",
    title: "Priced by the hour, insured by default.",
    footnote:
      "Rates are per machine per hour in dirham, and every machine carries two. Helmets, goggles, gloves and insurance are included in all of them — there is no version of this where you pay extra to be covered. Longer excursions, private groups and airport-side pickups are priced on the day. Message us and we will quote the ride you actually want.",
  },

  /**
   * Prices are verbatim from `services_and_packages` in the intake — quoted
   * there as ranges ("200-300 DH per hour"), so the lead-in is the bottom of
   * the range and `priceNote` carries the top. Scooter hire and the guided moto
   * tours are evidenced services with no captured rate, so they carry no number
   * rather than a guessed one.
   */
  fleet: [
    {
      id: "quad",
      name: "The Quad",
      summary: "The one almost everybody takes, and the one to learn on",
      seats: 2,
      suits: "First time out",
      includes: [
        "Helmet, goggles and gloves — included, not rented separately",
        "Insured, and a briefing on flat ground before we go anywhere",
        "Two up on one machine, or one each if you would rather",
      ],
      priceFromMad: 200,
      priceNote: "to 300 DH per hour, for two, insured",
      /** BOUND — `fleet-quad.webp`, 1096×1370. */
      photo: {
        id: "fleet-quad",
        direction:
          "A single red quad stopped on a loose stone track, rider still on it in a full-face helmet, one hand on the bar. Argan scrub filling the background, hard midday sun. The machine reads clearly — this frame has to show what you are actually renting.",
        tone: "noon",
        ratio: "4/5",
      },
    },
    {
      id: "buggy",
      name: "The Buggy",
      summary: "Two seats, a roll cage, and considerably less dignity",
      seats: 2,
      suits: "Anyone who wants a roof over the argument",
      includes: [
        "Side by side, so you can both see what you are about to hit",
        "Helmets and full insurance, same as the quads",
        "The better choice for the dune sections and for families",
      ],
      priceFromMad: 400,
      priceNote: "to 500 DH per hour, for two, insured",
      /** BOUND — `fleet-buggy.webp`, 1216×1520. */
      photo: {
        id: "fleet-buggy",
        direction:
          "Close in on the buggy at a stop, shot across the bonnet. Three riders in full-face helmets and goggles around the roll cage, one at the wheel. Dry scrub behind, blown highlights. The gear is the subject as much as the machine is.",
        tone: "noon",
        ratio: "4/5",
      },
    },
    {
      id: "scooter",
      name: "Scooters",
      summary: "For the days you just want the coast road and no plan",
      seats: 2,
      suits: "Licence holders",
      includes: [
        "By the day or by the week, fuelled and checked over",
        "Helmets included",
        "The village, the beaches north, and Taghazout in twenty minutes",
      ],
      priceNote: "Rate on request — ask for the weekly",
      /**
       * BOUND — `fleet-scooter.webp`, 1358×1698.
       *
       * Not a scooter: the client set has no photograph of one. This is the
       * destination instead, which is what the copy beside it actually sells —
       * "Taghazout in twenty minutes". A sign the riders themselves have
       * stickered is a truer picture of that twenty minutes than a stock
       * scooter would be. A machine frame is still worth asking for.
       */
      photo: {
        id: "fleet-scooter",
        direction:
          "The road sign at the edge of Taghazout in the last of the sun — Arabic, Tifinagh and Latin, half-covered in surf stickers and tags, parked cars and palms falling away behind it. Documentary and unprecious. The place, not the machine.",
        tone: "dusk",
        ratio: "4/5",
      },
    },
    {
      id: "moto-tours",
      name: "Guided Moto Tours",
      summary: "A longer day, on two wheels, with somebody in front who knows",
      suits: "Experienced riders",
      includes: [
        "Full day or multi-day, routed around your level and not ours",
        "A lead rider who has ridden all of it in every season",
        "Fuel stops, lunch and the way back planned before you set off",
      ],
      priceNote: "Priced per route — tell us how many days you have",
      /**
       * BOUND — `fleet-moto.webp`, 1116×1395.
       *
       * The only frame in the whole client set carrying no logo, no headline
       * and no price panel — and the only one that is purely country. It is a
       * 720px phone capture upscaled and sharpened, which is why it is here
       * rather than in a slot that renders wider.
       */
      photo: {
        id: "fleet-moto",
        direction:
          "The ground, not the machine. A stony track climbing a dry riverbed between two palms, a thin run of water in the channel alongside, scrub and dry hills closing in. Distance in the frame — this one is about how far it goes.",
        tone: "noon",
        ratio: "4/5",
      },
    },
  ],

  /**
   * Paraphrase, in our words, of themes that recur in the public reviews the
   * intake saw reposted to Instagram. Read the `Sentiment` doc comment in
   * `@/lib/types` before touching this block — the constraint it encodes is the
   * reason it is shaped this way and not as testimonials.
   */
  sentiment: [
    {
      theme: "The guiding",
      body: "The thing people mention first is not the machines — it is that somebody rode in front and picked the line, and that nervous first-timers were given room to be nervous.",
      source: "Recurring theme in their Google reviews",
    },
    {
      theme: "Safety",
      body: "Gear and insurance come up repeatedly as included and non-negotiable rather than upsold at the counter, which is not universal on this coast.",
      source: "Recurring theme in their Google reviews",
    },
    {
      theme: "The welcome",
      body: "Reviewers write about being looked after before and after the ride as much as during it — the tea, the lift, the not-being-rushed.",
      source: "Recurring theme in their Google reviews",
    },
  ],

  routesCopy: {
    eyebrow: "The Routes",
    title: "Coast, forest, riverbed and dune, inside an hour.",
    intro:
      "Imi Ouaddar sits where four different kinds of ground meet, which is the whole reason the business is here and not in Agadir. These are the rides we reach for, roughly shortest first. Which one you get depends on the wind, the light, and how you looked on the flat ground.",
    trackLabel: "Routes ridden from Imi Ouaddar",
    bestAtLabel: "Best at",
  },

  /**
   * TO CONFIRM — ALL SIX.
   *
   * The intake names the areas ridden ("Tamraght, Imi Ouaddar, and Taghazout")
   * and nothing more granular. Every route below is built from real, checkable
   * geography around the base — Cap Ghir and its lighthouse, the Tamri river
   * mouth and its banana plantations, the argan forest inland of Taghazout,
   * Paradise Valley up the Tamraght road — but the *routing*, the durations and
   * the difficulty bandings are proposals written to be corrected in one pass
   * with the operator. They are not transcriptions and should not be sent as
   * though they were.
   */
  routes: [
    {
      id: "beach-line",
      name: "The Beach Line",
      terrain: "Coastal track",
      difficulty: "Easy",
      durationMinutes: 60,
      bestAt: "Low tide, any wind",
      note: "Straight out of the village and north along the hard sand and the track above it. Flat, fast, forgiving, and the one we put you on first — an hour here tells us more about your riding than any question we could ask.",
    },
    {
      id: "argan-hills",
      name: "The Argan Hills",
      terrain: "Forest",
      difficulty: "Easy",
      durationMinutes: 90,
      bestAt: "Morning, before the haze",
      note: "Inland and up, through the old argan stands behind the coast. Shade, goats in the trees doing the thing everyone photographs, and a gradient gentle enough that nobody has to think about it.",
    },
    {
      id: "cap-ghir",
      name: "Cap Ghir",
      terrain: "Coastal track",
      difficulty: "Moderate",
      durationMinutes: 120,
      bestAt: "Late afternoon, light wind",
      note: "North to the headland and the lighthouse on it, with the Atlantic on your left the whole way and a long drop on the exposed sections. The wind up there is honest. This is the one people put on the internet afterwards.",
    },
    {
      id: "dry-river",
      name: "The Dry River",
      terrain: "Riverbed",
      difficulty: "Moderate",
      durationMinutes: 120,
      bestAt: "Any time, outside the rains",
      note: "Up the wadi bed inland, between banks that get higher than you expect. Loose stone, a lot of it, and the surface changes every winter — which is why we check it before we take anybody up rather than after.",
    },
    {
      id: "tamri-dunes",
      name: "Tamri Dunes",
      terrain: "Dune",
      difficulty: "Technical",
      durationMinutes: 180,
      bestAt: "Late afternoon, for the light",
      note: "The soft stuff, north past the plantations. Real dune riding — momentum, throttle discipline, and the certainty of getting a machine stuck at least once. Buggies do better here than quads and we will say so when you book.",
    },
    {
      id: "paradise-road",
      name: "The Valley Road",
      terrain: "Piste",
      difficulty: "Technical",
      durationMinutes: 240,
      bestAt: "Full day, early start",
      note: "Inland up the Tamraght river road toward the pools, on piste most of the way. The long one — half a day, a proper stop, and the only route on this list we will turn people back from if the riding is not there.",
    },
  ],

  rideCopy: {
    eyebrow: "The Ride",
    title: "Nobody is thrown at a dune in the first ten minutes.",
    intro:
      "This is the shape of a standard two-hour excursion. The order does not change much; the ground does. Nothing here is a formality — the flat-ground section exists because it is where we find out what you can actually do.",
    footnote:
      "Shape of a two-hour ride · longer routes stretch the middle, not the briefing",
  },

  /**
   * TO CONFIRM — the intake captured no excursion structure. This is written to
   * the services it evidences (insured machines, guided, two up) and every
   * marker in it is a proposal. Replace wholesale with their actual running
   * order before sending.
   */
  ride: [
    {
      mark: "+00:00",
      markIso: "PT0M",
      title: "Paperwork, then gear",
      body: "Insurance, a look at your licence if you are taking a scooter or a bike, and then helmet, goggles and gloves fitted properly rather than handed over. Wear something you have already decided to stop caring about.",
    },
    {
      mark: "+00:15",
      markIso: "PT15M",
      title: "Flat ground",
      body: "Twenty minutes on open ground behind the village: throttle, brake, how the thing behaves when you turn and how it behaves when you panic. Everybody does this, including the people who tell us they do not need to.",
    },
    {
      mark: "+00:35",
      markIso: "PT35M",
      title: "Out of the village",
      body: "Away in a line with a guide in front and, on bigger groups, one at the back. The pace is set by the slowest rider and that is not a compromise — it is how everybody arrives.",
    },
    {
      mark: "+01:10",
      markIso: "PT70M",
      title: "The stop",
      body: "Machines off somewhere worth switching them off for — the headland, the top of the forest track, the edge of the dunes. Tea if the day is long enough. This is when the photographs happen, and when we tell you what is actually in front of you.",
    },
    {
      mark: "+01:35",
      markIso: "PT95M",
      title: "The long way back",
      body: "A different line home, quicker than the way out because by now you can ride. Sunset routes take this section slowly on purpose.",
    },
    {
      mark: "+02:00",
      markIso: "PT120M",
      title: "Back, filthy",
      body: "Machines in, gear off, water. There is a tap and there is nothing we can do about your shoes. Most people book the next one before they leave.",
    },
  ],

  night: {
    eyebrow: "After Dark",
    statement: "The desert does something else at night.",
    body: [
      "The night rides are a different product from the same machines. The temperature drops, the ground firms up, the dust settles, and the coast track goes quiet in a way it never is at four in the afternoon. Headlights, a guide who has ridden it in the dark a hundred times, and a slower pace than daylight because that is the only sensible way to do it.",
      "We run them on clear nights and we cancel them on the ones that are not — a night ride in haze is just an expensive dark ride. Ask when you book and we will tell you which nights that week look right.",
    ],
    /**
     * BOUND — `night.webp`, 1836×1032.
     *
     * No longer a substitution. The re-curation pass turned up a real
     * end-of-day ride in the client's Google listing, which replaces the tyre
     * detail that stood here when the only dusk frame available was 206px.
     *
     * Still worth knowing: this is sundown, not full dark. The alt text says
     * "the sun dropping behind the ridge" rather than "at night", because the
     * heading says night and the picture must not overclaim. A true
     * headlights-in-the-dust frame is the one shot still worth requesting.
     */
    photo: {
      id: "night",
      direction:
        "Sundown at the turnaround. Five riders and their quads strung across the frame on open stony ground, helmets on, the sun going down behind the ridge behind them and the sky burning out to white. Backlit and hazy — the hour the night rides leave in.",
      tone: "dusk",
      ratio: "16/9",
    },
    facts: [
      { label: "Runs", value: "Clear nights" },
      { label: "Pace", value: "Slower" },
    ],
  },

  enquire: {
    eyebrow: "Ride",
    title: "Message us. We answer on WhatsApp.",
    body: "Tell us how many of you there are, whether anyone has ridden before, and roughly when. We will tell you which machine fits, which route is worth your time that week, and what it costs — before you commit to anything.",
    sentimentLabel: "What people tell us",
    sentimentDisclosure:
      "Written by us, summarising themes from their public reviews. Nothing above is a quotation, and nothing above is attributed to a named reviewer.",
    notes: [
      {
        label: "Getting here",
        body: "27 km north of Agadir on the Essaouira road. The ALSA bus runs to the village — no car needed, and we will meet it. Tell us which one you are on.",
      },
      {
        label: "Staying over",
        body: "We work with Taouarguit Guest House on combined ride-and-bed packages. Ask and we will price the two together.",
      },
      {
        label: "What to wear",
        body: "Closed shoes, long sleeves you do not love, and sunglasses under the goggles if you wear them. We supply everything else.",
      },
    ],
  },
};
