/**
 * @file src/prerender.tsx
 * Simple SSG entry for vite-prerender-plugin.
 *
 * Per route it renders the real page to HTML (`renderToString` over a
 * `StaticRouter`), prefetching that route's live API data into a
 * QueryClient first so crawlers see content — never skeletons.
 * The dehydrated cache is embedded (`#vv-query-state`) so client
 * hydration matches the SSR HTML exactly.
 *
 * Live data, zero mocks: blog slugs come from GET /getBlogs, article
 * meta from GET /getBlogsBySlug, FAQs from GET /getFAQBySlug. Every
 * fetch is best-effort — the build never fails on API trouble.
 */
import { renderToString } from 'react-dom/server';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { StaticRouter } from 'react-router';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './modules/home/pages/HomePage';
import { AboutPage } from './modules/about/pages/AboutPage';
import { ServicesPage } from './modules/services/pages/ServicesPage';
import { GalleryPage } from './modules/gallery/pages/GalleryPage';
import { BlogPage } from './modules/blog/pages/BlogPage';
import { BlogDetailPage } from './modules/blog/pages/BlogDetailPage';
import { ContactPage } from './modules/contact/pages/ContactPage';
import {
  blogImageOf,
  getBlogBySlug,
  getBlogs,
  getFeaturedBlogs,
  getFrontBlogs,
} from './modules/blog/api/blogApi';
import { blogKeys } from './modules/blog/hooks/useBlogs';
import { getFaqBySlug } from './modules/home/api/faqApi';
import { faqKeys } from './modules/home/hooks/useFaq';
import { getTestimonials } from './modules/home/api/testimonialApi';
import { testimonialKeys } from './modules/home/hooks/useTestimonials';
import { SEO_CONFIG, getCanonicalUrl, SITE_NAME, type SeoKey } from './seo/seo';
import {
  blogPostingSchema,
  breadcrumbSchema,
  createCompositeGraph,
  faqPageSchema,
  itemListSchema,
  organizationSchema,
  reviewSchema,
  webPageSchema,
  websiteSchema,
} from './seo/schemas';
import type { BlogDetailResponse } from './lib/api/types';
import type { BlogPost, FaqItem, Testimonial } from './lib/api/types';
import type { Thing } from 'schema-dts';

/* ------------------------------------------------------------------ */
/* Small module-level cache so repeated prerender() calls share fetches */
/* ------------------------------------------------------------------ */

const dataCache = new Map<string, unknown>();

async function cached<T>(key: readonly unknown[], fn: () => Promise<T>): Promise<T | null> {
  const cacheKey = JSON.stringify(key);
  if (dataCache.has(cacheKey)) return (dataCache.get(cacheKey) ?? null) as T | null;
  try {
    const data = await fn();
    dataCache.set(cacheKey, data);
    return data;
  } catch {
    dataCache.set(cacheKey, null);
    return null;
  }
}

function seed<T>(client: QueryClient, key: readonly unknown[], data: T | null): void {
  if (data !== null && data !== undefined) client.setQueryData(key, data);
}

/* ------------------------------------------------------------------ */
/* Live data (best-effort)                                             */
/* ------------------------------------------------------------------ */

async function liveBlogSlugs(): Promise<string[]> {
  const slugs = (await liveBlogList()).map((post) => blogSlugOf(post)).filter(Boolean);
  return Array.from(new Set(slugs));
}

async function liveBlogList(): Promise<BlogPost[]> {
  const res = await cached(blogKeys.list(), getBlogs);
  const rows = res && Array.isArray(res.data) ? res.data : [];
  return rows.filter((post) => blogSlugOf(post));
}

function blogSlugOf(post: BlogPost): string {
  if (typeof post.blog_slug === 'string' && post.blog_slug.trim()) return post.blog_slug.trim();
  if (typeof post.slug === 'string' && post.slug.trim()) return post.slug.trim();
  return '';
}

function blogTitleOf(post: BlogPost, fallback = 'Article'): string {
  const title = String(post.blog_title ?? post.title ?? '').trim();
  return title || fallback;
}

function blogDescOf(post: BlogPost, fallback: string): string {
  if (typeof post.blog_short_description === 'string' && post.blog_short_description.trim()) {
    return post.blog_short_description.trim();
  }
  return stripHtml(post.blog_description).slice(0, 160) || fallback;
}

function clampRating(value: unknown): number {
  const num = Number(value ?? 5);
  return Number.isFinite(num) ? Math.min(5, Math.max(1, Math.round(num))) : 5;
}

interface UsableReview {
  name: string;
  body: string;
  rating: number;
  date: unknown;
}

/** Live testimonial rows clean enough for schema (UI still shows all rows). */
function usableReviews(rows: Testimonial[]): UsableReview[] {
  return (rows ?? [])
    .map((item) => ({
      name: String(item.testimonial_client_name ?? item.name ?? '').trim(),
      body: stripHtml(item.testimonial_description ?? item.quote),
      rating: clampRating(item.testimonial_rating ?? item.rating),
      date: item.testimonial_created_date ?? null,
    }))
    .filter((row) => row.name.length > 0 && row.body.length >= 10);
}

function aggregateOf(rows: UsableReview[]): { ratingValue: number; reviewCount: number } {
  const avg = rows.reduce((sum, row) => sum + row.rating, 0) / rows.length;
  return { ratingValue: Math.round(avg * 10) / 10, reviewCount: rows.length };
}

async function liveBlogDetail(slug: string): Promise<BlogDetailResponse | null> {
  return cached(blogKeys.detail(slug), () => getBlogBySlug(slug));
}

async function liveFaqs(slug: string): Promise<FaqItem[]> {
  const res = await cached(faqKeys.bySlug(slug), () => getFaqBySlug(slug));
  return res && Array.isArray(res.data) ? res.data : [];
}

async function liveTestimonials(slug: string): Promise<Testimonial[]> {
  const res = await cached(testimonialKeys.bySlug(slug), () => getTestimonials(slug));
  return res && Array.isArray(res.data) ? res.data : [];
}

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */

interface StaticRoute {
  path: string;
  key: SeoKey;
  crumbs: { name: string; path: string }[];
  faqSlug: string;
  testiSlug: string;
}

const STATIC_ROUTES: StaticRoute[] = [
  {
    path: '/',
    key: 'home',
    crumbs: [{ name: 'Home', path: '/' }],
    faqSlug: 'home',
    testiSlug: 'home',
  },
  {
    path: '/about',
    key: 'about',
    crumbs: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ],
    faqSlug: 'about-us',
    testiSlug: 'about-us',
  },
  {
    path: '/services',
    key: 'services',
    crumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
    ],
    faqSlug: 'services',
    testiSlug: 'services',
  },
  {
    path: '/gallery',
    key: 'gallery',
    crumbs: [
      { name: 'Home', path: '/' },
      { name: 'Gallery', path: '/gallery' },
    ],
    faqSlug: 'gallery',
    testiSlug: 'gallery',
  },
  {
    path: '/blog',
    key: 'blog',
    crumbs: [
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
    ],
    faqSlug: 'blogs',
    testiSlug: 'blogs',
  },
  {
    path: '/contact',
    key: 'contact',
    crumbs: [
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' },
    ],
    faqSlug: 'contact',
    testiSlug: 'contact',
  },
];

function stripHtml(value: unknown): string {
  return typeof value === 'string' ? value.replace(/<[^>]+>/g, '').trim() : '';
}

/* ------------------------------------------------------------------ */
/* Head elements (react-helmet-async adopts these via data-rh on hydrate) */
/* ------------------------------------------------------------------ */

interface HeadInput {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  schemas: Thing[];
  queryState: string | null;
}

type HeadElement = { type: string; props: Record<string, string>; children?: string };

function headElements(input: HeadInput): Set<HeadElement> {
  const rh = 'true';
  const canonical = getCanonicalUrl(input.canonicalPath);
  const elements: HeadElement[] = [
    { type: 'meta', props: { name: 'description', content: input.description, 'data-rh': rh } },
    { type: 'meta', props: { name: 'keywords', content: input.keywords, 'data-rh': rh } },
    { type: 'meta', props: { name: 'robots', content: 'index, follow', 'data-rh': rh } },
    { type: 'meta', props: { name: 'author', content: SITE_NAME, 'data-rh': rh } },
    { type: 'link', props: { rel: 'canonical', href: canonical, 'data-rh': rh } },
    { type: 'meta', props: { property: 'og:type', content: 'website', 'data-rh': rh } },
    { type: 'meta', props: { property: 'og:site_name', content: SITE_NAME, 'data-rh': rh } },
    { type: 'meta', props: { property: 'og:title', content: input.title, 'data-rh': rh } },
    { type: 'meta', props: { property: 'og:description', content: input.description, 'data-rh': rh } },
    { type: 'meta', props: { property: 'og:url', content: canonical, 'data-rh': rh } },
    { type: 'meta', props: { name: 'twitter:card', content: 'summary_large_image', 'data-rh': rh } },
    { type: 'meta', props: { name: 'twitter:title', content: input.title, 'data-rh': rh } },
    { type: 'meta', props: { name: 'twitter:description', content: input.description, 'data-rh': rh } },
  ];
  if (input.queryState) {
    elements.push({
      type: 'script',
      props: { id: 'vv-query-state', type: 'application/json', 'data-rh': rh },
      children: input.queryState,
    });
  }
  if (input.schemas.length > 0) {
    elements.push({
      type: 'script',
      props: { type: 'application/ld+json', id: 'vv-rich-results', 'data-rh': rh },
      children: JSON.stringify(createCompositeGraph(input.schemas)),
    });
  }
  return new Set(elements);
}

/* ------------------------------------------------------------------ */
/* prerender()                                                         */
/* ------------------------------------------------------------------ */

export async function prerender(data: { url: string }) {
  const url = data.url || '/';
  const cleanPath = url.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';

  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });

  let title = SEO_CONFIG.home.title;
  let description = SEO_CONFIG.home.description;
  let keywords = SEO_CONFIG.home.keywords;
  let canonicalPath = '/';
  const schemas: Thing[] = [];

  const blogMatch = cleanPath.match(/^\/blog\/([^/]+)$/);
  const staticRoute = STATIC_ROUTES.find((route) => route.path === cleanPath);

  if (blogMatch) {
    // Live article page: /blog/:slug
    const slug = decodeURIComponent(blogMatch[1]).trim();
    canonicalPath = `/blog/${slug}`;
    const live = await liveBlogDetail(slug);
    const post = live?.data ?? null;
    if (post) {
      const postTitle = String(post.blog_title ?? post.title ?? slug);
      const postDesc =
        (typeof post.blog_short_description === 'string' && post.blog_short_description.trim()) ||
        stripHtml(post.blog_description).slice(0, 160) ||
        postTitle;
      title = `${postTitle} | ${SITE_NAME} Beauty & Wellness Blog`;
      description = postDesc;
      keywords = `${postTitle}, beauty blog, VV Studio`;
      seed(client, blogKeys.detail(slug), live);
      schemas.push(
        organizationSchema(),
        webPageSchema(canonicalPath, title, description),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: postTitle, path: canonicalPath },
        ]),
        blogPostingSchema({
          slug,
          title: postTitle,
          description: postDesc,
          image: blogImageOf(post, live?.image_url ?? []),
          datePublished: post.blog_created_date ?? post.created_at ?? post.date ?? '',
          category:
            typeof post.categories === 'string'
              ? post.categories
              : typeof post.category === 'string'
                ? post.category
                : undefined,
        }),
      );
      const faq = faqPageSchema(live?.faq ?? []);
      if (faq) schemas.push(faq);
    } else {
      schemas.push(
        organizationSchema(),
        webPageSchema(canonicalPath, title, description),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ]),
      );
    }
  } else if (staticRoute) {
    // Static page with live FAQs + testimonials prefetched for SSR body
    const cfg = SEO_CONFIG[staticRoute.key];
    title = cfg.title;
    description = cfg.description;
    keywords = cfg.keywords;
    canonicalPath = cfg.path;

    const [faqs, testimonials] = await Promise.all([
      liveFaqs(staticRoute.faqSlug),
      liveTestimonials(staticRoute.testiSlug),
    ]);
    seed(client, faqKeys.bySlug(staticRoute.faqSlug), { data: faqs });
    seed(client, testimonialKeys.bySlug(staticRoute.testiSlug), { data: testimonials });

    const isHome = staticRoute.path === '/';
    const usable = usableReviews(testimonials);

    let front: Awaited<ReturnType<typeof getFrontBlogs>> | null = null;
    let all: Awaited<ReturnType<typeof getBlogs>> | null = null;
    if (isHome) {
      const [frontRes, featuredRes] = await Promise.all([
        cached(blogKeys.front(), getFrontBlogs),
        cached(blogKeys.featured(), getFeaturedBlogs),
      ]);
      front = frontRes;
      seed(client, blogKeys.front(), frontRes);
      seed(client, blogKeys.featured(), featuredRes);
    }
    if (staticRoute.path === '/blog') {
      const [allRes, featuredRes] = await Promise.all([
        cached(blogKeys.list(), getBlogs),
        cached(blogKeys.featured(), getFeaturedBlogs),
      ]);
      all = allRes;
      seed(client, blogKeys.list(), allRes);
      seed(client, blogKeys.featured(), featuredRes);
    }

    // Organization first (with aggregate rating on home when reviews exist)
    schemas.push(
      organizationSchema(isHome && usable.length > 0 ? aggregateOf(usable) : undefined),
    );
    schemas.push(webPageSchema(canonicalPath, title, description));
    if (isHome) {
      schemas.push(websiteSchema());
      // Live front articles as BlogPosting nodes (max 3)
      const rows = front && Array.isArray(front.data) ? front.data.slice(0, 3) : [];
      const entries = front && Array.isArray(front.image_url) ? front.image_url : [];
      for (const post of rows) {
        const slug = blogSlugOf(post);
        if (!slug) continue;
        const postTitle = blogTitleOf(post);
        schemas.push(
          blogPostingSchema({
            slug,
            title: postTitle,
            description: blogDescOf(post, postTitle),
            image: blogImageOf(post, entries),
            datePublished: post.blog_created_date ?? post.created_at ?? post.date ?? '',
          }),
        );
      }
    }
    if (staticRoute.path === '/blog') {
      // Live article index as an ItemList
      const rows = all && Array.isArray(all.data) ? all.data : [];
      const items = rows
        .map((post) => ({ name: blogTitleOf(post), path: `/blog/${blogSlugOf(post)}` }))
        .filter((item) => item.path !== '/blog/');
      if (items.length > 0) schemas.push(itemListSchema(items));
    }
    schemas.push(breadcrumbSchema(staticRoute.crumbs));
    // Live testimonial Review nodes (schema-clean rows only)
    for (const review of usable) {
      schemas.push(
        reviewSchema({
          name: review.name,
          body: review.body,
          rating: review.rating,
          datePublished: review.date,
        }),
      );
    }
    const faq = faqPageSchema(faqs);
    if (faq) schemas.push(faq);
  } else {
    // Unknown path — org + home head defaults only, never a 404 entry.
    schemas.push(organizationSchema());
  }

  let html = '';
  try {
    html = renderToString(
      <StaticRouter location={url}>
        <Routes>
          <Route path="/" element={<HomePage seoKey="home" />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage seoKey="home" />} />
        </Routes>
      </StaticRouter>,
    );
  } catch (err) {
    console.warn(`⚠️ [SSG] render failed for ${url}, emitting head-only HTML:`, (err as Error)?.message ?? err);
  }

  const dehydrated = JSON.stringify(dehydrate(client)).replace(/</g, '\\u003c');
  const queryState = dehydrated.includes('"queries":[]') ? null : dehydrated;

  // Explicit route list: static pages + every live article (crawling alone
  // would miss /blog/:slug — cards render client-side only).
  const slugs = await liveBlogSlugs();
  const links = new Set<string>([
    ...STATIC_ROUTES.map((route) => route.path),
    ...slugs.map((slug) => `/blog/${slug}`),
  ]);

  return {
    html,
    head: {
      lang: 'en',
      title,
      elements: headElements({ title, description, keywords, canonicalPath, schemas, queryState }),
    },
    links,
    data: { url },
  };
}
