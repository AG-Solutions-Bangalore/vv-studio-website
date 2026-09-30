import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, useEffect } from 'react';
import { DeferredSmoothScroll } from '@/components/shared/DeferredSmoothScroll';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { LoadingFallback } from '@/components/shared/LoadingFallback';
import { injectLocalBusinessSchema } from '@/seo/seo';
import { connectionAllowsPreload, onIdle } from '@/lib/idle';

import { HomePage } from '@/modules/home/pages/HomePage';
const AboutPage = React.lazy(() =>
  import('@/modules/about/pages/AboutPage').then((m) => ({
    default: m.AboutPage,
  })),
);
const ServicesPage = React.lazy(() =>
  import('@/modules/services/pages/ServicesPage').then((m) => ({
    default: m.ServicesPage,
  })),
);
const ContactPage = React.lazy(() =>
  import('@/modules/contact/pages/ContactPage').then((m) => ({
    default: m.ContactPage,
  })),
);
const GalleryPage = React.lazy(() =>
  import('@/modules/gallery/pages/GalleryPage').then((m) => ({
    default: m.GalleryPage,
  })),
);
const BlogPage = React.lazy(() =>
  import('@/modules/blog/pages/BlogPage').then((m) => ({
    default: m.BlogPage,
  })),
);
const BlogDetailPage = React.lazy(() =>
  import('@/modules/blog/pages/BlogDetailPage').then((m) => ({
    default: m.BlogDetailPage,
  })),
);

/**
 * Speculatively warm the 1–2 most likely next routes (Services via the hero
 * CTA, About via "Know More About Us"), staggered — never all at once.
 * Starts only after idle + 3.5s so first paint stays untouched, and never on
 * Save-Data / 2g connections.
 */
function preloadLikelyRoutes(): void {
  if (!connectionAllowsPreload()) return;
  const schedule = (loader: () => Promise<unknown>, delayMs: number): void => {
    onIdle(
      () => {
        window.setTimeout(() => void loader(), delayMs);
      },
      5000,
    );
  };
  schedule(() => import('@/modules/services/pages/ServicesPage'), 3500);
  schedule(() => import('@/modules/about/pages/AboutPage'), 5000);
}

function App() {
  useEffect(() => {
    injectLocalBusinessSchema();
    preloadLikelyRoutes();
  }, []);

  return (
    <Router>
      <DeferredSmoothScroll />
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage seoKey="home" />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            {/* Standalone crawlable URLs: /gallery and /blog render full collection pages. */}
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Fallback route */}
            <Route path="*" element={<HomePage seoKey="home" />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
