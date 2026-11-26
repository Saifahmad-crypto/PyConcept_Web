import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SectionId } from '../types';
import { PyVerseLogo } from './PyVerseLogo';

interface NavbarProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
}

const NAV_ITEMS: Array<{ id: SectionId; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'learn', label: 'Learn' },
  { id: 'lab', label: 'Interactive Lab' },
  { id: 'simulators', label: 'Interactive Simulators' },
  { id: 'tutor', label: 'AI Tutor' },
  { id: 'playground', label: 'Playground' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'progress', label: 'Progress' },
];

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id: SectionId) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:gap-6 lg:px-8">
        {/* Zone 1: PyVerse Brand Logo */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="rounded-lg shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          aria-label="PyVerse Home"
        >
          <PyVerseLogo size="md" />
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav aria-label="Primary navigation" className="hidden xl:flex items-center gap-3.5 2xl:gap-5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative py-1.5 text-[12.5px] 2xl:text-[13px] font-medium transition-colors whitespace-nowrap shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  isActive
                    ? 'font-semibold text-[#1E293B]'
                    : 'text-slate-500 hover:text-[#1E293B]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[15px] h-0.5 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#8B5CF6]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('learn')}
            className="hidden sm:inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-500/20 transition-all duration-200 hover:opacity-95 hover:shadow-md hover:shadow-violet-500/20 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            Start Learning
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 xl:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-slate-200/80 bg-[#F8FAFC] px-4 py-3 xl:hidden"
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`flex min-h-[44px] items-center justify-center rounded-xl px-2.5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-50 to-violet-50 text-violet-700 border border-violet-200 font-semibold'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300 hover:text-[#1E293B]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => handleNav('learn')}
            className="mt-3 flex min-h-[44px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] px-4 py-2 text-sm font-semibold text-white shadow-sm sm:hidden"
          >
            Start Learning
          </button>
        </nav>
      )}
    </header>
  );
};
