/**
 * FAQ API contracts (`GET /getFAQBySlug/{slug}`).
 *
 * Live shape: `{ data: [] }` for unknown slugs. Item fields stay
 * permissive until a populated FAQ response is verified.
 */

export interface FaqItem {
  id?: string | number
  faq_question?: string | null
  faq_answer?: string | null
  /** Live wire format (`GET /getFAQBySlug/{slug}`). */
  faq_que?: string | null
  faq_ans?: string | null
  faq_heading?: string | null
  faq_sort?: string | number | null
  [key: string]: unknown
}

export interface FaqBySlugResponse {
  data: FaqItem[]
}

export type FaqResponse = FaqBySlugResponse
