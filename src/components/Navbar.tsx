import React, { useState } from 'react';
import {
  Compass,
  FlaskConical,
  Gamepad2,
  Code2,
  Sparkles,
  BookOpen,
  Search,
  BarChart3,
  SlidersHorizontal,
  Menu,
  X,
  ArrowRight,
  Layers,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Sun,
  Moon,
} from 'lucide-react';
import { SectionId, UserPreferences } from '../types';
import { getLearnerLevel } from '../data/ecosystemData';
import { PyVerseLogo } from './PyVerseLogo';
import { useDarkMode } from '../hooks/useDarkMode';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../data/translations';

interface NavbarProps {
  activeSection: SectionId;
  xp: number;
  preferences: UserPreferences;
  onUpdatePreferences: (patch: Partial<UserPreferences>) => void;
  onOpenSearch: () => void;
  onNavigate: (section: SectionId) => void;
}

const NAV_ITEM_IDS: Array<{
  id: SectionId;
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  matchSections?: SectionId[];
}> = [
  { id: 'home', key: 'nav.home', icon: Layers },
  { id: 'learn', key: 'nav.learn', icon: Compass },
  {
    id: 'lab',
    key: 'nav.lab',
    icon: FlaskConical,
    matchSections: ['lab', 'simulators'],
  },
  {
    id: 'games',
    key: 'nav.games',
    icon: Gamepad2,
    matchSections: ['games', 'challenges'],
  },
  {
    id: 'studio',
    key: 'nav.studio',
    icon: Code2,
    matchSections: ['studio', 'playground'],
  },
  { id: 'tutor', key: 'nav.tutor', icon: Sparkles },
  {
    id: 'revision',
    key: 'nav.revision',
    icon: BookOpen,
    matchSections: ['revision', 'quiz'],
  },
  { id: 'progress', key: 'nav.progress', icon: BarChart3 },
];

const SOCIAL_LINKS = [
  { href: 'https://github.com/Saifahmad-crypto', Icon: Github, label: 'GitHub', title: 'GitHub: Saifahmad-crypto' },
  { href: 'https://www.instagram.com/saif_4hmad', Icon: Instagram, label: 'Instagram', title: 'Instagram: @saif_4hmad' },
  { href: 'https://www.linkedin.com/in/saif-ahmad-tech', Icon: Linkedin, label: 'LinkedIn', title: 'LinkedIn: saif-ahmad-tech' },
  { href: 'https://x.com/Saif4hmad', Icon: Twitter, label: 'Twitter / X', title: 'X (Twitter): @Saif4hmad' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  xp,
  preferences,
  onUpdatePreferences,
  onOpenSearch,
  onNavigate,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const { isDark, toggle: toggleDark } = useDarkMode();
  const { lang, isHinglish, toggleLanguage } = useLanguage();

  const levelInfo = getLearnerLevel(xp);

  const handleNav = (id: SectionId) => {
    onNavigate(id);
    setMobileOpen(false);
    setPrefsOpen(false);
  };

  const socialBtn =
    'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] transition-colors hover:border-[#100303] dark:hover:border-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]';

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFFFFF]/95 dark:bg-[#0f0303]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2 px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Zone 1: PyVerse Brand Logo */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="rounded-lg shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10906]"
          aria-label="PyVerse Explore Home"
        >
          <PyVerseLogo size="md" />
        </button>

        {/* Zone 2: Primary Single-Line Navigation */}
        <nav aria-label="Primary navigation" className="hidden xl:flex items-center gap-0.5">
          {NAV_ITEM_IDS.map((item) => {
            const Icon = item.icon;
            const isActive = item.matchSections
              ? item.matchSections.includes(activeSection)
              : activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10906] ${
                  isActive
                    ? 'bg-[#FFF1F1] dark:bg-[#2a0808] font-semibold text-[#100303] dark:text-[#f0eaea]'
                    : 'text-[#8A8585] dark:text-[#9a8585] hover:bg-[#F1EEEE] dark:hover:bg-[#1a0808] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-[#E10906]' : 'text-[#8A8585] dark:text-[#9a8585]'}`}
                  aria-hidden="true"
                />
                <span>{t(lang, item.key)}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2.5 -bottom-[11px] h-[2px] bg-[#E10906]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions */}
        <div className="relative flex items-center gap-2 shrink-0">
          {/* Social links — desktop */}
          <div className="hidden lg:flex items-center gap-1 border-r border-[#E5DFDF] dark:border-[#3a1a1a] pr-2">
            {SOCIAL_LINKS.map(({ href, Icon, label, title }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className={socialBtn} aria-label={label} title={title}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>

          {/* Search */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#1a0808] px-2.5 text-xs font-medium text-[#8A8585] dark:text-[#9a8585] transition-colors hover:border-[#100303] dark:hover:border-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10906]"
            aria-label="Search PyVerse (Ctrl+K)"
            title="Search PyVerse (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-[#100303] dark:text-[#9a8585]" aria-hidden="true" />
            <span className="hidden 2xl:inline">Search</span>
            <kbd className="hidden 2xl:inline rounded border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#221010] px-1 font-mono text-[10px] text-[#8A8585] dark:text-[#9a8585]">
              ⌘K
            </kbd>
          </button>

          {/* Dark mode toggle */}
          <button
            type="button"
            onClick={toggleDark}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] transition-colors hover:border-[#100303] dark:hover:border-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10906]"
          >
            {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </button>

          {/* Language toggle — desktop */}
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label="Toggle language EN / Hinglish"
            title={isHinglish ? 'Switch to English' : 'हिंग्लिश में बदलें'}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#1a0808] px-2.5 text-xs font-semibold transition-colors hover:border-[#E10906] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10906]"
          >
            <span className={!isHinglish ? 'text-[#E10906] font-bold' : 'text-[#8A8585] dark:text-[#9a8585]'}>EN</span>
            <span className="text-[#8A8585] dark:text-[#9a8585]">/</span>
            <span className={isHinglish ? 'text-[#E10906] font-bold' : 'text-[#8A8585] dark:text-[#9a8585]'}>हिंग्लिश</span>
          </button>

          {/* Preferences */}
          <button
            type="button"
            onClick={() => setPrefsOpen((v) => !v)}
            aria-expanded={prefsOpen}
            aria-label="Learning preferences and accessibility"
            title="Learning preferences & accessibility"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10906] ${
              prefsOpen
                ? 'border-[#E10906] bg-[#FFF1F1] dark:bg-[#2a0808] text-[#E10906]'
                : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] hover:border-[#100303] dark:hover:border-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>

          {/* XP Pill */}
          <button
            type="button"
            onClick={() => handleNav('progress')}
            className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#1a0808] px-2.5 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] transition-colors hover:border-[#100303] dark:hover:border-[#9a8585] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10906]"
            aria-label="View Progress & XP"
          >
            <span className="h-2 w-2 rounded-full bg-[#E10906]" aria-hidden="true" />
            <span className="font-mono tabular-nums">{xp} XP</span>
            <span className="hidden md:inline text-[11px] font-medium text-[#8A8585] dark:text-[#9a8585]">
              · L{levelInfo.current.level}
            </span>
          </button>

          {/* Start Learning CTA */}
          <button
            type="button"
            onClick={() => handleNav('learn')}
            className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#E10906] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#C40705] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#100303]"
          >
            <span>{t(lang, 'nav.startLearning')}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => { setMobileOpen((prev) => !prev); setPrefsOpen(false); }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#1a0808] text-[#100303] dark:text-[#f0eaea] hover:bg-[#F1EEEE] dark:hover:bg-[#221010] xl:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10906]"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Preferences Popover */}
          {prefsOpen && (
            <div className="absolute right-0 top-11 z-50 w-72 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#F1EEEE] dark:border-[#3a1a1a] pb-2">
                <span className="font-display text-xs font-bold text-[#100303] dark:text-[#f0eaea]">
                  Preferences &amp; Accessibility
                </span>
                <button type="button" onClick={() => setPrefsOpen(false)}
                  className="text-xs font-medium text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]">
                  Close
                </button>
              </div>

              <div>
                <span className="block text-[11px] font-semibold text-[#8A8585] dark:text-[#9a8585]">
                  Preferred Learning Mode
                </span>
                <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#221010] p-1">
                  {(['guided', 'explorer', 'challenge'] as const).map((m) => (
                    <button key={m} type="button" onClick={() => onUpdatePreferences({ preferredMode: m })}
                      className={`rounded-md py-1 text-[11px] font-semibold capitalize transition-colors ${
                        preferences.preferredMode === m
                          ? 'bg-[#100303] dark:bg-[#f0eaea] text-white dark:text-[#100303]'
                          : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                      }`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#100303] dark:text-[#f0eaea]">Readable Text Size</span>
                <div className="inline-flex rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#221010] p-0.5">
                  {(['normal', 'large'] as const).map((sz) => (
                    <button key={sz} type="button" onClick={() => onUpdatePreferences({ fontSize: sz })}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-semibold capitalize ${
                        preferences.fontSize === sz
                          ? 'bg-[#100303] dark:bg-[#f0eaea] text-white dark:text-[#100303]'
                          : 'text-[#8A8585] dark:text-[#9a8585]'
                      }`}>
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center justify-between text-xs cursor-pointer">
                <span className="font-medium text-[#100303] dark:text-[#f0eaea]">Reduce Animations</span>
                <input type="checkbox" checked={preferences.reducedMotion}
                  onChange={(e) => onUpdatePreferences({ reducedMotion: e.target.checked })}
                  className="h-4 w-4 accent-[#E10906]" />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <nav aria-label="Mobile navigation"
          className="border-t border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-4 py-4 xl:hidden">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {NAV_ITEM_IDS.map((item) => {
              const Icon = item.icon;
              const isActive = item.matchSections
                ? item.matchSections.includes(activeSection)
                : activeSection === item.id;
              return (
                <button key={item.id} type="button" onClick={() => handleNav(item.id)}
                  className={`flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border border-[#E10906] bg-[#FFF1F1] dark:bg-[#2a0808] font-semibold text-[#100303] dark:text-[#f0eaea]'
                      : 'border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] hover:border-[#100303] dark:hover:border-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                  }`}>
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#E10906]' : 'text-[#8A8585] dark:text-[#9a8585]'}`} aria-hidden="true" />
                  <span className="truncate">{t(lang, item.key)}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#E5DFDF] dark:border-[#3a1a1a] pt-3">
            <div className="flex items-center gap-1.5">
              {SOCIAL_LINKS.map(({ href, Icon, label, title }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] transition-colors hover:border-[#100303] dark:hover:border-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]"
                  aria-label={label} title={title}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
              {/* Dark toggle — mobile */}
              <button type="button" onClick={toggleDark}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] transition-colors hover:border-[#100303] dark:hover:border-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]">
                {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
              </button>
              {/* Language toggle — mobile */}
              <button
                type="button"
                onClick={toggleLanguage}
                aria-label="Toggle language EN / Hinglish"
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2 text-xs font-semibold transition-colors hover:border-[#E10906]"
              >
                <span className={!isHinglish ? 'text-[#E10906] font-bold' : 'text-[#8A8585] dark:text-[#9a8585]'}>EN</span>
                <span className="text-[#8A8585] dark:text-[#9a8585]">/</span>
                <span className={isHinglish ? 'text-[#E10906] font-bold' : 'text-[#8A8585] dark:text-[#9a8585]'}>हिंग्लिश</span>
              </button>
            </div>
            <button type="button" onClick={() => handleNav('learn')}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#E10906] px-4 text-xs font-semibold text-white">
              {t(lang, 'nav.startLearning')}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};
