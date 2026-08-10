import type { PropertyConfig } from "@/lib/types";

/**
 * ============================================================================
 *  THE ONLY FILE A NEW CLIENT NEEDS.
 * ============================================================================
 *
 * This site is a template for small hospitality and surf operators on the
 * Moroccan Atlantic. Everything that identifies a business lives in this
 * object: the name, the coastline the live almanac reads from, the packages,
 * the breaks, and every line of section copy. No component holds a
 * business-specific string.
 *
 * To pitch a new prospect:
 *
 *   1. Edit `identity` — name, wordmark, contact, url.
 *   2. Edit `coast` — the real latitude/longitude, and the bearing its shore
 *      faces. The almanac band retargets itself; nothing else to do.
 *   3. Edit `packages` and `breaks` to what they actually sell and actually surf.
 *   4. Rewrite the copy blocks in their voice.
 *   5. Drop photography into `src/assets/photos/` against the slot ids in
 *      `@/lib/photos`. Unbound slots render their art-direction brief, so an
 *      unshot business is still presentable.
 *
 * ---------------------------------------------------------------------------
 *  Current tenant: Alaïa Surf School, Taghazout.
 * ---------------------------------------------------------------------------
 *
 * Every fact below — name, phone, packages, prices, schedule, rating and the
 * three quoted reviews — comes from the client profile at
 * `intake/alaia/data.json` and is reproduced verbatim where it is quoted.
 * Two fields could not be sourced from it and are marked TO CONFIRM inline.
 */
export const PROPERTY: PropertyConfig = {
  identity: {
    name: "Alaïa Surf School",
    wordmark: "ALAÏA",
    tagline: "Authentic Moroccan Surf Experiences",
    /** Footer standing line. Says where the school is, not what it promises. */
    provenance:
      "Tawenza Square, Taghazout — the Atlantic at the end of the street, and a coast that was surfed by the people who live on it long before anyone flew in for it.",
    description:
      "A surf school on Tawenza Square, Taghazout, Morocco. Professional local coaching, premium equipment and a transfer each morning to whichever point is working — group classes, private lessons, surf and yoga.",
    location: "Tawenza Square, Taghazout, Morocco",
    locality: "Taghazout",
    region: "Souss-Massa",
    countryCode: "MA",
    country: "Morocco",
    coordinates: "30.5442° N, 9.7108° W",
    /** TO CONFIRM — read off the school's own printed flyers in the intake. */
    email: "surfschool.alaia@gmail.com",
    phone: "+212 6 64 08 53 28",
    /** TO CONFIRM — the rash vests read WWW.ALAIA.•• but the TLD is not legible. */
    url: "https://alaia.ma",
  },

  /**
   * Taghazout. The points along this stretch look roughly due west, which puts
   * the land at 90° — the reciprocal the wind classifier measures against.
   */
  coast: {
    latitude: 30.5442,
    longitude: -9.7108,
    coastFacingDegrees: 270,
  },

  seo: {
    keywords: [
      "surf school Taghazout",
      "surf lessons Morocco",
      "learn to surf Taghazout",
      "private surf lesson Agadir",
      "surf and yoga Morocco",
      "Taghazout surf camp",
    ],
    amenities: [
      "Group surf classes",
      "Private coaching",
      "Surf and yoga",
      "Premium equipment included",
      "Transfer to the spot",
    ],
  },

  nav: [
    { label: "The School", href: "#school" },
    { label: "Packages", href: "#packages" },
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
      "A surf school on Tawenza Square, Taghazout. Local coaches, premium boards, and a transfer every morning to whichever point is working.",
    ogStrapline: "Coaching on the Taghazout points",
  },

  heroPhoto: {
    id: "hero",
    direction:
      "A student up and riding on a clean blue wall, the coach still in the water behind him. Water fills the frame; the top half is open ocean, which is what keeps the wordmark legible over it.",
    tone: "ocean",
    ratio: "21/9",
  },

  placePhoto: {
    id: "place",
    direction:
      "The beach at the end of the session — a class sitting on the sand with the town stacked behind them. Documentary, not aspirational: this is a working coast and it should look like one.",
    tone: "noon",
    ratio: "3/2",
  },

  manifesto: {
    eyebrow: "The School",
    statement:
      "Local coaches, world-class points, and a group that stops being strangers by Tuesday.",
    body: [
      "Alaïa is a surf school first. The coaches are from this coast, they surf it out of season as well as in, and they read the chart every morning before deciding where the vans go. That is the whole method: put people in front of the right wave for their level, on the right day, with equipment that does not fight them.",
      "The rest is Berber hospitality, and it is not a marketing line. Breakfast before the wave check, a shared lunch after the session, yoga in the shala most evenings, and a table that everyone ends up at. People arrive booked onto a lesson and leave having joined something.",
    ],
    pullQuote: "You are not booking a lesson. You are joining the morning.",
  },

  packagesCopy: {
    eyebrow: "Packages",
    title: "Four ways to spend a day in the water.",
    footnote:
      "Prices are per person per day and include the transfer to the spot, a towel, and premium equipment — board, wetsuit and rash vest. Every package is open to all levels; which spot your group surfs is decided at the morning wave check, not by a timetable.",
  },

  packages: [
    {
      id: "group-class",
      name: "Group Surf Class",
      meaning: "The morning most people come here for",
      level: "All Levels",
      duration: "2 hours a day",
      includes: [
        "Two hours of coaching a day, in a small group",
        "Transfer to the best spot on the day",
        "Towel and premium surfing equipment",
      ],
      priceEur: 25,
      photo: {
        id: "lesson-lineup",
        direction:
          "A class on the sand before the session, boards laid out in a row, the sea flat behind them. Midday, hard light, nobody posing.",
        tone: "noon",
        ratio: "4/5",
      },
    },
    {
      id: "surf-and-dine",
      name: "Surf & Dine",
      meaning: "A whole day, food included, from breakfast to late lunch",
      level: "All Levels",
      duration: "Breakfast through lunch",
      includes: [
        "Healthy breakfast before the wave check",
        "Session with the coaches, equipment included",
        "Shower, then a shared lunch at the long table",
      ],
      priceEur: 35,
      photo: {
        id: "boards-dawn",
        direction:
          "Boards and rash vests set out at the school's frontage at first light, the ocean a flat band beyond the road. Golden hour, no people.",
        tone: "dawn",
        ratio: "4/5",
      },
    },
    {
      id: "private-lesson",
      name: "Private Surf Lesson",
      meaning: "One coach, one surfer, three hours of it",
      level: "All Levels",
      duration: "3 hours a day",
      includes: [
        "Three hours of one-to-one coaching a day",
        "Transfer to the spot that suits your level",
        "Towel and high-quality equipment",
      ],
      priceEur: 50,
      photo: {
        id: "shorebreak-walk",
        direction:
          "A coach walking two students into the shorebreak, boards under their arms, the headland behind. Taken from the sand, mid-morning.",
        tone: "noon",
        ratio: "4/5",
      },
    },
    {
      id: "surf-and-yoga",
      name: "Surf & Yoga Package",
      meaning: "Adventure in the morning, the mat afterwards",
      level: "All Levels",
      duration: "Session plus yoga",
      includes: [
        "Surf coaching with the group",
        "Surfboard and wetsuit included",
        "Post-surf yoga session in the shala",
      ],
      priceEur: 50,
      photo: {
        id: "warmup-sand",
        direction:
          "Warm-up on the sand before the session — arms crossed, eyes closed, the rest of the group blurred behind. Low afternoon sun.",
        tone: "dusk",
        ratio: "4/5",
      },
    },
  ],

  pointsCopy: {
    eyebrow: "The Points",
    title: "The transfer goes wherever the swell is best that morning.",
    intro:
      "Seven breaks inside an hour of the school, roughly in the order the coaches reach for them. Which one your class surfs is decided at the wave check — by the buoy, not by us.",
    trackLabel: "Surf breaks near the school",
  },

  breaks: [
    {
      id: "anchor-point",
      name: "Anchor Point",
      hand: "Right",
      level: "Advanced",
      minutesAway: 5,
      worksOn: "NW 2–4m, 12s+",
      note: "The wave that put this coast on the map. Four sections, and on the right day it joins them all the way to the boulders. Crowded by eight — which is why the vans leave at six.",
    },
    {
      id: "panoramas",
      name: "Panoramas",
      hand: "Right",
      level: "Intermediate",
      minutesAway: 7,
      worksOn: "NW 1–2.5m, any period",
      note: "Softer point break over sand and rock, between Taghazout and Tamraght. Where most of our coaching happens. Forgiving take-off, long wall, easy paddle back.",
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
    title: "The wave check writes the timetable.",
    intro:
      "Four parts to a day here, and only the order is fixed. What happens inside each one is decided by the swell, the wind and the tide on the morning.",
    footnote:
      "Sessions move with the conditions · your coach confirms the shape of the day at breakfast",
  },

  day: [
    {
      marker: "Morning",
      title: "Healthy breakfast & wave check",
      body: "Breakfast at the school while the coaches read the swell, the period and the wind, and decide where the vans are going. Nothing is fixed the night before, because the ocean is not.",
    },
    {
      marker: "Mid-Day",
      title: "Surf sessions & transfers",
      body: "Group and private sessions, with the transfer to whichever spot is working for your level. Boards, wetsuits and rash vests are handed out at the school — you carry nothing to the beach but yourself.",
    },
    {
      marker: "Afternoon",
      title: "Shared lunch & free time",
      body: "A shower, then lunch at the long table with whoever surfed that morning. After that the afternoon is yours: the second session, the market, or nothing at all.",
    },
    {
      marker: "Evening",
      title: "Yoga shala & family dinners",
      body: "Yoga in the shala on most evenings, and dinner with the group after it. This is the part guests write about afterwards, and it is the part we are least willing to change.",
    },
  ],

  table: {
    eyebrow: "The Table",
    statement: "Breakfast before the session. Lunch with whoever surfed it.",
    body: [
      "Surf & Dine exists because the best hour of the day here is not always the one in the water. It is the one after: everyone back, showered, hungry, arguing about a wave that only two people saw. We built the school around a table so that hour has somewhere to happen.",
      "Breakfast is healthy and early, because it runs against the wave check. Lunch is shared and unhurried, because nothing follows it. Most evenings there is yoga in the shala and then dinner, and by the third day nobody asks where to sit.",
    ],
    photo: {
      id: "common-room",
      direction:
        "The school's common room from the doorway: low sofas, the board rack along the right wall, glass the full width and the beach through it. Midday, natural light only.",
      tone: "interior",
      ratio: "16/9",
    },
    facts: [
      { label: "Surf & Dine", value: "€35" },
      { label: "Yoga", value: "Most evenings" },
    ],
  },

  testimonialsCopy: {
    eyebrow: "In Their Words",
    title: "Forty-six reviews, averaging 4.9.",
    ratingValue: 4.9,
    reviewCount: 46,
    source: "Guest reviews",
  },

  /** Quoted verbatim, in French, exactly as the guests wrote them. */
  testimonials: [
    {
      quote:
        "Très bonne découverte du surf. Première fois que j'en faisais. Taha était génial pour l'apprentissage.",
      author: "Jean-Yves Muzelet",
      lang: "fr",
    },
    {
      quote:
        "Superbe expérience vécue entre amis pendant 3 jours. Khaoula s'assurait toujours par messages du bon déroulé des séances. Nous avons eu Abdel, le meilleur des coach !",
      author: "Marie Blanc",
      lang: "fr",
    },
    {
      quote:
        "Instructeur très sympathique, matériel et combinaison propres rincées et belle qualité ! On recommande.",
      author: "M H",
      lang: "fr",
    },
  ],

  enquire: {
    eyebrow: "Book",
    title: "Call or message us. We answer the same day.",
    body: "Tell us your dates, how many of you there are, and whether anyone has stood on a board before. We will tell you honestly which package fits, and what the swell tends to do that week.",
    notes: [
      {
        label: "Where we are",
        body: "Tawenza Square, Taghazout. Agadir Al Massira (AGA) is about an hour by road.",
      },
      {
        label: "What to bring",
        body: "Nothing. Board, wetsuit, rash vest and towel are included in every package.",
      },
      {
        label: "Best swell",
        body: "October to March. September and April are quieter and still good.",
      },
    ],
  },
};
