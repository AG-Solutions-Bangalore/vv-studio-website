import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';

interface AboutStoryProps {
  onOpenBooking: () => void;
}

export const AboutStory: React.FC<AboutStoryProps> = ({ onOpenBooking }) => {
  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-white overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column: Copy */}
          <div className="flex flex-col justify-center min-w-0">
            {/* Eyebrow */}
            <p className="text-[11px] sm:text-[13px] font-bold tracking-[0.2em] uppercase text-[#E8329D] mb-1.5">
              At VV Studio
            </p>

            {/* Heading */}
            <h2 className="font-display italic text-[28px] sm:text-[36px] lg:text-[42px] font-semibold text-[#2D0A2E] leading-[1.15] tracking-tight mb-2">
              More Than Just a Salon
            </h2>

            {/* Pink underline accent */}
            <div className="w-10 h-[3px] rounded-full bg-[#E8329D] mb-4 sm:mb-5" aria-hidden="true" />

            {/* Body copy */}
            <div className="space-y-3.5 text-[13px] sm:text-[15px] text-[#5E525C] leading-relaxed mb-6 sm:mb-7 max-w-xl">
              <p>
                At VV Studio, we believe beauty is more than just appearance — it&apos;s
                about self-care, confidence and feeling your best. Our expert team offers
                a wide range of salon and beauty treatments using high-quality products
                and personalized care.
              </p>
              <p>
                Step into a space designed to relax, rejuvenate and bring out the best
                version of you. Whether it&apos;s a quick grooming session or a complete
                makeover, we are here to make every experience special.
              </p>
            </div>

            {/* CTA */}
            <div>
              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2 bg-[#E8329D] hover:bg-[#D91A8A] text-white font-semibold text-[13px] sm:text-[14px] px-6 sm:px-7 py-3 sm:py-3.5 rounded-full shadow-[0_8px_24px_rgba(232,50,157,0.45)] hover:shadow-[0_12px_28px_rgba(232,50,157,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          </div>

          {/* Right Column: 3-image collage — reused studio assets */}
          <div className="grid grid-cols-5 gap-2.5 sm:gap-3 min-w-0">
            {/* Large salon interior */}
            <div className="col-span-3 relative rounded-[14px] overflow-hidden group min-h-[280px] sm:min-h-[360px] lg:min-h-[440px]">
              <img
                src="https://agsdemo.in/vvsapi/public/assets/images/web_images/home/about_salon_reception.webp"
                alt="VV Studio salon reception and lounge"
                title="VV Studio Salon Reception and Lounge"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Two stacked images */}
            <div className="col-span-2 flex flex-col gap-2.5 sm:gap-3">
              <div className="relative rounded-[14px] overflow-hidden group flex-1 min-h-[136px] sm:min-h-[174px] lg:min-h-[214px]">
                <img
                  src="https://agsdemo.in/vvsapi/public/assets/images/web_images/home/about_facial_treatment.webp"
                  alt="Facial treatment at VV Studio"
                  title="Facial Treatment at VV Studio"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="relative rounded-[14px] overflow-hidden group flex-1 min-h-[136px] sm:min-h-[174px] lg:min-h-[214px]">
                <img
                  src="https://agsdemo.in/vvsapi/public/assets/images/web_images/home/about_hair_styling.webp"
                  alt="Hair styling at VV Studio"
                  title="Hair Styling at VV Studio"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
