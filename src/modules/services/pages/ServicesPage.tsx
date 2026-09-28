import React, { Suspense, lazy, useState } from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { SERVICES_DATA, type ServiceItem } from '@/data/salonData';
import { ServicesHero } from '../components/ServicesHero';
import { ServicesFeatureStrip } from '../components/ServicesFeatureStrip';
import { ServicesGrid } from '../components/ServicesGrid';
import { ServicesCTABanner } from '../components/ServicesCTABanner';
import { useSEO } from '@/seo/seo';

// Page FAQs (GET /getFAQBySlug/services) — lazy + own provider, hidden when empty.
const FaqSection = lazy(() =>
  import('@/components/shared/FaqSection').then((m) => ({
    default: m.FaqSection,
  })),
);
// Client reviews (GET /getTestimonial/services) — lazy + own provider, hidden when empty.
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

export const ServicesPage: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [initialService, setInitialService] = useState<ServiceItem | null>(null);

  useSEO('services');

  const handleOpenBooking = (serviceName?: string) => {
    if (serviceName) {
      const matched = SERVICES_DATA.find((s) =>
        s.title.toLowerCase().includes(serviceName.toLowerCase()) ||
        serviceName.toLowerCase().includes(s.title.toLowerCase())
      );
      setInitialService(matched || null);
    } else {
      setInitialService(null);
    }
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#40363F] flex flex-col antialiased selection:bg-[#D91A8A] selection:text-white">
      {/* Top Header - untouched style */}
      <Header onOpenBooking={() => handleOpenBooking()} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with common girl & diamond geometry */}
        <ServicesHero />

        {/* 4 Feature Badges Strip */}
        <ServicesFeatureStrip />

        {/* 12 Services Card Grid */}
        <ServicesGrid onOpenBooking={handleOpenBooking} />

        {/* FAQs — renders only when the API returns items */}
        <Suspense fallback={null}>
          <FaqSection slug="services" />
        </Suspense>

        {/* Client reviews — renders only when the API returns items */}
        <Suspense fallback={null}>
          <TestimonialSection slug="services" />
        </Suspense>

        {/* Bottom CTA Banner before Footer */}
        <ServicesCTABanner onOpenBooking={() => handleOpenBooking()} />
      </main>

      {/* Signature Footer - untouched style */}
      <Footer />

      {/* Booking Modal — gated: null until first open + code-split. */}
      {isBookingOpen && (
        <Suspense fallback={null}>
          <BookingModal
            isOpen={isBookingOpen}
            onClose={() => {
              setIsBookingOpen(false);
              setInitialService(null);
            }}
            initialService={initialService}
          />
        </Suspense>
      )}
    </div>
  );
};
