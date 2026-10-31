import { ArrowRight, Store } from 'lucide-react';
import { Marquee } from '@/components/Marquee';
import type { Route } from '@/hooks/useHashRoute';
import { useLanguage } from '@/i18n/useLanguage';

interface MarketTeaserProps {
  navigate: (route: Route) => void;
}

export function MarketTeaser({ navigate }: MarketTeaserProps) {
  const { t } = useLanguage();

  return (
    <section className="pb-16 lg:pb-24">
      <Marquee text={`Agent City Market · ${t.common.comingSoon}`} />
      <div className="mx-auto w-full max-w-6xl px-5 pt-10 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-amber-300/25 bg-gradient-to-br from-amber-400/[0.08] via-slate-900 to-slate-950 p-6 sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl"
          />
          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300">
                <Store className="h-3.5 w-3.5" />
                {t.common.comingSoon}
              </span>
              <h2 className="mt-4 font-display text-2xl font-semibold text-white sm:text-3xl">
                {t.home.marketTeaser.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
                {t.home.marketTeaser.body}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/market')}
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-400/20 transition-all hover:-translate-y-0.5 hover:bg-amber-300"
            >
              {t.home.marketTeaser.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
