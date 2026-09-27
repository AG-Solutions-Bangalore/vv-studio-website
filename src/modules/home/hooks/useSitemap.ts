import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getSitemap } from '../api/sitemapApi';
import type { SitemapResponse } from '../api/sitemapApi';

export const sitemapKeys = {
  all: ['sitemap'] as const,
};

/** Sitemap pages query (SEO). Rarely changes — cached for an hour. */
export function useSitemap(): UseQueryResult<SitemapResponse, Error> {
  return useQuery({
    queryKey: sitemapKeys.all,
    queryFn: getSitemap,
    staleTime: 60 * 60 * 1000,
  });
}
