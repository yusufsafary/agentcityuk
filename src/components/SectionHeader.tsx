import type { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  children?: ReactNode;
}

export function SectionHeader({ eyebrow, title, subtitle, align = 'left', children }: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';
  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">{eyebrow}</span>
      )}
      <h1 className="font-display text-3xl font-semibold leading-[1.15] text-white sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      {subtitle && <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">{subtitle}</p>}
      {children}
    </div>
  );
}
