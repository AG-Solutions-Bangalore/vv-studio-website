import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import { Container } from '@/components/ui/Container';
import { groupFaqRows, normalizeFaqItems } from '@/modules/home/api/faqApi';
import { useFaq } from '@/modules/home/hooks/useFaq';
import type { FaqItem } from '@/lib/api/types';

interface FaqSectionProps {
  /**
   * Page slug for `GET /getFAQBySlug/{slug}`.
   * Convention (see docs/API.md): `home`, `about-us`, `services`,
   * `gallery`, `blog`, `blogs`, `contact`, or an article slug on `/blog/:slug`.
   */
  slug?: string;
  /** Shared fallback slug (skipped when it equals `slug`). */
  fallbackSlug?: string;
  /** Direct rows win over any fetch when non-empty. */
  items?: FaqItem[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

/**
 * Page FAQ accordion (GET /getFAQBySlug/{slug}).
 *
 * Renders **nothing** while the backend returns no items — pages keep
 * their current design until FAQs are seeded, then the section appears
 * automatically. Mounts its own `QueryClientProvider` over the shared
 * singleton client (same pattern as `BookingModal`), so import it
 * lazily on performance-critical routes:
 *
 *   const FaqSection = lazy(() =>
 *     import('@/components/shared/FaqSection').then((m) => ({
 *       default: m.FaqSection,
 *     })),
 *   );
 *   <FaqSection slug="home" />
 */
export const FaqSection: React.FC<FaqSectionProps> = (props) => (
  <QueryClientProvider client={queryClient}>
    <FaqSectionInner {...props} />
  </QueryClientProvider>
);

const FaqSectionInner: React.FC<FaqSectionProps> = ({
  slug,
  fallbackSlug,
  items: directItems,
  eyebrow = 'STILL HAVE QUESTIONS?',
  title: titleProp,
  subtitle = 'Everything you need to know before your visit.',
}) => {
  // Resolution order: direct items → slug → fallbackSlug.
  const primary = useFaq(directItems?.length ? undefined : slug);
  const fallbackEnabled = Boolean(
    fallbackSlug && fallbackSlug !== slug && !directItems?.length,
  );
  const fallback = useFaq(fallbackEnabled ? fallbackSlug : undefined);

  const source: FaqItem[] = directItems?.length
    ? directItems
    : (primary.data?.data ?? []).length > 0
      ? (primary.data?.data ?? [])
      : (fallback.data?.data ?? []);
  const items = normalizeFaqItems(source);

  // Reset open state when the slug changes (render-phase comparison —
  // no setState-in-effect, keeps the hooks lint rule happy).
  const slugKey = `${slug ?? ''}||${fallbackSlug ?? ''}`;
  const [prevSlugKey, setPrevSlugKey] = useState(slugKey);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (prevSlugKey !== slugKey) {
    setPrevSlugKey(slugKey);
    setOpenIndex(0);
  }

  // Section title: explicit prop → first API heading → generic default.
  const sectionTitle =
    titleProp ?? items.find((row) => row.heading)?.heading ?? 'Frequently Asked Questions';

  if (items.length === 0) return null;

  const groups = groupFaqRows(items, sectionTitle);

  return (
    <section aria-label={sectionTitle} className="py-10 sm:py-14 lg:py-16 border-t bg-white relative overflow-hidden">
      {/* soft ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[-10%] w-[420px] h-[420px] rounded-full bg-[#FDF0F8] blur-3xl"
      />
      <Container>
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left — sticky heading */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <p className="text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-[#D91A8A] mb-2">
              {eyebrow}
            </p>
            <h2 className="font-display italic text-[28px] sm:text-4xl text-[#2D0A2E] font-semibold tracking-tight leading-[1.15] mb-3">
              {sectionTitle}
            </h2>
            {subtitle && (
              <p className="text-[#6D5D6A] text-sm sm:text-[15px] leading-relaxed mb-4">
                {subtitle}
              </p>
            )}
            <p className="inline-flex items-center gap-2 rounded-full bg-[#FFF0F7] border border-[#F8C1DE] px-3.5 py-1.5 text-xs font-semibold text-[#A80086]">
              {items.length} {items.length === 1 ? 'answer' : 'answers'} to explore
            </p>
          </div>

          {/* Right — accordion with heading groups */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-3.5">
            {groups.map(({ row: item, showHeading }, index) => {
              const open = openIndex === index;
              return (
                <React.Fragment key={`${slugKey}-${index}`}>
                  {showHeading && (
                    <p className="pt-2 text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-[#A80086]">
                      {item.heading}
                    </p>
                  )}
                  <div
                    className={`rounded-2xl border transition-all motion-safe:duration-300 overflow-hidden ${
                      open
                        ? 'bg-[#FFF5F9] border-[#F8C1DE] shadow-[0_12px_32px_rgba(180,30,120,0.10)]'
                        : 'bg-[#FCFCFC] border-[#F1E4EE] hover:border-[#F8C1DE] hover:shadow-[0_6px_20px_rgba(180,30,120,0.06)]'
                    }`}
                  >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    aria-expanded={open}
                    className="w-full flex items-center gap-4 text-left px-5 sm:px-6 py-4 sm:py-5 cursor-pointer"
                  >
                    <span
                      aria-hidden="true"
                      className={`hidden sm:block text-xs font-bold tabular-nums shrink-0 w-7 transition-colors ${
                        open ? 'text-[#E8329D]' : 'text-[#C9B8C6]'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`flex-1 text-sm sm:text-[15px] font-semibold transition-colors ${
                        open ? 'text-[#A80086]' : 'text-[#2D0A2E]'
                      }`}
                    >
                      {item.question}
                    </span>
                    <span
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all motion-safe:duration-300 ${
                        open
                          ? 'bg-[#E8329D] text-white rotate-45 shadow-[0_4px_14px_rgba(232,50,157,0.45)]'
                          : 'bg-[#FFF0F7] text-[#D91A8A]'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </span>
                  </button>
                  <div
                    className={`grid transition-all motion-safe:duration-300 motion-safe:ease-in-out ${
                      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 sm:px-6 sm:pl-[3.75rem] pr-14 sm:pr-16 pb-5 sm:pb-6 text-[13px] sm:text-sm text-[#6D5D6A] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};
