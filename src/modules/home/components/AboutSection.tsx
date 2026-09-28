import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Gem, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export const AboutSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section id="about" className="py-10 sm:py-14 bg-[#FCFCFC] overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column: Copy */}
          <div className="flex flex-col justify-center">
            {/* Eyebrow */}
            <p className="text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase text-[#D91A8A] mb-1.5">
              ABOUT VV STUDIO
            </p>

            {/* Serif Heading — matches design */}
            <h2 className="font-display text-[28px] sm:text-[36px] lg:text-[40px] font-semibold text-[#2D0A2E] leading-[1.15] tracking-tight mb-3">
              More Than Just a<br />
              Salon, A Place for You
            </h2>

            {/* Body copy — matches design wording */}
            <div className="space-y-3 text-[13px] sm:text-sm text-[#5E525C] leading-relaxed mb-5 max-w-xl">
              <p>
                At VV Studio, we believe beauty is more than just appearance — it's about
                self-care, confidence and feeling your best.
              </p>
              <p>
                Our expert team offers a wide range of salon and beauty treatments using
                high-quality products and personalized care.
              </p>
              <p>
                Step into a space designed to relax, rejuvenate and bring out the best
                version of you.
              </p>
            </div>

            {/* Text link CTA — goes to the About page */}
            <div className="mb-7">
              <button
                onClick={() => navigate('/about')}
                className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#D91A8A] hover:text-[#A80086] transition-colors cursor-pointer"
              >
                <span>Know More About Us</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Trust stats row — matches design */}
            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-[#F1E2EC] max-w-xl">
              <div className="flex items-start gap-2">
                <Trophy className="w-5 h-5 text-[#D91A8A] shrink-0 mt-0.5" strokeWidth={1.8} />
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-bold text-[#2D0A2E] leading-tight">
                    10+
                  </p>
                  <p className="text-[11px] text-[#7A6A77] font-medium leading-tight">
                    Years of Expertise
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Users className="w-5 h-5 text-[#D91A8A] shrink-0 mt-0.5" strokeWidth={1.8} />
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-bold text-[#2D0A2E] leading-tight">
                    Thousands
                  </p>
                  <p className="text-[11px] text-[#7A6A77] font-medium leading-tight">
                    Happy Clients
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Gem className="w-5 h-5 text-[#D91A8A] shrink-0 mt-0.5" strokeWidth={1.8} />
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-bold text-[#2D0A2E] leading-tight">
                    Premium
                  </p>
                  <p className="text-[11px] text-[#7A6A77] font-medium leading-tight">
                    Beauty Experience
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3-image collage — matches design */}
          <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
            {/* Large salon interior */}
            <div className="col-span-3 relative rounded-[14px] overflow-hidden group min-h-[280px] sm:min-h-[360px] lg:min-h-[420px]">
              <img
                src="https://agsdemo.in/vvsapi/public/assets/images/web_images/home/about_salon_reception.webp"
                alt="Luxury salon lounge at VV Studio"
                title="VV Studio Luxury Salon Lounge"
                width={1536}
                height={1024}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Two stacked images */}
            <div className="col-span-2 flex flex-col gap-2.5 sm:gap-3">
              <div className="relative rounded-[14px] overflow-hidden group flex-1 min-h-[136px] sm:min-h-[174px] lg:min-h-[204px]">
                <img
                  src="https://agsdemo.in/vvsapi/public/assets/images/web_images/home/about_facial_treatment.webp"
                  alt="Facial treatment at VV Studio salon"
                  title="Facial Treatment at VV Studio"
                  width={1536}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="relative rounded-[14px] overflow-hidden group flex-1 min-h-[136px] sm:min-h-[174px] lg:min-h-[204px]">
                <img
                  src="https://agsdemo.in/vvsapi/public/assets/images/web_images/home/about_hair_styling.webp"
                  alt="Professional hair styling at VV Studio"
                  title="Professional Hair Styling at VV Studio"
                  width={1330}
                  height={1182}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
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
