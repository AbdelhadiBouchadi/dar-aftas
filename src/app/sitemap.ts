import type { MetadataRoute } from 'next';

import { SITE } from '@/lib/content';

/**
 * One route today. Declared properly anyway — a sitemap is cheap, and the
 * anchors below are the page's real sections, which is what search engines use
 * to build sublinks for a single-page site.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
