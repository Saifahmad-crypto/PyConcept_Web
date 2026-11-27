import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Lightbulb,
  Sparkles,
  XCircle,
  Flame,
} from 'lucide-react';
import { TopicId } from '../types';
import { getDailyQuestForDate } from '../data/ecosystemData';
import { getLocalDateKey, computeStreakDays } from '../hooks/useProgress';
import { CodeBlock } from './CodeBlock';

interface DailyQuestCardProps {
  completedDailyQuests: string[];
  onCompleteDailyQuest: (
    questId: string,
    title: string,
    topic: TopicId,
    xpReward: number
  ) => void;
  compact?: boolean;
}

export const DailyQuestCard: React.FC<DailyQuestCardProps> = ({
  completedDailyQuests,
  onCompleteDailyQuest,
  compact = false,
}) => {
  const dateKey = getLocalDateKey();
  const quest = getDailyQuestForDate(dateKey);
  const alreadyCompleted = completedDailyQuests.includes(quest.id);

  const streakDays = React.useMemo(() => {
    try {
      const stored = localStorage.getItem('pyverse_learning_progress_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.activeDates) {
          return computeStreakDays(parsed.activeDates);
        }
      }
    } catch {}
    return 0;
  }, []);

  const [selected, setSelected] = useState<number | null>(
    alreadyCompleted ? quest.correctIndex : null
  );
  const [submitted, setSubmitted] = useState(alreadyCompleted);
  const [showHint, setShowHint] = useState(false);

  const isCorrect = submitted && selected === quest.correctIndex;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (selected === quest.correctIndex && !alreadyCompleted) {
      onCompleteDailyQuest(quest.id, quest.title, quest.topic, quest.xpReward);
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setSubmitted(false);
  };

  return (
    <div className="rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#F1EEEE] dark:border-[#2a1212] pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A8585] dark:text-[#9a8585]">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#E10906]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Daily Python Quest
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-mono tabular-nums">
              <Calendar className="h-3.5 w-3.5 text-[#E10906]" aria-hidden="true" />
              {dateKey}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-mono tabular-nums">
              <Clock className="h-3.5 w-3.5 text-[#8A8585] dark:text-[#9a8585]" aria-hidden="true" />
              ~{quest.estimatedMinutes} min
            </span>
          </div>
          <h3 className="mt-1.5 font-display text-lg font-bold text-[#100303] dark:text-[#f0eaea] sm:text-xl">
            {quest.title}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#8A8585] dark:text-[#9a8585]">{quest.instructions}</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-semibold">
          <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1 text-amber-600 dark:text-amber-400">
            <Flame className="h-3.5 w-3.5 fill-current" />
            {streakDays} Day Streak
          </span>
          <span className="text-[#E10906]">+{quest.xpReward} XP</span>
          {alreadyCompleted && (
            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Claimed today
            </span>
          )}
        </div>
      </div>

      <div className={`mt-4 grid grid-cols-1 gap-5 ${compact ? '' : 'lg:grid-cols-12'}`}>
        <div className={compact ? '' : 'lg:col-span-6'}>
          <CodeBlock title="daily_quest.py" code={quest.code} />
        </div>

        <div className={`space-y-3 ${compact ? '' : 'lg:col-span-6'}`}>
          <div className="space-y-2">
            {quest.options.map((opt, idx) => {
              const chosen = selected === idx;
              let cls =
                'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906] hover:bg-[#FFF1F1] dark:hover:bg-[#2a0808] dark:bg-[#2a0808]';
              if (submitted) {
                if (idx === quest.correctIndex) {
                  cls = 'border-emerald-300 dark:border-emerald-700/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                } else if (chosen) {
                  cls = 'border-rose-300 dark:border-rose-700/60 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                } else {
                  cls = 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] opacity-75';
                }
              } else if (chosen) {
                cls = 'border-[#E10906] bg-[#FFF1F1] dark:bg-[#2a0808] text-[#100303] dark:text-[#f0eaea] font-semibold';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={submitted && isCorrect}
                  onClick={() => {
                    if (submitted && !isCorrect) setSubmitted(false);
                    setSelected(idx);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-xs sm:text-sm transition-colors ${cls}`}
                >
                  <span className="font-mono">{opt}</span>
                  {submitted && idx === quest.correctIndex && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  )}
                  {submitted && chosen && idx !== quest.correctIndex && (
                    <XCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {!(submitted && isCorrect) && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={selected === null}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-[#E10906] px-4 py-2 font-display text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 disabled:opacity-40"
              >
                Check Answer
              </button>
            )}

            {submitted && !isCorrect && (
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3.5 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906]"
              >
                Try Again
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowHint((h) => !h)}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3.5 py-2 text-xs font-medium text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]"
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
              {showHint ? 'Hide Hint' : 'Hint'}
            </button>
          </div>

          {showHint && (
            <p className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 px-3.5 py-2.5 text-xs text-amber-900 dark:text-amber-200">
              <strong>Hint:</strong> {quest.hint}
            </p>
          )}

          {submitted && (
            <div
              className={`rounded-xl border px-3.5 py-3 text-xs leading-relaxed ${
                isCorrect
                  ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                  : 'border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
              }`}
            >
              <p className="font-bold">
                {isCorrect
                  ? alreadyCompleted
                    ? 'Correct! Today’s Daily Quest XP has been recorded.'
                    : `Correct! +${quest.xpReward} XP awarded.`
                  : 'Not quite — review the hint and try again.'}
              </p>
              {isCorrect && <p className="mt-1">{quest.explanation}</p>}
            </div>
          )}

          <p className="text-[11px] text-[#8A8585] dark:text-[#9a8585]">
            Quest resets automatically each local calendar day and saves completion locally in your browser.
          </p>
        </div>
      </div>
    </div>
  );
};
