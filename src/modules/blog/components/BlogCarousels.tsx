import React, { useRef, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Container } from '@/components/ui/Container';
import {
  Carousel,
  CarouselControls,
  type CarouselHandle,
  type CarouselState,
} from '@/components/ui/Carousel';
import { BlogCard } from '@/modules/home/components/BlogCard';
import {
  blogDetailPath,
  normalizeBlogPost,
  type LiveBlogItem,
} from '../api/blogApi';
import { useBlogBySlug, useBlogs, useFeaturedBlogs, useFrontBlogs } from '../hooks/useBlogs';
import type { BlogPost, ImageUrlEntry } from '../types';

const EMPTY_STATE: CarouselState = { canPrev: false, canNext: false, page: 0, pages: 1 };

interface BlogRailProps {
  eyebrow: string;
  title: string;
  posts: LiveBlogItem[];
  carouselLabel: string;
}

const BlogRail: React.FC<BlogRailProps> = ({ eyebrow, title, posts, carouselLabel }) => {
  const carouselRef = useRef<CarouselHandle>(null);
  const [carouselState, setCarouselState] = useState<CarouselState>(EMPTY_STATE);

  // Live data or nothing — hidden while loading or when empty.
  if (posts.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 bg-[#FCFCFC] relative">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          controls={
            posts.length > 0 ? (
              <span className="flex items-center gap-3">
                {carouselState.pages > 1 && (
                  <span className="text-xs font-bold tabular-nums tracking-widest text-[#A80086]">
                    {String(carouselState.page + 1).padStart(2, '0')} /{' '}
                    {String(carouselState.pages).padStart(2, '0')}
                  </span>
                )}
                <CarouselControls
                  onPrev={() => carouselRef.current?.scrollPrev()}
                  onNext={() => carouselRef.current?.scrollNext()}
                  canPrev={carouselState.canPrev}
                  canNext={carouselState.canNext}
                />
              </span>
            ) : undefined
          }
        />

        <Carousel
          ref={carouselRef}
          ariaLabel={carouselLabel}
          autoplay
          autoplayDelay={5000}
          onStateChange={setCarouselState}
          trackClassName="gap-6 sm:gap-7 pb-1"
          slideClassName="basis-full sm:basis-[calc(50%-14px)] lg:basis-[calc(33.3333%-18.6667px)]"
        >
          {posts.map((blog) => (
            <BlogCard key={blog.id} blog={blog} detailPath={blogDetailPath(blog)} />
          ))}
        </Carousel>
      </Container>
    </section>
  );
};

  const toItems = (posts: BlogPost[], imageEntries: ImageUrlEntry[]): LiveBlogItem[] =>
    posts.map((post, index) => {
      const normalized = normalizeBlogPost(post, imageEntries, index);
      return {
        id: normalized.key,
        title: normalized.title,
        category: normalized.category,
        readTime: normalized.readTime,
        excerpt: normalized.excerpt,
        image: normalized.image,
        date: normalized.date,
        slug: normalized.slug,
      };
    });

/**
 * Blog details rails — full-width top-level sections.
 *
 * Carousel 1 (featured): `GET /getFeaturedBlogs`, fallback to the `featured`
 * array embedded in `GET /getBlogsBySlug/{slug}` (same query key — cached,
 * no extra request). Current blog excluded by `blog_slug` (fallback `id`).
 *
 * Carousel 2 (other): `GET /getFrontBlogs`, fallback to `GET /getBlogs`.
 * Excludes the current blog AND everything shown in carousel 1.
 * Empty/error → section hidden. Remounts per slug (scroll resets).
 */
export const BlogCarousels: React.FC<{ currentSlug: string }> = ({ currentSlug }) => (
  <QueryClientProvider client={queryClient}>
    <BlogCarouselsInner key={currentSlug} currentSlug={currentSlug} />
  </QueryClientProvider>
);

const BlogCarouselsInner: React.FC<{ currentSlug: string }> = ({ currentSlug }) => {
  const detail = useBlogBySlug(currentSlug);
  const featuredQuery = useFeaturedBlogs();
  const frontQuery = useFrontBlogs();
  const blogsQuery = useBlogs();

  const isCurrent = (post: BlogPost, index: number): boolean => {
    const slug =
      typeof post.blog_slug === 'string' && post.blog_slug
        ? post.blog_slug
        : typeof post.slug === 'string' && post.slug
          ? post.slug
          : null;
    if (slug) return slug === currentSlug;
    return String(post.id ?? `live-${index}`) === currentSlug;
  };

  // Carousel 1 — featured, then embedded fallback.
  const featuredRaw: BlogPost[] =
    featuredQuery.data && featuredQuery.data.data.length > 0
      ? featuredQuery.data.data
      : (detail.data?.featured ?? []);
  const featuredBase = featuredQuery.data ?? detail.data;
  const featured: LiveBlogItem[] = featuredBase
    ? toItems(
        featuredRaw.filter((post, index) => !isCurrent(post, index)),
        featuredBase.image_url,
      )
    : [];
  const featuredSlugs = new Set(featured.map((b) => b.slug));

  // Carousel 2 — front, then full list; excludes current + carousel 1.
  const otherRaw: BlogPost[] =
    frontQuery.data && frontQuery.data.data.length > 0
      ? frontQuery.data.data
      : (blogsQuery.data?.data ?? []);
  const otherBase = frontQuery.data ?? blogsQuery.data;
  const other: LiveBlogItem[] = otherBase
    ? toItems(otherRaw, otherBase.image_url).filter(
        (b) => !featuredSlugs.has(b.slug) && b.slug !== currentSlug,
      )
    : [];

  return (
    <>
      <BlogRail
        eyebrow="FEATURED"
        title="Featured Stories"
        posts={featured}
        carouselLabel="Featured blogs carousel"
      />
      <BlogRail
        eyebrow="KEEP EXPLORING"
        title="Other Stories"
        posts={other}
        carouselLabel="Other blogs carousel"
      />
    </>
  );
};
