import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  Cpu,
  Terminal,
  Sparkles,
  Gamepad2,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';
import { SectionId } from '../types';
import { PyVerseLogo } from './PyVerseLogo';

interface NavbarProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
}

const NAV_ITEMS: Array<{
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  matchSections?: SectionId[];
}> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'simulators', label: 'Simulators', icon: Cpu },
  { id: 'playground', label: 'Python Sandbox', icon: Terminal },
  { id: 'tutor', label: 'AI Tutor', icon: Sparkles },
  {
    id: 'games',
    label: 'Games & Challenges',
    icon: Gamepad2,
    matchSections: ['games', 'lab', 'challenges', 'quiz'],
  },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
];

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id: SectionId) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Zone 1: PyVerse Brand Logo */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="rounded-xl shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          aria-label="PyVerse Home"
        >
          <PyVerseLogo size="md" />
        </button>

        {/* Zone 2: Exact 7 single-line top-level navigation items */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-1 xl:gap-2">
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
                    className="absolute inset-x-2.5 -bottom-[13px] h-0.5 rounded-full bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#8B5CF6]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Start Learning CTA + Mobile Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('learn')}
            className="hidden sm:inline-flex min-h-[40px] items-center justify-center rounded-xl bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#8B5CF6] px-4 py-2 font-display text-xs font-semibold text-white shadow-sm shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-violet-500/25 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
          >
            Start Learning
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] hover:bg-slate-100 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-slate-200/80 bg-[#F8FAFC] px-4 py-3.5 lg:hidden"
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
          </div>
          <button
            type="button"
            onClick={() => handleNav('learn')}
            className="mt-3 flex min-h-[44px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#8B5CF6] px-4 py-2 font-display text-sm font-semibold text-white shadow-sm sm:hidden"
          >
            Start Learning
          </button>
        </nav>
      )}
    </header>
  );
};
