import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  RotateCcw,
  BookOpen,
  Award,
  Code2,
  Gamepad2,
  ArrowRight,
  Cpu,
  Terminal,
  Flame,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { GamesHubTabId, LearningProgress, SectionId, TopicId } from '../types';
import {
  CODING_CHALLENGES,
  TOPIC_BASICS_LESSONS,
  TOPIC_08_LESSONS,
  TOPIC_09_LESSONS,
} from '../data/curriculumData';
import { SIMULATORS_CATALOG } from '../simulators/simulatorsData';
import { computeStreakDays } from '../hooks/useProgress';

interface ProgressDashboardProps {
  progress: LearningProgress;
  onToggleLesson: (lessonId: string) => void;
  onResetProgress: () => void;
  onNavigate: (section: SectionId) => void;
  onOpenTopic: (topic: TopicId) => void;
  onOpenGamesTab: (tab: GamesHubTabId) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  onToggleLesson,
  onResetProgress,
  onNavigate,
  onOpenTopic,
  onOpenGamesTab,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const basicsLessonsDone = TOPIC_BASICS_LESSONS.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;
  const t8LessonsDone = TOPIC_08_LESSONS.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;
  const t9LessonsDone = TOPIC_09_LESSONS.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;

  const totalLessonsCount =
    TOPIC_BASICS_LESSONS.length + TOPIC_08_LESSONS.length + TOPIC_09_LESSONS.length;

  const t8ChallengesDone = CODING_CHALLENGES.filter(
    (c) => c.topic === 'conditionals' && progress.completedChallenges.includes(c.id)
  ).length;
  const t9ChallengesDone = CODING_CHALLENGES.filter(
    (c) => c.topic === 'loops' && progress.completedChallenges.includes(c.id)
  ).length;

  const t8QuizPct = progress.quizScores.conditionals
    ? progress.quizScores.conditionals.bestScore / progress.quizScores.conditionals.total
    : 0;
  const t9QuizPct = progress.quizScores.loops
    ? progress.quizScores.loops.bestScore / progress.quizScores.loops.total
    : 0;

  const basicsPercent = Math.round(
    (basicsLessonsDone / Math.max(1, TOPIC_BASICS_LESSONS.length)) * 100
  );
  const topic08Percent = Math.round(
    ((t8LessonsDone + t8ChallengesDone + (progress.quizScores.conditionals ? 1 : 0)) / 15) * 100
  );
  const topic09Percent = Math.round(
    ((t9LessonsDone + t9ChallengesDone + (progress.quizScores.loops ? 1 : 0)) / 15) * 100
  );

  const gamesCompleted = Object.values(progress.gameScores).filter((g) => g.completed).length;
  const totalGameAttempts = Object.values(progress.gameAttempts).reduce(
    (sum, count) => sum + count,
    0
  );
  const streakDays = computeStreakDays(progress.activeDates);

  const achievements = [
    {
      id: 'first-step',
      title: 'First Step',
      desc: 'Complete your first lesson or simulator run',
      unlocked: progress.completedLessons.length >= 1 || progress.simulatorRuns >= 1,
    },
    {
      id: 'basics-explorer',
      title: 'Basics Explorer',
      desc: `Finish all ${TOPIC_BASICS_LESSONS.length} Python Basics lessons`,
      unlocked: basicsLessonsDone === TOPIC_BASICS_LESSONS.length,
    },
    {
      id: 'decision-maker',
      title: 'Decision Maker',
      desc: 'Complete 5+ Conditionals lessons & 2+ challenges',
      unlocked: t8LessonsDone >= 5 && t8ChallengesDone >= 2,
    },
    {
      id: 'loop-master',
      title: 'Loop Master',
      desc: 'Complete 5+ Loops lessons & 2+ challenges',
      unlocked: t9LessonsDone >= 5 && t9ChallengesDone >= 2,
    },
    {
      id: 'sim-explorer',
      title: 'Simulator Explorer',
      desc: 'Run 4 different real-life simulators',
      unlocked: progress.visitedSimulators.length >= 4,
    },
    {
      id: 'challenge-solver',
      title: 'Challenge Solver',
      desc: 'Pass 3 or more coding challenges',
      unlocked: progress.completedChallenges.length >= 3,
    },
    {
      id: 'sandbox-tinkerer',
      title: 'Sandbox Tinkerer',
      desc: 'Execute Python code 5+ times in the Sandbox',
      unlocked: progress.sandboxRuns >= 5,
    },
    {
      id: 'quiz-ace',
      title: 'Quiz Ace',
      desc: 'Score 80%+ on any Topic Quiz',
      unlocked: t8QuizPct >= 0.8 || t9QuizPct >= 0.8,
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  // Real personalized recommendations based on actual recorded state
  const recommendations: Array<{
    title: string;
    detail: string;
    cta: string;
    onClick: () => void;
  }> = [];

  if (progress.conceptsToReview.length > 0) {
    recommendations.push({
      title: `Review "${progress.conceptsToReview[0]}" with AI Tutor`,
      detail: 'Flagged for revision during your AI Tutor session.',
      cta: 'Open AI Tutor',
      onClick: () => onNavigate('tutor'),
    });
  }

  const nextBasics = TOPIC_BASICS_LESSONS.find(
    (l) => !progress.completedLessons.includes(l.id)
  );
  const nextCond = TOPIC_08_LESSONS.find(
    (l) => !progress.completedLessons.includes(l.id)
  );
  const nextLoop = TOPIC_09_LESSONS.find(
    (l) => !progress.completedLessons.includes(l.id)
  );

  if (nextBasics) {
    recommendations.push({
      title: `Complete Lesson ${nextBasics.number}: ${nextBasics.title}`,
      detail: 'Build your foundation in variables, data types, and input/output.',
      cta: 'Continue Basics',
      onClick: () => onOpenTopic('basics'),
    });
  } else if (nextCond) {
    recommendations.push({
      title: `Complete Lesson ${nextCond.number}: ${nextCond.title}`,
      detail: 'Continue Topic 08 — Conditional Statements.',
      cta: 'Continue Conditionals',
      onClick: () => onOpenTopic('conditionals'),
    });
  } else if (nextLoop) {
    recommendations.push({
      title: `Complete Lesson ${nextLoop.number}: ${nextLoop.title}`,
      detail: 'Continue Topic 09 — Loops & iteration patterns.',
      cta: 'Continue Loops',
      onClick: () => onOpenTopic('loops'),
    });
  }

  if (progress.visitedSimulators.length < SIMULATORS_CATALOG.length) {
    const nextSim = SIMULATORS_CATALOG.find(
      (s) => !progress.visitedSimulators.includes(s.id)
    );
    if (nextSim) {
      recommendations.push({
        title: `Run ${nextSim.title}`,
        detail: nextSim.shortDescription,
        cta: 'Open Simulators',
        onClick: () => onNavigate('simulators'),
      });
    }
  }

  if (!progress.quizScores.conditionals || !progress.quizScores.loops) {
    recommendations.push({
      title: !progress.quizScores.conditionals
        ? 'Take the Conditionals Topic Quiz'
        : 'Take the Loops Topic Quiz',
      detail: 'Test your code-tracing accuracy across 10 beginner questions.',
      cta: 'Open Quizzes',
      onClick: () => onOpenGamesTab('quizzes'),
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Experiment in the Python Sandbox',
      detail: 'Combine variables, if-elif-else, and loops to write your own script.',
      cta: 'Open Sandbox',
      onClick: () => onNavigate('playground'),
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold text-sky-700">PyVerse Progress Tracker</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-[#1E293B] sm:text-4xl">
            Your Learning Progress
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Real activity from your lessons, simulators, mini-games, challenges, quizzes, and
            sandbox runs saved locally in your browser.
          </p>
        </div>

        {/* Inline Two-Step Reset Confirmation */}
        <div className="flex items-center gap-2">
          {confirmReset ? (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2">
              <span className="text-xs font-medium text-rose-900">Reset all saved progress?</span>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-500"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-xs transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset Progress
            </button>
          )}
        </div>
      </div>

      {/* Topic Completion Overview Cards (All 3 Topics) */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs font-semibold text-sky-700">Topic 01</span>
              <h2 className="font-display text-xl font-bold text-[#1E293B]">Python Basics</h2>
            </div>
            <span className="font-mono text-2xl font-bold text-sky-700 tabular-nums">
              {basicsPercent}%
            </span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#2563EB] transition-all duration-300"
              style={{ width: `${basicsPercent}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-3">
              <span className="text-slate-500">Lessons</span>
              <p className="mt-1 font-mono font-bold text-[#1E293B] tabular-nums">
                {basicsLessonsDone} / {TOPIC_BASICS_LESSONS.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-3">
              <span className="text-slate-500">Sandbox Runs</span>
              <p className="mt-1 font-mono font-bold text-sky-700 tabular-nums">
                {progress.sandboxRuns}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs font-semibold text-blue-700">Topic 08</span>
              <h2 className="font-display text-xl font-bold text-[#1E293B]">
                Conditional Statements
              </h2>
            </div>
            <span className="font-mono text-2xl font-bold text-blue-700 tabular-nums">
              {topic08Percent}%
            </span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] transition-all duration-300"
              style={{ width: `${topic08Percent}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2.5 text-xs">
            <div className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-3">
              <span className="text-slate-500">Lessons</span>
              <p className="mt-1 font-mono font-bold text-[#1E293B] tabular-nums">
                {t8LessonsDone} / {TOPIC_08_LESSONS.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-3">
              <span className="text-slate-500">Challenges</span>
              <p className="mt-1 font-mono font-bold text-[#1E293B] tabular-nums">
                {t8ChallengesDone} / 5
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-3">
              <span className="text-slate-500">Best Quiz</span>
              <p className="mt-1 font-mono font-bold text-emerald-700 tabular-nums">
                {progress.quizScores.conditionals
                  ? `${Math.round(t8QuizPct * 100)}%`
                  : '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs font-semibold text-violet-700">Topic 09</span>
              <h2 className="font-display text-xl font-bold text-[#1E293B]">Loops</h2>
            </div>
            <span className="font-mono text-2xl font-bold text-violet-700 tabular-nums">
              {topic09Percent}%
            </span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] transition-all duration-300"
              style={{ width: `${topic09Percent}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2.5 text-xs">
            <div className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-3">
              <span className="text-slate-500">Lessons</span>
              <p className="mt-1 font-mono font-bold text-[#1E293B] tabular-nums">
                {t9LessonsDone} / {TOPIC_09_LESSONS.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-3">
              <span className="text-slate-500">Challenges</span>
              <p className="mt-1 font-mono font-bold text-[#1E293B] tabular-nums">
                {t9ChallengesDone} / 5
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-3">
              <span className="text-slate-500">Best Quiz</span>
              <p className="mt-1 font-mono font-bold text-emerald-700 tabular-nums">
                {progress.quizScores.loops ? `${Math.round(t9QuizPct * 100)}%` : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real Activity Metrics Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <BookOpen className="h-4 w-4 text-sky-600" aria-hidden="true" />
            Lessons
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#1E293B] tabular-nums">
            {progress.completedLessons.length} / {totalLessonsCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Code2 className="h-4 w-4 text-violet-600" aria-hidden="true" />
            Challenges
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#1E293B] tabular-nums">
            {progress.completedChallenges.length} / {CODING_CHALLENGES.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Gamepad2 className="h-4 w-4 text-sky-600" aria-hidden="true" />
            Mini-Games
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#1E293B] tabular-nums">
            {gamesCompleted} / 8
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500 tabular-nums">
            {totalGameAttempts} total attempt{totalGameAttempts === 1 ? '' : 's'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Cpu className="h-4 w-4 text-blue-600" aria-hidden="true" />
            Simulators
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#1E293B] tabular-nums">
            {progress.visitedSimulators.length} / {SIMULATORS_CATALOG.length}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500 tabular-nums">
            {progress.simulatorRuns} run{progress.simulatorRuns === 1 ? '' : 's'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Terminal className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            Sandbox Runs
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#1E293B] tabular-nums">
            {progress.sandboxRuns}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">Code executions</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Flame className="h-4 w-4 text-amber-500" aria-hidden="true" />
            Active Streak
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#1E293B] tabular-nums">
            {streakDays}d
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">Verified calendar days</p>
        </div>
      </div>

      {/* Achievements & Recommended Next Steps */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" aria-hidden="true" />
              <h2 className="font-display text-lg font-bold text-[#1E293B]">
                Earned Achievements
              </h2>
            </div>
            <span className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
              {unlockedCount} / {achievements.length} unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`flex items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                  ach.unlocked
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : 'border-slate-200/80 bg-[#F8FAFC] opacity-75'
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    ach.unlocked
                      ? 'bg-gradient-to-br from-[#38BDF8] to-[#8B5CF6] text-white shadow-xs'
                      : 'bg-slate-200/80 text-slate-500'
                  }`}
                >
                  <Award className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-xs font-bold text-[#1E293B]">
                    {ach.title}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-slate-600">{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-600" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-[#1E293B]">
              Recommended Next Steps
            </h2>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-2"
              >
                <h3 className="font-display text-sm font-bold text-[#1E293B]">{rec.title}</h3>
                <p className="text-xs leading-relaxed text-slate-600">{rec.detail}</p>
                <button
                  type="button"
                  onClick={rec.onClick}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-violet-700"
                >
                  {rec.cta}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Lesson Checklists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-[#1E293B]">
              Topic 01 · Basics
            </h3>
            <button
              type="button"
              onClick={() => onOpenTopic('basics')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800"
            >
              Open <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
          <div className="space-y-2">
            {TOPIC_BASICS_LESSONS.map((lesson) => {
              const done = progress.completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => onToggleLesson(lesson.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-[#F8FAFC] px-3.5 py-2.5 text-left text-xs transition-colors hover:border-sky-300 hover:bg-[#F0F9FF]/60"
                >
                  <span className="font-medium text-[#1E293B]">
                    <span className="mr-2 font-mono text-slate-500">{lesson.number}</span>
                    {lesson.title}
                  </span>
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-slate-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-[#1E293B]">
              Topic 08 · Conditionals
            </h3>
            <button
              type="button"
              onClick={() => onOpenTopic('conditionals')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800"
            >
              Open <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
          <div className="space-y-2">
            {TOPIC_08_LESSONS.map((lesson) => {
              const done = progress.completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => onToggleLesson(lesson.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-[#F8FAFC] px-3.5 py-2.5 text-left text-xs transition-colors hover:border-sky-300 hover:bg-[#F0F9FF]/60"
                >
                  <span className="font-medium text-[#1E293B]">
                    <span className="mr-2 font-mono text-slate-500">{lesson.number}</span>
                    {lesson.title}
                  </span>
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-slate-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-[#1E293B]">
              Topic 09 · Loops
            </h3>
            <button
              type="button"
              onClick={() => onOpenTopic('loops')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-800"
            >
              Open <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
          <div className="space-y-2">
            {TOPIC_09_LESSONS.map((lesson) => {
              const done = progress.completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => onToggleLesson(lesson.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-[#F8FAFC] px-3.5 py-2.5 text-left text-xs transition-colors hover:border-violet-300 hover:bg-[#F5F3FF]/60"
                >
                  <span className="font-medium text-[#1E293B]">
                    <span className="mr-2 font-mono text-slate-500">{lesson.number}</span>
                    {lesson.title}
                  </span>
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-slate-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onOpenGamesTab('challenges')}
          className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#8B5CF6] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          Practice Coding Challenges
        </button>
        <button
          type="button"
          onClick={() => onOpenGamesTab('quizzes')}
          className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-[#1E293B] shadow-xs transition-colors hover:border-sky-300 hover:bg-[#F0F9FF]"
        >
          Take Topic Quizzes
        </button>
        <button
          type="button"
          onClick={() => onNavigate('simulators')}
          className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-[#1E293B] shadow-xs transition-colors hover:border-violet-300 hover:bg-[#F5F3FF]"
        >
          Explore Simulators
        </button>
      </div>
    </div>
  );
};
