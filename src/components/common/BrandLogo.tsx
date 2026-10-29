import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  asLink?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
  asLink = true,
}) => {
  const dimensions = {
    sm: { box: 'w-9 h-9', img: 'w-9 h-9', text: 'text-base', sub: 'text-[9px]' },
    md: { box: 'w-11 h-11', img: 'w-11 h-11', text: 'text-lg', sub: 'text-[10px]' },
    lg: { box: 'w-16 h-16', img: 'w-16 h-16', text: 'text-2xl', sub: 'text-xs' },
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Official Company Logo from public/psi-image.jpeg */}
      <div
        className={`${dimensions.box} rounded-2xl overflow-hidden border-2 border-primary-400/60 shadow-md bg-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-primary-400 group-hover:shadow-glow`}
      >
        <img
          src="/psi-image.jpeg"
          alt="Psicólogos La Plata"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <span
            className={`${dimensions.text} font-display font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors`}
          >
            Psicólogos La Plata
          </span>
          <span
            className={`${dimensions.sub} font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase mt-0.5`}
          >
            Encontrá tu psicólogo acá.
          </span>
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" aria-label="Volver al inicio de Psicólogos La Plata">
        {content}
      </Link>
    );
  }

  return content;
};
