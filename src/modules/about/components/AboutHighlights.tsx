import React from 'react';
import { Flower2, Gem, Heart, Users } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export const AboutHighlights: React.FC = () => {
  const highlights = [
    {
      id: 'professionals',
      title: 'Expert Professionals',
      subtitle: 'Trained and experienced beauty experts',
      icon: <Flower2 className="w-8 h-8 sm:w-9 sm:h-9 text-[#B3127A] stroke-[1.3]" />,
    },
    {
      id: 'products',
      title: 'Premium Products',
      subtitle: 'High-quality, safe and effective products',
      icon: <Gem className="w-8 h-8 sm:w-9 sm:h-9 text-[#B3127A] stroke-[1.3]" />,
    },
    {
      id: 'hygienic',
      title: 'Hygienic & Safe',
      subtitle: 'Clean, comfortable and sanitized environment',
      icon: <Heart className="w-8 h-8 sm:w-9 sm:h-9 text-[#B3127A] stroke-[1.3]" />,
    },
    {
      id: 'care',
      title: 'Personalized Care',
      subtitle: 'Tailored treatments for your unique needs',
      icon: <Users className="w-8 h-8 sm:w-9 sm:h-9 text-[#B3127A] stroke-[1.3]" />,
    },
  ];

  return (
    <section className="relative bg-white pb-10 sm:pb-14 lg:pb-16">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 lg:gap-y-0">
          {highlights.map((item, i) => (
            <div
              key={item.id}
              className={`flex flex-col items-center text-center px-3 sm:px-6 ${
                i > 0 ? 'lg:border-l lg:border-[#F3D9E7]' : ''
              } ${i === 1 || i === 3 ? 'max-lg:border-l max-lg:border-[#F3D9E7]' : ''}`}
            >
              <div className="mb-2.5 sm:mb-3 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-[13px] sm:text-[15px] font-bold text-[#2C0A4A] tracking-tight">
                {item.title}
              </h3>
              <p className="text-[11.5px] sm:text-[13px] text-[#6E6470] mt-1 leading-snug max-w-[220px]">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
