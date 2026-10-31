import { useState } from 'react';
import { ArrowRight, Coins, Eye, Layers, Wallet } from 'lucide-react';
import { CityPhoto } from '@/components/CityPhoto';
import { LiveMintSection } from '@/components/LiveMintSection';
import { MarketSection } from '@/components/MarketSection';
import { Reveal } from '@/components/Reveal';
import { SectionHeader } from '@/components/SectionHeader';
import { CONTRACT } from '@/config/contract';
import type { Route } from '@/hooks/useHashRoute';
import { useLanguage } from '@/i18n/useLanguage';

interface HomePageProps {
  navigate: (route: Route) => void;
}

export function HomePage({ navigate }: HomePageProps) {
  const { t } = useLanguage();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onHeroMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
    });
  };

  const stats = [
    { icon: Layers, label: t.home.stats.supply, value: CONTRACT.totalSupply.toLocaleString('en-US') },
    { icon: Wallet, label: t.home.stats.perWallet, value: String(CONTRACT.maxPerWallet) },
    { icon: Eye, label: t.home.stats.reveal, value: t.home.stats.revealValue },
    { icon: Coins, label: t.home.stats.fee, value: t.home.stats.feeValue },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.12),transparent_60%)]"
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
          <div className="flex flex-col gap-8">
            <SectionHeader eyebrow={t.home.eyebrow} title={t.home.title} subtitle={t.home.subtitle} />
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/mint')}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-400/20 transition-all hover:-translate-y-0.5 hover:bg-amber-300"
              >
                {t.home.ctaPrimary}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/concept')}
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                {t.home.ctaSecondary}
              </button>
            </div>
          </div>
          <div
            className="relative"
            onPointerMove={onHeroMove}
            onPointerLeave={() => setTilt({ x: 0, y: 0 })}
          >
            <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2rem] bg-amber-400/10 blur-3xl" />
            <div
              style={{
                transform: `perspective(1000px) rotateX(${(-tilt.y * 5).toFixed(2)}deg) rotateY(${(tilt.x * 5).toFixed(2)}deg)`,
                transition: 'transform 0.3s ease-out',
              }}
            >
              <CityPhoto
              src="https://images.pexels.com/photos/35400651/pexels-photo-35400651.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt={t.home.heroImageAlt}
              className="aspect-[4/3] w-full shadow-2xl shadow-black/60"
            >
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-2xl bg-slate-950/70 p-4 ring-1 ring-white/10 backdrop-blur-md">
                <div>
                  <p className="text-xs uppercase tracking-widest text-amber-300">{t.home.sampleCity}</p>
                  <p className="mt-1 font-display text-lg font-semibold text-white">Agent City #0001</p>
                </div>
                <span className="flex items-center gap-2 text-xs font-medium text-emerald-300">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  {t.home.agentOnline}
                </span>
              </div>
              </CityPhoto>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-3 px-5 lg:mt-20 lg:grid-cols-4 lg:gap-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm sm:p-5">
              <s.icon className="h-5 w-5 text-amber-300" />
              <p className="mt-3 font-display text-xl font-semibold text-white sm:text-2xl">{s.value}</p>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Reveal>
        <LiveMintSection navigate={navigate} />
      </Reveal>

      <Reveal>
        <MarketSection navigate={navigate} />
      </Reveal>
    </div>
  );
}
