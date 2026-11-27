import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  GitBranch,
  Repeat,
  Share2,
  Terminal,
  Shuffle,
  Timer,
  SlidersHorizontal,
  Flame,
  AlertTriangle,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/curriculumData';
import { QuizScoreRecord, TopicId, QuizDifficulty } from '../types';
import { CodeBlock } from './CodeBlock';
import { ScoreCardModal, ScoreCardData } from './ScoreCardModal';

export type QuizTopic = TopicId | 'mixed';

interface QuizSectionProps {
  quizScores: {
    basics?: QuizScoreRecord | null;
    conditionals: QuizScoreRecord | null;
    loops: QuizScoreRecord | null;
  };
  onRecordQuizResult: (topic: 'basics' | 'conditionals' | 'loops', score: number, total: number) => void;
}

const QUESTION_TIME_LIMIT = 30; // 30 seconds per question for Timed Mode

export const QuizSection: React.FC<QuizSectionProps> = ({
  quizScores,
  onRecordQuizResult,
}) => {
  const [topic, setTopic] = useState<QuizTopic>('conditionals');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | QuizDifficulty>('All');
  const [isTimedMode, setIsTimedMode] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIME_LIMIT);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [answersLog, setAnswersLog] = useState<
    Array<{ questionId: string; chosen: number | null; correct: number }>
  >([]);
  const [finished, setFinished] = useState<boolean>(false);
  const [scoreCardData, setScoreCardData] = useState<ScoreCardData | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong'>('all');

  // Filter questions based on topic and difficulty
  const questions = useMemo(() => {
    let pool = QUIZ_QUESTIONS;
    if (topic === 'mixed') {
      // Deterministic pseudo-random sample of 10 mixed questions
      pool = [...QUIZ_QUESTIONS].sort((a, b) => (a.id > b.id ? 1 : -1));
      // Pick 10 well-distributed questions across topics
      const basicsSample = pool.filter((q) => q.topic === 'basics').slice(0, 3);
      const condSample = pool.filter((q) => q.topic === 'conditionals').slice(0, 4);
      const loopSample = pool.filter((q) => q.topic === 'loops').slice(0, 3);
      pool = [...basicsSample, ...condSample, ...loopSample];
    } else {
      pool = pool.filter((q) => q.topic === topic);
    }

    if (difficultyFilter !== 'All') {
      pool = pool.filter((q) => q.difficulty === difficultyFilter);
    }

    return pool.length > 0 ? pool : QUIZ_QUESTIONS.filter((q) => q.topic === (topic === 'mixed' ? 'conditionals' : topic));
  }, [topic, difficultyFilter]);

  const currentQ = questions[currentIdx] || questions[0];

  const resetQuiz = (nextTopic: QuizTopic = topic, nextDiff = difficultyFilter) => {
    setTopic(nextTopic);
    setDifficultyFilter(nextDiff);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setSubmitted(false);
    setScore(0);
    setAnswersLog([]);
    setFinished(false);
    setTimeLeft(QUESTION_TIME_LIMIT);
    setReviewFilter('all');
  };

  // Timer countdown for Timed Mode
  useEffect(() => {
    if (!isTimedMode || submitted || finished) return;

    if (timeLeft <= 0) {
      // Time expired: auto-submit with incorrect/timeout
      setSubmitted(true);
      setAnswersLog((prev) => [
        ...prev,
        {
          questionId: currentQ.id,
          chosen: selectedOpt,
          correct: currentQ.correctIndex,
        },
      ]);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimedMode, timeLeft, submitted, finished, currentQ, selectedOpt]);

  const handleSubmitAnswer = () => {
    if (selectedOpt === null) return;
    const isRight = selectedOpt === currentQ.correctIndex;
    const nextScore = isRight ? score + 1 : score;
    setSubmitted(true);
    setScore(nextScore);
    setAnswersLog((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        chosen: selectedOpt,
        correct: currentQ.correctIndex,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setFinished(true);
      if (topic !== 'mixed') {
        onRecordQuizResult(topic, score, questions.length);
      }
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedOpt(null);
      setSubmitted(false);
      setTimeLeft(QUESTION_TIME_LIMIT);
    }
  };

  const bestRecord = topic !== 'mixed' ? quizScores[topic] : null;
  const wrongCount = answersLog.filter((a) => a.chosen !== a.correct).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#E5DFDF] dark:border-[#3a1a1a] pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#E10906]">PyVerse Engineering Assessment</span>
            <span className="rounded-full bg-[#E10906]/10 px-2 py-0.5 text-[10px] font-mono font-bold text-[#E10906]">
              {QUIZ_QUESTIONS.length} Questions Pool
            </span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-[#100303] dark:text-[#f0eaea] sm:text-4xl">
            Topic &amp; GATE-Style Quizzes
          </h1>
          <p className="mt-2 text-sm text-[#8A8585] dark:text-[#9a8585]">
            Engineering 1st-year lab and semester exam questions: operator precedence, negative modulo, short-circuit &amp; loop logic.
          </p>
        </div>

        {/* Topic Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-1">
          <button
            type="button"
            onClick={() => resetQuiz('basics')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
              topic === 'basics'
                ? 'bg-[#E10906] text-white shadow-sm'
                : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
            01. Basics ({QUIZ_QUESTIONS.filter((q) => q.topic === 'basics').length})
          </button>
          <button
            type="button"
            onClick={() => resetQuiz('conditionals')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
              topic === 'conditionals'
                ? 'bg-[#E10906] text-white shadow-sm'
                : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
            }`}
          >
            <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
            08. Conditionals ({QUIZ_QUESTIONS.filter((q) => q.topic === 'conditionals').length})
          </button>
          <button
            type="button"
            onClick={() => resetQuiz('loops')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
              topic === 'loops'
                ? 'bg-[#E10906] text-white shadow-sm'
                : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
            }`}
          >
            <Repeat className="h-3.5 w-3.5" aria-hidden="true" />
            09. Loops ({QUIZ_QUESTIONS.filter((q) => q.topic === 'loops').length})
          </button>
          <button
            type="button"
            onClick={() => resetQuiz('mixed')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
              topic === 'mixed'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
            }`}
          >
            <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
            Mixed Sprint (10)
          </button>
        </div>
      </div>

      {/* Control Bar: Difficulty Filter & Timed Mode Toggle */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-[#E10906]" aria-hidden="true" />
          <span className="font-semibold text-[#100303] dark:text-[#f0eaea]">Difficulty:</span>
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
            <button
              key={diff}
              type="button"
              disabled={finished}
              onClick={() => resetQuiz(topic, diff)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                difficultyFilter === diff
                  ? 'bg-[#100303] text-white dark:bg-white dark:text-[#100303]'
                  : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsTimedMode(!isTimedMode);
              setTimeLeft(QUESTION_TIME_LIMIT);
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 font-semibold transition-all ${
              isTimedMode
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400'
                : 'border-[#E5DFDF] dark:border-[#3a1a1a] text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
            }`}
          >
            <Timer className="h-3.5 w-3.5" aria-hidden="true" />
            Timed Mode (30s) {isTimedMode ? '• ON' : '• OFF'}
          </button>
        </div>
      </div>

      {finished ? (
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40">
              <Award className="h-8 w-8 text-amber-500" aria-hidden="true" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#100303] dark:text-[#f0eaea] sm:text-3xl">
              {topic === 'basics'
                ? 'Topic 01: Python Basics Complete'
                : topic === 'conditionals'
                ? 'Topic 08: Conditionals Complete'
                : topic === 'loops'
                ? 'Topic 09: Loops Complete'
                : 'Mixed Engineering Sprint Complete'}
            </h2>
            <p className="text-base text-[#8A8585] dark:text-[#9a8585]">
              Final Score:{' '}
              <strong className="font-mono text-2xl text-emerald-700 dark:text-emerald-300 tabular-nums">
                {score} / {questions.length}
              </strong>{' '}
              ({Math.round((score / questions.length) * 100)}%)
            </p>
            {bestRecord && (
              <p className="text-xs text-[#8A8585] dark:text-[#9a8585] tabular-nums">
                Saved Best Score: {bestRecord.bestScore}/{bestRecord.total} · Total Attempts:{' '}
                {bestRecord.attempts}
              </p>
            )}
          </div>

          {/* Action Row & Review Wrong Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E5DFDF] dark:border-[#3a1a1a] pt-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setReviewFilter('all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  reviewFilter === 'all'
                    ? 'bg-[#E10906] text-white shadow-sm'
                    : 'bg-[#FBF5F9] dark:bg-[#0f0303] text-[#8A8585] dark:text-[#9a8585]'
                }`}
              >
                All Questions ({questions.length})
              </button>
              {wrongCount > 0 && (
                <button
                  type="button"
                  onClick={() => setReviewFilter('wrong')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    reviewFilter === 'wrong'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                  Review Wrong Answers ({wrongCount})
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setScoreCardData({
                    title:
                      topic === 'basics'
                        ? 'Topic 01: Python Basics Quiz'
                        : topic === 'conditionals'
                        ? 'Topic 08: Conditionals Quiz'
                        : topic === 'loops'
                        ? 'Topic 09: Loops Quiz'
                        : 'Mixed Engineering Sprint',
                    category: 'Topic Quiz',
                    score,
                    maxScore: questions.length,
                    topic:
                      topic === 'basics'
                        ? 'Python Basics'
                        : topic === 'conditionals'
                        ? 'Conditional Statements'
                        : topic === 'loops'
                        ? 'Loops & Iteration'
                        : 'Mixed Python Assessment',
                  });
                }}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-[#E10906] bg-[#E10906]/10 px-4 py-1.5 text-xs font-semibold text-[#E10906] shadow-sm transition-all hover:bg-[#E10906] hover:text-white"
              >
                <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                Score Card
              </button>

              <button
                type="button"
                onClick={() => resetQuiz(topic)}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#E10906] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Restart Quiz
              </button>
            </div>
          </div>

          {/* Question Review List */}
          <div className="space-y-3 pt-2">
            {questions
              .map((q, idx) => ({ q, idx, entry: answersLog[idx] }))
              .filter(({ entry }) => (reviewFilter === 'wrong' ? entry && entry.chosen !== entry.correct : true))
              .map(({ q, idx, entry }) => {
                const right = entry && entry.chosen === entry.correct;
                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border p-4 text-xs space-y-1.5 ${
                      right
                        ? 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303]'
                        : 'border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-[#100303] dark:text-[#f0eaea]">
                        {idx + 1}. {q.question}
                      </span>
                      {right ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300 shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-rose-700 dark:text-rose-300 shrink-0">
                          <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          {entry?.chosen === null ? 'Timed Out' : 'Incorrect'}
                        </span>
                      )}
                    </div>
                    {q.code && (
                      <div className="my-2">
                        <CodeBlock code={q.code} title="snippet.py" showCopy={false} compact />
                      </div>
                    )}
                    {entry && entry.chosen !== null && entry.chosen !== entry.correct && (
                      <p className="text-rose-700 dark:text-rose-300">
                        Your Answer: <span className="line-through">{q.options[entry.chosen]}</span>
                      </p>
                    )}
                    <p className="text-[#8A8585] dark:text-[#9a8585]">
                      Correct Answer:{' '}
                      <strong className="text-emerald-700 dark:text-emerald-400 font-mono">
                        {q.options[q.correctIndex]}
                      </strong>
                    </p>
                    <p className="text-[#8A8585] dark:text-[#9a8585] leading-relaxed bg-black/5 dark:bg-white/5 p-2 rounded-lg font-sans">
                      💡 <strong>Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8 space-y-6">
          {/* Top Status & Timed Bar */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#8A8585] dark:text-[#9a8585]">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-[#100303] dark:text-[#f0eaea] tabular-nums">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                {currentQ.difficulty && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      currentQ.difficulty === 'Easy'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : currentQ.difficulty === 'Medium'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {currentQ.difficulty}
                  </span>
                )}
                {currentQ.kind && (
                  <span className="rounded bg-slate-500/10 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 uppercase">
                    {currentQ.kind}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {isTimedMode && (
                  <div
                    className={`inline-flex items-center gap-1 font-mono font-bold text-xs ${
                      timeLeft <= 5 ? 'text-rose-600 animate-pulse' : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    <Timer className="h-3.5 w-3.5" />
                    {timeLeft}s
                  </div>
                )}
                <span className="font-mono font-semibold text-[#E10906] tabular-nums">
                  Score: {score}
                  {bestRecord ? ` · Best: ${bestRecord.bestScore}/${bestRecord.total}` : ''}
                </span>
              </div>
            </div>

            {/* Timed countdown indicator bar */}
            {isTimedMode && !submitted && (
              <div className="h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className={`h-full transition-all duration-1000 ${
                    timeLeft <= 5 ? 'bg-rose-600' : 'bg-amber-500'
                  }`}
                  style={{ width: `${(timeLeft / QUESTION_TIME_LIMIT) * 100}%` }}
                />
              </div>
            )}

            <div className="h-2 overflow-hidden rounded-full bg-[#F1EEEE] dark:bg-[#221010]">
              <div
                className="h-full rounded-full bg-[#E10906] transition-all duration-300"
                style={{ width: `${((currentIdx + (submitted ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="font-display text-lg font-bold text-[#100303] dark:text-[#f0eaea] sm:text-xl">
            {currentQ.question}
          </h2>

          {currentQ.code && (
            <CodeBlock code={currentQ.code} title="quiz_snippet.py" showCopy={false} compact />
          )}

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let style =
                'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906] hover:bg-[#FFF1F1] dark:hover:bg-[#2a0808]/60 dark:bg-[#2a0808]/60';

              if (submitted) {
                if (isCorrect) {
                  style =
                    'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                } else if (isSelected && !isCorrect) {
                  style =
                    'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                }
              } else if (isSelected) {
                style =
                  'border-[#E10906] bg-[#E10906]/12 text-[#100303] dark:text-[#f0eaea] font-semibold ring-1 ring-rose-400/40';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={submitted}
                  onClick={() => setSelectedOpt(idx)}
                  className={`flex min-h-[48px] w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${style}`}
                >
                  <span className="mt-0.5 font-mono text-xs font-bold text-[#8A8585] dark:text-[#9a8585]">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span className="whitespace-pre-line font-mono text-xs sm:text-sm">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback after Submit */}
          {submitted && (
            <div
              className={`rounded-xl border p-4 text-xs sm:text-sm ${
                selectedOpt === currentQ.correctIndex
                  ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                  : 'border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                {selectedOpt === currentQ.correctIndex ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    Correct Answer!
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                    {selectedOpt === null ? 'Time Expired!' : 'Incorrect'} — The right answer is{' '}
                    {String.fromCharCode(65 + currentQ.correctIndex)}.
                  </>
                )}
              </div>
              <p className="mt-1.5 text-[#100303] dark:text-[#f0eaea] leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E5DFDF] dark:border-[#3a1a1a] pt-4">
            <button
              type="button"
              onClick={() => resetQuiz(topic)}
              className="inline-flex min-h-[40px] items-center gap-1.5 text-xs font-medium text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Restart Quiz
            </button>

            {!submitted ? (
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={selectedOpt === null}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#E10906] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-40 disabled:hover:translate-y-0"
              >
                Submit Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#E10906] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {currentIdx + 1 >= questions.length ? 'View Results' : 'Next Question'}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}

      {scoreCardData && (
        <ScoreCardModal
          data={scoreCardData}
          onClose={() => setScoreCardData(null)}
        />
      )}
    </div>
  );
};
