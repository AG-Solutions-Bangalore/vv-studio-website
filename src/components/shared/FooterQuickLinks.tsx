import React from "react";
import { Link } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useSitemap } from "@/modules/home/hooks/useSitemap";
import type { SitemapEntry } from "@/lib/api/types";

interface QuickLink {
  name: string;
  to: string;
  title: string;
}

/** Backend `page_two_url` slug → internal route. Unknown slugs are skipped. */
const ROUTES: Record<string, string> = {
  home: "/",
  "/": "/",
  "about-us": "/about",
  services: "/services",
  gallery: "/gallery",
  blog: "/blog",
  blogs: "/blog",
  contact: "/contact",
};

/** Preferred footer order (API order differs). */
const ORDER = ["/", "/about", "/services", "/gallery", "/blog", "/contact"];

const TITLES: Record<string, string> = {
  "/": "VV Studio Luxury Salon & Spa",
  "/about": "About VV Studio Luxury Salon & Spa",
  "/services": "VV Studio Beauty & Spa Services",
  "/gallery": "VV Studio Salon & Beauty Gallery",
  "/blog": "VV Studio Beauty & Wellness Blog",
  "/contact": "Contact VV Studio | Get in Touch With Our Creative Team",
};

/** Static fallback — footer nav never renders empty. */
const FALLBACK_LINKS: QuickLink[] = [
  { name: "Home", to: "/", title: "VV Studio Luxury Salon & Spa" },
  { name: "About", to: "/about", title: "About VV Studio Luxury Salon & Spa" },
  {
    name: "Services",
    to: "/services",
    title: "VV Studio Beauty & Spa Services",
  },
  {
    name: "Gallery",
    to: "/gallery",
    title: "VV Studio Salon & Beauty Gallery",
  },
  { name: "Blog", to: "/blog", title: "VV Studio Beauty & Wellness Blog" },
  {
    name: "Contact",
    to: "/contact",
    title: "Contact VV Studio | Get in Touch With Our Creative Team",
  },
];

function toLinks(entries: SitemapEntry[]): QuickLink[] {
  const seen = new Set<string>(["/"]);
  const links: QuickLink[] = [{ name: "Home", to: "/", title: TITLES["/"] }];
  for (const entry of entries) {
    if (String(entry.page_two_status ?? "").toLowerCase() !== "active")
      continue;
    const slug = String(entry.page_two_url ?? "")
      .trim()
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase();
    const to = ROUTES[slug];
    if (!to || seen.has(to)) continue;
    seen.add(to);
    const name = String(entry.page_two_name ?? "").trim() || to;
    links.push({ name, to, title: TITLES[to] ?? `${name} | VV Studio` });
  }
  return links.sort((a, b) => {
    const ia = ORDER.includes(a.to) ? ORDER.indexOf(a.to) : ORDER.length;
    const ib = ORDER.includes(b.to) ? ORDER.indexOf(b.to) : ORDER.length;
    return ia - ib;
  });
}

/**
 * Footer Quick Links driven by GET /getSitemap (Active pages only).
 * Falls back to the static list while loading or when unseeded —
 * footer navigation never renders empty. Mounts its own
 * `QueryClientProvider`, so import it lazily.
 */
export const FooterQuickLinks: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <FooterQuickLinksInner />
  </QueryClientProvider>
);

const FooterQuickLinksInner: React.FC = () => {
  const { data } = useSitemap();
  const links =
    data && data.data.length > 0 ? toLinks(data.data) : FALLBACK_LINKS;

  return (
    <ul className="space-y-2.5 text-sm text-[#5E525C]">
      {links.map((link) => (
        <li key={link.to}>
          <Link
            to={link.to}
            title={link.title}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-[#D91A8A] transition-colors inline-block"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};
