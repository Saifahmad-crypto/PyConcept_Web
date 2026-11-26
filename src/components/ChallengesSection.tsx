import React, { useState } from 'react';
import {
  CheckCircle2,
  Play,
  RotateCcw,
  Lightbulb,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { CODING_CHALLENGES } from '../data/curriculumData';
import { TopicId } from '../types';
import { runPythonCode } from '../utils/pythonEngine';
import { CodeBlock } from './CodeBlock';

interface ChallengesSectionProps {
  completedChallenges: string[];
  onCompleteChallenge: (id: string) => void;
}

type ChallengeTopic = Exclude<TopicId, 'basics'>;

export const ChallengesSection: React.FC<ChallengesSectionProps> = ({
  completedChallenges,
  onCompleteChallenge,
}) => {
  const [topicFilter, setTopicFilter] = useState<ChallengeTopic>('conditionals');
  const filteredChallenges = CODING_CHALLENGES.filter((c) => c.topic === topicFilter);
  const [activeId, setActiveId] = useState<string>(CODING_CHALLENGES[0].id);
  const activeChallenge =
    CODING_CHALLENGES.find((c) => c.id === activeId) || filteredChallenges[0];

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold text-violet-700">PyVerse Practice Challenges</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-[#1E293B] sm:text-4xl">
            Beginner Coding Challenges
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Write real Python solutions for 10 structured problems (5 Conditional Statements, 5 Loops)
            and verify your output instantly.
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-slate-200 bg-[#F8FAFC] p-1 gap-1">
          <button
            type="button"
            onClick={() => handleTopicSwitch('conditionals')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
              topicFilter === 'conditionals'
                ? 'bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#1E293B]'
            }`}
          >
            Topic 08 · Conditionals (5)
          </button>
          <button
            type="button"
            onClick={() => handleTopicSwitch('loops')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
              topicFilter === 'loops'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#1E293B]'
            }`}
          >
            Topic 09 · Loops (5)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Challenge List */}
        <div className="space-y-2.5 lg:col-span-4">
          {filteredChallenges.map((ch, idx) => {
            const isSelected = ch.id === activeChallenge.id;
            const isSolved = completedChallenges.includes(ch.id);
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => selectChallenge(ch.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-sky-400 bg-gradient-to-r from-[#0EA5E9]/10 to-[#8B5CF6]/10 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  <span className="font-mono text-[11px] font-medium text-slate-500">
                    Challenge 0{idx + 1} · {ch.difficulty}
                  </span>
                  <h3 className="mt-0.5 font-display text-sm font-semibold text-[#1E293B]">
                    {ch.title}
                  </h3>
                </div>
                {isSolved && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-label="Solved" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Challenge Workspace */}
        <div className="space-y-5 lg:col-span-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-mono text-xs font-semibold text-sky-700">
                  {activeChallenge.topic === 'conditionals' ? 'Topic 08' : 'Topic 09'} ·{' '}
                  {activeChallenge.difficulty}
                </span>
                <h2 className="mt-0.5 font-display text-2xl font-bold text-[#1E293B]">
                  {activeChallenge.title}
                </h2>
              </div>
              {completedChallenges.includes(activeChallenge.id) && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Completed
                </span>
              )}
            </div>

            <p className="text-sm leading-relaxed text-slate-600">{activeChallenge.description}</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
                <p className="text-xs font-semibold text-[#1E293B]">Requirements</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-600">
                  {activeChallenge.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200/90 bg-[#0F172A] p-4">
                <p className="text-xs font-semibold text-slate-300">Expected Sample Output</p>
                <pre className="mt-2 whitespace-pre-wrap font-mono text-xs text-emerald-300">
                  {activeChallenge.sampleOutput}
                </pre>
              </div>
            </div>

            {/* Editor */}
            <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-[#0F172A] shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 bg-[#1E293B] px-4 py-2 text-xs text-slate-300">
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
                    className="inline-flex items-center gap-1 text-slate-200 hover:text-white"
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
                rows={8}
                className="w-full resize-y bg-transparent p-4 font-mono text-sm leading-6 text-slate-100 focus:outline-none"
              />
            </div>

            {showHint && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
                <strong>Hint:</strong> {activeChallenge.hint}
              </div>
            )}

            {showSolution && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-600">Reference Solution:</p>
                <CodeBlock code={activeChallenge.solutionCode} title="reference_solution.py" compact />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleVerify}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                Run &amp; Verify
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
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#1E293B]"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset Code
              </button>
            </div>

            {feedback && (
              <div
                className={`rounded-xl border p-4 text-xs sm:text-sm ${
                  feedback.passed
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-rose-200 bg-rose-50 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {feedback.passed ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                      Challenge Passed!
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-rose-600" aria-hidden="true" />
                      Keep Trying
                    </>
                  )}
                </div>
                <p className="mt-1.5 text-slate-700">{feedback.message}</p>
                {feedback.output && (
                  <pre className="mt-2.5 rounded-xl bg-[#0F172A] p-3 font-mono text-xs text-emerald-300">
                    Your Output:{'\n'}
                    {feedback.output}
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
