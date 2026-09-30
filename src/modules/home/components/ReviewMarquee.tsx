import React, { useLayoutEffect, useRef } from 'react';
import { BadgeCheck, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReviewRow } from '../api/testimonialApi';

export interface ReviewMarqueeProps {
  items: ReviewRow[];
  /** 'dark' keeps plum-tinted surfaces; 'light' adapts fades for light sections. */
  tone?: 'dark' | 'light';
  /** Hide the built-in header so the parent can render its own eyebrow/title. */
  hideHeader?: boolean;
  eyebrow?: string;
  title?: string;
}

/** Minimum cards per strip so the loop stays seamless with few backend rows. */
const MIN_STRIP = 8;

function fillStrip(items: ReviewRow[]): ReviewRow[] {
  if (items.length === 0) return [];
  if (items.length >= MIN_STRIP) return items;
  const filled: ReviewRow[] = [];
  let i = 0;
  while (filled.length < MIN_STRIP) {
    const item = items[i % items.length];
    filled.push({ ...item, key: `${item.key}-loop-${Math.floor(i / items.length)}` });
    i += 1;
  }
  return filled;
}

function ReviewCard({ row, tone }: { row: ReviewRow; tone: 'dark' | 'light' }) {
  const light = tone === 'light';
  return (
    <figure
      className={cn(
        'w-[300px] sm:w-[340px] shrink-0 rounded-2xl border p-5 sm:p-6 flex flex-col gap-3 text-left',
        light
          ? 'bg-white border-[#F1E4EE] shadow-[0_2px_14px_rgba(90,20,80,0.08)]'
          : 'bg-white/[0.06] border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.25)]',
      )}
    >
      <div role="img" className="flex items-center gap-0.5" aria-label={`${row.rating} out of 5 stars`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            className={cn(
              'w-3.5 h-3.5',
              i < row.rating ? 'fill-[#F5A623] text-[#F5A623]' : 'fill-transparent text-[#C9B8C6]',
            )}
          />
        ))}
      </div>
      {row.detail ? (
        <blockquote
          className={cn(
            'text-[13px] sm:text-sm leading-relaxed line-clamp-4',
            light ? 'text-[#4A3A48]' : 'text-white/85',
          )}
        >
          {row.detail}
        </blockquote>
      ) : null}
      <figcaption className={cn('mt-auto pt-3 flex items-center justify-between gap-2 border-t', light ? 'border-[#F1E4EE]' : 'border-white/15')}>
        <span className={cn('text-[13px] font-bold truncate', light ? 'text-[#2D0A2E]' : 'text-white')}>
          {row.name}
        </span>
        <span className={cn('text-[10px] font-semibold tracking-wider uppercase shrink-0 inline-flex items-center gap-1', light ? 'text-[#A80086]' : 'text-[#F8C1DE]')}>
          <BadgeCheck className="w-3.5 h-3.5 shrink-0 fill-[#22C55E] text-white" aria-hidden="true" />
          {row.footer}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Infinite-loop review marquee: two identical animated strips, duration
 * measured from track width (≈ width / 140px per second), pauses on
 * hover/focus, edge fades. Renders nothing when `items` is empty.
 */
export const ReviewMarquee: React.FC<ReviewMarqueeProps> = ({
  items,
  tone = 'dark',
  hideHeader = false,
  eyebrow = 'CLIENT STORIES',
  title = 'What Our Customers Say',
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const strip = fillStrip(items);

  // Width-measured duration, written straight to the DOM (no state).
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || strip.length === 0) return;
    const setDuration = () => {
      const half = track.scrollWidth / 2;
      if (half > 0) {
        track.style.setProperty('--marquee-duration', `${Math.max(12, half / 140)}s`);
      }
    };
    setDuration();
    const ro = new ResizeObserver(setDuration);
    ro.observe(track);
    window.addEventListener('resize', setDuration);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', setDuration);
    };
  }, [strip.length]);

  if (strip.length === 0) return null;
  const light = tone === 'light';

  return (
    <div aria-roledescription="marquee" aria-label={title}>
      {!hideHeader && (
        <div className="text-center mb-6 sm:mb-8 px-4">
          <p
            className={cn(
              'text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase mb-2',
              light ? 'text-[#D91A8A]' : 'text-[#F8C1DE]',
            )}
          >
            {eyebrow}
          </p>
          <h2
            className={cn(
              'font-display italic text-[26px] sm:text-4xl font-semibold tracking-tight',
              light ? 'text-[#2D0A2E]' : 'text-white',
            )}
          >
            {title}
          </h2>
        </div>
      )}
      <div className="marquee-paused relative overflow-hidden">
        {/* edge fades */}
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 z-10 bg-gradient-to-r',
            light ? 'from-[#FCFCFC] to-transparent' : 'from-[#2B002B] to-transparent',
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 z-10 bg-gradient-to-l',
            light ? 'from-[#FCFCFC] to-transparent' : 'from-[#2B002B] to-transparent',
          )}
        />
        <div ref={trackRef} className="marquee-track flex w-max gap-4 sm:gap-5 px-4">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex gap-4 sm:gap-5 shrink-0">
              {strip.map((row) => (
                <ReviewCard key={`${row.key}-c${copy}`} row={row} tone={tone} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
