import React, { useState } from 'react';
import {
  Gamepad2,
  CheckCircle2,
  XCircle,
  Lightbulb,
  RotateCcw,
  ArrowRight,
  Trophy,
} from 'lucide-react';
import { GameScoreRecord, TopicId } from '../types';
import { CodeBlock } from './CodeBlock';

interface MiniGamesProps {
  gameScores: Record<string, GameScoreRecord>;
  onRecordGameScore: (gameId: string, score: number, maxScore: number) => void;
}

interface GameQuestion {
  prompt: string;
  code?: string;
  options?: string[];
  correctOption?: number;
  // For Number Sequence Challenge fill-in-the-blank
  sequenceDisplay?: Array<number | null>;
  missingAnswer?: number;
  hint: string;
  explanation: string;
}

interface GameDef {
  id: string;
  topic: TopicId;
  title: string;
  description: string;
  questions: GameQuestion[];
}

const GAMES: GameDef[] = [
  // CONDITIONAL GAMES (4)
  {
    id: 'cond-detective',
    topic: 'conditionals',
    title: 'Condition Detective',
    description: 'Given the variable values, spot which Python condition evaluates to True.',
    questions: [
      {
        prompt: 'Variables: score = 72, limit = 75. Which condition is True?',
        options: [
          'score >= limit',
          'score == 75',
          'score < limit and score > 50',
          'not (score < 80)',
        ],
        correctOption: 2,
        hint: 'Check both sides of "and": is 72 < 75 AND 72 > 50?',
        explanation: '72 < 75 is True and 72 > 50 is True, so "score < limit and score > 50" evaluates to True.',
      },
      {
        prompt: 'Variables: age = 15, has_pass = True. Which condition is True?',
        options: [
          'age >= 18 and has_pass',
          'age == 16 or not has_pass',
          'age < 18 and has_pass',
          'age != 15',
        ],
        correctOption: 2,
        hint: 'age is 15 (which is < 18) and has_pass is True.',
        explanation: 'Both 15 < 18 and has_pass (True) are True, making the "and" expression True.',
      },
      {
        prompt: 'Variables: num = 0. Which condition evaluates to True?',
        options: [
          'num > 0',
          'num < 0',
          'num == 0 or num > 10',
          'num != 0',
        ],
        correctOption: 2,
        hint: 'With "or", only one side needs to be True.',
        explanation: 'num == 0 is True (0 == 0), so the entire "or" condition is True.',
      },
    ],
  },
  {
    id: 'cond-guess-output',
    topic: 'conditionals',
    title: 'Guess the Output',
    description: 'Trace the if-elif-else snippet carefully and predict the exact output.',
    questions: [
      {
        prompt: 'What does this code print?',
        code: 'temp = 28\nif temp > 30:\n    print("Hot")\nelif temp >= 20:\n    print("Warm")\nelse:\n    print("Cold")',
        options: ['Hot', 'Warm', 'Cold', 'Warm and Cold'],
        correctOption: 1,
        hint: '28 > 30 is False, so check the elif condition next.',
        explanation: '28 >= 20 is True, so Python prints "Warm" and skips else.',
      },
      {
        prompt: 'What does this code print?',
        code: 'x = 12\nif x % 2 == 0:\n    if x > 15:\n        print("Big Even")\n    else:\n        print("Small Even")\nelse:\n    print("Odd")',
        options: ['Big Even', 'Small Even', 'Odd', 'Nothing'],
        correctOption: 1,
        hint: '12 % 2 == 0 is True, so Python enters the outer if and checks x > 15.',
        explanation: '12 is even, and 12 > 15 is False, so the inner else prints "Small Even".',
      },
      {
        prompt: 'What does this code print?',
        code: 'marks = 40\nif marks > 40:\n    print("Pass")\nelse:\n    print("Try Again")',
        options: ['Pass', 'Try Again', '40', 'Error'],
        correctOption: 1,
        hint: 'Notice the operator is > (strictly greater than), not >=.',
        explanation: '40 > 40 is False! Therefore the else branch runs and prints "Try Again".',
      },
    ],
  },
  {
    id: 'cond-decision-master',
    topic: 'conditionals',
    title: 'Decision Master',
    description: 'Choose the right Python condition to solve real-world decision rules.',
    questions: [
      {
        prompt: 'A theme park ride allows guests who are at least 12 years old AND at least 140 cm tall. Which if line is correct?',
        options: [
          'if age >= 12 or height >= 140:',
          'if age > 12 and height > 140:',
          'if age >= 12 and height >= 140:',
          'if age == 12 and height == 140:',
        ],
        correctOption: 2,
        hint: '"At least" includes the boundary value (>=), and both rules must hold (and).',
        explanation: 'age >= 12 and height >= 140 ensures both minimum thresholds are met inclusively.',
      },
      {
        prompt: 'Free shipping applies if cart_total is $50 or more, OR if user_vip is True. Which if line fits?',
        options: [
          'if cart_total >= 50 and user_vip:',
          'if cart_total >= 50 or user_vip:',
          'if cart_total > 50 or not user_vip:',
          'if cart_total = 50 or user_vip:',
        ],
        correctOption: 1,
        hint: 'Only one of the two conditions is required ("OR").',
        explanation: 'Using "or" grants free shipping whenever either cart_total >= 50 or user_vip is True.',
      },
      {
        prompt: 'A sensor triggers an alarm when temperature is below 0 OR above 100. Which condition is right?',
        options: [
          'if temp < 0 and temp > 100:',
          'if temp <= 0 and temp >= 100:',
          'if temp < 0 or temp > 100:',
          'if temp != 0:',
        ],
        correctOption: 2,
        hint: 'A single number cannot be both < 0 and > 100 at the same time!',
        explanation: 'Use "or" because temperature outside the safe range is either below 0 or above 100.',
      },
    ],
  },
  {
    id: 'cond-bug-hunter',
    topic: 'conditionals',
    title: 'Bug Hunter',
    description: 'Spot the hidden bug in conditional code and pick the exact fix.',
    questions: [
      {
        prompt: 'Why does this code fail with a SyntaxError?',
        code: 'pin = 1234\nif pin = 1234:\n    print("Unlocked")',
        options: [
          '1234 needs quotation marks',
          'Used assignment "=" instead of comparison "=="',
          'Missing else branch',
          'print should not be indented',
        ],
        correctOption: 1,
        hint: 'Look closely at the operator inside `if pin = 1234:`.',
        explanation: 'Conditions must use == to compare equality. Single = is only for assigning variables.',
      },
      {
        prompt: 'What is the logic bug in this grade checker when marks = 95?',
        code: 'marks = 95\nif marks >= 40:\n    print("Pass")\nelif marks >= 90:\n    print("Grade A")',
        options: [
          '95 is too high for elif',
          'Order is wrong: marks >= 40 matches first and hides Grade A',
          'Missing colon on line 4',
          'elif cannot be used with numbers',
        ],
        correctOption: 1,
        hint: 'Python runs only the FIRST matching condition from top to bottom.',
        explanation: '95 >= 40 is True, so it prints "Pass" and skips Grade A! Put `if marks >= 90:` first.',
      },
      {
        prompt: 'Why does Python raise an IndentationError here?',
        code: 'x = 5\nif x > 2:\nprint("Yes")',
        options: [
          'x > 2 needs parentheses',
          'print("Yes") must be indented 4 spaces under if',
          'if should be capitalized',
          'Missing semicolon after print',
        ],
        correctOption: 1,
        hint: 'Check the spaces before print("Yes").',
        explanation: 'Every line inside an if block must be indented consistently (4 spaces).',
      },
    ],
  },

  // LOOP GAMES (4)
  {
    id: 'loop-race',
    topic: 'loops',
    title: 'Loop Race',
    description: 'Calculate fast: how many iterations will each Python loop execute?',
    questions: [
      {
        prompt: 'How many iterations does this loop run?',
        code: 'for i in range(5):\n    print(i)',
        options: ['4 iterations', '5 iterations', '6 iterations', '1 iteration'],
        correctOption: 1,
        hint: 'range(5) generates 0, 1, 2, 3, 4.',
        explanation: 'Count them: 0, 1, 2, 3, 4 — that is 5 iterations!',
      },
      {
        prompt: 'How many iterations does this loop run?',
        code: 'for k in range(2, 10, 2):\n    print(k)',
        options: ['3 iterations', '4 iterations', '5 iterations', '8 iterations'],
        correctOption: 1,
        hint: 'List the values: 2, 4, 6, 8 (10 is excluded).',
        explanation: 'range(2, 10, 2) yields 2, 4, 6, 8 — exactly 4 iterations.',
      },
      {
        prompt: 'How many times does the while loop body run?',
        code: 'n = 10\nwhile n > 0:\n    n -= 4',
        options: ['2 times', '3 times', '4 times', 'Infinite'],
        correctOption: 1,
        hint: 'Trace n: 10 -> 6 -> 2 -> -2 (stops!).',
        explanation: 'Runs for n=10, n=6, and n=2 (3 times). Then n becomes -2 and -2 > 0 is False.',
      },
    ],
  },
  {
    id: 'loop-sequence',
    topic: 'loops',
    title: 'Number Sequence Challenge',
    description: 'Fill in the missing number produced by the Python range() loop.',
    questions: [
      {
        prompt: 'Code: for x in range(3, 15, 3): — What is the missing number?',
        sequenceDisplay: [3, 6, null, 12],
        missingAnswer: 9,
        hint: 'Each step adds 3 to the previous number.',
        explanation: 'Starting at 3 and adding 3 each iteration produces 3, 6, 9, 12.',
      },
      {
        prompt: 'Code: for x in range(20, 4, -4): — What is the missing number?',
        sequenceDisplay: [20, null, 12, 8],
        missingAnswer: 16,
        hint: 'The step is -4, so subtract 4 from 20.',
        explanation: '20 - 4 = 16. The full sequence is 20, 16, 12, 8.',
      },
      {
        prompt: 'Code: for x in range(1, 16, 4): — What is the missing number?',
        sequenceDisplay: [1, 5, 9, null],
        missingAnswer: 13,
        hint: 'Add step 4 to 9 (13 is still less than stop 16).',
        explanation: '9 + 4 = 13. Since 13 < 16, it is included in the sequence.',
      },
    ],
  },
  {
    id: 'loop-output',
    topic: 'loops',
    title: 'Output Predictor',
    description: 'Trace for, while, break, and continue to predict the final printed output.',
    questions: [
      {
        prompt: 'What is printed by this loop?',
        code: 'for i in range(1, 5):\n    if i == 2:\n        continue\n    print(i)',
        options: ['1 2 3 4', '1 3 4', '1', '2 3 4'],
        correctOption: 1,
        hint: 'continue skips print(i) only when i == 2.',
        explanation: 'i=1 prints, i=2 is skipped by continue, i=3 and i=4 print -> 1, 3, 4.',
      },
      {
        prompt: 'What is printed by this loop?',
        code: 'for i in range(1, 6):\n    if i == 4:\n        break\n    print(i)',
        options: ['1 2 3', '1 2 3 4', '1 2 3 5', '4'],
        correctOption: 0,
        hint: 'break exits the entire loop before print(4) is reached.',
        explanation: '1, 2, 3 print. When i becomes 4, break stops the loop immediately.',
      },
      {
        prompt: 'What does `total` print at the end?',
        code: 'total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)',
        options: ['3', '6', '10', '4'],
        correctOption: 1,
        hint: 'range(1, 4) produces 1, 2, 3.',
        explanation: '0 + 1 + 2 + 3 = 6.',
      },
    ],
  },
  {
    id: 'loop-debugger',
    topic: 'loops',
    title: 'Loop Debugger',
    description: 'Identify what is broken in these beginner loop programs.',
    questions: [
      {
        prompt: 'Why does this loop never stop (infinite loop)?',
        code: 'count = 1\nwhile count <= 5:\n    print(count)',
        options: [
          'count should start at 0',
          'Missing `count += 1` inside the loop body',
          'while should be for',
          '<= should be ==',
        ],
        correctOption: 1,
        hint: 'Look at what happens to `count` during each iteration.',
        explanation: 'count stays 1 forever because it is never incremented, keeping `count <= 5` True forever.',
      },
      {
        prompt: 'The goal is to print 5, 4, 3, 2, 1. Why does this print nothing?',
        code: 'for i in range(5, 0):\n    print(i)',
        options: [
          'range() cannot count down',
          'Missing negative step `-1`: use range(5, 0, -1)',
          '0 is invalid as stop',
          'print(i) is indented too far',
        ],
        correctOption: 1,
        hint: 'By default, range() steps by +1.',
        explanation: 'When start > stop, you must provide a negative step like range(5, 0, -1).',
      },
      {
        prompt: 'Why does this code print 1, 2, 3, 4 instead of 1, 2, 3, 4, 5?',
        code: 'for i in range(1, 5):\n    print(i)',
        options: [
          'Python starts counting at 0',
          'range(1, 5) excludes the stop value 5; use range(1, 6)',
          'for loops skip the last number randomly',
          'Missing break statement',
        ],
        correctOption: 1,
        hint: 'Remember the golden rule of range(start, stop).',
        explanation: 'The stop argument in range() is always excluded. Use range(1, 6) to include 5.',
      },
    ],
  },
];

export const MiniGames: React.FC<MiniGamesProps> = ({ gameScores, onRecordGameScore }) => {
  const [selectedGameId, setSelectedGameId] = useState<string>('cond-detective');
  const [qIdx, setQIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [sequenceInput, setSequenceInput] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);

  const game = GAMES.find((g) => g.id === selectedGameId)!;
  const question = game.questions[qIdx];

  const startGame = (id: string) => {
    setSelectedGameId(id);
    setQIdx(0);
    setSelectedOpt(null);
    setSequenceInput('');
    setSubmitted(false);
    setShowHint(false);
    setScore(0);
    setFinished(false);
  };

  const isSequenceQuestion = question.sequenceDisplay !== undefined;
  const isCorrect = submitted
    ? isSequenceQuestion
      ? Number(sequenceInput.trim()) === question.missingAnswer
      : selectedOpt === question.correctOption
    : false;

  const handleSubmit = () => {
    if (isSequenceQuestion) {
      if (sequenceInput.trim() === '') return;
    } else if (selectedOpt === null) {
      return;
    }
    const right = isSequenceQuestion
      ? Number(sequenceInput.trim()) === question.missingAnswer
      : selectedOpt === question.correctOption;

    setSubmitted(true);
    if (right) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (qIdx + 1 >= game.questions.length) {
      setFinished(true);
      onRecordGameScore(game.id, score, game.questions.length);
    } else {
      setQIdx((i) => i + 1);
      setSelectedOpt(null);
      setSequenceInput('');
      setSubmitted(false);
      setShowHint(false);
    }
  };

  const condGames = GAMES.filter((g) => g.topic === 'conditionals');
  const loopGames = GAMES.filter((g) => g.topic === 'loops');

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Game Selector */}
      <div className="space-y-5 lg:col-span-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-sky-700">
              Conditional Games (4)
            </p>
            <div className="space-y-1.5">
              {condGames.map((g) => {
                const rec = gameScores[g.id];
                const active = g.id === selectedGameId;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => startGame(g.id)}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-xs font-medium transition-all ${
                      active
                        ? 'border-sky-400 bg-gradient-to-r from-[#0EA5E9]/10 to-[#8B5CF6]/10 font-semibold text-[#1E293B] shadow-xs'
                        : 'border-slate-200 bg-[#F8FAFC] text-slate-600 hover:border-slate-300 hover:text-[#1E293B]'
                    }`}
                  >
                    <span className="truncate">{g.title}</span>
                    {rec?.completed && (
                      <span className="font-mono text-[11px] font-semibold text-emerald-700 tabular-nums shrink-0">
                        {rec.bestScore}/{rec.maxScore}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-700">
              Loops Games (4)
            </p>
            <div className="space-y-1.5">
              {loopGames.map((g) => {
                const rec = gameScores[g.id];
                const active = g.id === selectedGameId;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => startGame(g.id)}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-xs font-medium transition-all ${
                      active
                        ? 'border-violet-400 bg-gradient-to-r from-[#8B5CF6]/10 to-[#0EA5E9]/10 font-semibold text-[#1E293B] shadow-xs'
                        : 'border-slate-200 bg-[#F8FAFC] text-slate-600 hover:border-slate-300 hover:text-[#1E293B]'
                    }`}
                  >
                    <span className="truncate">{g.title}</span>
                    {rec?.completed && (
                      <span className="font-mono text-[11px] font-semibold text-emerald-700 tabular-nums shrink-0">
                        {rec.bestScore}/{rec.maxScore}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Active Game Stage */}
      <div className="lg:col-span-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Gamepad2 className="h-4 w-4 text-sky-600" aria-hidden="true" />
                <span>{game.topic === 'conditionals' ? 'Topic 08 · Conditionals' : 'Topic 09 · Loops'}</span>
              </div>
              <h3 className="mt-1 font-display text-xl font-bold text-[#1E293B]">{game.title}</h3>
              <p className="mt-0.5 text-xs text-slate-600">{game.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-sky-700 tabular-nums">
                Score: {score} / {game.questions.length}
              </span>
              <button
                type="button"
                onClick={() => startGame(game.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#1E293B]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restart
              </button>
            </div>
          </div>

          {finished ? (
            <div className="py-10 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200">
                <Trophy className="h-8 w-8 text-amber-500" aria-hidden="true" />
              </div>
              <h4 className="font-display text-2xl font-bold text-[#1E293B]">
                Level Complete!
              </h4>
              <p className="text-sm text-slate-600">
                You scored{' '}
                <strong className="font-mono text-emerald-700 tabular-nums">
                  {score} out of {game.questions.length}
                </strong>{' '}
                in {game.title}.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => startGame(game.id)}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <RotateCcw className="h-4 w-4" />
                  Play Again
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono font-semibold text-slate-700 tabular-nums">
                  Round {qIdx + 1} of {game.questions.length}
                </span>
                <button
                  type="button"
                  onClick={() => setShowHint((h) => !h)}
                  className="inline-flex items-center gap-1.5 font-medium text-amber-700 hover:text-amber-800"
                >
                  <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                  {showHint ? 'Hide Hint' : 'Need a Hint?'}
                </button>
              </div>

              {showHint && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
                  <strong>Hint:</strong> {question.hint}
                </div>
              )}

              <p className="text-base font-semibold text-[#1E293B]">{question.prompt}</p>

              {question.code && (
                <CodeBlock code={question.code} title="puzzle.py" showCopy={false} compact />
              )}

              {/* Sequence Fill-in-the-blank OR Multiple Choice */}
              {isSequenceQuestion && question.sequenceDisplay ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    {question.sequenceDisplay.map((val, idx) =>
                      val === null ? (
                        <input
                          key={idx}
                          type="number"
                          value={sequenceInput}
                          disabled={submitted}
                          onChange={(e) => setSequenceInput(e.target.value)}
                          placeholder="?"
                          aria-label="Missing sequence number"
                          className="h-12 w-20 rounded-xl border-2 border-sky-500 bg-[#F0F9FF] text-center font-mono text-lg font-bold text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-violet-400/50"
                        />
                      ) : (
                        <div
                          key={idx}
                          className="flex h-12 min-w-[54px] items-center justify-center rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 font-mono text-lg font-bold text-[#1E293B] tabular-nums"
                        >
                          {val}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {question.options?.map((opt, idx) => {
                    const isPicked = selectedOpt === idx;
                    const isAnswer = idx === question.correctOption;
                    let cls =
                      'border-slate-200 bg-[#F8FAFC] text-[#1E293B] hover:border-sky-300 hover:bg-[#F0F9FF]/60';
                    if (submitted) {
                      if (isAnswer) {
                        cls = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                      } else if (isPicked && !isAnswer) {
                        cls = 'border-rose-500 bg-rose-50 text-rose-900';
                      }
                    } else if (isPicked) {
                      cls =
                        'border-sky-500 bg-gradient-to-r from-[#0EA5E9]/12 to-[#8B5CF6]/12 text-[#1E293B] font-semibold ring-1 ring-sky-400/40';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={submitted}
                        onClick={() => setSelectedOpt(idx)}
                        className={`flex min-h-[44px] items-center gap-3 rounded-xl border px-4 py-2.5 text-left font-mono text-xs sm:text-sm transition-all ${cls}`}
                      >
                        <span className="font-bold text-slate-500">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {submitted && (
                <div
                  className={`rounded-xl border p-4 text-xs sm:text-sm ${
                    isCorrect
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-rose-200 bg-rose-50 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Correct!
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-rose-600" />
                        Not quite — {isSequenceQuestion ? `the missing value is ${question.missingAnswer}.` : 'review the explanation below.'}
                      </>
                    )}
                  </div>
                  <p className="mt-1.5 text-slate-700">{question.explanation}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                {!submitted ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                      isSequenceQuestion ? sequenceInput.trim() === '' : selectedOpt === null
                    }
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {qIdx + 1 >= game.questions.length ? 'Finish Game' : 'Next Round'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
