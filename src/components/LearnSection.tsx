import React, { useState } from 'react';
import { CheckCircle2, Circle, GitBranch, Repeat, ArrowRight, AlertTriangle } from 'lucide-react';
import { TopicId } from '../types';
import { TOPIC_08_LESSONS, TOPIC_09_LESSONS } from '../data/curriculumData';
import { CodeBlock } from './CodeBlock';
import { FlowchartSVG, FlowchartType } from './FlowchartSVG';

interface LearnSectionProps {
  activeTopic: TopicId;
  onChangeTopic: (topic: TopicId) => void;
  completedLessons: string[];
  onToggleLesson: (lessonId: string) => void;
  onOpenLab: (tab: 'conditional-sim' | 'loop-viz' | 'games') => void;
}

export const LearnSection: React.FC<LearnSectionProps> = ({
  activeTopic,
  onChangeTopic,
  completedLessons,
  onToggleLesson,
  onOpenLab,
}) => {
  // Interactive states for Topic 08 widgets
  const [cmpA, setCmpA] = useState(10);
  const [cmpB, setCmpB] = useState(5);
  const [boolA, setBoolA] = useState(true);
  const [boolB, setBoolB] = useState(false);

  // 5 Real-world conditional interactive states
  const [rwMarks, setRwMarks] = useState(82);
  const [rwAge, setRwAge] = useState(19);
  const [rwSignNum, setRwSignNum] = useState(-4);
  const [rwEvenNum, setRwEvenNum] = useState(14);
  const [rwTotal, setRwTotal] = useState(120);
  const [rwMember, setRwMember] = useState(true);

  // Flowchart explorer state (4.9)
  const [fcType, setFcType] = useState<FlowchartType>('if-else');
  const [fcValue, setFcValue] = useState(65);
  const [fcHasId, setFcHasId] = useState(true);

  // Interactive states for Topic 09 widgets
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeStop, setRangeStop] = useState(10);
  const [rangeStep, setRangeStep] = useState(2);

  const [breakAt, setBreakAt] = useState(4);
  const [skipAt, setSkipAt] = useState(3);
  const [nestRows, setNestRows] = useState(4);
  const [nestCols, setNestCols] = useState(4);

  const lessons = activeTopic === 'conditionals' ? TOPIC_08_LESSONS : TOPIC_09_LESSONS;
  const doneCount = lessons.filter((l) => completedLessons.includes(l.id)).length;

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

  const renderLessonHeader = (id: string, num: string, title: string) => {
    const isDone = completedLessons.includes(id);
    return (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <span className="font-mono text-xs font-semibold text-sky-700">Section {num}</span>
          <h3 className="mt-0.5 font-display text-xl font-bold text-[#1E293B] sm:text-2xl">
            {title}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onToggleLesson(id)}
          className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
            isDone
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70'
              : 'border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-sky-300 hover:bg-[#F0F9FF]'
          }`}
        >
          {isDone ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              Completed
            </>
          ) : (
            <>
              <Circle className="h-4 w-4 text-slate-400" aria-hidden="true" />
              Mark Complete
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Top Topic Switcher */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold text-sky-700">PyVerse Curriculum</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-[#1E293B] sm:text-4xl">
            {activeTopic === 'conditionals'
              ? 'Topic 08 — Conditional Statements'
              : 'Topic 09 — Loops'}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            {activeTopic === 'conditionals'
              ? 'Learn how Python evaluates True and False conditions to make smart decisions in code.'
              : 'Learn how Python repeats tasks efficiently using for loops, while loops, range(), break, and continue.'}
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 md:items-end">
          <div className="inline-flex rounded-xl border border-slate-200 bg-[#F8FAFC] p-1">
            <button
              type="button"
              onClick={() => onChangeTopic('conditionals')}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                activeTopic === 'conditionals'
                  ? 'bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#1E293B]'
              }`}
            >
              <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
              08. Conditionals
            </button>
            <button
              type="button"
              onClick={() => onChangeTopic('loops')}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                activeTopic === 'loops'
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#1E293B]'
              }`}
            >
              <Repeat className="h-3.5 w-3.5" aria-hidden="true" />
              09. Loops
            </button>
          </div>
          <span className="font-mono text-xs text-slate-500 tabular-nums">
            {doneCount} of {lessons.length} sections completed
          </span>
        </div>
      </div>

      {/* Main Split: Chapter Sidebar + Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Sticky Chapter Index */}
        <aside className="lg:col-span-3">
          <div className="sticky top-20 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-display text-xs font-bold uppercase tracking-wider text-slate-500">
              Lesson Chapters
            </h2>
            <nav aria-label="Lesson chapters" className="space-y-1">
              {lessons.map((lesson) => {
                const isDone = completedLessons.includes(lesson.id);
                return (
                  <a
                    key={lesson.id}
                    href={`#${lesson.id}`}
                    className="flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-[#F0F9FF] hover:text-sky-800"
                  >
                    <span className="truncate">
                      <span className="mr-1.5 font-mono text-slate-400">{lesson.number}</span>
                      {lesson.title}
                    </span>
                    {isDone && (
                      <CheckCircle2
                        className="h-3.5 w-3.5 shrink-0 text-emerald-600"
                        aria-label="Completed"
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            <div className="mt-5 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() =>
                  onOpenLab(activeTopic === 'conditionals' ? 'conditional-sim' : 'loop-viz')
                }
                className="flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
              >
                Launch {activeTopic === 'conditionals' ? 'Conditional Simulator' : 'Loop Visualizer'}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </aside>

        {/* Lesson Content Column */}
        <div className="space-y-8 lg:col-span-9">
          {activeTopic === 'conditionals' ? (
            <>
              {/* 4.1 Introduction */}
              <section id="c-intro" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                {renderLessonHeader('c-intro', '4.1', 'Introduction to Conditional Statements')}
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                  <p>
                    <strong className="text-[#1E293B]">What are conditional statements?</strong> In daily life, you make
                    decisions constantly: <em>&quot;If it is raining, I will carry an umbrella; otherwise, I will wear sunglasses.&quot;</em>{' '}
                    Conditional statements let a Python program make similar decisions by running different blocks of code depending on whether a rule is true or false.
                  </p>
                  <p>
                    <strong className="text-[#1E293B]">Why are they needed?</strong> Without conditionals, a program executes every line from top to bottom blindly. Conditionals allow software to react to user input, validate passwords, calculate grades, or trigger alerts.
                  </p>
                  <p>
                    <strong className="text-[#1E293B]">What are True and False values?</strong> Python evaluates every condition into a{' '}
                    <strong className="text-sky-700">Boolean</strong> (named after mathematician George Boole)—a data type with only two possible values:{' '}
                    <code className="font-mono font-semibold text-emerald-700">True</code> or{' '}
                    <code className="font-mono font-semibold text-violet-700">False</code> (always capitalized in Python).
                  </p>
                  <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                      <p className="font-mono text-xs font-bold text-emerald-800">Condition is True</p>
                      <p className="mt-1 text-xs text-slate-700">
                        Example: <code className="font-mono">temperature &gt; 30</code> when temperature is 34 → Python runs the indented action!
                      </p>
                    </div>
                    <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-4">
                      <p className="font-mono text-xs font-bold text-violet-800">Condition is False</p>
                      <p className="mt-1 text-xs text-slate-700">
                        Example: <code className="font-mono">temperature &gt; 30</code> when temperature is 22 → Python skips the block.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4.2 if statement */}
              <section id="c-if" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                {renderLessonHeader('c-if', '4.2', 'The if Statement')}
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                  <p>
                    The <code className="font-mono font-semibold text-violet-700">if</code> statement runs a block of code{' '}
                    <strong>only if</strong> its condition evaluates to{' '}
                    <code className="font-mono font-semibold text-emerald-700">True</code>.
                  </p>
                  <ul className="list-disc space-y-1.5 pl-5 text-slate-700">
                    <li>
                      <strong className="text-[#1E293B]">Syntax:</strong> Start with <code className="font-mono">if</code>, write your condition, and end the line with a{' '}
                      <strong className="text-sky-700">colon (:)</strong>.
                    </li>
                    <li>
                      <strong className="text-[#1E293B]">Indentation:</strong> Indentation means the leading spaces before a line (4 spaces is standard in Python). Every indented line belongs inside the <code className="font-mono">if</code> block.
                    </li>
                  </ul>
                  <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
                    <CodeBlock
                      title="if_example.py"
                      code={'age = 18\n\nif age >= 18:\n    print("Eligible")'}
                    />
                    <div className="space-y-2.5 rounded-2xl border border-sky-100 bg-[#F0F9FF]/70 p-4 text-xs text-slate-700">
                      <p className="font-bold text-[#1E293B]">Line-by-Line Explanation</p>
                      <p><span className="font-mono font-semibold text-sky-700">Line 1:</span> <code className="font-mono">age = 18</code> stores the number 18 in variable <code className="font-mono">age</code>.</p>
                      <p><span className="font-mono font-semibold text-sky-700">Line 3:</span> <code className="font-mono">if age &gt;= 18:</code> checks if 18 is greater than or equal to 18. That is <strong className="text-emerald-700">True</strong>.</p>
                      <p><span className="font-mono font-semibold text-sky-700">Line 4:</span> Because it is indented by 4 spaces and the condition was True, Python prints <code className="font-mono font-semibold text-emerald-700">Eligible</code>.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4.3 if-else statement */}
              <section id="c-ifelse" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                {renderLessonHeader('c-ifelse', '4.3', 'The if-else Statement')}
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                  <p>
                    Use <code className="font-mono font-semibold text-violet-700">else</code> when you want Python to choose between <strong>two mutually exclusive branches</strong>: one runs when the condition is <code className="font-mono">True</code>, and the <code className="font-mono">else</code> branch runs when it is <code className="font-mono">False</code>.
                  </p>
                  <div className="grid grid-cols-1 gap-6 pt-2 lg:grid-cols-2">
                    <div className="space-y-4">
                      <CodeBlock
                        title="if_else_marks.py"
                        code={'marks = 35\n\nif marks >= 40:\n    print("Pass")\nelse:\n    print("Fail")'}
                      />
                      <div className="rounded-2xl border border-sky-100 bg-[#F0F9FF]/70 p-4 text-xs space-y-1.5 text-slate-700">
                        <p><strong className="text-[#1E293B]">Trace with marks = 35:</strong></p>
                        <p>1. <code className="font-mono">35 &gt;= 40</code> evaluates to <span className="text-violet-700 font-bold">False</span>.</p>
                        <p>2. Python skips <code className="font-mono">print(&quot;Pass&quot;)</code> and jumps directly to <code className="font-mono">else:</code>.</p>
                        <p>3. Output: <code className="font-mono font-bold text-emerald-700">Fail</code>.</p>
                      </div>
                    </div>
                    <FlowchartSVG type="if-else" activeNode="action2" activeBranch="false" />
                  </div>
                </div>
              </section>

              {/* 4.4 if-elif-else */}
              <section id="c-elif" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                {renderLessonHeader('c-elif', '4.4', 'The if-elif-else Statement')}
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                  <p>
                    When you have three or more possible outcomes, chain conditions with <code className="font-mono font-semibold text-violet-700">elif</code> (short for <em>else if</em>) and finish with a default <code className="font-mono font-semibold text-violet-700">else</code> branch.
                  </p>
                  <p>
                    <strong className="text-[#1E293B]">Why order matters &amp; why only one branch executes:</strong> Python evaluates conditions strictly from <strong>top to bottom</strong>. As soon as it finds the <strong>first</strong> condition that is <code className="font-mono">True</code>, it runs that branch and skips all remaining <code className="font-mono">elif</code> and <code className="font-mono">else</code> blocks! If you accidentally put <code className="font-mono">marks &gt;= 40</code> first, a score of 95 would match 40+ and print &quot;Pass&quot; instead of &quot;Grade A&quot;.
                  </p>
                  <div className="grid grid-cols-1 gap-6 pt-2 lg:grid-cols-2">
                    <CodeBlock
                      title="grade_ladder.py"
                      code={'marks = 85\n\nif marks >= 90:\n    print("Grade A")\nelif marks >= 75:\n    print("Grade B")\nelif marks >= 40:\n    print("Pass")\nelse:\n    print("Fail")'}
                    />
                    <div className="rounded-2xl border border-sky-100 bg-[#F0F9FF]/70 p-4 text-xs space-y-2.5 text-slate-700">
                      <p className="font-bold text-[#1E293B]">Evaluation Order for marks = 85</p>
                      <p>1. <code className="font-mono">85 &gt;= 90</code> → <span className="text-violet-700 font-semibold">False</span> (keep checking)</p>
                      <p>2. <code className="font-mono">85 &gt;= 75</code> → <span className="text-emerald-700 font-bold">True!</span> Prints <code className="font-mono font-bold text-emerald-700">&quot;Grade B&quot;</code></p>
                      <p>3. Remaining <code className="font-mono">elif marks &gt;= 40</code> and <code className="font-mono">else</code> are skipped immediately.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4.5 Nested if */}
              <section id="c-nested" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                {renderLessonHeader('c-nested', '4.5', 'Nested if Statements')}
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                  <p>
                    <strong className="text-[#1E293B]">Nesting</strong> means placing an <code className="font-mono">if</code> statement inside another <code className="font-mono">if</code> block. The inner condition is only checked if the outer condition is already <code className="font-mono">True</code>.
                  </p>
                  <p>
                    Notice the indentation levels: <strong>4 spaces</strong> for the outer block, and <strong>8 spaces</strong> for the inner block!
                  </p>
                  <div className="grid grid-cols-1 gap-6 pt-2 lg:grid-cols-2">
                    <CodeBlock
                      title="nested_if.py"
                      code={'age = 20\nhas_id = True\n\nif age >= 18:\n    if has_id == True:\n        print("Entry Allowed")\n    else:\n        print("Please show ID")\nelse:\n    print("Must be 18 or older")'}
                    />
                    <FlowchartSVG type="nested-if" activeNode="action1" activeBranch="inner-true" />
                  </div>
                </div>
              </section>

              {/* 4.6 Comparison Operators */}
              <section id="c-compare" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                {renderLessonHeader('c-compare', '4.6', 'Comparison Operators')}
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                  <p>
                    Comparison operators compare two values and return either <code className="font-mono font-semibold text-emerald-700">True</code> or <code className="font-mono font-semibold text-violet-700">False</code>.
                    Always remember: <strong className="text-[#1E293B]"><code className="font-mono">=</code> assigns a value</strong> (like <code className="font-mono">x = 5</code>), while <strong className="text-sky-700"><code className="font-mono">==</code> compares equality</strong> (like <code className="font-mono">x == 5</code>).
                  </p>

                  <div className="rounded-2xl border border-sky-100 bg-[#F0F9FF]/60 p-4">
                    <div className="mb-4 flex flex-wrap items-center gap-4">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        Value a:
                        <input
                          type="number"
                          value={cmpA}
                          onChange={(e) => setCmpA(Number(e.target.value))}
                          className="w-20 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-sm text-[#1E293B]"
                        />
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        Value b:
                        <input
                          type="number"
                          value={cmpB}
                          onChange={(e) => setCmpB(Number(e.target.value))}
                          className="w-20 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-sm text-[#1E293B]"
                        />
                      </label>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white px-4">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500">
                            <th className="py-2.5 pr-4 font-semibold">Operator</th>
                            <th className="py-2.5 pr-4 font-semibold">Meaning</th>
                            <th className="py-2.5 pr-4 font-semibold">Expression</th>
                            <th className="py-2.5 font-semibold">Live Result</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {[
                            { op: '==', desc: 'Equal to', res: cmpA === cmpB },
                            { op: '!=', desc: 'Not equal to', res: cmpA !== cmpB },
                            { op: '>', desc: 'Greater than', res: cmpA > cmpB },
                            { op: '<', desc: 'Less than', res: cmpA < cmpB },
                            { op: '>=', desc: 'Greater than or equal', res: cmpA >= cmpB },
                            { op: '<=', desc: 'Less than or equal', res: cmpA <= cmpB },
                          ].map((row) => (
                            <tr key={row.op}>
                              <td className="py-2.5 pr-4 font-bold text-sky-700">{row.op}</td>
                              <td className="py-2.5 pr-4 font-sans text-slate-700">{row.desc}</td>
                              <td className="py-2.5 pr-4 text-[#1E293B] tabular-nums">
                                {cmpA} {row.op} {cmpB}
                              </td>
                              <td className={`py-2.5 font-bold ${row.res ? 'text-emerald-700' : 'text-violet-700'}`}>
                                {row.res ? 'True' : 'False'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4.7 Logical Operators */}
              <section id="c-logical" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                {renderLessonHeader('c-logical', '4.7', 'Logical Operators (and, or, not)')}
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                  <p>
                    Combine or flip boolean conditions using <code className="font-mono font-semibold text-violet-700">and</code>,{' '}
                    <code className="font-mono font-semibold text-violet-700">or</code>, and <code className="font-mono font-semibold text-violet-700">not</code>.
                    Toggle <code className="font-mono">A</code> and <code className="font-mono">B</code> below to see the live truth table highlight:
                  </p>

                  <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-sky-100 bg-[#F0F9FF]/60 p-4">
                    <button
                      type="button"
                      onClick={() => setBoolA((v) => !v)}
                      className={`min-h-[40px] rounded-xl border px-4 py-1.5 font-mono text-xs font-semibold transition-colors ${
                        boolA
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : 'border-violet-300 bg-violet-50 text-violet-800'
                      }`}
                    >
                      A = {boolA ? 'True' : 'False'} (Toggle)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBoolB((v) => !v)}
                      className={`min-h-[40px] rounded-xl border px-4 py-1.5 font-mono text-xs font-semibold transition-colors ${
                        boolB
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : 'border-violet-300 bg-violet-50 text-violet-800'
                      }`}
                    >
                      B = {boolB ? 'True' : 'False'} (Toggle)
                    </button>
                    <div className="ml-auto flex flex-wrap gap-4 font-mono text-xs text-slate-700">
                      <span>
                        A and B:{' '}
                        <strong className={boolA && boolB ? 'text-emerald-700' : 'text-violet-700'}>
                          {boolA && boolB ? 'True' : 'False'}
                        </strong>
                      </span>
                      <span>
                        A or B:{' '}
                        <strong className={boolA || boolB ? 'text-emerald-700' : 'text-violet-700'}>
                          {boolA || boolB ? 'True' : 'False'}
                        </strong>
                      </span>
                      <span>
                        not A:{' '}
                        <strong className={!boolA ? 'text-emerald-700' : 'text-violet-700'}>
                          {!boolA ? 'True' : 'False'}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="py-2 pr-4">A</th>
                          <th className="py-2 pr-4">B</th>
                          <th className="py-2 pr-4">A and B (Both True)</th>
                          <th className="py-2 pr-4">A or B (At least one True)</th>
                          <th className="py-2">not A (Opposite)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          [true, true],
                          [true, false],
                          [false, true],
                          [false, false],
                        ].map(([a, b], idx) => {
                          const isActiveRow = a === boolA && b === boolB;
                          return (
                            <tr
                              key={idx}
                              className={isActiveRow ? 'bg-sky-50 font-bold' : ''}
                            >
                              <td className="py-2.5 pr-4 text-[#1E293B]">{a ? 'True' : 'False'}</td>
                              <td className="py-2.5 pr-4 text-[#1E293B]">{b ? 'True' : 'False'}</td>
                              <td className={`py-2.5 pr-4 ${a && b ? 'text-emerald-700' : 'text-violet-700'}`}>
                                {a && b ? 'True' : 'False'}
                              </td>
                              <td className={`py-2.5 pr-4 ${a || b ? 'text-emerald-700' : 'text-violet-700'}`}>
                                {a || b ? 'True' : 'False'}
                              </td>
                              <td className={`py-2.5 ${!a ? 'text-emerald-700' : 'text-violet-700'}`}>
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

              {/* 4.8 Real-world applications */}
              <section id="c-realworld" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                {renderLessonHeader('c-realworld', '4.8', 'Real-World Conditional Applications')}
                <p className="mb-5 text-sm text-slate-600">
                  Test all five beginner programs live by entering your own inputs below:
                </p>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-2.5">
                    <h4 className="font-display text-sm font-bold text-[#1E293B]">1. Marks &amp; Grade Checker</h4>
                    <label className="block text-xs font-medium text-slate-600">
                      Marks (0–100):
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={rwMarks}
                        onChange={(e) => setRwMarks(Number(e.target.value))}
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-sm text-[#1E293B]"
                      />
                    </label>
                    <p className="font-mono text-xs font-bold text-emerald-700">
                      Result:{' '}
                      {rwMarks >= 90
                        ? 'Grade A'
                        : rwMarks >= 75
                        ? 'Grade B'
                        : rwMarks >= 40
                        ? 'Pass'
                        : 'Fail'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-2.5">
                    <h4 className="font-display text-sm font-bold text-[#1E293B]">2. Age Eligibility Checker</h4>
                    <label className="block text-xs font-medium text-slate-600">
                      Age:
                      <input
                        type="number"
                        min={0}
                        max={120}
                        value={rwAge}
                        onChange={(e) => setRwAge(Number(e.target.value))}
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-sm text-[#1E293B]"
                      />
                    </label>
                    <p className="font-mono text-xs font-bold text-emerald-700">
                      Result: {rwAge >= 18 ? 'Eligible to vote & drive' : 'Not eligible yet (under 18)'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-2.5">
                    <h4 className="font-display text-sm font-bold text-[#1E293B]">3. Positive, Negative, or Zero</h4>
                    <label className="block text-xs font-medium text-slate-600">
                      Number:
                      <input
                        type="number"
                        value={rwSignNum}
                        onChange={(e) => setRwSignNum(Number(e.target.value))}
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-sm text-[#1E293B]"
                      />
                    </label>
                    <p className="font-mono text-xs font-bold text-emerald-700">
                      Result: {rwSignNum > 0 ? 'Positive (> 0)' : rwSignNum < 0 ? 'Negative (< 0)' : 'Zero (== 0)'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-2.5">
                    <h4 className="font-display text-sm font-bold text-[#1E293B]">4. Even &amp; Odd Checker</h4>
                    <label className="block text-xs font-medium text-slate-600">
                      Whole Number:
                      <input
                        type="number"
                        value={rwEvenNum}
                        onChange={(e) => setRwEvenNum(Math.trunc(Number(e.target.value)))}
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-sm text-[#1E293B]"
                      />
                    </label>
                    <p className="font-mono text-xs font-bold text-emerald-700">
                      {rwEvenNum} % 2 == {Math.abs(rwEvenNum % 2)} → {rwEvenNum % 2 === 0 ? 'Even' : 'Odd'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-2.5 md:col-span-2">
                    <h4 className="font-display text-sm font-bold text-[#1E293B]">5. Discount Eligibility Checker</h4>
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="text-xs font-medium text-slate-600">
                        Order Total ($):
                        <input
                          type="number"
                          min={0}
                          value={rwTotal}
                          onChange={(e) => setRwTotal(Number(e.target.value))}
                          className="ml-2 w-24 rounded-lg border border-slate-300 bg-white px-2.5 py-1 font-mono text-sm text-[#1E293B]"
                        />
                      </label>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rwMember}
                          onChange={(e) => setRwMember(e.target.checked)}
                          className="accent-sky-600"
                        />
                        Student Member (`is_member = True`)
                      </label>
                    </div>
                    <p className="font-mono text-xs font-bold text-emerald-700">
                      {rwTotal >= 100 || rwMember
                        ? `Discount Applied (20% off) → Final Price: $${(rwTotal * 0.8).toFixed(2)}`
                        : `Standard Price (Spend $100+ or be a member for 20% off) → $${rwTotal.toFixed(2)}`}
                    </p>
                  </div>
                </div>
              </section>

              {/* 4.9 Flowcharts */}
              <section id="c-flowchart" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                {renderLessonHeader('c-flowchart', '4.9', 'Interactive Conditional Flowcharts')}
                <p className="mb-4 text-sm text-slate-600">
                  Select a flowchart pattern and change the input value to watch the exact execution path highlight from Start to End:
                </p>

                <div className="mb-5 flex flex-wrap items-center gap-2.5">
                  {(['if', 'if-else', 'if-elif-else', 'nested-if'] as FlowchartType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFcType(t)}
                      className={`rounded-xl border px-3.5 py-1.5 font-mono text-xs font-semibold transition-all ${
                        fcType === t
                          ? 'border-transparent bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}

                  <label className="ml-auto flex items-center gap-2 text-xs font-semibold text-slate-700">
                    {fcType === 'if' || fcType === 'nested-if' ? 'age:' : 'marks:'}
                    <input
                      type="number"
                      value={fcValue}
                      onChange={(e) => setFcValue(Number(e.target.value))}
                      className="w-20 rounded-lg border border-slate-300 bg-white px-2.5 py-1 font-mono text-sm text-[#1E293B]"
                    />
                  </label>

                  {fcType === 'nested-if' && (
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fcHasId}
                        onChange={(e) => setFcHasId(e.target.checked)}
                        className="accent-sky-600"
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
            </>
          ) : (
            <>
              {/* 6.1 Introduction to Loops */}
              <section id="l-intro" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                {renderLessonHeader('l-intro', '6.1', 'Introduction to Loops')}
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                  <p>
                    <strong className="text-[#1E293B]">What is a loop?</strong> A loop is a programming instruction that repeats a block of code automatically until a task is finished or a condition becomes <code className="font-mono">False</code>. Each single pass through the loop is called an <strong className="text-violet-700">iteration</strong>.
                  </p>
                  <p>
                    <strong className="text-[#1E293B]">Manual repetition vs Loops:</strong> Imagine printing numbers 1 to 100. Writing 100 separate <code className="font-mono">print()</code> lines is slow and error-prone. A loop accomplishes the exact same task in 2 lines!
                  </p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <CodeBlock
                      title="manual_way.py (Tedious)"
                      code={'print(1)\nprint(2)\nprint(3)\nprint(4)\nprint(5)'}
                      compact
                    />
                    <CodeBlock
                      title="loop_way.py (Clean & Scalable)"
                      code={'for i in range(1, 6):\n    print(i)'}
                      compact
                    />
                  </div>
                </div>
              </section>

              {/* 6.2 for loop */}
              <section id="l-for" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                {renderLessonHeader('l-for', '6.2', 'The for Loop')}
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                  <p>
                    A <code className="font-mono font-semibold text-violet-700">for</code> loop iterates over every item in a sequence (such as numbers from <code className="font-mono">range()</code>, characters in a string, or items in a list). On each pass, Python assigns the next item to the <strong className="text-[#1E293B]">loop variable</strong> (<code className="font-mono">i</code>).
                  </p>
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                      <CodeBlock
                        title="for_loop.py"
                        code={'for i in range(1, 6):\n    print(i)'}
                      />
                      <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4 text-xs space-y-1.5 text-slate-700">
                        <p className="font-bold text-[#1E293B]">Line-by-Line &amp; Output</p>
                        <p><span className="font-mono font-semibold text-violet-700">Line 1:</span> <code className="font-mono">range(1, 6)</code> produces <code className="font-mono">1, 2, 3, 4, 5</code>. Each value enters <code className="font-mono">i</code> one by one.</p>
                        <p><span className="font-mono font-semibold text-violet-700">Line 2:</span> Indented <code className="font-mono">print(i)</code> runs 5 times, outputting:</p>
                        <pre className="mt-1 rounded-xl bg-[#0F172A] p-2.5 font-mono text-emerald-300">1{'\n'}2{'\n'}3{'\n'}4{'\n'}5</pre>
                      </div>
                    </div>
                    <FlowchartSVG type="for" activeNode="body" activeBranch="loop-true" />
                  </div>
                </div>
              </section>

              {/* 6.3 range() function */}
              <section id="l-range" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                {renderLessonHeader('l-range', '6.3', 'The range() Function')}
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                  <p>
                    <code className="font-mono font-semibold text-sky-700">range()</code> generates a sequence of integers. One golden rule in Python: <strong className="text-[#1E293B]">the <code className="font-mono">stop</code> value is always excluded</strong> (Python stops right before reaching it).
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-xs sm:text-sm">
                    <li><code className="font-mono font-semibold text-sky-700">range(stop)</code> — starts at <code className="font-mono">0</code>, increments by <code className="font-mono">1</code>, stops before <code className="font-mono">stop</code>.</li>
                    <li><code className="font-mono font-semibold text-sky-700">range(start, stop)</code> — starts at <code className="font-mono">start</code>, stops before <code className="font-mono">stop</code>.</li>
                    <li><code className="font-mono font-semibold text-sky-700">range(start, stop, step)</code> — changes by <code className="font-mono">step</code> each time (use negative step to count backwards!).</li>
                  </ul>

                  <div className="rounded-2xl border border-violet-100 bg-[#F0F9FF]/60 p-4 space-y-4">
                    <p className="font-display text-xs font-bold uppercase tracking-wider text-violet-700">
                      Interactive range() Builder
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <label className="text-xs font-medium text-slate-600">
                        start:
                        <input
                          type="number"
                          value={rangeStart}
                          onChange={(e) => setRangeStart(Number(e.target.value))}
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-sm text-[#1E293B]"
                        />
                      </label>
                      <label className="text-xs font-medium text-slate-600">
                        stop (excluded):
                        <input
                          type="number"
                          value={rangeStop}
                          onChange={(e) => setRangeStop(Number(e.target.value))}
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-sm text-[#1E293B]"
                        />
                      </label>
                      <label className="text-xs font-medium text-slate-600">
                        step:
                        <input
                          type="number"
                          value={rangeStep}
                          onChange={(e) => setRangeStep(Number(e.target.value))}
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-sm text-[#1E293B]"
                        />
                      </label>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-medium text-slate-700">
                        range({rangeStart}, {rangeStop}, {rangeStep}) →
                      </span>
                      {rangePreview.warning ? (
                        <span className="font-medium text-amber-700">{rangePreview.warning}</span>
                      ) : (
                        rangePreview.values.map((val, idx) => (
                          <span
                            key={`${val}-${idx}`}
                            className="inline-flex h-8 min-w-[34px] items-center justify-center rounded-lg border border-violet-200 bg-white px-2 font-mono font-bold text-violet-700 shadow-xs tabular-nums"
                          >
                            {val}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* 6.4 while loop */}
              <section id="l-while" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                {renderLessonHeader('l-while', '6.4', 'The while Loop')}
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                  <p>
                    A <code className="font-mono font-semibold text-violet-700">while</code> loop keeps repeating <strong>as long as its condition remains True</strong>. Before every pass, Python checks the condition. When it finally becomes <code className="font-mono">False</code>, the loop stops.
                  </p>
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                      <CodeBlock
                        title="while_loop.py"
                        code={'count = 1\n\nwhile count <= 5:\n    print(count)\n    count += 1'}
                      />
                      <div className="rounded-2xl border border-sky-100 bg-[#F0F9FF]/70 p-4 text-xs space-y-1.5 text-slate-700">
                        <p><span className="font-mono font-semibold text-sky-700">Line 1:</span> Initialize <code className="font-mono">count = 1</code> before the loop starts.</p>
                        <p><span className="font-mono font-semibold text-sky-700">Line 3:</span> Condition <code className="font-mono">count &lt;= 5</code> is checked before each pass.</p>
                        <p><span className="font-mono font-semibold text-sky-700">Line 4:</span> Prints current value of <code className="font-mono">count</code>.</p>
                        <p><span className="font-mono font-semibold text-sky-700">Line 5:</span> <code className="font-mono">count += 1</code> updates the variable so the loop eventually stops when <code className="font-mono">count</code> reaches 6.</p>
                      </div>
                    </div>
                    <FlowchartSVG type="while" activeNode="check" activeBranch="loop-back" />
                  </div>
                </div>
              </section>

              {/* 6.5 for vs while comparison */}
              <section id="l-compare" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                {renderLessonHeader('l-compare', '6.5', 'for Loop vs while Loop')}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-2.5 pr-4 font-semibold">Feature</th>
                        <th className="py-2.5 pr-4 font-bold text-sky-700">for Loop</th>
                        <th className="py-2.5 font-bold text-violet-700">while Loop</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/70 text-slate-700">
                      <tr>
                        <td className="py-3 pr-4 font-semibold text-[#1E293B]">How it works</td>
                        <td className="py-3 pr-4">Takes items one-by-one from a sequence like <code className="font-mono">range()</code>.</td>
                        <td className="py-3">Checks a boolean condition before each pass and repeats while <code className="font-mono">True</code>.</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4 font-semibold text-[#1E293B]">Best used when</td>
                        <td className="py-3 pr-4">You know the exact count or sequence beforehand.</td>
                        <td className="py-3">You want to repeat until a changing condition becomes <code className="font-mono">False</code>.</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4 font-semibold text-[#1E293B]">Common example</td>
                        <td className="py-3 pr-4 font-mono text-xs text-sky-800">for i in range(1, 11):</td>
                        <td className="py-3 font-mono text-xs text-violet-800">while balance &gt; 0:</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4 font-semibold text-[#1E293B]">Key difference</td>
                        <td className="py-3 pr-4">Loop variable updates automatically every iteration.</td>
                        <td className="py-3">You must update the condition variable manually inside the body.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 6.6 break statement */}
              <section id="l-break" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                {renderLessonHeader('l-break', '6.6', 'The break Statement')}
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                  <p>
                    <code className="font-mono font-semibold text-violet-700">break</code> immediately terminates the nearest enclosing loop and jumps to the first line after the loop. It is commonly used when searching for an item and stopping as soon as you find it.
                  </p>
                  <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-[#1E293B]">
                        Interactive <code className="font-mono text-violet-700">break</code> Demo (1 to 6):
                      </span>
                      <label className="text-xs font-medium text-slate-700">
                        Break when <code className="font-mono">i ==</code>
                        <select
                          value={breakAt}
                          onChange={(e) => setBreakAt(Number(e.target.value))}
                          className="ml-2 rounded-lg border border-slate-300 bg-white px-2.5 py-1 font-mono text-[#1E293B]"
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
                                ? 'border-violet-300 bg-violet-100 text-violet-900 font-bold'
                                : isAfter
                                ? 'border-slate-200 bg-slate-100 text-slate-400 line-through'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold'
                            }`}
                          >
                            {n}
                            <div className="mt-0.5 text-[10px]">
                              {isBreak ? 'BREAK' : isAfter ? 'Never' : 'Printed'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <FlowchartSVG type="break-continue" activeBranch="break" labels={{ cond1: `if i == ${breakAt}:` }} />
                </div>
              </section>

              {/* 6.7 continue statement */}
              <section id="l-continue" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                {renderLessonHeader('l-continue', '6.7', 'The continue Statement')}
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                  <p>
                    <code className="font-mono font-semibold text-sky-700">continue</code> does <strong>not</strong> stop the loop. Instead, it skips the rest of the code in the <em>current</em> iteration and jumps straight to the next iteration.
                  </p>
                  <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-[#1E293B]">
                        Interactive <code className="font-mono text-sky-700">continue</code> Demo (1 to 6):
                      </span>
                      <label className="text-xs font-medium text-slate-700">
                        Skip when <code className="font-mono">i ==</code>
                        <select
                          value={skipAt}
                          onChange={(e) => setSkipAt(Number(e.target.value))}
                          className="ml-2 rounded-lg border border-slate-300 bg-white px-2.5 py-1 font-mono text-[#1E293B]"
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
                                ? 'border-sky-300 bg-sky-100 text-sky-900 font-bold'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold'
                            }`}
                          >
                            {n}
                            <div className="mt-0.5 text-[10px]">{isSkip ? 'SKIPPED' : 'Printed'}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>

              {/* 6.8 Nested loops */}
              <section id="l-nested" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                {renderLessonHeader('l-nested', '6.8', 'Nested Loops')}
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                  <p>
                    A nested loop puts one loop inside another. For <strong>each single step</strong> of the <strong className="text-sky-700">outer loop</strong>, the <strong className="text-violet-700">inner loop</strong> completes all of its iterations. Total inner runs = <code className="font-mono">outer_count × inner_count</code>.
                  </p>
                  <div className="rounded-2xl border border-sky-100 bg-[#F0F9FF]/60 p-4 space-y-4">
                    <div className="flex flex-wrap items-center gap-6">
                      <label className="text-xs font-medium text-slate-700">
                        Outer Rows: <strong className="font-mono text-sky-700">{nestRows}</strong>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={nestRows}
                          onChange={(e) => setNestRows(Number(e.target.value))}
                          className="ml-2 accent-sky-500 cursor-pointer"
                        />
                      </label>
                      <label className="text-xs font-medium text-slate-700">
                        Inner Columns: <strong className="font-mono text-violet-700">{nestCols}</strong>
                        <input
                          type="range"
                          min={1}
                          max={6}
                          value={nestCols}
                          onChange={(e) => setNestCols(Number(e.target.value))}
                          className="ml-2 accent-violet-500 cursor-pointer"
                        />
                      </label>
                      <span className="ml-auto font-mono text-xs font-bold text-emerald-700 tabular-nums">
                        Total cells: {nestRows} × {nestCols} = {nestRows * nestCols}
                      </span>
                    </div>

                    <div className="space-y-1.5 font-mono text-xs">
                      {Array.from({ length: nestRows }, (_, r) => (
                        <div key={r} className="flex items-center gap-2">
                          <span className="w-16 text-slate-500">row {r + 1}:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {Array.from({ length: nestCols }, (_, c) => (
                              <span
                                key={c}
                                className="rounded-lg border border-sky-200 bg-white px-2.5 py-1 font-semibold text-sky-800 shadow-xs tabular-nums"
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

              {/* 6.9 Common mistakes */}
              <section id="l-mistakes" className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                {renderLessonHeader('l-mistakes', '6.9', 'Common Loop Mistakes & Fixes')}
                <div className="space-y-5 text-sm text-slate-700">
                  {[
                    {
                      title: '1. Forgetting to update a while-loop variable (Infinite Loop)',
                      bad: 'i = 1\nwhile i <= 5:\n    print(i)\n# i never changes!',
                      good: 'i = 1\nwhile i <= 5:\n    print(i)\n    i += 1',
                      why: 'Without i += 1, i stays 1 forever and i <= 5 never becomes False.',
                    },
                    {
                      title: '2. Wrong range() stop boundary (Off-by-One)',
                      bad: '# Goal: print 1 to 5\nfor i in range(1, 5):\n    print(i)  # Stops at 4!',
                      good: '# Goal: print 1 to 5\nfor i in range(1, 6):\n    print(i)',
                      why: 'range(start, stop) excludes stop. Always pass 6 if you want to include 5.',
                    },
                    {
                      title: '3. Incorrect Indentation',
                      bad: 'for i in range(3):\nprint(i)  # IndentationError',
                      good: 'for i in range(3):\n    print(i)',
                      why: 'Statements inside a loop body must be indented by 4 spaces under the loop header.',
                    },
                    {
                      title: '4. Confusing break and continue',
                      bad: '# Wanted to skip 3, accidentally stopped!\nfor i in range(1, 6):\n    if i == 3:\n        break\n    print(i)',
                      good: '# Correctly skips only 3\nfor i in range(1, 6):\n    if i == 3:\n        continue\n    print(i)',
                      why: 'break exits the whole loop at 3 (stops at 2). continue skips only 3 and prints 1, 2, 4, 5.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-3">
                      <div className="flex items-center gap-2 font-display text-sm font-bold text-amber-800">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
                        {item.title}
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <CodeBlock title="Broken Code" code={item.bad} compact showCopy={false} />
                        <CodeBlock title="Corrected Code" code={item.good} compact showCopy={false} />
                      </div>
                      <p className="text-xs text-slate-600">{item.why}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
