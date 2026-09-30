# VV Studio — API-Driven Content Sections (FAQ / Testimonials / Blogs)

> Copy-paste this whole file to the coding agent working in `D:\JOB_PROJECTS\vv-studio-website`.
> Goal: every page shows live FAQ + testimonials/reviews from the backend, the home
> page shows front + featured blog sections, and the blog detail page shows FAQ only.
> Golden rule: **API data aaye to section dikhe, na aaye to section DOM mein ho hi nahi.**

---

## 1. API CONTRACT (base URL only changes — endpoints identical to the reference collection)

Base URL: `https://vvstudio.in/crmapi/public/api` (override via `VITE_API_BASE_URL`, see `.env.example`).
Shared axios instance: `apiClient` from `@/lib/apiClient`. Endpoint constants: `@/lib/api/endpoints`.
Response types: `@/lib/api/types` (`FaqItem`, `FaqResponse`, `Testimonial`, `TestimonialResponse`,
`BlogListResponse`, `BlogDetailResponse`, `ImageUrlEntry`).

| Method | Endpoint | Used by |
|--------|----------|---------|
| GET | `/getCompany` | About / company info |
| GET | `/getCategory` | Services / categories |
| GET | `/getFrontBlogs` | Home front-blogs rail |
| GET | `/getFeaturedBlogs` | Home featured-blogs section |
| GET | `/getBlogs` | Blog listing grid |
| GET | `/getBlogsBySlug/{slug}` | Blog detail (`{ data, image_url, previous, next, featured, faq }`) |
| GET | `/getFAQBySlug/{slug}` | Every page's FAQ (`{ data: FaqItem[] }`) |
| GET | `/getTestimonial/{slug}` | Every page's testimonials (`{ data: Testimonial[] }`) |
| GET | `/getClient` | Client marquee |
| GET | `/getSitemap` | Sitemap |
| POST | `/createNewsletter` | form-data: `newsletter_email` |
| POST | `/createEnquiry` | form-data: `enquiryFullName, enquiryMobile, enquiryEmail, enquiryService, enquiryMessage, enquiryFrom, utm_medium, utm_source, utm_campaign` |

Wire shapes (already in `@/lib/api/types` — do not redefine):
- `FaqItem`: `{ faq_que, faq_ans, faq_sort, faq_heading }` (+ accept `faq_question`/`faq_answer` aliases). `faq` array is also embedded in `getBlogsBySlug`.
- `Testimonial`: `{ testimonial_client_name, testimonial_description, testimonial_created_date (YYYY-MM-DD), testimonial_rating }` (+ accept `name/quote/rating/image/location` aliases).
- `ImageUrlEntry`: `{ image_for: 'Blog' | 'No Image' | ..., image_url }` — card image = `Blog` base + `blog_banner_image`, missing image → `No Image` base (see `blogImageOf` in `modules/blog/api/blogApi.ts`).

---

## 2. EXISTING BUILDING BLOCKS (reuse — do not rebuild)

- `src/components/shared/FaqSection.tsx` — canonical FAQ accordion. Props: `slug`, `fallbackSlug`, `items`, `eyebrow`, `title`, `subtitle`. Resolution order: direct `items` → `GET /getFAQBySlug/{slug}` → `GET /getFAQBySlug/{fallbackSlug}` (fallback skipped when it equals `slug`). Normalizes via `normalizeFaqItems` (drop empty Q/A, sort by `faq_sort`), groups headings via `groupFaqRows`, **returns null when zero usable rows**. Mounts its own `QueryClientProvider` over the shared `queryClient`, so import it with `React.lazy` on performance-critical routes.
- `src/modules/home/api/faqApi.ts` — `getFaqBySlug`, `normalizeFaqItems`, `groupFaqRows`. Single home for FAQ logic; remove/merge any duplicate `faqApi` copies in other modules (e.g. services) into this.
- `src/modules/home/hooks/useFaq.ts` — `useFaq(slug?)`, key `['faq', slug]`, disabled until slug set.
- `src/modules/home/api/testimonialApi.ts` — `getTestimonials(slug)` (slug required), `toTestimonialItems`, `ReviewRow` helpers (rating clamp 1–5 default 5, HTML-strip, `DD MMM YYYY` date without timezone shift).
- `src/modules/home/hooks/useTestimonials.ts` — `useTestimonials(slug?)`, key `['testimonials', slug]`.
- `src/modules/home/components/TestimonialsSection.tsx` — currently hardcoded to slug `'home'` with static `TESTIMONIALS_DATA` fallback. **Generalize it** (see §4).
- `src/modules/blog/` — fully live already: `api/blogApi.ts` (`getFrontBlogs`, `getFeaturedBlogs`, `getBlogs`, `getBlogBySlug`, `normalizeBlogPost`, `toBlogItems`, `blogImageOf`, `blogDetailPath`), `hooks/useBlogs.ts` (`useFrontBlogs`, `useFeaturedBlogs`, `useBlogs`, `useBlogBySlug`), components `BlogCarousels`, `BlogGrid`, `BlogHero`, `FeaturedBlogBanner`.
- Module folder convention: `modules/<name>/{api,components,hook(s),pages,types,index.ts}`. Path alias `@/` → `src/`.

---

## 3. FAQ — EVERY PAGE (reusable, self-hiding)

1. Use the canonical `FaqSection` from `@/components/shared/FaqSection` on **every** page (lazy-import it).
2. Pass the page's slug; keep the existing slug map: home → `"home"`, about → `"about-us"`, services → `"services"`, gallery → `"gallery"`, contact → `"contact"`, blog listing → `"blogs"`, service detail → decoded category slug, blog detail → article slug with `fallbackSlug="blogs"` and `items={detailResponse.faq}` (direct rows win).
3. Do NOT change its core behaviour: direct items → slug → fallback; normalize, drop empties, sort; **render nothing when empty** (no heading, no whitespace).
4. No hardcoded/mock FAQ content anywhere. Unknown slugs return `{ data: [] }` — that is the hide signal, not an error.

## 4. TESTIMONIALS / REVIEWS — EVERY PAGE EXCEPT BLOG DETAIL (reusable, self-hiding)

1. Generalize `TestimonialsSection` into a slug-driven reusable component mirroring `FaqSection`'s API: props `slug`, `fallbackSlug`, `items`, `title`, `eyebrow`. Resolution order: direct `items` → `GET /getTestimonial/{slug}` → fallback slug. Keep only rows with non-empty client name AND non-empty description (strip HTML first).
2. **Replace the static `TESTIMONIALS_DATA` fallback with hide-on-empty**: zero usable rows → `return null`. (Live data or nothing — same rule as FAQ.)
3. Render every normal page's section as `<TestimonialSection slug="<page-slug>" />` with the same slug map as §3 (home → `"home"`, blog listing → `"blogs"`, service detail → category slug, etc.).
4. **Blog detail page (`/blog/:slug`) gets NO testimonial section — by design, only FAQ.**
5. Keep the existing card/marquee look; rating clamp 1–5 (default 5); footer `Verified Client · DD MMM YYYY`.

## 5. HOME PAGE COMPOSITION (order matters)

`HomePage` must render, in order: Hero → … → **Featured blogs** (`useFeaturedBlogs` / `GET /getFeaturedBlogs`) → **Front blogs** (`useFrontBlogs` / `GET /getFrontBlogs`, existing `BlogSection` rail) → **FAQ** (`<FaqSection slug="home" />`) → **Testimonials** (generalized section, slug `"home"`).
Blog sections reuse the blog module's carousel/card components + `normalizeBlogPost`/`toBlogItems`/`blogImageOf` — no new card designs. Each blog section **hides while loading or when its data array is empty**.

## 6. BLOG PAGES

- Blog listing: `BlogGrid` (`useBlogs`) + `FeaturedBlogBanner` (`useFeaturedBlogs`) + `<TestimonialSection slug="blogs" />` + `<FaqSection title="FAQ" slug="blogs" />` (already wired — verify, don't duplicate).
- Blog detail: article (`useBlogBySlug`) + related rails (`BlogCarousels`) + `<FaqSection title="FAQ" slug={slug} fallbackSlug="blogs" items={live?.faq} />` (already wired — verify). **Do not add testimonials here.**
- All blog images resolve via `blogImageOf` (`Blog` base + banner file, `No Image` base fallback).

## 7. NON-NEGOTIABLE RULES

- Components never call axios/`fetch` directly — thin `api/*.ts` functions only; one React Query hook per endpoint; slug hooks stay `enabled: Boolean(slug)`.
- No mock, placeholder, or static fallback content for FAQ/testimonials/blogs. API empty ⇒ section absent.
- Query keys: `['faq', slug]`, `['testimonials', slug]`, existing `blogKeys` in `modules/blog/hooks/useBlogs.ts`.
- Preserve the lazy + own-`QueryClientProvider` pattern for `FaqSection` (and apply it to the generalized testimonial section).
- `npm run build` (tsc + vite) and `npm run lint` must pass.

## 8. ACCEPTANCE CHECK

With the API returning `{ data: [] }` for FAQ/testimonial/blog endpoints: every page renders with NO faq/testimonial/blog sections and zero console errors. With seeded data per slug: each section appears exactly once, in the order specified above; blog detail shows FAQ but never testimonials.
