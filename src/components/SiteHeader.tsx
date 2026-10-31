import { Menu, X, Hexagon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/i18n/useLanguage';
import type { Lang } from '@/i18n/messages';
import type { Route } from '@/hooks/useHashRoute';

const NAV_ITEMS: { route: Route; key: 'home' | 'concept' | 'mint' | 'roadmap' | 'faq' | 'market' }[] = [
  { route: '/', key: 'home' },
  { route: '/concept', key: 'concept' },
  { route: '/mint', key: 'mint' },
  { route: '/roadmap', key: 'roadmap' },
  { route: '/faq', key: 'faq' },
  { route: '/market', key: 'market' },
];

const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
];

interface SiteHeaderProps {
  route: Route;
  navigate: (route: Route) => void;
}

export function SiteHeader({ route, navigate }: SiteHeaderProps) {
  const { t, lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [route]);

  const go = (target: Route) => {
    navigate(target);
    window.scrollTo({ top: 0 });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'bg-slate-950/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
        <button
          type="button"
          onClick={() => go('/')}
          className="flex items-center gap-2 text-white transition-opacity hover:opacity-80"
        >
          <Hexagon className="h-7 w-7 text-amber-400" strokeWidth={2.2} />
          <span className="font-display text-lg font-semibold tracking-tight">{t.brand}</span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.route}
              type="button"
              onClick={() => go(item.route)}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                route === item.route ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.nav[item.key]}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full border border-white/15 p-0.5" role="group" aria-label={t.common.switchLanguage}>
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                aria-pressed={lang === l.code}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  lang === l.code ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.common.closeMenu : t.common.openMenu}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${open ? 'max-h-96' : 'max-h-0'}`}
      >
        <nav className="flex flex-col gap-1 px-5 pb-5" aria-label="Mobile">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.route}
              type="button"
              onClick={() => go(item.route)}
              className={`rounded-xl px-4 py-3 text-left text-base font-medium transition-colors ${
                route === item.route ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              {t.nav[item.key]}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
