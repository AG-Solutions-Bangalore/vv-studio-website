import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getOffers } from '../api/offersApi';
import { OFFERS_DATA, type OfferItem } from '@/data/offersData';

export const offerKeys = {
  all: ['offers'] as const,
  list: () => [...offerKeys.all, 'list'] as const,
};

/**
 * Hook to retrieve festival and promotional offers.
 * Always attempts live API fetch first and falls back to offersData.ts.
 */
export function useOffers(): UseQueryResult<OfferItem[], Error> {
  return useQuery({
    queryKey: offerKeys.list(),
    queryFn: getOffers,
    placeholderData: OFFERS_DATA,
    staleTime: 5 * 60 * 1000,
  });
}
