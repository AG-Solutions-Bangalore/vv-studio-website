import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import {
  getBlogBySlug,
  getBlogs,
  getFeaturedBlogs,
  getFrontBlogs,
} from '../api/blogApi';
import type { BlogDetailResponse, BlogListResponse } from '../types';

export const blogKeys = {
  all: ['blogs'] as const,
  front: () => [...blogKeys.all, 'front'] as const,
  featured: () => [...blogKeys.all, 'featured'] as const,
  list: () => [...blogKeys.all, 'list'] as const,
  detail: (slug: string) => [...blogKeys.all, 'detail', slug] as const,
};

/** Homepage blog rail (`BlogSection`). */
export function useFrontBlogs(): UseQueryResult<BlogListResponse, Error> {
  return useQuery({ queryKey: blogKeys.front(), queryFn: getFrontBlogs });
}

/** Featured posts. */
export function useFeaturedBlogs(): UseQueryResult<BlogListResponse, Error> {
  return useQuery({ queryKey: blogKeys.featured(), queryFn: getFeaturedBlogs });
}

/** Full journal grid (`BlogGrid` on the Blog page). */
export function useBlogs(): UseQueryResult<BlogListResponse, Error> {
  return useQuery({ queryKey: blogKeys.list(), queryFn: getBlogs });
}

/** Single article by slug (query stays idle until `slug` is set). */
export function useBlogBySlug(slug?: string): UseQueryResult<BlogDetailResponse, Error> {
  return useQuery({
    queryKey: blogKeys.detail(slug ?? ''),
    queryFn: () => getBlogBySlug(slug ?? ''),
    enabled: Boolean(slug),
  });
}
