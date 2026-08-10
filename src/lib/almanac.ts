import { ALMANAC, COAST } from "@/lib/content";
import type { AlmanacReading } from "@/lib/types";

/**
 * Live conditions for the hero almanac.
 *
 * Source: Open-Meteo (free, no key, no attribution requirement, no rate limit
 * that an hourly revalidation could reach).
 *   - marine API      → swell height / period / direction, sea surface temp
 *   - forecast API    → wind speed + direction, sunrise
 *   - marine hourly   → sea level height, from which both tides are derived
 *
 * Position comes from `COAST` in the property config, so pointing the site at a
 * different house on this coast moves the forecast with it — there is no
 * latitude hard-coded here.
 *
 * Caching: every request is tagged `revalidate: 3600`. Because this runs in a
 * Server Component the whole route becomes ISR — prerendered at build and
 * refreshed hourly — so no visitor ever waits on Open-Meteo, and the markup is
 * present in the first HTML byte. That matters beyond performance here: the
 * hero's GSAP timeline queries `[data-hero-reading]` once on mount, so readings
 * that arrived later would never be un-hidden by the CSS gate.
 *
 * Resilience: the three requests are guarded independently. A marine outage
 * falls back to static swell figures without blanking the wind, and total
 * failure returns the static ALMANAC unchanged.
 */

/** Land sits opposite the shore's aspect; that is what decides on/offshore. */
const LAND_BEARING_DEG = (COAST.coastFacingDegrees + 180) % 360;

const REVALIDATE_SECONDS = 3600;
const REQUEST_TIMEOUT_MS = 4000;

interface MarineResponse {
  readonly current?: {
    readonly time?: string;
    readonly wave_height?: number;
    readonly wave_period?: number;
    readonly wave_direction?: number;
    readonly swell_wave_height?: number;
    readonly swell_wave_period?: number;
    readonly swell_wave_direction?: number;
    readonly sea_surface_temperature?: number;
  };
}

interface ForecastResponse {
  readonly current?: {
    readonly wind_speed_10m?: number;
    readonly wind_direction_10m?: number;
    readonly temperature_2m?: number;
  };
  readonly daily?: {
    readonly sunrise?: readonly string[];
  };
}

interface TideResponse {
  readonly hourly?: {
    readonly time?: readonly string[];
    readonly sea_level_height_msl?: readonly number[];
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

/** Smallest angle between two bearings, 0–180. */
export function angularDistance(a: number, b: number): number {
  const diff = Math.abs((((a - b) % 360) + 360) % 360);
  return diff > 180 ? 360 - diff : diff;
}

export type WindRelation = "Offshore" | "Onshore" | "Cross-shore";

/**
 * Open-Meteo reports the direction wind blows *from*. Offshore means it
 * arrives from the land side — the reciprocal of the shore's aspect.
 *
 * Cross-shore is a real, named condition — collapsing it into on/offshore
 * would state something the data does not support.
 */
export function classifyWind(
  fromDegrees: number,
  landBearingDeg: number = LAND_BEARING_DEG,
): WindRelation {
  const distance = angularDistance(fromDegrees, landBearingDeg);
  if (distance <= 60) return "Offshore";
  if (distance >= 120) return "Onshore";
  return "Cross-shore";
}

/**
 * Shift a local ISO timestamp by a number of minutes and return "HH:MM".
 *
 * Open-Meteo with `timezone=auto` returns local wall-clock strings with no
 * offset ("2026-08-09T05:00"). Passing those through `new Date()` would
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

export type TideExtreme = "low" | "high";

/**
 * Where `nowIsoLocal` falls in an hourly series, as a fractional index.
 *
 * The series is hourly and on the hour, so one index step is one hour and the
 * minute component of `now` is the fraction. Expressing "now" in index space
 * lets the extremum search compare against interpolated positions without ever
 * constructing a Date — the same discipline `shiftClock` follows, and for the
 * same reason: these are local wall-clock strings with no offset, so a Date
 * would reinterpret them in the server's timezone.
 *
 * Returns 0 when `now` precedes the series, so nothing is wrongly filtered out.
 */
function seriesPosition(
  times: readonly string[],
  nowIsoLocal: string,
): number {
  let index = -1;
  for (let i = 0; i < times.length; i += 1) {
    const time = times[i];
    // Local ISO strings share one fixed-width format, so lexical order is
    // chronological.
    if (time === undefined || time > nowIsoLocal) break;
    index = i;
  }
  if (index < 0) return 0;

  const minutes = Number(nowIsoLocal.slice(14, 16));
  return Number.isFinite(minutes) ? index + minutes / 60 : index;
}

/**
 * The next low or high water at or after `nowIsoLocal`.
 *
 * Open-Meteo publishes sea level as an hourly series, not as tide extremes, so
 * a raw minimum is only accurate to ±30 minutes. Fitting a parabola through the
 * turning point and its two neighbours recovers the true vertex, which is what
 * makes "06:44" honest rather than "06:00". The vertex formula is the same for
 * a trough and a crest — only the comparison that finds the candidate flips.
 *
 * The "is it still ahead of us?" test is applied to the **interpolated vertex**,
 * not to the sample that revealed it. That distinction is the whole correctness
 * of this function: a crest sampled at 12:00 whose vertex lands at 12:21 is
 * still six minutes in the future at 12:15. Comparing the sample time instead
 * discards it and reports the *following* extreme — half a tide cycle wrong,
 * and wrong in the most confident-looking way, because the number it prints is
 * a real high water just not the next one.
 *
 * This is a prediction from a model's sea-level field, not a harmonic tide
 * table. It is right to within a few minutes, which is the right precision for
 * a band that tells you whether to go now or eat first.
 */
export function findNextTideExtreme(
  times: readonly string[],
  heights: readonly number[],
  nowIsoLocal: string,
  kind: TideExtreme,
): string | null {
  const nowPosition = seriesPosition(times, nowIsoLocal);

  for (let i = 1; i < heights.length - 1; i += 1) {
    const previous = heights[i - 1];
    const current = heights[i];
    const next = heights[i + 1];
    const time = times[i];
    if (
      previous === undefined ||
      current === undefined ||
      next === undefined ||
      time === undefined
    ) {
      continue;
    }

    const isTurningPoint =
      kind === "low"
        ? current <= previous && current <= next
        : current >= previous && current >= next;
    if (!isTurningPoint) continue;

    const curvature = previous - 2 * current + next;
    const offsetHours =
      curvature === 0 ? 0 : (0.5 * (previous - next)) / curvature;
    // Guard against a degenerate fit throwing the estimate into another hour.
    const clamped = Math.max(-1, Math.min(1, offsetHours));

    if (i + clamped < nowPosition) continue;
    return shiftClock(time, clamped * 60);
  }
  return null;
}

/** Static reading for a label, used when a source is unavailable. */
function fallbackFor(label: string): AlmanacReading {
  return (
    ALMANAC.find((reading) => reading.label === label) ?? {
      label,
      value: "—",
    }
  );
}

/**
 * Prefer the swell partition, fall back to the combined sea.
 *
 * `wave_*` is the total sea state — ground swell and local wind chop summed.
 * `swell_wave_*` is the partition that actually breaks as a rideable wave, so
 * on a blown-out afternoon the two diverge and only the swell figure is worth
 * printing. The combined value is the fallback because the partition is
 * occasionally null in the model output where the total never is.
 */
function preferSwell(
  swell: number | undefined,
  combined: number | undefined,
): number | undefined {
  return typeof swell === "number" ? swell : combined;
}

export async function getLiveAlmanacData(): Promise<readonly AlmanacReading[]> {
  const { latitude, longitude } = COAST;
  const position = `latitude=${latitude}&longitude=${longitude}`;

  const marineUrl =
    `https://marine-api.open-meteo.com/v1/marine?${position}` +
    `&current=wave_height,wave_period,wave_direction` +
    `,swell_wave_height,swell_wave_period,swell_wave_direction` +
    `,sea_surface_temperature&timezone=auto`;

  const forecastUrl =
    `https://api.open-meteo.com/v1/forecast?${position}` +
    `&current=temperature_2m,wind_speed_10m,wind_direction_10m&daily=sunrise&timezone=auto&forecast_days=1`;

  const tideUrl =
    `https://marine-api.open-meteo.com/v1/marine?${position}` +
    `&hourly=sea_level_height_msl&timezone=auto&forecast_days=2`;

  const [marine, forecast, tide] = await Promise.all([
    fetchJson<MarineResponse>(marineUrl),
    fetchJson<ForecastResponse>(forecastUrl),
    fetchJson<TideResponse>(tideUrl),
  ]);

  // Everything failed — hand back the static set untouched.
  if (!marine && !forecast && !tide) return ALMANAC;

  const readings: AlmanacReading[] = [];

  // --- Swell, period, direction -------------------------------------------
  const current = marine?.current;

  const swellHeight = preferSwell(
    current?.swell_wave_height,
    current?.wave_height,
  );
  const swellPeriod = preferSwell(
    current?.swell_wave_period,
    current?.wave_period,
  );
  const swellDirection = preferSwell(
    current?.swell_wave_direction,
    current?.wave_direction,
  );

  readings.push(
    typeof swellHeight === "number"
      ? { label: "Swell", value: swellHeight.toFixed(1), unit: "m" }
      : fallbackFor("Swell"),
  );

  readings.push(
    typeof swellPeriod === "number"
      ? { label: "Period", value: String(Math.round(swellPeriod)), unit: "s" }
      : fallbackFor("Period"),
  );

  readings.push(
    typeof swellDirection === "number"
      ? {
          label: "Direction",
          value: `${degreesToCompass(swellDirection)} ${Math.round(swellDirection)}`,
          unit: "°",
        }
      : fallbackFor("Direction"),
  );

  // --- Wind ---------------------------------------------------------------
  const wind = forecast?.current;
  readings.push(
    typeof wind?.wind_speed_10m === "number" &&
      typeof wind?.wind_direction_10m === "number"
      ? {
          label: "Wind",
          value: `${classifyWind(wind.wind_direction_10m)} ${Math.round(kmhToKnots(wind.wind_speed_10m))}`,
          unit: "kt",
        }
      : fallbackFor("Wind"),
  );

  // --- Tides --------------------------------------------------------------
  // Both extremes, because "low water 06:44" alone does not tell you whether
  // the tide is currently filling or draining — and on the reefs here that is
  // the difference between a session and a walk back over urchins.
  const times = tide?.hourly?.time;
  const levels = tide?.hourly?.sea_level_height_msl;
  // `current.time` is the marine model's own local clock. Using it rather than
  // the server's keeps the comparison inside one timezone.
  const nowLocal = current?.time;
  const hasTide = times !== undefined && levels !== undefined && nowLocal !== undefined;

  const lowWater = hasTide
    ? findNextTideExtreme(times, levels, nowLocal, "low")
    : null;
  const highWater = hasTide
    ? findNextTideExtreme(times, levels, nowLocal, "high")
    : null;

  readings.push(
    lowWater
      ? { label: "Low water", value: lowWater }
      : fallbackFor("Low water"),
  );
  readings.push(
    highWater
      ? { label: "High water", value: highWater }
      : fallbackFor("High water"),
  );

  // --- Sunrise ------------------------------------------------------------
  // Labelled "Sunrise", not "First light": Open-Meteo exposes sunrise but not
  // civil twilight, and first light is genuinely ~25–30 min earlier. Printing
  // sunrise under a "First light" label would be a quietly wrong number.
  const sunrise = forecast?.daily?.sunrise?.[0];
  readings.push(
    sunrise
      ? { label: "Sunrise", value: shiftClock(sunrise, 0) }
      : fallbackFor("Sunrise"),
  );

  // --- Sea temperature ----------------------------------------------------
  // Sea surface temperature, never `temperature_2m` — that is air temperature
  // and would read ~36°C under a label saying "Sea".
  readings.push(
    typeof current?.sea_surface_temperature === "number"
      ? {
          label: "Sea",
          value: String(Math.round(current.sea_surface_temperature)),
          unit: "°C",
        }
      : fallbackFor("Sea"),
  );

  return readings;
}
