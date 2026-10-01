import React, { Suspense, lazy, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarCheck,
  Clock,
  ListTree,
  Tag,
} from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Container } from '@/components/ui/Container';
import { BlogCarousels } from '../components/BlogCarousels';
import { CTABanner } from '@/modules/home/components/CTABanner';
import { useSEO } from '@/seo/seo';
import { liveBlogSlug, normalizeBlogPost, withBlogHeadingIds } from '../api/blogApi';
import { useBlogBySlug } from '../hooks/useBlogs';

// Page FAQs — lazy + own QueryClientProvider inside (renders nothing when empty).
const FaqSection = lazy(() =>
  import('@/modules/faq').then((m) => ({
    default: m.FaqSection,
  })),
);

// Heavy booking form: code-split and never mounted until first open.
const BookingModal = lazy(() =>
  import('@/components/shared/BookingModal').then((m) => ({
    default: m.BookingModal,
  })),
);

interface ArticleView {
  title: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  imageAlt: string;
  excerpt: string;
  body: string[];
  html: string;
  prevPath: string | null;
  prevTitle: string | null;
  nextPath: string | null;
  nextTitle: string | null;
}

/**
 * Article detail (`/blog/:slug`) — live post (GET /getBlogsBySlug/{slug}).
 * Renders nothing article-related when the API has no data (same rule
 * as FAQ/testimonials/blogs). No testimonials here by design — FAQ only.
 */
export const BlogDetailPage: React.FC = () => (
  // Own provider over the shared singleton client (see main.tsx): the query
  // runtime loads with this route chunk, never with the critical path.
  <QueryClientProvider client={queryClient}>
    <BlogDetailPageInner />
  </QueryClientProvider>
);

const BlogDetailPageInner: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useSEO('blog');

  const { data: live, isPending: livePending } = useBlogBySlug(slug);

  let article: ArticleView | null = null;

  if (live?.data) {
    const normalized = normalizeBlogPost(live.data, live.image_url);
    const prev = live.previous ?? null;
    const next = live.next ?? null;
    article = {
      title: normalized.title,
      category: normalized.category,
      readTime: normalized.readTime,
      date: normalized.date,
      image: normalized.image,
      imageAlt: normalized.imageAlt,
      excerpt: normalized.excerpt,
      body: normalized.body,
      html: normalized.html,
      prevPath: prev ? `/blog/${liveBlogSlug(prev)}` : null,
      prevTitle: prev
        ? String(prev.blog_title ?? prev.title ?? '')
        : null,
      nextPath: next ? `/blog/${liveBlogSlug(next)}` : null,
      nextTitle: next
        ? String(next.blog_title ?? next.title ?? '')
        : null,
    };
  }

  const handleOpenBooking = () => setIsBookingOpen(true);

  // Headings get anchor ids once — sidebar TOC links to them.
  const { html: articleHtml, toc } = useMemo(
    () => withBlogHeadingIds(article?.html ?? ''),
    [article?.html],
  );

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#40363F] flex flex-col antialiased selection:bg-[#D91A8A] selection:text-white">
      <Header onOpenBooking={handleOpenBooking} />

      <main className="flex-1">
        {!article ? (
          <section className="pt-[130px] pb-16 text-center">
            <Container>
              {livePending ? (
                <>
                  <p className="text-xs font-bold tracking-[0.22em] uppercase text-[#D91A8A] mb-3">
                    Loading
                  </p>
                  <h1 className="font-display italic text-3xl sm:text-4xl text-[#2D0A2E] font-semibold">
                    Fetching your story…
                  </h1>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold tracking-[0.22em] uppercase text-[#D91A8A] mb-3">
                    Not found
                  </p>
                  <h1 className="font-display italic text-3xl sm:text-4xl text-[#2D0A2E] font-semibold mb-4">
                    This article doesn&apos;t exist yet
                  </h1>
                  <Link
                    to="/blog"
                    title="Back to VV Studio Beauty & Wellness Blog"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#E8329D] hover:bg-[#D91A8A] text-white text-sm font-semibold px-6 py-2.5 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                  </Link>
                </>
              )}
            </Container>
          </section>
        ) : (
          <>
            {/* Article hero */}
            <section className="pt-[110px] lg:pt-[120px] pb-8 sm:pb-10 bg-[#FCFCFC]">
              <Container>
                <Link
                  to="/blog"
                  title="Back to VV Studio Beauty & Wellness Blog"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D91A8A] hover:text-[#A80086] transition-colors mb-5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  All articles
                </Link>
                <p className="text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-[#D91A8A] mb-2.5">
                  {article.category}
                </p>
                <h1 className="font-display italic text-[30px] sm:text-4xl lg:text-5xl text-[#2D0A2E] font-semibold tracking-tight leading-[1.15] w-full max-w-none mb-4">
                  {article.title}
                </h1>
                {article.excerpt && (
                  <p className="text-base sm:text-lg text-[#5E525C] leading-relaxed w-full max-w-none mb-5">
                    {article.excerpt}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-[13px] text-[#8A7A88] mb-6">
                  {article.date && (
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {article.date}
                    </span>
                  )}
                  {article.readTime && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    {article.category}
                  </span>
                </div>
                {article.image && (
                  <div className="relative aspect-[16/8] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#FAF0F6] border border-[#F1E4EE]">
                    <img
                      src={article.image}
                      alt={article.imageAlt}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </Container>
            </section>

            {/* Article body + sidebar — full-width grid, no empty column */}
            <section className="pb-10 sm:pb-14">
              <Container>
                <div className="grid w-full max-w-none items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]">
                  {/* Main article column */}
                  <div className="min-w-0">
                    {articleHtml ? (
                      <div
                        className="w-full max-w-none text-sm sm:text-[15px] leading-relaxed text-[#5E525C] [&_h1]:font-display [&_h1]:text-[22px] [&_h1]:sm:text-[26px] [&_h1]:font-semibold [&_h1]:text-[#2D0A2E] [&_h1]:leading-snug [&_h1]:mt-2 [&_h1]:mb-4 [&_h1:first-child]:mt-0 [&_h2]:font-display [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-semibold [&_h2]:text-[#2D0A2E] [&_h2]:tracking-tight [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:scroll-mt-28 [&_h3]:text-base [&_h3]:sm:text-lg [&_h3]:font-semibold [&_h3]:text-[#2D0A2E] [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:scroll-mt-28 [&_h4]:text-sm [&_h4]:sm:text-base [&_h4]:font-semibold [&_h4]:text-[#2D0A2E] [&_h4]:mt-5 [&_h4]:mb-2 [&_p]:mb-4 [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-[#2D0A2E] [&_em]:italic [&_a]:text-[#D91A8A] [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-[#A80086] [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_li]:mb-1.5 [&_li]:leading-relaxed [&_img]:rounded-2xl [&_img]:my-6 [&_img]:w-full [&_img]:object-cover [&_blockquote]:border-l-4 [&_blockquote]:border-[#F06AB9] [&_blockquote]:bg-[#FDF2F8] [&_blockquote]:rounded-r-2xl [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:mb-4 [&_blockquote]:italic [&_blockquote]:text-[#2D0A2E]"
                        dangerouslySetInnerHTML={{ __html: articleHtml }}
                      />
                    ) : (
                      article.body.map((para, i) => (
                        <p
                          key={i}
                          className="leading-relaxed text-[#5E525C] text-sm sm:text-[15px] mb-4"
                        >
                          {para}
                        </p>
                      ))
                    )}

                    {/* Prev / Next */}
                    {(article.prevPath || article.nextPath) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 pt-8 border-t border-[#F1E4EE]">
                        {article.prevPath ? (
                          <Link
                            to={article.prevPath}
                            title={article.prevTitle ?? 'Previous article'}
                            className="group rounded-2xl border border-[#F1E4EE] bg-white p-4 hover:border-[#F06AB9] transition-colors"
                          >
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.18em] uppercase text-[#D91A8A] mb-1">
                              <ArrowLeft className="w-3.5 h-3.5" />
                              Previous
                            </span>
                            <span className="block text-sm font-semibold text-[#2D0A2E] group-hover:text-[#A80086] line-clamp-2">
                              {article.prevTitle}
                            </span>
                          </Link>
                        ) : (
                          <span />
                        )}
                        {article.nextPath ? (
                          <Link
                            to={article.nextPath}
                            title={article.nextTitle ?? 'Next article'}
                            className="group rounded-2xl border border-[#F1E4EE] bg-white p-4 text-right hover:border-[#F06AB9] transition-colors"
                          >
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.18em] uppercase text-[#D91A8A] mb-1">
                              Next
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                            <span className="block text-sm font-semibold text-[#2D0A2E] group-hover:text-[#A80086] line-clamp-2">
                              {article.nextTitle}
                            </span>
                          </Link>
                        ) : (
                          <span />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sidebar — fills the right column on desktop, stacks below on mobile */}
                  <aside className="w-full min-w-0 space-y-5 lg:sticky lg:top-[104px]">
                    {toc.length > 0 && (
                      <nav
                        aria-label="On this page"
                        className="rounded-2xl border border-[#F1E4EE] bg-white p-5"
                      >
                        <p className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] uppercase text-[#D91A8A] mb-3">
                          <ListTree className="w-3.5 h-3.5" />
                          On this page
                        </p>
                        <ul className="space-y-2">
                          {toc.map((item) => (
                            <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
                              <a
                                href={`#${item.id}`}
                                title={item.text}
                                className="block text-[13px] font-medium leading-snug text-[#5E525C] hover:text-[#A80086] transition-colors line-clamp-2"
                              >
                                {item.text}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    )}

                    <div className="rounded-2xl bg-[#2D0A2E] p-5 text-white">
                      <p className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] uppercase text-[#F7B7D7] mb-2">
                        <CalendarCheck className="w-3.5 h-3.5" />
                        VV Studio
                      </p>
                      <p className="font-display italic text-xl font-semibold leading-snug mb-2">
                        Love this look? Book it.
                      </p>
                      <p className="text-[13px] leading-relaxed text-white/70 mb-4">
                        Expert stylists, premium toxin-free products and a relaxing salon
                        experience in Bengaluru.
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenBooking}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#E8329D] hover:bg-[#D91A8A] text-white text-sm font-semibold px-5 py-2.5 transition-colors"
                      >
                        Book Appointment
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </aside>
                </div>
              </Container>
            </section>

            {/* Related rails — full-width top-level siblings, never nested
                in the article container (featured first, then other) */}
            <BlogCarousels currentSlug={slug} />

            {/* Article FAQs — fixed title; direct rows win, then slug, then shared fallback */}
            <Suspense fallback={null}>
              <FaqSection
                title="FAQ"
                slug={slug}
                fallbackSlug="blogs"
                items={live?.faq}
              />
            </Suspense>

            <CTABanner onOpenBooking={handleOpenBooking} />
          </>
        )}
      </main>

      <Footer />

      {isBookingOpen && (
        <Suspense fallback={null}>
          <BookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
};
