import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getClients } from '../api/clientApi';
import type { ClientResponse } from '../api/clientApi';

export const clientKeys = {
  all: ['clients'] as const,
  list: () => [...clientKeys.all, 'list'] as const,
};

/** Client / partner list query. */
export function useClients(): UseQueryResult<ClientResponse, Error> {
  return useQuery({
    queryKey: clientKeys.list(),
    queryFn: getClients,
    staleTime: 10 * 60 * 1000,
  });
}
