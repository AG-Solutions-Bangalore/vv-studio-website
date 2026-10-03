export interface OfferItem {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  discount: string;
  category: 'All' | 'Hair Care' | 'Skin & Waxing' | 'Nails & Lashes';
  image: string;
  features: string[];
  serviceId: string;
  alt: string;
}

export const OFFERS_BASE_URL =
  'https://vvstudio.in/crmapi/public/assets/images/web_images/offers/';

export const OFFERS_DATA: OfferItem[] = [
  {
    id: 'waxing-package',
    title: 'Waxing Package',
    price: '₹999',
    originalPrice: '₹1,429',
    discount: '30% OFF',
    category: 'Skin & Waxing',
    image: '1.webp',
    features: [
      'Full Hand Waxing',
      'Full Leg Waxing',
      'Under Arm Waxing',
    ],
    serviceId: 'waxing-threading',
    alt: 'Waxing Package - Festival Offer at VV Studio Female Salon',
  },
  {
    id: 'skincare-package',
    title: 'Skincare Package',
    price: '₹2,499',
    originalPrice: '₹3,570',
    discount: '30% OFF',
    category: 'Skin & Waxing',
    image: '2.webp',
    features: [
      'Insta Glow Facial & De-Tan',
      'Full Hand, Leg & Under Arm Wax',
      'Pedicure & Relaxing Massage',
    ],
    serviceId: 'skin-facials',
    alt: 'Complete Skincare Package - Festival Offer at VV Studio Female Salon',
  },
  {
    id: 'gel-polish',
    title: 'Gel Polish',
    price: '₹399',
    originalPrice: '₹570',
    discount: '30% OFF',
    category: 'Nails & Lashes',
    image: '3.webp',
    features: [
      'Long-Lasting High Gloss',
      'Chip-Resistant Formula',
      'Curated Premium Shades',
    ],
    serviceId: 'hand-feet-care',
    alt: 'Gel Polish - Festival Offer at VV Studio Female Salon',
  },
  {
    id: 'nails-extension',
    title: 'Nails Extension',
    price: '₹999',
    originalPrice: '₹1,429',
    discount: '30% OFF',
    category: 'Nails & Lashes',
    image: '4.webp',
    features: [
      'Custom Shapes & Lengths',
      'Gel / Acrylic Full Overlay',
      'Durable Salon-Grade Gloss',
    ],
    serviceId: 'hand-feet-care',
    alt: 'Nails Extension - Festival Offer at VV Studio Female Salon',
  },
  {
    id: 'eyelash-extension',
    title: 'Eyelash Extension',
    price: '₹1,699',
    originalPrice: '₹2,429',
    discount: '30% OFF',
    category: 'Nails & Lashes',
    image: '5.webp',
    features: [
      'Natural & Volume Styles',
      'Weightless Feather-Light Lash',
      'Hypoallergenic Safe Adhesive',
    ],
    serviceId: 'makeup-bridal',
    alt: 'Eyelash Extension - Festival Offer at VV Studio Female Salon',
  },
  {
    id: 'hair-smoothing-straightening',
    title: 'Smoothing / Straightening',
    price: '₹3,499',
    originalPrice: '₹4,999',
    discount: '30% OFF',
    category: 'Hair Care',
    image: '6.webp',
    features: [
      'Silky Frizz-Free Texture',
      'Deep Keratin Infusion',
      'Long-Lasting Straight Look',
    ],
    serviceId: 'hair-treatments',
    alt: 'Smoothing and Straightening Hair Treatment - Festival Offer at VV Studio Female Salon',
  },
  {
    id: 'global-hair-colouring',
    title: 'Global Hair Colouring',
    price: '₹3,499',
    originalPrice: '₹4,999',
    discount: '30% OFF',
    category: 'Hair Care',
    image: '7.webp',
    features: [
      'Full Coverage Rich Tone',
      'Gentle Ammonia-Free Color',
      'Gloss & Softness Seal',
    ],
    serviceId: 'hair-care',
    alt: 'Global Hair Colouring - Festival Offer at VV Studio Female Salon',
  },
  {
    id: 'global-hair-highlights',
    title: 'Global Hair Highlights',
    price: '₹3,999',
    originalPrice: '₹5,715',
    discount: '30% OFF',
    category: 'Hair Care',
    image: '8.webp',
    features: [
      'Multi-Dimensional Balayage',
      'Customized Face-Framing Tones',
      'Luminous Radiance Finish',
    ],
    serviceId: 'hair-care',
    alt: 'Global Hair Highlights - Festival Offer at VV Studio Female Salon',
  },
  {
    id: 'botox-hair-treatment',
    title: 'Botox Hair Treatment',
    price: '₹5,499',
    originalPrice: '₹7,855',
    discount: '30% OFF',
    category: 'Hair Care',
    image: '9.webp',
    features: [
      'Intensive Fiber Repair',
      'Restores Moisture & Elasticity',
      'Velvet Smoothness Finish',
    ],
    serviceId: 'hair-treatments',
    alt: 'Botox Hair Treatment - Festival Offer at VV Studio Female Salon',
  },
];
