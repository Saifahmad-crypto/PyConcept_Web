import React, { useState } from 'react';
import {
  BookMarked,
  Layers,
  Zap,
  HelpCircle,
  GitBranch,
  Copy,
  Check,
  Terminal,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  QuizScoreRecord,
  RevisionTabId,
  TopicId,
} from '../../types';
import { FLASHCARDS_BANK, DAILY_QUEST_BANK } from '../../data/ecosystemData';
import { CodeBlock } from '../CodeBlock';
import { QuizSection } from '../QuizSection';
import { FlowchartSVG, FlowchartType } from '../FlowchartSVG';
import { ComparisonScaleSVG, LoopTimelineStepper } from '../LearnVisuals';

interface RevisionHubPageProps {
  activeTab: RevisionTabId;
  onChangeTab: (tab: RevisionTabId) => void;
  understoodFlashcards: string[];
  onToggleFlashcardUnderstood: (cardId: string) => void;
  quizScores: {
    conditionals: QuizScoreRecord | null;
    loops: QuizScoreRecord | null;
  };
  onRecordQuizResult: (topic: 'conditionals' | 'loops', score: number, total: number) => void;
  onOpenInStudio: (code: string) => void;
}

const REVISION_TABS: Array<{
  id: RevisionTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'cheat-sheets', label: 'Cheat Sheets', icon: BookMarked },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'arena', label: 'Revision Arena', icon: Zap },
  { id: 'quizzes', label: 'Topic Quizzes', icon: HelpCircle },
  { id: 'visual-notes', label: 'Visual Notes', icon: GitBranch },
];

const CHEAT_SHEETS: Array<{
  topic: TopicId;
  title: string;
  accent: string;
  items: Array<{ label: string; syntax: string; note: string }>;
}> = [
  {
    topic: 'basics',
    title: 'Topic 01 · Python Basics',
    accent: 'text-[#E10906]',
    items: [
      {
        label: 'Variables & Naming',
        syntax: 'player = "Maya"\nscore = 92\nis_ready = True',
        note: 'Use lowercase_with_underscores; never start names with numbers.',
      },
      {
        label: 'Data Types',
        syntax: '42        # int\n3.14      # float\n"PyVerse" # str\nFalse     # bool',
        note: 'Wrap strings inside matching quotes; capitalize True and False.',
      },
      {
        label: 'input() & f-strings',
        syntax: 'age = int(input("Age: "))\nprint(f"Next year: {age + 1}")',
        note: 'Wrap input() with int() before doing math.',
      },
    ],
  },
  {
    topic: 'conditionals',
    title: 'Topic 08 · Conditional Statements',
    accent: 'text-blue-700 dark:text-blue-300',
    items: [
      {
        label: 'if / elif / else',
        syntax: 'if marks >= 90:\n    print("A")\nelif marks >= 75:\n    print("B")\nelse:\n    print("Pass")',
        note: 'Conditions run top-to-bottom; only the first True branch runs.',
      },
      {
        label: 'Comparison & Logic',
        syntax: 'if age >= 18 and has_id:\n    print("Allowed")\nif temp < 0 or temp > 100:\n    print("Alert")',
        note: 'Always use == for equality comparison inside conditions.',
      },
    ],
  },
  {
    topic: 'loops',
    title: 'Topic 09 · Loops',
    accent: 'text-[#E10906]',
    items: [
      {
        label: 'for + range()',
        syntax: 'for i in range(1, 6):\n    print(i)  # 1, 2, 3, 4, 5',
        note: 'range(start, stop, step) always stops strictly BEFORE stop.',
      },
      {
        label: 'while + break / continue',
        syntax: 'n = 5\nwhile n > 0:\n    n -= 1\n    if n == 2: continue\n    if n == 0: break\n    print(n)',
        note: 'Update loop state every pass so while does not run infinitely.',
      },
    ],
  },
];

const FLOWCHART_OPTIONS: Array<{ id: FlowchartType; label: string }> = [
  { id: 'if', label: 'Simple if' },
  { id: 'if-else', label: 'if-else' },
  { id: 'if-elif-else', label: 'if-elif-else' },
  { id: 'nested-if', label: 'Nested if' },
  { id: 'for', label: 'for loop' },
  { id: 'while', label: 'while loop' },
  { id: 'break-continue', label: 'break / continue' },
  { id: 'nested-loop', label: 'Nested loops' },
];

export const RevisionHubPage: React.FC<RevisionHubPageProps> = ({
  activeTab,
  onChangeTab,
  understoodFlashcards,
  onToggleFlashcardUnderstood,
  quizScores,
  onRecordQuizResult,
  onOpenInStudio,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Flashcards state
  const [cardTopic, setCardTopic] = useState<'all' | TopicId>('all');
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Revision Arena state
  const [arenaIdx, setArenaIdx] = useState(0);
  const [arenaChoice, setArenaChoice] = useState<number | null>(null);
  const [arenaSubmitted, setArenaSubmitted] = useState(false);
  const [arenaScore, setArenaScore] = useState(0);

  // Visual Notes state
  const [flowType, setFlowType] = useState<FlowchartType>('if-elif-else');
  const [scaleLeft, setScaleLeft] = useState(18);
  const [scaleRight, setScaleRight] = useState(18);

  const visibleCards = FLASHCARDS_BANK.filter((c) =>
    cardTopic === 'all' ? true : c.topic === cardTopic
  );
  const currentCard = visibleCards[cardIdx % visibleCards.length] || FLASHCARDS_BANK[0];
  const cardUnderstood = understoodFlashcards.includes(currentCard.id);

  const currentArenaQ = DAILY_QUEST_BANK[arenaIdx % DAILY_QUEST_BANK.length];

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="border-b border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold text-[#E10906]">PyVerse Revision Hub</p>
              <h1 className="mt-1 font-display text-3xl font-extrabold text-[#100303] dark:text-[#f0eaea] sm:text-4xl">
                Quick Revision &amp; Recall Studio
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm text-[#8A8585] dark:text-[#9a8585]">
                Review syntax cheat sheets, flip active-recall flashcards, drill mixed questions in the Revision Arena, and explore visual diagrams.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-4 py-2 text-xs">
              <span className="text-[#8A8585] dark:text-[#9a8585]">Flashcards Mastered:</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                {understoodFlashcards.length} / {FLASHCARDS_BANK.length}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-1.5">
            {REVISION_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onChangeTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 font-display text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#E10906] text-white shadow-sm'
                      : 'text-[#8A8585] dark:text-[#9a8585] hover:bg-white dark:hover:bg-[#221010] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab 1: Cheat Sheets */}
      {activeTab === 'cheat-sheets' && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {CHEAT_SHEETS.map((sheet) => (
              <div
                key={sheet.topic}
                className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-5 shadow-sm space-y-4"
              >
                <h2 className={`font-display text-lg font-bold ${sheet.accent}`}>{sheet.title}</h2>
                <div className="space-y-4">
                  {sheet.items.map((item, idx) => {
                    const key = `${sheet.topic}-${idx}`;
                    return (
                      <div
                        key={key}
                        className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3.5 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display text-xs font-bold text-[#100303] dark:text-[#f0eaea]">
                            {item.label}
                          </h3>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => void handleCopy(key, item.syntax)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2 py-1 text-[11px] font-semibold text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]"
                            >
                              {copiedId === key ? (
                                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                              {copiedId === key ? 'Copied' : 'Copy'}
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenInStudio(item.syntax)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFF1F1] dark:bg-[#2a0808] px-2 py-1 text-[11px] font-semibold text-[#E10906] hover:bg-[#FFF1F1] dark:hover:bg-[#2a0808] dark:bg-[#2a0808]"
                            >
                              <Terminal className="h-3 w-3" />
                              Studio
                            </button>
                          </div>
                        </div>
                        <pre className="overflow-x-auto rounded-lg bg-[#100303] p-3 font-mono text-xs leading-relaxed text-sky-200">
                          {item.syntax}
                        </pre>
                        <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">{item.note}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex flex-wrap gap-1 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-1">
              {(
                [
                  { id: 'all', label: 'All Topics' },
                  { id: 'basics', label: 'Basics' },
                  { id: 'conditionals', label: 'Conditionals' },
                  { id: 'loops', label: 'Loops' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setCardTopic(f.id);
                    setCardIdx(0);
                    setFlipped(false);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    cardTopic === f.id
                      ? 'bg-[#E10906] text-white'
                      : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className="font-mono text-xs font-semibold text-[#8A8585] dark:text-[#9a8585] tabular-nums">
              Card {(cardIdx % visibleCards.length) + 1} of {visibleCards.length}
            </span>
          </div>

          <div
            onClick={() => setFlipped((f) => !f)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setFlipped((f) => !f);
              }
            }}
            className="cursor-pointer rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-gradient-to-br from-white via-[#F0F9FF]/50 to-[#F5F3FF]/50 p-7 shadow-sm transition-all hover:border-[#E10906] hover:shadow-md min-h-[290px] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-mono font-semibold text-[#E10906] uppercase">
                {currentCard.topic} · {flipped ? 'Answer & Example' : 'Question Prompt'}
              </span>
              <span className="inline-flex items-center gap-1 text-[#8A8585] dark:text-[#9a8585]">
                <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                Click card to flip
              </span>
            </div>

            {!flipped ? (
              <div className="my-6 text-center space-y-3">
                <h2 className="font-display text-2xl font-bold text-[#100303] dark:text-[#f0eaea]">
                  {currentCard.front}
                </h2>
                {currentCard.codeHint && (
                  <code className="inline-block rounded-xl bg-[#100303] px-4 py-2 font-mono text-sm text-[#E10906]">
                    {currentCard.codeHint}
                  </code>
                )}
              </div>
            ) : (
              <div className="my-4 space-y-4">
                <p className="text-base font-semibold leading-relaxed text-[#100303] dark:text-[#f0eaea]">
                  {currentCard.back}
                </p>
                <CodeBlock code={currentCard.example} title="example.py" compact showCopy={false} />
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-[#8A8585] dark:text-[#9a8585]">
              <span>{cardUnderstood ? 'Marked understood' : 'Still reviewing'}</span>
              <span className="font-mono">{currentCard.id}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCardIdx((i) => (i - 1 + visibleCards.length) % visibleCards.length);
                  setFlipped(false);
                }}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-4 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] hover:bg-[#FBF5F9] dark:hover:bg-[#221010] dark:bg-[#0f0303]"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Previous
              </button>
              <button
                type="button"
                onClick={() => {
                  setCardIdx((i) => (i + 1) % visibleCards.length);
                  setFlipped(false);
                }}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-4 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] hover:bg-[#FBF5F9] dark:hover:bg-[#221010] dark:bg-[#0f0303]"
              >
                Next Card
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onToggleFlashcardUnderstood(currentCard.id)}
              className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                cardUnderstood
                  ? 'border border-emerald-300 dark:border-emerald-700/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                  : 'bg-[#E10906] text-white shadow-sm'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {cardUnderstood ? 'Understood (Click to Unmark)' : 'Mark Understood'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Revision Arena (Mixed Rapid Drill) */}
      {activeTab === 'arena' && (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-[#E10906]">Mixed-Topic Rapid Drill</p>
                <h2 className="font-display text-2xl font-bold text-[#100303] dark:text-[#f0eaea]">
                  {currentArenaQ.title}
                </h2>
              </div>
              <div className="font-mono text-xs font-semibold text-[#E10906] tabular-nums">
                Round {(arenaIdx % DAILY_QUEST_BANK.length) + 1}/{DAILY_QUEST_BANK.length} · Score:{' '}
                {arenaScore}
              </div>
            </div>

            <p className="text-sm text-[#8A8585] dark:text-[#9a8585]">{currentArenaQ.instructions}</p>

            <CodeBlock code={currentArenaQ.code} title="revision_arena.py" compact showCopy={false} />

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {currentArenaQ.options.map((opt, idx) => {
                const selected = arenaChoice === idx;
                const correct = idx === currentArenaQ.correctIndex;
                let style =
                  'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906]';
                if (arenaSubmitted) {
                  if (correct) style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                  else if (selected) style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                } else if (selected) {
                  style = 'border-[#E10906] bg-[#EFF6FF] dark:bg-sky-950/40 font-semibold ring-1 ring-[#38BDF8]';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={arenaSubmitted}
                    onClick={() => setArenaChoice(idx)}
                    className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-left font-mono text-xs transition-all ${style}`}
                  >
                    <span className="font-bold text-[#8A8585] dark:text-[#9a8585]">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {arenaSubmitted && (
              <div
                className={`rounded-xl border p-4 text-xs sm:text-sm ${
                  arenaChoice === currentArenaQ.correctIndex
                    ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                    : 'border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {arenaChoice === currentArenaQ.correctIndex ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Spot on!
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                      Correct answer: {currentArenaQ.options[currentArenaQ.correctIndex]}
                    </>
                  )}
                </div>
                <p className="mt-1 text-[#100303] dark:text-[#f0eaea]">{currentArenaQ.explanation}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E5DFDF] dark:border-[#3a1a1a] pt-4">
              {!arenaSubmitted ? (
                <button
                  type="button"
                  disabled={arenaChoice === null}
                  onClick={() => {
                    setArenaSubmitted(true);
                    if (arenaChoice === currentArenaQ.correctIndex) {
                      setArenaScore((s) => s + 1);
                    }
                  }}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#E10906] px-5 py-2 text-xs font-semibold text-white shadow-sm disabled:opacity-40"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setArenaIdx((i) => (i + 1) % DAILY_QUEST_BANK.length);
                    setArenaChoice(null);
                    setArenaSubmitted(false);
                  }}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#E10906] px-5 py-2 text-xs font-semibold text-white shadow-sm"
                >
                  Next Mixed Question
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setArenaIdx(0);
                  setArenaChoice(null);
                  setArenaSubmitted(false);
                  setArenaScore(0);
                }}
                className="text-xs font-medium text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]"
              >
                Reset Drill Score
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Topic Quizzes */}
      {activeTab === 'quizzes' && (
        <QuizSection quizScores={quizScores} onRecordQuizResult={onRecordQuizResult} />
      )}

      {/* Tab 5: Visual Notes */}
      {activeTab === 'visual-notes' && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm space-y-4 lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-lg font-bold text-[#100303] dark:text-[#f0eaea]">
                  Execution Flowchart Reference
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {FLOWCHART_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFlowType(opt.id)}
                      className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        flowType === opt.id
                          ? 'border-[#E10906] bg-[#EFF6FF] dark:bg-sky-950/40 text-[#E10906]'
                          : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] text-[#8A8585] dark:text-[#9a8585]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <FlowchartSVG type={flowType} />
            </div>

            <div className="space-y-5 lg:col-span-5">
              <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-5 shadow-sm space-y-4">
                <h3 className="font-display text-base font-bold text-[#100303] dark:text-[#f0eaea]">
                  Interactive Comparison Scale
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <label className="space-y-1">
                    <span className="font-mono font-semibold text-[#E10906]">a = {scaleLeft}</span>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={scaleLeft}
                      onChange={(e) => setScaleLeft(Number(e.target.value))}
                      className="w-full accent-[#E10906]"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="font-mono font-semibold text-[#E10906]">b = {scaleRight}</span>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={scaleRight}
                      onChange={(e) => setScaleRight(Number(e.target.value))}
                      className="w-full accent-[#8B5CF6]"
                    />
                  </label>
                </div>
                <ComparisonScaleSVG leftVal={scaleLeft} rightVal={scaleRight} />
              </div>
            </div>
          </div>

          <LoopTimelineStepper />
        </div>
      )}
    </div>
  );
};
