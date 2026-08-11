/**
 * Domain types for the excursion-operator template.
 *
 * Every piece of page content is described here first, so sections consume
 * typed data rather than inline strings. No `any` anywhere in this project.
 *
 * The site is built to be re-skinned per client: one `BusinessConfig` object in
 * `@/lib/business.config` supplies the identity, the terrain, the fleet, the
 * routes and every line of section copy. `@/lib/content` re-exports it under the
 * names the sections import, so a new prospect is a config edit and nothing
 * else. These types are what make that swap fail the build when it is
 * incomplete rather than silently ship a half-renamed business.
 *
 * ----------------------------------------------------------------------------
 *  A NOTE ON THE RENAME FROM THE SURF-HOUSE ORIGIN
 * ----------------------------------------------------------------------------
 *
 * This template began as a surf-camp/guest-house site. Repointing it at a quad
 * and buggy operator meant real domain changes, not a find-and-replace: there
 * is no swell, no tide, no bed and no dinner table here.
 *
 * The old names (`SurfBreak`, `Stay`, `DayMoment`, `TableCopy`, `Review`,
 * `CoastConfig`, `PropertyConfig`) were **deleted rather than aliased**. That is
 * deliberate and it is the whole type-safety argument: an alias would let a
 * missed call site keep compiling against a shape that no longer describes the
 * business. A deletion makes every one of them a build error. Closed string
 * unions (`Terrain`, `RouteDifficulty`, `AspectRatio`, `PhotoTone`) do the same
 * job one level down — a typo is a compile error, never a silent fallback.
 */

/** Aspect ratios we art-direct against. Kept as a union so a typo fails the build. */
export type AspectRatio = "3/4" | "4/5" | "1/1" | "3/2" | "16/9" | "21/9";

/**
 * Tonal treatment for photography placeholders, drawn from the brand palette.
 *
 * `ocean` is gone — a deep blue-black ground was right for an Atlantic line-up
 * and is wrong for every frame this client has. `dust` replaces it: the ochre
 * haze of a piste in the afternoon.
 */
export type PhotoTone = "dawn" | "noon" | "dusk" | "interior" | "dust";

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
   * (`fleet-quad`), never for the package that happens to use it — so renaming
   * or repricing an excursion in the config never orphans a photograph.
   */
  readonly id: string;
  /** What the frame must contain. Written for a photographer, not a developer. */
  readonly direction: string;
  /** Time of day / colour treatment. */
  readonly tone: PhotoTone;
  readonly ratio: AspectRatio;
}

/**
 * Something the operator rents or runs: a machine, or a guided excursion on one.
 *
 * Was `Stay`. A surf house is booked by the week; this business is booked by
 * the hour, on a specific machine, so the unit of the section is the machine
 * rather than the trip.
 */
export interface FleetUnit {
  readonly id: string;
  readonly name: string;
  /** One line on what it actually is. Sits under the name in italic. */
  readonly summary: string;
  /**
   * Riders the machine carries. Was `nights`. Omitted where it varies or where
   * the entry is a service rather than a single machine (a guided tour).
   */
  readonly seats?: number;
  /** Who it suits — "First time out", "Licence holders". The left-hand label. */
  readonly suits: string;
  /** Two to four concrete inclusions — what the price actually covers. */
  readonly includes: readonly string[];
  /**
   * Lead-in price in **Moroccan dirham**, as quoted by the operator.
   *
   * Was `priceFromUsd`. The currency is in the field name on purpose: this is
   * the one field where a silent unit change would print a plausible, wrong
   * number, and the rename forces every call site to be re-read. Absent where
   * no public rate exists, in which case `priceNote` carries the ask instead —
   * never invent a figure to fill the slot.
   */
  readonly priceFromMad?: number;
  /** Qualifier beside the price, or the whole story when there is no price. */
  readonly priceNote: string;
  readonly photo: PhotoBrief;
}

/**
 * A paraphrased theme drawn from public reviews.
 *
 * This replaces the old `Review` type, and it exists because of a constraint
 * worth stating plainly: the reviews for this business are real, public and
 * **third-party copyrighted text**, and the research pass captured no aggregate
 * scores or sample sizes at all. So neither of the honest options the old type
 * allowed — a verifiable "4.5/5 from 58 reviews", or a transcribed quotation —
 * is available.
 *
 * What is left is sentiment, in our own words, labelled as ours. Hence: no
 * `name` field, no quotation marks anywhere in the rendering, and a required
 * `source` that says where the impression comes from rather than dressing it as
 * a citation. A fabricated pull quote attributed to a named guest would be the
 * one dishonest thing on this page, and the type is shaped to make it
 * unrepresentable.
 */
export interface Sentiment {
  /** What the theme is about — "Guiding", "The machines". The left label. */
  readonly theme: string;
  /** Our paraphrase. Never a quotation, never attributed to a person. */
  readonly body: string;
  /** Where the impression comes from, e.g. "Recurring in Google reviews". */
  readonly source: string;
}

/** Difficulty banding for a route. Was `BreakLevel`. */
export type RouteDifficulty = "Easy" | "Moderate" | "Technical";

/** Ground the route is ridden on. Was `BreakHand` (Right/Left/Both). */
export type Terrain =
  | "Dune"
  | "Piste"
  | "Coastal track"
  | "Riverbed"
  | "Forest";

/** A named route within reach of the base. Was `SurfBreak`. */
export interface Route {
  readonly id: string;
  readonly name: string;
  readonly terrain: Terrain;
  readonly difficulty: RouteDifficulty;
  /** How long the route takes, door to door, in minutes. Was `minutesAway`. */
  readonly durationMinutes: number;
  /** Conditions the route wants — time of day, wind, season. Was `worksOn`. */
  readonly bestAt: string;
  readonly note: string;
}

/**
 * One stage of a guided excursion.
 *
 * Was `DayMoment`, which was marked by wall-clock time because a guest's day at
 * a lodge is a real sequence of hours. An excursion is a *duration*, so the
 * marker is elapsed time from the off — and that distinction is why there are
 * two fields here rather than one.
 */
export interface RideStage {
  /** Elapsed marker as printed, e.g. "+00:15". */
  readonly mark: string;
  /**
   * The same elapsed time as an ISO 8601 duration, e.g. "PT15M".
   *
   * `<time datetime>` accepts a duration, so keeping this alongside the printed
   * marker means the stage list stays machine-readable instead of degrading to
   * a decorative `<span>` — the printed "+00:15" is not itself valid `datetime`.
   */
  readonly markIso: string;
  readonly title: string;
  readonly body: string;
}

/** A single reading from the live conditions band. */
export interface ConditionsReading {
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
/*  Business configuration                                                     */
/* -------------------------------------------------------------------------- */

/** Who the business is. Drives metadata, structured data and the social card. */
export interface BusinessIdentity {
  /** Full trading name, e.g. "MayaQuad". */
  readonly name: string;
  /** Short mark set in Bodoni at hero scale. Keep it to one word. */
  readonly wordmark: string;
  readonly tagline: string;
  /** Where the name or the place comes from. Printed in the footer. */
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
  /** Printed coordinates. Display only — the conditions band uses `TerrainConfig`. */
  readonly coordinates: string;
  readonly email: string;
  readonly phone: string;
  readonly url: string;
}

/**
 * Where the business rides.
 *
 * This is what the live conditions band queries, so it must be the real
 * position of the base: swapping the config moves the forecast with the brand.
 *
 * Was `CoastConfig`. Its `coastFacingDegrees` field is deleted outright rather
 * than left unused — offshore versus onshore wind is a meaningless distinction
 * twenty kilometres up a riverbed, and a field nothing reads is a field someone
 * later fills in wrongly.
 */
export interface TerrainConfig {
  readonly latitude: number;
  readonly longitude: number;
}

/** Search metadata that is genuinely business-specific. */
export interface SeoConfig {
  readonly keywords: readonly string[];
  /** Rendered into the `SportsActivityLocation` JSON-LD as `amenityFeature`. */
  readonly features: readonly string[];
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
  /** Lead-in label on the conditions band, e.g. "Out there now". */
  readonly conditionsLabel: string;
}

export interface ManifestoCopy {
  readonly eyebrow: string;
  readonly statement: string;
  readonly body: readonly string[];
  /** Set large and italic under a rule. The line you want remembered. */
  readonly pullQuote: string;
}

export interface FleetCopy extends SectionCopy {
  /** What the rate includes, and anything held back from the list above. */
  readonly footnote: string;
}

export interface RoutesCopy extends SectionCopy {
  readonly intro: string;
  /** Accessible name for the horizontally scrolled region. */
  readonly trackLabel: string;
  /** Label above the conditions line on each card, e.g. "Best at". */
  readonly bestAtLabel: string;
}

export interface RideCopy extends SectionCopy {
  readonly intro: string;
  /** Caveat under the timeline — the shape moves with the route and the group. */
  readonly footnote: string;
}

export interface NightCopy {
  readonly eyebrow: string;
  readonly statement: string;
  readonly body: readonly string[];
  readonly photo: PhotoBrief;
  readonly facts: readonly Fact[];
}

export interface EnquireCopy extends SectionCopy {
  readonly body: string;
  readonly notes: readonly Note[];
  /** Label above the sentiment row, e.g. "What people tell us". */
  readonly sentimentLabel: string;
  /**
   * Standing disclosure printed under the sentiment row.
   *
   * Required, not optional: the block paraphrases third-party reviews, and the
   * statement that it is a paraphrase is not decoration a future edit may drop.
   */
  readonly sentimentDisclosure: string;
}

/**
 * The whole business, in one object.
 *
 * Everything a re-skin touches lives here. Nothing below this type should need
 * a component change to swap.
 */
export interface BusinessConfig {
  readonly identity: BusinessIdentity;
  readonly terrain: TerrainConfig;
  readonly seo: SeoConfig;
  readonly nav: readonly NavItem[];
  /** Rendered when the forecast source is unreachable. Labels must match the live builder. */
  readonly conditionsFallback: readonly ConditionsReading[];
  readonly hero: HeroCopy;
  readonly heroPhoto: PhotoBrief;
  readonly placePhoto: PhotoBrief;
  readonly manifesto: ManifestoCopy;
  readonly fleetCopy: FleetCopy;
  readonly fleet: readonly FleetUnit[];
  /** Paraphrased review themes. Never quotations, never attributed to a person. */
  readonly sentiment: readonly Sentiment[];
  readonly routesCopy: RoutesCopy;
  readonly routes: readonly Route[];
  readonly rideCopy: RideCopy;
  readonly ride: readonly RideStage[];
  readonly night: NightCopy;
  readonly enquire: EnquireCopy;
}
