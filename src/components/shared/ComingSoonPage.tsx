import React, { Suspense, lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, BookOpen, Heart, Sparkle } from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Container } from '@/components/ui/Container';
import { useSEO, type SEO_CONFIG } from '@/seo/seo';

// Heavy booking form: code-split and never mounted until first open.
const BookingModal = lazy(() =>
  import('@/components/shared/BookingModal').then((m) => ({
    default: m.BookingModal,
  })),
);

export interface PreviewTopic {
  title: string;
  category: string;
  description: string;
}

export interface ComingSoonPageProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  sectionEyebrow?: string;
  sectionTitle?: string;
  statusLabel?: string;
  seoKey?: keyof typeof SEO_CONFIG;
  previewTopics?: PreviewTopic[];
}

const PRESETS: Record<
  string,
  {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    sectionEyebrow: string;
    sectionTitle: string;
    statusLabel: string;
    previewTopics: PreviewTopic[];
  }
> = {
  blog: {
    badge: 'Coming Soon',
    title: 'Beauty & Wellness Journal',
    subtitle: 'Something Glamorous Is in the Works',
    description:
      'Our senior stylists, skin specialists, and bridal artists in JP Nagar are crafting expert beauty guides, haircare secrets, and wellness rituals to inspire your glow. Stay tuned for our upcoming articles.',
    sectionEyebrow: 'WHAT TO EXPECT',
    sectionTitle: 'Curated Beauty Insights',
    statusLabel: 'Article In Production',
    previewTopics: [
      {
        category: 'Skincare & Facials',
        title: 'Glowing Skin Rituals & Treatments',
        description:
          'In-depth guides on facial therapies, dewy skin prep, and personalized dermatological self-care.',
      },
      {
        category: 'Hair Artistry',
        title: 'Balayage, Styling & Scalp Health',
        description:
          'Professional haircare advice from senior stylists on preserving color, texture, and hair volume.',
      },
      {
        category: 'Bridal & Makeovers',
        title: 'The Ultimate Wedding Beauty Checklist',
        description:
          'Month-by-month bridal countdowns, trend breakdowns, and pre-bridal rejuvenation plans.',
      },
    ],
  },
  gallery: {
    badge: 'Coming Soon',
    title: 'Studio Visual Gallery',
    subtitle: 'A Curated Showcase of Elegance',
    description:
      'We are assembling a high-definition visual portfolio showcasing signature bridal makeovers, stunning hair coloring transformations, and the serene luxury salon ambience of VV Studio in JP Nagar.',
    sectionEyebrow: 'GALLERY HIGHLIGHTS',
    sectionTitle: 'Collections in Curation',
    statusLabel: 'Portfolio In Curation',
    previewTopics: [
      {
        category: 'Bridal Transformations',
        title: 'Wedding Day & Reception Looks',
        description:
          'Exquisite high-definition makeup, traditional bridal draping, and contemporary celebration hair artistry.',
      },
      {
        category: 'Hair Color & Styling',
        title: 'Balayage, Gloss & Textured Cuts',
        description:
          'Before & after hair makeovers, custom dimensional balayage highlights, and volume blowouts.',
      },
      {
        category: 'Salon & Spa Ambience',
        title: 'Luxury Suites & Treatment Spaces',
        description:
          'A glimpse into our tranquil treatment rooms, dedicated manicure lounge, and private styling stations.',
      },
    ],
  },
};

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  seoKey = 'blog',
  badge,
  title,
  subtitle,
  description,
  sectionEyebrow,
  sectionTitle,
  statusLabel,
  previewTopics,
}) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const preset = PRESETS[seoKey] ?? PRESETS.blog;
  const resolvedBadge = badge ?? preset.badge;
  const resolvedTitle = title ?? preset.title;
  const resolvedSubtitle = subtitle ?? preset.subtitle;
  const resolvedDescription = description ?? preset.description;
  const resolvedSectionEyebrow = sectionEyebrow ?? preset.sectionEyebrow;
  const resolvedSectionTitle = sectionTitle ?? preset.sectionTitle;
  const resolvedStatusLabel = statusLabel ?? preset.statusLabel;
  const resolvedTopics = previewTopics ?? preset.previewTopics;

  useSEO(seoKey);

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#40363F] flex flex-col antialiased selection:bg-[#D91A8A] selection:text-white">
      {/* Primary Header */}
      <Header onOpenBooking={() => setIsBookingOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Luxury Hero Banner */}
        <section
          className="relative bg-[#3D003D] text-white overflow-hidden pt-[112px] lg:pt-[128px] pb-16 lg:pb-24 flex flex-col items-center justify-center text-center"
          style={{
            background: `radial-gradient(circle at 50% 30%, rgba(217, 26, 138, 0.4) 0%, rgba(104, 0, 95, 0.28) 38%, transparent 70%),
                         linear-gradient(135deg, #240024 0%, #350035 25%, #4A0043 55%, #620055 80%, #30002E 100%)`,
          }}
        >
          {/* Subtle Ambient Background Watermarks */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            aria-hidden="true"
            style={{
              backgroundImage: `radial-gradient(circle at 15% 40%, rgba(255, 255, 255, 0.25) 0%, transparent 40%),
                                radial-gradient(circle at 85% 60%, rgba(217, 26, 138, 0.35) 0%, transparent 50%)`,
            }}
          />

          <Container className="relative z-10 max-w-3xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F8C1DE] text-xs font-semibold tracking-widest uppercase mb-5 shadow-[0_4px_16px_rgba(0,0,0,0.2)] animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-[#F06AB9]" />
              <span>{resolvedBadge}</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-semibold text-white tracking-tight leading-[1.14] mb-4">
              {resolvedTitle}
            </h1>

            {/* Script Accent Subtitle */}
            <p className="font-script text-2xl sm:text-3xl md:text-4xl text-[#F8C1DE] mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
              {resolvedSubtitle}
            </p>

            {/* Body Copy */}
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl mx-auto mb-8 font-light">
              {resolvedDescription}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="inline-flex items-center justify-center gap-2 py-3 sm:py-3.5 px-7 rounded-full bg-[#E8329D] hover:bg-[#D91A8A] text-white text-sm font-semibold tracking-wide transition-all duration-300 shadow-[0_8px_24px_rgba(232,50,157,0.5)] hover:shadow-[0_12px_28px_rgba(232,50,157,0.65)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Book an Appointment</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>

              <Link
                to="/services"
                title="VV Studio Beauty & Spa Services"
                className="inline-flex items-center justify-center gap-2 py-3 sm:py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-sm font-semibold tracking-wide backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <BookOpen className="w-4 h-4 text-[#F8C1DE]" />
                <span>Explore Services</span>
              </Link>

              <Link
                to="/"
                title="VV Studio Luxury Salon & Spa"
                className="inline-flex items-center justify-center gap-2 py-3 sm:py-3.5 px-5 rounded-full text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </Container>
        </section>

        {/* Topics Preview / Teaser Section */}
        {resolvedTopics && resolvedTopics.length > 0 && (
          <section className="py-14 sm:py-18 bg-[#FAF6F9]">
            <Container className="max-w-5xl">
              <div className="text-center max-w-xl mx-auto mb-10">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#D91A8A] mb-2">
                  {resolvedSectionEyebrow}
                </p>
                <h2 className="text-2xl sm:text-3xl font-display font-medium text-[#2D0A2E]">
                  {resolvedSectionTitle}
                </h2>
                <div className="w-12 h-0.5 bg-[#D91A8A] mx-auto mt-3 rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
                {resolvedTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 sm:p-7 border border-[#F1E4EE] shadow-[0_4px_20px_rgba(61,0,61,0.05)] hover:shadow-[0_10px_30px_rgba(61,0,61,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0F6] text-[#D91A8A] text-xs font-semibold mb-4">
                        <Sparkle className="w-3 h-3 fill-current" />
                        <span>{topic.category}</span>
                      </div>
                      <h3 className="font-display font-semibold text-lg sm:text-xl text-[#2D0A2E] leading-snug mb-2.5">
                        {topic.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5E525C] leading-relaxed">
                        {topic.description}
                      </p>
                    </div>

                    <div className="pt-5 mt-5 border-t border-[#F5EAF2] flex items-center justify-between text-xs text-[#9E8B9A] font-medium">
                      <span>{resolvedStatusLabel}</span>
                      <Heart className="w-3.5 h-3.5 text-[#D91A8A]" />
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        )}
      </main>

      {/* Signature Footer */}
      <Footer />

      {/* Booking Modal — gated: null until first open + code-split. */}
      {isBookingOpen && (
        <Suspense fallback={null}>
          <BookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
};
