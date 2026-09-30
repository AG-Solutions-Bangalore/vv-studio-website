import React from 'react';
import { Link } from 'react-router-dom';

export interface LogoProps {
  /** 'dark' = for dark backgrounds (white logo as-is); 'light' = for light backgrounds (darkened logo) */
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

const sizeClasses: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-14 sm:h-16',
};

export const Logo: React.FC<LogoProps> = ({
  theme = 'light',
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const isDark = theme === 'dark';

  return (
    <Link
      to="/"
      title="V V Studio | Luxury Salon | Female Salon | J P Nagar, Bengaluru"
      className={`inline-flex flex-col items-start gap-1 group transition-transform duration-200 hover:scale-[1.02] ${className}`}
      aria-label="VV Studio Home"
    >
      {/* Brand logo (optimized WebP). White artwork: darkened via filter on light backgrounds */}
      <img
        src="/logo.webp"
        alt="V V Studio luxury female salon logo"
        title="V V Studio Luxury Female Salon"
        width={480}
        height={232}
        className={`${sizeClasses[size]} w-auto drop-shadow-sm ${isDark ? '' : 'brightness-0'}`}
      />
      {showTagline && (
        <span
          className={`font-serif italic text-xs tracking-normal ${
            isDark ? 'text-white/70' : 'text-[#3D003D]/70'
          }`}
        >
          Adding care to your Beauty
        </span>
      )}
    </Link>
  );
};
