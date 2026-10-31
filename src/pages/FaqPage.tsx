import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { useLanguage } from '@/i18n/useLanguage';

export function FaqPage() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-5 pt-28 pb-20 lg:px-8 lg:pt-36">
      <SectionHeader eyebrow={t.nav.faq} title={t.faq.title} subtitle={t.faq.subtitle} />

      <div className="flex flex-col gap-3">
        {t.faq.items.map((item, i) => {
          const isOpen = openIndex === i;
          const panelId = `faq-panel-${i}`;
          return (
            <div
              key={item.q}
              className={`overflow-hidden rounded-2xl border transition-colors ${
                isOpen ? 'border-amber-300/30 bg-slate-900' : 'border-white/10 bg-slate-900/60'
              }`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
              >
                <span className="text-base font-semibold text-white">{item.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-amber-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                id={panelId}
                role="region"
                className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-slate-300 sm:px-6">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
