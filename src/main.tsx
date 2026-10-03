import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.tsx";
import { SeoHost } from "./seo/seo";

const rootEl = document.getElementById("root")!;
// SSG-safe hydration: prerendered HTML was built with StaticRouter + SYNCHRONOUS
// page components, while the client code-splits pages with React.lazy. If a
// lazy page suspends on the first client tick, the client renders the Suspense
// fallback where SSG emitted full content → React #418 (Best Practices 96).
// Fix: preload the current route's page chunk BEFORE hydrating, so the first
// client render resolves synchronously and matches SSG exactly. Home ("/")
// needs nothing — HomePage ships inside the entry chunk on both sides.
//
// Mount waits for window LOAD (4s cap), never bare idle: on fast machines
// idle fires mid-paint and the hydration render steals the LCP window.
// Query-state restore + route preload are dynamic imports (see
// lib/hydrateQueryState) so @tanstack/react-query stays out of the entry.
const ROUTE_PRELOADERS: Array<{ test: (path: string) => boolean; load: () => Promise<unknown> }> = [
  { test: (p) => p === "/about", load: () => import("./modules/about/pages/AboutPage") },
  { test: (p) => p === "/services", load: () => import("./modules/services/pages/ServicesPage") },
  { test: (p) => p === "/gallery", load: () => import("./modules/gallery/pages/GalleryPage") },
  { test: (p) => p === "/blog", load: () => import("./modules/blog/pages/BlogPage") },
  { test: (p) => /^\/blog\/[^/]+$/.test(p), load: () => import("./modules/blog/pages/BlogDetailPage") },
  { test: (p) => p === "/contact", load: () => import("./modules/contact/pages/ContactPage") },
];

const app = (
  <HelmetProvider>
    <App />
    <SeoHost />
  </HelmetProvider>
);

const mount = () => {
  if (!rootEl.hasChildNodes()) {
    createRoot(rootEl).render(app);
    return;
  }
  const rawPath = window.location.pathname;
  const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, "") : rawPath;
  const preload = ROUTE_PRELOADERS.find((r) => r.test(path));
  // Query-state restore, then route-chunk preload, then hydrate — first
  // client render matches SSG byte-for-byte (no #418, no DOM rebuild).
  const hydrate = () => hydrateRoot(rootEl, app);
  void import("./lib/hydrateQueryState")
    .then((m) => m.restoreQueryState())
    .catch(() => {})
    .then(() => (preload ? preload.load().then(hydrate, hydrate) : hydrate()));
};

if (typeof document !== "undefined" && document.readyState === "complete") {
  window.setTimeout(runMountOnce, 0);
} else {
  window.addEventListener("load", runMountOnce, { once: true });
  // Safety cap: hydrate even if load stalls (slow fonts/embeds).
  window.setTimeout(runMountOnce, 4000);
}

let mounted = false;
function runMountOnce(): void {
  if (mounted) return;
  mounted = true;
  window.removeEventListener("load", runMountOnce);
  mount();
}
