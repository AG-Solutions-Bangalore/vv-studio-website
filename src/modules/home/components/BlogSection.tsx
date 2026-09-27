import React, { useRef, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Container } from '@/components/ui/Container';
import { Carousel, CarouselControls, type CarouselHandle, type CarouselState } from '@/components/ui/Carousel';
import { BlogCard } from './BlogCard';
import { toBlogItems, blogDetailPath } from '@/modules/blog/api/blogApi';
import { useFrontBlogs } from '@/modules/blog/hooks/useBlogs';

export const BlogSection: React.FC = () => (
  // Own provider over the shared singleton client (see main.tsx): the query
  // runtime loads with this below-fold chunk, never with the critical path.
  <QueryClientProvider client={queryClient}>
    <BlogSectionInner />
  </QueryClientProvider>
);

const BlogSectionInner: React.FC = () => {
  // Live rail (GET /getFrontBlogs) — hidden while loading or when unseeded.
  // NOTE: hooks stay above the early return (Rules of Hooks).
  const { data, isPending } = useFrontBlogs();
  const carouselRef = useRef<CarouselHandle>(null);
  const [carouselState, setCarouselState] = useState<CarouselState>({
    canPrev: false,
    canNext: false,
    page: 0,
    pages: 1,
  });
  const posts = data ? toBlogItems(data) : [];
  if (isPending || posts.length === 0) return null;

  return (
    <section id="blog" className="py-10 sm:py-14 border-t bg-[#FCFCFC] relative">
      <Container>
        <SectionHeading
          eyebrow="FRESH FROM THE SALON"
          title="Latest Stories & Tips"
          subtitle="Expert advice, self-care tips and the latest in beauty & wellness."
          actionText="View All Blogs"
          actionHref="/blog"
          controls={
            carouselState.pages > 1 ? (
              <CarouselControls
                onPrev={() => carouselRef.current?.scrollPrev()}
                onNext={() => carouselRef.current?.scrollNext()}
                canPrev={carouselState.canPrev}
                canNext={carouselState.canNext}
              />
            ) : undefined
          }
        />

        {/* Blog carousel: 1 / 2 / 3 per view — matches design */}
        <Carousel
          ref={carouselRef}
          ariaLabel="Blog posts carousel"
          autoplay
          autoplayDelay={4000}
          loop
          onStateChange={setCarouselState}
          trackClassName="gap-6 sm:gap-7 pb-1"
          slideClassName="basis-[85%] sm:basis-[calc(50%-14px)] md:basis-[calc(33.3333%-18.6667px)]"
        >
          {posts.map((blog) => (
            <BlogCard key={blog.id} blog={blog} detailPath={blogDetailPath(blog)} />
          ))}
        </Carousel>
      </Container>
    </section>
  );
};
