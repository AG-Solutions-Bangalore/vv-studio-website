/**
 * Central endpoint map for the VV Studio website backend.
 *
 * Base URL: `http://agsdemo.in/vvsapi/public/api`
 * (see `API_BASE_URL` in `@/lib/apiClient` and
 * `Website.postman_collection.json`).
 *
 * Every module `api/*.ts` file must import paths from here — never
 * hardcode endpoint strings in modules.
 */
export const ENDPOINTS = {
  /** GET — company profile (Header/Footer/About/Contact info). */
  company: '/getCompany',
  /** GET — homepage blog rail. */
  frontBlogs: '/getFrontBlogs',
  /** GET — featured blogs. */
  featuredBlogs: '/getFeaturedBlogs',
  /** GET — all blogs (Blog page grid). */
  blogs: '/getBlogs',
  /** GET — single blog by slug. */
  blogBySlug: (slug: string): string =>
    `/getBlogsBySlug/${encodeURIComponent(slug)}`,
  /** GET — FAQs scoped by page/service slug. */
  faqBySlug: (slug: string): string =>
    `/getFAQBySlug/${encodeURIComponent(slug)}`,
  /** GET — testimonials scoped by slug (slug required). */
  testimonialBySlug: (slug: string): string =>
    `/getTestimonial/${encodeURIComponent(slug)}`,
  /** GET — client list. */
  clients: '/getClient',
  /** GET — sitemap pages. */
  sitemap: '/getSitemap',
  /** POST (form-data) — newsletter signup. */
  newsletter: '/createNewsletter',
  /** POST (form-data) — enquiry / booking. */
  enquiry: '/createEnquiry',
} as const;
