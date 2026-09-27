import { apiClient } from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { CompanyResponse } from '../types';

/**
 * GET /getCompany — studio profile (name, email, phones, address, logo).
 * Used by Header / Footer / About / Contact surfaces via `useCompany`.
 */
export async function getCompany(): Promise<CompanyResponse> {
  const { data } = await apiClient.get<CompanyResponse>(ENDPOINTS.company);
  return data;
}
