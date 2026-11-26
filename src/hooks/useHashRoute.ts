import { useState, useEffect, useCallback } from 'react';
import { SectionId } from '../types';

const VALID_SECTIONS = new Set<SectionId>([
  'home',
  'learn',
  'lab',
  'games',
  'studio',
  'tutor',
  'revision',
  'progress',
  'simulators',
  'playground',
  'challenges',
  'quiz',
]);

function normalizeSection(raw: SectionId): SectionId {
  if (raw === 'simulators') return 'lab';
  if (raw === 'playground' || raw === 'challenges') return 'studio';
  if (raw === 'quiz') return 'revision';
  return raw;
}

export function parseHashToSection(hash: string): SectionId {
  const cleaned = hash.replace(/^#\/?/, '').split(/[/?#]/)[0].trim().toLowerCase() as SectionId;
  if (!cleaned) return 'home';
  if (VALID_SECTIONS.has(cleaned)) {
    return normalizeSection(cleaned);
  }
  return 'home';
}

export function sectionToHash(section: SectionId): string {
  const normalized = normalizeSection(section);
  return normalized === 'home' ? '#/' : `#/${normalized}`;
}

export function useHashRoute(): [SectionId, (section: SectionId) => void] {
  const [section, setSection] = useState<SectionId>(() =>
    typeof window !== 'undefined' ? parseHashToSection(window.location.hash) : 'home'
  );

  useEffect(() => {
    const handleHashChange = () => {
      const next = parseHashToSection(window.location.hash);
      setSection(next);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((nextSection: SectionId) => {
    const normalized = normalizeSection(nextSection);
    const targetHash = sectionToHash(normalized);
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
    setSection(normalized);
  }, []);

  return [section, navigate];
}
