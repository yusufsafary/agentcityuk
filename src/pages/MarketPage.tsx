import { ArrowLeft, Store } from 'lucide-react';
import { CityArt } from '@/components/CityArt';
import type { Route } from '@/hooks/useHashRoute';
import { useLanguage } from '@/i18n/useLanguage';

interface MarketPageProps {
  navigate: (route: Route) => void;
}

export function MarketPage({ navigate }: MarketPageProps) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 pt-28 pb-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:pt-36">
      <div className="flex flex-col gap-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300">
          <Store className="h-3.5 w-3.5" />
          {t.common.comingSoon}
        </span>
        <h1 className="font-display text-3xl font-semibold leading-[1.15] text-white sm:text-4xl lg:text-5xl">{t.market.title}</h1>
        <p className="text-base leading-relaxed text-slate-300 sm:text-lg">{t.market.subtitle}</p>
        <p className="text-sm leading-relaxed text-slate-400 sm:text-base">{t.market.body}</p>
        <ul className="flex flex-col gap-3">
          {t.market.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              {feature}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0 });
          }}
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-amber-300 transition-colors hover:text-amber-200"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.market.back}
        </button>
      </div>
      <div className="relative">
        <CityArt seed={4} className="aspect-[4/3] w-full opacity-70 grayscale-[30%]" label={t.market.title} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-slate-950/80 px-6 py-3 font-display text-lg font-semibold text-white backdrop-blur">
            {t.common.comingSoon}
          </span>
        </div>
      </div>
    </div>
  );
}
