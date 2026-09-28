import React, { Suspense, lazy, useState } from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { ContactHero } from '../components/ContactHero';
import { ContactInfoStrip } from '../components/ContactInfoStrip';
import { ContactLocationAndForm } from '../components/ContactLocationAndForm';
import { ExperienceDifferenceSection } from '../components/ExperienceDifferenceSection';
import { useSEO } from '@/seo/seo';

// Page FAQs (GET /getFAQBySlug/contact) — lazy + own provider, hidden when empty.
const FaqSection = lazy(() =>
  import('@/modules/faq').then((m) => ({
    default: m.FaqSection,
  })),
);
// Client reviews (GET /getTestimonial/contact) — lazy + own provider, hidden when empty.
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

export const ContactPage: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useSEO('contact');

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#40363F] flex flex-col antialiased selection:bg-[#D91A8A] selection:text-white">
      {/* Top Header */}
      <Header onOpenBooking={() => setIsBookingOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <ContactHero />

        {/* 5 Cards Info Strip */}
        <ContactInfoStrip />

        {/* Location Map & Message Form */}
        <ContactLocationAndForm />

        {/* Studio Ambience & Experience Highlights */}
        <ExperienceDifferenceSection onOpenBooking={() => setIsBookingOpen(true)} />

        {/* FAQs — renders only when the API returns items */}
        <Suspense fallback={null}>
          <FaqSection slug="contact" />
        </Suspense>

        {/* Client reviews — renders only when the API returns items */}
        <Suspense fallback={null}>
          <TestimonialSection slug="contact" />
        </Suspense>
      </main>

      {/* Signature Dark Plum Footer matching design */}
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
