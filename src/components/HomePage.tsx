import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../data/translations';
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
  FlaskConical,
  Compass,
  Clock,
  Eye,
  Bug,
  KeyRound,
  Terminal,
  Sliders,
  Github,
  Instagram,
  Linkedin,
  Twitter,
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
import { getLearnerLevel, LEARNING_MISSIONS } from '../data/ecosystemData';
import { GAMES } from './MiniGames';
import { VAULT_ROOMS } from './games/PythonEscapeRoom';
import { computeStreakDays } from '../hooks/useProgress';
import { runPythonCode } from '../utils/pythonEngine';
import { DailyQuestCard } from './DailyQuestCard';
import { PyVerseLogo } from './PyVerseLogo';
import { HeroVisual } from './HeroVisual';

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

const LEARNING_STAGES = [
  {
    id: 'basics' as TopicId,
    number: '01',
    titleKey: 'home.stage.basics.title',
    defaultTitle: 'Python Basics',
    difficulty: 'Beginner',
    subtitleKey: 'home.stage.basics.subtitle',
    defaultSubtitle: 'Variables, object references, core types, f-strings, and 4-space indentation.',
    icon: Box,
  },
  {
    id: 'conditionals' as TopicId,
    number: '02',
    titleKey: 'home.stage.conditionals.title',
    defaultTitle: 'Conditional Statements',
    difficulty: 'Guided',
    subtitleKey: 'home.stage.conditionals.subtitle',
    defaultSubtitle: 'if / elif / else decision branches, nested checks, and boolean logic gates.',
    icon: GitBranch,
  },
  {
    id: 'loops' as TopicId,
    number: '03',
    titleKey: 'home.stage.loops.title',
    defaultTitle: 'Loops & Iteration',
    difficulty: 'Applied',
    subtitleKey: 'home.stage.loops.subtitle',
    defaultSubtitle: 'for loops, range(), while termination, break, continue, and nested grids.',
    icon: Repeat,
  },
];

const GAME_PREVIEWS = [
  { name: 'Condition Detective', tag: 'Conditionals', tab: 'mini-games' as GamesHubTabId },
  { name: 'Guess the Output', tag: 'Conditionals', tab: 'mini-games' as GamesHubTabId },
  { name: 'Decision Master', tag: 'Conditionals', tab: 'mini-games' as GamesHubTabId },
  { name: 'Loop Race', tag: 'Loops', tab: 'mini-games' as GamesHubTabId },
  { name: 'Number Sequence Challenge', tag: 'Loops', tab: 'mini-games' as GamesHubTabId },
  { name: 'Output Predictor', tag: 'Loops', tab: 'mini-games' as GamesHubTabId },
  { name: 'Loop Debugger', tag: 'Debugging', tab: 'mini-games' as GamesHubTabId },
  { name: 'Python Escape Room', tag: `${VAULT_ROOMS.length}-Room Vault`, tab: 'escape-room' as GamesHubTabId },
];

const PLAYGROUND_SNIPPETS = [
  {
    label: 'Decision Gate',
    code: `temp = 29\nif temp >= 30:\n    print("Cooling ON")\nelif temp >= 22:\n    print("Comfort Mode")\nelse:\n    print("Eco Standby")`,
  },
  {
    label: 'Loop Sequence',
    code: `total = 0\nfor floor in range(1, 5):\n    total += floor\n    print("Reached floor", floor)\nprint("Stops:", total)`,
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
  const { lang } = useLanguage();
  const [simFilter, setSimFilter] = useState<'conditionals' | 'loops'>('conditionals');
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [previewCode, setPreviewCode] = useState(PLAYGROUND_SNIPPETS[0].code);
  const [previewResult, setPreviewResult] = useState(() =>
    runPythonCode(PLAYGROUND_SNIPPETS[0].code)
  );

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

  const nextChallenge =
    CODING_CHALLENGES.find((ch) => !progress.completedChallenges.includes(ch.id)) ??
    CODING_CHALLENGES[0];

  const conditionalSimsCount = useMemo(
    () => SIMULATORS_CATALOG.filter((s) => s.category === 'conditionals').length,
    []
  );
  const loopSimsCount = useMemo(
    () => SIMULATORS_CATALOG.filter((s) => s.category === 'loops').length,
    []
  );

  const filteredSims = SIMULATORS_CATALOG.filter((s) => s.category === simFilter);

  const handleSelectSnippet = (idx: number) => {
    setSnippetIdx(idx);
    const nextCode = PLAYGROUND_SNIPPETS[idx].code;
    setPreviewCode(nextCode);
    setPreviewResult(runPythonCode(nextCode));
  };

  const handleRunPreview = () => {
    setPreviewResult(runPythonCode(previewCode));
  };

  const scrollToExplore = () => {
    const el = document.getElementById('pyverse-problem');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('learn');
    }
  };

  return (
    <div className="bg-[#FBF5F9] dark:bg-[#0f0303] text-[#100303] dark:text-[#f0eaea]">
      {/* 1. HERO — DARK EDITORIAL CANVAS */}
      <section className="bg-pyverse-dark-grid border-b border-[#2C1616] text-[#FBF5F9]">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="lg:col-span-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#2C1616] bg-[#190909] px-3.5 py-1.5 text-[11px] font-mono font-semibold tracking-wider text-[#FBF5F9] uppercase">
                <span className="h-2 w-2 rounded-full bg-[#E10906]" aria-hidden="true" />
                {t(lang, 'home.hero.badge')}
              </div>

              <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white text-balance sm:text-5xl lg:text-[3.75rem] lg:leading-[1.03]">
                {t(lang, 'home.hero.titlePart1')}{' '}
                <span className="text-[#E10906]">{t(lang, 'home.hero.titlePart2')}</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#CFC8C8] sm:text-lg">
                {t(lang, 'home.hero.subtitle')}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={scrollToExplore}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-[#E10906] px-6 py-3 font-display text-sm font-semibold text-white transition-colors hover:bg-[#C40705] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {t(lang, 'home.hero.ctaExplore')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('learn')}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-[#3A2222] bg-[#190909] px-6 py-3 font-display text-sm font-semibold text-[#FBF5F9] transition-colors hover:border-[#E10906] hover:text-white whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10906]"
                >
                  <Compass className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
                  {t(lang, 'home.hero.ctaLearn')}
                </button>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-[#2C1616] pt-6">
                <div>
                  <p className="font-mono text-xl font-bold text-white tabular-nums">{SIMULATORS_CATALOG.length}</p>
                  <p className="mt-0.5 text-xs text-[#8A8585] dark:text-[#9a8585]">{t(lang, 'home.hero.stat1')}</p>
                </div>
                <div>
                  <p className="font-mono text-xl font-bold text-white tabular-nums">{LEARNING_MISSIONS.length}</p>
                  <p className="mt-0.5 text-xs text-[#8A8585] dark:text-[#9a8585]">{t(lang, 'home.hero.stat2')}</p>
                </div>
                <div>
                  <p className="font-mono text-xl font-bold text-[#E10906] tabular-nums">{GAMES.length}+</p>
                  <p className="mt-0.5 text-xs text-[#8A8585] dark:text-[#9a8585]">{t(lang, 'home.hero.stat3')}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="lg:col-span-6"
            >
              <HeroVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM — WHY PASSIVE LEARNING FAILS */}
      <section
        id="pyverse-problem"
        className="border-b border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35 }}
            className="max-w-2xl"
          >
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#E10906]">
              {t(lang, 'home.problem.eyebrow')}
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-[#100303] dark:text-[#f0eaea] sm:text-4xl">
              {t(lang, 'home.problem.title')}
            </h2>
            <p className="mt-3 text-base text-[#8A8585] dark:text-[#9a8585]">
              {t(lang, 'home.problem.subtitle')}
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                num: '01',
                title: 'Invisible Memory State',
                desc: 'Variables change line by line, yet static text never reveals what is stored in memory.',
                diagram: 'x = 10  →  x = 24',
              },
              {
                num: '02',
                title: 'Unclear Branching',
                desc: 'Beginners guess why an elif skipped or an else ran instead of seeing the condition gate.',
                diagram: 'if False → elif True',
              },
              {
                num: '03',
                title: 'Abstract Iteration',
                desc: 'Off-by-one range() bounds and while updates feel mysterious without live visual stepping.',
                diagram: 'for i in range(1, 5)',
              },
            ].map((item) => (
              <div
                key={item.num}
                className="flex flex-col justify-between rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-[#E10906]">{item.num}</span>
                  <h3 className="mt-3 font-display text-lg font-bold text-[#100303] dark:text-[#f0eaea]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#8A8585] dark:text-[#9a8585]">{item.desc}</p>
                </div>
                <div className="mt-5 rounded-lg border border-[#F1EEEE] dark:border-[#2a1212] bg-[#FBF5F9] dark:bg-[#0f0303] px-3 py-2 font-mono text-xs font-semibold text-[#100303] dark:text-[#f0eaea]">
                  {item.diagram}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE PYVERSE APPROACH + DAILY QUEST & LIVE PROGRESS */}
      <section className="border-b border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#E10906]">
                02 · The PyVerse Approach
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-[#100303] dark:text-[#f0eaea] sm:text-4xl">
                Learn. Experiment. Understand.
              </h2>
            </div>
            <p className="max-w-md text-sm text-[#8A8585] dark:text-[#9a8585]">
              Every concept flows from visual intuition to hands-on experimentation and real Python execution.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                step: '01 · LEARN',
                title: 'Visual Explanations',
                desc: 'Short, interactive stages with flowcharts, variable boxes, and zero text walls.',
                icon: Eye,
              },
              {
                step: '02 · EXPERIMENT',
                title: 'Synchronized Simulators',
                desc: 'Adjust live sliders and watch Python code lines, variables, and machines respond in sync.',
                icon: Sliders,
              },
              {
                step: '03 · UNDERSTAND',
                title: 'Games, Challenges & AI Tutor',
                desc: 'Reinforce intuition through debugging labs, escape rooms, and adaptive feedback.',
                icon: Sparkles,
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.step}
                  className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#8A8585] dark:text-[#9a8585]">{card.step}</span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#100303] text-[#FBF5F9]">
                      <Icon className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-[#100303] dark:text-[#f0eaea]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#8A8585] dark:text-[#9a8585]">{card.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Live Daily Quest + Real Progress Card */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <DailyQuestCard
                completedDailyQuests={progress.completedDailyQuests}
                onCompleteDailyQuest={onCompleteDailyQuest}
                compact
              />
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-6 lg:col-span-5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs font-semibold text-[#E10906]">
                      LIVE TELEMETRY
                    </p>
                    <h3 className="mt-0.5 font-display text-xl font-bold text-[#100303] dark:text-[#f0eaea]">
                      {levelInfo.current.title}
                    </h3>
                  </div>
                  <span className="font-mono text-sm font-extrabold text-[#100303] dark:text-[#f0eaea] tabular-nums">
                    {progress.xp} XP
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between font-mono text-[11px] text-[#8A8585] dark:text-[#9a8585] tabular-nums">
                    <span>Level {levelInfo.current.level}</span>
                    <span>
                      {levelInfo.next
                        ? `${levelInfo.xpToNext} XP to ${levelInfo.next.title}`
                        : 'Max Explorer Rank'}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#F1EEEE] dark:bg-[#221010]">
                    <div
                      className="h-full rounded-full bg-[#E10906] transition-all duration-300"
                      style={{ width: `${levelInfo.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8A8585] dark:text-[#9a8585]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#E10906]" aria-hidden="true" />
                      Lessons
                    </div>
                    <p className="mt-1 font-mono text-lg font-bold text-[#100303] dark:text-[#f0eaea] tabular-nums">
                      {completedLessonsCount}/{totalLessons}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8A8585] dark:text-[#9a8585]">
                      <Trophy className="h-3.5 w-3.5 text-[#100303] dark:text-[#f0eaea]" aria-hidden="true" />
                      Missions
                    </div>
                    <p className="mt-1 font-mono text-lg font-bold text-[#100303] dark:text-[#f0eaea] tabular-nums">
                      {progress.completedMissions.length}/{LEARNING_MISSIONS.length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8A8585] dark:text-[#9a8585]">
                      <Flame className="h-3.5 w-3.5 text-[#E10906]" aria-hidden="true" />
                      Streak
                    </div>
                    <p className="mt-1 font-mono text-lg font-bold text-[#100303] dark:text-[#f0eaea] tabular-nums">
                      {streakDays}d
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4">
                  <p className="flex items-center gap-1.5 text-xs font-bold text-[#100303] dark:text-[#f0eaea]">
                    <Clock className="h-3.5 w-3.5 text-[#E10906]" aria-hidden="true" />
                    {isBrandNewLearner ? 'Start Tracking Real Progress' : 'Recent Recorded Activity'}
                  </p>

                  {isBrandNewLearner ? (
                    <p className="mt-1.5 text-xs leading-relaxed text-[#8A8585] dark:text-[#9a8585]">
                      Your progress starts at 0 XP. Complete today&apos;s Daily Quest or open
                      Mission M1.1 in Learning World to record your first real XP.
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-1.5 text-xs">
                      {recentActivities.map((act) => (
                        <li
                          key={act.id}
                          className="flex items-center justify-between gap-2 text-[#100303] dark:text-[#f0eaea]"
                        >
                          <span className="truncate">{act.title}</span>
                          <span className="shrink-0 font-mono font-semibold text-[#E10906] tabular-nums">
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
                className="mt-5 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-[#100303] dark:border-[#9a8585] bg-white dark:bg-[#1a0808] px-4 py-2 font-display text-xs font-semibold text-[#100303] dark:text-[#f0eaea] transition-colors hover:bg-[#100303] dark:hover:bg-[#f0eaea] hover:text-white dark:hover:text-[#100303]"
              >
                Open Progress Dashboard
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXPLORE THE LEARNING WORLD — DARK CONTRAST SECTION */}
      <section className="bg-[#100303] py-16 text-[#FBF5F9] lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#E10906]">
                {t(lang, 'home.world.eyebrow')}
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
                Connected stages. Clear progression.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('learn')}
              className="inline-flex items-center gap-2 self-start rounded-xl bg-[#E10906] px-4 py-2.5 font-display text-xs font-semibold text-white hover:bg-[#C40705]"
            >
              Open Adventure Map
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-11">
            {LEARNING_STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const stat = getTopicProgress(stage.id);
              const pct = stat.total > 0 ? Math.round((stat.done / stat.total) * 100) : 0;

              return (
                <React.Fragment key={stage.id}>
                  <button
                    type="button"
                    onClick={() => onOpenTopic(stage.id)}
                    className="group flex flex-col justify-between rounded-2xl border border-[#2C1616] bg-[#190909] p-6 text-left transition-colors hover:border-[#E10906] lg:col-span-3"
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="font-bold text-[#E10906]">STAGE {stage.number}</span>
                        <span className="text-[#8A8585] dark:text-[#9a8585] tabular-nums">
                          {stat.done}/{stat.total} lessons
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2C1616] bg-[#100303] text-[#FBF5F9] group-hover:border-[#E10906]">
                          <Icon className="h-5 w-5 text-[#E10906]" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-bold text-white">
                            {t(lang, stage.titleKey)}
                          </h3>
                          <span className="font-mono text-[11px] text-[#8A8585] dark:text-[#9a8585]">
                            {stage.difficulty}
                          </span>
                        </div>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-[#CFC8C8]">
                        {t(lang, stage.subtitleKey)}
                      </p>
                    </div>

                    <div className="mt-5">
                      <div className="flex justify-between font-mono text-[11px] text-[#8A8585] dark:text-[#9a8585] tabular-nums">
                        <span>Progress</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#2C1616]">
                        <div
                          className="h-full rounded-full bg-[#E10906] transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </button>

                  {idx < LEARNING_STAGES.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="hidden items-center justify-center lg:col-span-1 lg:flex"
                    >
                      <ArrowRight className="h-5 w-5 text-[#E10906]" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* 6 Connected Workspaces Strip */}
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {[
              { title: 'Learning World', icon: Compass, action: () => onNavigate('learn') },
              { title: 'Interactive Lab', icon: FlaskConical, action: () => onNavigate('lab') },
              { title: 'Game Zone', icon: Gamepad2, action: () => onNavigate('games') },
              { title: 'Playground', icon: Code2, action: () => onNavigate('studio') },
              { title: 'AI Tutor', icon: Sparkles, action: () => onNavigate('tutor') },
              { title: 'Revision Hub', icon: BookOpen, action: () => onOpenRevisionTab('cheat-sheets') },
            ].map((dest) => {
              const Icon = dest.icon;
              return (
                <button
                  key={dest.title}
                  type="button"
                  onClick={dest.action}
                  className="flex items-center justify-between rounded-xl border border-[#2C1616] bg-[#190909] px-4 py-3 text-left text-xs font-semibold text-[#FBF5F9] transition-colors hover:border-[#E10906] hover:text-white"
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
                    {dest.title}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#8A8585] dark:text-[#9a8585]" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE SIMULATORS PREVIEW */}
      <section className="border-b border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#E10906]">
                {t(lang, 'home.sims.eyebrow')}
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-[#100303] dark:text-[#f0eaea] sm:text-4xl">
                {SIMULATORS_CATALOG.length} real-life Python machines.
              </h2>
              <p className="mt-2 max-w-xl text-sm text-[#8A8585] dark:text-[#9a8585]">
                Every simulator synchronizes animated visuals with active code lines, live
                variables, and step controls.
              </p>
            </div>

            <div className="inline-flex rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-1">
              {(
                [
                  { id: 'conditionals', label: `Conditionals (${conditionalSimsCount})` },
                  { id: 'loops', label: `Loops (${loopSimsCount})` },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSimFilter(t.id)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                    simFilter === t.id
                      ? 'bg-[#100303] dark:bg-[#f0eaea] text-white dark:text-[#100303]'
                      : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredSims.map((sim) => (
              <div
                key={sim.id}
                className="flex flex-col justify-between rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-5 transition-colors hover:border-[#100303] dark:hover:border-[#9a8585]"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-bold text-[#E10906]">{sim.number}</span>
                    <span className="text-[#8A8585] dark:text-[#9a8585]">{sim.difficulty}</span>
                  </div>
                  <h3 className="mt-3 font-display text-base font-bold text-[#100303] dark:text-[#f0eaea]">
                    {sim.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#8A8585] dark:text-[#9a8585]">
                    {sim.shortDescription}
                  </p>
                </div>

                <div className="mt-5 border-t border-[#F1EEEE] dark:border-[#2a1212] pt-3.5">
                  <p className="font-mono text-[11px] font-medium text-[#100303] dark:text-[#f0eaea]">
                    {sim.concepts.join(' · ')}
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenLabTab('simulators')}
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#100303] dark:bg-[#f0eaea] px-3 py-2 text-xs font-semibold text-white dark:text-[#100303] transition-colors hover:bg-[#E10906] dark:hover:bg-[#E10906] dark:hover:text-white"
                  >
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    {t(lang, 'home.sims.launchInLab')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GAME ZONE PREVIEW */}
      <section className="border-b border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#E10906]">
                {t(lang, 'home.games.eyebrow')}
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-[#100303] dark:text-[#f0eaea] sm:text-4xl">
                {t(lang, 'home.games.title')}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => onOpenGamesTab('mini-games')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#E10906] px-4 py-2.5 font-display text-xs font-semibold text-white hover:bg-[#C40705]"
              >
                <Gamepad2 className="h-4 w-4" aria-hidden="true" />
                Enter Game Zone
              </button>
              <button
                type="button"
                onClick={() => onOpenGamesTab('bug-hunter')}
                className="inline-flex items-center gap-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-4 py-2.5 font-display text-xs font-semibold text-[#100303] dark:text-[#f0eaea] hover:border-[#100303] dark:hover:border-[#9a8585]"
              >
                <Bug className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
                Bug Hunter Lab
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GAME_PREVIEWS.map((g, i) => (
              <button
                key={g.name}
                type="button"
                onClick={() => onOpenGamesTab(g.tab)}
                className="group flex flex-col justify-between rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-5 text-left transition-colors hover:border-[#100303] dark:hover:border-[#9a8585] hover:bg-white dark:hover:bg-[#221010]"
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#8A8585] dark:text-[#9a8585]">0{i + 1}</span>
                  <span className="font-semibold text-[#E10906]">{g.tag}</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <h3 className="font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">{g.name}</h3>
                  {g.name === 'Python Escape Room' ? (
                    <KeyRound className="h-4 w-4 shrink-0 text-[#E10906]" aria-hidden="true" />
                  ) : (
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-[#8A8585] dark:text-[#9a8585] transition-transform group-hover:translate-x-0.5 group-hover:text-[#E10906]"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PYTHON PLAYGROUND PREVIEW — DARK INTERACTIVE BAND */}
      <section className="bg-[#100303] py-16 text-[#FBF5F9] lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#E10906]">
                {t(lang, 'home.playground.eyebrow')}
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
                {t(lang, 'home.playground.title')}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#CFC8C8]">
                Test ideas in the live coding workspace with syntax highlighting, sample scripts,
                input() simulation, and beginner-friendly error guidance.
              </p>

              <div className="mt-6 rounded-xl border border-[#2C1616] bg-[#190909] p-4">
                <span className="font-mono text-[11px] font-semibold text-[#E10906]">
                  NEXT CHALLENGE · {nextChallenge.difficulty.toUpperCase()}
                </span>
                <p className="mt-1 font-display text-sm font-bold text-white">
                  {nextChallenge.title}
                </p>
                <p className="mt-1 text-xs text-[#8A8585] dark:text-[#9a8585]">{nextChallenge.description}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('studio')}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#E10906] px-5 py-2.5 font-display text-xs font-semibold text-white hover:bg-[#C40705]"
                >
                  <Terminal className="h-4 w-4" aria-hidden="true" />
                  Open Python Playground
                </button>
                <button
                  type="button"
                  onClick={() => onOpenGamesTab('challenges')}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#3A2222] bg-[#190909] px-4 py-2.5 font-display text-xs font-semibold text-[#FBF5F9] hover:border-[#E10906]"
                >
                  View Coding Challenges
                </button>              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-[#2C1616] bg-[#190909]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2C1616] px-4 py-3">
                  <div className="flex items-center gap-2">
                    {PLAYGROUND_SNIPPETS.map((s, idx) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => handleSelectSnippet(idx)}
                        className={`rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
                          snippetIdx === idx
                            ? 'bg-[#E10906] text-white'
                            : 'bg-[#100303] text-[#8A8585] dark:text-[#9a8585] hover:text-white'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleRunPreview}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#FBF5F9] dark:bg-[#0f0303] px-3 py-1.5 font-mono text-xs font-bold text-[#100303] dark:text-[#f0eaea] hover:bg-white dark:hover:bg-[#221010]"
                  >
                    <Play className="h-3.5 w-3.5 text-[#E10906]" aria-hidden="true" />
                    Run Code
                  </button>
                </div>

                <textarea
                  value={previewCode}
                  onChange={(e) => setPreviewCode(e.target.value)}
                  rows={7}
                  aria-label="Homepage Python playground preview editor"
                  spellCheck={false}
                  className="w-full resize-none bg-[#100303] p-4 font-mono text-xs leading-relaxed text-[#FBF5F9] focus:outline-none sm:text-sm"
                />

                <div className="border-t border-[#2C1616] bg-[#140505] px-4 py-3 font-mono text-xs">
                  <span className="text-[#8A8585] dark:text-[#9a8585]">Console Output:</span>
                  <pre className="mt-1.5 whitespace-pre-wrap text-emerald-300">
                    {previewResult.success
                      ? previewResult.output || '(no output)'
                      : `${previewResult.error?.type}: ${previewResult.error?.message}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. ADAPTIVE AI TUTOR */}
      <section className="border-b border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 sm:p-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#E10906]">
                {t(lang, 'home.tutor.eyebrow')}
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-[#100303] dark:text-[#f0eaea]">
                {t(lang, 'home.tutor.title')}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#8A8585] dark:text-[#9a8585]">
                {t(lang, 'home.tutor.subtitle')}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('tutor')}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#E10906] px-5 py-2.5 font-display text-xs font-semibold text-white hover:bg-[#C40705]"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  {t(lang, 'home.tutor.openBtn')}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenLabTab('execution-visualizer')}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-4 py-2.5 font-display text-xs font-semibold text-[#100303] dark:text-[#f0eaea] hover:border-[#100303] dark:hover:border-[#9a8585]"
                >
                  Try Execution Visualizer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-6">
              {[
                {
                  label: 'Active Topic Context',
                  val: progress.activeTutorTopic,
                },
                {
                  label: 'Difficulty Calibration',
                  val: progress.tutorDifficulty,
                },
                {
                  label: 'Teaching Modes',
                  val: '9 Modes · Hints First',
                },
                {
                  label: 'Simulator Bridge',
                  val: 'Line & Variable Sync',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-4"
                >
                  <span className="font-mono text-[11px] font-semibold text-[#8A8585] dark:text-[#9a8585]">
                    {item.label}
                  </span>
                  <p className="mt-1.5 font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8.5 ABOUT THE CREATOR */}
      <section className="border-t border-[#E5DFDF] dark:border-[#2C1616] bg-white dark:bg-[#120404] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-gradient-to-br from-[#FBF5F9] via-white to-red-50/20 dark:from-[#190909] dark:via-[#140404] dark:to-[#090101] p-8 sm:p-12 shadow-xl shadow-red-950/5 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 items-center relative z-10">
              <div className="md:col-span-4 flex justify-center md:justify-start">
                <div className="relative group">
                  <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#E10906] to-purple-600 opacity-70 blur-md group-hover:opacity-100 transition-opacity" />
                  <img
                    src="creator.jpg"
                    alt="Saif Ahmad - Creator of PyVerse"
                    className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-2xl object-cover shadow-2xl border-2 border-white dark:border-[#2a1212]"
                    onError={(e) => {
                      // Fallback if image path differs
                      (e.currentTarget as HTMLImageElement).src = '/PyConcept_Web/creator.jpg';
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4 md:col-span-8 text-center md:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 font-mono text-xs font-semibold text-[#E10906]">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  About the Creator
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#100303] dark:text-[#f0eaea]">
                  Hi, I'm <span className="text-[#E10906]">Saif Ahmad</span> 👋
                </h2>

                <p className="text-sm leading-relaxed text-[#8A8585] dark:text-[#9a8585] max-w-2xl">
                  Creator &amp; Architect of <strong>PyVerse</strong>. I built PyVerse to reimagine how Python conditionals and loops are learned—bridging the gap between static theory and real-world algorithmic intuition through interactive visual simulations, 3D stages, and synchronized execution trace engines.
                </p>

                {/* Social Links with Icons */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                  <a
                    href="https://x.com/Saif4hmad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-4 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] transition-all hover:border-[#E10906] hover:text-[#E10906] shadow-xs hover:shadow-md"
                    title="Follow on X: @Saif4hmad"
                  >
                    <Twitter className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
                    <span>X (Twitter)</span>
                  </a>

                  <a
                    href="https://github.com/saifahmad-crypto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-4 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] transition-all hover:border-[#E10906] hover:text-[#E10906] shadow-xs hover:shadow-md"
                    title="GitHub: saifahmad-crypto"
                  >
                    <Github className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
                    <span>GitHub</span>
                  </a>

                  <a
                    href="https://www.instagram.com/saif_4hmad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-4 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] transition-all hover:border-[#E10906] hover:text-[#E10906] shadow-xs hover:shadow-md"
                    title="Instagram: @saif_4hmad"
                  >
                    <Instagram className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
                    <span>Instagram</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/saif-ahmad-tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-4 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] transition-all hover:border-[#E10906] hover:text-[#E10906] shadow-xs hover:shadow-md"
                    title="LinkedIn: saif-ahmad-tech"
                  >
                    <Linkedin className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA + EDITORIAL FOOTER */}
      <section className="bg-[#100303] text-[#FBF5F9]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col items-start justify-between gap-6 border-b border-[#2C1616] pb-14 md:flex-row md:items-center">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#E10906]">
                Think. Code. Experiment.
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
                {t(lang, 'home.footer.title')}
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('learn')}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-[#E10906] px-6 py-2.5 font-display text-sm font-semibold text-white hover:bg-[#C40705]"
              >
                Start Learning
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onOpenLabTab('simulators')}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-[#3A2222] bg-[#190909] px-5 py-2.5 font-display text-sm font-semibold text-white hover:border-[#E10906]"
              >
                <Cpu className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
                {t(lang, 'home.footer.labBtn')}
              </button>
            </div>
          </div>

          <footer className="pt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
              <div className="space-y-3 md:col-span-5">
                <PyVerseLogo size="md" theme="dark" />
                <p className="font-display text-sm font-semibold text-white">
                  Think. Code. Experiment.
                </p>
                <p className="max-w-sm text-xs leading-relaxed text-[#8A8585] dark:text-[#9a8585]">
                  PyVerse is an interactive Python learning universe combining visual lessons,
                  real-life simulators, debugging labs, coding games, and adaptive tutoring.
                </p>
                <div className="flex items-center gap-2.5 pt-2">
                  <a
                    href="https://x.com/Saif4hmad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#2C1616] bg-[#190909] text-[#8A8585] dark:text-[#9a8585] transition-colors hover:border-[#E10906] hover:bg-[#E10906] hover:text-white"
                    aria-label="X Profile"
                    title="X: @Saif4hmad"
                  >
                    <Twitter className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href="https://github.com/saifahmad-crypto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#2C1616] bg-[#190909] text-[#8A8585] dark:text-[#9a8585] transition-colors hover:border-[#E10906] hover:bg-[#E10906] hover:text-white"
                    aria-label="GitHub Profile"
                    title="GitHub: saifahmad-crypto"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.instagram.com/saif_4hmad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#2C1616] bg-[#190909] text-[#8A8585] dark:text-[#9a8585] transition-colors hover:border-[#E10906] hover:bg-[#E10906] hover:text-white"
                    aria-label="Instagram Profile"
                    title="Instagram: @saif_4hmad"
                  >
                    <Instagram className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/saif-ahmad-tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#2C1616] bg-[#190909] text-[#8A8585] dark:text-[#9a8585] transition-colors hover:border-[#E10906] hover:bg-[#E10906] hover:text-white"
                    aria-label="LinkedIn Profile"
                    title="LinkedIn: saif-ahmad-tech"
                  >
                    <Linkedin className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="md:col-span-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  Workspaces
                </h3>
                <ul className="mt-3 space-y-2 text-xs text-[#8A8585] dark:text-[#9a8585]">
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('learn')}
                      className="hover:text-[#E10906]"
                    >
                      Learning World
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('lab')}
                      className="hover:text-[#E10906]"
                    >
                      Interactive Lab
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('games')}
                      className="hover:text-[#E10906]"
                    >
                      Game Zone
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('studio')}
                      className="hover:text-[#E10906]"
                    >
                      Python Playground
                    </button>
                  </li>
                </ul>
              </div>

              <div className="md:col-span-4">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  Tools &amp; Revision
                </h3>
                <ul className="mt-3 space-y-2 text-xs text-[#8A8585] dark:text-[#9a8585]">
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('tutor')}
                      className="hover:text-[#E10906]"
                    >
                      Adaptive AI Tutor
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onOpenRevisionTab('cheat-sheets')}
                      className="hover:text-[#E10906]"
                    >
                      Revision Hub &amp; Flashcards
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onOpenRevisionTab('quizzes')}
                      className="hover:text-[#E10906]"
                    >
                      Topic Quizzes
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('progress')}
                      className="hover:text-[#E10906]"
                    >
                      Progress Dashboard
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10 flex flex-col justify-between gap-2 border-t border-[#2C1616] pt-6 text-xs text-[#8A8585] dark:text-[#9a8585] sm:flex-row sm:items-center">
              <span>© {new Date().getFullYear()} PyVerse. Interactive Python Learning Universe.</span>
              <div className="flex flex-wrap items-center gap-3">
                <span>Local browser progress · Python Basics · Conditionals · Loops</span>
                <span aria-hidden="true" className="text-[#4a2626]">|</span>
                <a
                  href="FEEDBACK_FORM_URL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#f0eaea] hover:text-[#E10906] transition-colors underline-offset-4 hover:underline"
                >
                  {t(lang, 'footer.feedback')}
                </a>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
};
