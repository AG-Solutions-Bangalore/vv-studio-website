import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Container } from '@/components/ui/Container';
import {
  STUDIO_DIRECTIONS_URL,
  STUDIO_FOOTER_MAP_EMBED_SRC,
} from '@/data/salonData';
import { FooterContactStatic } from '@/modules/about/components/CompanyStatic';

// Live company contact (own query chunk — never in the critical bundle).
const FooterContactLive = lazy(() =>
  import('@/modules/about/components/CompanyLive').then((m) => ({
    default: m.FooterContactLive,
  })),
);

// Newsletter signup (own query chunk — never in the critical bundle).
const NewsletterForm = lazy(() =>
  import('./NewsletterForm').then((m) => ({
    default: m.NewsletterForm,
  })),
);

// Quick Links from GET /getSitemap (own query chunk — never critical).
const FooterQuickLinks = lazy(() =>
  import('./FooterQuickLinks').then((m) => ({
    default: m.FooterQuickLinks,
  })),
);

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-[#f4f4f4] border-t text-[#40363F] relative overflow-hidden">
      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pt-12 sm:pt-14 pb-10">
          {/* Column 1: Logo, script tagline & socials (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            <div>
              <Logo theme="light" size="lg" />
              <p className="font-script text-3xl sm:text-4xl leading-snug text-[#3D003D] mt-4">
                Adding care to your Beauty
              </p>
            </div>

            {/* Social Links — plain plum glyphs like reference */}
            <div className="flex items-center gap-6 pb-1">
              <a
                href="https://www.facebook.com/vvstudioblr"
                target="_blank"
                rel="noreferrer"
                title="VV Studio on Facebook"
                aria-label="VV Studio on Facebook"
                className="text-[#3D003D] hover:text-[#D91A8A] transition-colors duration-300"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                title="VV Studio on Instagram"
                aria-label="VV Studio on Instagram"
                className="text-[#3D003D] hover:text-[#D91A8A] transition-colors duration-300"
              >
                <svg className="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@vvstudio512"
                target="_blank"
                rel="noreferrer"
                title="VV Studio on YouTube"
                aria-label="VV Studio on YouTube"
                className="text-[#3D003D] hover:text-[#D91A8A] transition-colors duration-300"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>

            {/* Newsletter signup (POST /createNewsletter) */}
            <Suspense fallback={null}>
              <NewsletterForm />
            </Suspense>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h2 className="text-[15px] font-bold text-[#2D0A2E] mb-4">
              Quick Links
            </h2>
            <Suspense fallback={null}>
              <FooterQuickLinks />
            </Suspense>
          </div>

          {/* Column 3: Contact Us (3 cols) */}
          <div className="lg:col-span-3">
            <h2 className="text-[15px] font-bold text-[#2D0A2E] mb-4">
              Contact Us
            </h2>
            <div className="text-[13px] sm:text-sm text-[#5E525C]">
              <Suspense fallback={<FooterContactStatic />}>
                <FooterContactLive />
              </Suspense>
            </div>
          </div>

          {/* Column 4: Map & Directions card (3 cols) */}
          <div className="lg:col-span-3">
            <div className="relative rounded-xl overflow-hidden border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.12)] bg-[#EDE6EB]">
              {/* Map background - coords query so no native place card */}
              <div className="relative aspect-[16/10] w-full">
                <iframe
                  title="V V Studio location map - JP Nagar, Bangalore"
                  src={STUDIO_FOOTER_MAP_EMBED_SRC}
                  className="absolute inset-0 h-full w-full border-0 pointer-events-none"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                {/* soft white fade for label readability */}
                <div
                  className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/90 via-white/60 to-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              {/* Top label overlay - no custom pin, Google already shows pin */}
              <div className="absolute top-2.5 inset-x-0 flex justify-center pointer-events-none px-3">
                <span className="text-center leading-tight">
                  <span className="block text-[15px] font-bold text-[#2D0A2E]">
                    V V Studio
                  </span>
                  <span className="block text-[13px] text-[#5E525C]">
                    JP Nagar, Bangalore
                  </span>
                </span>
              </div>

              {/* Bottom CTA overlay */}
              <div className="absolute bottom-3.5 inset-x-0 flex justify-center px-4">
                <a
                  href={STUDIO_DIRECTIONS_URL}
                  target="_blank"
                  rel="noreferrer"
                  title="Get Directions to VV Studio"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-7 rounded-full bg-[#E8329D] hover:bg-[#D91A8A] text-white text-sm font-semibold tracking-wide transition-all shadow-[0_6px_20px_rgba(232,50,157,0.5)] cursor-pointer"
                >
                  <span>Get Directions</span>
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom copyright bar */}
      <div className="bg-[#3D003D] text-white/70">
        <Container className="py-4 flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
          <p>© 2024 V V Studio. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/#privacy" title="VV Studio Privacy Policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/30">|</span>
            <Link to="/#terms" title="VV Studio Terms & Conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
};