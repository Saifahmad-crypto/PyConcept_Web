import { useState, useEffect, useCallback } from 'react';

export type Language = 'en' | 'hinglish';

const LANG_STORAGE_KEY = 'pyverse-lang';
const LANG_EVENT = 'pyverse-lang-change';

function getStoredLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return saved === 'hinglish' ? 'hinglish' : 'en';
  } catch {
    return 'en';
  }
}

export function useLanguage() {
  const [lang, setLang] = useState<Language>(getStoredLanguage);

  useEffect(() => {
    const handler = (e: Event) => {
      const next = (e as CustomEvent<Language>).detail;
      if (next === 'en' || next === 'hinglish') {
        setLang(next);
      }
    };
    window.addEventListener(LANG_EVENT, handler);
    return () => window.removeEventListener(LANG_EVENT, handler);
  }, []);

  const toggleLanguage = useCallback(() => {
    const next: Language = lang === 'en' ? 'hinglish' : 'en';
    setLang(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
    window.dispatchEvent(new CustomEvent<Language>(LANG_EVENT, { detail: next }));
  }, [lang]);

  return { lang, isHinglish: lang === 'hinglish', toggleLanguage };
}
