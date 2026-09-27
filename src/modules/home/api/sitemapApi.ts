import { apiClient } from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { SitemapResponse } from '@/lib/api/types';

export type { SitemapEntry, SitemapResponse } from '@/lib/api/types';

/**
 * GET /getSitemap — crawlable pages + blog urls for SEO.
 * Used by the footer Quick Links (`FooterQuickLinks`).
 */
export async function getSitemap(): Promise<SitemapResponse> {
  const { data } = await apiClient.get<SitemapResponse>(ENDPOINTS.sitemap);
  return data;
}
