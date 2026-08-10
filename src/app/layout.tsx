import type { Metadata, Viewport } from "next";

import { Cursor } from "@/components/animations/Cursor";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SEO, SITE } from "@/lib/content";
import { fontBody, fontDisplay, fontMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SEO.keywords],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Never cap zoom — pinch-zoom is an accessibility requirement.
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8dfd3" },
    { media: "(prefers-color-scheme: dark)", color: "#1c2321" },
  ],
};

/**
 * Sets `html.js` before first paint so reveal targets can be hidden without a
 * flash — and, critically, stay visible when JavaScript is unavailable.
 */
const JS_ENABLED_SCRIPT = `document.documentElement.classList.add('js')`;

/** Structured data — hospitality search results lean heavily on this. */
const lodgingJsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.locality,
    addressRegion: SITE.region,
    addressCountry: SITE.countryCode,
  },
  amenityFeature: SEO.amenities.map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  })),
} as const;

export interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en" className={cn(fontDisplay.variable, fontBody.variable, fontMono.variable)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_ENABLED_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingJsonLd) }}
        />
      </head>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {/* Keyboard users must be able to bypass the header. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-100 focus:bg-basalt focus:px-5 focus:py-3 focus:text-sand label-mono"
        >
          Skip to content
        </a>

        <SmoothScroll>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          {/* Both self-disable on coarse pointers and under reduced motion. */}
          <Cursor />
          <ScrollProgress />
        </SmoothScroll>
      </body>
    </html>
  );
}
