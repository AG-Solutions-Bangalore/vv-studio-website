import React, { Suspense, lazy, useState } from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { BlogHero } from '../components/BlogHero';
import { FeaturedBlogsRail } from '../components/FeaturedBlogsRail';
import { BlogGrid } from '../components/BlogGrid';
import { CTABanner } from '@/modules/home/components/CTABanner';
import { useSEO } from '@/seo/seo';

// Client reviews loop (GET /getTestimonial/blogs) — lazy + own provider, hidden when empty.
const TestimonialSection = lazy(() =>
  import('@/modules/home/components/TestimonialSection').then((m) => ({
    default: m.TestimonialSection,
  })),
);
// Page FAQs (GET /getFAQBySlug/blogs) — lazy + own provider, hidden when empty.
const FaqSection = lazy(() =>
  import('@/components/shared/FaqSection').then((m) => ({
    default: m.FaqSection,
  })),
);

// Heavy booking form: code-split and never mounted until first open.
const BookingModal = lazy(() =>
  import('@/components/shared/BookingModal').then((m) => ({
    default: m.BookingModal,
  })),
);

export const BlogPage: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useSEO('blog');

  const handleOpenBooking = () => setIsBookingOpen(true);

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#40363F] flex flex-col antialiased selection:bg-[#D91A8A] selection:text-white">
      {/* Top Header */}
      <Header onOpenBooking={handleOpenBooking} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <BlogHero />

        {/* Featured rail (same reusable BlogCard) — renders only when the API has data */}
        <FeaturedBlogsRail />

        {/* Full journal grid — same card design as the home blog section */}
        <BlogGrid />

        {/* Client reviews loop — renders only when the API returns items */}
        <Suspense fallback={null}>
          <TestimonialSection slug="blogs" />
        </Suspense>

        {/* FAQs (fixed title) — renders only when the API returns items */}
        <Suspense fallback={null}>
          <FaqSection title="FAQ" slug="blogs" />
        </Suspense>

        {/* Booking CTA */}
        <CTABanner onOpenBooking={handleOpenBooking} />
      </main>

      {/* Signature Footer */}
      <Footer />

      {/* Booking Modal — gated: null until first open + code-split. */}
      {isBookingOpen && (
        <Suspense fallback={null}>
          <BookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
};
