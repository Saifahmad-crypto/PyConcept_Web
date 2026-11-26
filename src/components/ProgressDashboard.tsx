import React, { useState, useMemo, useRef } from 'react';
import {
  CheckCircle2,
  Circle,
  RotateCcw,
  Download,
  Upload,
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
  Calendar,
  TrendingUp,
  Bug,
  KeyRound,
  AlertTriangle,
  Bookmark,
  FileText,
} from 'lucide-react';
import {
  GamesHubTabId,
  LearningProgress,
  RevisionTabId,
  SectionId,
  TopicId,
} from '../types';
import {
  CODING_CHALLENGES,
  TOPIC_BASICS_LESSONS,
  TOPIC_08_LESSONS,
  TOPIC_09_LESSONS,
} from '../data/curriculumData';
import { SIMULATORS_CATALOG } from '../simulators/simulatorsData';
import {
  BUG_HUNT_CHALLENGES,
  LEARNING_MISSIONS,
  getLearnerLevel,
} from '../data/ecosystemData';
import { computeStreakDays, getLocalDateKey } from '../hooks/useProgress';
import { CertificateModal } from './CertificateModal';

interface ProgressDashboardProps {
  progress: LearningProgress;
  onToggleLesson: (lessonId: string) => void;
  onResetProgress: () => void;
  onImportProgress?: (raw: unknown) => boolean;
  onNavigate: (section: SectionId) => void;
  onOpenTopic: (topic: TopicId) => void;
  onOpenGamesTab: (tab: GamesHubTabId) => void;
  onOpenRevisionTab?: (tab: RevisionTabId) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  onToggleLesson,
  onResetProgress,
  onImportProgress,
  onNavigate,
  onOpenTopic,
  onOpenGamesTab,
  onOpenRevisionTab,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [ioNotice, setIoNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [activeCert, setActiveCert] = useState<{ topicId: TopicId; topicTitle: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExportJson = () => {
    try {
      const payload = JSON.stringify(progress, null, 2);
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pyverse-progress-${getLocalDateKey()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIoNotice({ type: 'ok', text: 'Progress exported as JSON.' });
    } catch {
      setIoNotice({ type: 'err', text: 'Could not export progress JSON.' });
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !onImportProgress) return;
    try {
      const text = await file.text();
      const parsed: unknown = JSON.parse(text);
      const ok = onImportProgress(parsed);
      setIoNotice(
        ok
          ? { type: 'ok', text: 'Progress imported successfully.' }
          : { type: 'err', text: 'Invalid PyVerse progress JSON file.' }
      );
    } catch {
      setIoNotice({ type: 'err', text: 'Could not parse JSON file.' });
    }
  };

  const basicsLessonsDone = TOPIC_BASICS_LESSONS.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;
  const t8LessonsDone = TOPIC_08_LESSONS.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;
  const t9LessonsDone = TOPIC_09_LESSONS.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;

  const isBasicsComplete = basicsLessonsDone >= TOPIC_BASICS_LESSONS.length;
  const isT8Complete = t8LessonsDone >= TOPIC_08_LESSONS.length;
  const isT9Complete = t9LessonsDone >= TOPIC_09_LESSONS.length;

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
  const streakDays = computeStreakDays(progress.activeDates);
  const longestStreak = Math.max(progress.longestStreak, streakDays);
  const levelInfo = getLearnerLevel(progress.xp);

  // Weekly 7-day real activity chart from progress.activities timestamps
  const weeklyBars = useMemo(() => {
    const days: Array<{ key: string; label: string; count: number; xp: number }> = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const activityList = Object.values(progress.activities);

    for (let offset = 6; offset >= 0; offset--) {
      const dt = new Date(today);
      dt.setDate(today.getDate() - offset);
      const key = getLocalDateKey(dt);
      const dayActivities = activityList.filter(
        (act) => getLocalDateKey(new Date(act.timestamp)) === key
      );
      days.push({
        key,
        label: dayNames[dt.getDay()],
        count: dayActivities.length,
        xp: dayActivities.reduce((sum, a) => sum + (a.xpAwarded || 0), 0),
      });
    }
    return days;
  }, [progress.activities]);

  const maxWeeklyCount = Math.max(1, ...weeklyBars.map((d) => d.count));

  // 28-Day calendar heatmap strictly from progress.activeDates
  const calendarDays = useMemo(() => {
    const activeSet = new Set(progress.activeDates);
    const cells: Array<{ key: string; dayNum: number; active: boolean }> = [];
    const today = new Date();
    for (let offset = 27; offset >= 0; offset--) {
      const dt = new Date(today);
      dt.setDate(today.getDate() - offset);
      const key = getLocalDateKey(dt);
      cells.push({
        key,
        dayNum: dt.getDate(),
        active: activeSet.has(key),
      });
    }
    return cells;
  }, [progress.activeDates]);

  const achievements = [
    {
      id: 'first-steps',
      title: 'First Steps',
      desc: 'Complete your first lesson or learning mission',
      unlocked:
        progress.completedLessons.length >= 1 || progress.completedMissions.length >= 1,
    },
    {
      id: 'first-program',
      title: 'First Program',
      desc: 'Run Python code in the Coding Studio Sandbox',
      unlocked: progress.sandboxRuns >= 1,
    },
    {
      id: 'condition-master',
      title: 'Condition Master',
      desc: 'Finish 5+ Conditionals lessons & 2+ challenges',
      unlocked: t8LessonsDone >= 5 && t8ChallengesDone >= 2,
    },
    {
      id: 'loop-explorer',
      title: 'Loop Explorer',
      desc: 'Finish 5+ Loops lessons & 2+ challenges',
      unlocked: t9LessonsDone >= 5 && t9ChallengesDone >= 2,
    },
    {
      id: 'bug-hunter',
      title: 'Bug Hunter',
      desc: 'Fix 2 or more bugs in Bug Hunter Lab',
      unlocked: progress.completedBugHunts.length >= 2,
    },
    {
      id: 'simulator-expert',
      title: 'Simulator Expert',
      desc: 'Explore 4 or more real-life simulators',
      unlocked: progress.visitedSimulators.length >= 4,
    },
    {
      id: 'daily-quest-streak',
      title: 'Daily Quest Streak',
      desc: 'Complete 2+ Daily Python Quests or hit a 3-day streak',
      unlocked: progress.completedDailyQuests.length >= 2 || streakDays >= 3,
    },
    {
      id: 'escape-room-solver',
      title: 'Escape Room Solver',
      desc: 'Unlock all 5 rooms in The Python Code Vault',
      unlocked: progress.completedEscapeRooms.includes('vault-complete'),
    },
    {
      id: 'sandbox-explorer',
      title: 'Python Sandbox Explorer',
      desc: 'Execute 5+ scripts or save a local snippet in Studio',
      unlocked: progress.sandboxRuns >= 5 || progress.savedSnippets.length >= 1,
    },
    {
      id: 'quiz-ace',
      title: 'Quiz Ace',
      desc: 'Score 80%+ on any Topic Quiz',
      unlocked: t8QuizPct >= 0.8 || t9QuizPct >= 0.8,
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  // Weak-area & next-step analysis strictly from real state
  const weakAreas: Array<{ title: string; reason: string; actionLabel: string; onClick: () => void }> = [];
  if (progress.quizScores.conditionals && t8QuizPct < 0.7) {
    weakAreas.push({
      title: 'Conditional Statements Accuracy',
      reason: `Best quiz score is ${Math.round(t8QuizPct * 100)}%. Review if-elif-else ordering & logical operators.`,
      actionLabel: 'Revise with Flashcards',
      onClick: () => (onOpenRevisionTab ? onOpenRevisionTab('flashcards') : onNavigate('revision')),
    });
  }
  if (progress.quizScores.loops && t9QuizPct < 0.7) {
    weakAreas.push({
      title: 'Loops & range() Tracing',
      reason: `Best quiz score is ${Math.round(t9QuizPct * 100)}%. Practice off-by-one bounds & break/continue.`,
      actionLabel: 'Open Loop Lab',
      onClick: () => onNavigate('lab'),
    });
  }
  if (progress.conceptsToReview.length > 0) {
    weakAreas.push({
      title: `Review "${progress.conceptsToReview[0]}"`,
      reason: 'Flagged during your AI Tutor practice session.',
      actionLabel: 'Practice in AI Tutor',
      onClick: () => onNavigate('tutor'),
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#E5DFDF] dark:border-[#3a1a1a] pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold text-[#E10906]">PyVerse Learner Analytics</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-[#100303] dark:text-[#f0eaea] sm:text-4xl">
            Progress Dashboard
          </h1>
          <p className="mt-2 text-sm text-[#8A8585] dark:text-[#9a8585]">
            Track real XP, streaks, skill accuracy, mission unlocks, and activity history saved locally in your browser.
          </p>
        </div>

        {/* Export / Import JSON & Inline Two-Step Reset Confirmation */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3.5 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] shadow-xs transition-colors hover:border-[#100303] dark:hover:border-[#9a8585] hover:bg-[#FBF5F9] dark:hover:bg-[#221010] dark:bg-[#0f0303]"
          >
            <Download className="h-3.5 w-3.5 text-[#E10906]" aria-hidden="true" />
            Export JSON
          </button>

          {onImportProgress && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleImportFile}
                className="hidden"
                aria-label="Import progress JSON file"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3.5 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] shadow-xs transition-colors hover:border-[#100303] dark:hover:border-[#9a8585] hover:bg-[#FBF5F9] dark:hover:bg-[#221010] dark:bg-[#0f0303]"
              >
                <Upload className="h-3.5 w-3.5 text-[#E10906]" aria-hidden="true" />
                Import JSON
              </button>
            </>
          )}

          {confirmReset ? (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2">
              <span className="text-xs font-medium text-rose-900 dark:text-rose-200">Reset all saved progress?</span>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-50 dark:hover:bg-rose-950/400"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3 py-1 text-xs font-medium text-[#100303] dark:text-[#f0eaea] hover:bg-[#FBF5F9] dark:hover:bg-[#221010] dark:bg-[#0f0303]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-4 py-2 text-xs font-semibold text-[#8A8585] dark:text-[#9a8585] shadow-xs transition-colors hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset Progress
            </button>
          )}
        </div>
      </div>

      {ioNotice && (
        <div
          className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-xs font-medium ${
            ioNotice.type === 'ok'
              ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
              : 'border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
          }`}
        >
          <span>{ioNotice.text}</span>
          <button
            type="button"
            onClick={() => setIoNotice(null)}
            className="font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* XP, Level & Streak Hero Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm lg:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-semibold text-[#E10906]">
                Level {levelInfo.current.level} · {levelInfo.current.title}
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-4xl font-extrabold text-[#100303] dark:text-[#f0eaea] tabular-nums">
                  {progress.xp}
                </span>
                <span className="text-sm font-semibold text-[#8A8585] dark:text-[#9a8585]">Total XP Earned</span>
              </div>
            </div>

            {levelInfo.next ? (
              <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-4 py-2 text-right">
                <p className="text-[11px] font-semibold text-[#8A8585] dark:text-[#9a8585]">Next Rank</p>
                <p className="font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">
                  {levelInfo.next.title}
                </p>
                <p className="font-mono text-[11px] text-[#E10906] tabular-nums">
                  {levelInfo.xpToNext} XP remaining
                </p>
              </div>
            ) : (
              <span className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-200">
                Maximum Rank Reached!
              </span>
            )}
          </div>

          <div className="mt-4">
            <div className="h-3 overflow-hidden rounded-full bg-[#E5DFDF]/80 dark:bg-[#3a1a1a]/80">
              <div
                className="h-full rounded-full bg-[#E10906] transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-[#8A8585] dark:text-[#9a8585]">
              <span>
                Missions Solved: <strong className="font-mono text-[#100303] dark:text-[#f0eaea]">{progress.completedMissions.length}/{LEARNING_MISSIONS.length}</strong>
              </span>
              <span className="font-mono font-semibold text-[#E10906] tabular-nums">
                {levelInfo.progressPercent}% to next level
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">
              <Flame className="h-5 w-5 text-amber-500" aria-hidden="true" />
              Learning Streaks
            </span>
            <span className="font-mono text-xs text-[#8A8585] dark:text-[#9a8585]">Local Calendar</span>
          </div>

          <div className="my-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-amber-200/80 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/40 p-3.5 text-center">
              <p className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">Current Streak</p>
              <p className="mt-1 font-mono text-3xl font-extrabold text-amber-700 dark:text-amber-300 tabular-nums">
                {streakDays}d
              </p>
            </div>
            <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3.5 text-center">
              <p className="text-[11px] font-semibold text-[#8A8585] dark:text-[#9a8585]">Longest Streak</p>
              <p className="mt-1 font-mono text-3xl font-extrabold text-[#100303] dark:text-[#f0eaea] tabular-nums">
                {longestStreak}d
              </p>
            </div>
          </div>

          <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
            Complete any lesson, mission, daily quest, bug fix, or simulator run each day to grow your streak.
          </p>
        </div>
      </div>

      {/* Real Activity Metrics Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">
            <BookOpen className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
            Lessons
          </div>
          <p className="mt-2 font-mono text-xl font-bold text-[#100303] dark:text-[#f0eaea] tabular-nums">
            {progress.completedLessons.length}/{totalLessonsCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">
            <Code2 className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
            Challenges
          </div>
          <p className="mt-2 font-mono text-xl font-bold text-[#100303] dark:text-[#f0eaea] tabular-nums">
            {progress.completedChallenges.length}/{CODING_CHALLENGES.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">
            <Bug className="h-4 w-4 text-rose-600 dark:text-rose-400" aria-hidden="true" />
            Bug Hunts
          </div>
          <p className="mt-2 font-mono text-xl font-bold text-[#100303] dark:text-[#f0eaea] tabular-nums">
            {progress.completedBugHunts.length}/{BUG_HUNT_CHALLENGES.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">
            <KeyRound className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
            Vault Rooms
          </div>
          <p className="mt-2 font-mono text-xl font-bold text-[#100303] dark:text-[#f0eaea] tabular-nums">
            {progress.completedEscapeRooms.filter((r) => r.startsWith('room-')).length}/5
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">
            <Gamepad2 className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
            Mini-Games
          </div>
          <p className="mt-2 font-mono text-xl font-bold text-[#100303] dark:text-[#f0eaea] tabular-nums">
            {gamesCompleted}/8
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">
            <Cpu className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            Simulators
          </div>
          <p className="mt-2 font-mono text-xl font-bold text-[#100303] dark:text-[#f0eaea] tabular-nums">
            {progress.visitedSimulators.length}/{SIMULATORS_CATALOG.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">
            <Terminal className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            Sandbox Runs
          </div>
          <p className="mt-2 font-mono text-xl font-bold text-[#100303] dark:text-[#f0eaea] tabular-nums">
            {progress.sandboxRuns}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('learn')}
          className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-xs text-left transition-colors hover:border-[#E10906]"
        >
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">
            <Bookmark className="h-4 w-4 text-amber-500 fill-amber-500" aria-hidden="true" />
            Saved Notes
          </div>
          <p className="mt-2 font-mono text-xl font-bold text-[#100303] dark:text-[#f0eaea] tabular-nums">
            {(progress.bookmarkedLessons?.length || 0) + Object.keys(progress.lessonNotes || {}).length}
          </p>
        </button>
      </div>

      {/* Weekly Activity Chart & 28-Day Learning Calendar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#E10906]" aria-hidden="true" />
              <h2 className="font-display text-lg font-bold text-[#100303] dark:text-[#f0eaea]">
                Weekly Activity (Last 7 Days)
              </h2>
            </div>
            <span className="font-mono text-xs text-[#8A8585] dark:text-[#9a8585]">Real completed actions</span>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end h-40 pt-4">
            {weeklyBars.map((day) => {
              const heightPct = day.count === 0 ? 6 : Math.max(16, Math.round((day.count / maxWeeklyCount) * 100));
              return (
                <div key={day.key} className="flex flex-col items-center justify-end h-full gap-1.5">
                  <span className="font-mono text-[10px] text-[#8A8585] dark:text-[#9a8585] tabular-nums">
                    {day.count > 0 ? `+${day.xp}` : ''}
                  </span>
                  <div className="w-full max-w-[34px] flex-1 flex items-end rounded-lg bg-[#F1EEEE] dark:bg-[#221010] p-0.5">
                    <div
                      className={`w-full rounded-md transition-all ${
                        day.count > 0
                          ? 'bg-[#E10906]'
                          : 'bg-[#E5DFDF] dark:bg-[#3a1a1a]'
                      }`}
                      style={{ height: `${heightPct}%` }}
                      title={`${day.key}: ${day.count} actions (${day.xp} XP)`}
                    />
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-[#100303] dark:text-[#f0eaea]">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#E10906]" aria-hidden="true" />
              <h2 className="font-display text-lg font-bold text-[#100303] dark:text-[#f0eaea]">
                28-Day Practice Calendar
              </h2>
            </div>
            <span className="font-mono text-xs text-emerald-700 dark:text-emerald-300 font-semibold tabular-nums">
              {progress.activeDates.length} active day{progress.activeDates.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((cell) => (
              <div
                key={cell.key}
                title={cell.key}
                className={`flex h-9 items-center justify-center rounded-lg border font-mono text-xs tabular-nums ${
                  cell.active
                    ? 'border-emerald-300 dark:border-emerald-700/60 bg-emerald-50 dark:bg-emerald-950/40 font-bold text-emerald-800 dark:text-emerald-200'
                    : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] text-[#8A8585] dark:text-[#9a8585]'
                }`}
              >
                {cell.dayNum}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topic Mastery & Weak-Area Analysis */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs font-semibold text-[#E10906]">Topic 01</span>
              <h2 className="font-display text-xl font-bold text-[#100303] dark:text-[#f0eaea]">Python Basics</h2>
            </div>
            <span className="font-mono text-2xl font-bold text-[#E10906] tabular-nums">
              {basicsPercent}%
            </span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#F1EEEE] dark:bg-[#221010]">
            <div
              className="h-full rounded-full bg-[#E10906]"
              style={{ width: `${basicsPercent}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3">
              <span className="text-[#8A8585] dark:text-[#9a8585]">Lessons</span>
              <p className="mt-1 font-mono font-bold text-[#100303] dark:text-[#f0eaea] tabular-nums">
                {basicsLessonsDone} / {TOPIC_BASICS_LESSONS.length}
              </p>
            </div>
            <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3">
              <span className="text-[#8A8585] dark:text-[#9a8585]">Saved Scripts</span>
              <p className="mt-1 font-mono font-bold text-[#E10906] tabular-nums">
                {progress.savedSnippets.length}
              </p>
            </div>
          </div>

          {isBasicsComplete ? (
            <button
              type="button"
              onClick={() => setActiveCert({ topicId: 'basics', topicTitle: 'Python Basics' })}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E10906] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#C40705] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#100303]"
            >
              <Award className="h-4 w-4" aria-hidden="true" />
              Download Certificate
            </button>
          ) : (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3 py-2 text-[11px] text-[#8A8585] dark:text-[#9a8585]">
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-[#8A8585] dark:text-[#9a8585]" />
                Certificate: {basicsLessonsDone}/{TOPIC_BASICS_LESSONS.length} lessons
              </span>
              <span className="font-semibold text-[#E10906]">In Progress</span>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-300">Topic 08</span>
              <h2 className="font-display text-xl font-bold text-[#100303] dark:text-[#f0eaea]">
                Conditional Statements
              </h2>
            </div>
            <span className="font-mono text-2xl font-bold text-blue-700 dark:text-blue-300 tabular-nums">
              {topic08Percent}%
            </span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#F1EEEE] dark:bg-[#221010]">
            <div
              className="h-full rounded-full bg-[#E10906]"
              style={{ width: `${topic08Percent}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3">
              <span className="text-[#8A8585] dark:text-[#9a8585]">Lessons</span>
              <p className="mt-1 font-mono font-bold text-[#100303] dark:text-[#f0eaea] tabular-nums">
                {t8LessonsDone}/{TOPIC_08_LESSONS.length}
              </p>
            </div>
            <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3">
              <span className="text-[#8A8585] dark:text-[#9a8585]">Challenges</span>
              <p className="mt-1 font-mono font-bold text-[#100303] dark:text-[#f0eaea] tabular-nums">
                {t8ChallengesDone}/5
              </p>
            </div>
            <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3">
              <span className="text-[#8A8585] dark:text-[#9a8585]">Best Quiz</span>
              <p className="mt-1 font-mono font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                {progress.quizScores.conditionals ? `${Math.round(t8QuizPct * 100)}%` : '—'}
              </p>
            </div>
          </div>

          {isT8Complete ? (
            <button
              type="button"
              onClick={() => setActiveCert({ topicId: 'conditionals', topicTitle: 'Conditional Statements' })}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E10906] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#C40705] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#100303]"
            >
              <Award className="h-4 w-4" aria-hidden="true" />
              Download Certificate
            </button>
          ) : (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3 py-2 text-[11px] text-[#8A8585] dark:text-[#9a8585]">
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-[#8A8585] dark:text-[#9a8585]" />
                Certificate: {t8LessonsDone}/{TOPIC_08_LESSONS.length} lessons
              </span>
              <span className="font-semibold text-[#E10906]">In Progress</span>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs font-semibold text-[#E10906]">Topic 09</span>
              <h2 className="font-display text-xl font-bold text-[#100303] dark:text-[#f0eaea]">Loops</h2>
            </div>
            <span className="font-mono text-2xl font-bold text-[#E10906] tabular-nums">
              {topic09Percent}%
            </span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#F1EEEE] dark:bg-[#221010]">
            <div
              className="h-full rounded-full bg-[#E10906]"
              style={{ width: `${topic09Percent}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3">
              <span className="text-[#8A8585] dark:text-[#9a8585]">Lessons</span>
              <p className="mt-1 font-mono font-bold text-[#100303] dark:text-[#f0eaea] tabular-nums">
                {t9LessonsDone}/{TOPIC_09_LESSONS.length}
              </p>
            </div>
            <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3">
              <span className="text-[#8A8585] dark:text-[#9a8585]">Challenges</span>
              <p className="mt-1 font-mono font-bold text-[#100303] dark:text-[#f0eaea] tabular-nums">
                {t9ChallengesDone}/5
              </p>
            </div>
            <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3">
              <span className="text-[#8A8585] dark:text-[#9a8585]">Best Quiz</span>
              <p className="mt-1 font-mono font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                {progress.quizScores.loops ? `${Math.round(t9QuizPct * 100)}%` : '—'}
              </p>
            </div>
          </div>

          {isT9Complete ? (
            <button
              type="button"
              onClick={() => setActiveCert({ topicId: 'loops', topicTitle: 'Loops & Iteration' })}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E10906] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#C40705] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#100303]"
            >
              <Award className="h-4 w-4" aria-hidden="true" />
              Download Certificate
            </button>
          ) : (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3 py-2 text-[11px] text-[#8A8585] dark:text-[#9a8585]">
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-[#8A8585] dark:text-[#9a8585]" />
                Certificate: {t9LessonsDone}/{TOPIC_09_LESSONS.length} lessons
              </span>
              <span className="font-semibold text-[#E10906]">In Progress</span>
            </div>
          )}
        </div>
      </div>

      {/* Certificates Showcase Section */}
      <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F1EEEE] dark:border-[#2C1616] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#100303] dark:bg-[#190909] border border-[#3A1D1D] text-[#E10906] shrink-0">
              <Award className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-[#100303] dark:text-[#f0eaea]">
                  Topic Certificates of Completion
                </h2>
                {(isBasicsComplete || isT8Complete || isT9Complete) && (
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Unlocked
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
                Complete all lessons in a topic to unlock and download an official personalized PyVerse certificate.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              id: 'basics' as TopicId,
              title: 'Python Basics',
              done: basicsLessonsDone,
              total: TOPIC_BASICS_LESSONS.length,
              isComplete: isBasicsComplete,
            },
            {
              id: 'conditionals' as TopicId,
              title: 'Conditional Statements',
              done: t8LessonsDone,
              total: TOPIC_08_LESSONS.length,
              isComplete: isT8Complete,
            },
            {
              id: 'loops' as TopicId,
              title: 'Loops & Iteration',
              done: t9LessonsDone,
              total: TOPIC_09_LESSONS.length,
              isComplete: isT9Complete,
            },
          ].map((item) => (
            <div
              key={item.id}
              className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
                item.isComplete
                  ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold text-[#8A8585] dark:text-[#9a8585]">
                    {item.done} / {item.total} Lessons
                  </span>
                  {item.isComplete ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-[#8A8585] dark:text-[#9a8585]">
                      {Math.round((item.done / item.total) * 100)}%
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">
                  {item.title}
                </h3>
              </div>

              {item.isComplete ? (
                <button
                  type="button"
                  onClick={() => setActiveCert({ topicId: item.id, topicTitle: item.title })}
                  className="mt-3.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#E10906] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#C40705]"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Download Certificate
                </button>
              ) : (
                <div className="mt-3.5 rounded-lg border border-dashed border-[#E5DFDF] dark:border-[#3a1a1a] py-1.5 text-center font-mono text-[11px] text-[#8A8585] dark:text-[#9a8585]">
                  Locked ({item.total - item.done} more lessons)
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements & XP History */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm lg:col-span-7">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" aria-hidden="true" />
              <h2 className="font-display text-lg font-bold text-[#100303] dark:text-[#f0eaea]">
                Achievement Gallery
              </h2>
            </div>
            <span className="font-mono text-xs font-semibold text-[#8A8585] dark:text-[#9a8585] tabular-nums">
              {unlockedCount} / {achievements.length} unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`flex items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                  ach.unlocked
                    ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/40'
                    : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] opacity-75'
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    ach.unlocked
                      ? 'bg-[#E10906] text-white shadow-xs'
                      : 'bg-[#E5DFDF]/80 dark:bg-[#3a1a1a]/80 text-[#8A8585] dark:text-[#9a8585]'
                  }`}
                >
                  <Award className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-xs font-bold text-[#100303] dark:text-[#f0eaea]">{ach.title}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-[#8A8585] dark:text-[#9a8585]">{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 lg:col-span-5">
          {/* Weak-Area Suggestions OR Next Steps */}
          <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              {weakAreas.length > 0 ? (
                <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
              ) : (
                <Sparkles className="h-5 w-5 text-[#E10906]" aria-hidden="true" />
              )}
              <h2 className="font-display text-lg font-bold text-[#100303] dark:text-[#f0eaea]">
                {weakAreas.length > 0 ? 'Suggested Revision Focus' : 'Recommended Next Steps'}
              </h2>
            </div>

            {weakAreas.length > 0 ? (
              weakAreas.map((w, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/40 p-4 space-y-1.5"
                >
                  <h3 className="font-display text-sm font-bold text-amber-950 dark:text-amber-100">{w.title}</h3>
                  <p className="text-xs text-amber-900 dark:text-amber-200">{w.reason}</p>
                  <button
                    type="button"
                    onClick={w.onClick}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#E10906] hover:underline"
                  >
                    {w.actionLabel}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))
            ) : (
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate('learn')}
                  className="flex w-full items-center justify-between rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3.5 text-left text-xs font-semibold text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906]"
                >
                  <span>Continue Missions in Learning World</span>
                  <ArrowRight className="h-4 w-4 text-[#E10906]" />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenGamesTab('escape-room')}
                  className="flex w-full items-center justify-between rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3.5 text-left text-xs font-semibold text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906]"
                >
                  <span>Challenge The Python Code Vault</span>
                  <ArrowRight className="h-4 w-4 text-[#E10906]" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('studio')}
                  className="flex w-full items-center justify-between rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3.5 text-left text-xs font-semibold text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906]"
                >
                  <span>Write &amp; Save Python in Coding Studio</span>
                  <ArrowRight className="h-4 w-4 text-[#E10906]" />
                </button>
              </div>
            )}
          </div>

          {/* Real XP History Feed */}
          <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm space-y-3">
            <h2 className="font-display text-lg font-bold text-[#100303] dark:text-[#f0eaea]">Recent XP Log</h2>
            {progress.xpHistory.length === 0 ? (
              <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
                No XP earned yet. Complete your first mission, lesson, simulator, or daily quest to start recording progress!
              </p>
            ) : (
              <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                {progress.xpHistory.slice(0, 10).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3 py-2 text-xs"
                  >
                    <span className="truncate font-medium text-[#100303] dark:text-[#f0eaea]">{entry.label}</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 shrink-0 tabular-nums">
                      +{entry.amount} XP
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Lesson Checklists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {[
          { topic: 'basics' as TopicId, title: 'Topic 01 · Basics', list: TOPIC_BASICS_LESSONS },
          { topic: 'conditionals' as TopicId, title: 'Topic 08 · Conditionals', list: TOPIC_08_LESSONS },
          { topic: 'loops' as TopicId, title: 'Topic 09 · Loops', list: TOPIC_09_LESSONS },
        ].map((group) => (
          <div key={group.topic} className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-[#100303] dark:text-[#f0eaea]">{group.title}</h3>
              <button
                type="button"
                onClick={() => onOpenTopic(group.topic)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#E10906] hover:text-[#100303] dark:hover:text-[#f0eaea]"
              >
                Open <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-2">
              {group.list.map((lesson) => {
                const done = progress.completedLessons.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => onToggleLesson(lesson.id)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3.5 py-2.5 text-left text-xs transition-colors hover:border-[#E10906] hover:bg-[#FFF1F1] dark:hover:bg-[#2a0808]/60 dark:bg-[#2a0808]/60"
                  >
                    <span className="font-medium text-[#100303] dark:text-[#f0eaea]">
                      <span className="mr-2 font-mono text-[#8A8585] dark:text-[#9a8585]">{lesson.number}</span>
                      {lesson.title}
                    </span>
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-[#8A8585] dark:text-[#9a8585]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {activeCert && (
        <CertificateModal
          isOpen={!!activeCert}
          onClose={() => setActiveCert(null)}
          topicId={activeCert.topicId}
          topicTitle={activeCert.topicTitle}
        />
      )}
    </div>
  );
};
