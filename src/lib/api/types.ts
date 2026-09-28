/**
 * Shared API entity types for the VV Studio website backend.
 *
 * Base URL: `http://agsdemo.in/vvsapi/public/api`
 * (see `Website.postman_collection.json`).
 *
 * Shapes below mirror the live responses probed on 2026-09-25.
 * List endpoints that currently return empty `data: []` use flexible
 * optional fields so the UI keeps working once the backend is seeded.
 */

/** `{ image_for, image_url }` entries returned alongside most GETs. */
export interface ImageUrlEntry {
  image_for: string;
  image_url: string;
}

/** GET /getCompany — `data` object (live, verified). */
export interface Company {
  company_name: string;
  company_email: string;
  company_gst: string | null;
  company_pan_no: string | null;
  company_mobile_no: string;
  company_landline_no: string;
  company_address: string;
  company_place: string | null;
  company_logo: string;
}

export interface CompanyResponse {
  data: Company;
  image_url: ImageUrlEntry[];
}

/**
 * Blog post — live backend shape (verified 2026-09-25):
 * `blog_slug`, `blog_title`, `blog_short_description`, `blog_description`
 * (HTML), `blog_banner_image` (relative name), `blog_banner_image_alt`,
 * `blog_created_date`, `categories` (name), plus SEO/meta extras.
 * Legacy/generic keys stay optional for tolerance.
 */
export interface BlogPost {
  id?: string | number;
  slug?: string;
  blog_slug?: string;
  title?: string;
  blog_title?: string;
  excerpt?: string;
  description?: string;
  blog_short_description?: string;
  blog_description?: string;
  content?: string;
  image?: string;
  blog_banner_image?: string;
  blog_banner_image_alt?: string;
  date?: string;
  created_at?: string;
  blog_created_date?: string;
  category?: string;
  categories?: string;
  readTime?: string;
  read_time?: string;
  [key: string]: unknown;
}

export interface BlogListResponse {
  data: BlogPost[];
  image_url: ImageUrlEntry[];
}

export interface BlogDetailResponse {
  data: BlogPost | null;
  image_url: ImageUrlEntry[];
  previous?: BlogPost | null;
  next?: BlogPost | null;
  /** Same rows as the list endpoints, embedded in `getBlogsBySlug`. */
  featured?: BlogPost[];
  /** FAQ rows embedded in `getBlogsBySlug` (same shape as `getFAQBySlug`). */
  faq?: FaqItem[];
}

/** GET /getFAQBySlug/{slug} — live shape: `faq_que` / `faq_ans` (+ `faq_sort`, `faq_heading`). */
export interface FaqItem {
  id?: string | number;
  faq_que?: string;
  faq_ans?: string;
  faq_sort?: string | number;
  faq_heading?: string | null;
  question?: string;
  answer?: string;
  slug?: string;
  [key: string]: unknown;
}

export interface FaqResponse {
  data: FaqItem[];
}

/**
 * GET /getTestimonial/{slug} — live shape (verified 2026-09-25, slug `home`):
 * `testimonial_client_name`, `testimonial_description`, `testimonial_rating`,
 * `testimonial_created_date`, `testimonial_for`. No avatar/treatment from API.
 */
export interface Testimonial {
  id?: string | number;
  testimonial_for?: string;
  testimonial_client_name?: string;
  testimonial_description?: string;
  testimonial_created_date?: string;
  testimonial_rating?: string | number;
  name?: string;
  location?: string;
  quote?: string;
  rating?: number;
  image?: string;
  [key: string]: unknown;
}

export interface TestimonialResponse {
  data: Testimonial[];
}

/** GET /getClient — currently `data: []` (unseeded). */
export interface Client {
  id?: string | number;
  name?: string;
  image?: string;
  [key: string]: unknown;
}

export interface ClientResponse {
  data: Client[];
  image_url: ImageUrlEntry[];
}

/** GET /getSitemap — live (5 pages + empty `blog` array). */
export interface SitemapEntry {
  id: number;
  page_two_url: string;
  page_two_name: string;
  page_two_type: string;
  page_two_priority: string;
  page_two_status: string;
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string | null;
}

export interface SitemapResponse {
  data: SitemapEntry[];
  blog: unknown[];
}

/**
 * POST /createNewsletter — form-data per Postman.
 * Live, but the demo SMTP is blacklisted: fresh emails currently fail
 * at the mail-send stage (HTTP 500, server-side). See docs/API.md.
 */
export interface NewsletterPayload {
  newsletter_email: string;
}

export interface NewsletterResponse {
  code?: number;
  message?: string | null;
  [key: string]: unknown;
}

/**
 * POST /createEnquiry — form-data per Postman.
 * Field names match the collection exactly (`enquiryService`, not
 * `enquiryProduct`). Live, but demo SMTP is blacklisted — see docs/API.md.
 */
export interface EnquiryPayload {
  enquiryFullName: string;
  enquiryMobile: string;
  enquiryEmail: string;
  enquiryService: string;
  enquiryMessage: string;
  enquiryFrom?: string;
  utm_medium?: string;
  utm_source?: string;
  utm_campaign?: string;
}

export interface EnquiryResponse {
  code?: number | string;
  status?: boolean | string;
  success?: boolean;
  message?: string | null;
  data?: unknown;
  [key: string]: unknown;
}

/**
 * True when a mutation envelope signals success.
 * Handles the backend success shape `{"code":201,"message":"…"}` explicitly:
 * code 200/201, `status: true`, or `success: true` all pass; explicit
 * failure signals (`code: 400`, `status: false`) fail. Envelopes with no
 * signals at all trust the HTTP status (axios already resolved 2xx).
 */
export function isSuccessEnvelope(
  res: { code?: unknown; status?: unknown; success?: unknown } | null | undefined,
): boolean {
  if (!res || typeof res !== 'object') return false;
  const { code, status, success } = res;
  if (code === 200 || code === 201 || code === '200' || code === '201') return true;
  if (status === true || status === 'success' || status === 'successful') return true;
  if (success === true) return true;
  if (code !== undefined || status === false || success === false) return false;
  return true;
}

/** Readable message out of a mutation envelope, with fallback. */
export function envelopeMessage(
  res: { message?: unknown } | null | undefined,
  fallback: string,
): string {
  return typeof res?.message === 'string' && res.message ? res.message : fallback;
}
