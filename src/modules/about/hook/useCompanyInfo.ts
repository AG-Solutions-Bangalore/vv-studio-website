import { useCompany } from './useCompany';
import {
  CONTACT_INFO,
  STUDIO_ADDRESS_MULTILINE,
} from '@/data/salonData';
import type { Company } from '../types';

/** Company contact details — live API values with static fallback. */
export interface CompanyInfo {
  name: string;
  email: string;
  landline: string;
  mobile: string;
  address: string;
  addressShort: string;
  addressMultiline: string;
  landlineHref: string;
  mobileHref: string;
  whatsappHref: string;
  emailHref: string;
  logoUrl: string | null;
  /** True once the live API response has arrived (else static fallback). */
  isLive: boolean;
}

const digitsOf = (value: string): string => value.replace(/\D/g, '');

/**
 * Merged company info from `GET /getCompany`.
 *
 * Returns static `salonData` instantly while the query is pending or
 * failed, then swaps to the real backend values (`support@vvstudio.in`,
 * live phones/address/logo) — so callers render useful content on
 * first paint with zero layout shift. Must be used under a
 * `QueryClientProvider` (see `CompanyLive` wrappers).
 */
export function useCompanyInfo(): CompanyInfo {
  const { data } = useCompany();
  const company: Company | undefined = data?.data;

  const email = company?.company_email || CONTACT_INFO.email;
  const mobile = company?.company_mobile_no || CONTACT_INFO.phones[1];
  const landline = company?.company_landline_no || CONTACT_INFO.phones[0];
  const address = company?.company_address || CONTACT_INFO.address;
  const logoBase =
    data?.image_url.find((entry) => entry.image_for === 'Company')?.image_url ?? '';

  return {
    name: company?.company_name || 'VV Studio',
    email,
    landline,
    mobile,
    address,
    addressShort: address,
    addressMultiline:
      address === CONTACT_INFO.address ? STUDIO_ADDRESS_MULTILINE : address,
    landlineHref: `tel:${digitsOf(landline)}`,
    mobileHref: `tel:${digitsOf(mobile).slice(-10)}`,
    whatsappHref: `https://wa.me/91${digitsOf(mobile).slice(-10)}`,
    emailHref: `mailto:${email}`,
    logoUrl: company?.company_logo ? `${logoBase}${company.company_logo}` : null,
    isLive: Boolean(company),
  };
}
