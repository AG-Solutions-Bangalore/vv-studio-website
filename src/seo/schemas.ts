/**
 * Typed JSON-LD builders for Google rich results (schema-dts).
 *
 * Every builder returns plain `Thing` nodes; `createCompositeGraph`
 * wraps them in a single `@context/@graph` script. All data below is
 * real VV Studio business data (no mocks).
 */
import type {
  AggregateRating,
  BeautySalon,
  BlogPosting,
  BreadcrumbList,
  FAQPage,
  GeoCoordinates,
  ItemList,
  OpeningHoursSpecification,
  PostalAddress,
  Review,

  Thing,
  WebPage,
  WebSite,
} from 'schema-dts';

export const SITE_ORIGIN = 'https://vvs.agsdemo.in';
export const SITE_NAME = 'VV Studio';
export const SITE_LOGO = `${SITE_ORIGIN}/logo.webp`;

const ORG_ID = `${SITE_ORIGIN}/#organization`;
const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

/** Absolute canonical URL for any internal path. */
export function getCanonicalUrl(pathname: string): string {
  const clean = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  return clean ? `${SITE_ORIGIN}/${clean}` : `${SITE_ORIGIN}/`;
}

function stripHtml(value: unknown): string {
  return typeof value === 'string' ? value.replace(/<[^>]+>/g, '').trim() : '';
}

/** `YYYY-MM-DD` → full ISO with IST offset (Google rich-result rule). */
export function toIsoDate(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const raw = value.trim();
  if (/^\d{4}-\d{2}-\d{2}T/.test(raw)) return raw;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (!match) {
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }
  return `${match[1]}-${match[2]}-${match[3]}T00:00:00+05:30`;
}

/** VV Studio as a BeautySalon — the site-wide Organization node. */
export function organizationSchema(aggregate?: {
  ratingValue: number;
  reviewCount: number;
}): BeautySalon {
  const address: PostalAddress = {
    '@type': 'PostalAddress',
    streetAddress: '#5, 1st Floor, 24th Main, 5th Phase, JP Nagar',
    addressLocality: 'Bangalore',
    addressRegion: 'Karnataka',
    postalCode: '560078',
    addressCountry: 'IN',
  };
  const geo: GeoCoordinates = {
    '@type': 'GeoCoordinates',
    latitude: 12.9057,
    longitude: 77.5858,
  };
  const hours: OpeningHoursSpecification = {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '10:00',
    closes: '20:00',
  };
  return {
    '@type': 'BeautySalon',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    logo: SITE_LOGO,
    image: `${SITE_ORIGIN}/images/home/home_top_banner.webp`,
    description:
      "VV Studio is Bangalore's premier luxury beauty salon offering personalized skin treatments, expert hair care, bridal makeup, and rejuvenating spa therapies.",
    telephone: ['+91-80-48531999', '+91-8310782820'],
    email: 'info@varvadhustudio.com',
    address,
    geo,
    openingHoursSpecification: hours,
    priceRange: '₹₹',
    ...(aggregate && aggregate.reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: aggregate.ratingValue,
            reviewCount: aggregate.reviewCount,
            bestRating: 5,
          } satisfies AggregateRating,
        }
      : {}),
  };
}

/** WebSite node (home page only). */
export function websiteSchema(): WebSite {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_ORIGIN}/`,
    name: SITE_NAME,
    publisher: { '@id': ORG_ID },
  };
}

/** WebPage node for any route. */
export function webPageSchema(path: string, title: string, description: string): WebPage {
  return {
    '@type': 'WebPage',
    url: getCanonicalUrl(path),
    name: title,
    description,
    isPartOf: { '@id': WEBSITE_ID },
  };
}

/** BreadcrumbList for Home → … → current page. */
export function breadcrumbSchema(items: { name: string; path: string }[]): BreadcrumbList {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  };
}

export interface FaqRowInput {
  faq_que?: unknown;
  faq_ans?: unknown;
  faq_question?: unknown;
  faq_answer?: unknown;
}

/**
 * FAQPage from live FAQ rows. Rows with empty or placeholder-short
 * Q/A are skipped — schema quality matters to Google even though the
 * visible accordion shows backend rows as-is.
 */
export function faqPageSchema(rows: FaqRowInput[]): FAQPage | null {
  const usable = (rows ?? [])
    .map((row) => ({
      question: stripHtml(row.faq_que ?? row.faq_question),
      answer: stripHtml(row.faq_ans ?? row.faq_answer),
    }))
    .filter((row) => row.question.length >= 10 && row.answer.length >= 10);
  if (usable.length === 0) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: usable.map((row) => ({
      '@type': 'Question',
      name: row.question,
      acceptedAnswer: { '@type': 'Answer', text: row.answer },
    })),
  };
}

export interface BlogPostingInput {
  slug: string;
  title: string;
  description: string;
  image: string;
  datePublished: unknown;
  category?: string;
}
/** BlogPosting for a live article (detail pages only). */
export function blogPostingSchema(post: BlogPostingInput): BlogPosting {
  const url = getCanonicalUrl(`/blog/${post.slug}`);
  const datePublished = toIsoDate(post.datePublished) ?? undefined;
  return {
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image,
    url,
    mainEntityOfPage: url,
    ...(datePublished ? { datePublished } : {}),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${SITE_ORIGIN}/`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: SITE_LOGO,
    },
  };
}

/** Single `@context/@graph` envelope for the JSON-LD script tag. */
export function createCompositeGraph(nodes: Thing[]): Record<string, unknown> {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export interface ReviewInput {
  name: string;
  body: string;
  rating: number;
  datePublished: unknown;
}

/** Standalone Review node for a live testimonial (Google review snippets). */
export function reviewSchema(review: ReviewInput): Review {
  const datePublished = toIsoDate(review.datePublished) ?? undefined;
  return {
    '@type': 'Review',
    author: { '@type': 'Person', name: review.name },
    reviewBody: review.body,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
    },
    ...(datePublished ? { datePublished } : {}),
    itemReviewed: { '@id': ORG_ID },
  };
}

/** ItemList of live articles (blog listing page). */
export function itemListSchema(items: { name: string; path: string }[]): ItemList {
  return {
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  };
}
