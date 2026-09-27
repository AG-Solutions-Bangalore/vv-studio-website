import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import {
  subscribeNewsletter,
  type NewsletterPayload,
  type NewsletterResponse,
} from '../api/newsletterApi';

export const newsletterKeys = {
  all: ['newsletter'] as const,
};

/**
 * React Query mutation for the footer newsletter signup.
 *
 * Usage:
 *   const { mutateAsync, isPending } = useSubscribeNewsletter();
 *   await mutateAsync({ newsletter_email: 'user@example.com' });
 */
export function useSubscribeNewsletter(): UseMutationResult<
  NewsletterResponse,
  Error,
  NewsletterPayload
> {
  return useMutation<NewsletterResponse, Error, NewsletterPayload>({
    mutationKey: newsletterKeys.all,
    mutationFn: subscribeNewsletter,
  });
}
