import { apiClient } from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { OFFERS_DATA, OFFERS_BASE_URL, type OfferItem } from '@/data/offersData';

export interface RawOfferItem {
  id?: string | number;
  offer_title?: string;
  title?: string;
  offer_price?: string;
  price?: string;
  original_price?: string;
  originalPrice?: string;
  offer_discount?: string;
  discount?: string;
  offer_category?: string;
  category?: string;
  offer_image?: string;
  image?: string;
  offer_features?: string | string[];
  features?: string | string[];
  service_id?: string;
  serviceId?: string;
  alt?: string;
}

export interface OffersResponse {
  data?: RawOfferItem[];
  code?: number;
  message?: string;
}

export function normalizeOfferItem(raw: RawOfferItem, index: number): OfferItem {
  const title = (raw.offer_title ?? raw.title ?? `Offer ${index + 1}`).trim();
  const price = (raw.offer_price ?? raw.price ?? '').trim();
  const originalPrice = raw.original_price ?? raw.originalPrice;
  const discount = (raw.offer_discount ?? raw.discount ?? '30% OFF').trim();

  let category: OfferItem['category'] = 'Skin & Waxing';
  const catStr = (raw.offer_category ?? raw.category ?? '').toLowerCase();
  if (catStr.includes('hair')) {
    category = 'Hair Care';
  } else if (catStr.includes('nail') || catStr.includes('lash')) {
    category = 'Nails & Lashes';
  } else if (catStr.includes('skin') || catStr.includes('wax')) {
    category = 'Skin & Waxing';
  }

  let rawImg = (raw.offer_image ?? raw.image ?? `${index + 1}.webp`).trim();
  if (!rawImg.includes('.')) rawImg += '.webp';
  const image = rawImg.replace(OFFERS_BASE_URL, '').split('/').pop() || `${index + 1}.webp`;

  let features: string[] = [];
  const rawFeat = raw.offer_features ?? raw.features;
  if (Array.isArray(rawFeat)) {
    features = rawFeat.map(String).filter(Boolean);
  } else if (typeof rawFeat === 'string') {
    features = rawFeat.split(/[,;\n·•]+/).map((s) => s.trim()).filter(Boolean);
  }
  if (!features.length) {
    features = ['Exclusive Treatment', 'Certified Salon Experts', 'Premium Products'];
  }

  return {
    id: String(raw.id ?? `offer-${index + 1}`),
    title,
    price: price ? (price.startsWith('₹') ? price : `₹${price}`) : '₹999',
    originalPrice: originalPrice
      ? (originalPrice.startsWith('₹') ? originalPrice : `₹${originalPrice}`)
      : undefined,
    discount,
    category,
    image,
    features: features.slice(0, 3),
    serviceId: String(raw.service_id ?? raw.serviceId ?? 'skin-facials'),
    alt: raw.alt ?? `${title} - Festival Offer at VV Studio Female Salon`,
  };
}

/**
 * Fetch offers from backend API. Always tries live API endpoint first,
 * falling back to static offersData.ts if unseeded or on network error.
 */
export async function getOffers(): Promise<OfferItem[]> {
  try {
    const res = await apiClient.get<OffersResponse | RawOfferItem[]>(ENDPOINTS.offers);
    const list = Array.isArray(res.data)
      ? res.data
      : (res.data?.data && Array.isArray(res.data.data) ? res.data.data : []);

    if (list.length > 0) {
      return list.map((item, idx) => normalizeOfferItem(item, idx));
    }
  } catch {
    // Graceful fallback to static offersData.ts on network/404/server error
  }
  return OFFERS_DATA;
}
