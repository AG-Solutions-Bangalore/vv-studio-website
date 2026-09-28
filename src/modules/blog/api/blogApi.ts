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

/** Plain-text paragraphs from a post body (HTML tags stripped). */
export function blogBodyOf(post: BlogPost): string[] {
  const raw = [post.blog_description, post.description, post.content, post.excerpt].find(
    (v) => typeof v === 'string' && v.trim(),
  );
  if (!raw) return [];
  return (raw as string)
    .split(/\n{2,}|\r\n{2,}/)
    .map((p) => p.replace(/<[^>]+>/g, '').trim())
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
}

export function normalizeBlogPost(
  post: BlogPost,
  imageEntries: ImageUrlEntry[],
  index = 0,
): NormalizedBlog {
  const title = String(post.blog_title ?? post.title ?? 'Untitled');
  const body = blogBodyOf(post);
  const excerpt = String(
    post.blog_short_description ?? post.excerpt ?? post.description ?? body[0] ?? '',
  );
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
