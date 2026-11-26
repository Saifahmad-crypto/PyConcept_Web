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
import { PyVerseLogo } from './PyVerseLogo';

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
    <div className="bg-pyverse-mesh">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Hero Column */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <p className="mb-3 text-xs font-semibold tracking-wide text-sky-700">
              PyVerse · Interactive Python Learning Platform
            </p>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#1E293B] text-balance sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
              Think. Code.{' '}
              <span className="bg-gradient-to-r from-[#0EA5E9] via-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
                Experiment.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Master Python programming logic through interactive visual simulations, live
              flowcharts, logic mini-games, and hands-on coding challenges designed for absolute
              beginners.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('learn')}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/25 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                Start Learning
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('lab')}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1E293B] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-[#F0F9FF] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <Play className="h-4 w-4 text-violet-600" aria-hidden="true" />
                Explore Topics in Lab
              </button>
            </div>

            {/* Animated Small Code Preview */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/90 bg-[#0F172A] shadow-lg shadow-slate-900/5">
              <div className="flex items-center justify-between border-b border-slate-800 bg-[#1E293B] px-4 py-2.5 text-xs text-slate-300">
                <span className="font-mono">live_preview.py</span>
                <span className="font-mono tabular-nums text-sky-300">
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
                        active
                          ? 'bg-gradient-to-r from-sky-500/25 to-violet-500/20 text-white'
                          : 'text-slate-400'
                      }`}
                    >
                      <span className="mr-3 w-4 select-none text-right tabular-nums text-slate-500">
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
            <div className="relative flex w-full flex-col overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-xl shadow-sky-900/5">
              {!imgFailed ? (
                <img
                  src="/src/assets/images/hero_pyverse_workspace_1795678622030.jpg"
                  alt="Isometric illustration of PyVerse branching logic pathways, floating code panels, and loop rings"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="h-full min-h-[300px] w-full object-cover lg:h-full"
                />
              ) : (
                <div className="flex h-full min-h-[320px] w-full flex-col items-center justify-center bg-gradient-to-br from-[#F0F9FF] via-white to-violet-50 p-8 text-center">
                  <Terminal className="h-12 w-12 text-sky-500" />
                  <p className="mt-3 font-display text-lg font-bold text-[#1E293B]">
                    PyVerse Logic &amp; Control Flow Workspace
                  </p>
                </div>
              )}
              <div className="border-t border-sky-100 bg-[#F0F9FF]/90 px-5 py-3.5 text-xs font-medium text-slate-700">
                Interactive visual learning for decisions (<code className="font-mono text-sky-700">if / elif / else</code>) and loops (<code className="font-mono text-violet-700">for / while</code>).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topic Cards Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold text-violet-700">Core Curriculum</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-[#1E293B] sm:text-3xl">
              Master Two Essential Pillars of Python
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-600">
            Designed for absolute beginners—experiment with decision paths or trace how loops repeat step by step.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Card 1: Conditional Statements */}
          <article className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/5 sm:p-8">
            <div>
              <div className="flex items-center justify-between gap-4 text-xs">
                <span className="font-mono font-semibold text-sky-700 tabular-nums">
                  Topic 08 · Beginner
                </span>
                <span className="font-mono text-slate-500">if · elif · else</span>
              </div>

              <div className="mt-4 flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-sky-50 text-sky-600 border border-sky-200/60">
                  <GitBranch className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#1E293B] sm:text-2xl">
                  Conditional Statements
                </h3>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Teach Python how to make decisions. Evaluate True or False conditions using
                comparison and logical operators to choose which code branch runs.
              </p>

              {/* Interactive Card Preview */}
              <div className="mt-6 rounded-2xl border border-sky-100 bg-[#F0F9FF]/80 p-4">
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="home-marks-slider" className="text-xs font-semibold text-slate-700">
                    Adjust <code className="font-mono text-sky-700">marks</code>:
                  </label>
                  <span className="font-mono text-sm font-bold text-[#1E293B] tabular-nums">
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
                  className="mt-2.5 w-full accent-sky-500 cursor-pointer"
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-sky-200/70 pt-3 font-mono text-xs">
                  <span className="text-slate-600">
                    Active branch: <span className="font-semibold text-sky-700">{condResult.branch}</span>
                  </span>
                  <span className="font-bold text-emerald-700">
                    Output: &quot;{condResult.label}&quot;
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenTopic('conditionals')}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-95 whitespace-nowrap"
              >
                Explore Topic
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onOpenLabTab('conditional-sim')}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#1E293B] transition-colors hover:border-sky-300 hover:bg-[#F0F9FF] whitespace-nowrap"
              >
                Open Simulator
              </button>
            </div>
          </article>

          {/* Card 2: Loops */}
          <article className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/5 sm:p-8">
            <div>
              <div className="flex items-center justify-between gap-4 text-xs">
                <span className="font-mono font-semibold text-violet-700 tabular-nums">
                  Topic 09 · Beginner
                </span>
                <span className="font-mono text-slate-500">for · while · range()</span>
              </div>

              <div className="mt-4 flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 text-violet-600 border border-violet-200/60">
                  <Repeat className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#1E293B] sm:text-2xl">
                  Loops
                </h3>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Understand how Python repeats instructions. Iterate cleanly over sequences with{' '}
                <code className="font-mono text-violet-700">for</code>, control conditions with{' '}
                <code className="font-mono text-violet-700">while</code>, and direct flow using{' '}
                <code className="font-mono text-violet-700">break</code> and{' '}
                <code className="font-mono text-violet-700">continue</code>.
              </p>

              {/* Animated Card Preview */}
              <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-medium text-slate-700">
                    for i in range(1, 6):
                  </span>
                  <span className="font-mono font-bold text-violet-700 tabular-nums">
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
                        className={`flex h-10 items-center justify-center rounded-xl border font-mono text-sm font-bold tabular-nums transition-all duration-200 ${
                          isCurrent
                            ? 'border-violet-400 bg-gradient-to-br from-[#38BDF8] to-[#8B5CF6] text-white shadow-sm scale-105'
                            : isVisited
                            ? 'border-sky-200 bg-sky-50 text-sky-700'
                            : 'border-slate-200 bg-white text-slate-400'
                        }`}
                      >
                        {num}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-violet-200/60 pt-3 font-mono text-xs text-slate-600">
                  <span>Iteration {loopTick + 1} of 5</span>
                  <span className="font-bold text-emerald-700">print({loopTick + 1})</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenTopic('loops')}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-95 whitespace-nowrap"
              >
                Explore Topic
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onOpenLabTab('loop-viz')}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#1E293B] transition-colors hover:border-violet-300 hover:bg-violet-50/40 whitespace-nowrap"
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
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:col-span-5">
            <p className="text-xs font-semibold text-sky-700">Foundation</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-[#1E293B]">
              Why Learn Python Logic?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Every real program—from grading systems and games to data pipelines—relies on two core
              capabilities: choosing the right path based on data and repeating tasks accurately
              without manual effort.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" aria-hidden="true" />
                <span>Turn everyday rules into clear True or False conditions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" aria-hidden="true" />
                <span>Replace repetitive copy-pasted instructions with concise loops.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" aria-hidden="true" />
                <span>Spot indentation, boundary, and infinite-loop bugs before they happen.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
            <p className="text-xs font-semibold text-violet-700">Syllabus Overview</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-[#1E293B]">
              What Will You Learn?
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-sky-100 bg-[#F0F9FF]/60 p-4">
                <h3 className="font-display text-sm font-bold text-sky-800">
                  Topic 08 — Conditionals
                </h3>
                <ul className="mt-2.5 space-y-2 text-sm text-slate-700">
                  <li>Boolean True / False evaluation</li>
                  <li>if, if-else, and if-elif-else order</li>
                  <li>Nested decisions &amp; 4-space indentation</li>
                  <li>All 6 comparison operators (= vs ==)</li>
                  <li>Logical operators: and, or, not</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
                <h3 className="font-display text-sm font-bold text-violet-800">
                  Topic 09 — Loops
                </h3>
                <ul className="mt-2.5 space-y-2 text-sm text-slate-700">
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
          <p className="text-xs font-semibold text-sky-700">Learning Method</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold text-[#1E293B] sm:text-3xl">
            How PyVerse Works
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-[#1E293B]">
              1. Guided Lessons
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              Plain-English explanations with line-by-line code breakdowns and live widgets.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Cpu className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-[#1E293B]">
              2. Step Simulators
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              Watch flowcharts, loop bars, and variables update one execution step at a time.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Gamepad2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-[#1E293B]">
              3. Logic Mini-Games
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              Train your eye with Condition Detective, Bug Hunter, Loop Race, and Output Predictor.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Code2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-[#1E293B]">
              4. Code &amp; Verify
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              Write Python in the Playground, pass 10 coding challenges, and ace 20 quiz questions.
            </p>
          </div>
        </div>
      </section>

      {/* Learning Journey / Progress Strip */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-sky-100 bg-gradient-to-br from-[#F0F9FF] via-white to-violet-50/40 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold text-sky-700">Your Local Progress</p>
              <h2 className="mt-1 font-display text-xl font-bold text-[#1E293B] sm:text-2xl">
                Learning Journey Snapshot
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Automatically saved in your browser—no account required.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('progress')}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#1E293B] shadow-sm transition-colors hover:border-sky-300 whitespace-nowrap self-start sm:self-auto"
            >
              View Full Dashboard
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Lessons Completed</span>
                <span className="font-mono font-bold text-sky-700 tabular-nums">
                  {completedLessonsCount} / {totalLessons}
                </span>
              </div>
              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] transition-all duration-300"
                  style={{ width: `${lessonsPercent}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Coding Challenges</span>
                <span className="font-mono font-bold text-violet-700 tabular-nums">
                  {progress.completedChallenges.length} / {CODING_CHALLENGES.length}
                </span>
              </div>
              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] transition-all duration-300"
                  style={{ width: `${challengesPercent}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Mini-Games &amp; Quizzes</span>
                <span className="font-mono font-bold text-emerald-700 tabular-nums">
                  {Object.values(progress.gameScores).filter((g) => g.completed).length} / 8 Games
                </span>
              </div>
              <p className="mt-2.5 text-xs text-slate-600 tabular-nums">
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
      <footer className="border-t border-slate-200 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="space-y-2">
              <PyVerseLogo size="md" />
              <p className="text-sm font-medium text-slate-700">
                Think. Code. Experiment.
              </p>
              <p className="max-w-md text-xs text-slate-500">
                Interactive Python learning modules covering Topic 08 (Conditional Statements) and
                Topic 09 (Loops) with visual simulations, flowcharts, and coding practice.
              </p>
            </div>

            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2.5 text-sm font-medium text-slate-600">
              <button type="button" onClick={() => onNavigate('learn')} className="hover:text-sky-700 transition-colors">
                Learn
              </button>
              <button type="button" onClick={() => onNavigate('lab')} className="hover:text-sky-700 transition-colors">
                Interactive Lab
              </button>
              <button type="button" onClick={() => onNavigate('simulators')} className="hover:text-sky-700 transition-colors">
                Interactive Simulators
              </button>
              <button type="button" onClick={() => onNavigate('tutor')} className="hover:text-sky-700 transition-colors">
                AI Tutor
              </button>
              <button type="button" onClick={() => onNavigate('playground')} className="hover:text-sky-700 transition-colors">
                Playground
              </button>
              <button type="button" onClick={() => onNavigate('challenges')} className="hover:text-sky-700 transition-colors">
                Challenges
              </button>
              <button type="button" onClick={() => onNavigate('quiz')} className="hover:text-sky-700 transition-colors">
                Quiz
              </button>
              <button type="button" onClick={() => onNavigate('progress')} className="hover:text-sky-700 transition-colors">
                Progress
              </button>
            </nav>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6 flex flex-col justify-between gap-2 text-xs text-slate-500 sm:flex-row">
            <span>© {new Date().getFullYear()} PyVerse. Built for beginner Python learners.</span>
            <span>Topic 08: Conditional Statements · Topic 09: Loops</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
