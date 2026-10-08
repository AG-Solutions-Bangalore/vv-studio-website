import React, { useMemo, useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Container } from '@/components/ui/Container';
import { GalleryLightbox } from '@/modules/home/components/GalleryLightbox';
import { GALLERY_DATA, GALLERY_SEO, GALLERY_DIMS, type GalleryItem } from '@/data/salonData';
import { useNativeInView } from '@/hooks/useNativeInView';

const ALL = 'All';

/**
 * Single gallery card — defers its <img> until the card nears the viewport
 * so off-screen media never contends with LCP bandwidth. The aspect-[3/4]
 * placeholder preserves layout, so gating causes zero CLS.
 */
const GalleryCard: React.FC<{ item: GalleryItem; onOpen: () => void }> = ({ item, onOpen }) => {
  const { ref, isInView } = useNativeInView<HTMLDivElement>("250px");
  return (
    <div
      ref={ref}
      onClick={onOpen}
      className="group relative aspect-[3/4] rounded-[12px] overflow-hidden bg-[#FAF0F6] border border-[#F1E4EE] shadow-[0_2px_14px_rgba(90,20,80,0.08)] hover:shadow-[0_10px_28px_rgba(90,20,80,0.14)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {isInView ? (
        <img
          src={item.image}
          alt={GALLERY_SEO[item.id]?.alt ?? `${item.title} at VV Studio`}
          title={GALLERY_SEO[item.id]?.title ?? `VV Studio ${item.title}`}
          width={GALLERY_DIMS[item.id]?.width}
          height={GALLERY_DIMS[item.id]?.height}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      ) : (
        <div className="w-full h-full animate-pulse bg-[#F3E5EE]" aria-hidden="true" />
      )}
    </div>
  );
};

/**
 * Full gallery collection — replicates the home GallerySection card design
 * (same heading, same portrait cards, same lightbox) as a filterable grid.
 */
export const GalleryGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(GALLERY_DATA.map((g) => g.category)))],
    [],
  );
  const visibleItems = useMemo(
    () =>
      activeCategory === ALL
        ? GALLERY_DATA
        : GALLERY_DATA.filter((g) => g.category === activeCategory),
    [activeCategory],
  );

  return (
    <section id="collection" className="py-10 sm:py-14 bg-[#FCFCFC] relative">
      <Container>
        <SectionHeading
          eyebrow="OUR GALLERY"
          title="Moments of Beauty"
          subtitle="Signature hair artistry, glowing skin rituals, bridal couture and serene studio moments — captured at VV Studio, JP Nagar."
        />

        {/* Category filter */}
        <div
          className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-6 sm:mb-8"
          role="group"
          aria-label="Filter gallery by category"
        >
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setLightboxIndex(null);
                }}
                aria-pressed={active}
                className={`rounded-full px-4 sm:px-5 py-2 text-xs sm:text-[13px] font-semibold tracking-wide transition-all duration-300 cursor-pointer min-h-[36px] ${
                  active
                    ? 'bg-[#D91A8A] hover:bg-[#A80086] text-white shadow-[0_6px_18px_rgba(232,50,157,0.45)]'
                    : 'bg-white text-[#5E525C] border border-[#E8DCE5] hover:border-[#F06AB9] hover:text-[#A80086]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Cards — same design as the home gallery carousel cards */}
        <div
          key={activeCategory}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 animate-in fade-in duration-300"
        >
          {visibleItems.map((item, i) => (
            <GalleryCard key={item.id} item={item} onOpen={() => setLightboxIndex(i)} />
          ))}
        </div>
      </Container>

      {lightboxIndex !== null && (
        <GalleryLightbox
          items={visibleItems}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
};
