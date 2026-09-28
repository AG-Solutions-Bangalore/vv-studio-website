import React, { Suspense, lazy, useState } from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { GalleryHero } from '../components/GalleryHero';
import { GalleryGrid } from '../components/GalleryGrid';
import { CTABanner } from '@/modules/home/components/CTABanner';
import { useSEO } from '@/seo/seo';

// Page FAQs (GET /getFAQBySlug/gallery) — lazy + own provider, hidden when empty.
const FaqSection = lazy(() =>
  import('@/components/shared/FaqSection').then((m) => ({
    default: m.FaqSection,
  })),
);
// Client reviews (GET /getTestimonial/gallery) — lazy + own provider, hidden when empty.
const TestimonialSection = lazy(() =>
  import('@/modules/home/components/TestimonialSection').then((m) => ({
    default: m.TestimonialSection,
  })),
);

// Heavy booking form: code-split and never mounted until first open.
const BookingModal = lazy(() =>
  import('@/components/shared/BookingModal').then((m) => ({
    default: m.BookingModal,
  })),
);

export const GalleryPage: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useSEO('gallery');

  const handleOpenBooking = () => setIsBookingOpen(true);

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#40363F] flex flex-col antialiased selection:bg-[#D91A8A] selection:text-white">
      {/* Top Header */}
      <Header onOpenBooking={handleOpenBooking} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <GalleryHero />

        {/* Full collection grid — same card design as the home gallery */}
        <GalleryGrid />

        {/* FAQs — renders only when the API returns items */}
        <Suspense fallback={null}>
          <FaqSection slug="gallery" />
        </Suspense>

        {/* Client reviews — renders only when the API returns items */}
        <Suspense fallback={null}>
          <TestimonialSection slug="gallery" />
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
