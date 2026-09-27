import { apiClient } from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { FaqItem, FaqResponse } from '@/lib/api/types';

export type { FaqItem, FaqResponse } from '@/lib/api/types';

/**
 * GET /getFAQBySlug/{slug} — FAQs scoped by page/service slug.
 * Used by FAQ surfaces (services pages fall back to `services` module hook).
 */
export async function getFaqBySlug(slug: string): Promise<FaqResponse> {
  const { data } = await apiClient.get<FaqResponse>(ENDPOINTS.faqBySlug(slug));
  return data;
}

export interface FaqRow {
  question: string;
  answer: string;
  heading: string;
  sort: number;
}

function fieldOf(item: FaqItem, keys: string[]): string {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function sortOf(item: FaqItem): number {
  const raw = item.faq_sort;
  const num = typeof raw === 'number' ? raw : Number(String(raw ?? '').trim());
  return Number.isFinite(num) ? num : Number.MAX_SAFE_INTEGER;
}

/** Normalize + drop empty rows + sort ascending by `faq_sort`. */
export function normalizeFaqItems(raw: FaqItem[]): FaqRow[] {
  return raw
    .map((item) => ({
      question: fieldOf(item, ['question', 'faq_que', 'faq_question']),
      answer: fieldOf(item, ['answer', 'faq_ans', 'faq_answer']),
      heading: typeof item.faq_heading === 'string' ? item.faq_heading.trim() : '',
      sort: sortOf(item),
    }))
    .filter((row) => row.question && row.answer)
    .sort((a, b) => a.sort - b.sort);
}

export interface FaqGroup {
  row: FaqRow;
  /** Show the heading label above this row (first of a consecutive group). */
  showHeading: boolean;
}

/**
 * Attach group labels: every distinct heading renders once per consecutive
 * group, except when it duplicates the section title.
 */
export function groupFaqRows(rows: FaqRow[], sectionTitle: string): FaqGroup[] {
  let lastHeading: string | null = null;
  return rows.map((row) => {
    const showHeading =
      row.heading.length > 0 &&
      row.heading.toLowerCase() !== sectionTitle.toLowerCase() &&
      row.heading !== lastHeading;
    lastHeading = row.heading || lastHeading;
    return { row, showHeading };
  });
}
