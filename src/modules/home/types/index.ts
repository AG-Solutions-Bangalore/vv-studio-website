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

// API entity types owned by the home module (see `./api/*` + docs/API.md).
export type {
  Testimonial,
  TestimonialResponse,
  Client,
  ClientResponse,
  SitemapEntry,
  SitemapResponse,
  FaqItem,
  FaqResponse,
  NewsletterPayload,
  NewsletterResponse,
} from '@/lib/api/types';
