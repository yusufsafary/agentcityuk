import type { Archetype } from '@/components/cityArtScene';
import { CityArt } from '@/components/CityArt';
import { CityPhoto } from '@/components/CityPhoto';
import { SectionHeader } from '@/components/SectionHeader';
import { useLanguage } from '@/i18n/useLanguage';

const TRAIT_ART: { seed: number; archetype: Archetype; paletteIndex: number }[] = [
  { seed: 11, archetype: 'skyline', paletteIndex: 0 },
  { seed: 12, archetype: 'terraces', paletteIndex: 1 },
  { seed: 13, archetype: 'spires', paletteIndex: 2 },
  { seed: 14, archetype: 'domes', paletteIndex: 3 },
  { seed: 15, archetype: 'harbor', paletteIndex: 4 },
  { seed: 16, archetype: 'spires', paletteIndex: 5 },
];

export function ConceptPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-20 px-5 pt-28 pb-20 lg:px-8 lg:pt-36">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader eyebrow={t.nav.concept} title={t.concept.title} subtitle={t.concept.subtitle} />
        <p className="mt-8 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">{t.concept.intro}</p>
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <CityPhoto
          src="https://images.pexels.com/photos/3337211/pexels-photo-3337211.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt={t.concept.bannerAlt}
          className="aspect-[16/9] w-full shadow-2xl shadow-black/50"
        />
        <p className="mt-3 text-sm text-slate-400">{t.concept.artCaption}</p>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-4 md:grid-cols-3">
        {t.concept.blocks.map((block, i) => (
          <article key={block.title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
            <span className="font-display text-sm font-semibold text-amber-300">0{i + 1}</span>
            <h3 className="mt-3 text-lg font-semibold text-white">{block.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{block.body}</p>
          </article>
        ))}
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">{t.concept.traitsTitle}</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {t.concept.traits.map((trait, i) => (
            <div key={trait} className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
              <CityArt
                seed={TRAIT_ART[i].seed}
                archetype={TRAIT_ART[i].archetype}
                paletteIndex={TRAIT_ART[i].paletteIndex}
                className="aspect-square w-full rounded-none ring-0 transition-transform duration-500 group-hover:scale-105"
                label={trait}
              />

              <p className="px-3 py-2.5 text-sm font-medium text-slate-200">{trait}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
