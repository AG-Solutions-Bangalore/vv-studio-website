export interface SalonService {
  id: string;
  title: string;
  description: string;
  image: string;
  iconName:
    | 'threading'
    | 'facial'
    | 'waxing'
    | 'bridal'
    | 'hairStyling'
    | 'handFeet'
    | 'hairTreatment'
    | 'hairColor'
    | 'scalp'
    | 'makeover'
    | 'packages'
    | 'products';
  category: string;
}

export const ALL_SERVICES: SalonService[] = [
  {
    id: 'threading',
    title: 'Threading',
    description: 'Perfect shaping for a naturally beautiful you.',
    image: 'https://agsdemo.in/vvsapi/public/assets/images/web_images/services/service_waxing_threading.webp',
    iconName: 'threading',
    category: 'Threading',
  },
  {
    id: 'skin-facials',
    title: 'Skin & Facials',
    description: 'Refresh. Rejuvenate. Glow.',
    image: 'https://agsdemo.in/vvsapi/public/assets/images/web_images/home/about_facial_treatment.webp',
    iconName: 'facial',
    category: 'Skin & Facials',
  },
  {
    id: 'waxing',
    title: 'Waxing',
    description: 'Smooth skin. Lasting confidence.',
    image: 'https://agsdemo.in/vvsapi/public/assets/images/web_images/services/service_skin_facials.webp',
    iconName: 'waxing',
    category: 'Waxing',
  },
  {
    id: 'makeup-bridal',
    title: 'Makeup & Bridal',
    description: 'For your most special moments.',
    image: 'https://agsdemo.in/vvsapi/public/assets/images/web_images/services/service_makeup_bridal.webp',
    iconName: 'bridal',
    category: 'Makeup & Bridal',
  },
  {
    id: 'hair-care-styling',
    title: 'Hair Care & Styling',
    description: 'Healthy, stylish, beautiful hair.',
    image: 'https://agsdemo.in/vvsapi/public/assets/images/web_images/services/service_hair_care.webp',
    iconName: 'hairStyling',
    category: 'Hair Care',
  },
  {
    id: 'hand-feet-care',
    title: 'Hand & Feet Care',
    description: 'Pamper every detail.',
    image: 'https://agsdemo.in/vvsapi/public/assets/images/web_images/services/service_hand_feet_care.webp',
    iconName: 'handFeet',
    category: 'Hand & Feet Care',
  },
  {
    id: 'hair-treatments',
    title: 'Hair Treatments',
    description: 'Repair. Nourish. Grow.',
    image: 'https://agsdemo.in/vvsapi/public/assets/images/web_images/services/service_hair_treatments.webp',
    iconName: 'hairTreatment',
    category: 'Hair Treatments',
  },
  {
    id: 'hair-color-highlights',
    title: 'Hair Color & Highlights',
    description: 'Express your style.',
    image: 'https://agsdemo.in/vvsapi/public/assets/images/web_images/home/about_hair_styling.webp',
    iconName: 'hairColor',
    category: 'Hair Care',
  },
  {
    id: 'hair-scalp-treatments',
    title: 'Hair & Scalp Treatments',
    description: 'Healthy scalp, stronger hair.',
    image: 'https://agsdemo.in/vvsapi/public/assets/images/web_images/gallery/gallery_dewy_skin_facial.webp',
    iconName: 'scalp',
    category: 'Hair Treatments',
  },
  {
    id: 'makeovers',
    title: 'Makeovers',
    description: 'A new you for every occasion.',
    image: 'https://agsdemo.in/vvsapi/public/assets/images/web_images/gallery/gallery_floral_hair_updo.webp',
    iconName: 'makeover',
    category: 'Makeup & Bridal',
  },
  {
    id: 'special-packages',
    title: 'Special Packages',
    description: 'Complete beauty care experiences.',
    image: 'https://agsdemo.in/vvsapi/public/assets/images/web_images/gallery/gallery_salon_ambience.webp',
    iconName: 'packages',
    category: 'Special Packages',
  },
  {
    id: 'beauty-products',
    title: 'Beauty Products',
    description: 'Salon-grade products for home care.',
    image: 'https://agsdemo.in/vvsapi/public/assets/images/web_images/home/about_salon_reception.webp',
    iconName: 'products',
    category: 'Beauty Products',
  },
];
