import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  BookOpen,
  Cpu,
  Terminal,
  Sparkles,
  Gamepad2,
  Play,
  GitBranch,
  Repeat,
  Box,
  Trophy,
  Flame,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { GamesHubTabId, LearningProgress, SectionId, TopicId } from '../types';
import {
  TOPIC_BASICS_LESSONS,
  TOPIC_08_LESSONS,
  TOPIC_09_LESSONS,
  CODING_CHALLENGES,
} from '../data/curriculumData';
import { computeStreakDays } from '../hooks/useProgress';
import { PyVerseLogo } from './PyVerseLogo';

interface HomePageProps {
  progress: LearningProgress;
  onNavigate: (section: SectionId) => void;
  onOpenTopic: (topic: TopicId) => void;
  onOpenGamesTab: (tab: GamesHubTabId) => void;
}

const FEATURED_PATH_STEPS = [
  {
    id: 'basics' as TopicId,
    number: '01',
    title: 'Python Basics',
    subtitle: 'Variables, data types, print() & spacing',
    accent: 'from-sky-400 to-blue-600',
    ring: 'border-sky-200 hover:border-sky-400',
    icon: Box,
  },
  {
    id: 'conditionals' as TopicId,
    number: '02',
    title: 'Conditional Statements',
    subtitle: 'if / elif / else, comparisons & logic gates',
    accent: 'from-blue-600 to-indigo-600',
    ring: 'border-blue-200 hover:border-blue-400',
    icon: GitBranch,
  },
  {
    id: 'loops' as TopicId,
    number: '03',
    title: 'Loops',
    subtitle: 'for, range(), while, break & continue',
    accent: 'from-violet-500 to-purple-600',
    ring: 'border-violet-200 hover:border-violet-400',
    icon: Repeat,
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  progress,
  onNavigate,
  onOpenTopic,
  onOpenGamesTab,
}) => {
  // Interactive Hero Visual state
  const [heroScore, setHeroScore] = useState(84);
  const [heroStep, setHeroStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroStep((prev) => (prev + 1) % 3);
    }, 1400);
    return () => clearInterval(timer);
  }, []);

  const heroPasses = heroScore >= 75;
  const heroBadgeCount = heroPasses ? 3 : 1;

  // Real progress metrics
  const allLessons = [
    ...TOPIC_BASICS_LESSONS,
    ...TOPIC_08_LESSONS,
    ...TOPIC_09_LESSONS,
  ];
  const basicsCompleted = TOPIC_BASICS_LESSONS.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;
  const condCompleted = TOPIC_08_LESSONS.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;
  const loopsCompleted = TOPIC_09_LESSONS.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;

  const totalLessons = allLessons.length;
  const completedLessonsCount = progress.completedLessons.length;
  const lessonsPercent = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
  const challengesPercent = Math.round(
    (progress.completedChallenges.length / CODING_CHALLENGES.length) * 100
  );
  const gamesCompletedCount = Object.values(progress.gameScores).filter((g) => g.completed).length;
  const streakDays = computeStreakDays(progress.activeDates);

  // Featured next challenge based on actual user progress
  const nextChallenge =
    CODING_CHALLENGES.find((ch) => !progress.completedChallenges.includes(ch.id)) ??
    CODING_CHALLENGES[0];

  const getTopicProgress = (id: TopicId) => {
    if (id === 'basics') {
      return { done: basicsCompleted, total: TOPIC_BASICS_LESSONS.length };
    }
    if (id === 'conditionals') {
      return { done: condCompleted, total: TOPIC_08_LESSONS.length };
    }
    return { done: loopsCompleted, total: TOPIC_09_LESSONS.length };
  };

  return (
    <div className="bg-pyverse-mesh">
      {/* 1. HERO SECTION */}
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-14">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Hero Copy & Primary CTAs */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <p className="text-xs font-semibold tracking-wide text-[#2563EB]">
              PyVerse · Interactive Python Learning Lab · Think. Code. Experiment.
            </p>

            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-[#1E293B] text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              Your Python Journey{' '}
              <span className="bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#8B5CF6] bg-clip-text text-transparent">
                Starts Here.
              </span>
            </h1>

            <p className="mt-4 font-display text-lg font-bold tracking-tight text-[#1E293B] sm:text-xl">
              Learn. Experiment. Play. Build.
            </p>

            <p className="mt-3 max-w-xl text-base leading-relaxed text-[#64748B]">
              See Python code come alive through animated decision flowcharts, real-life
              simulators, logic mini-games, a live coding sandbox, and an adaptive AI personal
              tutor built for beginners.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => onNavigate('learn')}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#8B5CF6] px-6 py-2.5 font-display text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/25 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
              >
                Start Learning
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('simulators')}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-display text-sm font-semibold text-[#1E293B] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-[#F0F9FF] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              >
                <Play className="h-4 w-4 text-[#8B5CF6]" aria-hidden="true" />
                Explore Simulators
              </button>
            </div>

            {/* Clean unboxed telemetry strip */}
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-200/80 pt-5 text-xs font-medium text-[#64748B]">
              <span className="tabular-nums">
                <strong className="font-semibold text-[#1E293B]">3</strong> Interactive Topics
              </span>
              <span aria-hidden="true" className="text-slate-300">
                /
              </span>
              <span className="tabular-nums">
                <strong className="font-semibold text-[#1E293B]">8</strong> Real-Life Simulators
              </span>
              <span aria-hidden="true" className="text-slate-300">
                /
              </span>
              <span className="tabular-nums">
                <strong className="font-semibold text-[#1E293B]">8</strong> Mini-Games &amp;{' '}
                <strong className="font-semibold text-[#1E293B]">10</strong> Coding Challenges
              </span>
            </div>
          </div>

          {/* Custom Interactive Hero Lab Visual (Code + Animated Flowchart + Syntax Symbols) */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border border-sky-200/80 bg-white p-5 shadow-xl shadow-sky-900/5 sm:p-6">
              {/* Top Lab Bar + Floating Python Syntax Chips (interactive controls/tokens, not generic robot art) */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" aria-hidden="true" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" aria-hidden="true" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
                  <span className="ml-2 font-mono text-xs font-semibold text-[#1E293B]">
                    interactive_logic_lab.py
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] font-semibold">
                  <span className="text-[#2563EB]">if</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-[#8B5CF6]">for</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-sky-600">range()</span>
                  <span className="text-slate-300">·</span>
                  <span className={heroPasses ? 'text-emerald-600' : 'text-amber-600'}>
                    {heroPasses ? 'True' : 'False'}
                  </span>
                </div>
              </div>

              {/* Interactive Slider Control */}
              <div className="mt-4 rounded-2xl border border-sky-100 bg-[#F0F9FF] px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor="hero-score-slider"
                    className="text-xs font-semibold text-[#1E293B]"
                  >
                    Experiment: Adjust <code className="font-mono text-[#2563EB]">score</code> to
                    watch the decision path switch
                  </label>
                  <span className="font-mono text-sm font-bold text-[#2563EB] tabular-nums">
                    {heroScore}
                  </span>
                </div>
                <input
                  id="hero-score-slider"
                  type="range"
                  min={30}
                  max={100}
                  value={heroScore}
                  onChange={(e) => setHeroScore(Number(e.target.value))}
                  className="mt-2 w-full accent-[#2563EB] cursor-pointer"
                />
              </div>

              {/* Split Live Code + Animated SVG Flowchart */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-12">
                {/* Left: Live Highlighted Python Snippet */}
                <div className="rounded-2xl bg-[#0F172A] p-4 font-mono text-xs text-slate-300 sm:col-span-6">
                  <div
                    className={`rounded px-2 py-1 transition-colors ${
                      heroStep === 0 ? 'bg-sky-500/20 text-white' : ''
                    }`}
                  >
                    <span className="text-sky-300">score</span> ={' '}
                    <span className="text-amber-300">{heroScore}</span>
                  </div>
                  <div
                    className={`mt-0.5 rounded px-2 py-1 transition-colors ${
                      heroStep === 1 ? 'bg-blue-500/25 text-white' : ''
                    }`}
                  >
                    <span className="text-violet-300">if</span> score &gt;= 75:
                  </div>
                  <div
                    className={`mt-0.5 rounded px-2 py-1 pl-5 transition-colors ${
                      heroPasses && heroStep === 2
                        ? 'bg-emerald-500/20 text-emerald-200'
                        : !heroPasses
                        ? 'opacity-45'
                        : ''
                    }`}
                  >
                    <span className="text-violet-300">for</span> s{' '}
                    <span className="text-violet-300">in</span>{' '}
                    <span className="text-sky-300">range</span>(1, 4):
                  </div>
                  <div
                    className={`mt-0.5 rounded px-2 py-1 pl-8 transition-colors ${
                      heroPasses ? 'text-emerald-300' : 'opacity-45'
                    }`}
                  >
                    <span className="text-sky-300">print</span>(&quot;Star&quot;, s)
                  </div>
                  <div className="mt-0.5 rounded px-2 py-1 text-slate-400">
                    <span className="text-violet-300">else</span>:
                  </div>
                  <div
                    className={`mt-0.5 rounded px-2 py-1 pl-5 transition-colors ${
                      !heroPasses && heroStep === 2
                        ? 'bg-amber-500/20 text-amber-200'
                        : heroPasses
                        ? 'opacity-45'
                        : ''
                    }`}
                  >
                    <span className="text-sky-300">print</span>(&quot;Try Again&quot;)
                  </div>

                  {/* Live Output Strip */}
                  <div className="mt-3 border-t border-slate-800 pt-2.5 text-[11px]">
                    <div className="text-slate-400">Output:</div>
                    <div className="mt-1 font-semibold text-emerald-300">
                      {heroPasses ? 'Star 1 · Star 2 · Star 3' : 'Try Again'}
                    </div>
                  </div>
                </div>

                {/* Right: Animated SVG Logic Flowchart */}
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3 sm:col-span-6">
                  <svg
                    viewBox="0 0 260 225"
                    className="h-auto w-full max-w-[260px]"
                    role="img"
                    aria-label={`Live Python decision flowchart showing score equals ${heroScore}, branch ${
                      heroPasses ? 'True loop' : 'False fallback'
                    }`}
                  >
                    <defs>
                      <linearGradient id="heroFlowGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>

                    {/* Start pill */}
                    <rect
                      x="85"
                      y="8"
                      width="90"
                      height="26"
                      rx="13"
                      fill="#EFF6FF"
                      stroke="#38BDF8"
                      strokeWidth="1.5"
                    />
                    <text
                      x="130"
                      y="25"
                      textAnchor="middle"
                      className="fill-[#1E293B] font-mono text-[10px] font-bold"
                    >
                      score = {heroScore}
                    </text>

                    {/* Arrow Start -> Diamond */}
                    <line
                      x1="130"
                      y1="34"
                      x2="130"
                      y2="54"
                      stroke="#2563EB"
                      strokeWidth="2"
                      className="animate-flow-dash"
                    />

                    {/* Decision Diamond */}
                    <polygon
                      points="130,54 198,86 130,118 62,86"
                      fill="#FFFFFF"
                      stroke="url(#heroFlowGrad)"
                      strokeWidth="2"
                    />
                    <text
                      x="130"
                      y="89"
                      textAnchor="middle"
                      className="fill-[#1E293B] font-mono text-[10px] font-bold"
                    >
                      score &gt;= 75?
                    </text>

                    {/* Left Branch (True) */}
                    <path
                      d="M 62 86 L 38 86 L 38 142"
                      fill="none"
                      stroke={heroPasses ? '#10B981' : '#CBD5E1'}
                      strokeWidth={heroPasses ? '2.5' : '1.5'}
                      className={heroPasses ? 'animate-flow-dash' : ''}
                    />
                    <text
                      x="48"
                      y="78"
                      textAnchor="middle"
                      className={`font-mono text-[9px] font-bold ${
                        heroPasses ? 'fill-emerald-600' : 'fill-slate-400'
                      }`}
                    >
                      True
                    </text>

                    {/* Right Branch (False) */}
                    <path
                      d="M 198 86 L 222 86 L 222 142"
                      fill="none"
                      stroke={!heroPasses ? '#F59E0B' : '#CBD5E1'}
                      strokeWidth={!heroPasses ? '2.5' : '1.5'}
                      className={!heroPasses ? 'animate-flow-dash' : ''}
                    />
                    <text
                      x="212"
                      y="78"
                      textAnchor="middle"
                      className={`font-mono text-[9px] font-bold ${
                        !heroPasses ? 'fill-amber-600' : 'fill-slate-400'
                      }`}
                    >
                      False
                    </text>

                    {/* True Node: Loop x3 */}
                    <rect
                      x="8"
                      y="142"
                      width="104"
                      height="44"
                      rx="10"
                      fill={heroPasses ? '#ECFDF5' : '#FFFFFF'}
                      stroke={heroPasses ? '#10B981' : '#CBD5E1'}
                      strokeWidth={heroPasses ? '2' : '1.2'}
                    />
                    <text
                      x="60"
                      y="161"
                      textAnchor="middle"
                      className="fill-[#1E293B] font-mono text-[9.5px] font-bold"
                    >
                      for s in range(1,4)
                    </text>
                    <text
                      x="60"
                      y="176"
                      textAnchor="middle"
                      className={`font-mono text-[9px] ${
                        heroPasses ? 'fill-emerald-700 font-semibold' : 'fill-slate-400'
                      }`}
                    >
                      Runs {heroBadgeCount}× loop
                    </text>

                    {/* False Node */}
                    <rect
                      x="148"
                      y="142"
                      width="104"
                      height="44"
                      rx="10"
                      fill={!heroPasses ? '#FFFBEB' : '#FFFFFF'}
                      stroke={!heroPasses ? '#F59E0B' : '#CBD5E1'}
                      strokeWidth={!heroPasses ? '2' : '1.2'}
                    />
                    <text
                      x="200"
                      y="161"
                      textAnchor="middle"
                      className="fill-[#1E293B] font-mono text-[9.5px] font-bold"
                    >
                      else branch
                    </text>
                    <text
                      x="200"
                      y="176"
                      textAnchor="middle"
                      className={`font-mono text-[9px] ${
                        !heroPasses ? 'fill-amber-700 font-semibold' : 'fill-slate-400'
                      }`}
                    >
                      &quot;Try Again&quot;
                    </text>

                    {/* Merge to End */}
                    <path
                      d="M 60 186 L 60 205 L 130 205 M 200 186 L 200 205 L 130 205"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                    />
                    <circle cx="130" cy="205" r="4" fill="#2563EB" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FIVE VISUAL FEATURE SHOWCASE CARDS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[#8B5CF6]">
              Interactive Learning Ecosystem
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-[#1E293B] sm:text-3xl">
              Five Labs Built Around Active Discovery
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#64748B]">
            Every section replaces passive walls of text with diagrams, live controls, and
            immediate execution feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
          {/* Card 1: Learning World (3 cols) */}
          <button
            type="button"
            onClick={() => onNavigate('learn')}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/10 lg:col-span-3"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-blue-50 text-[#2563EB]">
                  <BookOpen className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="font-mono text-xs font-semibold text-sky-700">
                  6-Stage Visual Flow
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-[#1E293B]">
                Learning World
              </h3>
              <p className="mt-1.5 text-sm text-[#64748B]">
                Explore Python Basics, Conditionals, and Loops through interactive flowcharts,
                balance scales, and iteration timelines.
              </p>
              {/* Custom Mini SVG Diagram */}
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-sky-100 bg-[#F0F9FF] px-4 py-3 font-mono text-xs text-[#1E293B]">
                <span>1. Explore</span>
                <span aria-hidden="true" className="text-sky-400">→</span>
                <span>3. Visualize</span>
                <span aria-hidden="true" className="text-sky-400">→</span>
                <span>4. Experiment</span>
                <span aria-hidden="true" className="text-sky-400">→</span>
                <span className="font-semibold text-[#2563EB]">6. Quiz</span>
              </div>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-[#2563EB] group-hover:gap-2.5 transition-all">
              Open Learning World <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </button>

          {/* Card 2: Interactive Simulators (3 cols) */}
          <button
            type="button"
            onClick={() => onNavigate('simulators')}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 lg:col-span-3"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-purple-50 text-[#8B5CF6]">
                  <Cpu className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="font-mono text-xs font-semibold text-[#8B5CF6] tabular-nums">
                  8 Real-World Machines
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-[#1E293B]">
                Interactive Simulators
              </h3>
              <p className="mt-1.5 text-sm text-[#64748B]">
                Control traffic lights, ATMs, elevators, smart ACs, and parking scanners while
                Python executes line-by-line beside them.
              </p>
              <div className="mt-4 grid grid-cols-4 gap-2 text-center font-mono text-[11px] font-semibold">
                <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] py-2 text-[#1E293B]">
                  Traffic
                </div>
                <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] py-2 text-[#1E293B]">
                  ATM
                </div>
                <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] py-2 text-[#1E293B]">
                  Elevator
                </div>
                <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] py-2 text-[#1E293B]">
                  Scanner
                </div>
              </div>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-[#8B5CF6] group-hover:gap-2.5 transition-all">
              Launch Simulators Hub <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </button>

          {/* Card 3: Python Sandbox (2 cols) */}
          <button
            type="button"
            onClick={() => onNavigate('playground')}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg lg:col-span-2"
          >
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sky-400">
                <Terminal className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#1E293B]">
                Python Sandbox
              </h3>
              <p className="mt-1.5 text-sm text-[#64748B]">
                Write, highlight, and run Python snippets with <code className="font-mono text-[#2563EB]">input()</code> support and curated starter programs.
              </p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-[#2563EB] group-hover:gap-2 transition-all">
              Open Sandbox <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </button>

          {/* Card 4: AI Personal Tutor (2 cols) */}
          <button
            type="button"
            onClick={() => onNavigate('tutor')}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg lg:col-span-2"
          >
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#8B5CF6] text-white">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#1E293B]">
                AI Personal Tutor
              </h3>
              <p className="mt-1.5 text-sm text-[#64748B]">
                Ask questions in 6 adaptive modes—explain simply, debug code, get hints, or
                practise live problems.
              </p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-[#8B5CF6] group-hover:gap-2 transition-all">
              Ask AI Tutor <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </button>

          {/* Card 5: Games & Challenges (2 cols) */}
          <button
            type="button"
            onClick={() => onNavigate('games')}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg lg:col-span-2"
          >
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Gamepad2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#1E293B]">
                Games &amp; Challenges
              </h3>
              <p className="mt-1.5 text-sm text-[#64748B]">
                Play 8 interactive logic games, solve 10 coding challenges, and master 20 quiz
                questions.
              </p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-emerald-700 group-hover:gap-2 transition-all">
              Play &amp; Practise <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </button>
        </div>
      </section>

      {/* 3. CONNECTED VISUAL LEARNING JOURNEY */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold text-[#2563EB]">Guided Path</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold text-[#1E293B]">
                Your Connected Learning Journey
              </h2>
            </div>
            <p className="text-sm text-[#64748B]">
              Follow the path left to right—or jump straight into any topic.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 items-center gap-4 lg:grid-cols-11">
            {FEATURED_PATH_STEPS.map((step, index) => {
              const Icon = step.icon;
              const stat = getTopicProgress(step.id);
              const pct = stat.total > 0 ? Math.round((stat.done / stat.total) * 100) : 0;

              return (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    onClick={() => onOpenTopic(step.id)}
                    className={`flex flex-col justify-between rounded-2xl border bg-[#F8FAFC] p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md lg:col-span-3 ${step.ring}`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#64748B]">
                          Step {step.number}
                        </span>
                        <span className="font-mono text-xs font-semibold text-[#2563EB] tabular-nums">
                          {stat.done}/{stat.total} lessons
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${step.accent} text-white`}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <h3 className="font-display text-base font-bold text-[#1E293B]">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-2.5 text-xs leading-relaxed text-[#64748B]">
                        {step.subtitle}
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${step.accent} transition-all duration-300`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </button>

                  {index < FEATURED_PATH_STEPS.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="hidden items-center justify-center lg:col-span-1 lg:flex"
                    >
                      <ArrowRight className="h-5 w-5 text-sky-400" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PROGRESS PREVIEW + FEATURED CHALLENGE */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Progress Preview (7 cols) */}
          <div className="rounded-3xl border border-sky-100 bg-gradient-to-br from-[#F0F9FF] via-white to-violet-50/50 p-6 shadow-sm sm:p-8 lg:col-span-7">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold text-[#2563EB]">Live Progress Snapshot</p>
                <h2 className="mt-1 font-display text-xl font-bold text-[#1E293B] sm:text-2xl">
                  Your Learning Activity
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('progress')}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-display text-xs font-semibold text-[#1E293B] shadow-sm transition-colors hover:border-sky-300 whitespace-nowrap self-start sm:self-auto"
              >
                Open Progress Dashboard
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <CheckCircle2 className="h-4 w-4 text-sky-500" aria-hidden="true" />
                  <span>Lessons</span>
                </div>
                <p className="mt-2 font-display text-xl font-extrabold text-[#1E293B] tabular-nums">
                  {completedLessonsCount}/{totalLessons}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#38BDF8]"
                    style={{ width: `${lessonsPercent}%` }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <Trophy className="h-4 w-4 text-violet-500" aria-hidden="true" />
                  <span>Challenges</span>
                </div>
                <p className="mt-2 font-display text-xl font-extrabold text-[#1E293B] tabular-nums">
                  {progress.completedChallenges.length}/{CODING_CHALLENGES.length}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#8B5CF6]"
                    style={{ width: `${challengesPercent}%` }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <Gamepad2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  <span>Mini-Games</span>
                </div>
                <p className="mt-2 font-display text-xl font-extrabold text-[#1E293B] tabular-nums">
                  {gamesCompletedCount}/8
                </p>
                <p className="mt-1 text-[11px] text-[#64748B] tabular-nums">
                  {progress.visitedSimulators.length}/8 sims tried
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <Flame className="h-4 w-4 text-amber-500" aria-hidden="true" />
                  <span>Active Streak</span>
                </div>
                <p className="mt-2 font-display text-xl font-extrabold text-[#1E293B] tabular-nums">
                  {streakDays} {streakDays === 1 ? 'day' : 'days'}
                </p>
                <p className="mt-1 text-[11px] text-[#64748B]">
                  {streakDays === 0 ? 'Complete a task today' : 'Verified browser streak'}
                </p>
              </div>
            </div>
          </div>

          {/* Featured Challenge Card (5 cols) */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#8B5CF6]">
                  <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                  Featured Next Challenge
                </span>
                <span className="font-mono text-[#64748B]">{nextChallenge.difficulty}</span>
              </div>

              <h3 className="mt-3 font-display text-xl font-bold text-[#1E293B]">
                {nextChallenge.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                {nextChallenge.description}
              </p>

              <div className="mt-4 rounded-2xl bg-[#0F172A] px-4 py-3 font-mono text-xs text-slate-300">
                <div className="text-[11px] text-slate-400">Sample Output:</div>
                <pre className="mt-1 whitespace-pre-wrap text-emerald-300">
                  {nextChallenge.sampleOutput}
                </pre>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenGamesTab('challenges')}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] px-4 py-2 font-display text-sm font-semibold text-white shadow-sm transition-all hover:opacity-95 whitespace-nowrap"
              >
                Solve Challenge
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onOpenGamesTab('mini-games')}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2 font-display text-sm font-medium text-[#1E293B] transition-colors hover:border-sky-300 hover:bg-[#F0F9FF] whitespace-nowrap"
              >
                Try Mini-Games
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-1.5">
              <PyVerseLogo size="md" />
              <p className="font-display text-sm font-semibold text-[#1E293B]">
                Think. Code. Experiment.
              </p>
              <p className="max-w-md text-xs text-[#64748B]">
                Interactive Python learning world for Python Basics, Conditional Statements, and
                Loops.
              </p>
            </div>

            <nav
              aria-label="Footer navigation"
              className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-[#64748B]"
            >
              <button
                type="button"
                onClick={() => onNavigate('learn')}
                className="hover:text-[#2563EB] transition-colors"
              >
                Learn
              </button>
              <button
                type="button"
                onClick={() => onNavigate('simulators')}
                className="hover:text-[#2563EB] transition-colors"
              >
                Simulators
              </button>
              <button
                type="button"
                onClick={() => onNavigate('playground')}
                className="hover:text-[#2563EB] transition-colors"
              >
                Python Sandbox
              </button>
              <button
                type="button"
                onClick={() => onNavigate('tutor')}
                className="hover:text-[#2563EB] transition-colors"
              >
                AI Tutor
              </button>
              <button
                type="button"
                onClick={() => onNavigate('games')}
                className="hover:text-[#2563EB] transition-colors"
              >
                Games &amp; Challenges
              </button>
              <button
                type="button"
                onClick={() => onNavigate('progress')}
                className="hover:text-[#2563EB] transition-colors"
              >
                Progress
              </button>
            </nav>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-2 border-t border-slate-100 pt-5 text-xs text-[#64748B] sm:flex-row">
            <span>© {new Date().getFullYear()} PyVerse. Built for beginner Python learners.</span>
            <span>Python Basics · Conditional Statements · Loops</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
