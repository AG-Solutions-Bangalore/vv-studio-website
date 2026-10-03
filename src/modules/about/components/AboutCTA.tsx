import React from 'react';
import { ArrowRight, Flower2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';

interface AboutCTAProps {
  onOpenBooking: () => void;
}

export const AboutCTA: React.FC<AboutCTAProps> = ({ onOpenBooking }) => {
  return (
    <section className="relative bg-[#FDF7FB] py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Soft diamond decorations */}
      <div
        className="absolute left-[4%] top-1/2 -translate-y-1/2 w-[130px] sm:w-[220px] aspect-square rotate-45 bg-[#F9DDF0]/70 pointer-events-none rounded-2xl"
        aria-hidden="true"
      />
      <div
        className="absolute left-[11%] top-1/2 -translate-y-1/2 w-[90px] sm:w-[150px] aspect-square rotate-45 bg-[#F6CBE6]/60 pointer-events-none rounded-xl"
        aria-hidden="true"
      />
      <div
        className="absolute right-[4%] top-1/2 -translate-y-1/2 w-[130px] sm:w-[220px] aspect-square rotate-45 bg-[#F9DDF0]/70 pointer-events-none rounded-2xl"
        aria-hidden="true"
      />
      <div
        className="absolute right-[11%] top-1/2 -translate-y-1/2 w-[90px] sm:w-[150px] aspect-square rotate-45 bg-[#F6CBE6]/60 pointer-events-none rounded-xl"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FBD2E8] flex items-center justify-center mb-3 sm:mb-4"
            aria-hidden="true"
          >
            <Flower2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#D91A8A] stroke-[1.6]" />
          </div>
          <h2 className="font-display italic text-[26px] sm:text-[34px] lg:text-[40px] font-semibold text-[#2C0A4A] leading-[1.2] tracking-tight">
            Your Beauty Journey Starts Here
          </h2>
          <p className="text-[13px] sm:text-[15px] text-[#6E6470] leading-relaxed mt-2.5 sm:mt-3 mb-6 sm:mb-7 max-w-xl">
            Let us take care of you with expert treatments and a personalized experience.
          </p>
          <button
            type="button"
            onClick={onOpenBooking}
            className="inline-flex items-center justify-center gap-2 bg-[#D91A8A] hover:bg-[#A80086] text-white font-semibold text-[13px] sm:text-[14px] px-7 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-[0_8px_24px_rgba(232,50,157,0.45)] hover:shadow-[0_12px_28px_rgba(232,50,157,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            <span>Book Appointment</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </Container>
    </section>
  );
};
