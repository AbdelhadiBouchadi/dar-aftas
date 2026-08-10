import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // AVIF first — it wins decisively on photographic content. The hero is
    // pre-encoded and served via <picture>; this covers the six photographs
    // that go through next/image.
    formats: ['image/avif', 'image/webp'],
    // Matches the real slot widths: 40vw, 58vw and 100vw across our
    // breakpoints. Trimming the default ladder avoids generating variants
    // nothing ever requests.
    deviceSizes: [640, 828, 1080, 1200, 1600, 1920, 2560],
    imageSizes: [256, 384, 512, 768],
  },
};

export default nextConfig;
