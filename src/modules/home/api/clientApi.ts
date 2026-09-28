import { apiClient } from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { ClientResponse } from '@/lib/api/types';

export type { Client, ClientResponse } from '@/lib/api/types';

/**
 * GET /getClient — client / partner list.
 * Used by trust-strip / clientele surfaces.
 */
export async function getClients(): Promise<ClientResponse> {
  const { data } = await apiClient.get<ClientResponse>(ENDPOINTS.clients);
  return data;
}
