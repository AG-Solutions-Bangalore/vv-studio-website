export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  category: string;
  duration?: string;
  startingPrice?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  quote: string;
  treatment: string;
  /** Trust line under the name, e.g. `Verified Client · 25 SEP 2026`. */
  footer?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  aspect: string;
}

export interface BlogItem {
  id: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  image: string;
  date: string;
}

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'skin-facials',
    name: 'Skin & Facials',
    iconName: 'sparkles',
    description: 'Deep cleansing, glow boosts and collagen rejuvenation',
  },
  {
    id: 'hair-care',
    name: 'Hair Care',
    iconName: 'scissors',
    description: 'Precision cuts, coloring, balayage and hair treatments',
  },
  {
    id: 'waxing-threading',
    name: 'Waxing & Threading',
    iconName: 'feather',
    description: 'Ultra-gentle Rica waxing and precise eyebrow shaping',
  },
  {
    id: 'makeup-bridal',
    name: 'Makeup & Bridal',
    iconName: 'crown',
    description: 'Signature bridal couture, reception glam and party looks',
  },
  {
    id: 'hand-feet',
    name: 'Hand & Feet Care',
    iconName: 'hand',
    description: 'Aromatherapy manicures, pedicure therapy and gel nails',
  },
  {
    id: 'hair-treatments',
    name: 'Hair Treatments',
    iconName: 'droplets',
    description: 'Keratin smoothing, hair botox, and intensive scalp detox',
  },
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'skin-facials',
    title: 'Skin & Facials',
    tagline: 'Refresh. Rejuvenate. Glow.',
    description: 'Hydra-dermabrasion, organic brightening facials, anti-aging collagen therapy and dewy skin renewal rituals.',
    image: 'https://vvstudio.in/crmapi/public/assets/images/web_images/services/service_skin_facials.webp',
    category: 'Skincare',
    duration: '60 - 90 min',
    startingPrice: '₹1,499',
  },
  {
    id: 'hair-care',
    title: 'Hair Care',
    tagline: 'Style Your Story.',
    description: 'Expert styling, Korean glass-shine blowouts, custom balayage coloring and deep nourishing hair treatments.',
    image: 'https://vvstudio.in/crmapi/public/assets/images/web_images/services/service_hair_care.webp',
    category: 'Hair Styling',
    duration: '45 - 120 min',
    startingPrice: '₹899',
  },
  {
    id: 'waxing-threading',
    title: 'Waxing & Threading',
    tagline: 'Smooth Confidence.',
    description: 'Premium Italian Rica liposoluble waxing, organic cartridge rolls, and painless precision threading.',
    image: 'https://vvstudio.in/crmapi/public/assets/images/web_images/services/service_waxing_threading.webp',
    category: 'Body Care',
    duration: '20 - 45 min',
    startingPrice: '₹399',
  },
  {
    id: 'makeup-bridal',
    title: 'Makeup & Bridal',
    tagline: 'For Your Special Moments.',
    description: 'High-definition airbrush bridal artistry, timeless South & North Indian bridal looks, and party glam.',
    image: 'https://vvstudio.in/crmapi/public/assets/images/web_images/services/service_makeup_bridal.webp',
    category: 'Couture Bridal',
    duration: '90 - 180 min',
    startingPrice: '₹4,999',
  },
  {
    id: 'hand-feet-care',
    title: 'Hand & Feet Care',
    tagline: 'Pamper Every Detail.',
    description: 'Rose petal soak manicures, callus smoothing pedicures, chrome nail art and long-lasting gel lacquers.',
    image: 'https://vvstudio.in/crmapi/public/assets/images/web_images/services/service_hand_feet_care.webp',
    category: 'Nail Lounge',
    duration: '40 - 75 min',
    startingPrice: '₹799',
  },
  {
    id: 'hair-treatments',
    title: 'Hair Treatments',
    tagline: 'Healthy Hair. Happier You.',
    description: 'Formaldehyde-free Keratin, Nanoplastia gloss, Olaplex bond repair and invigorating tea-tree scalp detox.',
    image: 'https://vvstudio.in/crmapi/public/assets/images/web_images/services/service_hair_treatments.webp',
    category: 'Hair Therapy',
    duration: '90 - 150 min',
    startingPrice: '₹2,499',
  },
  {
    id: 'party-makeup',
    title: 'Party Makeup',
    tagline: 'Glam for Every Evening.',
    description: 'Soft-glam to full-glam party looks with premium waterproof palettes, lash artistry and long-wear luminous finishing.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    category: 'Glam Studio',
    duration: '45 - 90 min',
    startingPrice: '₹1,499',
  },
];

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'gallery-1',
    title: 'Radiant Dewy Skin Facial',
    category: 'Skin & Facials',
    image: 'https://vvstudio.in/crmapi/public/assets/images/web_images/gallery/gallery_dewy_skin_facial.webp',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'gallery-2',
    title: 'Intricate Floral Hair Updo',
    category: 'Hair Styling',
    image: 'https://vvstudio.in/crmapi/public/assets/images/web_images/gallery/gallery_floral_hair_updo.webp',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'gallery-3',
    title: 'Rose Quartz Blossom Gel Art',
    category: 'Nail Lounge',
    image: 'https://vvstudio.in/crmapi/public/assets/images/web_images/gallery/gallery_rose_quartz_nail_art.webp',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'gallery-4',
    title: 'Luxury Boutique Salon Ambience',
    category: 'Salon Interior',
    image: 'https://vvstudio.in/crmapi/public/assets/images/web_images/gallery/gallery_salon_ambience.webp',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'gallery-5',
    title: 'Luminous Balayage Waves',
    category: 'Hair Color',
    image: 'https://vvstudio.in/crmapi/public/assets/images/web_images/gallery/gallery_balayage_waves.webp',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'gallery-6',
    title: 'Regal Heritage Bridal Glam',
    category: 'Bridal Couture',
    image: 'https://vvstudio.in/crmapi/public/assets/images/web_images/gallery/gallery_bridal_glam.webp',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'gallery-7',
    title: 'Signature Salon Interiors',
    category: 'Salon Interior',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'gallery-8',
    title: 'Gloss Manicure Artistry',
    category: 'Nail Lounge',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[4/5]',
  },
];

// Gallery image SEO from the on-page audit (shared by home + gallery page).
export const GALLERY_SEO: Record<string, { alt: string; title: string }> = {
  'gallery-1': { alt: 'Dewy skin facial treatment at VV Studio', title: 'VV Studio Dewy Skin Facial' },
  'gallery-2': { alt: 'Floral hair updo styling at VV Studio', title: 'VV Studio Floral Hair Updo' },
  'gallery-3': { alt: 'Rose quartz nail art at VV Studio', title: 'VV Studio Rose Quartz Nail Art' },
  'gallery-4': { alt: 'Luxury salon ambience at VV Studio', title: 'VV Studio Luxury Salon Ambience' },
  'gallery-5': { alt: 'Balayage waves hairstyle at VV Studio', title: 'VV Studio Balayage Hair Waves' },
  'gallery-6': { alt: 'Bridal glam makeup at VV Studio', title: 'VV Studio Bridal Glam Makeup' },
  'gallery-7': { alt: 'Luxury salon interior at VV Studio', title: 'VV Studio Luxury Salon Interior' },
  'gallery-8': { alt: 'Professional manicure service at VV Studio', title: 'VV Studio Professional Manicure' },
};

// Local gallery assets are 896x1200; remote Unsplash items omit dims.
export const GALLERY_DIMS: Record<string, { width: number; height: number }> = {
  'gallery-1': { width: 896, height: 1200 },
  'gallery-2': { width: 896, height: 1200 },
  'gallery-3': { width: 896, height: 1200 },
  'gallery-4': { width: 896, height: 1200 },
  'gallery-5': { width: 896, height: 1200 },
  'gallery-6': { width: 896, height: 1200 },
};

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Priya S.',
    location: 'JP Nagar, Bangalore',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    treatment: 'Hydra Glow Facial',
    quote: 'Excellent service and a very professional team! My skin has never felt better. Highly recommend VV Studio for their personalized care and hygienic ambience.',
  },
  {
    id: 'test-2',
    name: 'Ananya R.',
    location: 'Jayanagar, Bangalore',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    treatment: 'Balayage & Hair Treatment',
    quote: 'Beautiful ambience and amazing staff. I always leave feeling refreshed and confident. The hairstylists really listen to what you want and give expert advice.',
  },
  {
    id: 'test-3',
    name: 'Sneha M.',
    location: 'Bannerghatta Road, Bangalore',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    treatment: 'Bridal Makeover Package',
    quote: 'Best salon in JP Nagar! From facials to hair care, everything is top notch. They made me feel like royalty on my wedding day. Truly worth every penny!',
  },
  {
    id: 'test-4',
    name: 'Divya K.',
    location: 'Whitefield, Bangalore',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    treatment: 'Hair Smoothening',
    quote: 'Smooth, frizz-free hair in one sitting. Hygienic, private and so comfortable — the best female salon experience in J P Nagar.',
  },
  {
    id: 'test-5',
    name: 'Meera J.',
    location: 'HSR Layout, Bangalore',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    treatment: 'Party Makeup',
    quote: 'My party makeup lasted all night and photographed beautifully. The artist understood exactly the soft-glam look I wanted.',
  },
  {
    id: 'test-6',
    name: 'Kavya N.',
    location: 'Koramangala, Bangalore',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    treatment: 'Keratin Treatment',
    quote: 'Frizzy to silky smooth in one sitting! Genuine products, transparent pricing and zero waiting time. My go-to salon from now on.',
  },
];

export const BLOG_DATA: BlogItem[] = [
  {
    id: 'blog-1',
    title: 'Skincare Routine for Glowing Skin',
    category: 'Skincare',
    readTime: '4 min read',
    date: 'May 12, 2024',
    excerpt: 'Simple morning and night steps for healthier, brighter and deeply hydrated skin every single day.',
    image: 'https://vvstudio.in/crmapi/public/assets/images/web_images/blog/blog_skincare_routine.webp',
  },
  {
    id: 'blog-2',
    title: 'Hair Care Tips for Healthy Hair',
    category: 'Hair Care',
    readTime: '5 min read',
    date: 'April 28, 2024',
    excerpt: 'Expert trichologist tips to protect your tresses from heat damage, pollution and humidity.',
    image: 'https://vvstudio.in/crmapi/public/assets/images/web_images/blog/blog_hair_care_tips.webp',
  },
  {
    id: 'blog-3',
    title: 'Bridal Beauty Checklist',
    category: 'Bridal Beauty',
    readTime: '6 min read',
    date: 'April 15, 2024',
    excerpt: 'Your complete month-by-month countdown guide to looking effortlessly radiant on your special day.',
    image: 'https://vvstudio.in/crmapi/public/assets/images/web_images/blog/blog_bridal_checklist.webp',
  },
  {
    id: 'blog-4',
    title: 'Monsoon Hair Rescue Guide',
    category: 'Hair Care',
    readTime: '5 min read',
    date: 'March 30, 2024',
    excerpt: 'Fight frizz, dampness and hair fall with our stylist-approved rainy season rescue routine.',
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'blog-5',
    title: 'Everyday Makeup Essentials',
    category: 'Makeup',
    readTime: '4 min read',
    date: 'March 18, 2024',
    excerpt: 'Five multitasking products for a fresh five-minute face that lasts through your workday.',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'blog-6',
    title: 'At-Home Glow Night Ritual',
    category: 'Wellness',
    readTime: '6 min read',
    date: 'March 02, 2024',
    excerpt: 'Recreate the VV Studio calm at home with candles, oils and our step-by-step unwind ritual.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
  },
];

// Blog image SEO from the on-page audit (shared by home + blog page).
export const BLOG_SEO: Record<string, { alt: string; title: string }> = {
  'blog-1': { alt: 'Skincare routine for glowing skin', title: 'Skincare Routine for Glowing Skin' },
  'blog-2': { alt: 'Hair care tips for healthy hair', title: 'Hair Care Tips for Healthy Hair' },
  'blog-3': { alt: 'Bridal beauty checklist for wedding preparation', title: 'Bridal Beauty Checklist' },
  'blog-4': { alt: 'Monsoon hair care and hair rescue guide', title: 'Monsoon Hair Rescue Guide' },
  'blog-5': { alt: 'Everyday makeup essentials and beauty tips', title: 'Everyday Makeup Essentials' },
  'blog-6': { alt: 'At-home glow night relaxation ritual', title: 'At-Home Glow Night Ritual' },
};

// Intrinsic dims for local assets (1200x750); remote Unsplash URLs omit dims.
export const BLOG_DIMS: Record<string, { width: number; height: number }> = {
  'blog-1': { width: 1200, height: 750 },
  'blog-2': { width: 1200, height: 750 },
  'blog-3': { width: 1200, height: 750 },
};

export const STATS_DATA = [
  { value: '10+', label: 'Years of Expertise' },
  { value: 'Thousands', label: 'Happy Clients' },
  { value: 'Premium', label: 'Beauty Experience' },
];

export const CONTACT_INFO = {
  address: '#8, 1st Floor, 24th Main, 5th Phase, JP Nagar, Bangalore 560078',
  phones: ['080-48531999', '8310782820'],
  email: 'support@vvstudio.in',
  website: 'www.vvstudio.in',
  hours: 'Tue - Sun: 10:00 AM - 8:00 PM (Monday Holiday)',
};

// Single source of truth for studio location — reuse everywhere
export const STUDIO_ADDRESS = CONTACT_INFO.address;

export const STUDIO_ADDRESS_SHORT =
  '#8, 1st Floor, 24th Main, 5th Phase, JP Nagar, Bangalore 560078';

export const STUDIO_ADDRESS_MULTILINE =
  '#8, 1st Floor, 24th Main\n5th Phase, JP Nagar,\nBangalore 560078';

export const STUDIO_MAP_COORDS = { lat: 12.9057, lng: 77.5858 };

export const STUDIO_MAP_EMBED_SRC = `https://maps.google.com/maps?q=${STUDIO_MAP_COORDS.lat},${STUDIO_MAP_COORDS.lng}&z=17&output=embed`;

export const STUDIO_FOOTER_MAP_EMBED_SRC = `https://maps.google.com/maps?q=${STUDIO_MAP_COORDS.lat},${STUDIO_MAP_COORDS.lng}&z=16&output=embed`;

export const getStudioDirectionsUrl = (address: string = STUDIO_ADDRESS) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

export const STUDIO_DIRECTIONS_URL = getStudioDirectionsUrl();
