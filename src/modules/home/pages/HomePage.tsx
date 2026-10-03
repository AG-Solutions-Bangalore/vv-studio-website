import React, { Suspense, lazy, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "../components/Hero";
import type { ServiceItem } from "@/data/salonData";
import { useSEO, type SEO_CONFIG } from "@/seo/seo";

// Below-fold sections: lazy, revealed together in one Suspense so the
// critical path ships Hero only.
const CategoryNav = lazy(() =>
  import("../components/CategoryNav").then((m) => ({ default: m.CategoryNav })),
);
const AboutSection = lazy(() =>
  import("../components/AboutSection").then((m) => ({
    default: m.AboutSection,
  })),
);
const ServicesSection = lazy(() =>
  import("../components/ServicesSection").then((m) => ({
    default: m.ServicesSection,
  })),
);
const CTABanner = lazy(() =>
  import("../components/CTABanner").then((m) => ({ default: m.CTABanner })),
);
const GallerySection = lazy(() =>
  import("../components/GallerySection").then((m) => ({
    default: m.GallerySection,
  })),
);
const TestimonialsSection = lazy(() =>
  import("../components/TestimonialsSection").then((m) => ({
    default: m.TestimonialsSection,
  })),
);
const BlogSection = lazy(() =>
  import("../components/BlogSection").then((m) => ({ default: m.BlogSection })),
);
// Featured blogs rail (GET /getFeaturedBlogs) — same BlogCard + carousel
// look as the front-blogs rail, hidden until the API has data.
const FeaturedBlogsRail = lazy(() =>
  import("@/modules/blog/components/FeaturedBlogsRail").then((m) => ({
    default: m.FeaturedBlogsRail,
  })),
);
const SpecialOffersSection = lazy(() =>
  import("../components/SpecialOffersSection").then((m) => ({
    default: m.SpecialOffersSection,
  })),
);
// Page FAQs (GET /getFAQBySlug/home) — hidden until the API has data.
const FaqSection = lazy(() =>
  import("@/modules/faq").then((m) => ({
    default: m.FaqSection,
  })),
);
// Heavy booking form: code-split and never mounted until first open.
const BookingModal = lazy(() =>
  import("@/components/shared/BookingModal").then((m) => ({
    default: m.BookingModal,
  })),
);

interface HomePageProps {
  seoKey?: keyof typeof SEO_CONFIG;
  scrollToId?: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  seoKey = "home",
  scrollToId,
}) => {
  const location = useLocation();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null,
  );
  const [activeCategory, setActiveCategory] = useState<string>("skin-facials");
  // Below-fold tree mounts only after window load (LCP resource settled):
  // keeps font/image/JS contention off the LCP path. Safety-capped at 4s.
  // NOTE: initial state is ALWAYS false so client hydration matches the SSR
  // HTML exactly (SSR has no document). Reading document.readyState in the
  // initializer races with the load event and causes React hydration
  // mismatch (#418) + a full client re-render when it fires early.
  const [belowFoldReady, setBelowFoldReady] = useState<boolean>(false);

  useSEO(seoKey);

  useEffect(() => {
    if (belowFoldReady) return;
    // Post-hydration check: if load already fired before hydration
    // finished, mount on the next tick (plain re-render, never a mismatch).
    if (document.readyState === "complete") {
      const t = window.setTimeout(() => setBelowFoldReady(true), 0);
      return () => window.clearTimeout(t);
    }
    const onLoad = () => setBelowFoldReady(true);
    window.addEventListener("load", onLoad, { once: true });
    const t = window.setTimeout(() => setBelowFoldReady(true), 4000);
    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(t);
    };
  }, [belowFoldReady]);

  useEffect(() => {
    const targetId = scrollToId || (location.hash ? location.hash.replace("#", "") : null);
    if (targetId && belowFoldReady) {
      // Let the page paint first so the anchor section exists.
      const t = window.setTimeout(() => {
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 150);
      return () => window.clearTimeout(t);
    }
  }, [scrollToId, location.hash, belowFoldReady]);

  const handleOpenBooking = (service?: ServiceItem) => {
    if (service) {
      setSelectedService(service);
    }
    setIsBookingOpen(true);
  };

  const handleExploreServices = () => {
    const el = document.getElementById("services");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#40363F] flex flex-col antialiased selection:bg-[#D91A8A] selection:text-white">
      {/* Top Header */}
      <Header onOpenBooking={() => handleOpenBooking()} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section — eager (LCP) */}
        <Hero
          onOpenBooking={() => handleOpenBooking()}
          onExploreServices={handleExploreServices}
        />

        {/* Everything below the fold — one Suspense, null fallback (invisible area).
            Mounts after window load so its fonts/images/JS never contend with LCP.
            The reserve min-height keeps the page taller than any viewport from
            first paint (SSG included): lazy sections stream in below the fold
            and the footer never sits inside the viewport while content above
            it expands — otherwise desktop CLS blows out (~0.5). Static
            sections always exceed the reserve once loaded, so no blank
            remains in the steady state. */}
        <div className="min-h-[600px] lg:min-h-[900px]">
          <Suspense fallback={null}>
            {belowFoldReady && (
            <>
              {/* Category Ribbon */}
              <CategoryNav
                activeCategory={activeCategory}
                onSelectCategory={handleSelectCategory}
              />

              {/* About Section */}
              <AboutSection />

              {/* Services Section */}
              <ServicesSection
                onSelectService={(service) => handleOpenBooking(service)}
              />

              {/* Special Offers Section — directly follows Our Services */}
              <SpecialOffersSection
                onOpenBooking={(service) => handleOpenBooking(service)}
              />

              {/* Mid-page Promotional CTA Banner */}
              <CTABanner onOpenBooking={() => handleOpenBooking()} />

              {/* Gallery Section */}
              <GallerySection />

              {/* Featured blogs (GET /getFeaturedBlogs) — same card as front rail, hidden when empty */}
              <FeaturedBlogsRail />

              {/* Front blogs rail (GET /getFrontBlogs) — hidden when empty */}
              <BlogSection />

              {/* FAQs — renders only when the API returns items */}
              <FaqSection slug="home" />

              {/* Testimonials (GET /getTestimonial/home) — renders only when API returns items */}
              <TestimonialsSection
                slug="home"
                onOpenBooking={() => handleOpenBooking()}
              />
              </>
            )}
          </Suspense>
        </div>
      </main>

      {/* Dark Plum Footer — below fold, joins the post-load tree. */}
      {belowFoldReady && <Footer />}

      {/* Interactive Booking Modal — gated: null until first open + code-split. */}
      {isBookingOpen && (
        <Suspense fallback={null}>
          <BookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            initialService={selectedService}
          />
        </Suspense>
      )}
    </div>
  );
};
