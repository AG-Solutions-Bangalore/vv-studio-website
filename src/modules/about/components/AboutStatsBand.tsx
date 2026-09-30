import React from 'react';
import { Container } from '@/components/ui/Container';

export const AboutStatsBand: React.FC = () => {
  const stats = [
    { value: '10+', label: 'Years of Expertise' },
    { value: 'Thousands', label: 'Happy Clients' },
    { value: 'Wide Range', label: 'of Beauty Services' },
    { value: 'A Trusted', label: 'Name in JP Nagar' },
  ];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(100deg, #3D0A33 0%, #6A0A54 35%, #A3127B 65%, #D91A8A 100%)`,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left image — reused facial asset, flush to band edge */}
        <div className="lg:col-span-3 relative h-44 sm:h-56 lg:h-auto lg:min-h-[190px] overflow-hidden">
          <img
            src="https://vvstudio.in/crmapi/public/assets/images/web_images/gallery/gallery_dewy_skin_facial.webp"
            alt="Relaxing facial treatment at VV Studio"
            title="Relaxing Facial Treatment at VV Studio"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Blend into gradient on desktop */}
          <div
            className="hidden lg:block absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background: `linear-gradient(90deg, transparent 55%, rgba(106,10,84,0.55) 100%)`,
            }}
          />
        </div>

        {/* Stats */}
        <div className="lg:col-span-9 flex items-center">
          <Container className="w-full py-8 sm:py-10 lg:py-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-7 lg:gap-y-0">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center text-center px-3 sm:px-6 ${
                    i > 0 ? 'lg:border-l lg:border-white/25' : ''
                  } ${i % 2 === 1 ? 'max-lg:border-l max-lg:border-white/25' : ''}`}
                >
                  <p className="font-display italic text-[22px] sm:text-[28px] lg:text-[30px] text-white font-semibold leading-tight">
                    {stat.value}
                  </p>
                  <p className="text-[11.5px] sm:text-[13px] text-white/85 font-light mt-0.5 leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
};
