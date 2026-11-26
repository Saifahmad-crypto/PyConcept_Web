import React, { useState } from 'react';
import {
  Home,
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
} from 'lucide-react';
import { SectionId, UserPreferences } from '../types';
import { getLearnerLevel } from '../data/ecosystemData';
import { PyVerseLogo } from './PyVerseLogo';

interface NavbarProps {
  activeSection: SectionId;
  xp: number;
  preferences: UserPreferences;
  onUpdatePreferences: (patch: Partial<UserPreferences>) => void;
  onOpenSearch: () => void;
  onNavigate: (section: SectionId) => void;
}

const NAV_ITEMS: Array<{
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  matchSections?: SectionId[];
}> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'learn', label: 'Learning World', icon: Compass },
  {
    id: 'lab',
    label: 'Interactive Lab',
    icon: FlaskConical,
    matchSections: ['lab', 'simulators'],
  },
  {
    id: 'games',
    label: 'Game Zone',
    icon: Gamepad2,
    matchSections: ['games', 'challenges'],
  },
  {
    id: 'studio',
    label: 'Coding Studio',
    icon: Code2,
    matchSections: ['studio', 'playground'],
  },
  { id: 'tutor', label: 'AI Tutor', icon: Sparkles },
  {
    id: 'revision',
    label: 'Revision Hub',
    icon: BookOpen,
    matchSections: ['revision', 'quiz'],
  },
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

  const levelInfo = getLearnerLevel(xp);

  const handleNav = (id: SectionId) => {
    onNavigate(id);
    setMobileOpen(false);
    setPrefsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Zone 1: PyVerse Brand Logo */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="rounded-xl shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          aria-label="PyVerse Home"
        >
          <PyVerseLogo size="md" />
        </button>

        {/* Zone 2: Primary 7 Single-Line Navigation Destinations */}
        <nav aria-label="Primary navigation" className="hidden xl:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.matchSections
              ? item.matchSections.includes(activeSection)
              : activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[13px] font-medium transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-50 to-violet-50 font-semibold text-[#1E293B]'
                    : 'text-[#64748B] hover:bg-slate-50 hover:text-[#1E293B]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={`h-3.5 w-3.5 shrink-0 ${
                    isActive ? 'text-[#2563EB]' : 'text-slate-400'
                  }`}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2.5 -bottom-[11px] h-0.5 rounded-full bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#8B5CF6]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Search, Accessibility Preferences, Progress Profile & Mobile Menu */}
        <div className="relative flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 text-xs font-medium text-[#64748B] transition-colors hover:border-sky-300 hover:text-[#1E293B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            aria-label="Search PyVerse (Ctrl+K)"
            title="Search PyVerse (Ctrl+K)"
          >
            <Search className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            <span className="hidden md:inline">Search</span>
          </button>

          <button
            type="button"
            onClick={() => setPrefsOpen((v) => !v)}
            aria-expanded={prefsOpen}
            aria-label="Learning preferences and accessibility"
            title="Learning preferences & accessibility"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
              prefsOpen
                ? 'border-violet-300 bg-violet-50 text-[#8B5CF6]'
                : 'border-slate-200 bg-[#F8FAFC] text-[#64748B] hover:border-sky-300 hover:text-[#1E293B]'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => handleNav('progress')}
            className={`hidden sm:inline-flex min-h-[40px] items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] ${
              activeSection === 'progress'
                ? 'border-transparent bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#8B5CF6] text-white shadow-sm'
                : 'border-slate-200 bg-white text-[#1E293B] hover:border-sky-300 hover:bg-[#F0F9FF]'
            }`}
            aria-label="Open Progress Dashboard"
          >
            <BarChart3
              className={`h-3.5 w-3.5 ${
                activeSection === 'progress' ? 'text-white' : 'text-[#2563EB]'
              }`}
              aria-hidden="true"
            />
            <span className="font-mono tabular-nums">{xp} XP</span>
            <span
              className={`text-[11px] font-medium ${
                activeSection === 'progress' ? 'text-sky-100' : 'text-[#64748B]'
              }`}
            >
              · Lvl {levelInfo.current.level}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileOpen((prev) => !prev);
              setPrefsOpen(false);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] hover:bg-slate-100 xl:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Personalization & Accessibility Popover */}
          {prefsOpen && (
            <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-display text-xs font-bold text-[#1E293B]">
                  Personalization &amp; Accessibility
                </span>
                <button
                  type="button"
                  onClick={() => setPrefsOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Close
                </button>
              </div>

              <div>
                <span className="block text-[11px] font-semibold text-[#64748B]">
                  Preferred Learning Mode
                </span>
                <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-[#F8FAFC] p-1">
                  {(['guided', 'explorer', 'challenge'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => onUpdatePreferences({ preferredMode: m })}
                      className={`rounded-lg py-1 text-[11px] font-semibold capitalize transition-colors ${
                        preferences.preferredMode === m
                          ? 'bg-[#2563EB] text-white'
                          : 'text-[#64748B] hover:text-[#1E293B]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#1E293B]">Readable Text Size</span>
                <div className="inline-flex rounded-lg border border-slate-200 bg-[#F8FAFC] p-0.5">
                  {(['normal', 'large'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => onUpdatePreferences({ fontSize: sz })}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-semibold capitalize ${
                        preferences.fontSize === sz
                          ? 'bg-[#2563EB] text-white'
                          : 'text-[#64748B]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center justify-between text-xs cursor-pointer">
                <span className="font-medium text-[#1E293B]">Reduce Animations</span>
                <input
                  type="checkbox"
                  checked={preferences.reducedMotion}
                  onChange={(e) => onUpdatePreferences({ reducedMotion: e.target.checked })}
                  className="h-4 w-4 accent-[#2563EB]"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Tablet & Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-slate-200/80 bg-[#F8FAFC] px-4 py-3.5 xl:hidden"
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.matchSections
                ? item.matchSections.includes(activeSection)
                : activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`flex min-h-[44px] items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'border border-violet-300 bg-gradient-to-r from-sky-50 to-violet-50 font-semibold text-[#1E293B]'
                      : 'border border-slate-200 bg-white text-[#64748B] hover:border-sky-300 hover:text-[#1E293B]'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-[#2563EB]' : 'text-slate-400'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => handleNav('progress')}
              className={`flex min-h-[44px] items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeSection === 'progress'
                  ? 'border border-violet-300 bg-gradient-to-r from-sky-50 to-violet-50 font-semibold text-[#1E293B]'
                  : 'border border-slate-200 bg-white text-[#64748B] hover:border-sky-300 hover:text-[#1E293B]'
              }`}
            >
              <BarChart3 className="h-4 w-4 shrink-0 text-[#2563EB]" aria-hidden="true" />
              <span className="truncate">Progress ({xp} XP)</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};
