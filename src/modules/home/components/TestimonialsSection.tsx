import React, { useLayoutEffect, useRef } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Container } from '@/components/ui/Container';
import { TestimonialCard } from './TestimonialCard';
import { toTestimonialItems } from '../api/testimonialApi';
import { useTestimonials } from '../hooks/useTestimonials';
import { repeatToCount } from '@/lib/utils';
import type { Testimonial } from '@/lib/api/types';

interface TestimonialsSectionProps {
  /** Page slug for `GET /getTestimonial/{slug}`. */
  slug?: string;
  /** Shared fallback slug (skipped when it equals `slug`). */
  fallbackSlug?: string;
  /** Direct rows win over any fetch when non-empty. */
  items?: Testimonial[];
  eyebrow?: string;
  title?: string;
  onOpenBooking?: () => void;
}

/** Minimum slides so the loop stays full with few backend rows. */
const MIN_SLIDES = 6;

/**
 * Slug-driven testimonials strip (GET /getTestimonial/{slug}).
 *
 * Resolution order: direct `items` → `GET /getTestimonial/{slug}` →
 * `GET /getTestimonial/{fallbackSlug}`. Renders **nothing** while the
 * backend returns no usable rows (same rule as `FaqSection`).
 * Pure infinite auto-scroll (pauses on hover, no dots or arrows).
 * Mounts its own `QueryClientProvider` over the shared singleton client,
 * so import it lazily on performance-critical routes.
 */
export const TestimonialsSection: React.FC<TestimonialsSectionProps> = (props) => (
  // Own provider over the shared singleton client (see main.tsx): the query
  // runtime loads with this below-fold chunk, never with the critical path.
  <QueryClientProvider client={queryClient}>
    <TestimonialsSectionInner {...props} />
  </QueryClientProvider>
);

const TestimonialsSectionInner: React.FC<TestimonialsSectionProps> = ({
  slug,
  fallbackSlug,
  items: directItems,
  eyebrow = 'TESTIMONIALS',
  title = 'What Our Clients Say',
  onOpenBooking,
}) => {
  // Resolution order: direct items → slug → fallbackSlug.
  const primary = useTestimonials(directItems?.length ? undefined : slug);
  const fallbackEnabled = Boolean(
    fallbackSlug && fallbackSlug !== slug && !directItems?.length,
  );
  const fallback = useTestimonials(fallbackEnabled ? fallbackSlug : undefined);

  let testimonials = directItems?.length
    ? toTestimonialItems({ data: directItems })
    : [];
  if (!testimonials.length && primary.data) {
    testimonials = toTestimonialItems(primary.data);
  }
  if (!testimonials.length && fallback.data) {
    testimonials = toTestimonialItems(fallback.data);
  }

  // Live data or nothing — hide while loading or when empty.
  if (testimonials.length === 0) return null;

  return (
    <TestimonialsCarousel
      testimonials={testimonials}
      eyebrow={eyebrow}
      title={title}
      onOpenBooking={onOpenBooking}
    />
  );
};

function TestimonialsCarousel({
  testimonials,
  eyebrow,
  title,
  onOpenBooking,
}: {
  testimonials: ReturnType<typeof toTestimonialItems>;
  eyebrow: string;
  title: string;
  onOpenBooking?: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Repeat few rows so a single review still fills the infinite loop.
  const slides = repeatToCount(testimonials, MIN_SLIDES, (item, copy) =>
    copy === 0 ? item : { ...item, id: `${item.id}-loop-${copy}` },
  );

  // Width-measured duration, written straight to the DOM (no state).
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || slides.length === 0) return;
    const setDuration = () => {
      const half = track.scrollWidth / 2;
      if (half > 0) {
        track.style.setProperty('--marquee-duration', `${Math.max(12, half / 140)}s`);
      }
    };
    setDuration();
    const ro = new ResizeObserver(setDuration);
    ro.observe(track);
    window.addEventListener('resize', setDuration);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', setDuration);
    };
  }, [slides.length]);

  return (
    <section className="py-10 sm:py-14 bg-[#FCFCFC] relative overflow-hidden">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          actionText={onOpenBooking ? 'View More Reviews' : undefined}
          onActionClick={onOpenBooking}
        />
      </Container>

      {/* Infinite auto-scroll — pauses on hover/focus, no dots or arrows. */}
      <div className="marquee-paused relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-[#FCFCFC] to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-[#FCFCFC] to-transparent"
        />
        <div ref={trackRef} className="marquee-track py-4 flex w-max gap-6 md:gap-10 px-4">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex gap-6 md:gap-10 shrink-0">
              {slides.map((item) => (
                <div key={`${item.id}-c${copy}`} className="w-[85%] sm:w-[340px] shrink-0">
                  <TestimonialCard testimonial={item} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
