# VV Studio Website — API Status

Base URL: `http://agsdemo.in/vvsapi/public/api` · verified **2026-09-25**

## ✅ Completed — wired into the app

| Endpoint | Where it's used | Backend data |
|---|---|---|
| `GET /getCompany` | Header phones, mobile-menu buttons, Footer contact block, contact info cards, map + tour-modal addresses | ✅ Live (`support@vvstudio.in`, `8310782820`, `080-48531999`, JP Nagar address) |
| `GET /getFrontBlogs` | Home `#blog` rail | ✅ Live — 1 post (`demoblogs` / `democate`), image resolves to `…/blog_images/1.webp`, card links to `/blog/demoblogs` |
| `GET /getFeaturedBlogs` | Blog page spotlight banner | ⏳ Returns `[]` → hidden until seeded |
| `GET /getBlogs` | Blog page grid + category filter | ✅ Live — same post renders with filter |
| `GET /getBlogsBySlug/{slug}` | Article page `/blog/:slug` (hero, body, prev/next, related) | ✅ Live — `/blog/demoblogs` renders banner, stripped body text, pretty date; unknown slugs → not-found card. Detail page also shows **Featured Stories** carousel (`getFeaturedBlogs` → embedded `featured` fallback, current excluded) + **Other Stories** carousel (`getFrontBlogs` → `getBlogs`, current + featured excluded); both hidden while empty |
| `GET /getFAQBySlug/{slug}` | FAQ accordion on all 7 pages (`home`, `about-us`, `services`, `gallery`, `blogs`, `contact`, article slug) | ✅ Live on `home` (renders `faq_que`/`faq_ans`); blog listing (`blogs`) + detail (fixed `FAQ` title, direct `faq` rows → slug → `blogs` fallback, `faq_heading` groups, `faq_sort` order) wired; other slugs still `[]` → hidden until seeded |
| `GET /getTestimonial/{slug}` | Home testimonials carousel (`home` slug) + blog listing review loop (`blogs` slug) | ✅ Live on `home` — 1 review (`abc`, rating 5); card shows initials avatar (API sends no photo), static fallback until more reviews. Listing loop (`TestimonialSection`, infinite marquee, light tone) hidden while `blogs` returns `[]`; never rendered on detail page |
| `POST /createEnquiry` | Booking modal (all pages) + contact form | 🔴 Wired, but backend returns HTTP 500 (demo SMTP blacklisted — server-side, needs backend mail fix). Frontend explicitly handles the success shape `{"code":201,"message":"Enquiry Created Successfully."}` and rejects `code: 400`-style envelopes, so no false success is possible once fixed |

## ⏳ Remaining — not wired yet

| Endpoint | Status | What's needed |
|---|---|---|
| `GET /getClient` | Hook ready (`useClients`), backend returns `[]` | Build a clientele strip UI when backend seeds data |
| `GET /getSitemap` | Hook ready (`useSitemap`), backend live (5 pages) | Consume in `src/seo` for dynamic sitemap/URLs |
| `POST /createNewsletter` | Hook ready (`useSubscribeNewsletter`) | Add a signup form to Footer, then connect. (Same SMTP issue as enquiry) |
| Gallery / categories | ➖ No backend route (`getCategory` was 404 → removed) | Static `salonData` only until backend ships a route |

## How to verify

1. `npm run dev` → DevTools Network → filter `vvsapi`.
2. `/` fires `getCompany` + `getFrontBlogs`; `/blog` adds `getBlogs` + `getFeaturedBlogs`; every page fires its `getFAQBySlug/{slug}` (all 200 today).
3. Footer email `support@vvstudio.in` = proof the UI reads the live API.
4. Hidden FAQ/featured sections = correct fallback state (backend `[]`), not a bug.

## Code map

- `src/lib/apiClient.ts` — central axios instance (`VITE_API_BASE_URL` override, `ApiError`)
- `src/lib/api/` — `ENDPOINTS` map + shared types (never hardcode paths in modules)
- `src/modules/*/api|hook|types` — per-module API, react-query hooks, types
- Blog field map (verified against live payloads): `blog_slug` → slug/detail link,
  `blog_title` → title, `blog_short_description` → excerpt, `blog_description`
  (HTML, tags stripped) → body, `blog_banner_image` + `Blog` base URL → image,
  `blog_banner_image_alt` → alt, `blog_created_date` → pretty date,
  `categories` → category chip/filter, read time derived (~200 wpm).
  Normalizer: `normalizeBlogPost()` in `modules/blog/api/blogApi.ts`.
- FAQ field map: `faq_que` → question, `faq_ans` → answer
  (also accepts `question`/`faq_question`/`title`, `answer`/`faq_answer`/`description`).
- Testimonial field map: `testimonial_client_name` → name,
  `testimonial_description` → quote, `testimonial_rating` → stars (1–5),
  no avatar from API → initials circle. Adapter: `toTestimonialItems()`
  in `modules/home/api/testimonialApi.ts`.
- `src/components/shared/` — `FaqSection`, `CompanyLive`/`CompanyStatic` (lazy live blocks with identical static fallbacks; query runtime stays out of the critical bundle)

## Notes

- POST failures are server-side (validation passes, demo SMTP `550 blacklisted`). No frontend change can fix them.
- Old base URLs (`ckapi`, `/vvs/api`, `/enquiry.php`) are fully replaced. Postman collection migrated to the new base; `getCategory` removed.
