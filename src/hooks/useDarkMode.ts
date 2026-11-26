import { useState, useEffect, useCallback } from 'react';

type ColorScheme = 'light' | 'dark' | 'system';

function applyTheme(scheme: ColorScheme) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = scheme === 'dark' || (scheme === 'system' && prefersDark);
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function useDarkMode() {
  const [scheme, setScheme] = useState<ColorScheme>(() => {
    try {
      return (localStorage.getItem('pyverse-color-scheme') as ColorScheme) ?? 'system';
    } catch {
      return 'system';
    }
  });

  // Apply on mount + whenever scheme changes
  useEffect(() => {
    applyTheme(scheme);
  }, [scheme]);

  // Track system preference changes when scheme === 'system'
  useEffect(() => {
    if (scheme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [scheme]);

  const toggle = useCallback(() => {
    setScheme((prev) => {
      // cycle: system → light → dark → system
      const isDark = document.documentElement.classList.contains('dark');
      const next: ColorScheme = isDark ? 'light' : 'dark';
      try {
        localStorage.setItem('pyverse-color-scheme', next);
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const isDark = typeof window !== 'undefined'
    ? document.documentElement.classList.contains('dark')
    : false;

  return { isDark, scheme, toggle };
}
