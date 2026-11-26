import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { t, tLesson } from '../data/translations';
import {
  CheckCircle2,
  Circle,
  GitBranch,
  Repeat,
  Box,
  ArrowRight,
  AlertTriangle,
  BookMarked,
  ChevronDown,
  Compass,
  Lightbulb,
  Eye,
  Sliders,
  Code2,
  HelpCircle,
  Cpu,
  Gamepad2,
} from 'lucide-react';
import { GamesHubTabId, LearnStageId, SectionId, TopicId } from '../types';
import {
  TOPIC_BASICS_LESSONS,
  TOPIC_08_LESSONS,
  TOPIC_09_LESSONS,
} from '../data/curriculumData';
import { CodeBlock } from './CodeBlock';
import { FlowchartSVG, FlowchartType } from './FlowchartSVG';
import {
  ComparisonScaleSVG,
  LoopTimelineStepper,
  VariableBoxVisualizer,
} from './LearnVisuals';
import { CheatSheetModal } from './CheatSheetModal';

interface LearnSectionProps {
  activeTopic: TopicId;
  onChangeTopic: (topic: TopicId) => void;
  completedLessons: string[];
  onToggleLesson: (lessonId: string) => void;
  onNavigate: (section: SectionId) => void;
  onOpenGamesTab: (tab: GamesHubTabId) => void;
  onOpenInSandbox: (code: string) => void;
}

const STAGES: Array<{
  id: 'all' | LearnStageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'all', label: 'All 6 Stages', icon: Compass },
  { id: 'explore', label: '1. Explore', icon: Compass },
  { id: 'understand', label: '2. Understand', icon: Lightbulb },
  { id: 'visualize', label: '3. Visualize', icon: Eye },
  { id: 'experiment', label: '4. Experiment', icon: Sliders },
  { id: 'practise', label: '5. Practise', icon: Code2 },
  { id: 'test', label: '6. Test Yourself', icon: HelpCircle },
];

const QUICK_CHECKS: Record<
  TopicId,
  Array<{ q: string; options: string[]; answer: number; why: string }>
> = {
  basics: [
    {
      q: 'Which line correctly stores the string "PyVerse" inside a variable?',
      options: ['name == "PyVerse"', 'name = "PyVerse"', 'name = PyVerse'],
      answer: 1,
      why: 'Single = assigns a value, and strings must be wrapped in quotes.',
    },
    {
      q: 'What data type is 94.5 in Python?',
      options: ['int', 'str', 'float'],
      answer: 2,
      why: 'Numbers with a decimal point are floats in Python.',
    },
  ],
  conditionals: [
    {
      q: 'Which keyword tests another condition if the first if is False?',
      options: ['elseif', 'elif', 'else if'],
      answer: 1,
      why: 'Python uses elif (short for else-if).',
    },
    {
      q: 'What does 10 >= 10 evaluate to?',
      options: ['True', 'False', 'Error'],
      answer: 0,
      why: '>= checks greater than OR equal to, so 10 >= 10 is True.',
    },
  ],
  loops: [
    {
      q: 'Which numbers does range(1, 5) produce?',
      options: ['1, 2, 3, 4, 5', '1, 2, 3, 4', '0, 1, 2, 3, 4'],
      answer: 1,
      why: 'range(start, stop) includes start (1) and excludes stop (5).',
    },
    {
      q: 'Which statement skips the rest of the current pass without stopping the loop?',
      options: ['break', 'stop', 'continue'],
      answer: 2,
      why: 'continue skips to the next iteration; break exits the loop entirely.',
    },
  ],
};

const ExpandableConcept: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title = 'Explore Concept',
  children,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left font-display text-xs font-semibold text-[#E10906] hover:bg-[#FFF1F1] dark:hover:bg-[#2a0808]/50 dark:bg-[#2a0808]/50 rounded-2xl transition-colors"
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="border-t border-[#E5DFDF]/70 dark:border-[#3a1a1a]/70 px-4 py-3 text-xs sm:text-sm leading-relaxed text-[#8A8585] dark:text-[#9a8585] space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};

export const LearnSection: React.FC<LearnSectionProps> = ({
  activeTopic,
  onChangeTopic,
  completedLessons,
  onToggleLesson,
  onNavigate,
  onOpenGamesTab,
  onOpenInSandbox,
}) => {
  const { lang } = useLanguage();
  const [activeStage, setActiveStage] = useState<'all' | LearnStageId>('all');
  const [cheatOpen, setCheatOpen] = useState(false);

  // Basics interactive widgets
  const [fName, setFName] = useState('Maya');
  const [fScore, setFScore] = useState(92);
  const [mathA, setMathA] = useState(17);
  const [mathB, setMathB] = useState(5);

  // Topic 08 Conditionals widgets
  const [cmpA, setCmpA] = useState(10);
  const [cmpB, setCmpB] = useState(5);
  const [boolA, setBoolA] = useState(true);
  const [boolB, setBoolB] = useState(false);
  const [rwMarks, setRwMarks] = useState(82);
  const [rwAge, setRwAge] = useState(19);
  const [rwSignNum, setRwSignNum] = useState(-4);
  const [rwEvenNum, setRwEvenNum] = useState(14);
  const [rwTotal, setRwTotal] = useState(120);
  const [rwMember, setRwMember] = useState(true);
  const [fcType, setFcType] = useState<FlowchartType>('if-else');
  const [fcValue, setFcValue] = useState(65);
  const [fcHasId, setFcHasId] = useState(true);

  // Topic 09 Loops widgets
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeStop, setRangeStop] = useState(10);
  const [rangeStep, setRangeStep] = useState(2);
  const [breakAt, setBreakAt] = useState(4);
  const [skipAt, setSkipAt] = useState(3);
  const [nestRows, setNestRows] = useState(4);
  const [nestCols, setNestCols] = useState(4);

  // Mini self-check state
  const [quickAnswers, setQuickAnswers] = useState<Record<string, number>>({});

  const lessons =
    activeTopic === 'basics'
      ? TOPIC_BASICS_LESSONS
      : activeTopic === 'conditionals'
      ? TOPIC_08_LESSONS
      : TOPIC_09_LESSONS;
  const doneCount = lessons.filter((l) => completedLessons.includes(l.id)).length;

  const showStage = (stage: LearnStageId) =>
    activeStage === 'all' || activeStage === stage;

  const getFlowchartHighlight = () => {
    if (fcType === 'if') {
      return fcValue >= 18
        ? { node: 'action1', branch: 'true' }
        : { node: 'end', branch: 'false' };
    }
    if (fcType === 'if-else') {
      return fcValue >= 40
        ? { node: 'action1', branch: 'true' }
        : { node: 'action2', branch: 'false' };
    }
    if (fcType === 'if-elif-else') {
      if (fcValue >= 90) return { node: 'action1', branch: 'true1' };
      if (fcValue >= 75) return { node: 'action2', branch: 'true2' };
      if (fcValue >= 40) return { node: 'action3', branch: 'true3' };
      return { node: 'action4', branch: 'false3' };
    }
    if (fcValue < 18) return { node: 'action3', branch: 'outer-false' };
    return fcHasId
      ? { node: 'action1', branch: 'inner-true' }
      : { node: 'action2', branch: 'inner-false' };
  };
  const fcHighlight = getFlowchartHighlight();

  const computeRangeValues = () => {
    if (rangeStep === 0) {
      return { values: [] as number[], warning: 'Step cannot be 0 in Python (ValueError).' };
    }
    const out: number[] = [];
    if (rangeStep > 0) {
      for (let v = rangeStart; v < rangeStop && out.length < 24; v += rangeStep) out.push(v);
    } else {
      for (let v = rangeStart; v > rangeStop && out.length < 24; v += rangeStep) out.push(v);
    }
    return {
      values: out,
      warning:
        out.length === 0
          ? 'Empty sequence: start cannot reach stop with this step direction.'
          : '',
    };
  };
  const rangePreview = computeRangeValues();

  const renderLessonHeader = (
    id: string,
    num: string,
    title: string,
    stageTag: string
  ) => {
    const isDone = completedLessons.includes(id);
    const displayTitle = tLesson(lang, { id, title, summary: '' }).title;
    return (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#E5DFDF] dark:border-[#3a1a1a] pb-4">
        <div>
          <span className="font-mono text-xs font-semibold text-[#E10906]">
            Section {num} · {stageTag}
          </span>
          <h3 className="mt-0.5 font-display text-xl font-bold text-[#100303] dark:text-[#f0eaea] sm:text-2xl">
            {displayTitle}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onToggleLesson(id)}
          className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
            isDone
              ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40/70'
              : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906] hover:bg-[#FFF1F1] dark:hover:bg-[#2a0808] dark:bg-[#2a0808]'
          }`}
        >
          {isDone ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              {t(lang, 'learn.completed')}
            </>
          ) : (
            <>
              <Circle className="h-4 w-4 text-[#8A8585] dark:text-[#9a8585]" aria-hidden="true" />
              {t(lang, 'learn.markComplete')}
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {/* Top Topic Header + Controls */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#E5DFDF] dark:border-[#3a1a1a] pb-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold text-[#E10906]">
            PyVerse Visual Learning World
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-[#100303] dark:text-[#f0eaea] sm:text-4xl">
            {activeTopic === 'basics'
              ? '01. Python Basics'
              : activeTopic === 'conditionals'
              ? '02. Conditional Statements'
              : '03. Loops'}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#8A8585] dark:text-[#9a8585]">
            {activeTopic === 'basics'
              ? 'Visual foundation: variables as memory boxes, data types, print() output, and Python spacing.'
              : activeTopic === 'conditionals'
              ? 'Decision trees, balance-scale comparisons, True/False branching, and real-world checks.'
              : 'Loop timelines, range() sequences, break/continue control, and nested iteration grids.'}
          </p>
        </div>

        <div className="flex flex-col items-start gap-2.5 lg:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-1 shadow-xs">
              <button
                type="button"
                onClick={() => {
                  onChangeTopic('basics');
                  setActiveStage('all');
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTopic === 'basics'
                    ? 'bg-[#E10906] text-white shadow-xs'
                    : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                }`}
              >
                <Box className="h-3.5 w-3.5" aria-hidden="true" />
                01. Basics
              </button>
              <button
                type="button"
                onClick={() => {
                  onChangeTopic('conditionals');
                  setActiveStage('all');
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTopic === 'conditionals'
                    ? 'bg-[#E10906] text-white shadow-xs'
                    : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                }`}
              >
                <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
                02. Conditionals
              </button>
              <button
                type="button"
                onClick={() => {
                  onChangeTopic('loops');
                  setActiveStage('all');
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTopic === 'loops'
                    ? 'bg-[#E10906] text-white shadow-xs'
                    : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                }`}
              >
                <Repeat className="h-3.5 w-3.5" aria-hidden="true" />
                03. Loops
              </button>
            </div>

            <button
              type="button"
              onClick={() => setCheatOpen(true)}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3.5 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] shadow-xs hover:border-[#E10906] hover:bg-[#FFF1F1] dark:hover:bg-[#2a0808] dark:bg-[#2a0808] whitespace-nowrap"
            >
              <BookMarked className="h-3.5 w-3.5 text-[#E10906]" aria-hidden="true" />
              {t(lang, 'learn.cheatSheet')}
            </button>
          </div>

          <span className="font-mono text-xs text-[#8A8585] dark:text-[#9a8585] tabular-nums">
            {doneCount} of {lessons.length} sections completed in this topic
          </span>
        </div>
      </div>

      {/* 6-Stage Visual Learning Flow Tabs */}
      <div className="mb-8 overflow-x-auto pb-1">
        <div className="inline-flex min-w-full sm:min-w-0 items-center gap-1.5 rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-1.5 shadow-xs">
          {STAGES.map((st) => {
            const Icon = st.icon;
            const active = activeStage === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setActiveStage(st.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 font-display text-xs font-semibold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-[#E10906] text-white shadow-sm'
                    : 'text-[#8A8585] dark:text-[#9a8585] hover:bg-[#FBF5F9] dark:hover:bg-[#221010] dark:bg-[#0f0303] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {st.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split: Chapter Index + Visual Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="sticky top-20 space-y-4 rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-sm">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#8A8585] dark:text-[#9a8585]">
              {t(lang, 'learn.chapters')}
            </h2>
            <nav aria-label="Lesson chapters" className="space-y-1">
              {lessons.map((lesson) => {
                const isDone = completedLessons.includes(lesson.id);
                return (
                  <a
                    key={lesson.id}
                    href={`#${lesson.id}`}
                    onClick={() => setActiveStage('all')}
                    className="flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-[#100303] dark:text-[#f0eaea] transition-colors hover:bg-[#FFF1F1] dark:hover:bg-[#2a0808] dark:bg-[#2a0808] hover:text-[#E10906]"
                  >
                    <span className="truncate">
                      <span className="mr-1.5 font-mono text-[#8A8585] dark:text-[#9a8585]">{lesson.number}</span>
                      {tLesson(lang, lesson).title}
                    </span>
                    {isDone && (
                      <CheckCircle2
                        className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                        aria-label="Completed"
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            <div className="space-y-2 border-t border-[#E5DFDF] dark:border-[#3a1a1a] pt-4">
              <button
                type="button"
                onClick={() => onNavigate('simulators')}
                className="flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl bg-[#E10906] px-3 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95"
              >
                <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
                {t(lang, 'learn.openSimulators')}
              </button>
              <button
                type="button"
                onClick={() =>
                  onOpenGamesTab(
                    activeTopic === 'basics' ? 'mini-games' : 'logic-lab'
                  )
                }
                className="flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906] hover:bg-[#FFF1F1] dark:hover:bg-[#2a0808] dark:bg-[#2a0808]"
              >
                <Gamepad2 className="h-3.5 w-3.5 text-[#E10906]" aria-hidden="true" />
                {activeTopic === 'basics' ? t(lang, 'learn.playMiniGames') : t(lang, 'learn.openLogicLab')}
              </button>
            </div>
          </div>
        </aside>

        {/* Lesson Cards Column */}
        <div className="space-y-7 lg:col-span-9">
          {/* ======================= TOPIC 01: PYTHON BASICS ======================= */}
          {activeTopic === 'basics' && (
            <>
              {(showStage('explore') || showStage('visualize')) && (
                <section
                  id="b-vars"
                  className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                >
                  {renderLessonHeader('b-vars', '1.1', 'Variables & Memory Boxes', 'Explore & Visualize')}
                  <div className="space-y-4 text-sm text-[#100303] dark:text-[#f0eaea]">
                    <p className="text-[#8A8585] dark:text-[#9a8585]">
                      Think of a <strong className="text-[#100303] dark:text-[#f0eaea]">variable</strong> as a labeled storage box. Python writes the label on the outside and stores your value inside.
                    </p>
                    <VariableBoxVisualizer />
                    <ExpandableConcept title="Explore Concept: Rules for Naming Variables">
                      <p>
                        Variable names can use letters, numbers, and underscores (<code className="font-mono">student_age</code>), cannot start with a number, and cannot contain spaces. Python is case-sensitive (<code className="font-mono">Score</code> and <code className="font-mono">score</code> are two different boxes!).
                      </p>
                    </ExpandableConcept>
                  </div>
                </section>
              )}

              {(showStage('understand') || showStage('experiment')) && (
                <section
                  id="b-types"
                  className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                >
                  {renderLessonHeader('b-types', '1.2', 'Core Data Types (int, float, str, bool)', 'Understand & Experiment')}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {[
                        { type: 'int', ex: '42', desc: 'Whole numbers', tone: 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFF1F1]/70 dark:bg-[#2a0808]/70 text-[#100303] dark:text-[#f0eaea]' },
                        { type: 'float', ex: '3.14', desc: 'Decimal numbers', tone: 'border-indigo-200 dark:border-indigo-800/60 bg-[#FFF1F1]/70 dark:bg-[#2a0808]/70 text-[#100303] dark:text-[#f0eaea]' },
                        { type: 'str', ex: '"Hi"', desc: 'Text in quotes', tone: 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFF1F1]/70 dark:bg-[#2a0808]/70 text-[#100303] dark:text-[#f0eaea]' },
                        { type: 'bool', ex: 'True', desc: 'True or False', tone: 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200' },
                      ].map((t) => (
                        <div key={t.type} className={`rounded-2xl border p-4 ${t.tone}`}>
                          <div className="font-mono text-xs font-bold">{t.type}</div>
                          <div className="mt-1 font-mono text-xl font-extrabold">{t.ex}</div>
                          <div className="mt-1 text-xs opacity-85">{t.desc}</div>
                        </div>
                      ))}
                    </div>

                    {/* Interactive f-string & print() Builder */}
                    <div className="rounded-2xl border border-[#F1EEEE] dark:border-[#2a1212] bg-[#FFF1F1]/70 dark:bg-[#2a0808]/70 p-4 space-y-3">
                      <p className="font-display text-xs font-bold uppercase tracking-wider text-[#E10906]">
                        Experiment: Live f-string &amp; print() Builder
                      </p>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label className="text-xs font-semibold text-[#100303] dark:text-[#f0eaea]">
                          student_name (str):
                          <input
                            type="text"
                            value={fName}
                            onChange={(e) => setFName(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3 py-1.5 font-mono text-sm"
                          />
                        </label>
                        <label className="text-xs font-semibold text-[#100303] dark:text-[#f0eaea]">
                          score (int):
                          <input
                            type="number"
                            value={fScore}
                            onChange={(e) => setFScore(Number(e.target.value))}
                            className="mt-1 w-full rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3 py-1.5 font-mono text-sm"
                          />
                        </label>
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <pre className="rounded-xl bg-[#100303] p-3 font-mono text-xs text-[#CFC8C8]">
                          {`name = "${fName}"\nscore = ${fScore}\nprint(f"Hi {name}, score: {score}")`}
                        </pre>
                        <div className="flex flex-col justify-center rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/40 p-3 font-mono text-xs">
                          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">Live Output:</span>
                          <span className="mt-1 text-sm font-bold text-[#100303] dark:text-[#f0eaea]">
                            Hi {fName}, score: {fScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {(showStage('understand') || showStage('experiment')) && (
                <section
                  id="b-io"
                  className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                >
                  {renderLessonHeader('b-io', '1.3', 'Math Expressions & Python Indentation', 'Experiment')}
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-4 space-y-3">
                      <div className="flex flex-wrap items-center gap-4">
                        <label className="text-xs font-semibold text-[#100303] dark:text-[#f0eaea]">
                          a:
                          <input
                            type="number"
                            value={mathA}
                            onChange={(e) => setMathA(Number(e.target.value))}
                            className="ml-2 w-20 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2.5 py-1 font-mono text-sm"
                          />
                        </label>
                        <label className="text-xs font-semibold text-[#100303] dark:text-[#f0eaea]">
                          b:
                          <input
                            type="number"
                            value={mathB}
                            onChange={(e) => setMathB(Number(e.target.value) || 1)}
                            className="ml-2 w-20 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2.5 py-1 font-mono text-sm"
                          />
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 font-mono text-xs">
                        <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-3">
                          <div className="text-[#8A8585] dark:text-[#9a8585]">{mathA} + {mathB}</div>
                          <div className="mt-1 font-bold text-[#E10906]">{mathA + mathB}</div>
                        </div>
                        <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-3">
                          <div className="text-[#8A8585] dark:text-[#9a8585]">{mathA} * {mathB}</div>
                          <div className="mt-1 font-bold text-[#E10906]">{mathA * mathB}</div>
                        </div>
                        <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-3">
                          <div className="text-[#8A8585] dark:text-[#9a8585]">{mathA} // {mathB} (floor)</div>
                          <div className="mt-1 font-bold text-[#E10906]">
                            {Math.floor(mathA / (mathB || 1))}
                          </div>
                        </div>
                        <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-3">
                          <div className="text-[#8A8585] dark:text-[#9a8585]">{mathA} % {mathB} (rem)</div>
                          <div className="mt-1 font-bold text-emerald-700 dark:text-emerald-300">
                            {mathA % (mathB || 1)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <ExpandableConcept title="Learn More: Why 4-Space Indentation Matters">
                      <p>
                        Unlike languages that use curly braces <code className="font-mono">{'{ }'}</code>, Python groups lines inside <code className="font-mono">if</code> or <code className="font-mono">for</code> using <strong>4 spaces</strong> at the start of each line inside the block.
                      </p>
                    </ExpandableConcept>
                  </div>
                </section>
              )}
            </>
          )}

          {/* ======================= TOPIC 02: CONDITIONAL STATEMENTS ======================= */}
          {activeTopic === 'conditionals' && (
            <>
              {showStage('explore') && (
                <section
                  id="c-intro"
                  className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                >
                  {renderLessonHeader('c-intro', '4.1', 'Introduction to Conditional Statements', 'Explore')}
                  <div className="space-y-4 text-sm text-[#8A8585] dark:text-[#9a8585]">
                    <p>
                      Programs make decisions just like traffic lights or grading rules: evaluate a{' '}
                      <strong className="text-[#100303] dark:text-[#f0eaea]">Boolean condition</strong> into{' '}
                      <code className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">True</code> or{' '}
                      <code className="font-mono font-semibold text-[#E10906]">False</code>, then pick one branch.
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/40 p-4">
                        <p className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-200">Condition is True</p>
                        <p className="mt-1 text-xs text-[#100303] dark:text-[#f0eaea]">
                          <code className="font-mono">temp &gt; 30</code> when temp is 34 → Python runs the indented block.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFF1F1]/70 dark:bg-[#2a0808]/70 p-4">
                        <p className="font-mono text-xs font-bold text-[#100303] dark:text-[#f0eaea]">Condition is False</p>
                        <p className="mt-1 text-xs text-[#100303] dark:text-[#f0eaea]">
                          <code className="font-mono">temp &gt; 30</code> when temp is 22 → Python skips the block.
                        </p>
                      </div>
                    </div>
                    <ExpandableConcept title="Explore Concept: Why Booleans Are Named After George Boole">
                      <p>
                        Every comparison in Python reduces to one of two values: <code className="font-mono">True</code> or <code className="font-mono">False</code> (always capitalized!). These binary yes/no values power every decision branch in software.
                      </p>
                    </ExpandableConcept>
                  </div>
                </section>
              )}

              {showStage('understand') && (
                <>
                  <section
                    id="c-if"
                    className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                  >
                    {renderLessonHeader('c-if', '4.2', 'The if Statement', 'Understand')}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <CodeBlock
                          title="if_example.py"
                          code={'age = 18\n\nif age >= 18:\n    print("Eligible")'}
                        />
                        <div className="space-y-2.5 rounded-2xl border border-[#F1EEEE] dark:border-[#2a1212] bg-[#FFF1F1]/70 dark:bg-[#2a0808]/70 p-4 text-xs text-[#100303] dark:text-[#f0eaea]">
                          <p className="font-bold">Visual Rule Breakdown</p>
                          <p><span className="font-mono font-semibold text-[#E10906]">1. Colon (:):</span> Marks the end of the condition line.</p>
                          <p><span className="font-mono font-semibold text-[#E10906]">2. 4 Spaces:</span> Indented lines belong inside the <code className="font-mono">if</code> block.</p>
                          <p><span className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">3. Output:</span> Runs only when the condition is <code className="font-mono">True</code>.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section
                    id="c-ifelse"
                    className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                  >
                    {renderLessonHeader('c-ifelse', '4.3', 'The if-else Statement', 'Understand')}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <div className="space-y-4">
                        <CodeBlock
                          title="if_else_marks.py"
                          code={'marks = 35\n\nif marks >= 40:\n    print("Pass")\nelse:\n    print("Fail")'}
                        />
                        <ExpandableConcept title="Learn More: Two Mutually Exclusive Paths">
                          <p>
                            With <code className="font-mono">if-else</code>, exactly one of the two branches runs—never both, and never neither.
                          </p>
                        </ExpandableConcept>
                      </div>
                      <FlowchartSVG type="if-else" activeNode="action2" activeBranch="false" />
                    </div>
                  </section>

                  <section
                    id="c-elif"
                    className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                  >
                    {renderLessonHeader('c-elif', '4.4', 'The if-elif-else Ladder', 'Understand')}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <CodeBlock
                        title="grade_ladder.py"
                        code={'marks = 85\n\nif marks >= 90:\n    print("Grade A")\nelif marks >= 75:\n    print("Grade B")\nelif marks >= 40:\n    print("Pass")\nelse:\n    print("Fail")'}
                      />
                      <div className="space-y-3">
                        <div className="rounded-2xl border border-[#F1EEEE] dark:border-[#2a1212] bg-[#FFF1F1]/70 dark:bg-[#2a0808]/70 p-4 text-xs space-y-2 text-[#100303] dark:text-[#f0eaea]">
                          <p className="font-bold">Top-to-Bottom Execution Order (marks = 85)</p>
                          <p>1. <code className="font-mono">85 &gt;= 90</code> → <span className="text-[#E10906] font-semibold">False</span></p>
                          <p>2. <code className="font-mono">85 &gt;= 75</code> → <span className="text-emerald-700 dark:text-emerald-300 font-bold">True!</span> Prints &quot;Grade B&quot; and exits ladder.</p>
                        </div>
                        <ExpandableConcept title="Explore Concept: Why Condition Order Matters">
                          <p>
                            If you put <code className="font-mono">marks &gt;= 40</code> first, a score of 95 would match 40+ and print &quot;Pass&quot; instead of &quot;Grade A&quot;. Always order thresholds from strictest to broadest!
                          </p>
                        </ExpandableConcept>
                      </div>
                    </div>
                  </section>

                  <section
                    id="c-nested"
                    className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                  >
                    {renderLessonHeader('c-nested', '4.5', 'Nested if Statements', 'Understand')}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <div className="space-y-3">
                        <CodeBlock
                          title="nested_if.py"
                          code={'age = 20\nhas_id = True\n\nif age >= 18:\n    if has_id == True:\n        print("Entry Allowed")\n    else:\n        print("Please show ID")\nelse:\n    print("Must be 18 or older")'}
                        />
                        <ExpandableConcept title="Explore Concept: 4 Spaces vs 8 Spaces">
                          <p>
                            The outer <code className="font-mono">if</code> indents by 4 spaces; the inner <code className="font-mono">if</code> indents by 8 spaces and only runs when the outer check is already True.
                          </p>
                        </ExpandableConcept>
                      </div>
                      <FlowchartSVG type="nested-if" activeNode="action1" activeBranch="inner-true" />
                    </div>
                  </section>
                </>
              )}

              {showStage('visualize') && (
                <section
                  id="c-flowchart"
                  className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                >
                  {renderLessonHeader('c-flowchart', '4.9', 'Interactive Decision Tree & Flowcharts', 'Visualize')}
                  <p className="mb-4 text-sm text-[#8A8585] dark:text-[#9a8585]">
                    Pick a structure and change the input value to watch the True/False path light up from Start to End:
                  </p>

                  <div className="mb-5 flex flex-wrap items-center gap-2.5">
                    {(['if', 'if-else', 'if-elif-else', 'nested-if'] as FlowchartType[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFcType(t)}
                        className={`rounded-xl border px-3.5 py-1.5 font-mono text-xs font-semibold transition-all ${
                          fcType === t
                            ? 'border-transparent bg-[#E10906] text-white shadow-sm'
                            : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}

                    <label className="ml-auto flex items-center gap-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea]">
                      {fcType === 'if' || fcType === 'nested-if' ? 'age:' : 'marks:'}
                      <input
                        type="number"
                        value={fcValue}
                        onChange={(e) => setFcValue(Number(e.target.value))}
                        className="w-20 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2.5 py-1 font-mono text-sm"
                      />
                    </label>

                    {fcType === 'nested-if' && (
                      <label className="flex items-center gap-2 text-xs font-medium text-[#100303] dark:text-[#f0eaea] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={fcHasId}
                          onChange={(e) => setFcHasId(e.target.checked)}
                          className="accent-[#E10906]"
                        />
                        has_id = True
                      </label>
                    )}
                  </div>

                  <FlowchartSVG
                    type={fcType}
                    activeNode={fcHighlight.node}
                    activeBranch={fcHighlight.branch}
                  />
                </section>
              )}

              {(showStage('visualize') || showStage('experiment')) && (
                <>
                  <section
                    id="c-compare"
                    className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                  >
                    {renderLessonHeader('c-compare', '4.6', 'Comparison Operators & Balance Scale', 'Visualize & Experiment')}
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-[#F1EEEE] dark:border-[#2a1212] bg-[#FFF1F1]/60 dark:bg-[#2a0808]/60 p-4 space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                          <label className="flex items-center gap-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea]">
                            Value a:
                            <input
                              type="number"
                              value={cmpA}
                              onChange={(e) => setCmpA(Number(e.target.value))}
                              className="w-20 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2.5 py-1.5 font-mono text-sm"
                            />
                          </label>
                          <label className="flex items-center gap-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea]">
                            Value b:
                            <input
                              type="number"
                              value={cmpB}
                              onChange={(e) => setCmpB(Number(e.target.value))}
                              className="w-20 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2.5 py-1.5 font-mono text-sm"
                            />
                          </label>
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                          <div className="lg:col-span-5">
                            <ComparisonScaleSVG leftVal={cmpA} rightVal={cmpB} />
                          </div>
                          <div className="overflow-x-auto rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-4 lg:col-span-7">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-[#E5DFDF] dark:border-[#3a1a1a] text-[#8A8585] dark:text-[#9a8585]">
                                  <th className="py-2.5 pr-3 font-semibold">Op</th>
                                  <th className="py-2.5 pr-3 font-semibold">Meaning</th>
                                  <th className="py-2.5 pr-3 font-semibold">Expr</th>
                                  <th className="py-2.5 font-semibold">Result</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#F1EEEE] dark:divide-[#2a1212] font-mono">
                                {[
                                  { op: '==', desc: 'Equal to', res: cmpA === cmpB },
                                  { op: '!=', desc: 'Not equal', res: cmpA !== cmpB },
                                  { op: '>', desc: 'Greater than', res: cmpA > cmpB },
                                  { op: '<', desc: 'Less than', res: cmpA < cmpB },
                                  { op: '>=', desc: 'Greater or equal', res: cmpA >= cmpB },
                                  { op: '<=', desc: 'Less or equal', res: cmpA <= cmpB },
                                ].map((row) => (
                                  <tr key={row.op}>
                                    <td className="py-2 pr-3 font-bold text-[#E10906]">{row.op}</td>
                                    <td className="py-2 pr-3 font-sans text-[#100303] dark:text-[#f0eaea]">{row.desc}</td>
                                    <td className="py-2 pr-3 text-[#8A8585] dark:text-[#9a8585] tabular-nums">
                                      {cmpA} {row.op} {cmpB}
                                    </td>
                                    <td
                                      className={`py-2 font-bold ${
                                        row.res ? 'text-emerald-700 dark:text-emerald-300' : 'text-[#E10906]'
                                      }`}
                                    >
                                      {row.res ? 'True' : 'False'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <ExpandableConcept title="Explore Concept: = vs == (Common Beginner Trap)">
                        <p>
                          Single <code className="font-mono">=</code> puts a value into a variable (<code className="font-mono">x = 5</code>). Double <code className="font-mono">==</code> asks a yes/no question (<code className="font-mono">x == 5</code>).
                        </p>
                      </ExpandableConcept>
                    </div>
                  </section>

                  <section
                    id="c-logical"
                    className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                  >
                    {renderLessonHeader('c-logical', '4.7', 'Logical Operators (and, or, not)', 'Experiment')}
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#F1EEEE] dark:border-[#2a1212] bg-[#FFF1F1]/60 dark:bg-[#2a0808]/60 p-4">
                        <button
                          type="button"
                          onClick={() => setBoolA((v) => !v)}
                          className={`min-h-[40px] rounded-xl border px-4 py-1.5 font-mono text-xs font-semibold transition-colors ${
                            boolA
                              ? 'border-emerald-300 dark:border-emerald-700/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                              : 'border-[#E10906] bg-[#FFF1F1] dark:bg-[#2a0808] text-[#100303] dark:text-[#f0eaea]'
                          }`}
                        >
                          A = {boolA ? 'True' : 'False'} (Toggle)
                        </button>
                        <button
                          type="button"
                          onClick={() => setBoolB((v) => !v)}
                          className={`min-h-[40px] rounded-xl border px-4 py-1.5 font-mono text-xs font-semibold transition-colors ${
                            boolB
                              ? 'border-emerald-300 dark:border-emerald-700/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                              : 'border-[#E10906] bg-[#FFF1F1] dark:bg-[#2a0808] text-[#100303] dark:text-[#f0eaea]'
                          }`}
                        >
                          B = {boolB ? 'True' : 'False'} (Toggle)
                        </button>
                        <div className="ml-auto flex flex-wrap gap-4 font-mono text-xs text-[#100303] dark:text-[#f0eaea]">
                          <span>
                            A and B:{' '}
                            <strong className={boolA && boolB ? 'text-emerald-700 dark:text-emerald-300' : 'text-[#E10906]'}>
                              {boolA && boolB ? 'True' : 'False'}
                            </strong>
                          </span>
                          <span>
                            A or B:{' '}
                            <strong className={boolA || boolB ? 'text-emerald-700 dark:text-emerald-300' : 'text-[#E10906]'}>
                              {boolA || boolB ? 'True' : 'False'}
                            </strong>
                          </span>
                          <span>
                            not A:{' '}
                            <strong className={!boolA ? 'text-emerald-700 dark:text-emerald-300' : 'text-[#E10906]'}>
                              {!boolA ? 'True' : 'False'}
                            </strong>
                          </span>
                        </div>
                      </div>

                      <div className="overflow-x-auto rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4">
                        <table className="w-full text-left font-mono text-xs">
                          <thead>
                            <tr className="border-b border-[#E5DFDF] dark:border-[#3a1a1a] text-[#8A8585] dark:text-[#9a8585]">
                              <th className="py-2 pr-4">A</th>
                              <th className="py-2 pr-4">B</th>
                              <th className="py-2 pr-4">A and B</th>
                              <th className="py-2 pr-4">A or B</th>
                              <th className="py-2">not A</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#F1EEEE] dark:divide-[#2a1212]">
                            {[
                              [true, true],
                              [true, false],
                              [false, true],
                              [false, false],
                            ].map(([a, b], idx) => {
                              const isActiveRow = a === boolA && b === boolB;
                              return (
                                <tr key={idx} className={isActiveRow ? 'bg-[#FFF1F1] dark:bg-[#2a0808] font-bold' : ''}>
                                  <td className="py-2.5 pr-4">{a ? 'True' : 'False'}</td>
                                  <td className="py-2.5 pr-4">{b ? 'True' : 'False'}</td>
                                  <td className={`py-2.5 pr-4 ${a && b ? 'text-emerald-700 dark:text-emerald-300' : 'text-[#E10906]'}`}>
                                    {a && b ? 'True' : 'False'}
                                  </td>
                                  <td className={`py-2.5 pr-4 ${a || b ? 'text-emerald-700 dark:text-emerald-300' : 'text-[#E10906]'}`}>
                                    {a || b ? 'True' : 'False'}
                                  </td>
                                  <td className={`py-2.5 ${!a ? 'text-emerald-700 dark:text-emerald-300' : 'text-[#E10906]'}`}>
                                    {!a ? 'True' : 'False'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>

                  <section
                    id="c-realworld"
                    className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                  >
                    {renderLessonHeader('c-realworld', '4.8', 'Real-World Conditional Checkers', 'Experiment')}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-4 space-y-2">
                        <h4 className="font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">1. Marks &amp; Grade Checker</h4>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={rwMarks}
                          onChange={(e) => setRwMarks(Number(e.target.value))}
                          className="w-full rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3 py-1.5 font-mono text-sm"
                        />
                        <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          Result:{' '}
                          {rwMarks >= 90 ? 'Grade A' : rwMarks >= 75 ? 'Grade B' : rwMarks >= 40 ? 'Pass' : 'Fail'}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-4 space-y-2">
                        <h4 className="font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">2. Age Eligibility Checker</h4>
                        <input
                          type="number"
                          min={0}
                          max={120}
                          value={rwAge}
                          onChange={(e) => setRwAge(Number(e.target.value))}
                          className="w-full rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3 py-1.5 font-mono text-sm"
                        />
                        <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          {rwAge >= 18 ? 'Eligible to vote & drive' : 'Not eligible yet (< 18)'}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-4 space-y-2">
                        <h4 className="font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">3. Positive, Negative, or Zero</h4>
                        <input
                          type="number"
                          value={rwSignNum}
                          onChange={(e) => setRwSignNum(Number(e.target.value))}
                          className="w-full rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3 py-1.5 font-mono text-sm"
                        />
                        <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          {rwSignNum > 0 ? 'Positive (> 0)' : rwSignNum < 0 ? 'Negative (< 0)' : 'Zero (== 0)'}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-4 space-y-2">
                        <h4 className="font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">4. Even &amp; Odd Checker</h4>
                        <input
                          type="number"
                          value={rwEvenNum}
                          onChange={(e) => setRwEvenNum(Math.trunc(Number(e.target.value)))}
                          className="w-full rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3 py-1.5 font-mono text-sm"
                        />
                        <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          {rwEvenNum} % 2 == {Math.abs(rwEvenNum % 2)} → {rwEvenNum % 2 === 0 ? 'Even' : 'Odd'}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-4 space-y-2 md:col-span-2">
                        <h4 className="font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">5. Discount Eligibility Checker</h4>
                        <div className="flex flex-wrap items-center gap-4">
                          <label className="text-xs font-medium text-[#100303] dark:text-[#f0eaea]">
                            Total ($):
                            <input
                              type="number"
                              min={0}
                              value={rwTotal}
                              onChange={(e) => setRwTotal(Number(e.target.value))}
                              className="ml-2 w-24 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2.5 py-1 font-mono text-sm"
                            />
                          </label>
                          <label className="flex items-center gap-2 text-xs font-medium text-[#100303] dark:text-[#f0eaea] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={rwMember}
                              onChange={(e) => setRwMember(e.target.checked)}
                              className="accent-[#E10906]"
                            />
                            is_member = True
                          </label>
                        </div>
                        <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          {rwTotal >= 100 || rwMember
                            ? `20% Off Applied → Final: $${(rwTotal * 0.8).toFixed(2)}`
                            : `Standard Price → $${rwTotal.toFixed(2)}`}
                        </p>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </>
          )}

          {/* ======================= TOPIC 03: LOOPS ======================= */}
          {activeTopic === 'loops' && (
            <>
              {showStage('explore') && (
                <section
                  id="l-intro"
                  className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                >
                  {renderLessonHeader('l-intro', '6.1', 'Introduction to Loops', 'Explore')}
                  <div className="space-y-4">
                    <p className="text-sm text-[#8A8585] dark:text-[#9a8585]">
                      A <strong className="text-[#100303] dark:text-[#f0eaea]">loop</strong> repeats instructions automatically. Each single pass is called an{' '}
                      <strong className="text-[#E10906]">iteration</strong>.
                    </p>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <CodeBlock
                        title="manual_way.py (5 lines)"
                        code={'print(1)\nprint(2)\nprint(3)\nprint(4)\nprint(5)'}
                        compact
                      />
                      <CodeBlock
                        title="loop_way.py (2 lines)"
                        code={'for i in range(1, 6):\n    print(i)'}
                        compact
                      />
                    </div>
                    <LoopTimelineStepper />
                  </div>
                </section>
              )}

              {(showStage('understand') || showStage('visualize')) && (
                <>
                  <section
                    id="l-for"
                    className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                  >
                    {renderLessonHeader('l-for', '6.2', 'The for Loop', 'Understand & Visualize')}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <div className="space-y-4">
                        <CodeBlock
                          title="for_loop.py"
                          code={'for i in range(1, 6):\n    print(i)'}
                        />
                        <ExpandableConcept title="Explore Concept: How the Loop Variable Works">
                          <p>
                            On each pass, Python automatically takes the next value from <code className="font-mono">range(1, 6)</code>, puts it into variable <code className="font-mono">i</code>, and executes the indented body.
                          </p>
                        </ExpandableConcept>
                      </div>
                      <FlowchartSVG type="for" activeNode="body" activeBranch="loop-true" />
                    </div>
                  </section>

                  <section
                    id="l-while"
                    className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                  >
                    {renderLessonHeader('l-while', '6.4', 'The while Loop', 'Understand & Visualize')}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <div className="space-y-4">
                        <CodeBlock
                          title="while_loop.py"
                          code={'count = 1\n\nwhile count <= 5:\n    print(count)\n    count += 1'}
                        />
                        <ExpandableConcept title="Explore Concept: When to Use while vs for">
                          <p>
                            Use <code className="font-mono">for</code> when you know the exact count or sequence. Use <code className="font-mono">while</code> when repetition stops only when a changing condition becomes <code className="font-mono">False</code>.
                          </p>
                        </ExpandableConcept>
                      </div>
                      <FlowchartSVG type="while" activeNode="check" activeBranch="loop-back" />
                    </div>
                  </section>
                </>
              )}

              {showStage('experiment') && (
                <>
                  <section
                    id="l-range"
                    className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                  >
                    {renderLessonHeader('l-range', '6.3', 'Interactive range() Builder', 'Experiment')}
                    <div className="rounded-2xl border border-[#F1EEEE] dark:border-[#2a1212] bg-[#FFF1F1]/60 dark:bg-[#2a0808]/60 p-4 space-y-4">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <label className="text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">
                          start:
                          <input
                            type="number"
                            value={rangeStart}
                            onChange={(e) => setRangeStart(Number(e.target.value))}
                            className="mt-1 w-full rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3 py-1.5 font-mono text-sm text-[#100303] dark:text-[#f0eaea]"
                          />
                        </label>
                        <label className="text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">
                          stop (excluded):
                          <input
                            type="number"
                            value={rangeStop}
                            onChange={(e) => setRangeStop(Number(e.target.value))}
                            className="mt-1 w-full rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3 py-1.5 font-mono text-sm text-[#100303] dark:text-[#f0eaea]"
                          />
                        </label>
                        <label className="text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">
                          step:
                          <input
                            type="number"
                            value={rangeStep}
                            onChange={(e) => setRangeStep(Number(e.target.value))}
                            className="mt-1 w-full rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3 py-1.5 font-mono text-sm text-[#100303] dark:text-[#f0eaea]"
                          />
                        </label>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono font-medium text-[#100303] dark:text-[#f0eaea]">
                          range({rangeStart}, {rangeStop}, {rangeStep}) →
                        </span>
                        {rangePreview.warning ? (
                          <span className="font-medium text-amber-700 dark:text-amber-300">{rangePreview.warning}</span>
                        ) : (
                          rangePreview.values.map((val, idx) => (
                            <span
                              key={`${val}-${idx}`}
                              className="inline-flex h-8 min-w-[34px] items-center justify-center rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2 font-mono font-bold text-[#E10906] shadow-xs tabular-nums"
                            >
                              {val}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </section>

                  <section
                    id="l-compare"
                    className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                  >
                    {renderLessonHeader('l-compare', '6.5', 'for Loop vs while Loop', 'Understand')}
                    <div className="overflow-x-auto rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-4">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-[#E5DFDF] dark:border-[#3a1a1a] text-[#8A8585] dark:text-[#9a8585]">
                            <th className="py-2.5 pr-4 font-semibold">Feature</th>
                            <th className="py-2.5 pr-4 font-bold text-[#E10906]">for Loop</th>
                            <th className="py-2.5 font-bold text-[#E10906]">while Loop</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5DFDF] dark:divide-[#3a1a1a]/70 text-[#100303] dark:text-[#f0eaea]">
                          <tr>
                            <td className="py-3 pr-4 font-semibold">Best used when</td>
                            <td className="py-3 pr-4">Known count or sequence (<code className="font-mono">range()</code>)</td>
                            <td className="py-3">Condition-controlled repetition</td>
                          </tr>
                          <tr>
                            <td className="py-3 pr-4 font-semibold">Counter update</td>
                            <td className="py-3 pr-4">Automatic each iteration</td>
                            <td className="py-3">Manual inside loop body</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section
                    id="l-break"
                    className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                  >
                    {renderLessonHeader('l-break', '6.6', 'The break Statement', 'Experiment')}
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-4 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="text-xs font-semibold text-[#100303] dark:text-[#f0eaea]">
                            Interactive <code className="font-mono text-[#E10906]">break</code> Demo (1..6)
                          </span>
                          <label className="text-xs font-medium text-[#100303] dark:text-[#f0eaea]">
                            Break when <code className="font-mono">i ==</code>
                            <select
                              value={breakAt}
                              onChange={(e) => setBreakAt(Number(e.target.value))}
                              className="ml-2 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2.5 py-1 font-mono"
                            >
                              {[2, 3, 4, 5, 6].map((n) => (
                                <option key={n} value={n}>{n}</option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <div className="grid grid-cols-6 gap-2">
                          {[1, 2, 3, 4, 5, 6].map((n) => {
                            const isBreak = n === breakAt;
                            const isAfter = n > breakAt;
                            return (
                              <div
                                key={n}
                                className={`rounded-xl border p-2 text-center font-mono text-xs ${
                                  isBreak
                                    ? 'border-[#E10906] bg-[#FFF1F1] dark:bg-[#2a0808] text-[#100303] dark:text-[#f0eaea] font-bold'
                                    : isAfter
                                    ? 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#F1EEEE] dark:bg-[#221010] text-[#8A8585] dark:text-[#9a8585] line-through'
                                    : 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-semibold'
                                }`}
                              >
                                {n}
                                <div className="mt-0.5 text-[10px]">
                                  {isBreak ? 'BREAK' : isAfter ? 'Stopped' : 'Printed'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <FlowchartSVG type="break-continue" activeBranch="break" labels={{ cond1: `if i == ${breakAt}:` }} />
                    </div>
                  </section>

                  <section
                    id="l-continue"
                    className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                  >
                    {renderLessonHeader('l-continue', '6.7', 'The continue Statement', 'Experiment')}
                    <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-[#100303] dark:text-[#f0eaea]">
                          Interactive <code className="font-mono text-[#E10906]">continue</code> Demo (1..6)
                        </span>
                        <label className="text-xs font-medium text-[#100303] dark:text-[#f0eaea]">
                          Skip when <code className="font-mono">i ==</code>
                          <select
                            value={skipAt}
                            onChange={(e) => setSkipAt(Number(e.target.value))}
                            className="ml-2 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2.5 py-1 font-mono"
                          >
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((n) => {
                          const isSkip = n === skipAt;
                          return (
                            <div
                              key={n}
                              className={`rounded-xl border p-2 text-center font-mono text-xs ${
                                isSkip
                                  ? 'border-[#E10906] bg-[#FFF1F1] dark:bg-[#2a0808] text-[#100303] dark:text-[#f0eaea] font-bold'
                                  : 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-semibold'
                              }`}
                            >
                              {n}
                              <div className="mt-0.5 text-[10px]">{isSkip ? 'SKIPPED' : 'Printed'}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>

                  <section
                    id="l-nested"
                    className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                  >
                    {renderLessonHeader('l-nested', '6.8', 'Nested Loops Grid', 'Visualize & Experiment')}
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-[#F1EEEE] dark:border-[#2a1212] bg-[#FFF1F1]/60 dark:bg-[#2a0808]/60 p-4 space-y-4">
                        <div className="flex flex-wrap items-center gap-6">
                          <label className="text-xs font-medium text-[#100303] dark:text-[#f0eaea]">
                            Outer Rows: <strong className="font-mono text-[#E10906]">{nestRows}</strong>
                            <input
                              type="range"
                              min={1}
                              max={5}
                              value={nestRows}
                              onChange={(e) => setNestRows(Number(e.target.value))}
                              className="ml-2 accent-[#E10906] cursor-pointer"
                            />
                          </label>
                          <label className="text-xs font-medium text-[#100303] dark:text-[#f0eaea]">
                            Inner Columns: <strong className="font-mono text-[#E10906]">{nestCols}</strong>
                            <input
                              type="range"
                              min={1}
                              max={6}
                              value={nestCols}
                              onChange={(e) => setNestCols(Number(e.target.value))}
                              className="ml-2 accent-[#8B5CF6] cursor-pointer"
                            />
                          </label>
                          <span className="ml-auto font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                            {nestRows} × {nestCols} = {nestRows * nestCols} cells
                          </span>
                        </div>

                        <div className="space-y-1.5 font-mono text-xs">
                          {Array.from({ length: nestRows }, (_, r) => (
                            <div key={r} className="flex items-center gap-2">
                              <span className="w-16 text-[#8A8585] dark:text-[#9a8585]">row {r + 1}:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {Array.from({ length: nestCols }, (_, c) => (
                                  <span
                                    key={c}
                                    className="rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2.5 py-1 font-semibold text-[#E10906] tabular-nums"
                                  >
                                    ({r + 1},{c + 1})
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <FlowchartSVG type="nested-loop" activeNode="inner" activeBranch="inner-body" />
                    </div>
                  </section>

                  <section
                    id="l-mistakes"
                    className="scroll-mt-24 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8"
                  >
                    {renderLessonHeader('l-mistakes', '6.9', 'Common Loop Mistakes & Fixes', 'Understand')}
                    <div className="space-y-4">
                      {[
                        {
                          title: '1. Missing while-loop update (Infinite Loop)',
                          bad: 'i = 1\nwhile i <= 5:\n    print(i)',
                          good: 'i = 1\nwhile i <= 5:\n    print(i)\n    i += 1',
                          why: 'Without i += 1, i stays 1 forever.',
                        },
                        {
                          title: '2. Wrong range() stop bound (Off-by-One)',
                          bad: 'for i in range(1, 5):\n    print(i)  # stops at 4!',
                          good: 'for i in range(1, 6):\n    print(i)  # prints 1..5',
                          why: 'range(start, stop) always excludes stop.',
                        },
                      ].map((item) => (
                        <div key={item.title} className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-4 space-y-3">
                          <div className="flex items-center gap-2 font-display text-sm font-bold text-amber-800 dark:text-amber-200">
                            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                            {item.title}
                          </div>
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <CodeBlock title="Broken" code={item.bad} compact showCopy={false} />
                            <CodeBlock title="Fixed" code={item.good} compact showCopy={false} />
                          </div>
                          <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">{item.why}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </>
          )}

          {/* ======================= STAGE 5: PRACTISE LAUNCHER ======================= */}
          {showStage('practise') && (
            <section className="rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-gradient-to-br from-[#FFF1F1] dark:from-[#2a0808] via-white to-violet-50/50 p-6 shadow-sm sm:p-8">
              <p className="font-mono text-xs font-semibold text-[#E10906]">
                Stage 5 · Hands-On Practice
              </p>
              <h3 className="mt-1 font-display text-xl font-bold text-[#100303] dark:text-[#f0eaea]">
                Apply What You Just Visualized
              </h3>
              <p className="mt-1 text-sm text-[#8A8585] dark:text-[#9a8585]">
                Jump straight into a real-life simulator, write code in the Sandbox, or test your skills in mini-games.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => onNavigate('simulators')}
                  className="flex items-center justify-between rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-4 py-3.5 text-left text-xs font-semibold text-[#100303] dark:text-[#f0eaea] shadow-xs hover:border-[#E10906]"
                >
                  <span>Run Real-Life Simulators</span>
                  <ArrowRight className="h-4 w-4 text-[#E10906]" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onOpenInSandbox(
                      activeTopic === 'basics'
                        ? 'name = "Alex"\nscore = 90\nprint(f"{name} scored {score}")'
                        : activeTopic === 'conditionals'
                        ? 'marks = 82\nif marks >= 75:\n    print("Honors")\nelse:\n    print("Pass")'
                        : 'for i in range(1, 6):\n    print("Step", i)'
                    )
                  }
                  className="flex items-center justify-between rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-4 py-3.5 text-left text-xs font-semibold text-[#100303] dark:text-[#f0eaea] shadow-xs hover:border-[#E10906]"
                >
                  <span>Try in Python Sandbox</span>
                  <ArrowRight className="h-4 w-4 text-[#E10906]" />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenGamesTab('challenges')}
                  className="flex items-center justify-between rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-4 py-3.5 text-left text-xs font-semibold text-[#100303] dark:text-[#f0eaea] shadow-xs hover:border-emerald-300"
                >
                  <span>Solve Coding Challenges</span>
                  <ArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </button>
              </div>
            </section>
          )}

          {/* ======================= STAGE 6: TEST YOURSELF ======================= */}
          {showStage('test') && (
            <section className="rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-semibold text-[#E10906]">
                    Stage 6 · Quick Concept Check
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-[#100303] dark:text-[#f0eaea]">
                    Test Yourself
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenGamesTab('quizzes')}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#E10906] px-4 py-2 text-xs font-semibold text-white"
                >
                  Open Full 20-Question Quiz
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {QUICK_CHECKS[activeTopic].map((item, qIdx) => {
                  const key = `${activeTopic}-${qIdx}`;
                  const chosen = quickAnswers[key];
                  const answered = chosen !== undefined;
                  return (
                    <div
                      key={key}
                      className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-4 space-y-3"
                    >
                      <p className="text-sm font-semibold text-[#100303] dark:text-[#f0eaea]">{item.q}</p>
                      <div className="space-y-1.5">
                        {item.options.map((opt, oIdx) => {
                          const isSelected = chosen === oIdx;
                          const isCorrect = oIdx === item.answer;
                          let cls =
                            'border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906]';
                          if (answered) {
                            if (isCorrect)
                              cls = 'border-emerald-300 dark:border-emerald-700/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-semibold';
                            else if (isSelected)
                              cls = 'border-rose-300 dark:border-rose-700/60 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200';
                          }
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() =>
                                setQuickAnswers((prev) => ({ ...prev, [key]: oIdx }))
                              }
                              className={`w-full rounded-xl border px-3 py-2 text-left font-mono text-xs transition-colors ${cls}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {answered && (
                        <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">{item.why}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>

      <CheatSheetModal
        isOpen={cheatOpen}
        initialTopic={activeTopic}
        onClose={() => setCheatOpen(false)}
        onTryInSandbox={onOpenInSandbox}
      />
    </div>
  );
};
