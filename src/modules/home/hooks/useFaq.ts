import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getFaqBySlug } from '../api/faqApi';
import type { FaqResponse } from '../api/faqApi';

export const faqKeys = {
  all: ['faq'] as const,
  bySlug: (slug: string) => [...faqKeys.all, slug] as const,
};

/**
 * FAQs scoped by page/service slug.
 *
 * Usage:
 *   const { data } = useFaq('skin-facials');
 */
export function useFaq(slug?: string): UseQueryResult<FaqResponse, Error> {
  return useQuery({
    queryKey: faqKeys.bySlug(slug ?? ''),
    queryFn: () => getFaqBySlug(slug ?? ''),
    enabled: Boolean(slug),
  });
}
