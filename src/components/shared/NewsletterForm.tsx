import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import { envelopeMessage } from '@/lib/api/types';
import { useSubscribeNewsletter } from '@/modules/home/hooks/useNewsletter';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Footer newsletter signup (POST /createNewsletter, form-data
 * `newsletter_email`). Mounts its own `QueryClientProvider` over the
 * shared singleton client, so import it lazily — same pattern as
 * `FaqSection`.
 */
export const NewsletterForm: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <NewsletterFormInner />
  </QueryClientProvider>
);

const NewsletterFormInner: React.FC = () => {
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const { mutateAsync, isPending } = useSubscribeNewsletter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setNotice({ kind: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    setNotice(null);
    try {
      const res = await mutateAsync({ newsletter_email: value });
      setNotice({
        kind: 'success',
        text: envelopeMessage(res, 'Subscribed! Welcome to the glow.'),
      });
      setEmail('');
    } catch (err) {
      setNotice({
        kind: 'error',
        text: err instanceof Error ? err.message : 'Failed to subscribe. Please try again.',
      });
    }
  };

  return (
    <form onSubmit={submit} aria-label="Newsletter signup" noValidate>
      <p className="text-[15px] font-bold text-[#2D0A2E] mb-1">Stay in the glow</p>
      <p className="text-xs text-[#5E525C] mb-3">
        Beauty tips &amp; offers, once in a while. No spam.
      </p>
      <div className="flex gap-2">
        <label htmlFor="footer-newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="footer-newsletter-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          placeholder="Your email address"
          className="min-w-0 flex-1 rounded-full bg-white border border-[#E8DCE5] focus:border-[#F06AB9] focus:outline-none px-4 py-2.5 text-sm text-[#2D0A2E] placeholder:text-[#B9A8B5] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isPending}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#E8329D] hover:bg-[#D91A8A] disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" aria-hidden="true" />
          {isPending ? 'Joining…' : 'Join'}
        </button>
      </div>
      {notice && (
        <p
          role="status"
          className={`mt-2 text-xs font-medium ${
            notice.kind === 'success' ? 'text-green-700' : 'text-[#C81E1E]'
          }`}
        >
          {notice.text}
        </p>
      )}
    </form>
  );
};
