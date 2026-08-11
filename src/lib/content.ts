import { BUSINESS } from "@/lib/business.config";
import type {
  BusinessIdentity,
  ConditionsReading,
  EnquireCopy,
  FleetCopy,
  FleetUnit,
  ManifestoCopy,
  NavItem,
  NightCopy,
  PhotoBrief,
  RideCopy,
  RideStage,
  Route,
  RoutesCopy,
  Sentiment,
  SeoConfig,
  TerrainConfig,
} from "@/lib/types";

/**
 * The page's content surface.
 *
 * This file holds no data of its own — it names the pieces of `BUSINESS` that
 * sections consume. The indirection is the point: components import stable
 * names (`SITE`, `FLEET`, `ROUTES`) and never reach into the config's shape, so
 * re-skinning the site for a new client is one file
 * (`@/lib/business.config`) and zero component edits.
 */

export const SITE: BusinessIdentity = BUSINESS.identity;
export const TERRAIN: TerrainConfig = BUSINESS.terrain;
export const SEO: SeoConfig = BUSINESS.seo;

export const NAV_ITEMS: readonly NavItem[] = BUSINESS.nav;

/** Static readings, used per-label when the live source is unreachable. */
export const CONDITIONS: readonly ConditionsReading[] =
  BUSINESS.conditionsFallback;

export const HERO = BUSINESS.hero;
export const HERO_PHOTO: PhotoBrief = BUSINESS.heroPhoto;
export const PLACE_PHOTO: PhotoBrief = BUSINESS.placePhoto;

export const MANIFESTO: ManifestoCopy = BUSINESS.manifesto;

export const FLEET_COPY: FleetCopy = BUSINESS.fleetCopy;
export const FLEET: readonly FleetUnit[] = BUSINESS.fleet;

/** Paraphrased review themes. Never rendered as quotations. */
export const SENTIMENT: readonly Sentiment[] = BUSINESS.sentiment;

export const ROUTES_COPY: RoutesCopy = BUSINESS.routesCopy;
export const ROUTES: readonly Route[] = BUSINESS.routes;

export const RIDE_COPY: RideCopy = BUSINESS.rideCopy;
export const RIDE: readonly RideStage[] = BUSINESS.ride;

export const NIGHT: NightCopy = BUSINESS.night;

export const ENQUIRE: EnquireCopy = BUSINESS.enquire;
