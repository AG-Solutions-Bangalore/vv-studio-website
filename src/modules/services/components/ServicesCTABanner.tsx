import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';

interface ServicesCTABannerProps {
  onOpenBooking: () => void;
}

export const ServicesCTABanner: React.FC<ServicesCTABannerProps> = ({
  onOpenBooking,
}) => {
  return (
    <section className="relative z-10 pb-12 sm:pb-16 lg:pb-20 bg-[#FCFCFC]">
      <Container>
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-9 lg:p-11 shadow-[0_16px_40px_rgba(61,0,61,0.22)]"
          style={{
            background: `radial-gradient(circle at 85% 40%, rgba(217, 26, 138, 0.45) 0%, transparent 60%),
                         radial-gradient(circle at 20% 60%, rgba(133, 0, 111, 0.4) 0%, transparent 55%),
                         linear-gradient(118deg, #2D002B 0%, #460041 35%, #620055 70%, #350035 100%)`,
          }}
        >
          {/* Subtle floral watermark in corner */}
          <div
            className="absolute -bottom-10 -right-10 w-72 h-72 pointer-events-none opacity-20 bg-contain bg-no-repeat bg-right-bottom"
            style={{ backgroundImage: `url('https://vvstudio.in/crmapi/public/assets/images/web_images/common/footer_flower_bg.webp')` }}
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-8">
            {/* Left: Calendar Icon + Copy */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 sm:gap-5 text-center sm:text-left">
              {/* Calendar Icon Badge */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 backdrop-blur-sm shadow-inner">
                <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[1.5]" />
              </div>

              {/* Text content */}
              <div>
                <h3 className="text-[20px] sm:text-[24px] lg:text-[28px] font-semibold text-white tracking-tight leading-snug">
                  Ready to Experience the Best in Beauty?
                </h3>
                <p className="text-[13px] sm:text-[14.5px] text-white/85 font-light mt-1 sm:mt-1.5">
                  Book your appointment today and let us take care of you.
                </p>
              </div>
            </div>

            {/* Right: Hot Pink Pill Button */}
            <div className="shrink-0 w-full sm:w-auto flex justify-center">
              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D91A8A] hover:bg-[#A80086] text-white font-semibold text-[14px] sm:text-[15px] px-7 sm:px-8 py-3.5 rounded-full shadow-[0_8px_24px_rgba(232,50,157,0.45)] hover:shadow-[0_12px_28px_rgba(232,50,157,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
