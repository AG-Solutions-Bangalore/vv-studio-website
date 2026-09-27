/**
 * Contact module alias for the canonical enquiry API.
 * Implementation lives in `@/modules/home/api/enquiryApi`
 * (shared by `BookingModal`); import from here inside contact surfaces.
 */
export {
  submitEnquiry,
  type EnquiryPayload,
  type EnquiryResponse,
} from '@/modules/home/api/enquiryApi';
