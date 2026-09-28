import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { MapPin, Phone, Mail } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import { WhatsAppIcon } from '@/components/shared/WhatsAppIcon';
import { useCompanyInfo } from '../hook/useCompanyInfo';

/**
 * Live company contact blocks backed by `GET /getCompany`.
 *
 * Each block mounts its own `QueryClientProvider` over the shared
 * singleton client (same pattern as `BookingModal`), so the react-query
 * runtime ships in these lazy chunks — never in the critical bundle.
 * Import via `React.lazy` with the matching `CompanyStatic` fallback:
 *
 *   const HeaderPhonesLive = lazy(() =>
 *     import('@/modules/about/components/CompanyLive').then((m) => ({
 *       default: m.HeaderPhonesLive,
 *     })),
 *   );
 *   <Suspense fallback={<HeaderPhonesStatic />}>
 *     <HeaderPhonesLive />
 *   </Suspense>
 *
 * While the query is pending/failed the blocks render the same static
 * fallback values, so first paint is instant with zero layout shift.
 */

export const HeaderPhonesLive: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <HeaderPhonesLiveInner />
  </QueryClientProvider>
);

const HeaderPhonesLiveInner: React.FC = () => {
  const info = useCompanyInfo();
  return (
    <div className="flex items-center gap-2 text-[12px] font-medium text-white/90 whitespace-nowrap">
      <Phone className="w-3.5 h-3.5 text-white/90 shrink-0" />
      <a
        href={info.landlineHref}
        title={`Call VV Studio – ${info.landline}`}
        className="hover:text-white transition-colors duration-200 tracking-wider"
      >
        {info.landline}
      </a>

      <span className="text-white/30 mx-1">|</span>

      <WhatsAppIcon className="w-3.5 h-3.5 text-white/90 shrink-0" />
      <a
        href={info.whatsappHref}
        title="Chat with VV Studio on WhatsApp"
        target="_blank"
        rel="noreferrer"
        className="hover:text-white transition-colors duration-200 tracking-wider"
      >
        {info.mobile}
      </a>
    </div>
  );
};

export const MobileMenuContactLive: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <MobileMenuContactLiveInner />
  </QueryClientProvider>
);

const MobileMenuContactLiveInner: React.FC = () => {
  const info = useCompanyInfo();
  return (
    <div className="grid grid-cols-2 gap-2">
      <a
        href={info.landlineHref}
        title={`Call VV Studio – ${info.landline}`}
        className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 text-white/90 text-xs font-semibold px-2 py-3 min-h-[48px] whitespace-nowrap hover:bg-white/5 active:bg-white/10 transition-colors"
      >
        <Phone className="w-4 h-4 text-[#F06AB9] shrink-0" />
        {info.landline}
      </a>
      <a
        href={info.whatsappHref}
        title="Chat with VV Studio on WhatsApp"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 text-white/90 text-xs font-semibold px-2 py-3 min-h-[48px] whitespace-nowrap hover:bg-white/5 active:bg-white/10 transition-colors"
      >
        <WhatsAppIcon className="w-4 h-4 text-[#F06AB9] shrink-0" />
        WhatsApp
      </a>
    </div>
  );
};

export const FooterContactLive: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <FooterContactLiveInner />
  </QueryClientProvider>
);

const FooterContactLiveInner: React.FC = () => {
  const info = useCompanyInfo();
  return (
    <ul className="space-y-3 text-[13px] sm:text-sm text-[#5E525C]">
      <li className="flex items-start gap-2.5">
        <MapPin className="w-4 h-4 text-[#3D003D] shrink-0 mt-0.5" />
        <span className="leading-relaxed">{info.address}</span>
      </li>
      <li className="flex items-center gap-2.5">
        <Phone className="w-4 h-4 text-[#3D003D] shrink-0" />
        <a
          href={info.mobileHref}
          title={`Call VV Studio – ${info.mobile}`}
          className="hover:text-[#D91A8A] transition-colors"
        >
          {info.mobile}
        </a>
      </li>
      <li className="flex items-center gap-2.5">
        <Phone className="w-4 h-4 text-[#3D003D] shrink-0" />
        <a
          href={info.landlineHref}
          title={`Call VV Studio – ${info.landline}`}
          className="hover:text-[#D91A8A] transition-colors"
        >
          {info.landline}
        </a>
      </li>
      <li className="flex items-center gap-2.5">
        <Mail className="w-4 h-4 text-[#3D003D] shrink-0" />
        <a
          href={info.emailHref}
          title="Email VV Studio"
          className="hover:text-[#D91A8A] transition-colors break-all"
        >
          {info.email}
        </a>
      </li>
    </ul>
  );
};
