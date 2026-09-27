/**
 * VV Studio on-page SEO runtime (client side).
 *
 * - `SEO_CONFIG` — per-route title/description/keywords (single source).
 * - `useSEO(key)` — pages call this; head tags are applied via
 *   react-helmet-async through the mounted `<SeoHost/>`.
 * - `injectLocalBusinessSchema()` — idempotent BeautySalon JSON-LD
 *   fallback (skipped when the prerendered graph is already present).
 * - `LOCAL_IMAGE_BASE` — public image prefix shared with `index.html`
 *   preloads (must stay `/images`).
 */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_ORIGIN, getCanonicalUrl, organizationSchema, createCompositeGraph } from './schemas';

export { SITE_NAME, SITE_ORIGIN, getCanonicalUrl };

/** Public `/images` prefix (mirrors the preloads in `index.html`). */
export const LOCAL_IMAGE_BASE = '/images';

export interface SeoRouteConfig {
  title: string;
  description: string;
  keywords: string;
  path: string;
}

export const SEO_CONFIG = {
  home: {
    title: 'VV Studio | Luxury Salon & Spa in JP Nagar, Bangalore',
    description:
      "VV Studio is Bangalore's premier luxury beauty salon offering personalized skin treatments, expert hair care, bridal makeup, and rejuvenating spa therapies.",
    keywords:
      'luxury salon in JP Nagar, salon in JP Nagar Bangalore, spa in JP Nagar, beauty salon Bangalore, bridal makeup Bangalore, hair salon JP Nagar',
    path: '/',
  },
  about: {
    title: 'About VV Studio Luxury Salon & Spa',
    description:
      'Discover the story behind VV Studio — JP Nagar’s luxury salon & spa for skin, hair, bridal and wellness, crafted around you.',
    keywords: 'about VV Studio, luxury salon JP Nagar, beauty studio Bangalore',
    path: '/about',
  },
  services: {
    title: 'VV Studio Beauty & Spa Services',
    description:
      'Explore skin & facials, hair care, waxing & threading, bridal makeup, hand & feet care and spa rituals at VV Studio, JP Nagar Bangalore.',
    keywords: 'salon services JP Nagar, facials Bangalore, hair spa, bridal makeup, manicure pedicure',
    path: '/services',
  },
  gallery: {
    title: 'VV Studio Salon & Beauty Gallery',
    description:
      'Browse real bridal, hair, skin and nail transformations at VV Studio luxury salon & spa, JP Nagar Bangalore.',
    keywords: 'salon gallery, bridal looks, hair transformations, VV Studio work',
    path: '/gallery',
  },
  blog: {
    title: 'VV Studio Beauty & Wellness Blog',
    description:
      'Beauty tips, trends & wellness stories from VV Studio experts — skincare, haircare, bridal beauty and self-care rituals.',
    keywords: 'beauty blog, skincare tips, haircare guides, bridal beauty, VV Studio journal',
    path: '/blog',
  },
  contact: {
    title: 'VV Studio Contact Information',
    description:
      'Visit VV Studio at JP Nagar, Bangalore or call 080-48531999. Open Tue–Sun, 10 AM–8 PM for salon, spa & bridal bookings.',
    keywords: 'VV Studio contact, salon JP Nagar address, book appointment, spa booking Bangalore',
    path: '/contact',
  },
} satisfies Record<string, SeoRouteConfig>;

export type SeoKey = keyof typeof SEO_CONFIG;

interface HeadState {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
}

function headOf(key: SeoKey): HeadState {
  const cfg = SEO_CONFIG[key];
  return {
    title: cfg.title,
    description: cfg.description,
    keywords: cfg.keywords,
    canonical: getCanonicalUrl(cfg.path),
  };
}

let currentHead: HeadState = headOf('home');
const headListeners = new Set<(head: HeadState) => void>();

/**
 * Pages call `useSEO('<route-key>')` — head tags update through the
 * mounted `<SeoHost/>` (react-helmet-async). No-op during SSR.
 */
export function useSEO(seoKey: SeoKey): void {
  useEffect(() => {
    currentHead = headOf(seoKey);
    headListeners.forEach((listener) => listener(currentHead));
  }, [seoKey]);
}

/**
 * Mount once near the root (inside `<HelmetProvider>`) — renders the
 * helmet-managed head tags for SPA navigation.
 */
export const SeoHost: React.FC = () => {
  const [head, setHead] = useState<HeadState>(currentHead);

  useEffect(() => {
    headListeners.add(setHead);
    return () => {
      headListeners.delete(setHead);
    };
  }, []);

  return (
    <Helmet>
      <title>{head.title}</title>
      <meta name="description" content={head.description} />
      <meta name="keywords" content={head.keywords} />
      <link rel="canonical" href={head.canonical} />
      <meta name="robots" content="index, follow" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={head.title} />
      <meta property="og:description" content={head.description} />
      <meta property="og:url" content={head.canonical} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={head.title} />
      <meta name="twitter:description" content={head.description} />
    </Helmet>
  );
};

/**
 * Idempotent BeautySalon JSON-LD fallback for client-only renders.
 * Skipped when the prerendered `#vv-rich-results` graph is present.
 */
export function injectLocalBusinessSchema(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById('vv-rich-results')) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'vv-rich-results';
  script.text = JSON.stringify(createCompositeGraph([organizationSchema()]));
  document.head.appendChild(script);
}
