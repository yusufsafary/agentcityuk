import { useEffect, useState } from 'react';
import { ArrowLeft, Lock, Store } from 'lucide-react';
import { CityArt } from '@/components/CityArt';
import { CityPhoto } from '@/components/CityPhoto';
import { Marquee } from '@/components/Marquee';
import { Reveal } from '@/components/Reveal';
import { CONTRACT } from '@/config/contract';
import type { Route } from '@/hooks/useHashRoute';
import { useLanguage } from '@/i18n/useLanguage';
import { readMintState } from '@/lib/chain';

interface MarketPageProps {
  navigate: (route: Route) => void;
}

const LOCKED_SEEDS = [21, 22, 23, 24];

export function MarketPage({ navigate }: MarketPageProps) {
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
    <div className="flex flex-col">
      <div className="mt-16">
        <Marquee text={`Agent City Market · ${t.common.comingSoon}`} />
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 pt-12 pb-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:pt-16">
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

          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
            <p className="text-sm font-semibold text-white">{t.market.progressTitle}</p>
            <p className="font-display text-2xl font-semibold text-white">
              {minted === null ? '—' : minted.toLocaleString('en-US')}
              <span className="text-base text-slate-400">
                {' '}
                / {CONTRACT.totalSupply.toLocaleString('en-US')}
              </span>
            </p>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-white/10"
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
            <p className="text-sm leading-relaxed text-slate-400">{t.market.progressNote}</p>
          </div>

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
        <CityPhoto
          src="https://images.pexels.com/photos/7511220/pexels-photo-7511220.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt={t.market.title}
          className="aspect-[4/3] w-full"
        >
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px]">
            <span className="rounded-full bg-slate-950/80 px-6 py-3 font-display text-lg font-semibold text-white ring-1 ring-white/10 backdrop-blur">
              {t.common.comingSoon}
            </span>
          </div>
        </CityPhoto>
      </div>

      <Reveal>
        <div className="mx-auto w-full max-w-6xl px-5 pb-20 lg:px-8">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {LOCKED_SEEDS.map((seed) => (
              <div
                key={seed}
                className="group relative overflow-hidden rounded-2xl border border-white/10"
              >
                <CityArt seed={seed} className="aspect-square w-full opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-90" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/45 text-slate-200">
                  <Lock className="h-5 w-5" />
                  <span className="px-3 text-center text-xs font-medium">{t.market.locked}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
