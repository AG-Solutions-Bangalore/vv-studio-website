import { apiClient } from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { BlogDetailResponse, BlogListResponse, BlogPost, ImageUrlEntry } from '../types';
import type { BlogItem } from '@/data/salonData';

/** GET /getFrontBlogs — homepage blog rail. */
export async function getFrontBlogs(): Promise<BlogListResponse> {
  const { data } = await apiClient.get<BlogListResponse>(ENDPOINTS.frontBlogs);
  return data;
}

/** GET /getFeaturedBlogs — featured posts. */
export async function getFeaturedBlogs(): Promise<BlogListResponse> {
  const { data } = await apiClient.get<BlogListResponse>(ENDPOINTS.featuredBlogs);
  return data;
}

/** GET /getBlogs — full journal grid (Blog page). */
export async function getBlogs(): Promise<BlogListResponse> {
  const { data } = await apiClient.get<BlogListResponse>(ENDPOINTS.blogs);
  return data;
}

/** GET /getBlogsBySlug/{slug} — single article + prev/next. */
export async function getBlogBySlug(slug: string): Promise<BlogDetailResponse> {
  const { data } = await apiClient.get<BlogDetailResponse>(
    ENDPOINTS.blogBySlug(slug),
  );
  return data;
}

/** URL-safe slug from a title (used for static fallback articles). */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Detail path for a static fallback article. */
export function staticBlogDetailPath(blog: Pick<BlogItem, 'title'>): string {
  return `/blog/${slugify(blog.title)}`;
}

/** Card item carrying the backend slug for detail links. */
export interface LiveBlogItem extends BlogItem {
  slug: string;
}

/** Detail path for any card item (live slug wins, else slugified title). */
export function blogDetailPath(blog: BlogItem): string {
  const slug = (blog as Partial<LiveBlogItem>).slug;
  return `/blog/${typeof slug === 'string' && slug ? slug : slugify(blog.title)}`;
}

/**
 * Resolve a post image to a full URL: absolute/local paths pass through,
 * backend-relative names (`image` / `blog_banner_image`) resolve against
 * the response `Blog` base URL, missing images fall back to `No Image`.
 */
export function blogImageOf(post: BlogPost, imageEntries: ImageUrlEntry[]): string {
  const rawImage =
    typeof post.image === 'string' && post.image
      ? post.image
      : typeof post.blog_banner_image === 'string'
        ? post.blog_banner_image
        : '';
  if (!rawImage) {
    return imageEntries.find((entry) => entry.image_for === 'No Image')?.image_url ?? '';
  }
  if (rawImage.startsWith('http') || rawImage.startsWith('/')) return rawImage;
  const base = imageEntries.find((entry) => entry.image_for === 'Blog')?.image_url ?? '';
  return `${base}${rawImage}`;
}

/** Slug identifying a live API post (`blog_slug` first, else slugified title). */
export function liveBlogSlug(post: BlogPost): string {
  if (typeof post.blog_slug === 'string' && post.blog_slug) return post.blog_slug;
  if (typeof post.slug === 'string' && post.slug) return post.slug;
  return slugify(String(post.blog_title ?? post.title ?? 'article'));
}

/** Decode common HTML entities (`&nbsp;`, `&rsquo;`, …) to plain text. */
export function decodeHtmlEntities(input: string): string {
  if (!input) return '';
  return input
    .replace(/&#(\d+);/g, (_, code: string) => {
      const n = Number(code);
      return Number.isFinite(n) ? String.fromCharCode(n) : '';
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;|&ldquo;|&rdquo;/gi, '"')
    .replace(/&#39;|&apos;|&lsquo;|&rsquo;|&prime;/gi, "'")
    .replace(/&ndash;|&#8211;/gi, '–')
    .replace(/&mdash;|&#8212;/gi, '—')
    .replace(/&hellip;/gi, '…')
    .replace(/&copy;/gi, '©')
    .replace(/&reg;/gi, '®')
    .replace(/&trade;/gi, '™');
}

/** Raw HTML body from a post (usually `blog_description`). */
export function blogHtmlSourceOf(post: BlogPost): string {
  const raw = [post.blog_description, post.content, post.description, post.excerpt].find(
    (v) => typeof v === 'string' && v.trim(),
  );
  return typeof raw === 'string' ? raw : '';
}

/**
 * Minimal sanitizer for trusted CMS HTML — strips executable content
 * (`script`/`style`/`iframe`, inline handlers, `javascript:` URLs).
 */
export function sanitizeBlogHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/\s+on\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\s+on\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/(href|src)\s*=\s*(['"])\s*javascript:.*?\2/gi, '$1="#"');
}

/**
 * Cleaned, render-ready article HTML:
 * - drops stray `<br>` the CMS puts at the start of headings
 *   (`<h2><br />Title` → `<h2>Title`)
 * - drops trailing `<br>` / `&nbsp;` before a block close
 * - drops empty `&nbsp;`-only paragraphs
 */
export function cleanBlogHtml(html: string): string {
  if (!html) return '';
  let out = sanitizeBlogHtml(html);
  out = out.replace(/<h([1-6])[^>]*>\s*<br\s*\/?>\s*/gi, '<h$1>');
  out = out.replace(/<br\s*\/?>\s*(&nbsp;)?\s*(<\/(p|h[1-6]|li)>)/gi, '$2');
  out = out.replace(/<p[^>]*>\s*(&nbsp;|\s|<br\s*\/?>)*\s*<\/p>/gi, '');
  return out.trim();
}

/** Render-ready article HTML (`''` when the post has no body). */
export function blogHtmlOf(post: BlogPost): string {
  return cleanBlogHtml(blogHtmlSourceOf(post));
}

/** Single TOC entry extracted from article headings. */
export interface BlogTocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Inject unique `id` anchors into `h2`/`h3` tags and return the TOC.
 * Run once per article — sidebar links to `#id`, headings get `scroll-mt`
 * via the detail page styles so anchors land below the fixed header.
 */
export function withBlogHeadingIds(html: string): { html: string; toc: BlogTocItem[] } {
  if (!html) return { html: '', toc: [] };
  const toc: BlogTocItem[] = [];
  const used = new Set<string>();
  const idFor = (text: string): string => {
    const base = slugify(text).slice(0, 60) || 'section';
    let id = base;
    let n = 2;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id);
    return id;
  };
  const out = html.replace(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, lvl: string, inner: string) => {
    const text = decodeHtmlEntities(inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
    if (!text) return `<h${lvl}>${inner}</h${lvl}>`;
    const level = Number(lvl) === 3 ? 3 : 2;
    const id = idFor(text);
    toc.push({ id, text, level: level as 2 | 3 });
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });
  return { html: out, toc };
}

/** Plain-text paragraphs from a post body (tags stripped, entities decoded). */
export function blogBodyOf(post: BlogPost): string[] {
  const raw = blogHtmlSourceOf(post);
  if (!raw) return [];
  const withBreaks = raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(h[1-6]|p|li|div|ul|ol)>/gi, '\n')
    .replace(/<(h[1-6]|p|li|div|ul|ol)[^>]*>/gi, '\n');
  return withBreaks
    .split(/\n+/)
    .map((p) => decodeHtmlEntities(p.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()))
    .map((p) => p.replace(/^\s*&nbsp;\s*|\s*&nbsp;\s*$/g, '').trim())
    .filter(Boolean);
}

/** `X min read` derived from the body (~200 wpm), unless provided. */
export function blogReadTimeOf(post: BlogPost): string {
  if (typeof post.read_time === 'string' && post.read_time) return post.read_time;
  if (typeof post.readTime === 'string' && post.readTime) return post.readTime;
  const words = blogBodyOf(post)
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  if (words === 0) return '';
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function prettyDateOf(raw: string): string {
  if (!raw) return '';
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Fully normalized post — single source of truth for list + detail UI. */
export interface NormalizedBlog {
  key: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  date: string;
  body: string[];
  /** Cleaned HTML for the detail page (headings / paragraphs preserved). */
  html: string;
}

function plainTextOf(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) return '';
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
}

export function normalizeBlogPost(
  post: BlogPost,
  imageEntries: ImageUrlEntry[],
  index = 0,
): NormalizedBlog {
  const title = String(post.blog_title ?? post.title ?? 'Untitled');
  const body = blogBodyOf(post);
  const html = blogHtmlOf(post);
  const rawExcerpt = String(
    post.blog_short_description ?? post.excerpt ?? post.description ?? body[0] ?? '',
  );
  const excerpt = plainTextOf(rawExcerpt);
  const rawDate = String(post.blog_created_date ?? post.date ?? post.created_at ?? '');
  return {
    key: String(post.id ?? post.blog_slug ?? post.slug ?? `live-${index}`),
    slug: liveBlogSlug(post),
    title,
    category: String(post.categories ?? post.category ?? 'Blog'),
    readTime: blogReadTimeOf(post),
    excerpt,
    image: blogImageOf(post, imageEntries),
    imageAlt:
      typeof post.blog_banner_image_alt === 'string' && post.blog_banner_image_alt
        ? post.blog_banner_image_alt
        : title,
    date: prettyDateOf(rawDate),
    body: body.length > 0 ? body : [excerpt].filter(Boolean),
    html,
  };
}

/**
 * Map a live `BlogListResponse` to card-ready items.
 * Returns `[]` when unseeded so callers can fall back to static `BLOG_DATA`.
 */
export function toBlogItems(response: BlogListResponse): LiveBlogItem[] {
  if (!response.data.length) return [];
  return response.data.map((post, index) => {
    const normalized = normalizeBlogPost(post, response.image_url, index);
    return {
      id: normalized.key,
      title: normalized.title,
      category: normalized.category,
      readTime: normalized.readTime,
      excerpt: normalized.excerpt,
      image: normalized.image,
      date: normalized.date,
      slug: normalized.slug,
    };
  });
}
