import React from 'react';
import { Container } from '@/components/ui/Container';
import { ALL_SERVICES } from '@/data/servicesData';
import { ServicesCard } from './ServicesCard';

interface ServicesGridProps {
  onOpenBooking: (serviceName?: string) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onOpenBooking }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#FCFCFC]">
      <Container>
        {/* Section Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 pb-8 sm:pb-12 border-b border-[#F2E6EE]/80">
          {/* Left: Eyebrow + Heading + Accent Bar */}
          <div className="max-w-xl">
            <p className="text-[12px] sm:text-[13px] font-bold tracking-[0.24em] uppercase text-[#B3127A] mb-2">
              OUR SERVICES
            </p>
            <h2 className="font-display italic text-[30px] sm:text-4xl lg:text-[46px] text-[#2C182A] font-normal leading-[1.18] tracking-tight">
              Beauty Services for Every You
            </h2>
            <div
              className="w-14 h-1 bg-[#D91A8A] rounded-full mt-3.5"
              aria-hidden="true"
            />
          </div>

          {/* Right: Description text */}
          <div className="max-w-lg lg:text-left lg:pb-1">
            <p className="text-[14px] sm:text-[15px] text-[#766A73] leading-relaxed">
              From everyday essentials to special occasion makeovers, we offer a
              complete range of salon and beauty treatments designed to help you
              look and feel your best.
            </p>
          </div>
        </div>

        {/* 12 Services Cards Grid (4 columns on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 pt-10 sm:pt-12">
          {ALL_SERVICES.map((service) => (
            <ServicesCard
              key={service.id}
              service={service}
              onOpenBooking={onOpenBooking}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};
