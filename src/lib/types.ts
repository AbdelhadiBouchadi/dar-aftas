/**
 * Domain types for the property template.
 *
 * Every piece of page content is described here first, so sections consume
 * typed data rather than inline strings. No `any` anywhere in this project.
 *
 * The site is built to be re-skinned per client: one `PropertyConfig` object in
 * `@/lib/property.config` supplies the identity, the coastline, the rooms, the
 * breaks and every line of section copy. `@/lib/content` re-exports it under the
 * names the sections import, so a new prospect is a config edit and nothing
 * else. These types are what make that swap fail the build when it is
 * incomplete rather than silently ship a half-renamed house.
 */

/** Aspect ratios we art-direct against. Kept as a union so a typo fails the build. */
export type AspectRatio = "3/4" | "4/5" | "1/1" | "3/2" | "16/9" | "21/9";

/** Tonal treatment for photography placeholders, drawn from the brand palette. */
export type PhotoTone = "dawn" | "noon" | "dusk" | "interior" | "ocean";

/**
 * An art-direction brief for a photograph.
 *
 * The brief renders as a designed placeholder when no file is bound to its id,
 * so a photographer can shoot to spec and a prospect never sees a grey box.
 */
export interface PhotoBrief {
  /**
   * Stable slot id, also used as the GSAP parallax target key and the lookup
   * into `@/lib/photos`. Slots are named for what the frame *contains*
   * (`stay-surf`), never for the package that happens to use it — so renaming
   * or repricing a stay in the config never orphans a photograph.
   */
  readonly id: string;
  /** What the frame must contain. Written for a photographer, not a developer. */
  readonly direction: string;
  /** Time of day / colour treatment. */
  readonly tone: PhotoTone;
  readonly ratio: AspectRatio;
}

/**
 * Something the house sells: a dated package, or an open-ended stay.
 *
 * Was `Room`. A surf house on this coast is booked by the trip, not by the
 * night — the packages are the listed product on BookRetreats and the rooms
 * behind them are undifferentiated — so the unit of the section is the stay.
 */
export interface Stay {
  readonly id: string;
  readonly name: string;
  /** One line on what the stay actually is. Sits under the name in italic. */
  readonly summary: string;
  /** Nights, where the package is a fixed length. Omitted for open stays. */
  readonly nights?: number;
  /** Who it suits — "Beginners", "All levels". Printed as the left-hand label. */
  readonly level: string;
  /** Two to four concrete inclusions — the things a guest is actually buying. */
  readonly includes: readonly string[];
  /**
   * Lead-in price in **US dollars**, as listed by the operator. Absent where no
   * public price exists, in which case `priceNote` carries the ask instead —
   * never invent a figure to fill the slot.
   */
  readonly priceFromUsd?: number;
  /** Qualifier beside the price, or the whole story when there is no price. */
  readonly priceNote: string;
  readonly photo: PhotoBrief;
}

/**
 * An aggregate rating on a platform the property is listed on.
 *
 * Score, scale, count and source are all required together: a bare "4.5" is
 * marketing, and "4.5/5 from 58 Google reviews" is a fact a reader can go and
 * check. This is deliberately not a testimonial type — pull quotes attributed
 * to named guests are only ever transcribed from a real review, never written.
 */
export interface Review {
  /** Platform name as it should be printed, e.g. "Booking.com". */
  readonly source: string;
  /** The score as displayed by that platform. */
  readonly score: string;
  /** Denominator, because platforms disagree — Booking is /10, Google is /5. */
  readonly scale: string;
  /** Number of ratings behind the score. */
  readonly count: number;
}

/** Difficulty banding for a surf break. */
export type BreakLevel = "Beginner" | "Intermediate" | "Advanced";

/** Wave direction. */
export type BreakHand = "Right" | "Left" | "Both";

/** A named surf break within reach of the house. */
export interface SurfBreak {
  readonly id: string;
  readonly name: string;
  readonly hand: BreakHand;
  readonly level: BreakLevel;
  /** Minutes from the front door, by car. */
  readonly minutesAway: number;
  /** Swell direction and size the break wants. */
  readonly worksOn: string;
  readonly note: string;
}

/** One moment in the tide-governed day. */
export interface DayMoment {
  /** 24h time, e.g. "06:12". The day is a real sequence, so time is the marker. */
  readonly time: string;
  readonly title: string;
  readonly body: string;
}

/** A single reading from the morning almanac band. */
export interface AlmanacReading {
  readonly label: string;
  readonly value: string;
  readonly unit?: string;
}

/** Navigation entry. */
export interface NavItem {
  readonly label: string;
  readonly href: string;
}

/** A short label/value pair, used for the standing facts beside a section. */
export interface Fact {
  readonly label: string;
  readonly value: string;
}

/** A titled note, used for the practical column under the enquiry section. */
export interface Note {
  readonly label: string;
  readonly body: string;
}

/* -------------------------------------------------------------------------- */
/*  Property configuration                                                     */
/* -------------------------------------------------------------------------- */

/** Who the property is. Drives metadata, structured data and the social card. */
export interface PropertyIdentity {
  /** Full trading name, e.g. "Maghrib Nomads". */
  readonly name: string;
  /** Short mark set in Bodoni at hero scale. Keep it to one word. */
  readonly wordmark: string;
  readonly tagline: string;
  /** Where the name comes from. Printed in the footer. */
  readonly provenance: string;
  /** One or two sentences. Used verbatim as the meta description. */
  readonly description: string;
  /** Human-readable address line. */
  readonly location: string;
  /** Town, for schema.org `addressLocality`. */
  readonly locality: string;
  /** Region, for schema.org `addressRegion`. */
  readonly region: string;
  /** ISO 3166-1 alpha-2, for schema.org `addressCountry`. */
  readonly countryCode: string;
  /** Country as printed to a reader, e.g. "Morocco". */
  readonly country: string;
  /** Printed coordinates. Display only — the almanac uses `CoastConfig`. */
  readonly coordinates: string;
  readonly email: string;
  readonly phone: string;
  readonly url: string;
}

/**
 * The stretch of coast this property sits on.
 *
 * This is what the live almanac queries, so it must be the real position of the
 * house: swapping the config moves the forecast with the brand.
 */
export interface CoastConfig {
  readonly latitude: number;
  readonly longitude: number;
  /**
   * The compass bearing the shore faces, in degrees — 270 for a coast looking
   * due west. Land sits at the reciprocal, and that is what decides whether a
   * given wind is blowing offshore or onshore.
   */
  readonly coastFacingDegrees: number;
}

/** Search metadata that is genuinely property-specific. */
export interface SeoConfig {
  readonly keywords: readonly string[];
  /** Rendered into the `LodgingBusiness` JSON-LD as `amenityFeature`. */
  readonly amenities: readonly string[];
}

/** A section with a lead-in label and a display heading. */
export interface SectionCopy {
  readonly eyebrow: string;
  readonly title: string;
}

export interface HeroCopy {
  /** Sits under the wordmark. Two sentences at most — it competes with the photo. */
  readonly subtitle: string;
  /** Strapline on the 1200×630 social card. Short enough to read as a thumbnail. */
  readonly ogStrapline: string;
}

export interface ManifestoCopy {
  readonly eyebrow: string;
  readonly statement: string;
  readonly body: readonly string[];
  /** Set large and italic under a rule. The line you want remembered. */
  readonly pullQuote: string;
}

export interface StaysCopy extends SectionCopy {
  /** What the rate includes, and anything held back from the list above. */
  readonly footnote: string;
}

export interface PointsCopy extends SectionCopy {
  readonly intro: string;
  /** Accessible name for the horizontally scrolled region. */
  readonly trackLabel: string;
}

export interface DayCopy extends SectionCopy {
  readonly intro: string;
  /** Seasonal caveat under the timeline — times shift across the year. */
  readonly footnote: string;
}

export interface TableCopy {
  readonly eyebrow: string;
  readonly statement: string;
  readonly body: readonly string[];
  readonly photo: PhotoBrief;
  readonly facts: readonly Fact[];
}

export interface EnquireCopy extends SectionCopy {
  readonly body: string;
  readonly notes: readonly Note[];
  /** Label above the ratings row, e.g. "What guests score us". */
  readonly reviewsLabel: string;
}

/**
 * The whole property, in one object.
 *
 * Everything a re-skin touches lives here. Nothing below this type should need
 * a component change to swap.
 */
export interface PropertyConfig {
  readonly identity: PropertyIdentity;
  readonly coast: CoastConfig;
  readonly seo: SeoConfig;
  readonly nav: readonly NavItem[];
  /** Rendered when a forecast source is unreachable. Labels must match the live builder. */
  readonly almanacFallback: readonly AlmanacReading[];
  readonly hero: HeroCopy;
  readonly heroPhoto: PhotoBrief;
  readonly placePhoto: PhotoBrief;
  readonly manifesto: ManifestoCopy;
  readonly staysCopy: StaysCopy;
  readonly stays: readonly Stay[];
  /** Aggregate scores, printed with their source and count or not at all. */
  readonly reviews: readonly Review[];
  readonly pointsCopy: PointsCopy;
  readonly breaks: readonly SurfBreak[];
  readonly dayCopy: DayCopy;
  readonly day: readonly DayMoment[];
  readonly table: TableCopy;
  readonly enquire: EnquireCopy;
}
