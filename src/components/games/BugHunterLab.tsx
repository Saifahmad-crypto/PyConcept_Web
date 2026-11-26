import React, { useState } from 'react';
import {
  Bug,
  Play,
  Lightbulb,
  Eye,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { BugChallengeDef, TopicId } from '../../types';
import { BUG_HUNT_CHALLENGES } from '../../data/ecosystemData';
import { runPythonCode } from '../../utils/pythonEngine';
import { CodeBlock } from '../CodeBlock';

interface BugHunterLabProps {
  completedBugHunts: string[];
  onCompleteBugHunt: (
    bugId: string,
    title: string,
    topic: TopicId,
    xpReward: number
  ) => void;
}

export const BugHunterLab: React.FC<BugHunterLabProps> = ({
  completedBugHunts,
  onCompleteBugHunt,
}) => {
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Advanced'>(
    'All'
  );
  const filtered = BUG_HUNT_CHALLENGES.filter((b) =>
    difficultyFilter === 'All' ? true : b.difficulty === difficultyFilter
  );

  const [activeId, setActiveId] = useState<string>(BUG_HUNT_CHALLENGES[0].id);
  const activeBug: BugChallengeDef =
    filtered.find((b) => b.id === activeId) || filtered[0] || BUG_HUNT_CHALLENGES[0];

  const [codeMap, setCodeMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    BUG_HUNT_CHALLENGES.forEach((b) => {
      map[b.id] = b.buggyCode;
    });
    return map;
  });

  const [hintLevel, setHintLevel] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [resultFeedback, setResultFeedback] = useState<{
    passed: boolean;
    message: string;
    output: string;
  } | null>(null);

  const currentCode = codeMap[activeBug.id] ?? activeBug.buggyCode;

  const selectBug = (id: string) => {
    setActiveId(id);
    setHintLevel(0);
    setShowSolution(false);
    setResultFeedback(null);
  };

  const handleRunAndVerify = () => {
    const res = runPythonCode(currentCode, activeBug.stdinLines ?? []);
    if (!res.success) {
      setResultFeedback({
        passed: false,
        message: `${res.error?.type || 'Error'} on Line ${res.error?.line || 1}: ${
          res.error?.message || 'Check syntax.'
        } ${res.error?.hint || ''}`,
        output: res.output,
      });
      return;
    }

    const check = activeBug.verify(res.output, currentCode);
    setResultFeedback({
      passed: check.passed,
      message: check.message,
      output: res.output,
    });

    if (check.passed) {
      onCompleteBugHunt(activeBug.id, activeBug.title, activeBug.topic, activeBug.xpReward);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Difficulty Filter */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-5 shadow-xs md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-300">
            <Bug className="h-4 w-4" aria-hidden="true" />
            Dedicated Debugging Workspace
          </div>
          <h2 className="mt-1 font-display text-2xl font-extrabold text-[#100303] dark:text-[#f0eaea]">
            Bug Hunter Lab
          </h2>
          <p className="mt-1 text-xs text-[#8A8585] dark:text-[#9a8585]">
            Inspect broken Python snippets, repair syntax or logic errors, and verify exact console output.
          </p>
        </div>

        <div className="inline-flex flex-wrap gap-1 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-1">
          {(['All', 'Easy', 'Medium', 'Advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => {
                setDifficultyFilter(lvl);
                const nextList = BUG_HUNT_CHALLENGES.filter((b) =>
                  lvl === 'All' ? true : b.difficulty === lvl
                );
                if (nextList[0]) selectBug(nextList[0].id);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                difficultyFilter === lvl
                  ? 'bg-[#E10906] text-white shadow-xs'
                  : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Bug List */}
        <div className="space-y-2.5 lg:col-span-4">
          {filtered.map((bug) => {
            const active = bug.id === activeBug.id;
            const solved = completedBugHunts.includes(bug.id);
            return (
              <button
                key={bug.id}
                type="button"
                onClick={() => selectBug(bug.id)}
                className={`flex w-full items-start justify-between gap-3 rounded-xl border p-4 text-left transition-all ${
                  active
                    ? 'border-[#E10906] bg-[#FFF1F1] dark:bg-[#2a0808] shadow-sm'
                    : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] hover:border-[#E5DFDF]'
                }`}
              >
                <div>
                  <p className="font-mono text-[11px] font-semibold text-[#8A8585] dark:text-[#9a8585]">
                    {bug.difficulty} · {bug.category}
                  </p>
                  <h3 className="mt-1 font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">
                    {bug.title}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] text-[#E10906]">+{bug.xpReward} XP</p>
                </div>
                {solved && (
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="Fixed" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Bug Editor & Hints */}
        <div className="space-y-5 lg:col-span-8">
          <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-mono text-xs font-semibold text-[#E10906]">
                  {activeBug.difficulty} · {activeBug.category}
                </p>
                <h3 className="mt-0.5 font-display text-2xl font-bold text-[#100303] dark:text-[#f0eaea]">
                  {activeBug.title}
                </h3>
              </div>
              {completedBugHunts.includes(activeBug.id) && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Bug Squashed (+{activeBug.xpReward} XP)
                </span>
              )}
            </div>

            <p className="text-sm text-[#8A8585] dark:text-[#9a8585]">{activeBug.description}</p>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="overflow-hidden rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#100303] lg:col-span-8">
                <div className="flex items-center justify-between border-b border-[#2C1616] bg-[#190909] px-4 py-2 text-xs text-[#CFC8C8]">
                  <span className="font-mono">buggy_script.py</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setHintLevel((h) => Math.min(4, h + 1))}
                      className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200"
                    >
                      <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                      {hintLevel === 0
                        ? 'Reveal Hint (1/4)'
                        : hintLevel < 4
                        ? `Next Hint (${hintLevel}/4)`
                        : 'All Hints Shown'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSolution((s) => !s)}
                      className="inline-flex items-center gap-1 text-[#CFC8C8] hover:text-white"
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      {showSolution ? 'Hide Fix' : 'Solution'}
                    </button>
                  </div>
                </div>
                <textarea
                  aria-label="Bug Hunter Python editor"
                  value={currentCode}
                  onChange={(e) =>
                    setCodeMap((prev) => ({ ...prev, [activeBug.id]: e.target.value }))
                  }
                  spellCheck={false}
                  rows={7}
                  className="w-full resize-y bg-transparent p-4 font-mono text-sm leading-6 text-[#FBF5F9] focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#100303] p-4 lg:col-span-4">
                <p className="text-xs font-semibold text-[#CFC8C8]">Expected Output</p>
                <pre className="mt-2 whitespace-pre-wrap font-mono text-xs text-emerald-300">
                  {activeBug.expectedOutput}
                </pre>
              </div>
            </div>

            {hintLevel > 0 && (
              <div className="space-y-1.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 p-4 text-xs text-amber-950 dark:text-amber-100">
                {activeBug.hints.slice(0, hintLevel).map((h, i) => (
                  <p key={i}>
                    <strong>Hint {i + 1}:</strong> {h}
                  </p>
                ))}
              </div>
            )}

            {showSolution && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#8A8585] dark:text-[#9a8585]">Working Fix:</p>
                <CodeBlock code={activeBug.solutionCode} title="fixed_script.py" compact />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRunAndVerify}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#E10906] px-5 py-2 text-xs font-semibold text-white shadow-sm"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                Test &amp; Verify Fix
              </button>
              <button
                type="button"
                onClick={() => {
                  setCodeMap((prev) => ({
                    ...prev,
                    [activeBug.id]: activeBug.buggyCode,
                  }));
                  setResultFeedback(null);
                }}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-4 py-2 text-xs font-semibold text-[#8A8585] dark:text-[#9a8585]"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset Buggy Code
              </button>
            </div>

            {resultFeedback && (
              <div
                className={`rounded-xl border p-4 text-xs sm:text-sm ${
                  resultFeedback.passed
                    ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                    : 'border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {resultFeedback.passed ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      Bug Fixed!
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                      Still Broken
                    </>
                  )}
                </div>
                <p className="mt-1 text-[#100303] dark:text-[#f0eaea]">{resultFeedback.message}</p>
                {resultFeedback.output && (
                  <pre className="mt-2.5 rounded-xl bg-[#100303] p-3 font-mono text-xs text-emerald-300">
                    Your Output:{'\n'}
                    {resultFeedback.output}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
