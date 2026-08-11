import { CONDITIONS, TERRAIN } from "@/lib/content";
import type { ConditionsReading } from "@/lib/types";

/**
 * Live conditions for the hero band.
 *
 * Source: Open-Meteo (free, no key, no attribution requirement, no rate limit
 * that an hourly revalidation could reach) — the **forecast** endpoint only.
 *
 * ----------------------------------------------------------------------------
 *  WHY THIS REPLACED THE MARINE ALMANAC
 * ----------------------------------------------------------------------------
 *
 * The previous version of this module read swell height, swell period, swell
 * direction, sea surface temperature and a sea-level series it fitted a
 * parabola through to recover tide extremes. All of it was correct and none of
 * it means anything twenty kilometres up a riverbed. Offshore-versus-onshore
 * wind, in particular, is a surfing distinction: it needs a shoreline to be
 * measured against, and this business rides away from one.
 *
 * So the marine calls are gone and the readings are the ones that actually
 * decide whether a ride goes and when:
 *
 *   - **Air / Feels** — heat is the real limit on an afternoon in a helmet.
 *   - **Wind / Gusts** — gusts, not the average, are what lifts dust into
 *     goggles and what makes a dune day unpleasant.
 *   - **Visibility** — the direct measure of how far down the track you can
 *     see, and the reason a night ride gets cancelled.
 *   - **UV** — you are outdoors, uncovered, for two hours.
 *   - **Golden hour / Sunset** — the sunset routes are a listed product, and
 *     these two numbers are what you book them against.
 *
 * The band is therefore still what it always was: instrument data that encodes
 * a real decision, rather than a decorative strip of numbers. It also now costs
 * **one** request where the almanac cost three, which removes two failure modes
 * from every build.
 *
 * Position comes from `TERRAIN` in the business config, so pointing the site at
 * a different operator moves the forecast with it — there is no latitude
 * hard-coded here.
 *
 * Caching: the request is tagged `revalidate: 3600`. Because this runs in a
 * Server Component the whole route becomes ISR — prerendered at build and
 * refreshed hourly — so no visitor ever waits on Open-Meteo, and the markup is
 * present in the first HTML byte. That matters beyond performance here: the
 * hero's GSAP timeline queries `[data-hero-reading]` once on mount, so readings
 * that arrived later would never be un-hidden by the CSS gate.
 *
 * Resilience: every reading resolves independently against the static set in
 * the config, so one missing field prints its fallback rather than blanking the
 * row, and a total failure returns the static set unchanged.
 */

const REVALIDATE_SECONDS = 3600;
const REQUEST_TIMEOUT_MS = 4000;

/**
 * How far before sunset the good light starts.
 *
 * A real golden hour is not an hour and varies with latitude and season; 45
 * minutes is the honest approximation at 30°N, where the sun drops steeply.
 * Open-Meteo publishes sunset but no solar-elevation series, so this is a
 * stated approximation rather than a computed one — which is why the label
 * reads "Golden hour" and not a precise claim.
 */
const GOLDEN_HOUR_LEAD_MINUTES = 45;

interface ForecastResponse {
  readonly current?: {
    readonly time?: string;
    readonly temperature_2m?: number;
    readonly apparent_temperature?: number;
    readonly wind_speed_10m?: number;
    readonly wind_direction_10m?: number;
    readonly wind_gusts_10m?: number;
    readonly uv_index?: number;
  };
  readonly hourly?: {
    readonly time?: readonly string[];
    /** Metres. Open-Meteo publishes visibility hourly only, never as `current`. */
    readonly visibility?: readonly number[];
  };
  readonly daily?: {
    readonly sunset?: readonly string[];
  };
}

/** Fetch and parse, returning null on any failure rather than throwing. */
async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      // A hung upstream must never stall a build or a revalidation.
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function kmhToKnots(kmh: number): number {
  return kmh / 1.852;
}

const COMPASS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
] as const;

export function degreesToCompass(degrees: number): string {
  const normalised = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalised / 22.5) % 16;
  return COMPASS[index] ?? "N";
}

/**
 * Shift a local ISO timestamp by a number of minutes and return "HH:MM".
 *
 * Open-Meteo with `timezone=auto` returns local wall-clock strings with no
 * offset ("2026-08-11T20:25"). Passing those through `new Date()` would
 * reinterpret them in the *server's* timezone, so all arithmetic here stays on
 * the string's own clock and never constructs a Date.
 */
export function shiftClock(isoLocal: string, offsetMinutes: number): string {
  const [hourPart, minutePart] = isoLocal.slice(11, 16).split(":");
  const hours = Number(hourPart);
  const minutes = Number(minutePart);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return "--:--";

  const total = hours * 60 + minutes + Math.round(offsetMinutes);
  const wrapped = ((total % 1440) + 1440) % 1440;
  const hh = String(Math.floor(wrapped / 60)).padStart(2, "0");
  const mm = String(wrapped % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * The hourly sample covering `nowIsoLocal`.
 *
 * Both series are local wall-clock strings on the same clock, and the hourly
 * series is on the hour, so truncating to "YYYY-MM-DDTHH" and matching is exact
 * — no Date, no timezone, no interpolation. Returns undefined rather than
 * guessing when the hour is not in the window, so the caller falls back.
 */
export function hourlyValueAt(
  times: readonly string[] | undefined,
  values: readonly number[] | undefined,
  nowIsoLocal: string | undefined,
): number | undefined {
  if (!times || !values || !nowIsoLocal) return undefined;
  const hourKey = nowIsoLocal.slice(0, 13);
  const index = times.findIndex((time) => time.slice(0, 13) === hourKey);
  return index === -1 ? undefined : values[index];
}

/** Static reading for a label, used when a source is unavailable. */
function fallbackFor(label: string): ConditionsReading {
  return (
    CONDITIONS.find((reading) => reading.label === label) ?? {
      label,
      value: "—",
    }
  );
}

export async function getLiveConditions(): Promise<
  readonly ConditionsReading[]
> {
  const { latitude, longitude } = TERRAIN;

  const forecastUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${String(latitude)}&longitude=${String(longitude)}` +
    `&current=temperature_2m,apparent_temperature,wind_speed_10m` +
    `,wind_direction_10m,wind_gusts_10m,uv_index` +
    `&hourly=visibility&daily=sunset&timezone=auto&forecast_days=1`;

  const forecast = await fetchJson<ForecastResponse>(forecastUrl);

  // The source failed — hand back the static set untouched.
  if (!forecast) return CONDITIONS;

  const current = forecast.current;
  const readings: ConditionsReading[] = [];

  // --- Temperature --------------------------------------------------------
  readings.push(
    typeof current?.temperature_2m === "number"
      ? {
          label: "Air",
          value: String(Math.round(current.temperature_2m)),
          unit: "°C",
        }
      : fallbackFor("Air"),
  );

  // Apparent temperature, not the raw reading. In a helmet and long sleeves it
  // is the number that describes the afternoon you are actually going to have.
  readings.push(
    typeof current?.apparent_temperature === "number"
      ? {
          label: "Feels",
          value: String(Math.round(current.apparent_temperature)),
          unit: "°C",
        }
      : fallbackFor("Feels"),
  );

  // --- Wind ---------------------------------------------------------------
  // Direction is printed as the compass point the wind comes *from*, which is
  // the convention Open-Meteo reports in and the one a rider reads on any other
  // forecast. No on/offshore classification — see the header.
  readings.push(
    typeof current?.wind_speed_10m === "number" &&
      typeof current.wind_direction_10m === "number"
      ? {
          label: "Wind",
          value: `${degreesToCompass(current.wind_direction_10m)} ${String(Math.round(kmhToKnots(current.wind_speed_10m)))}`,
          unit: "kt",
        }
      : fallbackFor("Wind"),
  );

  // Gusts get their own reading rather than being folded into the average,
  // because on loose ground the gust is the number that matters and the two
  // routinely differ by a factor of two.
  readings.push(
    typeof current?.wind_gusts_10m === "number"
      ? {
          label: "Gusts",
          value: String(Math.round(kmhToKnots(current.wind_gusts_10m))),
          unit: "kt",
        }
      : fallbackFor("Gusts"),
  );

  // --- Visibility ---------------------------------------------------------
  // Reported in metres and printed in kilometres. Capped at 30: the model tops
  // out around 24 km and a "68 km" reading would be model noise stated as fact.
  const visibilityMetres = hourlyValueAt(
    forecast.hourly?.time,
    forecast.hourly?.visibility,
    current?.time,
  );
  readings.push(
    typeof visibilityMetres === "number"
      ? {
          label: "Visibility",
          value: String(Math.min(30, Math.round(visibilityMetres / 1000))),
          unit: "km",
        }
      : fallbackFor("Visibility"),
  );

  // --- UV -----------------------------------------------------------------
  readings.push(
    typeof current?.uv_index === "number"
      ? { label: "UV", value: String(Math.round(current.uv_index)) }
      : fallbackFor("UV"),
  );

  // --- Light --------------------------------------------------------------
  // Sunset drives both readings, so they resolve together: a golden hour
  // printed live beside a fallback sunset would be internally inconsistent by
  // exactly the offset, which is worse than two fallbacks.
  const sunset = forecast.daily?.sunset?.[0];
  readings.push(
    sunset
      ? {
          label: "Golden hour",
          value: shiftClock(sunset, -GOLDEN_HOUR_LEAD_MINUTES),
        }
      : fallbackFor("Golden hour"),
  );
  readings.push(
    sunset
      ? { label: "Sunset", value: shiftClock(sunset, 0) }
      : fallbackFor("Sunset"),
  );

  return readings;
}
