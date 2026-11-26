import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  GitBranch,
  Repeat,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/curriculumData';
import { QuizScoreRecord, TopicId } from '../types';
import { CodeBlock } from './CodeBlock';

interface QuizSectionProps {
  quizScores: {
    conditionals: QuizScoreRecord | null;
    loops: QuizScoreRecord | null;
  };
  onRecordQuizResult: (topic: TopicId, score: number, total: number) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  quizScores,
  onRecordQuizResult,
}) => {
  const [topic, setTopic] = useState<TopicId>('conditionals');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [answersLog, setAnswersLog] = useState<
    Array<{ questionId: string; chosen: number; correct: number }>
  >([]);
  const [finished, setFinished] = useState<boolean>(false);

  const questions = QUIZ_QUESTIONS.filter((q) => q.topic === topic);
  const currentQ = questions[currentIdx];

  const resetQuiz = (nextTopic: TopicId = topic) => {
    setTopic(nextTopic);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setSubmitted(false);
    setScore(0);
    setAnswersLog([]);
    setFinished(false);
  };

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
      onRecordQuizResult(topic, score, questions.length);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedOpt(null);
      setSubmitted(false);
    }
  };

  const bestRecord = quizScores[topic];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-800/80 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium text-blue-400">Knowledge Check</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-white sm:text-4xl">
            Topic-Wise Quizzes
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            10 beginner-friendly questions per topic covering syntax, output prediction, and debugging.
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-slate-800 bg-[#0D1426] p-1">
          <button
            type="button"
            onClick={() => resetQuiz('conditionals')}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
              topic === 'conditionals'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
            08. Conditionals (10)
          </button>
          <button
            type="button"
            onClick={() => resetQuiz('loops')}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
              topic === 'loops'
                ? 'bg-violet-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Repeat className="h-3.5 w-3.5" aria-hidden="true" />
            09. Loops (10)
          </button>
        </div>
      </div>

      {finished ? (
        <div className="rounded-2xl border border-slate-800/90 bg-[#0D1426] p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-3">
            <Award className="mx-auto h-12 w-12 text-amber-400" aria-hidden="true" />
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {topic === 'conditionals' ? 'Topic 08 Quiz Complete' : 'Topic 09 Quiz Complete'}
            </h2>
            <p className="text-base text-slate-300">
              Final Score:{' '}
              <strong className="font-mono text-2xl text-emerald-300 tabular-nums">
                {score} / {questions.length}
              </strong>{' '}
              ({Math.round((score / questions.length) * 100)}%)
            </p>
            {bestRecord && (
              <p className="text-xs text-slate-400 tabular-nums">
                Saved Best Score: {bestRecord.bestScore}/{bestRecord.total} · Total Attempts: {bestRecord.attempts}
              </p>
            )}
          </div>

          {/* Question Review List */}
          <div className="space-y-3 border-t border-slate-800/80 pt-5">
            <h3 className="font-display text-sm font-semibold text-white">Question Review</h3>
            {questions.map((q, idx) => {
              const entry = answersLog[idx];
              const right = entry && entry.chosen === entry.correct;
              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-800/80 bg-[#090E1A] p-4 text-xs space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-white">
                      {idx + 1}. {q.question}
                    </span>
                    {right ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-300 shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-rose-300 shrink-0">
                        <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        Incorrect
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400">
                    Correct Answer: <strong className="text-slate-200">{q.options[q.correctIndex]}</strong>
                  </p>
                  <p className="text-slate-400">{q.explanation}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => resetQuiz(topic)}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Restart Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800/90 bg-[#0D1426] p-6 sm:p-8 space-y-6">
          {/* Quiz Top Progress */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span className="font-mono font-semibold text-white tabular-nums">
                Question {currentIdx + 1} of {questions.length}
              </span>
              <span className="font-mono text-blue-300 tabular-nums">
                Current Score: {score}
                {bestRecord ? ` · Best: ${bestRecord.bestScore}/${bestRecord.total}` : ''}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  topic === 'conditionals' ? 'bg-blue-500' : 'bg-violet-500'
                }`}
                style={{ width: `${((currentIdx + (submitted ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="font-display text-lg font-bold text-white sm:text-xl">
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
                'border-slate-800 bg-[#090E1A] text-slate-200 hover:border-slate-600';

              if (submitted) {
                if (isCorrect) {
                  style = 'border-emerald-500 bg-emerald-500/15 text-emerald-200';
                } else if (isSelected && !isCorrect) {
                  style = 'border-rose-500 bg-rose-500/15 text-rose-200';
                }
              } else if (isSelected) {
                style = 'border-blue-500 bg-blue-600/20 text-white';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={submitted}
                  onClick={() => setSelectedOpt(idx)}
                  className={`flex min-h-[48px] w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${style}`}
                >
                  <span className="mt-0.5 font-mono text-xs font-bold text-slate-400">
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
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                  : 'border-rose-500/40 bg-rose-500/10 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                {selectedOpt === currentQ.correctIndex ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    Correct Answer!
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-rose-400" aria-hidden="true" />
                    Incorrect — The right answer is {String.fromCharCode(65 + currentQ.correctIndex)}.
                  </>
                )}
              </div>
              <p className="mt-1.5 text-slate-200">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
            <button
              type="button"
              onClick={() => resetQuiz(topic)}
              className="inline-flex min-h-[40px] items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Restart Quiz
            </button>

            {!submitted ? (
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={selectedOpt === null}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-40"
              >
                Submit Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
              >
                {currentIdx + 1 >= questions.length ? 'View Results' : 'Next Question'}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
