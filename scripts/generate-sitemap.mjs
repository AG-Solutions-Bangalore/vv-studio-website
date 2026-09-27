/**
 * Build-time sitemap generator for VV Studio.
 *
 * Merges live `GET /getSitemap` pages (mapped to real frontend routes)
 * with live `GET /getBlogs` articles (`/blog/:slug`), and writes
 * `dist/sitemap.xml` — overwriting the static copy from `public/`.
 * Runs as the last step of `npm run build`.
 *
 * The build NEVER fails because of this script: if the API is
 * unreachable, a static fallback (all frontend routes) is written instead.
 *
 * Usage: node scripts/generate-sitemap.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const outFile = path.join(root, 'dist', 'sitemap.xml')

const API_BASE_URL =
  process.env.VITE_API_BASE_URL ?? 'http://agsdemo.in/vvsapi/public/api'
const SITE_ORIGIN = 'https://vvs.agsdemo.in'

/** Backend page slug → frontend path. Unmapped slugs have no page → skipped. */
const SLUG_TO_PATH = {
  home: '/',
  '/': '/',
  'about-us': '/about',
  about: '/about',
  services: '/services',
  gallery: '/gallery',
  blog: '/blog',
  blogs: '/blog',
  contact: '/contact',
}

const STATIC_FALLBACK = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/about', priority: '0.8', changefreq: 'monthly' },
  { loc: '/services', priority: '0.9', changefreq: 'weekly' },
  { loc: '/gallery', priority: '0.7', changefreq: 'monthly' },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
  { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
]

function today() {
  return new Date().toISOString().slice(0, 10)
}

function toDate(value) {
  if (typeof value !== 'string' || !value) return today()
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? today() : d.toISOString().slice(0, 10)
}

function toPriority(value, fallback = '0.8') {
  const n = parseFloat(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(1, Math.max(0.1, n)).toFixed(1)
}

function cleanSlug(value) {
  return String(value ?? '')
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .toLowerCase()
}

function toXml(urls) {
  const entries = urls
    .map(
      (u) => `  <url>
    <loc>${SITE_ORIGIN}${u.loc}</loc>
    <lastmod>${u.lastmod ?? today()}</lastmod>
    <changefreq>${u.changefreq ?? 'monthly'}</changefreq>
    <priority>${u.priority ?? '0.8'}</priority>
  </url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
}

async function getJson(url) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(15_000),
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.json()
}

async function fetchLiveUrls() {
  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'weekly', lastmod: today() },
  ]
  const seen = new Set(urls.map((u) => u.loc))

  // 1. Backend-managed pages → frontend routes.
  const sitemap = await getJson(`${API_BASE_URL}/getSitemap`)
  const entries = Array.isArray(sitemap?.data) ? sitemap.data : []
  for (const e of entries) {
    if (e?.page_two_status && e.page_two_status !== 'Active') continue
    const frontendPath = SLUG_TO_PATH[cleanSlug(e?.page_two_url)]
    if (!frontendPath || seen.has(frontendPath)) continue
    seen.add(frontendPath)
    const priority = toPriority(e?.page_two_priority)
    urls.push({
      loc: frontendPath,
      priority,
      changefreq: parseFloat(priority) >= 0.9 ? 'weekly' : 'monthly',
      lastmod: toDate(e?.updated_at ?? e?.created_at),
    })
  }

  // 2. Live articles → /blog/:slug (never fails the build).
  try {
    const blogs = await getJson(`${API_BASE_URL}/getBlogs`)
    const rows = Array.isArray(blogs?.data) ? blogs.data : []
    for (const post of rows) {
      const slug =
        (typeof post?.blog_slug === 'string' && post.blog_slug.trim()) ||
        (typeof post?.slug === 'string' && post.slug.trim()) ||
        ''
      if (!slug) continue
      const loc = `/blog/${slug}`
      if (seen.has(loc)) continue
      seen.add(loc)
      urls.push({ loc, priority: '0.8', changefreq: 'weekly', lastmod: today() })
    }
  } catch {
    // Articles stay out of the sitemap when unreachable — never fail builds.
  }
  return urls
}

try {
  const urls = await fetchLiveUrls()
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, toXml(urls))
  console.log(`[sitemap] wrote ${urls.length} URLs from live API → ${outFile}`)
} catch (err) {
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, toXml(STATIC_FALLBACK))
  console.warn(
    `[sitemap] live API unreachable (${err?.message ?? err}); wrote ${STATIC_FALLBACK.length} static fallback URLs → ${outFile}`,
  )
}
