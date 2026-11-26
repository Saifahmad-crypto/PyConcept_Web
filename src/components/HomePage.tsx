import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  GitBranch,
  Repeat,
  Play,
  Terminal,
  Cpu,
  CheckCircle2,
  BookOpen,
  Gamepad2,
  Code2,
} from 'lucide-react';
import { LearningProgress, SectionId, TopicId } from '../types';
import { TOPIC_08_LESSONS, TOPIC_09_LESSONS, CODING_CHALLENGES } from '../data/curriculumData';

interface HomePageProps {
  progress: LearningProgress;
  onNavigate: (section: SectionId) => void;
  onOpenTopic: (topic: TopicId) => void;
  onOpenLabTab: (tab: 'conditional-sim' | 'loop-viz' | 'games') => void;
}

const HERO_CODE_LINES = [
  'score = 88',
  'if score >= 75:',
  '    for badge in range(1, 4):',
  '        print("Level", badge, "Unlocked")',
  'else:',
  '    print("Keep Practicing")',
];

export const HomePage: React.FC<HomePageProps> = ({
  progress,
  onNavigate,
  onOpenTopic,
  onOpenLabTab,
}) => {
  const [heroActiveLine, setHeroActiveLine] = useState(0);
  const [cardMarks, setCardMarks] = useState(82);
  const [loopTick, setLoopTick] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroActiveLine((prev) => (prev + 1) % HERO_CODE_LINES.length);
    }, 1150);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoopTick((prev) => (prev + 1) % 5);
    }, 900);
    return () => clearInterval(timer);
  }, []);

  const condResult =
    cardMarks >= 90
      ? { label: 'Grade A', branch: 'if marks >= 90' }
      : cardMarks >= 75
      ? { label: 'Grade B', branch: 'elif marks >= 75' }
      : cardMarks >= 40
      ? { label: 'Pass', branch: 'elif marks >= 40' }
      : { label: 'Fail', branch: 'else' };

  const totalLessons = TOPIC_08_LESSONS.length + TOPIC_09_LESSONS.length;
  const completedLessonsCount = progress.completedLessons.length;
  const lessonsPercent = Math.round((completedLessonsCount / totalLessons) * 100);
  const challengesPercent = Math.round(
    (progress.completedChallenges.length / CODING_CHALLENGES.length) * 100
  );

  return (
    <div className="bg-lab-grid">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Hero Column */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <p className="mb-3 text-xs font-medium tracking-wide text-blue-400">
              Topic 08: Conditional Statements · Topic 09: Loops
            </p>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white text-balance sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
              Learn Python.{' '}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
                By Doing.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Master programming logic through interactive experiments, visual simulations and
              real-world coding challenges.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('learn')}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Explore Learning Modules
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('lab')}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-5 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:border-violet-500/60 hover:bg-slate-800 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <Play className="h-4 w-4 text-violet-400" aria-hidden="true" />
                Start Experiment
              </button>
            </div>

            {/* Animated Small Code Preview */}
            <div className="mt-8 overflow-hidden rounded-xl border border-slate-800/90 bg-[#0A101E]">
              <div className="flex items-center justify-between border-b border-slate-800/80 bg-[#0E1629] px-4 py-2 text-xs text-slate-400">
                <span className="font-mono">live_preview.py</span>
                <span className="tabular-nums text-sky-400">
                  Line {heroActiveLine + 1} / {HERO_CODE_LINES.length}
                </span>
              </div>
              <div className="space-y-0.5 py-3 font-mono text-xs sm:text-[13px]">
                {HERO_CODE_LINES.map((line, idx) => {
                  const active = idx === heroActiveLine;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center px-4 py-0.5 transition-colors duration-200 ${
                        active ? 'bg-blue-500/15 text-white' : 'text-slate-400'
                      }`}
                    >
                      <span className="mr-3 w-4 select-none text-right tabular-nums text-slate-600">
                        {idx + 1}
                      </span>
                      <pre className="whitespace-pre">{line}</pre>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Hero Visual Column */}
          <div className="flex items-stretch lg:col-span-6">
            <div className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0D1426] shadow-2xl">
              {!imgFailed ? (
                <img
                  src="/src/assets/images/hero_python_logic_lab_1795675517344.jpg"
                  alt="Isometric illustration of Python conditional branching pathways and loop cycles"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="h-full min-h-[280px] w-full object-cover lg:h-full"
                />
              ) : (
                <div className="flex h-full min-h-[320px] w-full flex-col items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#131C31] to-[#1E1B4B] p-8 text-center">
                  <Terminal className="h-12 w-12 text-blue-400" />
                  <p className="mt-3 font-display text-lg font-semibold text-white">
                    Visual Logic & Control Flow Workspace
                  </p>
                </div>
              )}
              <div className="border-t border-slate-800/80 bg-[#0B1120]/95 px-5 py-3.5 text-xs text-slate-300">
                Visualizing decisions (`if / elif / else`) and repetition (`for / while`) step by step.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topic Cards Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium text-violet-400">Core Curriculum</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
              Two Essential Building Blocks of Logic
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-400">
            Designed for absolute beginners—start with decision-making or jump straight into repetition.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Card 1: Conditional Statements */}
          <article className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-[#0E1526] p-6 transition-colors hover:border-blue-500/50 sm:p-8">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs font-semibold text-blue-400 tabular-nums">
                  Topic 08
                </span>
                <span className="font-mono text-xs text-slate-400">
                  if · elif · else
                </span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                  <GitBranch className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
                  Conditional Statements
                </h3>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Teach Python how to make decisions. Evaluate True or False conditions using comparison
                and logical operators to choose which code branch runs.
              </p>

              {/* Interactive Card Preview */}
              <div className="mt-6 rounded-xl border border-slate-800/80 bg-[#090E1A] p-4">
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="home-marks-slider" className="text-xs font-medium text-slate-300">
                    Adjust <code className="font-mono text-blue-300">marks</code>:
                  </label>
                  <span className="font-mono text-sm font-semibold text-white tabular-nums">
                    {cardMarks}
                  </span>
                </div>
                <input
                  id="home-marks-slider"
                  type="range"
                  min={0}
                  max={100}
                  value={cardMarks}
                  onChange={(e) => setCardMarks(Number(e.target.value))}
                  className="mt-2 w-full accent-blue-500 cursor-pointer"
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-3 font-mono text-xs">
                  <span className="text-slate-400">
                    Active branch: <span className="text-blue-300">{condResult.branch}</span>
                  </span>
                  <span className="font-semibold text-emerald-300">
                    Output: &quot;{condResult.label}&quot;
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenTopic('conditionals')}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 whitespace-nowrap"
              >
                Explore Topic
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onOpenLabTab('conditional-sim')}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-blue-500/50 hover:text-white whitespace-nowrap"
              >
                Open Simulator
              </button>
            </div>
          </article>

          {/* Card 2: Loops */}
          <article className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-[#0E1526] p-6 transition-colors hover:border-violet-500/50 sm:p-8">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs font-semibold text-violet-400 tabular-nums">
                  Topic 09
                </span>
                <span className="font-mono text-xs text-slate-400">
                  for · while · range()
                </span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
                  <Repeat className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
                  Loops
                </h3>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Understand how Python repeats instructions. Iterate cleanly over sequences with{' '}
                <code className="font-mono text-violet-300">for</code>, control conditions with{' '}
                <code className="font-mono text-violet-300">while</code>, and direct flow using{' '}
                <code className="font-mono text-violet-300">break</code> and{' '}
                <code className="font-mono text-violet-300">continue</code>.
              </p>

              {/* Animated Card Preview */}
              <div className="mt-6 rounded-xl border border-slate-800/80 bg-[#090E1A] p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-300">for i in range(1, 6):</span>
                  <span className="font-mono text-violet-300 tabular-nums">
                    i = {loopTick + 1}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((num, idx) => {
                    const isCurrent = idx === loopTick;
                    const isVisited = idx < loopTick;
                    return (
                      <div
                        key={num}
                        className={`flex h-10 items-center justify-center rounded-lg border font-mono text-sm font-semibold tabular-nums transition-all duration-200 ${
                          isCurrent
                            ? 'border-violet-400 bg-violet-500/25 text-white scale-105'
                            : isVisited
                            ? 'border-blue-500/30 bg-blue-500/10 text-blue-300'
                            : 'border-slate-800 bg-slate-900/60 text-slate-500'
                        }`}
                      >
                        {num}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-3 font-mono text-xs text-slate-400">
                  <span>Iteration {loopTick + 1} of 5</span>
                  <span className="text-emerald-300">print({loopTick + 1})</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenTopic('loops')}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500 whitespace-nowrap"
              >
                Explore Topic
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onOpenLabTab('loop-viz')}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-violet-500/50 hover:text-white whitespace-nowrap"
              >
                Open Visualizer
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* Why Learn Python Logic + What You Will Learn */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="rounded-2xl border border-slate-800/90 bg-[#0D1426] p-6 sm:p-8 lg:col-span-5">
            <p className="text-xs font-medium text-blue-400">Foundation</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              Why Learn Python Logic?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Every real program—from grading systems and games to data pipelines—relies on two core
              capabilities: choosing the right path based on data and repeating tasks accurately
              without manual effort.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                <span>Turn everyday rules into clear True or False conditions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                <span>Replace repetitive copy-pasted instructions with concise loops.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                <span>Spot indentation, boundary, and infinite-loop bugs before they happen.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800/90 bg-[#0D1426] p-6 sm:p-8 lg:col-span-7">
            <p className="text-xs font-medium text-violet-400">Syllabus Overview</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              What Will You Learn?
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-display text-sm font-semibold text-blue-300">
                  Topic 08 — Conditionals
                </h3>
                <ul className="mt-2.5 space-y-2 text-sm text-slate-300">
                  <li>Boolean True / False evaluation</li>
                  <li>if, if-else, and if-elif-else order</li>
                  <li>Nested decisions &amp; 4-space indentation</li>
                  <li>All 6 comparison operators (= vs ==)</li>
                  <li>Logical operators: and, or, not</li>
                </ul>
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-violet-300">
                  Topic 09 — Loops
                </h3>
                <ul className="mt-2.5 space-y-2 text-sm text-slate-300">
                  <li>for loops &amp; sequence iteration</li>
                  <li>range(stop), start/stop, and negative steps</li>
                  <li>while loops &amp; loop variable updates</li>
                  <li>Controlling flow with break &amp; continue</li>
                  <li>Nested loops &amp; common error fixes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Interactive Learning Works */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-medium text-blue-400">Learning Method</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
            How Interactive Learning Works
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800/80 bg-[#0D1426] p-5">
            <BookOpen className="h-5 w-5 text-blue-400" aria-hidden="true" />
            <h3 className="mt-3 font-display text-base font-semibold text-white">
              1. Guided Lessons
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
              Plain-English explanations with line-by-line code breakdowns and live widgets.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-[#0D1426] p-5">
            <Cpu className="h-5 w-5 text-violet-400" aria-hidden="true" />
            <h3 className="mt-3 font-display text-base font-semibold text-white">
              2. Step Simulators
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
              Watch flowcharts, loop bars, and variables update one execution step at a time.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-[#0D1426] p-5">
            <Gamepad2 className="h-5 w-5 text-sky-400" aria-hidden="true" />
            <h3 className="mt-3 font-display text-base font-semibold text-white">
              3. Logic Mini-Games
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
              Train your eye with Condition Detective, Bug Hunter, Loop Race, and Output Predictor.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-[#0D1426] p-5">
            <Code2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            <h3 className="mt-3 font-display text-base font-semibold text-white">
              4. Code &amp; Verify
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
              Write Python in the Playground, pass 10 coding challenges, and ace 20 quiz questions.
            </p>
          </div>
        </div>
      </section>

      {/* Learning Journey / Progress Strip */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-800/90 bg-[#0E1526] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-medium text-blue-400">Your Local Progress</p>
              <h2 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
                Learning Journey Snapshot
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Automatically saved in your browser—no account required.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('progress')}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-blue-500/50 whitespace-nowrap self-start sm:self-auto"
            >
              View Full Dashboard
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800/80 bg-[#090E1A] p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Lessons Completed</span>
                <span className="font-mono font-semibold text-blue-300 tabular-nums">
                  {completedLessonsCount} / {totalLessons}
                </span>
              </div>
              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${lessonsPercent}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-[#090E1A] p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Coding Challenges</span>
                <span className="font-mono font-semibold text-violet-300 tabular-nums">
                  {progress.completedChallenges.length} / {CODING_CHALLENGES.length}
                </span>
              </div>
              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all duration-300"
                  style={{ width: `${challengesPercent}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-[#090E1A] p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Mini-Games &amp; Quizzes</span>
                <span className="font-mono font-semibold text-emerald-300 tabular-nums">
                  {Object.values(progress.gameScores).filter((g) => g.completed).length} / 8 Games
                </span>
              </div>
              <p className="mt-2.5 text-xs text-slate-300 tabular-nums">
                Quiz Best — Topic 08:{' '}
                {progress.quizScores.conditionals
                  ? `${progress.quizScores.conditionals.bestScore}/${progress.quizScores.conditionals.total}`
                  : 'Not taken'}{' '}
                · Topic 09:{' '}
                {progress.quizScores.loops
                  ? `${progress.quizScores.loops.bestScore}/${progress.quizScores.loops.total}`
                  : 'Not taken'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070B14]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <p className="font-display text-sm font-bold text-white">PYTHON LAB</p>
            <p className="mt-1 text-xs text-slate-400">
              Learn Python. By Doing. · Educational Module for Topic 08 (Conditional Statements) &amp; Topic 09 (Loops).
            </p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400">
            <button type="button" onClick={() => onNavigate('learn')} className="hover:text-white">
              Learn
            </button>
            <button type="button" onClick={() => onNavigate('lab')} className="hover:text-white">
              Interactive Lab
            </button>
            <button type="button" onClick={() => onNavigate('playground')} className="hover:text-white">
              Playground
            </button>
            <button type="button" onClick={() => onNavigate('challenges')} className="hover:text-white">
              Challenges
            </button>
            <button type="button" onClick={() => onNavigate('quiz')} className="hover:text-white">
              Quiz
            </button>
            <button type="button" onClick={() => onNavigate('progress')} className="hover:text-white">
              Progress
            </button>
          </nav>
        </div>
      </footer>
    </div>
  );
};
