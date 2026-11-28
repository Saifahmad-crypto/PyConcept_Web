import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Compass,
  Cpu,
  Layers,
  Gamepad2,
  ArrowRight,
  Sparkles,
  Play,
  Code2,
  CheckCircle2,
  Sun,
  Moon,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Box,
  HelpCircle,
  Bug,
  Award,
  BookOpen,
  Bot,
  WifiOff,
  Languages,
  ChevronDown,
} from 'lucide-react';
import { PyVerseLogo } from './PyVerseLogo';
import { useDarkMode } from '../hooks/useDarkMode';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../data/translations';
import { SectionId, GamesHubTabId, RevisionTabId } from '../types';

import { SIMULATORS_CATALOG } from '../simulators/simulatorsData';
import { QUIZ_QUESTIONS, CODING_CHALLENGES } from '../data/curriculumData';
import { BUG_HUNT_CHALLENGES, LEARNING_MISSIONS } from '../data/ecosystemData';
import { GAMES } from './MiniGames';
import { VAULT_ROOMS } from './games/PythonEscapeRoom';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenSection: (section: SectionId) => void;
  onOpenGamesTab?: (tab: GamesHubTabId) => void;
  onOpenRevisionTab?: (tab: RevisionTabId) => void;
}

const CountUpNumber: React.FC<{ target: number }> = ({ target }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const [display, setDisplay] = useState<number>(0);

  useEffect(() => {
    if (!isInView) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setDisplay(target);
      return;
    }

    let rafId: number;
    const duration = 900;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setDisplay(target);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenSection,
  onOpenGamesTab,
  onOpenRevisionTab,
}) => {
  const { isDark, toggle: toggleDark } = useDarkMode();
  const { lang, isHinglish, toggleLanguage } = useLanguage();
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const FAQS = [
    { q: t(lang, 'landing.faq.q1'), a: t(lang, 'landing.faq.a1') },
    { q: t(lang, 'landing.faq.q2'), a: t(lang, 'landing.faq.a2') },
    { q: t(lang, 'landing.faq.q3'), a: t(lang, 'landing.faq.a3') },
    { q: t(lang, 'landing.faq.q4'), a: t(lang, 'landing.faq.a4') },
    { q: t(lang, 'landing.faq.q5'), a: t(lang, 'landing.faq.a5') },
  ];

  const STATS = [
    {
      label: t(lang, 'landing.stats.simulators'),
      value: SIMULATORS_CATALOG.length,
    },
    {
      label: t(lang, 'landing.stats.quizzes'),
      value: QUIZ_QUESTIONS.length,
    },
    {
      label: t(lang, 'landing.stats.challenges'),
      value: CODING_CHALLENGES.length,
    },
    {
      label: t(lang, 'landing.stats.bugHunts'),
      value: BUG_HUNT_CHALLENGES.length,
    },
    {
      label: t(lang, 'landing.stats.missions'),
      value: LEARNING_MISSIONS.length,
    },
    {
      label: t(lang, 'landing.stats.miniGames'),
      value: GAMES.length,
    },
  ];

  const FEATURE_CARDS = [
    {
      id: 'explore',
      title: t(lang, 'landing.pillar.explore.title'),
      tagline: t(lang, 'landing.pillar.explore.tagline'),
      description: t(lang, 'landing.pillar.explore.desc'),
      icon: Compass,
      tag: '01 • CURRICULUM',
      accent: 'border-blue-500/30 text-blue-400 bg-blue-950/20',
      badge: `${LEARNING_MISSIONS.length} ${isHinglish ? 'Guided Missions' : 'Guided Missions'}`,
      actionLabel: t(lang, 'landing.pillar.explore.cta'),
      onClick: () => onOpenSection('learn'),
      previewSnippet: `# Step 01: Reference Memory
user_id = 4092
is_verified = True
print(f"Logged in: {user_id}")`,
    },
    {
      id: 'simulate',
      title: t(lang, 'landing.pillar.simulate.title'),
      tagline: t(lang, 'landing.pillar.simulate.tagline'),
      description: t(lang, 'landing.pillar.simulate.desc'),
      icon: Cpu,
      tag: '02 • REAL-TIME LAB',
      accent: 'border-red-500/30 text-red-400 bg-red-950/20',
      badge: `${SIMULATORS_CATALOG.length} Live Simulators`,
      actionLabel: t(lang, 'landing.pillar.simulate.cta'),
      onClick: () => onOpenSection('simulators'),
      previewSnippet: `# ATM Decision Stage
if pin_entered == correct_pin:
    dispense_cash(amount)
    log_transaction("SUCCESS")`,
    },
    {
      id: 'create',
      title: t(lang, 'landing.pillar.create.title'),
      tagline: t(lang, 'landing.pillar.create.tagline'),
      description: t(lang, 'landing.pillar.create.desc'),
      icon: Layers,
      tag: '03 • CREATE STUDIO',
      accent: 'border-amber-500/30 text-amber-400 bg-amber-950/20',
      badge: 'Unified Engine',
      actionLabel: t(lang, 'landing.pillar.create.cta'),
      onClick: () => onOpenSection('lab'),
      previewSnippet: `# Bi-Directional Sync
for cycle in range(1, 5):
    agv_rover.move_waypoint()
    system.log_telemetry()`,
    },
    {
      id: 'play',
      title: t(lang, 'landing.pillar.play.title'),
      tagline: t(lang, 'landing.pillar.play.tagline'),
      description: `Test your problem-solving in the ${VAULT_ROOMS.length}-room Python Code Vault Escape Room, debug real bugs in the Bug Hunter Lab, and complete daily quests for XP rewards.`,
      icon: Gamepad2,
      tag: '04 • GAME ZONE',
      accent: 'border-purple-500/30 text-purple-400 bg-purple-950/20',
      badge: `${VAULT_ROOMS.length} Vaults · ${BUG_HUNT_CHALLENGES.length} Bug Hunts`,
      actionLabel: t(lang, 'landing.pillar.play.cta'),
      onClick: () => onOpenSection('games'),
      previewSnippet: `# Escape Room Chamber 3
target_cipher = unlock_gate()
assert target_cipher == "SOLVED"`,
    },
  ];

  const MORE_TILES = [
    {
      id: 'labs-3d',
      icon: Box,
      title: t(lang, 'landing.more.tile1.title'),
      desc: t(lang, 'landing.more.tile1.desc'),
      onClick: () => onOpenSection('simulators'),
      color: 'text-red-500 bg-red-500/10 border-red-500/20',
    },
    {
      id: 'quizzes',
      icon: HelpCircle,
      title: t(lang, 'landing.more.tile2.title'),
      desc: t(lang, 'landing.more.tile2.desc'),
      onClick: () => onOpenSection('quiz'),
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    },
    {
      id: 'challenges',
      icon: Code2,
      title: t(lang, 'landing.more.tile3.title'),
      desc: t(lang, 'landing.more.tile3.desc'),
      onClick: () => onOpenSection('challenges'),
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'bug-hunter',
      icon: Bug,
      title: t(lang, 'landing.more.tile4.title'),
      desc: t(lang, 'landing.more.tile4.desc'),
      onClick: () => (onOpenGamesTab ? onOpenGamesTab('bug-hunter') : onOpenSection('games')),
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'games-vault',
      icon: Gamepad2,
      title: t(lang, 'landing.more.tile5.title'),
      desc: t(lang, 'landing.more.tile5.desc'),
      onClick: () => onOpenSection('games'),
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    },
    {
      id: 'xp-certs',
      icon: Award,
      title: t(lang, 'landing.more.tile6.title'),
      desc: t(lang, 'landing.more.tile6.desc'),
      onClick: () => onOpenSection('progress'),
      color: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
    },
    {
      id: 'flashcards',
      icon: BookOpen,
      title: t(lang, 'landing.more.tile7.title'),
      desc: t(lang, 'landing.more.tile7.desc'),
      onClick: () => (onOpenRevisionTab ? onOpenRevisionTab('flashcards') : onOpenSection('revision')),
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      id: 'ai-tutor',
      icon: Bot,
      title: t(lang, 'landing.more.tile8.title'),
      desc: t(lang, 'landing.more.tile8.desc'),
      onClick: () => onOpenSection('tutor'),
      color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    },
  ];

  const SOCIAL_LINKS = [
    { href: 'https://x.com/Saif4hmad', Icon: Twitter, label: 'X (Twitter)' },
    { href: 'https://github.com/saifahmad-crypto', Icon: Github, label: 'GitHub' },
    { href: 'https://www.instagram.com/saif_4hmad', Icon: Instagram, label: 'Instagram' },
    { href: 'https://www.linkedin.com/in/saif-ahmad-tech', Icon: Linkedin, label: 'LinkedIn' },
  ];

  return (
    <div className="min-h-screen bg-[#FBF5F9] dark:bg-[#090101] text-[#100303] dark:text-[#f0eaea] transition-colors duration-300 relative overflow-x-hidden selection:bg-red-600 selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-red-600/10 via-red-950/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 -left-48 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] -right-48 w-96 h-96 bg-red-800/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Minimal Top Header */}
      <header className="border-b border-[#E5DFDF]/80 dark:border-red-950/40 bg-[#FBF5F9]/80 dark:bg-[#090101]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <PyVerseLogo size="md" />
            <span className="hidden md:inline-block text-[10px] font-mono uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 truncate">
              {t(lang, 'landing.nav.badge')}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* EN / Hinglish Toggle Button */}
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label="Toggle language EN / Hinglish"
              title={isHinglish ? 'Switch to English' : 'हिंग्लिश में बदलें'}
              className="inline-flex h-9 items-center gap-1 rounded-xl border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 px-2.5 text-xs font-semibold transition-all hover:border-[#E10906] focus:outline-none focus:ring-2 focus:ring-red-500 whitespace-nowrap"
            >
              <span className={!isHinglish ? 'text-[#E10906] font-bold' : 'text-stone-500 dark:text-stone-400'}>EN</span>
              <span className="text-stone-400 dark:text-stone-600">/</span>
              <span className={isHinglish ? 'text-[#E10906] font-bold' : 'text-stone-500 dark:text-stone-400'}>हिंग्लिश</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleDark}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 transition-all active:scale-95"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

            {/* Enter PyVerse Primary CTA */}
            <button
              type="button"
              onClick={onEnterApp}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onEnterApp();
                }
              }}
              className="group inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#E10906] hover:bg-[#c00805] text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/20 hover:shadow-red-600/30 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-[#090101] whitespace-nowrap"
            >
              <span>{t(lang, 'landing.nav.enter')}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-14 pb-10 lg:pt-20 lg:pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-5"
        >
          {/* Subtle Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/10 dark:bg-red-950/60 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>{t(lang, 'landing.hero.eyebrow')}</span>
          </div>

          {/* Core Hero Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-stone-950 dark:text-stone-100">
            {t(lang, 'landing.hero.titlePart1')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-amber-500">
              {t(lang, 'landing.hero.titlePart2')}
            </span>
          </h1>

          {/* Short Description */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-stone-600 dark:text-stone-300 leading-relaxed font-sans font-normal">
            {t(lang, 'landing.hero.subtitle')}
          </p>

          {/* CTA Button Group */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onEnterApp}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onEnterApp();
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#E10906] hover:bg-[#c00805] text-white font-display text-base font-bold shadow-xl shadow-red-600/25 hover:shadow-red-600/40 active:scale-98 transition-all group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-[#090101]"
            >
              <span>{t(lang, 'landing.nav.enter')}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={() => onOpenSection('simulators')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-stone-300 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-800 dark:text-stone-200 text-sm font-semibold transition-all active:scale-98 shadow-sm"
            >
              <Play className="w-4 h-4 text-red-500 fill-current" />
              <span>{t(lang, 'landing.hero.trySims')}</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-stone-500 dark:text-stone-400 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t(lang, 'landing.trust.oss')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t(lang, 'landing.trust.browser')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t(lang, 'landing.trust.noInstall')}
            </span>
          </div>
        </motion.div>
      </section>

      {/* 1. Dynamic STAT STRIP (Right below Hero Trust Chips, eliminates excessive whitespace) */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 rounded-2xl border border-stone-200/80 dark:border-red-950/50 bg-white/70 dark:bg-[#120404]/70 backdrop-blur-md p-4 sm:p-5 shadow-sm">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center text-center px-2 py-2 rounded-xl bg-stone-50/70 dark:bg-black/30 border border-stone-100 dark:border-stone-900/70"
            >
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-[#E10906] tracking-tight">
                <CountUpNumber target={stat.value} />
              </div>
              <div className="mt-0.5 text-[11px] sm:text-xs font-mono font-medium text-stone-600 dark:text-stone-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Four Visual Feature Cards Section */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-stone-200 dark:border-red-950/40">
        <div className="text-center space-y-3 mb-12">
          <p className="text-xs font-mono font-bold text-red-600 uppercase tracking-widest">
            {t(lang, 'landing.pillars.eyebrow')}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-950 dark:text-stone-100">
            {t(lang, 'landing.pillars.title')}
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl mx-auto">
            {t(lang, 'landing.pillars.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {FEATURE_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                onClick={card.onClick}
                className="group relative rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#100303] border border-stone-200 dark:border-stone-800/80 hover:border-red-500/60 dark:hover:border-red-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-600/10 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Glow highlight on hover */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-2xl group-hover:bg-red-600/10 transition-colors pointer-events-none" />

                <div className="space-y-4 z-10">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono tracking-widest uppercase font-semibold text-stone-500 dark:text-stone-400">
                      {card.tag}
                    </span>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900/60 text-stone-600 dark:text-stone-300 font-medium whitespace-nowrap">
                      {card.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl border ${card.accent}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-display text-stone-900 dark:text-stone-100 group-hover:text-red-500 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                        {card.tagline}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Visual Code Preview Chip */}
                  <div className="pt-2">
                    <div className="p-3 rounded-xl bg-stone-900 dark:bg-black/80 border border-stone-800 font-mono text-[11px] text-stone-300 overflow-x-auto whitespace-pre leading-relaxed select-none">
                      {card.previewSnippet}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-stone-100 dark:border-stone-900 flex items-center justify-between z-10">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 group-hover:underline flex items-center gap-1">
                    {card.actionLabel}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-900 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center text-stone-600 dark:text-stone-300 transition-all">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. "AND MUCH MORE" 8-Tile Compact Grid */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-stone-200 dark:border-red-950/40">
        <div className="text-center space-y-2 mb-10">
          <p className="text-xs font-mono font-bold text-red-600 uppercase tracking-widest">
            {t(lang, 'landing.more.eyebrow')}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-950 dark:text-stone-100">
            {t(lang, 'landing.more.title')}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {MORE_TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <button
                key={tile.id}
                type="button"
                onClick={tile.onClick}
                className="group text-left rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#100303] border border-stone-200 dark:border-stone-800/80 hover:border-red-500/60 dark:hover:border-red-600/50 transition-all hover:shadow-lg hover:shadow-red-600/5 active:scale-[0.98] flex flex-col gap-2.5"
              >
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${tile.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-red-500 transition-colors">
                    {tile.title}
                  </h3>
                  <p className="mt-1 text-xs text-stone-600 dark:text-stone-400 leading-snug line-clamp-2">
                    {tile.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Feature Chips */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-[#140404] px-3.5 py-1.5 text-xs font-mono font-medium text-stone-700 dark:text-stone-300 shadow-xs">
            <WifiOff className="w-3.5 h-3.5 text-emerald-500" />
            {t(lang, 'landing.more.chip.offline')}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-[#140404] px-3.5 py-1.5 text-xs font-mono font-medium text-stone-700 dark:text-stone-300 shadow-xs">
            <Languages className="w-3.5 h-3.5 text-amber-500" />
            {t(lang, 'landing.more.chip.hinglish')}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-[#140404] px-3.5 py-1.5 text-xs font-mono font-medium text-stone-700 dark:text-stone-300 shadow-xs">
            <Moon className="w-3.5 h-3.5 text-purple-500" />
            {t(lang, 'landing.more.chip.dark')}
          </span>
        </div>
      </section>

      {/* Simple Final CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center border-t border-stone-200 dark:border-red-950/40">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white via-white to-red-50/30 dark:from-[#140404] dark:via-[#100303] dark:to-[#090101] border border-stone-200 dark:border-red-950/70 shadow-2xl space-y-6 relative overflow-hidden"
        >
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 z-10 relative">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-950 dark:text-stone-100">
              {t(lang, 'landing.cta.title')}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl mx-auto">
              {t(lang, 'landing.cta.subtitle')}
            </p>
          </div>

          <div className="pt-2 z-10 relative">
            <button
              type="button"
              onClick={onEnterApp}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onEnterApp();
                }
              }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#E10906] hover:bg-[#c00805] text-white font-display text-base font-bold shadow-xl shadow-red-600/30 hover:shadow-red-600/40 active:scale-98 transition-all group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-[#090101]"
            >
              <span>{t(lang, 'landing.cta.btn')}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <p className="text-xs text-stone-500 font-mono z-10 relative">
            {t(lang, 'landing.cta.foot')}
          </p>
        </motion.div>
      </section>

      {/* Compact FAQ Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-stone-200 dark:border-red-950/40">
        <div className="text-center space-y-2 mb-8">
          <p className="text-xs font-mono font-bold text-red-600 uppercase tracking-widest">
            {t(lang, 'landing.faq.eyebrow')}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-950 dark:text-stone-100">
            {t(lang, 'landing.faq.title')}
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-stone-200 dark:border-stone-800/80 bg-white/80 dark:bg-[#100303] overflow-hidden transition-colors hover:border-red-500/40"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-display text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E10906]"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-[#E10906] transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-900/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* About the Creator Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-stone-200 dark:border-red-950/40">
        <div className="p-6 sm:p-10 rounded-3xl bg-white/70 dark:bg-[#120404]/80 backdrop-blur-md border border-stone-200 dark:border-red-950/60 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-600 to-purple-600 opacity-60 blur-sm group-hover:opacity-90 transition-opacity" />
              <img
                src="creator.jpg"
                alt="Saif Ahmad - Creator of PyVerse"
                className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-2xl object-cover shadow-lg border border-white/20"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/PyConcept_Web/creator.jpg';
                }}
              />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-0.5 font-mono text-[11px] font-semibold text-red-500">
                <Sparkles className="w-3.5 h-3.5" />
                {t(lang, 'landing.creator.badge')}
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
                Saif Ahmad
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl">
                {t(lang, 'landing.creator.bio')}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                {SOCIAL_LINKS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 text-stone-700 dark:text-stone-300 hover:border-red-500 hover:text-red-500 text-xs font-semibold transition-all shadow-xs"
                    title={item.label}
                  >
                    <item.Icon className="w-3.5 h-3.5 text-red-500" />
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Landing Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-900/80 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-stone-500 dark:text-stone-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <PyVerseLogo size="sm" />
            <span>&bull; Think. Code. Experiment.</span>
          </div>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="hover:text-red-500 transition-colors p-1"
                aria-label={item.label}
              >
                <item.Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="FEEDBACK_FORM_URL"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transition-colors font-semibold underline-offset-4 hover:underline"
            >
              {t(lang, 'footer.feedback')}
            </a>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">|</span>
            <span>&copy; {new Date().getFullYear()} PyVerse. Crafted by Saif Ahmad.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
