import React, { useState } from 'react';
import {
  Lightbulb,
  Eye,
  CheckCircle2,
  XCircle,
  Code2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { TutorPracticeCard, TutorQuizCard } from '../../types';
import { TutorCodePanel } from './TutorCodePanel';

interface PracticeCardProps {
  card: TutorPracticeCard;
  onRevealNextHint: () => void;
  onRevealSolution: () => void;
  onOpenInPlayground: (code: string) => void;
  onDraftAttempt: (starter: string, title: string) => void;
}

export const PracticeQuestionCard: React.FC<PracticeCardProps> = ({
  card,
  onRevealNextHint,
  onRevealSolution,
  onOpenInPlayground,
  onDraftAttempt,
}) => {
  const hints = [card.hint1, card.hint2, card.hint3];

  return (
    <div className="mt-2 rounded-2xl border border-sky-200 bg-gradient-to-br from-white to-[#F0F9FF]/60 p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div>
          <span className="font-mono text-xs font-semibold text-sky-700">
            Practice Challenge · {card.concept} · {card.difficulty}
          </span>
          <h4 className="mt-0.5 font-display text-base font-bold text-[#1E293B]">
            {card.title}
          </h4>
        </div>
        <button
          type="button"
          onClick={() => onDraftAttempt(card.starterCode, card.title)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-95 whitespace-nowrap"
        >
          <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
          Write My Attempt
        </button>
      </div>

      <p className="text-sm leading-relaxed text-[#1E293B]">{card.problemStatement}</p>

      <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs">
        <span className="font-semibold text-slate-600">Expected Output / Goal: </span>
        <span className="font-mono font-semibold text-emerald-700">{card.expectedOutput}</span>
      </div>

      {card.starterCode && (
        <TutorCodePanel
          code={card.starterCode}
          language="python"
          onOpenInPlayground={onOpenInPlayground}
        />
      )}

      {/* Progressive Hint-First Section */}
      {card.hintsRevealed > 0 && (
        <div className="space-y-2">
          {hints.slice(0, card.hintsRevealed).map((hintText, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-950"
            >
              <strong className="font-semibold">
                Hint {idx + 1} (
                {idx === 0
                  ? 'Concept Clue'
                  : idx === 1
                  ? 'Direction'
                  : 'Code Structure'}
                ):
              </strong>{' '}
              {hintText}
            </div>
          ))}
        </div>
      )}

      {/* Hint & Solution Controls */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        {card.hintsRevealed < 3 && (
          <button
            type="button"
            onClick={onRevealNextHint}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-100 whitespace-nowrap"
          >
            <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
            {card.hintsRevealed === 0
              ? 'Get Hint 1'
              : `Get Hint ${card.hintsRevealed + 1} of 3`}
          </button>
        )}

        {!card.solutionRevealed && (
          <button
            type="button"
            onClick={onRevealSolution}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-violet-300 hover:text-violet-700 whitespace-nowrap"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            Show Solution
          </button>
        )}
      </div>

      {/* Revealed Solution (only when explicitly requested) */}
      {card.solutionRevealed && (
        <div className="rounded-xl border border-violet-200 bg-[#F5F3FF]/60 p-4 space-y-2">
          <p className="text-xs font-bold text-violet-800">Complete Working Solution</p>
          <TutorCodePanel
            code={card.solutionCode}
            language="python"
            onOpenInPlayground={onOpenInPlayground}
          />
          <p className="text-xs leading-relaxed text-slate-700">{card.solutionExplanation}</p>
        </div>
      )}
    </div>
  );
};

interface QuizCardProps {
  card: TutorQuizCard;
  onSubmitAnswer: (selectedIndex: number) => void;
  onRequestFollowUp: (kind: 'simpler' | 'harder' | 'explain', concept: string) => void;
  onOpenInPlayground: (code: string) => void;
}

export const QuizQuestionCard: React.FC<QuizCardProps> = ({
  card,
  onSubmitAnswer,
  onRequestFollowUp,
  onOpenInPlayground,
}) => {
  const [picked, setPicked] = useState<number | null>(
    card.selectedIndex !== undefined ? card.selectedIndex : null
  );

  const submitted = Boolean(card.submitted);
  const chosen = submitted ? (card.selectedIndex ?? picked) : picked;
  const isCorrect = submitted && chosen === card.correctIndex;

  return (
    <div className="mt-2 rounded-2xl border border-violet-200 bg-gradient-to-br from-white to-[#F5F3FF]/50 p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
        <span className="font-mono text-xs font-semibold text-violet-700">
          Understanding Check · {card.concept} · {card.difficulty}
        </span>
      </div>

      <p className="text-sm font-semibold text-[#1E293B]">{card.question}</p>

      {card.codeSnippet && card.codeSnippet.trim() !== '' && (
        <TutorCodePanel
          code={card.codeSnippet}
          language="python"
          onOpenInPlayground={onOpenInPlayground}
        />
      )}

      <div className="space-y-2">
        {card.options.map((opt, idx) => {
          const isSelected = chosen === idx;
          const isRight = idx === card.correctIndex;
          let cls =
            'border-slate-200 bg-white text-[#1E293B] hover:border-sky-300 hover:bg-[#F0F9FF]/60';
          if (submitted) {
            if (isRight) {
              cls = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
            } else if (isSelected && !isRight) {
              cls = 'border-rose-500 bg-rose-50 text-rose-950';
            }
          } else if (isSelected) {
            cls =
              'border-sky-500 bg-gradient-to-r from-[#0EA5E9]/10 to-[#8B5CF6]/10 font-semibold ring-1 ring-sky-400/40';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={submitted}
              onClick={() => setPicked(idx)}
              className={`flex min-h-[42px] w-full items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-left font-mono text-xs transition-all ${cls}`}
            >
              <span className="font-bold text-slate-500">{String.fromCharCode(65 + idx)}.</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <div className="flex justify-end">
          <button
            type="button"
            disabled={picked === null}
            onClick={() => {
              if (picked !== null) onSubmitAnswer(picked);
            }}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-95 disabled:opacity-40"
          >
            Check Answer
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div
            className={`rounded-xl border p-3.5 text-xs ${
              isCorrect
                ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                : 'border-rose-200 bg-rose-50 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  Spot on! You understood {card.concept}.
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-rose-600" aria-hidden="true" />
                  Not quite — Correct choice is {String.fromCharCode(65 + card.correctIndex)}.
                </>
              )}
            </div>
            <p className="mt-1.5 leading-relaxed text-slate-700">{card.explanation}</p>
            <p className="mt-1.5 text-[11px] font-medium text-slate-600">
              Recommended next: {card.recommendedPractice}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isCorrect ? (
              <button
                type="button"
                onClick={() => onRequestFollowUp('harder', card.concept)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Try Harder Question
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onRequestFollowUp('explain', card.concept)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-sky-300 bg-[#F0F9FF] px-3.5 py-1.5 text-xs font-semibold text-sky-800 hover:bg-sky-100"
                >
                  Explain Why
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onRequestFollowUp('simpler', card.concept)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-violet-300"
                >
                  Try Simpler Question
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
