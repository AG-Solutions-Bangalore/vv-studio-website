import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Container } from '@/components/ui/Container';
import { toReviewRows, type ReviewRow } from '../api/testimonialApi';
import { useTestimonials } from '../hooks/useTestimonials';
import { ReviewMarquee } from './ReviewMarquee';
import type { Testimonial } from '@/lib/api/types';

interface TestimonialSectionProps {
  /** Page slug for `GET /getTestimonial/{slug}`. */
  slug?: string;
  /** Shared fallback slug (skipped when it equals `slug`). */
  fallbackSlug?: string;
  /** Direct rows win over any fetch when non-empty. */
  items?: Testimonial[];
  eyebrow?: string;
  title?: string;
}

/**
 * Slug-driven review loop for light page sections.
 * Resolution: direct `items` → `GET /getTestimonial/{slug}` →
 * `GET /getTestimonial/{fallbackSlug}`. Renders nothing when empty.
 * Mounts its own `QueryClientProvider` over the shared singleton client.
 */
export const TestimonialSection: React.FC<TestimonialSectionProps> = (props) => (
  <QueryClientProvider client={queryClient}>
    <TestimonialSectionInner {...props} />
  </QueryClientProvider>
);

const TestimonialSectionInner: React.FC<TestimonialSectionProps> = ({
  slug,
  fallbackSlug,
  items,
  eyebrow = 'CLIENT STORIES',
  title = 'What Our Customers Say',
}) => {
  const primary = useTestimonials(slug);
  const fallbackEnabled = Boolean(fallbackSlug && fallbackSlug !== slug && !items?.length);
  const fallback = useTestimonials(fallbackEnabled ? fallbackSlug : undefined);

  // Cheap filter over tiny arrays — computed inline (no memo needed).
  let rows: ReviewRow[] = [];
  if (items && items.length > 0) {
    rows = toReviewRows({ data: items });
  } else if (primary.data) {
    rows = toReviewRows(primary.data);
    if (rows.length === 0 && fallback.data) rows = toReviewRows(fallback.data);
  } else if (fallback.data) {
    rows = toReviewRows(fallback.data);
  }

  if (rows.length === 0) return null;

  return (
    <section aria-label={title} className="py-10 sm:py-14 bg-[#FCFCFC] relative overflow-hidden">
      <Container>
        <div className="text-left mb-6 sm:mb-8">
          <p className="text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-[#D91A8A] mb-2">
            {eyebrow}
          </p>
          <h2 className="font-display italic text-[26px] sm:text-4xl text-[#2D0A2E] font-semibold tracking-tight leading-[1.15]">
            {title}
          </h2>
        </div>
      </Container>
      <ReviewMarquee items={rows} tone="light" hideHeader />
    </section>
  );
};
