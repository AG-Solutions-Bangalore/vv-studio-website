import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import { Container } from '@/components/ui/Container';
import { toBlogItems, blogDetailPath } from '../api/blogApi';
import { useFeaturedBlogs } from '../hooks/useBlogs';

/**
 * Featured article spotlight (GET /getFeaturedBlogs).
 * Renders nothing while the backend list is unseeded — the Blog page
 * keeps its current design until real featured posts exist.
 */
export const FeaturedBlogBanner: React.FC = () => (
  // Own provider over the shared singleton client (see main.tsx): the query
  // runtime loads with the blog route chunk, never with the critical path.
  <QueryClientProvider client={queryClient}>
    <FeaturedBlogBannerInner />
  </QueryClientProvider>
);

const FeaturedBlogBannerInner: React.FC = () => {
  const { data } = useFeaturedBlogs();
  const items = data ? toBlogItems(data) : [];
  if (items.length === 0) return null;
  const featured = items[0];

  return (
    <section aria-label="Featured article" className="pb-10 sm:pb-14 bg-[#FCFCFC]">
      <Container>
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#3D003D] to-[#85006F] text-white">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative min-h-[220px] sm:min-h-[260px]">
              <img
                src={featured.image}
                alt={featured.title}
                title={featured.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <p className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-[#F8C1DE] mb-2.5">
                <Sparkles className="w-3.5 h-3.5" />
                Featured
              </p>
              <h2 className="font-display italic text-2xl sm:text-3xl font-semibold leading-tight mb-2.5">
                {featured.title}
              </h2>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-5">
                {featured.excerpt}
              </p>
              <div>
                <Link
                  to={blogDetailPath(featured)}
                  title={`${featured.title} — VV Studio Beauty & Wellness Blog`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#85006F] text-xs sm:text-sm font-semibold px-5 py-2.5 hover:bg-[#FFF0F7] transition-colors"
                >
                  Read Featured Story
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
