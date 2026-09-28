import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getCompany } from '../api/companyApi';
import type { CompanyResponse } from '../types';

export const companyKeys = {
  all: ['company'] as const,
  detail: () => [...companyKeys.all, 'detail'] as const,
};

/**
 * Studio profile query.
 *
 * Usage:
 *   const { data, isPending } = useCompany();
 *   // data?.data.company_mobile_no, data?.data.company_address, ...
 */
export function useCompany(): UseQueryResult<CompanyResponse, Error> {
  return useQuery({
    queryKey: companyKeys.detail(),
    queryFn: getCompany,
    staleTime: 10 * 60 * 1000,
  });
}
