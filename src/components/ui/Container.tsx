import React from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | 'full' | string;
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  '8xl': 'max-w-8xl',
  full: 'max-w-full',
};

export const Container: React.FC<ContainerProps> = ({
  as: Component = 'div',
  size = '8xl',
  className,
  children,
  ...props
}) => {
  const isDefaultWide = size === '8xl';
  return (
    <Component
      className={cn(
        'mx-auto',
        isDefaultWide ? 'px-5 sm:px-6 lg:px-20 max-w-8xl' : 'px-4 sm:px-6 lg:px-8',
        !isDefaultWide && (sizeClasses[size] || (size.startsWith('max-w-') ? size : `max-w-${size}`)),
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
