import { Hexagon } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';
import type { Route } from '@/hooks/useHashRoute';

interface SiteFooterProps {
  navigate: (route: Route) => void;
}

export function SiteFooter({ navigate }: SiteFooterProps) {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 text-white">
              <Hexagon className="h-6 w-6 text-amber-400" strokeWidth={2.2} />
              <span className="font-display text-lg font-semibold">{t.brand}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{t.footer.tagline}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{t.footer.links}</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-10 gap-y-3 text-sm text-slate-300">
              {(['concept', 'mint', 'roadmap', 'faq', 'market'] as const).map((key) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/${key}` as Route);
                      window.scrollTo({ top: 0 });
                    }}
                    className="transition-colors hover:text-amber-300"
                  >
                    {t.nav[key]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">
          © {year} {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
