import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Lightbulb,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { TopicId } from '../types';
import { getDailyQuestForDate } from '../data/ecosystemData';
import { getLocalDateKey } from '../hooks/useProgress';
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
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#8B5CF6]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Daily Python Quest
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-mono tabular-nums">
              <Calendar className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />
              {dateKey}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-mono tabular-nums">
              <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              ~{quest.estimatedMinutes} min
            </span>
          </div>
          <h3 className="mt-1.5 font-display text-lg font-bold text-[#1E293B] sm:text-xl">
            {quest.title}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#64748B]">{quest.instructions}</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-semibold">
          <span className="text-[#2563EB]">+{quest.xpReward} XP</span>
          {alreadyCompleted && (
            <span className="inline-flex items-center gap-1 text-emerald-700">
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
                'border-slate-200 bg-[#F8FAFC] text-[#1E293B] hover:border-sky-300 hover:bg-[#F0F9FF]';
              if (submitted) {
                if (idx === quest.correctIndex) {
                  cls = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold';
                } else if (chosen) {
                  cls = 'border-rose-300 bg-rose-50 text-rose-900';
                } else {
                  cls = 'border-slate-200 bg-white text-slate-500 opacity-75';
                }
              } else if (chosen) {
                cls = 'border-[#2563EB] bg-[#F0F9FF] text-[#1E293B] font-semibold';
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
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  )}
                  {submitted && chosen && idx !== quest.correctIndex && (
                    <XCircle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
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
                className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#8B5CF6] px-4 py-2 font-display text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 disabled:opacity-40"
              >
                Check Answer
              </button>
            )}

            {submitted && !isCorrect && (
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#1E293B] hover:border-sky-300"
              >
                Try Again
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowHint((h) => !h)}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-2 text-xs font-medium text-[#64748B] hover:text-[#1E293B]"
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
              {showHint ? 'Hide Hint' : 'Hint'}
            </button>
          </div>

          {showHint && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-900">
              <strong>Hint:</strong> {quest.hint}
            </p>
          )}

          {submitted && (
            <div
              className={`rounded-xl border px-3.5 py-3 text-xs leading-relaxed ${
                isCorrect
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : 'border-rose-200 bg-rose-50 text-rose-900'
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

          <p className="text-[11px] text-[#64748B]">
            Quest resets automatically each local calendar day and saves completion locally in your browser.
          </p>
        </div>
      </div>
    </div>
  );
};
