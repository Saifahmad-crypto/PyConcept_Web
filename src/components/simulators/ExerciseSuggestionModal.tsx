import React, { useEffect } from 'react';
import {
  X,
  Code2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Target,
} from 'lucide-react';
import { CodingChallenge, SimulatorId } from '../../types';
import { CODING_CHALLENGES } from '../../data/curriculumData';

export type VisualPatternKey =
  | SimulatorId
  | 'if-basic'
  | 'if-else'
  | 'if-elif-else'
  | 'nested-if'
  | 'for'
  | 'while';

export interface ExerciseSuggestion {
  patternName: string;
  patternSummary: string;
  challenge: CodingChallenge;
}

const PATTERN_TO_CHALLENGE: Record<
  VisualPatternKey,
  { challengeId: string; patternName: string; patternSummary: string }
> = {
  'traffic-signal': {
    challengeId: 'ch-c1',
    patternName: 'if-elif-else Branching',
    patternSummary:
      'Practice mutually exclusive if-elif-else checks with Positive, Negative, or Zero.',
  },
  'smart-ac': {
    challengeId: 'ch-c2',
    patternName: 'if-else Boolean Condition',
    patternSummary:
      'Apply a crisp two-branch if-else decision using numeric comparison and modulo checks.',
  },
  'shopping-discount': {
    challengeId: 'ch-c4',
    patternName: 'Tiered if-elif-else Thresholds',
    patternSummary:
      'Build a descending threshold ladder—just like tiered checkout discounts.',
  },
  'atm-decision': {
    challengeId: 'ch-c5',
    patternName: 'Nested & Logical (and) Conditions',
    patternSummary:
      'Verify two safety rules together using combined logical conditions.',
  },
  'elevator-floor': {
    challengeId: 'ch-l1',
    patternName: 'for loop + range() Sequence',
    patternSummary:
      'Practice controlling exact start and stop bounds in range() without off-by-one bugs.',
  },
  'countdown-timer': {
    challengeId: 'ch-l3',
    patternName: 'Step-by-Step Iteration & Output',
    patternSummary:
      'Format each pass of a controlled sequence loop cleanly into multi-line output.',
  },
  'parking-scanner': {
    challengeId: 'ch-l4',
    patternName: 'Loop + Conditional Inspection',
    patternSummary:
      'Combine iteration with an inner if check to inspect and count matching values.',
  },
  'atm-cash-counter': {
    challengeId: 'ch-l2',
    patternName: 'Loop Accumulator Pattern',
    patternSummary:
      'Initialize total = 0 before the loop and accumulate values across every pass.',
  },
  'if-basic': {
    challengeId: 'ch-c2',
    patternName: 'Single Condition & Modulo',
    patternSummary:
      'Write a clean Python condition to test whether a number is even or odd.',
  },
  'if-else': {
    challengeId: 'ch-c3',
    patternName: 'if-else Comparison Branches',
    patternSummary:
      'Compare two numeric variables and handle equal values gracefully.',
  },
  'if-elif-else': {
    challengeId: 'ch-c4',
    patternName: 'Ordered if-elif-else Ladder',
    patternSummary:
      'Order grade thresholds from highest to lowest so only the first True branch runs.',
  },
  'nested-if': {
    challengeId: 'ch-c5',
    patternName: 'Combined Eligibility Rules',
    patternSummary:
      'Combine GPA and attendance thresholds using logical conditions.',
  },
  for: {
    challengeId: 'ch-l1',
    patternName: 'for loop + range()',
    patternSummary:
      'Write a for loop with range(1, 11) to print all numbers from 1 through 10.',
  },
  while: {
    challengeId: 'ch-l2',
    patternName: 'Loop Accumulation & Termination',
    patternSummary:
      'Sum numbers sequentially in a loop and print the final accumulated total.',
  },
};

export function getExerciseSuggestion(patternKey: VisualPatternKey): ExerciseSuggestion {
  const mapping = PATTERN_TO_CHALLENGE[patternKey];
  const challenge =
    CODING_CHALLENGES.find((c) => c.id === mapping.challengeId) || CODING_CHALLENGES[0];
  return {
    patternName: mapping.patternName,
    patternSummary: mapping.patternSummary,
    challenge,
  };
}

interface ExerciseSuggestionModalProps {
  isOpen: boolean;
  simulationTitle: string;
  patternKey: VisualPatternKey;
  completedChallenges?: string[];
  onClose: () => void;
  onReplay?: () => void;
  onStartChallenge: (challengeId: string) => void;
}

export const ExerciseSuggestionModal: React.FC<ExerciseSuggestionModalProps> = ({
  isOpen,
  simulationTitle,
  patternKey,
  completedChallenges = [],
  onClose,
  onReplay,
  onStartChallenge,
}) => {
  const suggestion = getExerciseSuggestion(patternKey);
  const { challenge } = suggestion;
  const isChallengeCompleted = completedChallenges.includes(challenge.id);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-suggestion-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Banner */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-gradient-to-r from-[#F0F9FF] via-white to-[#F5F3FF] px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#38BDF8] via-[#2563EB] to-[#8B5CF6] text-white shadow-sm">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-mono text-[11px] font-semibold text-[#2563EB]">
                Exercise Suggestion · {simulationTitle}
              </p>
              <h2
                id="exercise-suggestion-title"
                className="mt-0.5 font-display text-xl font-extrabold text-[#1E293B]"
              >
                Apply What You Just Visualized
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close exercise suggestion"
            className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#1E293B]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Recommendation Body */}
        <div className="space-y-4 p-6">
          <div className="rounded-2xl border border-sky-200/80 bg-[#F0F9FF]/70 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB]">
              <Target className="h-4 w-4 shrink-0" aria-hidden="true" />
              Pattern Practiced: {suggestion.patternName}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
              {suggestion.patternSummary}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold text-[#8B5CF6]">
                {challenge.topic === 'conditionals' ? 'Conditionals' : 'Loops'} ·{' '}
                {challenge.difficulty}
              </span>
              {isChallengeCompleted && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Already Completed
                </span>
              )}
            </div>

            <h3 className="font-display text-lg font-bold text-[#1E293B]">
              {challenge.title}
            </h3>

            <p className="text-xs leading-relaxed text-[#64748B]">{challenge.description}</p>

            <div className="rounded-xl bg-[#0F172A] p-3">
              <p className="text-[11px] font-semibold text-slate-400">Sample Target Output</p>
              <pre className="mt-1 whitespace-pre-wrap font-mono text-xs text-emerald-300">
                {challenge.sampleOutput}
              </pre>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              {onReplay && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onReplay();
                  }}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-2 text-xs font-semibold text-[#1E293B] hover:border-sky-300 whitespace-nowrap"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />
                  Replay Simulation
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[40px] items-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-[#64748B] hover:text-[#1E293B] whitespace-nowrap"
              >
                Keep Exploring
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onStartChallenge(challenge.id);
              }}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#8B5CF6] px-5 py-2 font-display text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md whitespace-nowrap"
            >
              <Code2 className="h-4 w-4" aria-hidden="true" />
              {isChallengeCompleted ? 'Practice Again' : 'Try Challenge'}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
