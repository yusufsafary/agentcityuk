import { createContext } from 'react';
import type { Lang, Messages } from '@/i18n/messages';

export interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Messages;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
