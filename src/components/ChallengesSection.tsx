import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Play,
  RotateCcw,
  Lightbulb,
  Eye,
  AlertCircle,
  Sparkles,
  Flame,
  Calendar,
  Code2,
} from 'lucide-react';
import { CODING_CHALLENGES } from '../data/curriculumData';
import { TopicId } from '../types';
import { runPythonCode } from '../utils/pythonEngine';
import { getLocalDateKey, computeStreakDays } from '../hooks/useProgress';
import { CodeBlock } from './CodeBlock';

interface ChallengesSectionProps {
  completedChallenges: string[];
  onCompleteChallenge: (id: string) => void;
  externalChallengeId?: string | null;
  onConsumeExternalChallenge?: () => void;
}

type ChallengeTopic = Exclude<TopicId, 'basics'>;

export const ChallengesSection: React.FC<ChallengesSectionProps> = ({
  completedChallenges,
  onCompleteChallenge,
  externalChallengeId,
  onConsumeExternalChallenge,
}) => {
  const [topicFilter, setTopicFilter] = useState<ChallengeTopic>('conditionals');
  const filteredChallenges = CODING_CHALLENGES.filter((c) => c.topic === topicFilter);
  const [activeId, setActiveId] = useState<string>(CODING_CHALLENGES[0].id);
  const activeChallenge =
    CODING_CHALLENGES.find((c) => c.id === activeId) || filteredChallenges[0];

  // Daily Challenge rotation from pool based on date
  const todayKey = getLocalDateKey();
  const dailyChallenge = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < todayKey.length; i++) {
      hash = (hash * 31 + todayKey.charCodeAt(i)) >>> 0;
    }
    return CODING_CHALLENGES[hash % CODING_CHALLENGES.length];
  }, [todayKey]);

  // Read streak from localStorage
  const currentStreak = useMemo(() => {
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

  const [codeMap, setCodeMap] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    CODING_CHALLENGES.forEach((c) => {
      initial[c.id] = c.starterCode;
    });
    return initial;
  });

  const [feedback, setFeedback] = useState<{
    passed: boolean;
    message: string;
    output: string;
  } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    if (!externalChallengeId) return;
    const found = CODING_CHALLENGES.find((c) => c.id === externalChallengeId);
    if (found) {
      setTopicFilter(found.topic);
      setActiveId(found.id);
      setFeedback(null);
      setShowHint(false);
      setShowSolution(false);
    }
    onConsumeExternalChallenge?.();
  }, [externalChallengeId, onConsumeExternalChallenge]);

  const selectChallenge = (id: string) => {
    setActiveId(id);
    setFeedback(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const handleTopicSwitch = (topic: ChallengeTopic) => {
    setTopicFilter(topic);
    const first = CODING_CHALLENGES.find((c) => c.topic === topic);
    if (first) selectChallenge(first.id);
  };

  const currentCode = codeMap[activeChallenge.id] ?? activeChallenge.starterCode;

  const handleVerify = () => {
    const res = runPythonCode(currentCode);
    if (!res.success) {
      setFeedback({
        passed: false,
        message: `${res.error?.type || 'Error'} (Line ${res.error?.line || 1}): ${
          res.error?.message || 'Check your syntax.'
        } ${res.error?.hint || ''}`,
        output: res.output,
      });
      return;
    }

    const check = activeChallenge.validateOutput(res.output, currentCode);
    setFeedback({
      passed: check.passed,
      message: check.message,
      output: res.output,
    });
    if (check.passed) {
      onCompleteChallenge(activeChallenge.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const updated = currentCode.substring(0, start) + '    ' + currentCode.substring(end);
      setCodeMap((prev) => ({ ...prev, [activeChallenge.id]: updated }));
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      });
    }
  };

  const conditionalsCount = CODING_CHALLENGES.filter((c) => c.topic === 'conditionals').length;
  const loopsCount = CODING_CHALLENGES.filter((c) => c.topic === 'loops').length;
  const isDailyCompleted = completedChallenges.includes(dailyChallenge.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#E5DFDF] dark:border-[#3a1a1a] pb-6 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#E10906]">PyVerse Engineering Lab</span>
            <span className="rounded-full bg-[#E10906]/10 px-2 py-0.5 text-[10px] font-mono font-bold text-[#E10906]">
              {CODING_CHALLENGES.length} Lab Challenges
            </span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-[#100303] dark:text-[#f0eaea] sm:text-4xl">
            Engineering Coding Challenges
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#8A8585] dark:text-[#9a8585]">
            Write real Python solutions for 60 structured lab problems ({conditionalsCount} Conditionals, {loopsCount} Loops)
            with comprehensive multi-case verification.
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-1 gap-1">
          <button
            type="button"
            onClick={() => handleTopicSwitch('conditionals')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
              topicFilter === 'conditionals'
                ? 'bg-[#E10906] text-white shadow-sm'
                : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
            }`}
          >
            Topic 08 · Conditionals ({conditionalsCount})
          </button>
          <button
            type="button"
            onClick={() => handleTopicSwitch('loops')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
              topicFilter === 'loops'
                ? 'bg-[#E10906] text-white shadow-sm'
                : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
            }`}
          >
            Topic 09 · Loops ({loopsCount})
          </button>
        </div>
      </div>

      {/* Daily Challenge Highlight Banner */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Today&apos;s Featured Lab Challenge · {todayKey}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400">
                  <Flame className="h-3.5 w-3.5 fill-current" />
                  {currentStreak} Day Streak
                </span>
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-[#100303] dark:text-[#f0eaea]">
                {dailyChallenge.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isDailyCompleted ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Completed Today
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTopicFilter(dailyChallenge.topic);
                  selectChallenge(dailyChallenge.id);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#E10906] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#c40805]"
              >
                <Code2 className="h-4 w-4" />
                Solve Today&apos;s Challenge
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Challenges List */}
        <div className="space-y-3 lg:col-span-5">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-display text-base font-bold text-[#100303] dark:text-[#f0eaea]">
              {topicFilter === 'conditionals' ? 'Conditionals Lab' : 'Loops Lab'} Problems
            </h2>
            <span className="font-mono text-xs text-[#8A8585] dark:text-[#9a8585]">
              {filteredChallenges.filter((c) => completedChallenges.includes(c.id)).length} /{' '}
              {filteredChallenges.length} Solved
            </span>
          </div>

          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {filteredChallenges.map((challenge, idx) => {
              const isActive = challenge.id === activeChallenge.id;
              const isCompleted = completedChallenges.includes(challenge.id);

              return (
                <button
                  key={challenge.id}
                  type="button"
                  onClick={() => selectChallenge(challenge.id)}
                  className={`flex w-full items-start justify-between gap-3 rounded-xl border p-3.5 text-left transition-all ${
                    isActive
                      ? 'border-[#E10906] bg-[#FFF1F1] dark:bg-[#2a0808] text-[#100303] dark:text-[#f0eaea] shadow-sm'
                      : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906] hover:bg-[#FFF1F1] dark:hover:bg-[#220a0a]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#8A8585] dark:text-[#9a8585]">
                        #{idx + 1}
                      </span>
                      <span className="font-display text-sm font-semibold">{challenge.title}</span>
                    </div>
                    <p className="line-clamp-1 text-xs text-[#8A8585] dark:text-[#9a8585]">
                      {challenge.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        challenge.difficulty === 'Beginner'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : challenge.difficulty === 'Guided'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Done
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Challenge Workspace */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#E10906]">Challenge Workspace</span>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-bold ${
                    activeChallenge.difficulty === 'Beginner'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : activeChallenge.difficulty === 'Guided'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {activeChallenge.difficulty} Level
                </span>
              </div>
              <h2 className="mt-1 font-display text-xl font-bold text-[#100303] dark:text-[#f0eaea]">
                {activeChallenge.title}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#8A8585] dark:text-[#9a8585] leading-relaxed">
                {activeChallenge.description}
              </p>
            </div>

            {/* Requirements & Sample Output */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3 text-xs space-y-1.5">
                <span className="font-semibold text-[#100303] dark:text-[#f0eaea]">Requirements:</span>
                <ul className="list-inside list-disc space-y-1 text-[#8A8585] dark:text-[#9a8585]">
                  {activeChallenge.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3 text-xs space-y-1.5">
                <span className="font-semibold text-[#100303] dark:text-[#f0eaea]">Expected Sample Output:</span>
                <pre className="font-mono text-emerald-600 dark:text-emerald-400 bg-black/5 dark:bg-white/5 p-2 rounded-lg whitespace-pre-wrap">
                  {activeChallenge.sampleOutput}
                </pre>
              </div>
            </div>

            {/* Editor */}
            <div className="overflow-hidden rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#100303] shadow-sm">
              <div className="flex items-center justify-between border-b border-[#2C1616] bg-[#190909] px-4 py-2 text-xs text-[#CFC8C8]">
                <span className="font-mono font-medium">solution.py</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowHint((h) => !h)}
                    className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200"
                  >
                    <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                    {showHint ? 'Hide Hint' : 'Hint'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSolution((s) => !s)}
                    className="inline-flex items-center gap-1 text-[#CFC8C8] hover:text-white"
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    {showSolution ? 'Hide Solution' : 'Solution'}
                  </button>
                </div>
              </div>
              <textarea
                aria-label="Challenge Python editor"
                value={currentCode}
                onChange={(e) =>
                  setCodeMap((prev) => ({ ...prev, [activeChallenge.id]: e.target.value }))
                }
                onKeyDown={handleKeyDown}
                spellCheck={false}
                rows={9}
                className="w-full resize-y bg-transparent p-4 font-mono text-sm leading-6 text-[#FBF5F9] focus:outline-none"
              />
            </div>

            {showHint && (
              <div className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 p-3.5 text-xs text-amber-900 dark:text-amber-200">
                <strong>Hint:</strong> {activeChallenge.hint}
              </div>
            )}

            {showSolution && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#8A8585] dark:text-[#9a8585]">Reference Solution:</p>
                <CodeBlock code={activeChallenge.solutionCode} title="reference_solution.py" compact />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleVerify}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#E10906] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                Run &amp; Verify (5+ Test Cases)
              </button>
              <button
                type="button"
                onClick={() => {
                  setCodeMap((prev) => ({
                    ...prev,
                    [activeChallenge.id]: activeChallenge.starterCode,
                  }));
                  setFeedback(null);
                }}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-4 py-2 text-xs font-medium text-[#100303] dark:text-[#f0eaea] transition-colors hover:bg-[#F1EEEE] dark:hover:bg-[#221010]"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset Code
              </button>
            </div>

            {/* Test Results & Feedback */}
            {feedback && (
              <div
                className={`rounded-xl border p-4 text-xs sm:text-sm ${
                  feedback.passed
                    ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                    : 'border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {feedback.passed ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      Challenge Passed!
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                      Keep Trying
                    </>
                  )}
                </div>
                <p className="mt-1.5 text-[#100303] dark:text-[#f0eaea]">{feedback.message}</p>
                {feedback.output && (
                  <pre className="mt-2.5 rounded-xl bg-[#100303] p-3 font-mono text-xs text-emerald-300">
                    Sample Output:{'\n'}
                    {feedback.output}
                  </pre>
                )}

                {/* Phase 3 Feature: Show Explanation on Solve! */}
                {feedback.passed && activeChallenge.explanation && (
                  <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-900 dark:text-emerald-200">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                      <Sparkles className="h-4 w-4 text-emerald-500" />
                      Concept Insight / Why This Works:
                    </div>
                    <p className="mt-1 leading-relaxed font-sans">{activeChallenge.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
