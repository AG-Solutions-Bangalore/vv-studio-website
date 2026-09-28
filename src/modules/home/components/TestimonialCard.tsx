import React from 'react';
import { BadgeCheck, Quote, Star } from 'lucide-react';
import type { TestimonialItem } from '@/data/salonData';

interface TestimonialCardProps {
  testimonial: TestimonialItem;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  // Live API items carry no avatar — render gold initials on dark navy.
  const initials = testimonial.name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const treatmentAlt = testimonial.treatment
    ? `VV Studio client after ${testimonial.treatment}`
    : 'VV Studio client testimonial photo';
  const who = testimonial.location
    ? `${testimonial.name}, ${testimonial.location}`
    : testimonial.name;
  return (
    <div className="flex flex-col h-full bg-white rounded-[14px] border border-[#F1E4EE] shadow-[0_2px_14px_rgba(90,20,80,0.08)] hover:shadow-[0_10px_28px_rgba(90,20,80,0.14)] hover:-translate-y-1 transition-all duration-300 p-4 sm:p-6 min-h-[160px] sm:min-h-[180px]">
      {/* Stars + quote mark */}
      <div className="flex items-center justify-between mb-3">
        <div
          className="flex items-center gap-0.5"
          aria-label={`${testimonial.rating} out of 5 stars`}
        >
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
          ))}
        </div>
        {testimonial.quote ? (
          <Quote
            aria-hidden="true"
            className="w-6 h-6 shrink-0 text-[#E5D3A7] fill-[#E5D3A7]"
          />
        ) : null}
      </div>

      {/* Quote text — hidden when empty */}
      {testimonial.quote ? (
        <p className="text-sm text-[#334155] leading-relaxed line-clamp-4 mb-4">
          {testimonial.quote}
        </p>
      ) : null}

      {/* Client + verified trust line */}
      <div className="mt-auto pt-4 border-t border-[#F5EAF2] flex items-center gap-3">
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt={treatmentAlt}
            title="VV Studio client testimonial photo"
            width={80}
            height={80}
            className="w-10 h-10 rounded-full object-cover"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        ) : (
          <span
            aria-hidden="true"
            className="w-10 h-10 rounded-full bg-[#0F2A43] text-[#E8C87A] text-xs font-bold flex items-center justify-center shrink-0 ring-1 ring-[#E8C87A]/60"
          >
            {initials}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#0F2A43] leading-tight flex items-center gap-1.5">
            <span className="truncate">{who}</span>
            <BadgeCheck
              className="w-4 h-4 shrink-0 fill-[#22C55E] text-white"
              role="img"
              aria-label="Verified client"
            />
          </p>
          <p className="text-[11px] text-[#9AA3AF] mt-0.5 truncate">
            {testimonial.footer ?? 'Verified Client'}
          </p>
        </div>
      </div>
    </div>
  );
};
