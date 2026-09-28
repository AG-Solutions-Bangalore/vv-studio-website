import { Fragment, useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { Container } from '@/components/ui/Container'
import { useFaqBySlugQuery } from '../hooks/useFaqQuery'
import type { FaqItem } from '../api/faq.types'

export interface FaqSectionProps {
  /** Page or category slug to fetch FAQs for, e.g. 'home', 'contact', 'about-us', 'blogs', or service slugs. */
  slug?: string
  /**
   * Fallback slug fetched when both `items` and the primary `slug` FAQs are
   * empty (e.g. blog detail pages fall back to the shared `'blogs'` FAQs).
   * Ignored when it matches `slug`.
   */
  fallbackSlug?: string
  /** Direct FAQ items from parent response (e.g. blog.faq) */
  items?: FaqItem[]
  /** Section title override. Defaults to first live item's `faq_heading`, or "Frequently Asked Questions". */
  title?: string
  /** Eyebrow text above the title. Defaults to "STILL HAVE QUESTIONS?". */
  eyebrow?: string
  /** Optional subtitle text */
  subtitle?: string
  /** Optional custom container/section class names. */
  className?: string
}

export function FaqSection(props: FaqSectionProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <FaqSectionInner {...props} />
    </QueryClientProvider>
  )
}

function FaqSectionInner({
  slug,
  fallbackSlug,
  items: directItems,
  title,
  eyebrow = 'STILL HAVE QUESTIONS?',
  subtitle,
  className = 'bg-[#FAF7F9]/70 py-16 lg:py-20 relative overflow-hidden border-t border-[#F1E4EE]/60',
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [lastSlug, setLastSlug] = useState(slug)

  const { data: liveFaq } = useFaqBySlugQuery(slug)
  const effectiveFallback = fallbackSlug && fallbackSlug !== slug ? fallbackSlug : undefined
  const { data: fallbackFaq } = useFaqBySlugQuery(effectiveFallback)

  // Reset the open accordion when navigating between slugs (render-phase
  // adjustment — the documented alternative to setState inside an effect).
  if (lastSlug !== slug) {
    setLastSlug(slug)
    setOpenIndex(null)
  }

  const rawList =
    directItems && directItems.length > 0
      ? directItems
      : (liveFaq?.data?.length ? liveFaq.data : (fallbackFaq?.data ?? []))

  const items = rawList
    .map((item) => {
      const rawQ = typeof item.question === 'string' ? item.question : (item.faq_que ?? item.faq_question ?? '')
      const rawA = typeof item.answer === 'string' ? item.answer : (item.faq_ans ?? item.faq_answer ?? '')
      const question = rawQ ? String(rawQ).trim() : ''
      const answer = rawA ? String(rawA).trim() : ''
      const heading = item.faq_heading ? String(item.faq_heading).trim() : null
      const sort = typeof item.faq_sort === 'number' ? item.faq_sort : Number(item.faq_sort) || 0
      return { question, answer, heading, sort }
    })
    .filter((item) => item.question && item.answer)
    .sort((a, b) => a.sort - b.sort)

  // If no data received from API, do not render the FAQ component
  if (items.length === 0) {
    return null
  }

  const resolvedTitle = title ?? 'FAQ'

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className={className}>
      {/* Soft luxury ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[-10%] w-[420px] h-[420px] rounded-full bg-[#FDF0F8] blur-3xl opacity-80"
      />
      <Container size="8xl" className="relative z-10">
        <div>
          {eyebrow && (
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#D91A8A]">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-2.5 font-display text-3xl font-semibold tracking-tight text-[#2D0A2E] md:text-4xl">
            {resolvedTitle}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-[#6D5D6A] md:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
          <div
            className="mt-3.5 h-1 w-12 rounded-full bg-gradient-to-r from-[#D91A8A] to-[#E8329D]"
            aria-hidden="true"
          />
        </div>

        <div className="mt-8 space-y-3 sm:space-y-3.5">
          {items.map((item, index) => {
            const isOpen = openIndex === index
            const questionId = `faq-${slug}-question-${index}`
            const answerId = `faq-${slug}-answer-${index}`
            // Show each distinct `faq_heading` from the API as a group label,
            // except when it duplicates the section title resolved above.
            const prevHeading = index > 0 ? items[index - 1].heading : null
            const showGroupHeading =
              !!item.heading &&
              item.heading.toLowerCase() !== resolvedTitle.toLowerCase() &&
              item.heading !== prevHeading

            return (
              <Fragment key={`${item.question}-${index}`}>
                {showGroupHeading && (
                  <h3 className="px-1 pt-5 font-display text-sm sm:text-base font-bold text-[#A80086] tracking-wide first:pt-0 uppercase">
                    {item.heading}
                  </h3>
                )}
                <div
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? 'bg-[#FFF8FB] border-[#F8C1DE] shadow-[0_10px_28px_rgba(180,30,120,0.08)] ring-1 ring-[#F8C1DE]/60'
                      : 'bg-white border-[#F1E4EE] shadow-[0_2px_12px_rgba(90,20,80,0.04)] hover:border-[#F8C1DE]/70 hover:shadow-[0_8px_24px_rgba(180,30,120,0.08)]'
                  }`}
                >
                  <button
                    type="button"
                    id={questionId}
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    className="group flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors duration-200 hover:bg-[#FFF5F9]/50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D91A8A] focus-visible:ring-offset-2 cursor-pointer"
                  >
                    <span
                      className={`text-sm sm:text-base font-semibold transition-colors duration-200 ${
                        isOpen ? 'text-[#A80086]' : 'text-[#2D0A2E] group-hover:text-[#A80086]'
                      }`}
                    >
                      {item.question}
                    </span>
                    <span
                      className={`inline-flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full shadow-xs transition-all duration-300 ${
                        isOpen
                          ? 'rotate-45 bg-[#D91A8A] text-white shadow-[0_4px_14px_rgba(217,26,138,0.4)]'
                          : 'rotate-0 bg-[#FFF0F7] text-[#D91A8A] group-hover:bg-[#FDEAF4]'
                      }`}
                      aria-hidden="true"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>

                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-[#F1E4EE] px-5 sm:px-6 pb-5 sm:pb-6 pt-3.5 sm:pt-4 text-sm sm:text-[15px] leading-relaxed text-[#6D5D6A]">
                        {/<[a-z][\s\S]*>/i.test(item.answer) ? (
                          <div
                            className="prose prose-sm max-w-none text-[#6D5D6A]"
                            dangerouslySetInnerHTML={{ __html: item.answer }}
                          />
                        ) : (
                          <p>{item.answer}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
