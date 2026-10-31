import { useEffect, useState } from 'react';
import { ArrowRight, Bot } from 'lucide-react';
import { CONTRACT } from '@/config/contract';
import type { Route } from '@/hooks/useHashRoute';
import { useLanguage } from '@/i18n/useLanguage';
import { readMintState } from '@/lib/chain';

interface LiveMintSectionProps {
  navigate: (route: Route) => void;
}

export function LiveMintSection({ navigate }: LiveMintSectionProps) {
  const { t } = useLanguage();
  const [minted, setMinted] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const state = await readMintState();
        if (!cancelled) {
          setMinted(state.minted);
          setOpen(state.open);
        }
      } catch {
        // keep the last known values; retried on the next tick
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
    <section className="mx-auto w-full max-w-6xl px-5 pb-16 lg:px-8 lg:pb-24">
      <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            {t.home.liveMint.title}
          </h2>
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3.5 py-1.5 text-xs font-medium text-slate-200">
            <span
              className={`h-2 w-2 rounded-full ${open ? 'animate-pulse bg-emerald-400' : 'bg-amber-300'}`}
              aria-hidden="true"
            />
            {open === null ? t.mint.syncing : open ? t.mint.statusLive : t.mint.statusClosed}
          </span>
        </div>

        <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          {t.home.liveMint.body}
        </p>

        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">{t.mint.progress}</p>
          <p className="mt-2 font-display text-[26px] font-semibold text-white sm:text-3xl">
            {minted === null ? '—' : minted.toLocaleString('en-US')}
            <span className="text-lg text-slate-400">
              {' '}
              {t.mint.of} {CONTRACT.totalSupply.toLocaleString('en-US')}
            </span>
          </p>
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
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-300">
            <Bot className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
            <span>
              {t.mint.limit}. {t.mint.freeNote}
            </span>
          </p>
          <button
            type="button"
            onClick={() => navigate('/mint')}
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-300"
          >
            {t.home.liveMint.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
