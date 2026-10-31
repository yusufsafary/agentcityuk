import { CheckCircle2, CircleDashed, Clock } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { useLanguage } from '@/i18n/useLanguage';

const STATUS_ICONS = [CheckCircle2, Clock, CircleDashed, CircleDashed];

export function RoadmapPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-5 pt-28 pb-20 lg:px-8 lg:pt-36">
      <SectionHeader eyebrow={t.nav.roadmap} title={t.roadmap.title} subtitle={t.roadmap.subtitle} />

      <ol className="relative flex flex-col gap-6 border-l border-white/10 pl-6 md:grid md:grid-cols-2 md:gap-x-8 md:border-l-0 md:pl-0 lg:grid-cols-4">
        {t.roadmap.phases.map((phase, i) => {
          const Icon = STATUS_ICONS[i];
          const current = i === 0;
          return (
            <li
              key={phase.title}
              className={`relative rounded-2xl border p-6 transition-colors ${
                current ? 'border-amber-300/40 bg-amber-400/5' : 'border-white/10 bg-slate-900/60 hover:border-white/20'
              }`}
            >
              <span
                aria-hidden
                className={`absolute -left-[33px] top-7 h-3 w-3 rounded-full ring-4 ring-slate-950 md:hidden ${
                  current ? 'bg-amber-300' : 'bg-white/30'
                }`}
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{phase.name}</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${current ? 'text-amber-300' : 'text-slate-300'}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {phase.status}
                </span>
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold text-white">{phase.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {phase.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-slate-300">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
