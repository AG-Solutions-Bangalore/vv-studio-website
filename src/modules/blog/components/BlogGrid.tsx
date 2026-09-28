import React, { useMemo, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Container } from '@/components/ui/Container';
import { BlogCard } from '@/modules/home/components/BlogCard';
import { toBlogItems, blogDetailPath } from '../api/blogApi';
import { useBlogs, useFeaturedBlogs, useFrontBlogs } from '../hooks/useBlogs';

const ALL = 'All';

/**
 * Full journal collection — displays all blogs from all 3 live APIs
 * (front blogs, featured blogs, and regular blogs) in a single unified grid
 * without dividing into separate sections and without mock data.
 */
export const BlogGrid: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <BlogGridInner />
  </QueryClientProvider>
);

const BlogGridInner: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>(ALL);

  // 3 live blog APIs
  const frontQuery = useFrontBlogs();
  const featuredQuery = useFeaturedBlogs();
  const blogsQuery = useBlogs();

  const isPending =
    (frontQuery.isPending && !frontQuery.isError) ||
    (featuredQuery.isPending && !featuredQuery.isError) ||
    (blogsQuery.isPending && !blogsQuery.isError);

  // Combine all articles across the 3 APIs without deduplication so all data is shown
  const posts = useMemo(() => {
    const featuredItems = featuredQuery.data
      ? toBlogItems(featuredQuery.data).map((item, idx) => ({
          ...item,
          id: `featured-${item.id || idx}-${idx}`,
        }))
      : [];
    const frontItems = frontQuery.data
      ? toBlogItems(frontQuery.data).map((item, idx) => ({
          ...item,
          id: `front-${item.id || idx}-${idx}`,
        }))
      : [];
    const listItems = blogsQuery.data
      ? toBlogItems(blogsQuery.data).map((item, idx) => ({
          ...item,
          id: `blog-${item.id || idx}-${idx}`,
        }))
      : [];

    return [...featuredItems, ...frontItems, ...listItems];
  }, [frontQuery.data, featuredQuery.data, blogsQuery.data]);

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(posts.map((b) => b.category).filter(Boolean)),
    );
    return [ALL, ...cats];
  }, [posts]);

  const visiblePosts = useMemo(
    () =>
      activeCategory === ALL
        ? posts
        : posts.filter((b) => b.category === activeCategory),
    [activeCategory, posts],
  );

  if (isPending) {
    return (
      <section id="articles" className="py-10 sm:py-14 bg-[#FCFCFC] relative">
        <Container>
          <SectionHeading
            eyebrow="OUR BLOG"
            title="All Stories & Articles"
            subtitle="Expert advice, self-care tips and the latest in beauty & wellness."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#E8DCE5]/60 h-80"
              />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section id="articles" className="py-10 sm:py-14 bg-[#FCFCFC] relative">
        <Container>
          <SectionHeading
            eyebrow="OUR BLOG"
            title="All Stories & Articles"
            subtitle="Expert advice, self-care tips and the latest in beauty & wellness."
          />
          <div className="text-center py-12 text-[#7A6A77]">
            <p className="text-base font-medium">No articles found at the moment.</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="articles" className="py-10 sm:py-14 bg-[#FCFCFC] relative">
      <Container>
        <SectionHeading
          eyebrow="OUR BLOG"
          title="All Stories & Articles"
          subtitle="Expert advice, self-care tips and the latest in beauty & wellness."
        />

        {/* Category filter */}
        {categories.length > 1 && (
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
        )}

        {/* Cards grid — all articles in one place */}
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
