import React, { useMemo, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Container } from '@/components/ui/Container';
import { BlogCard } from '@/modules/home/components/BlogCard';
import { toBlogItems, blogDetailPath } from '../api/blogApi';
import { useBlogs } from '../hooks/useBlogs';

const ALL = 'All';

/**
 * Full journal collection — replicates the home BlogSection card design
 * (same heading, same cards) as a filterable grid.
 * Live list (GET /getBlogs) — hidden while loading or when unseeded.
 */
export const BlogGrid: React.FC = () => (
  // Own provider over the shared singleton client (see main.tsx): the query
  // runtime loads with the blog route chunk, never with the critical path.
  <QueryClientProvider client={queryClient}>
    <BlogGridInner />
  </QueryClientProvider>
);

const BlogGridInner: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>(ALL);

  const { data, isPending } = useBlogs();
  // Memoized so the category memos below keep stable dependencies.
  const posts = useMemo(() => (data ? toBlogItems(data) : []), [data]);
  // NOTE: hooks stay above the early return (Rules of Hooks).
  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(posts.map((b) => b.category)))],
    [posts],
  );
  const visiblePosts = useMemo(
    () =>
      activeCategory === ALL
        ? posts
        : posts.filter((b) => b.category === activeCategory),
    [activeCategory, posts],
  );
  // Live data or nothing — hide while loading or when unseeded.
  if (isPending || posts.length === 0) return null;

  return (
    <section id="articles" className="py-10 sm:py-14 bg-[#FCFCFC] relative">
      <Container>
        <SectionHeading
          eyebrow="OUR BLOG"
          title="Beauty Tips, Trends & More"
          subtitle="Expert advice, self-care tips and the latest in beauty & wellness."
        />

        {/* Category filter */}
        <div
          className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-6 sm:mb-8"
          role="group"
          aria-label="Filter articles by category"
        >
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                aria-pressed={active}
                className={`rounded-full px-4 sm:px-5 py-2 text-xs sm:text-[13px] font-semibold tracking-wide transition-all duration-300 cursor-pointer min-h-[36px] ${
                  active
                    ? 'bg-[#E8329D] hover:bg-[#D91A8A] text-white shadow-[0_6px_18px_rgba(232,50,157,0.45)]'
                    : 'bg-white text-[#5E525C] border border-[#E8DCE5] hover:border-[#F06AB9] hover:text-[#A80086]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Cards — same design as the home blog carousel cards */}
        <div
          key={activeCategory}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 animate-in fade-in duration-300"
        >
          {visiblePosts.map((blog) => (
            <BlogCard key={blog.id} blog={blog} detailPath={blogDetailPath(blog)} />
          ))}
        </div>
      </Container>
    </section>
  );
};
