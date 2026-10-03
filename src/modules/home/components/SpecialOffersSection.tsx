import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles, ArrowRight, Eye, Phone, ChevronLeft, ChevronRight, X, CheckCircle2 } from 'lucide-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Container } from '@/components/ui/Container';
import { Carousel, CarouselControls, type CarouselHandle, type CarouselState } from '@/components/ui/Carousel';
import { OFFERS_BASE_URL, OFFERS_DATA, type OfferItem } from '@/data/offersData';
import { SERVICES_DATA, type ServiceItem } from '@/data/salonData';
import { useOffers } from '@/modules/home/hooks/useOffers';
import { getLenisInstance } from '@/lib/lenis';

interface SpecialOffersProps {
  onOpenBooking: (service?: ServiceItem) => void;
}

type CategoryFilter = 'All' | 'Hair Care' | 'Skin & Waxing' | 'Nails & Lashes';

export const SpecialOffersSection: React.FC<SpecialOffersProps> = (props) => (
  <QueryClientProvider client={queryClient}>
    <SpecialOffersContent {...props} />
  </QueryClientProvider>
);

const SpecialOffersContent: React.FC<SpecialOffersProps> = ({ onOpenBooking }) => {
  const carouselRef = useRef<CarouselHandle>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [lightboxOfferIndex, setLightboxOfferIndex] = useState<number | null>(null);
  const [carouselState, setCarouselState] = useState<CarouselState>({
    canPrev: false,
    canNext: false,
    page: 0,
    pages: 1,
  });

  const { data: rawOffers } = useOffers();
  const allOffers = useMemo(() => {
    return rawOffers && rawOffers.length > 0 ? rawOffers : OFFERS_DATA;
  }, [rawOffers]);

  const categories: CategoryFilter[] = ['All', 'Hair Care', 'Skin & Waxing', 'Nails & Lashes'];

  const filteredOffers = useMemo(() => {
    if (activeCategory === 'All') return allOffers;
    return allOffers.filter((item) => item.category === activeCategory);
  }, [activeCategory, allOffers]);

  const handleBookOffer = (offer: OfferItem) => {
    const matchedService = SERVICES_DATA.find((s) => s.id === offer.serviceId);
    onOpenBooking(matchedService);
  };

  const handleOpenLightbox = (offer: OfferItem) => {
    const idx = allOffers.findIndex((o) => o.id === offer.id);
    setLightboxOfferIndex(idx >= 0 ? idx : 0);
  };

  return (
    <section
      id="offers"
      className="relative py-14 sm:py-20 bg-gradient-to-b from-[#2E002B] via-[#4D0041] to-[#250023] text-white overflow-hidden scroll-mt-20"
      aria-label="Festival and Seasonal Offers"
    >
      {/* Subtle ambient lighting without aggressive glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(circle at 12% 20%, rgba(217, 26, 138, 0.3) 0%, transparent 40%),
                            radial-gradient(circle at 88% 70%, rgba(248, 193, 222, 0.2) 0%, transparent 45%)`,
        }}
      />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#F8C1DE] mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F8C1DE]" />
              <span>FESTIVAL & SEASONAL OFFERS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium text-white tracking-tight leading-[1.15]">
              Exclusive Festive Packages
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/80 font-light leading-relaxed">
              Pamper yourself with 100% female salon experts in JP Nagar, Bengaluru. Enjoy flat 30% OFF across our most loved beauty rituals.
            </p>
          </div>

          {/* Carousel Navigation Buttons */}
          {carouselState.pages > 1 && (
            <div className="shrink-0 hidden sm:flex items-center gap-3">
              <CarouselControls
                onPrev={() => carouselRef.current?.scrollPrev()}
                onNext={() => carouselRef.current?.scrollNext()}
                canPrev={carouselState.canPrev}
                canNext={carouselState.canNext}
                className="[&_button]:border-white/20 [&_button]:bg-white/10 [&_button]:text-white [&_button:hover]:bg-white/20 [&_button:hover]:border-white/35 [&_button:disabled]:opacity-25"
              />
            </div>
          )}
        </div>

        {/* Category Filter Pills (No glow shadow on hover/active) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar" role="tablist" aria-label="Filter offers by category">
          {categories.map((cat) => {
            const count = cat === 'All' ? allOffers.length : allOffers.filter((o) => o.category === cat).length;
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#D91A8A] text-white border border-[#D91A8A]'
                    : 'bg-white/10 hover:bg-white/15 text-white/80 hover:text-white border border-white/10'
                }`}
              >
                <span>{cat}</span>
                <span className={`ml-1.5 text-[11px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/25 text-white' : 'bg-white/10 text-white/70'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Offers Carousel / Grid — Equal height across all cards, clean hover state without glow */}
        <Carousel
          ref={carouselRef}
          ariaLabel="Festival Offers Carousel"
          onStateChange={setCarouselState}
          trackClassName="items-stretch gap-4 sm:gap-5 pb-2"
          slideClassName="basis-[82%] sm:basis-[calc(50%-10px)] lg:basis-[calc(33.3333%-14px)] xl:basis-[calc(25%-15px)] self-stretch h-auto flex flex-col"
        >
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-white/[0.07] border border-white/15 backdrop-blur-md shadow-sm hover:border-white/30 hover:bg-white/[0.09] transition-all duration-200"
            >
              {/* Image Preview with Hover Zoom & Quick View */}
              <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-[#1f001d] select-none">
                <img
                  src={`${OFFERS_BASE_URL}${offer.image}`}
                  alt={offer.alt}
                  title={offer.title}
                  width={1080}
                  height={1080}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-103"
                />

                {/* Top Badge: 30% OFF */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D91A8A] text-white text-[11px] font-semibold tracking-wider uppercase shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    {offer.discount}
                  </span>
                </div>

                {/* Clickable Quick View Overlay */}
                <button
                  type="button"
                  onClick={() => handleOpenLightbox(offer)}
                  aria-label={`View ${offer.title} full offer poster`}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-[2px] cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#2C182A] text-xs font-semibold shadow transition-transform duration-200 group-hover:scale-105">
                    <Eye className="w-3.5 h-3.5 text-[#D91A8A]" />
                    <span>View Flyer</span>
                  </span>
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Uniform Title Height */}
                  <div className="h-12 flex items-center mb-1.5">
                    <h3 className="font-display text-lg sm:text-xl font-medium text-white group-hover:text-[#F8C1DE] transition-colors line-clamp-2 leading-tight">
                      {offer.title}
                    </h3>
                  </div>

                  {/* Price Block */}
                  <div className="h-7 flex items-baseline gap-2 mb-3">
                    <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {offer.price}
                    </span>
                    {offer.originalPrice && (
                      <span className="text-xs text-white/50 line-through">
                        {offer.originalPrice}
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-[#F8C1DE] ml-auto">
                      Limited Period
                    </span>
                  </div>

                  {/* Key Inclusion Bullets */}
                  <ul className="h-[76px] flex flex-col justify-start space-y-1.5 text-xs text-white/80 font-light mb-4">
                    {offer.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-[#F8C1DE] shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA Actions — clean transitions, no hover glow */}
                <div className="mt-auto pt-3 border-t border-white/10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleBookOffer(offer)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#D91A8A] hover:bg-[#B30D70] active:scale-[0.98] text-white text-xs font-semibold tracking-wide transition-colors duration-200 cursor-pointer shadow-sm"
                  >
                    <span>Book Offer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenLightbox(offer)}
                    aria-label="View poster flyer"
                    title="View flyer"
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white/80 hover:text-white transition-colors cursor-pointer border border-white/10"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        {/* Bottom Trust & Contact Strip */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs sm:text-sm text-white/80 font-light">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>100% Female Salon Experts · Exclusive JP Nagar, Bengaluru Sanctuary</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Direct Booking Assistance:</span>
            <a
              href="tel:8310782820"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/20 text-white font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#F8C1DE]" />
              <span>8310782820</span>
            </a>
          </div>
        </div>
      </Container>

      {/* High-Resolution Offer Flyer Lightbox */}
      {lightboxOfferIndex !== null && (
        <OfferLightboxModal
          items={allOffers}
          index={lightboxOfferIndex}
          onClose={() => setLightboxOfferIndex(null)}
          onNavigate={(idx) => setLightboxOfferIndex(idx)}
          onBookOffer={(offer) => {
            setLightboxOfferIndex(null);
            handleBookOffer(offer);
          }}
        />
      )}
    </section>
  );
};

interface OfferLightboxModalProps {
  items: OfferItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onBookOffer: (offer: OfferItem) => void;
}

const OfferLightboxModal: React.FC<OfferLightboxModalProps> = ({
  items,
  index,
  onClose,
  onNavigate,
  onBookOffer,
}) => {
  const total = items.length;
  const current = items[((index % total) + total) % total];

  const goPrev = useCallback(() => {
    onNavigate((index - 1 + total) % total);
  }, [index, total, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((index + 1) % total);
  }, [index, total, onNavigate]);

  // Keyboard navigation and Lenis scroll lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const lenis = getLenisInstance();
    lenis?.stop();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [onClose, goPrev, goNext]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Festival offer flyer: ${current.title}`}
      className="fixed inset-0 z-50 flex flex-col bg-[#1A0019]/95 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 shrink-0 text-white select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-medium tracking-wider text-white/70">
            {((index % total) + total) % total + 1} / {total}
          </span>
          <span className="text-white/30">|</span>
          <h4 className="text-xs sm:text-sm font-semibold tracking-wide text-white truncate max-w-[200px] sm:max-w-md">
            {current.title} — {current.price} ({current.discount})
          </h4>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close offer flyer preview"
          className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div
        className="flex-1 relative flex items-center justify-center p-3 sm:p-6 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Arrow Left */}
        {total > 1 && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous offer flyer"
            className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-[#D91A8A] text-white transition-colors backdrop-blur-sm cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Poster Flyer Container */}
        <div className="relative max-h-full max-w-full flex items-center justify-center">
          <img
            src={`${OFFERS_BASE_URL}${current.image}`}
            alt={current.alt}
            width={1080}
            height={1080}
            className="max-h-[70vh] sm:max-h-[75vh] w-auto max-w-[92vw] sm:max-w-[80vw] object-contain rounded-xl shadow-2xl border border-white/20 select-none animate-in zoom-in-95 duration-200"
          />
        </div>

        {/* Navigation Arrow Right */}
        {total > 1 && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Next offer flyer"
            className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-[#D91A8A] text-white transition-colors backdrop-blur-sm cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div
        className="px-4 sm:px-6 py-3.5 border-t border-white/10 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left bg-black/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xs sm:text-sm text-white/80">
          <span className="font-semibold text-white">{current.title}</span>: {current.features.join(' · ')}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:8310782820"
            className="px-3.5 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-[#F8C1DE]" />
            <span>Call Reception</span>
          </a>
          <button
            type="button"
            onClick={() => onBookOffer(current)}
            className="px-5 py-2 rounded-xl bg-[#D91A8A] hover:bg-[#B30D70] text-white text-xs font-semibold shadow transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Book This Offer ({current.price})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
