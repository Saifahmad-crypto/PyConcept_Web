import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import {
  GamesHubTabId,
  LabTabId,
  RevisionTabId,
  SectionId,
  TopicId,
} from '../types';
import { SEARCHABLE_CONCEPTS } from '../data/ecosystemData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: SectionId) => void;
  onOpenTopic: (topic: TopicId) => void;
  onOpenLabTab: (tab: LabTabId) => void;
  onOpenGamesTab: (tab: GamesHubTabId) => void;
  onOpenRevisionTab: (tab: RevisionTabId) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenTopic,
  onOpenLabTab,
  onOpenGamesTab,
  onOpenRevisionTab,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();
  const matches = SEARCHABLE_CONCEPTS.filter((item) => {
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q)
    );
  });

  const handleSelect = (item: (typeof SEARCHABLE_CONCEPTS)[number]) => {
    if (item.topicId) {
      onOpenTopic(item.topicId);
    } else if (item.labTab) {
      onOpenLabTab(item.labTab as LabTabId);
    } else if (item.gamesTab) {
      onOpenGamesTab(item.gamesTab as GamesHubTabId);
    } else if (item.revisionTab) {
      onOpenRevisionTab(item.revisionTab as RevisionTabId);
    } else {
      onNavigate(item.section);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/45 px-4 pt-16 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-search-label"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3.5">
          <Search className="h-4 w-4 shrink-0 text-[#2563EB]" aria-hidden="true" />
          <label id="global-search-label" htmlFor="global-search-input" className="sr-only">
            Search PyVerse topics, simulators, games, and cheat sheets
          </label>
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Python topics, simulators, games, challenges..."
            className="w-full text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3">
          {matches.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[#64748B]">
              No matching PyVerse modules found for &quot;{query}&quot;. Try searching{' '}
              <code className="font-mono text-[#2563EB]">range()</code>,{' '}
              <code className="font-mono text-[#2563EB]">if</code>, or{' '}
              <code className="font-mono text-[#2563EB]">flowchart</code>.
            </p>
          ) : (
            <div className="space-y-1.5">
              {matches.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl border border-transparent px-4 py-3 text-left transition-colors hover:border-sky-200 hover:bg-[#F0F9FF]"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-[11px] font-semibold text-[#2563EB]">
                      {item.category}
                    </span>
                    <p className="truncate font-display text-sm font-bold text-[#1E293B]">
                      {item.title}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
