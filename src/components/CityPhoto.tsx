import type { ReactNode } from 'react';

interface CityPhotoProps {
  src: string;
  alt: string;
  className?: string;
  children?: ReactNode;
}

export function CityPhoto({ src, alt, className = '', children }: CityPhotoProps) {
  return (
    <figure className={`relative overflow-hidden rounded-3xl ring-1 ring-white/10 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-105"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/10" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-transparent" />
      {children}
    </figure>
  );
}
