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
} from 'lucide-react';
import { LearningProgress, SectionId, TopicId } from '../types';
import {
  CODING_CHALLENGES,
  TOPIC_08_LESSONS,
  TOPIC_09_LESSONS,
} from '../data/curriculumData';

interface ProgressDashboardProps {
  progress: LearningProgress;
  onToggleLesson: (lessonId: string) => void;
  onResetProgress: () => void;
  onNavigate: (section: SectionId) => void;
  onOpenTopic: (topic: TopicId) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  onToggleLesson,
  onResetProgress,
  onNavigate,
  onOpenTopic,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const t8LessonsDone = TOPIC_08_LESSONS.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;
  const t9LessonsDone = TOPIC_09_LESSONS.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;

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

  // Topic Completion %: 9 lessons + 5 challenges + 1 quiz (weight 15 items per topic)
  const topic08Percent = Math.round(
    ((t8LessonsDone + t8ChallengesDone + (progress.quizScores.conditionals ? 1 : 0)) / 15) * 100
  );
  const topic09Percent = Math.round(
    ((t9LessonsDone + t9ChallengesDone + (progress.quizScores.loops ? 1 : 0)) / 15) * 100
  );

  const gamesCompleted = Object.values(progress.gameScores).filter((g) => g.completed).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-800/80 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium text-blue-400">Progress Tracker</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-white sm:text-4xl">
            Your Learning Progress
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Stored locally in your browser via <code className="font-mono text-sky-300">localStorage</code>.
          </p>
        </div>

        {/* Inline Two-Step Reset Confirmation */}
        <div className="flex items-center gap-2">
          {confirmReset ? (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2">
              <span className="text-xs text-rose-200">Reset all saved progress?</span>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="rounded-md bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-500"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-rose-500/50 hover:text-rose-200"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset Progress
            </button>
          )}
        </div>
      </div>

      {/* Topic Completion Overview Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800/90 bg-[#0D1426] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs text-blue-400">Topic 08</span>
              <h2 className="font-display text-xl font-bold text-white">Conditional Statements</h2>
            </div>
            <span className="font-mono text-2xl font-bold text-blue-300 tabular-nums">
              {topic08Percent}%
            </span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${topic08Percent}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg border border-slate-800/80 bg-[#090E1A] p-3">
              <span className="text-slate-400">Lessons</span>
              <p className="mt-1 font-mono font-bold text-white tabular-nums">
                {t8LessonsDone} / {TOPIC_08_LESSONS.length}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800/80 bg-[#090E1A] p-3">
              <span className="text-slate-400">Challenges</span>
              <p className="mt-1 font-mono font-bold text-white tabular-nums">
                {t8ChallengesDone} / 5
              </p>
            </div>
            <div className="rounded-lg border border-slate-800/80 bg-[#090E1A] p-3">
              <span className="text-slate-400">Best Quiz</span>
              <p className="mt-1 font-mono font-bold text-emerald-300 tabular-nums">
                {progress.quizScores.conditionals
                  ? `${Math.round(t8QuizPct * 100)}%`
                  : '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/90 bg-[#0D1426] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs text-violet-400">Topic 09</span>
              <h2 className="font-display text-xl font-bold text-white">Loops</h2>
            </div>
            <span className="font-mono text-2xl font-bold text-violet-300 tabular-nums">
              {topic09Percent}%
            </span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-300"
              style={{ width: `${topic09Percent}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg border border-slate-800/80 bg-[#090E1A] p-3">
              <span className="text-slate-400">Lessons</span>
              <p className="mt-1 font-mono font-bold text-white tabular-nums">
                {t9LessonsDone} / {TOPIC_09_LESSONS.length}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800/80 bg-[#090E1A] p-3">
              <span className="text-slate-400">Challenges</span>
              <p className="mt-1 font-mono font-bold text-white tabular-nums">
                {t9ChallengesDone} / 5
              </p>
            </div>
            <div className="rounded-lg border border-slate-800/80 bg-[#090E1A] p-3">
              <span className="text-slate-400">Best Quiz</span>
              <p className="mt-1 font-mono font-bold text-emerald-300 tabular-nums">
                {progress.quizScores.loops ? `${Math.round(t9QuizPct * 100)}%` : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800/90 bg-[#0D1426] p-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <BookOpen className="h-4 w-4 text-blue-400" aria-hidden="true" />
            Total Lessons
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
            {progress.completedLessons.length} / {TOPIC_08_LESSONS.length + TOPIC_09_LESSONS.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800/90 bg-[#0D1426] p-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Code2 className="h-4 w-4 text-violet-400" aria-hidden="true" />
            Coding Challenges
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
            {progress.completedChallenges.length} / {CODING_CHALLENGES.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800/90 bg-[#0D1426] p-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Gamepad2 className="h-4 w-4 text-sky-400" aria-hidden="true" />
            Mini-Games Played
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
            {gamesCompleted} / 8
          </p>
        </div>
        <div className="rounded-xl border border-slate-800/90 bg-[#0D1426] p-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Award className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            Quizzes Taken
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
            {(progress.quizScores.conditionals ? 1 : 0) + (progress.quizScores.loops ? 1 : 0)} / 2
          </p>
        </div>
      </div>

      {/* Detailed Lesson Checklists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800/90 bg-[#0D1426] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-white">
              Topic 08 Lesson Checklist
            </h3>
            <button
              type="button"
              onClick={() => onOpenTopic('conditionals')}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
            >
              Open Lessons <ArrowRight className="h-3.5 w-3.5" />
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
                  className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-800/80 bg-[#090E1A] px-3.5 py-2.5 text-left text-xs transition-colors hover:border-slate-700"
                >
                  <span className="text-slate-200">
                    <span className="mr-2 font-mono text-slate-500">{lesson.number}</span>
                    {lesson.title}
                  </span>
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-slate-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/90 bg-[#0D1426] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-white">
              Topic 09 Lesson Checklist
            </h3>
            <button
              type="button"
              onClick={() => onOpenTopic('loops')}
              className="inline-flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300"
            >
              Open Lessons <ArrowRight className="h-3.5 w-3.5" />
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
                  className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-800/80 bg-[#090E1A] px-3.5 py-2.5 text-left text-xs transition-colors hover:border-slate-700"
                >
                  <span className="text-slate-200">
                    <span className="mr-2 font-mono text-slate-500">{lesson.number}</span>
                    {lesson.title}
                  </span>
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-slate-600" />
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
          onClick={() => onNavigate('challenges')}
          className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
        >
          Practice Coding Challenges
        </button>
        <button
          type="button"
          onClick={() => onNavigate('quiz')}
          className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white"
        >
          Take Topic Quizzes
        </button>
      </div>
    </div>
  );
};
