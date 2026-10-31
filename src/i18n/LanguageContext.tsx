import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { LanguageContext } from '@/i18n/languageContext';
import { messages, type Lang } from '@/i18n/messages';

const STORAGE_KEY = 'agentcity-lang';

function readInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === 'zh' ? 'zh' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
  }, []);

  const value = useMemo(
    () => ({ lang, setLang, t: messages[lang] }),
    [lang, setLang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
