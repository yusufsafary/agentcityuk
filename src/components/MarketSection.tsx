import { useEffect, useState } from 'react';
import { ArrowRight, Lock, Store } from 'lucide-react';
import { CityArt } from '@/components/CityArt';
import { Marquee } from '@/components/Marquee';
import { CONTRACT } from '@/config/contract';
import type { Route } from '@/hooks/useHashRoute';
import { useLanguage } from '@/i18n/useLanguage';
import { readMintState } from '@/lib/chain';

interface MarketSectionProps {
  navigate: (route: Route) => void;
}

const LOCKED_SEEDS = [21, 22, 23, 24];

export function MarketSection({ navigate }: MarketSectionProps) {
  const { t } = useLanguage();
  const [minted, setMinted] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const state = await readMintState();
        if (!cancelled) setMinted(state.minted);
      } catch {
        // keep the last known value; retried on the next tick
      }
    };
    void load();
    const timer = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const progress = minted === null ? 0 : (minted / CONTRACT.totalSupply) * 100;

  return (
    <section className="pb-16 lg:pb-24">
      <Marquee text={`Agent City Market · ${t.common.comingSoon}`} />
      <div className="mx-auto w-full max-w-6xl px-5 pt-10 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-amber-300/25 bg-gradient-to-br from-amber-400/[0.08] via-slate-900 to-slate-950 p-6 sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl"
          />
          <div className="relative flex flex-col gap-8">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300">
                  <Store className="h-3.5 w-3.5" />
                  {t.common.comingSoon}
                </span>
                <h2 className="mt-4 font-display text-2xl font-semibold text-white sm:text-3xl">
                  {t.home.marketTeaser.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
                  {t.market.body}
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

            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-white">{t.market.progressTitle}</p>
                <p className="font-display text-xl font-semibold text-white">
                  {minted === null ? '—' : minted.toLocaleString('en-US')}
                  <span className="text-sm text-slate-400">
                    {' '}
                    / {CONTRACT.totalSupply.toLocaleString('en-US')}
                  </span>
                </p>
              </div>
              <div
                className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-valuenow={minted ?? 0}
                aria-valuemin={0}
                aria-valuemax={CONTRACT.totalSupply}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{t.market.progressNote}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              {LOCKED_SEEDS.map((seed) => (
                <div
                  key={seed}
                  className="group relative overflow-hidden rounded-2xl border border-white/10"
                >
                  <CityArt
                    seed={seed}
                    className="aspect-square w-full opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/45 text-slate-200">
                    <Lock className="h-5 w-5" />
                    <span className="px-3 text-center text-xs font-medium">{t.market.locked}</span>
                  </div>
                </div>
              ))}
            </div>

            <ul className="flex flex-wrap gap-2">
              {t.market.features.map((feature) => (
                <li
                  key={feature}
                  className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-medium text-slate-200 sm:text-sm"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
