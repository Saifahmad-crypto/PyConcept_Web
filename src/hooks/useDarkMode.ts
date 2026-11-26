import { useState, useEffect, useCallback } from 'react';

type ColorScheme = 'light' | 'dark' | 'system';

function computeIsDark(scheme: ColorScheme, systemDark: boolean): boolean {
  return scheme === 'dark' || (scheme === 'system' && systemDark);
}

function applyThemeClass(isDark: boolean) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', isDark);
}

export function useDarkMode() {
  const [scheme, setScheme] = useState<ColorScheme>(() => {
    try {
      return (localStorage.getItem('pyverse-color-scheme') as ColorScheme) ?? 'system';
    } catch {
      return 'system';
    }
  });

  const [systemDark, setSystemDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const isDark = computeIsDark(scheme, systemDark);

  useEffect(() => {
    applyThemeClass(isDark);
  }, [isDark]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggle = useCallback(() => {
    const next: ColorScheme = isDark ? 'light' : 'dark';
    applyThemeClass(next === 'dark');
    setScheme(next);
    try {
      localStorage.setItem('pyverse-color-scheme', next);
    } catch {
      // ignore storage errors
    }
  }, [isDark]);

  return { isDark, scheme, toggle };
}
