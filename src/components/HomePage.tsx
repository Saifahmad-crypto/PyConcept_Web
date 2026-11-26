import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  BookOpen,
  Cpu,
  Code2,
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
  FlaskConical,
  Compass,
  Clock,
} from 'lucide-react';
import {
  GamesHubTabId,
  LabTabId,
  LearningProgress,
  RevisionTabId,
  SectionId,
  TopicId,
} from '../types';
import {
  TOPIC_BASICS_LESSONS,
  TOPIC_08_LESSONS,
  TOPIC_09_LESSONS,
  CODING_CHALLENGES,
} from '../data/curriculumData';
import { SIMULATORS_CATALOG } from '../simulators/simulatorsData';
import { getLearnerLevel } from '../data/ecosystemData';
import { computeStreakDays } from '../hooks/useProgress';
import { DailyQuestCard } from './DailyQuestCard';
import { PyVerseLogo } from './PyVerseLogo';

interface HomePageProps {
  progress: LearningProgress;
  onNavigate: (section: SectionId) => void;
  onOpenTopic: (topic: TopicId) => void;
  onOpenLabTab: (tab: LabTabId) => void;
  onOpenGamesTab: (tab: GamesHubTabId) => void;
  onOpenRevisionTab: (tab: RevisionTabId) => void;
  onCompleteDailyQuest: (
    questId: string,
    title: string,
    topic: TopicId,
    xpReward: number
  ) => void;
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
  onOpenLabTab,
  onOpenGamesTab,
  onOpenRevisionTab,
  onCompleteDailyQuest,
}) => {
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
  const streakDays = computeStreakDays(progress.activeDates);
  const levelInfo = getLearnerLevel(progress.xp);

  const nextChallenge =
    CODING_CHALLENGES.find((ch) => !progress.completedChallenges.includes(ch.id)) ??
    CODING_CHALLENGES[0];

  const featuredSimulator =
    SIMULATORS_CATALOG.find((s) => !progress.visitedSimulators.includes(s.id)) ??
    SIMULATORS_CATALOG[0];

  const recentActivities = Object.values(progress.activities)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 4);

  const isBrandNewLearner =
    progress.xp === 0 &&
    completedLessonsCount === 0 &&
    progress.simulatorRuns === 0 &&
    progress.sandboxRuns === 0;

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
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col justify-center lg:col-span-6">
            <p className="text-xs font-semibold tracking-wide text-[#2563EB]">
              PyVerse · Think. Code. Experiment.
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
              Don&apos;t just read Python—explore it through interactive missions, visual memory
              diagrams, 8 real-life simulators, coding games, a live studio, and an adaptive AI
              tutor.
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
                onClick={() => onOpenLabTab('simulators')}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-display text-sm font-semibold text-[#1E293B] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-[#F0F9FF] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              >
                <Play className="h-4 w-4 text-[#8B5CF6]" aria-hidden="true" />
                Explore Simulators
              </button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-200/80 pt-5 text-xs font-medium text-[#64748B]">
              <span className="tabular-nums">
                <strong className="font-semibold text-[#1E293B]">17</strong> Guided Missions
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
                <strong className="font-semibold text-[#1E293B]">Escape Room</strong> &amp;{' '}
                <strong className="font-semibold text-[#1E293B]">Bug Hunter Lab</strong>
              </span>
            </div>
          </div>

          {/* Custom Interactive Hero Lab Visual */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border border-sky-200/80 bg-white p-5 shadow-xl shadow-sky-900/5 sm:p-6">
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

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-12">
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

                  <div className="mt-3 border-t border-slate-800 pt-2.5 text-[11px]">
                    <div className="text-slate-400">Output:</div>
                    <div className="mt-1 font-semibold text-emerald-300">
                      {heroPasses ? 'Star 1 · Star 2 · Star 3' : 'Try Again'}
                    </div>
                  </div>
                </div>

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

                    <line
                      x1="130"
                      y1="34"
                      x2="130"
                      y2="54"
                      stroke="#2563EB"
                      strokeWidth="2"
                      className="animate-flow-dash"
                    />

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

      {/* 2. SIX PLATFORM DESTINATIONS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[#8B5CF6]">
              Explore PyVerse
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-[#1E293B] sm:text-3xl">
              Six Connected Learning Destinations
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#64748B]">
            Every workspace connects to one shared XP, mission, and skill-tracking engine.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Learning World',
              tag: 'Adventure Map & Missions',
              desc: 'Follow connected Python topics, complete hands-on missions, and earn XP.',
              cta: 'Enter Learning World',
              icon: Compass,
              tone: 'bg-sky-50 text-[#2563EB]',
              action: () => onNavigate('learn'),
            },
            {
              title: 'Interactive Lab',
              tag: '8 Simulators & Visualizers',
              desc: 'Run real-life machines, Memory Explorer, Execution Tracer, and Flowchart Builder.',
              cta: 'Open Interactive Lab',
              icon: FlaskConical,
              tone: 'bg-violet-50 text-[#8B5CF6]',
              action: () => onNavigate('lab'),
            },
            {
              title: 'Game Zone',
              tag: '8 Games, Vault & Bug Lab',
              desc: 'Play logic games, crack the 5-room Python Escape Vault, and squash code bugs.',
              cta: 'Play Game Zone',
              icon: Gamepad2,
              tone: 'bg-emerald-50 text-emerald-700',
              action: () => onNavigate('games'),
            },
            {
              title: 'Coding Studio',
              tag: 'Sandbox & Verified Challenges',
              desc: 'Write Python with input() support, save snippets, and pass automated tests.',
              cta: 'Launch Coding Studio',
              icon: Code2,
              tone: 'bg-slate-900 text-sky-400',
              action: () => onNavigate('studio'),
            },
            {
              title: 'AI Personal Tutor',
              tag: '9 Adaptive Teaching Modes',
              desc: 'Get beginner-friendly guidance, line-by-line explanations, and code reviews.',
              cta: 'Ask AI Tutor',
              icon: Sparkles,
              tone: 'bg-gradient-to-br from-[#38BDF8] to-[#8B5CF6] text-white',
              action: () => onNavigate('tutor'),
            },
            {
              title: 'Revision Hub',
              tag: 'Cheat Sheets, Cards & Quizzes',
              desc: 'Revise fast with interactive flashcards, mixed drills, visual notes, and quizzes.',
              cta: 'Open Revision Hub',
              icon: BookOpen,
              tone: 'bg-amber-50 text-amber-700',
              action: () => onOpenRevisionTab('cheat-sheets'),
            },
          ].map((dest) => {
            const Icon = dest.icon;
            return (
              <button
                key={dest.title}
                type="button"
                onClick={dest.action}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${dest.tone}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-[#64748B]">
                      {dest.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-[#1E293B]">
                    {dest.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#64748B]">{dest.desc}</p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 font-display text-xs font-semibold text-[#2563EB] group-hover:gap-2.5 transition-all">
                  {dest.cta} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. CONNECTED LEARNING JOURNEY PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold text-[#2563EB]">Guided Path</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold text-[#1E293B]">
                Your Connected Learning Journey
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('learn')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#8B5CF6]"
            >
              View Full Adventure Map <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-7 grid grid-cols-1 items-center gap-4 lg:grid-cols-11">
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
                          Level {step.number}
                        </span>
                        <span className="font-mono text-xs font-semibold text-[#2563EB] tabular-nums">
                          {stat.done}/{stat.total} sections
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

      {/* 4. DAILY PYTHON QUEST + PROGRESS / XP / RECENT ACTIVITY */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <DailyQuestCard
              completedDailyQuests={progress.completedDailyQuests}
              onCompleteDailyQuest={onCompleteDailyQuest}
              compact
            />
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-sky-100 bg-gradient-to-br from-[#F0F9FF] via-white to-violet-50/50 p-6 shadow-sm lg:col-span-5">
            <div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-[#2563EB]">XP &amp; Activity</p>
                  <h2 className="mt-0.5 font-display text-xl font-bold text-[#1E293B]">
                    {levelInfo.current.title}
                  </h2>
                </div>
                <span className="font-mono text-sm font-extrabold text-[#2563EB] tabular-nums">
                  {progress.xp} XP
                </span>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-[11px] font-mono text-[#64748B] tabular-nums">
                  <span>Level {levelInfo.current.level}</span>
                  <span>
                    {levelInfo.next
                      ? `${levelInfo.xpToNext} XP to ${levelInfo.next.title}`
                      : 'Max Explorer Rank'}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200/80">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#8B5CF6] transition-all duration-300"
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-sky-500" aria-hidden="true" />
                    Lessons
                  </div>
                  <p className="mt-1 font-mono text-lg font-bold text-[#1E293B] tabular-nums">
                    {completedLessonsCount}/{totalLessons}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                    <Trophy className="h-3.5 w-3.5 text-violet-500" aria-hidden="true" />
                    Missions
                  </div>
                  <p className="mt-1 font-mono text-lg font-bold text-[#1E293B] tabular-nums">
                    {progress.completedMissions.length}/17
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                    <Flame className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                    Streak
                  </div>
                  <p className="mt-1 font-mono text-lg font-bold text-[#1E293B] tabular-nums">
                    {streakDays}d
                  </p>
                </div>
              </div>

              {/* Real Recently Visited Activity OR Onboarding Prompt */}
              <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-4">
                <p className="flex items-center gap-1.5 text-xs font-bold text-[#1E293B]">
                  <Clock className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />
                  {isBrandNewLearner ? 'New Explorer Onboarding' : 'Recent Recorded Activity'}
                </p>

                {isBrandNewLearner ? (
                  <p className="mt-1.5 text-xs leading-relaxed text-[#64748B]">
                    No XP recorded yet—complete today&apos;s Daily Quest on the left or open Mission
                    M1.1 in Learning World to earn your first XP and unlock your first badge.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-1.5 text-xs">
                    {recentActivities.map((act) => (
                      <li
                        key={act.id}
                        className="flex items-center justify-between gap-2 text-[#1E293B]"
                      >
                        <span className="truncate">{act.title}</span>
                        <span className="shrink-0 font-mono font-semibold text-emerald-700 tabular-nums">
                          +{act.xpAwarded} XP
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('progress')}
              className="mt-5 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-display text-xs font-semibold text-[#1E293B] shadow-xs transition-colors hover:border-sky-300 hover:bg-[#F0F9FF]"
            >
              Open Progress Dashboard
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. FEATURED SIMULATOR + FEATURED CODING CHALLENGE */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Featured Simulator */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-7 lg:col-span-6">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#2563EB]">
                  <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
                  Featured Simulator
                </span>
                <span className="font-mono text-[#64748B]">
                  {featuredSimulator.difficulty} · {featuredSimulator.category}
                </span>
              </div>
              <h3 className="mt-3 font-display text-xl font-bold text-[#1E293B]">
                {featuredSimulator.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                {featuredSimulator.realLifeScenario}
              </p>
              <p className="mt-3 font-mono text-xs font-semibold text-[#8B5CF6]">
                Concepts: {featuredSimulator.concepts.join(' · ')}
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onOpenLabTab('simulators')}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#8B5CF6] px-4 py-2 font-display text-xs font-semibold text-white shadow-sm hover:opacity-95"
              >
                Launch Simulator
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onOpenLabTab('flowchart-builder')}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2 font-display text-xs font-medium text-[#1E293B] hover:border-sky-300"
              >
                Try Flowchart Builder
              </button>
            </div>
          </div>

          {/* Featured Challenge */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-7 lg:col-span-6">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#8B5CF6]">
                  <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                  Featured Coding Challenge
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
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] px-4 py-2 font-display text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 whitespace-nowrap"
              >
                Solve Challenge
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onOpenGamesTab('bug-hunter')}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2 font-display text-xs font-medium text-[#1E293B] transition-colors hover:border-sky-300 hover:bg-[#F0F9FF] whitespace-nowrap"
              >
                Open Bug Hunter Lab
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONSISTENT FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="space-y-2 md:col-span-5">
              <PyVerseLogo size="md" />
              <p className="font-display text-sm font-semibold text-[#1E293B]">
                Think. Code. Experiment.
              </p>
              <p className="max-w-sm text-xs leading-relaxed text-[#64748B]">
                PyVerse is an interactive Python learning ecosystem combining visual lessons,
                simulators, debugging labs, coding challenges, and adaptive AI tutoring.
              </p>
            </div>

            <div className="md:col-span-3">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#1E293B]">
                Main Navigation
              </h3>
              <ul className="mt-3 space-y-1.5 text-xs text-[#64748B]">
                <li>
                  <button type="button" onClick={() => onNavigate('learn')} className="hover:text-[#2563EB]">
                    Learning World
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigate('lab')} className="hover:text-[#2563EB]">
                    Interactive Lab
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigate('games')} className="hover:text-[#2563EB]">
                    Game Zone
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigate('studio')} className="hover:text-[#2563EB]">
                    Coding Studio
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#1E293B]">
                Learning Resources
              </h3>
              <ul className="mt-3 space-y-1.5 text-xs text-[#64748B]">
                <li>
                  <button type="button" onClick={() => onNavigate('tutor')} className="hover:text-[#2563EB]">
                    PyVerse AI Personal Tutor
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onOpenRevisionTab('cheat-sheets')} className="hover:text-[#2563EB]">
                    Python Cheat Sheets &amp; Flashcards
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onOpenRevisionTab('quizzes')} className="hover:text-[#2563EB]">
                    Topic Quizzes
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigate('progress')} className="hover:text-[#2563EB]">
                    Progress Dashboard
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-2 border-t border-slate-100 pt-5 text-xs text-[#64748B] sm:flex-row">
            <span>© {new Date().getFullYear()} PyVerse. Built for beginner Python learners.</span>
            <span>Progress saved locally in your browser · Python Basics · Conditionals · Loops</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
