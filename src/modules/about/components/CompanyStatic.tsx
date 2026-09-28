import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { WhatsAppIcon } from '@/components/shared/WhatsAppIcon';
import { CONTACT_INFO } from '@/data/salonData';

/**
 * Static company contact markup (no network, no react-query).
 * Rendered instantly on first paint AND used as the Suspense fallback
 * for the live blocks in `CompanyLive` — identical layout, so the swap
 * to real API data causes zero layout shift.
 */

export const HeaderPhonesStatic: React.FC = () => (
  <div className="flex items-center gap-2 text-[12px] font-medium text-white/90 whitespace-nowrap">
    <Phone className="w-3.5 h-3.5 text-white/90 shrink-0" />
    <a
      href={`tel:${CONTACT_INFO.phones[0].replace(/\D/g, '')}`}
      title={`Call VV Studio – ${CONTACT_INFO.phones[0]}`}
      className="hover:text-white transition-colors duration-200 tracking-wider"
    >
      {CONTACT_INFO.phones[0]}
    </a>

    <span className="text-white/30 mx-1">|</span>

    <WhatsAppIcon className="w-3.5 h-3.5 text-white/90 shrink-0" />
    <a
      href={`https://wa.me/91${CONTACT_INFO.phones[1].replace(/\D/g, '')}`}
      title="Chat with VV Studio on WhatsApp"
      target="_blank"
      rel="noreferrer"
      className="hover:text-white transition-colors duration-200 tracking-wider"
    >
      {CONTACT_INFO.phones[1]}
    </a>
  </div>
);

export const MobileMenuContactStatic: React.FC = () => (
  <div className="grid grid-cols-2 gap-2">
    <a
      href={`tel:${CONTACT_INFO.phones[0].replace(/\D/g, '')}`}
      title={`Call VV Studio – ${CONTACT_INFO.phones[0]}`}
      className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 text-white/90 text-xs font-semibold px-2 py-3 min-h-[48px] whitespace-nowrap hover:bg-white/5 active:bg-white/10 transition-colors"
    >
      <Phone className="w-4 h-4 text-[#F06AB9] shrink-0" />
      {CONTACT_INFO.phones[0]}
    </a>
    <a
      href={`https://wa.me/91${CONTACT_INFO.phones[1].replace(/\D/g, '')}`}
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

export const FooterContactStatic: React.FC = () => (
  <ul className="space-y-3 text-[13px] sm:text-sm text-[#5E525C]">
    <li className="flex items-start gap-2.5">
      <MapPin className="w-4 h-4 text-[#3D003D] shrink-0 mt-0.5" />
      <span className="leading-relaxed">{CONTACT_INFO.address}</span>
    </li>
    <li className="flex items-center gap-2.5">
      <Phone className="w-4 h-4 text-[#3D003D] shrink-0" />
      <a
        href={`tel:${CONTACT_INFO.phones[1]}`}
        title={`Call VV Studio – ${CONTACT_INFO.phones[1]}`}
        className="hover:text-[#D91A8A] transition-colors"
      >
        {CONTACT_INFO.phones[1]}
      </a>
    </li>
    <li className="flex items-center gap-2.5">
      <Phone className="w-4 h-4 text-[#3D003D] shrink-0" />
      <a
        href={`tel:${CONTACT_INFO.phones[0].replace(/\D/g, '')}`}
        title={`Call VV Studio – ${CONTACT_INFO.phones[0]}`}
        className="hover:text-[#D91A8A] transition-colors"
      >
        {CONTACT_INFO.phones[0]}
      </a>
    </li>
    <li className="flex items-center gap-2.5">
      <Mail className="w-4 h-4 text-[#3D003D] shrink-0" />
      <a
        href={`mailto:${CONTACT_INFO.email}`}
        title="Email VV Studio"
        className="hover:text-[#D91A8A] transition-colors break-all"
      >
        {CONTACT_INFO.email}
      </a>
    </li>
  </ul>
);
