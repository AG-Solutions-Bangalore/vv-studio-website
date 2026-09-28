import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { LOCAL_IMAGE_BASE } from '@/seo/seo';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreServices: () => void;
}

// LCP hero: responsive variants (768/1280/1440 + original as 1920w).
// MUST stay identical to the preload imagesrcset in index.html.
const HERO_SRC = `${LOCAL_IMAGE_BASE}/home/home_top_banner.webp`;
const HERO_SRCSET = `${LOCAL_IMAGE_BASE}/home/home_top_banner-768.webp 768w, ${LOCAL_IMAGE_BASE}/home/home_top_banner-1280.webp 1280w, ${LOCAL_IMAGE_BASE}/home/home_top_banner-1440.webp 1440w, ${LOCAL_IMAGE_BASE}/home/home_top_banner.webp 1920w`;
const HERO_SIZES = '100vw';

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onExploreServices }) => {
  return (
    <section
      id="home"
      className="relative bg-[#3D003D] text-white overflow-hidden pt-[104px] lg:pt-[92px] pb-0 lg:h-[600px] xl:h-[610px] flex flex-col lg:block"
      style={{
        background: `radial-gradient(circle at 72% 42%, rgba(217, 26, 138, 0.45) 0%, rgba(104, 0, 95, 0.3) 35%, transparent 68%),
                     radial-gradient(circle at 18% 65%, rgba(133, 0, 111, 0.35) 0%, transparent 55%),
                     linear-gradient(118deg, #240024 0%, #350035 24%, #490043 52%, #620055 76%, #330030 100%)`,
      }}
    >
      {/* Background Diamond Geometry — parked behind the model, clear of the headline */}
      <div
        className="absolute left-[62%] lg:left-[84%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[480px] lg:w-[560px] aspect-square rotate-45 border border-white/[0.07] bg-gradient-to-br from-white/[0.05] via-[#D91A8A]/[0.07] to-transparent pointer-events-none rounded-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute left-[62%] lg:left-[74%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[350px] lg:w-[420px] aspect-square rotate-45 border border-[#F06AB9]/10 bg-white/[0.02] pointer-events-none rounded-2xl"
        aria-hidden="true"
      />
      {/* Soft full-bleed readability shade for the left copy — no hard stops, no seam */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `linear-gradient(90deg, rgba(20,0,20,0.38) 0%, rgba(20,0,20,0.12) 30%, transparent 48%)`,
        }}
      />

      {/* Desktop model — full hero height, flush to right + bottom edge.
          The webp carries native alpha on its left side, so it composites
          seamlessly over the plum backdrop — no overlay gradient (that caused
          the visible vertical seam). */}
      <div
        className="hidden lg:block absolute bottom-0 right-0 h-full w-[60%] xl:w-[56%] pointer-events-none select-none bg-[#3D003D]"
        aria-hidden="true"
      >
        <img
          src={HERO_SRC}
          srcSet={HERO_SRCSET}
          sizes={HERO_SIZES}
          width={1762}
          height={893}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          alt="VV Studio luxury beauty salon in JP Nagar Bangalore"
          title="VV Studio Luxury Salon in JP Nagar"
          draggable={false}
          className="absolute bottom-0 right-0 h-[85%] w-auto max-w-none object-contain object-right-bottom"
        />
      </div>

      {/* Main Content */}
      <Container className="relative w-full z-20 flex-1 flex flex-col justify-center lg:h-full lg:pb-10">
        <div className="w-full lg:max-w-[560px] pt-6 lg:pt-8 text-left">
          {/* Eyebrow */}
          <p className="text-xs sm:text-[13px] font-semibold tracking-[0.3em] uppercase text-[#F8C1DE] mb-3 sm:mb-4">
            BEAUTY &nbsp;•&nbsp; CARE &nbsp;•&nbsp; CONFIDENCE
          </p>

          {/* Headline */}
          <h1 className="text-white tracking-tight leading-[1.02] mb-5 sm:mb-6">
            <span className="block font-serif italic text-3xl sm:text-4xl lg:text-[44px] font-light text-white/95 tracking-wide">
              Adding care to your
            </span>
            <span className="block font-serif italic text-6xl sm:text-8xl lg:text-[104px] xl:text-[112px] text-white font-normal tracking-wide drop-shadow-sm -mt-1 sm:-mt-2">
              Beauty
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-white/90 font-light leading-relaxed mb-7 sm:mb-9 max-w-md">
            Expert care. Personalized treatments. <br className="hidden sm:inline" />
            A more confident you.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 mb-10">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 rounded-full bg-[#E8329D] hover:bg-[#D91A8A] text-white font-medium px-7 py-3 text-sm transition-all duration-300 shadow-[0_8px_25px_rgba(232,50,157,0.45)] hover:shadow-[0_12px_32px_rgba(232,50,157,0.6)] hover:-translate-y-0.5 cursor-pointer active:scale-95"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreServices}
              className="inline-flex items-center rounded-full border border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white font-medium px-6 py-3 text-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer active:scale-95"
            >
              View Our Services
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-4 sm:gap-8 pt-6 border-t border-white/15 max-w-lg">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="text-[#F8C1DE] shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9s-9 4.03-9 9a9 9 0 0 0 9 9Z" />
                  <path d="M7 12c2.5 0 4-1.5 5-4 1 2.5 2.5 4 5 4" />
                  <path d="M12 12v6" />
                </svg>
              </div>
              <div className="text-[11px] sm:text-xs leading-tight">
                <span className="font-light block text-white/70">Professional</span>
                <span className="font-medium block text-white">Experts</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="text-[#F8C1DE] shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3c-1.5 3-4 6.5-7 8.5 3 .5 6 0 7-1.5 1 1.5 4 2 7 1.5-3-2-5.5-5.5-7-8.5Z" />
                  <path d="M12 10c-2 2-4 5-5 7 2.5 0 4.5-.5 5-1.5.5 1 2.5 1.5 5 1.5-1-2-3-5-5-7Z" />
                  <path d="M12 15.5c-1 1.5-2 3-2.5 4.5 1.5 0 2.5-.5 2.5-1.5 0 1 1 1.5 2.5 1.5-.5-1.5-1.5-3-2.5-4.5Z" />
                </svg>
              </div>
              <div className="text-[11px] sm:text-xs leading-tight">
                <span className="font-light block text-white/70">Premium</span>
                <span className="font-medium block text-white">Products</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="text-[#F8C1DE] shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <div className="text-[11px] sm:text-xs leading-tight">
                <span className="font-light block text-white/70">Hygienic</span>
                <span className="font-medium block text-white">& Safe</span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile model — right-anchored so the face stays visible on narrow screens */}
      <div className="lg:hidden relative w-full h-[300px] sm:h-[360px] mt-8 overflow-hidden pointer-events-none select-none bg-[#3D003D]">
        <img
          src={HERO_SRC}
          srcSet={HERO_SRCSET}
          sizes={HERO_SIZES}
          width={1762}
          height={893}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          alt="VV Studio beauty model with pink lilies"
          title="VV Studio Beauty Model with Pink Lilies"
          className="absolute bottom-0 right-0 h-full w-auto max-w-none object-contain object-right-bottom"
        />
        <div
          className="absolute top-[8%] left-4 rotate-[-4deg] pointer-events-none select-none text-left"
          aria-hidden="true"
        >
          <p className="font-script text-2xl sm:text-3xl text-white/95 leading-[1.1] drop-shadow-[0_3px_12px_rgba(0,0,0,0.7)]">
            Look Good <br />
            <span className="text-[#F8C1DE]">Feel Good</span> <br />
            Be You
          </p>
        </div>
      </div>
    </section>
  );
};
