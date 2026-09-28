import { apiClient, ApiError } from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/api/endpoints';
import {
  envelopeMessage,
  isSuccessEnvelope,
  type EnquiryPayload as BaseEnquiryPayload,
  type EnquiryResponse,
} from '@/lib/api/types';

export type { EnquiryResponse };

export interface EnquiryPayload extends Omit<BaseEnquiryPayload, 'enquiryService'> {
  /**
   * Service / treatment name (Postman: `enquiryService`).
   * Optional here because existing callers pass the legacy
   * `enquiryProduct` alias — one of the two must be set.
   */
  enquiryService?: string;
  /**
   * Deprecated alias for `enquiryService` (old `/enquiry.php` field).
   * Existing callers (`BookingModal`, contact form) still pass this —
   * it is mapped to `enquiryService` below.
   */
  enquiryProduct?: string;
}

/** Collection sends form-data — mirror the Postman body keys exactly. */
function toFormData(payload: EnquiryPayload): FormData {
  const form = new FormData();
  form.append('enquiryFullName', payload.enquiryFullName);
  form.append('enquiryMobile', payload.enquiryMobile);
  form.append('enquiryEmail', payload.enquiryEmail);
  form.append('enquiryService', payload.enquiryService || payload.enquiryProduct || '');
  form.append('enquiryMessage', payload.enquiryMessage);
  form.append('enquiryFrom', payload.enquiryFrom || 'website');
  if (payload.utm_medium) form.append('utm_medium', payload.utm_medium);
  if (payload.utm_source) form.append('utm_source', payload.utm_source);
  if (payload.utm_campaign) form.append('utm_campaign', payload.utm_campaign);
  return form;
}

/**
 * POST /createEnquiry (form-data).
 * Used by `BookingModal` (all pages) and the contact page form.
 *
 * Success shape: `{"code":201,"message":"Enquiry Created Successfully."}`.
 * Anything else (e.g. `{"code":400,…}` on HTTP 200) throws `ApiError`
 * so forms never show a false success.
 */
export async function submitEnquiry(payload: EnquiryPayload): Promise<EnquiryResponse> {
  const { data } = await apiClient.post<EnquiryResponse>(
    ENDPOINTS.enquiry,
    toFormData(payload),
  );
  if (!isSuccessEnvelope(data)) {
    throw new ApiError(
      envelopeMessage(data, 'Failed to submit enquiry. Please try again.'),
      undefined,
      typeof data?.code === 'number' || typeof data?.code === 'string'
        ? data.code
        : undefined,
    );
  }
  return data;
}
