import React from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  Cpu,
  Layers,
  Gamepad2,
  ArrowRight,
  Sparkles,
  Play,
  Code2,
  GitBranch,
  Repeat,
  CheckCircle2,
  Terminal,
  Zap,
  ShieldCheck,
  Flame,
  Sun,
  Moon,
  Github,
  Instagram,
  Linkedin,
  Twitter
} from 'lucide-react';
import { PyVerseLogo } from './PyVerseLogo';
import { useDarkMode } from '../hooks/useDarkMode';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenSection: (section: 'learn' | 'lab' | 'games' | 'studio') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenSection,
}) => {
  const { isDark, toggle: toggleDark } = useDarkMode();

  const FEATURE_CARDS = [
    {
      id: 'explore',
      title: 'Explore',
      tagline: 'Visual Concept Mental Models',
      description:
        'Ditch abstract syntax drills. Grasp variables, object memory references, and execution frames through interactive, illustrated visual maps.',
      icon: Compass,
      tag: '01 • CURRICULUM',
      accent: 'border-blue-500/30 text-blue-400 bg-blue-950/20',
      badge: 'Interactive Lessons',
      actionLabel: 'Explore Curriculum',
      onClick: () => onOpenSection('learn'),
      previewSnippet: `# Step 01: Reference Memory
user_id = 4092
is_verified = True
print(f"Logged in: {user_id}")`
    },
    {
      id: 'simulate',
      title: 'Simulate',
      tagline: 'Real-World Logic Machines',
      description:
        'Watch your code control physical systems in real-time — from ATM cash dispensers and smart climate ACs to multi-floor elevators and adaptive traffic junctions.',
      icon: Cpu,
      tag: '02 • REAL-TIME LAB',
      accent: 'border-red-500/30 text-red-400 bg-red-950/20',
      badge: '8 Live Simulators',
      actionLabel: 'Launch Simulators',
      onClick: () => onOpenSection('lab'),
      previewSnippet: `# ATM Decision Stage
if pin_entered == correct_pin:
    dispense_cash(amount)
    log_transaction("SUCCESS")`
    },
    {
      id: 'create',
      title: 'Create',
      tagline: 'Drag-and-Drop & Bi-Directional Code',
      description:
        'Build custom logic architectures with visual blocks, auto-generating clean Python code with live two-way AST synchronization and dynamic SVG flowcharts.',
      icon: Layers,
      tag: '03 • CREATE STUDIO',
      accent: 'border-amber-500/30 text-amber-400 bg-amber-950/20',
      badge: 'Unified Engine',
      actionLabel: 'Open Create Studio',
      onClick: () => onOpenSection('lab'),
      previewSnippet: `# Bi-Directional Sync
for cycle in range(1, 5):
    agv_rover.move_waypoint()
    system.log_telemetry()`
    },
    {
      id: 'play',
      title: 'Play',
      tagline: 'Gamified Challenges & Code Vaults',
      description:
        'Test your problem-solving in the 5-room Python Code Vault Escape Room, debug real bugs in the Bug Hunter Lab, and complete daily quests for XP rewards.',
      icon: Gamepad2,
      tag: '04 • GAME ZONE',
      accent: 'border-purple-500/30 text-purple-400 bg-purple-950/20',
      badge: 'Vaults & Bug Hunter',
      actionLabel: 'Enter GameZone',
      onClick: () => onOpenSection('games'),
      previewSnippet: `# Escape Room Chamber 3
target_cipher = unlock_gate()
assert target_cipher == "SOLVED"`
    },
  ];

  const SOCIAL_LINKS = [
    { href: 'https://github.com/Saifahmad-crypto', Icon: Github, label: 'GitHub' },
    { href: 'https://www.instagram.com/saif_4hmad', Icon: Instagram, label: 'Instagram' },
    { href: 'https://www.linkedin.com/in/saif-ahmad-tech', Icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://x.com/Saif4hmad', Icon: Twitter, label: 'Twitter / X' },
  ];

  return (
    <div className="min-h-screen bg-[#FBF5F9] dark:bg-[#090101] text-[#100303] dark:text-[#f0eaea] transition-colors duration-300 relative overflow-x-hidden selection:bg-red-600 selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-red-600/10 via-red-950/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 -left-48 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] -right-48 w-96 h-96 bg-red-800/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Minimal Top Header */}
      <header className="border-b border-[#E5DFDF]/80 dark:border-red-950/40 bg-[#FBF5F9]/80 dark:bg-[#090101]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PyVerseLogo size="md" />
            <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              Interactive Python Universe
            </span>
          </div>

          <div className="flex items-center gap-3">
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
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E10906] hover:bg-[#c00805] text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/20 hover:shadow-red-600/30 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-[#090101]"
            >
              <span>Enter PyVerse</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-32 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Subtle Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/10 dark:bg-red-950/60 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>Interactive • Visual • No Video Lectures</span>
          </div>

          {/* Core Hero Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-stone-950 dark:text-stone-100">
            Don&apos;t Just Learn Python.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-amber-500">
              Experience It.
            </span>
          </h1>

          {/* Short Description */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-stone-600 dark:text-stone-300 leading-relaxed font-sans font-normal">
            PyVerse transforms Python from static terminal syntax into live, interactive mental models.
            Simulate real-world hardware, drag-and-drop logic blocks, trace memory allocations, and solve hands-on coding escape rooms.
          </p>

          {/* CTA Button Group */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
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
              <span>Enter PyVerse</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={() => onOpenSection('lab')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-stone-300 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-800 dark:text-stone-200 text-sm font-semibold transition-all active:scale-98 shadow-sm"
            >
              <Play className="w-4 h-4 text-red-500 fill-current" />
              <span>Try Real-World Simulators</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 dark:text-stone-400 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Free &amp; Open Source
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Runs 100% In-Browser
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No Python Installation Needed
            </span>
          </div>
        </motion.div>
      </section>

      {/* 4 Visual Feature Cards Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-stone-200 dark:border-red-950/40">
        <div className="text-center space-y-3 mb-14">
          <p className="text-xs font-mono font-bold text-red-600 uppercase tracking-widest">
            Four Pillars of PyVerse
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-950 dark:text-stone-100">
            How You Master Python
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl mx-auto">
            Choose any dimension of the universe to sharpen your intuition, test hypotheses, and write real code.
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
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest uppercase font-semibold text-stone-500 dark:text-stone-400">
                      {card.tag}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900/60 text-stone-600 dark:text-stone-300 font-medium">
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

      {/* Simple Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center border-t border-stone-200 dark:border-red-950/40">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white via-white to-red-50/30 dark:from-[#140404] dark:via-[#100303] dark:to-[#090101] border border-stone-200 dark:border-red-950/70 shadow-2xl space-y-6 relative overflow-hidden"
        >
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 z-10 relative">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-950 dark:text-stone-100">
              Ready to Experience Python?
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl mx-auto">
              Launch into PyVerse right now. Explore interactive simulators, build custom logic machines, and test your skills with zero setup.
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
              <span>Enter PyVerse Now</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <p className="text-xs text-stone-500 font-mono z-10 relative">
            Free forever • Open-source • No account required to start
          </p>
        </motion.div>
      </section>

      {/* Minimal Landing Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-900/80 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-stone-500 dark:text-stone-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <PyVerseLogo size="sm" />
            <span>&bull; Think. Code. Experiment.</span>
          </div>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(item => (
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

          <div>
            <span>&copy; {new Date().getFullYear()} PyVerse. Crafted by Saif Ahmad.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
