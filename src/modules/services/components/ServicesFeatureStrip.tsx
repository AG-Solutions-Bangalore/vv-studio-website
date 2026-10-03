import React from 'react';
import { Flower2, Gem, Heart, Users } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export const ServicesFeatureStrip: React.FC = () => {
  const features = [
    {
      id: 'professionals',
      title: 'Expert Professionals',
      subtitle: 'Trained and certified experts',
      icon: <Flower2 className="w-7 h-7 text-[#B3127A] stroke-[1.5]" />,
    },
    {
      id: 'products',
      title: 'Premium Products',
      subtitle: 'Safe and high-quality brands',
      icon: <Gem className="w-7 h-7 text-[#B3127A] stroke-[1.5]" />,
    },
    {
      id: 'hygienic',
      title: 'Hygienic & Safe',
      subtitle: 'Clean and sanitized environment',
      icon: <Heart className="w-7 h-7 text-[#B3127A] stroke-[1.5]" />,
    },
    {
      id: 'care',
      title: 'Personalized Care',
      subtitle: 'Tailored to your unique needs',
      icon: <Users className="w-7 h-7 text-[#B3127A] stroke-[1.5]" />,
    },
  ];

  return (
    <section aria-label="Why choose VV Studio" className="relative z-20 bg-white border-y border-[#F3E5EE] shadow-[0_4px_20px_rgba(80,0,70,0.03)] py-6 sm:py-7">
      <Container>
        <h2 className="sr-only">Why choose VV Studio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#F3E5EE] items-center">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center text-center px-4 py-3 sm:py-2 first:pt-0 last:pb-0"
            >
              {/* Pink outline icon */}
              <div className="mb-2 flex items-center justify-center">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-[14px] sm:text-[15px] font-bold text-[#2C182A] tracking-tight">
                {feature.title}
              </h3>

              {/* Subtitle */}
              <p className="text-[12px] sm:text-[12.5px] text-[#766A73] mt-0.5 leading-snug">
                {feature.subtitle}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
