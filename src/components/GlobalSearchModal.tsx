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
      className="fixed inset-0 z-50 flex items-start justify-center bg-[#100303]/60 dark:bg-black/70 px-4 pt-16 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-search-label"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[#E5DFDF] dark:border-[#3a1a1a] px-5 py-3.5">
          <Search className="h-4 w-4 shrink-0 text-[#E10906]" aria-hidden="true" />
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
            className="w-full text-sm text-[#100303] dark:text-[#f0eaea] placeholder:text-[#8A8585] dark:placeholder:text-[#9a8585] bg-transparent focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] text-[#8A8585] dark:text-[#9a8585] hover:border-[#100303] dark:hover:border-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3">
          {matches.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[#8A8585] dark:text-[#9a8585]">
              No matching PyVerse modules found for &quot;{query}&quot;. Try searching{' '}
              <code className="font-mono text-[#E10906]">range()</code>,{' '}
              <code className="font-mono text-[#E10906]">if</code>, or{' '}
              <code className="font-mono text-[#E10906]">flowchart</code>.
            </p>
          ) : (
            <div className="space-y-1">
              {matches.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-transparent px-4 py-3 text-left transition-colors hover:border-[#E10906]/30 hover:bg-[#FBF5F9] dark:hover:bg-[#221010]"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-[11px] font-semibold text-[#E10906]">
                      {item.category}
                    </span>
                    <p className="truncate font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">
                      {item.title}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#8A8585] dark:text-[#9a8585]" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
