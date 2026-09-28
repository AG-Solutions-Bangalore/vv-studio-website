import { apiClient } from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { Testimonial, TestimonialResponse } from '@/lib/api/types';
import type { TestimonialItem } from '@/data/salonData';

export type { Testimonial, TestimonialResponse } from '@/lib/api/types';

/**
 * GET /getTestimonial/{slug} — slug is required by the backend.
 * Used by the home `TestimonialsSection` and the slug-driven
 * `TestimonialSection` (blog listing page).
 */
export async function getTestimonials(slug: string): Promise<TestimonialResponse> {
  const { data } = await apiClient.get<TestimonialResponse>(
    ENDPOINTS.testimonialBySlug(slug),
  );
  return data;
}

function clampRating(value: unknown): number {
  const rating = Number(value ?? 5);
  return Number.isFinite(rating) ? Math.min(5, Math.max(1, Math.round(rating))) : 5;
}

function plainText(value: unknown): string {
  return typeof value === 'string' ? value.replace(/<[^>]+>/g, '').trim() : '';
}

/**
 * Map a live `TestimonialResponse` to card-ready `TestimonialItem`s.
 * The API sends no avatar/treatment — avatar falls back to `''`
 * (card renders initials) and treatment to `''` (card alt adapts).
 * Keeps only rows with a non-empty client name; the description
 * renders as-is (HTML-stripped).
 * Returns `[]` when unseeded so callers hide the section (same rule as FAQ).
 */
export function toTestimonialItems(response: { data: Testimonial[] }): TestimonialItem[] {
  if (!response.data.length) return [];
  return response.data
    .map((item, index) => {
      const stamp = formatReviewDate(item.testimonial_created_date);
      return {
        id: String(item.id ?? `live-t-${index}`),
        name: String(item.testimonial_client_name ?? item.name ?? '').trim(),
        location: String(item.location ?? ''),
        avatar: typeof item.image === 'string' ? item.image : '',
        rating: clampRating(item.testimonial_rating ?? item.rating),
        treatment: '',
        quote: plainText(item.testimonial_description ?? item.quote),
        footer: stamp ? `Verified Client · ${stamp}` : 'Verified Client',
      };
    })
    .filter((row) => row.name);
}

/** Marquee-ready review row. */
export interface ReviewRow {
  key: string;
  name: string;
  detail: string;
  rating: number;
  footer: string;
}

const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

/** `YYYY-MM-DD` → `DD MON YYYY` (string split, no timezone tricks). */
export function formatReviewDate(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw.trim());
  if (!match) return null;
  const month = MONTHS[Number(match[2]) - 1];
  if (!month) return null;
  return `${match[3]} ${month} ${match[1]}`;
}

/**
 * Map rows to marquee format. Keeps rows with a non-empty client name;
 * the description renders as-is (HTML-stripped). Anything
 * nameless is dropped.
 */
export function toReviewRows(response: { data: Testimonial[] }): ReviewRow[] {
  if (!response.data.length) return [];
  return response.data
    .map((item, index) => {
      const name = String(item.testimonial_client_name ?? item.name ?? '').trim();
      const detail = plainText(item.testimonial_description ?? item.quote);
      const stamp = formatReviewDate(item.testimonial_created_date);
      return {
        key: String(item.id ?? `live-r-${index}`),
        name,
        detail,
        rating: clampRating(item.testimonial_rating ?? item.rating),
        footer: stamp ? `Verified Client · ${stamp}` : 'Verified Client',
      };
    })
    .filter((row) => row.name);
}
