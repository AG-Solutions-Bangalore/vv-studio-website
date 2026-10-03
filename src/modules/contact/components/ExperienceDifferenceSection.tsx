import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Play, X, Flower2, Gem, Users, Heart } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useCompanyInfo } from '@/modules/about/hook/useCompanyInfo';

interface ExperienceDifferenceSectionProps {
  onOpenBooking: () => void;
}

export const ExperienceDifferenceSection: React.FC<ExperienceDifferenceSectionProps> = (
  props,
) => (
  // Own provider over the shared singleton client (see main.tsx): the query
  // runtime loads with the contact route chunk, never with the critical path.
  <QueryClientProvider client={queryClient}>
    <ExperienceDifferenceSectionInner {...props} />
  </QueryClientProvider>
);

const ExperienceDifferenceSectionInner: React.FC<ExperienceDifferenceSectionProps> = ({
  onOpenBooking,
}) => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  // Live studio address (GET /getCompany) with static fallback.
  const company = useCompanyInfo();

  const features = [
    {
      id: 'ambience',
      label: 'Relaxing Ambience',
      icon: <Flower2 className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-[#D91A8A] stroke-[1.5]" />,
    },
    {
      id: 'hygiene',
      label: 'Hygienic & Safe Environment',
      icon: <Gem className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-[#D91A8A] stroke-[1.5]" />,
    },
    {
      id: 'professionals',
      label: 'Trained Professionals',
      icon: <Users className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-[#D91A8A] stroke-[1.5]" />,
    },
    {
      id: 'care',
      label: 'Personalized Care',
      icon: <Heart className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-[#D91A8A] stroke-[1.5]" />,
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Column: Salon Interior with Virtual Tour Play Trigger */}
          <div className="min-w-0">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(80,0,70,0.14)] group">
              <img
                src="https://vvstudio.in/crmapi/public/assets/images/web_images/contact/salon_virtual_tour.webp"
                alt="VV Studio luxury salon interior and reception"
                title="VV Studio Luxury Salon Interior and Reception"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Scrim for Contrast */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Centered Virtual Tour Trigger - exact as design */}
              <button
                type="button"
                onClick={() => setIsTourOpen(true)}
                className="absolute bottom-5 right-[-70%] sm:bottom-6 inset-x-0 mx-auto flex flex-col items-center justify-end gap-1.5 cursor-pointer group/btn w-fit pb-1"
                aria-label="Take a Virtual Tour of VV Studio"
              >
                <span className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#D91A8A] flex items-center justify-center text-white shadow-[0_4px_18px_rgba(232,50,157,0.65)] ring-2 ring-white/30 group-hover/btn:scale-110 group-hover/btn:bg-[#D91A8A] transition-all">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
                  <span className="absolute inset-0 rounded-full bg-[#D91A8A] animate-ping opacity-30 pointer-events-none" />
                </span>
                <span className="text-white text-[11px] sm:text-xs font-medium tracking-wide drop-shadow-md leading-none">
                  Take a Virtual Tour
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Experience Details & Highlights */}
          <div className="flex flex-col justify-center min-w-0 py-2 lg:py-6">
            <p className="text-xs sm:text-sm font-bold tracking-[0.22em] uppercase text-[#D91A8A] mb-2 sm:mb-3">
              VISIT OUR STUDIO
            </p>

            <h2 className="font-display italic text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] text-[#2D0A2E] font-semibold tracking-tight leading-[1.08] mb-3 sm:mb-4">
              Experience the Difference
            </h2>

            <p className="text-[#6D5D6A] text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 lg:mb-10 max-w-xl">
              A modern, comfortable and welcoming space designed to make you feel relaxed,
              confident and beautiful.
            </p>

            {/* 4 Feature Points - plain icon + label, no cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-10">
              {features.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex items-center justify-center mb-2.5 sm:mb-3">
                    {item.icon}
                  </div>
                  <p className="text-xs sm:text-sm lg:text-[15px] font-medium text-[#3D1E3A] leading-snug max-w-[150px]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Book Appointment CTA - pill button as per design */}
            <div className="flex sm:justify-start">
              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 rounded-full bg-[#C2147F] hover:bg-[#A80086] text-white  text-sm sm:text-base font-semibold px-6 sm:px-7 py-2.5 sm:py-3 transition-all cursor-pointer"
              >
                Book Appointment
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </Container>

      {/* Virtual Tour Modal */}
      {isTourOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-4xl bg-[#2B002B] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10">
              <div className="flex items-center gap-2 min-w-0">
                <Play className="w-4 h-4 text-[#F8C1DE] shrink-0" />
                <h3 className="text-white font-medium text-xs sm:text-sm truncate">
                  V V Studio — Virtual Walkthrough & Ambience
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTourOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <img
                src="https://vvstudio.in/crmapi/public/assets/images/web_images/contact/salon_virtual_tour.webp"
                alt="VV Studio salon interior virtual tour view"
                title="VV Studio Luxury Salon Interior and Reception"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-[#D91A8A]/90 flex items-center justify-center text-white mb-3 shadow-lg">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
                <h4 className="font-display italic text-2xl sm:text-3xl text-white font-semibold mb-2">
                  Welcome to V V Studio
                </h4>
                <p className="text-white/80 text-xs sm:text-sm max-w-md mb-4">
                  {company.addressShort}
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsTourOpen(false);
                    onOpenBooking();
                  }}
                  className="bg-[#D91A8A] hover:bg-[#A80086]"
                >
                  Schedule Your Visit Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
