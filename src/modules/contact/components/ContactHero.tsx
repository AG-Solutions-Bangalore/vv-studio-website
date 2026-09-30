import React from 'react';
import { Container } from '@/components/ui/Container';

export const ContactHero: React.FC = () => {
  return (
    <section
      className="relative bg-[#3D003D] text-white overflow-hidden pt-[104px] lg:pt-[92px] pb-0 lg:h-[600px] xl:h-[610px] flex flex-col lg:block"
      style={{
        background: `radial-gradient(circle at 72% 42%, rgba(217, 26, 138, 0.45) 0%, rgba(104, 0, 95, 0.3) 35%, transparent 68%),
                     radial-gradient(circle at 18% 65%, rgba(133, 0, 111, 0.35) 0%, transparent 55%),
                     linear-gradient(118deg, #240024 0%, #350035 24%, #490043 52%, #620055 76%, #330030 100%)`,
      }}
    >
      {/* Background Diamond Geometry — parked behind the model, clear of the headline */}
      <div
        className="absolute left-[62%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[480px] lg:w-[560px] aspect-square rotate-45 border border-white/[0.07] bg-gradient-to-br from-white/[0.05] via-[#D91A8A]/[0.07] to-transparent pointer-events-none rounded-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute left-[62%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[350px] lg:w-[420px] aspect-square rotate-45 border border-[#F06AB9]/10 bg-white/[0.02] pointer-events-none rounded-2xl"
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
        className="hidden lg:block absolute bottom-0 right-0 h-full w-[60%] xl:w-[56%] pointer-events-none select-none"
        aria-hidden="true"
      >
        <img
          src="https://vvstudio.in/crmapi/public/assets/images/web_images/common/girl_common.webp"
          alt="VV Studio Beauty Model with Pink Lilies"
          title="VV Studio Beauty Model with Pink Lilies"
          draggable={false}
          className="absolute bottom-0 right-[12%]  h-[85%] w-auto max-w-none object-contain object-right-bottom"
        />
        {/* Floating cursive tagline over the model's empty alpha space */}
        <div
          className="absolute top-[40%] right-[12%] pointer-events-none select-none text-left"
          aria-hidden="true"
        >
          <p className="font-script text-[40px] xl:text-[44px] text-white/95 leading-[1.12] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            Look Good <br />
            <span className="text-[#F8C1DE]">Feel Good</span> <br />
            Be You
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Container className="relative w-full z-20 flex-1 flex flex-col justify-center lg:h-full lg:pb-10">
        <div className="w-full lg:max-w-[560px] pt-6 lg:pt-8 pb-8 sm:pb-10 lg:pb-0 text-left">
          {/* Eyebrow */}
          <p className="text-[11px] sm:text-[13px] font-semibold tracking-[0.24em] sm:tracking-[0.28em] uppercase text-[#F8C1DE] mb-3 sm:mb-4">
            CONTACT US
          </p>

          {/* Headline */}
          <h1 className="font-display italic text-[32px] sm:text-5xl lg:text-[56px] xl:text-[62px] text-white font-normal leading-[1.15] sm:leading-[1.12] tracking-tight break-words">
            We&apos;d Love to <br />
            <span className="text-white drop-shadow-sm">Hear from You</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[15px] sm:text-lg text-white/85 font-light leading-relaxed mt-3 sm:mt-5 max-w-lg">
            Let&apos;s start your beauty journey together.
          </p>
        </div>
      </Container>

      {/* Mobile / tablet model — right-anchored so the face stays visible on narrow screens */}
      <div className="lg:hidden relative w-full h-[260px] sm:h-[360px] mt-4 sm:mt-8 overflow-hidden pointer-events-none select-none">
        <img
          src="https://vvstudio.in/crmapi/public/assets/images/web_images/common/girl_common.webp"
          alt="VV Studio Beauty Model with Pink Lilies"
          title="VV Studio Beauty Model with Pink Lilies"
          loading="eager"
          className="absolute bottom-0 right-0 h-full w-auto max-w-none object-contain object-right-bottom"
        />
        <div
          className="absolute top-[10%] right-4 sm:right-6 pointer-events-none select-none text-right"
          aria-hidden="true"
        >
          <p className="font-script text-[22px] sm:text-3xl text-white/95 leading-[1.15] drop-shadow-[0_3px_12px_rgba(0,0,0,0.7)]">
            Look Good <br />
            <span className="text-[#F8C1DE]">Feel Good</span> <br />
            Be You
          </p>
        </div>
      </div>
    </section>
  );
};
