import { Bodoni_Moda, JetBrains_Mono, Jost } from "next/font/google";

/**
 * Display: Bodoni Moda. High-contrast didone — the thin/thick stress reads as
 * expensive at large sizes and holds up at 900 weight for the wordmark.
 * Optical size axis is why this over Playfair: it stays sharp at 12rem.
 */
export const fontDisplay = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--ff-display",
  display: "swap",
});

/**
 * Body: Jost. Geometric grotesque with a slightly humanist tail — pairs with
 * a didone without competing, and its light weights hold at large sizes.
 */
export const fontBody = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--ff-body",
  display: "swap",
});

/**
 * Data: JetBrains Mono. Used only for almanac readings, tide times and break
 * specs — instrument data, set as instrument data. Tabular figures prevent
 * layout shift as values change.
 */
export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--ff-mono",
  display: "swap",
});
