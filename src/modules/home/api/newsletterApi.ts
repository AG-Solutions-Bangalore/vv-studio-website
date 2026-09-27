import { apiClient, ApiError } from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/api/endpoints';
import {
  envelopeMessage,
  isSuccessEnvelope,
  type NewsletterPayload,
  type NewsletterResponse,
} from '@/lib/api/types';

export type { NewsletterPayload, NewsletterResponse };

/**
 * POST /createNewsletter (form-data: `newsletter_email`).
 * Used by the footer newsletter signup.
 */
export async function subscribeNewsletter(
  payload: NewsletterPayload,
): Promise<NewsletterResponse> {
  const form = new FormData();
  form.append('newsletter_email', payload.newsletter_email);
  const { data } = await apiClient.post<NewsletterResponse>(
    ENDPOINTS.newsletter,
    form,
  );
  if (!isSuccessEnvelope(data)) {
    throw new ApiError(
      envelopeMessage(data, 'Failed to subscribe. Please try again.'),
      undefined,
      typeof data?.code === 'number' || typeof data?.code === 'string'
        ? data.code
        : undefined,
    );
  }
  return data;
}
