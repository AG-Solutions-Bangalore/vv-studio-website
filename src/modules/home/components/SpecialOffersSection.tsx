import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';

interface SpecialOffersProps {
  onOpenBooking: () => void;
}

export const SpecialOffersSection: React.FC<SpecialOffersProps> = ({ onOpenBooking }) => {
  const offerTags = [
    'Bridal Packages',
    'Facial Combos',
    'Hair Makeover',
    'Seasonal Offers',
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#9B0B68] via-[#68004C] to-[#2E002B] text-white  flex items-center">
      {/* Subtle ambient decorative lighting & floral watermarks */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(circle at 15% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 45%),
                            radial-gradient(circle at 80% 50%, rgba(217, 26, 138, 0.35) 0%, transparent 55%)`,
        }}
      />

      {/* Panoramic Model Asset */}
      <div
        className="hidden md:block absolute right-60 bottom-0 h-full w-[65%] lg:w-[58%] xl:w-[54%] pointer-events-none select-none z-10"
        aria-hidden="true"
      >
        <img
          src="https://vvstudio.in/crmapi/public/assets/images/web_images/common/girl_common.webp"
          alt="VV Studio special salon offers"
          title="VV Studio Special Offers"
          width={2170}
          height={725}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          draggable={false}
          className="h-full w-full object-contain object-right-bottom"
        />
      </div>

      <Container className="relative z-20 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Editorial Content */}
          <div className="w-full lg:max-w-[540px] xl:max-w-[580px] text-left pt-6 pb-4 sm:pb-5 lg:py-12">
            <p className="text-xs sm:text-[13px] font-semibold tracking-[0.28em] uppercase text-[#F8C1DE] mb-2 sm:mb-3">
              SPECIAL OFFERS
            </p>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-display font-medium text-white tracking-tight leading-[1.12] mb-3 sm:mb-4">
              Beauty Packages for Every You
            </h2>

            {/* Tags Ribbon */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/90 font-light mb-5 sm:mb-8">
              {offerTags.map((tag, index) => (
                <React.Fragment key={tag}>
                  <span className="hover:text-white transition-colors">
                    {tag}
                  </span>
                  {index < offerTags.length - 1 && (
                    <span className="text-white/40 font-normal">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Discover Offers Button */}
            <div>
              <button
                type="button"
                onClick={onOpenBooking}
                className="group inline-flex items-center gap-2.5 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#D91A8A] hover:bg-[#A80086] text-white text-xs sm:text-sm font-medium tracking-wide shadow-[0_10px_25px_-5px_rgba(232,50,157,0.5)] hover:shadow-[0_14px_30px_-5px_rgba(232,50,157,0.7)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                <span>Discover Offers</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Script Text: "Because You Deserve More" (aligned to the far right on large screens) */}
          <div
            className="hidden lg:block absolute right-4 xl:right-10 top-1/2 -translate-y-1/2 z-20 pointer-events-none select-none text-right"
            aria-hidden="true"
          >
            <p className="font-script text-3xl lg:text-4xl xl:text-[44px] text-white/90 leading-[1.1] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
              Because <br />
              <span className="text-[#F8C1DE]">You Deserve</span> <br />
              More
            </p>
          </div>
        </div>

        {/* Mobile-only model view — script left, model right, no empty void */}
        <div className="md:hidden relative w-full h-[170px] sm:h-[200px] overflow-hidden pointer-events-none select-none">
          <img
            src="https://vvstudio.in/crmapi/public/assets/images/web_images/common/girl_common.webp"
            alt="VV Studio special salon offers"
            title="VV Studio Special Offers"
            width={2170}
            height={725}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="absolute bottom-0 right-0 h-full w-auto max-w-none object-contain object-right-bottom"
          />
          <p className="absolute left-1 top-1/2 -translate-y-1/2 font-script text-[26px] sm:text-3xl text-white/90 leading-[1.15] drop-shadow-md">
            Because <br />
            <span className="text-[#F8C1DE]">You Deserve</span> <br />
            More
          </p>
        </div>
      </Container>
    </section>
  );
};
