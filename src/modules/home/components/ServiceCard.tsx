import React from 'react';
import type { ServiceItem } from '@/data/salonData';

interface ServiceCardProps {
  service: ServiceItem;
  onSelect: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  // Per-page image SEO from the on-page audit (ALT descriptive, title branded).
  const seoById: Record<string, { alt: string; title: string }> = {
    'skin-facials': {
      alt: 'Skin and facial treatments at VV Studio',
      title: 'VV Studio Skin and Facial Treatments',
    },
    'hair-care': {
      alt: 'Professional hair care services at VV Studio',
      title: 'VV Studio Professional Hair Care',
    },
    'waxing-threading': {
      alt: 'Waxing and threading services at VV Studio',
      title: 'VV Studio Waxing and Threading Services',
    },
    'makeup-bridal': {
      alt: 'Bridal makeup and beauty services at VV Studio',
      title: 'VV Studio Bridal Makeup Services',
    },
    'hand-feet-care': {
      alt: 'Hand and feet care services at VV Studio',
      title: 'VV Studio Hand and Feet Care',
    },
    'hair-treatments': {
      alt: 'Hair treatments at VV Studio salon',
      title: 'VV Studio Hair Treatment Services',
    },
    'party-makeup': {
      alt: 'Professional party makeup at VV Studio',
      title: 'VV Studio Party Makeup',
    },
  };
  const seo = seoById[service.id] ?? {
    alt: `${service.title} at VV Studio`,
    title: `VV Studio ${service.title}`,
  };
  // Intrinsic dims for local assets (1200x896); remote Unsplash URLs omit
  // dims (unknown aspect) — the aspect-square wrapper reserves space instead.
  const dimsById: Record<string, { width: number; height: number }> = {
    'skin-facials': { width: 1200, height: 896 },
    'hair-care': { width: 1200, height: 896 },
    'waxing-threading': { width: 1200, height: 896 },
    'makeup-bridal': { width: 1200, height: 896 },
    'hand-feet-care': { width: 1200, height: 896 },
    'hair-treatments': { width: 1200, height: 896 },
  };
  const dims = dimsById[service.id];
  return (
    <article
      onClick={() => onSelect(service)}
      className="group cursor-pointer bg-white rounded-[12px] overflow-hidden border border-[#F1E4EE] shadow-[0_2px_14px_rgba(90,20,80,0.08)] hover:shadow-[0_10px_28px_rgba(90,20,80,0.14)] hover:-translate-y-1 transition-all duration-300 text-center flex flex-col h-full"
    >
      {/* Image — square-ish top, rounded via card overflow */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF0F6]">
        <img
          src={service.image}
          alt={seo.alt}
          title={seo.title}
          width={dims?.width}
          height={dims?.height}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      </div>

      {/* White label block — matches reference */}
      <div className="px-2 py-3 sm:py-3.5 bg-white flex-1 flex flex-col items-center justify-start">
        <h3 className="text-[13px] sm:text-sm font-bold text-[#2E1348] leading-snug">
          {service.title}
        </h3>
        <p className="mt-1 text-[11px] sm:text-xs text-[#7B7280] leading-snug">
          {service.tagline}
        </p>
      </div>
    </article>
  );
};
