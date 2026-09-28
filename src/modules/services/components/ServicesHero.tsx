import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';

export const ServicesHero: React.FC = () => {
  return (
    <section
      className="relative bg-[#3D003D] text-white overflow-hidden pt-[110px] lg:pt-[100px] pb-0 lg:h-[580px] xl:h-[600px] flex flex-col lg:block"
      style={{
        background: `radial-gradient(circle at 72% 42%, rgba(217, 26, 138, 0.45) 0%, rgba(104, 0, 95, 0.3) 35%, transparent 68%),
                     radial-gradient(circle at 18% 65%, rgba(133, 0, 111, 0.35) 0%, transparent 55%),
                     linear-gradient(118deg, #240024 0%, #350035 24%, #490043 52%, #620055 76%, #330030 100%)`,
      }}
    >
      {/* Background Diamond Geometry */}
      <div
        className="absolute left-[62%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[480px] lg:w-[560px] aspect-square rotate-45 border border-white/[0.07] bg-gradient-to-br from-white/[0.05] via-[#D91A8A]/[0.07] to-transparent pointer-events-none rounded-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute left-[62%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[350px] lg:w-[420px] aspect-square rotate-45 border border-[#F06AB9]/10 bg-white/[0.02] pointer-events-none rounded-2xl"
        aria-hidden="true"
      />

      {/* Full-bleed soft shade for left copy */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `linear-gradient(90deg, rgba(20,0,20,0.42) 0%, rgba(20,0,20,0.15) 35%, transparent 52%)`,
        }}
      />

      {/* Desktop model with pink lilies */}
      <div
        className="hidden lg:block absolute bottom-0 right-0 h-full w-[60%] xl:w-[56%] pointer-events-none select-none"
        aria-hidden="true"
      >
        <img
          src="https://agsdemo.in/vvsapi/public/assets/images/web_images/common/girl_common.webp"
          alt="VV Studio Beauty Model with Pink Lilies"
          title="VV Studio Beauty Model with Pink Lilies"
          draggable={false}
          className="absolute bottom-0 right-[8%] xl:right-[12%] h-[90%] w-auto max-w-none object-contain object-right-bottom"
        />
        {/* Floating cursive tagline over model */}
        <div
          className="absolute top-[35%] right-[10%] xl:right-[14%] pointer-events-none select-none text-left"
          aria-hidden="true"
        >
          <p className="font-script text-[38px] xl:text-[44px] text-white/95 leading-[1.12] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            Look Good <br />
            <span className="text-[#F8C1DE]">Feel Good</span> <br />
            Be You
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Container className="relative w-full z-20 flex-1 flex flex-col justify-center lg:h-full lg:pb-8">
        <div className="w-full lg:max-w-[580px] pt-4 lg:pt-6 pb-6 sm:pb-8 lg:pb-0 text-left">
          {/* Eyebrow */}
          <p className="text-[11px] sm:text-[13px] font-semibold tracking-[0.26em] uppercase text-[#F8C1DE] mb-3">
            OUR SERVICES
          </p>

          {/* Headline */}
          <h1 className="font-display italic text-[32px] sm:text-5xl lg:text-[54px] xl:text-[60px] text-white font-normal leading-[1.14] sm:leading-[1.12] tracking-tight break-words">
            Complete Beauty Care <br />
            <span className="text-white drop-shadow-sm">Under One Roof</span>
          </h1>

          {/* Subtitle in Cursive Script */}
          <p className="font-script text-[26px] sm:text-[32px] lg:text-[36px] text-[#F8C1DE] leading-snug mt-2 sm:mt-3">
            Adding care to your Beauty
          </p>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[13px] sm:text-[14px] mt-5 sm:mt-7 font-medium">
            <Link to="/" title="VV Studio Luxury Salon & Spa" className="text-white/80 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-[#E8329D] font-bold">›</span>
            <span className="text-[#E8329D]">Services</span>
          </div>
        </div>
      </Container>

      {/* Mobile model banner */}
      <div className="lg:hidden relative w-full h-[250px] sm:h-[340px] mt-2 overflow-hidden pointer-events-none select-none">
        <img
          src="https://agsdemo.in/vvsapi/public/assets/images/web_images/common/girl_common.webp"
          alt="VV Studio Beauty Model with Pink Lilies"
          title="VV Studio Beauty Model with Pink Lilies"
          loading="eager"
          className="absolute bottom-0 right-0 h-full w-auto max-w-none object-contain object-right-bottom"
        />
        <div
          className="absolute top-[8%] right-4 sm:right-6 pointer-events-none select-none text-right"
          aria-hidden="true"
        >
          <p className="font-script text-[24px] sm:text-[30px] text-white/95 leading-[1.15] drop-shadow-[0_3px_12px_rgba(0,0,0,0.7)]">
            Look Good <br />
            <span className="text-[#F8C1DE]">Feel Good</span> <br />
            Be You
          </p>
        </div>
      </div>
    </section>
  );
};
