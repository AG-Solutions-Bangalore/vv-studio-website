import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getTestimonials } from '../api/testimonialApi';
import type { TestimonialResponse } from '../api/testimonialApi';

export const testimonialKeys = {
  all: ['testimonials'] as const,
  bySlug: (slug: string) => [...testimonialKeys.all, slug] as const,
};

/**
 * Testimonials scoped by page slug (backend requires the slug).
 *
 * Usage:
 *   const { data } = useTestimonials('home');
 */
export function useTestimonials(slug?: string): UseQueryResult<TestimonialResponse, Error> {
  return useQuery({
    queryKey: testimonialKeys.bySlug(slug ?? ''),
    queryFn: () => getTestimonials(slug ?? ''),
    enabled: Boolean(slug),
  });
}
