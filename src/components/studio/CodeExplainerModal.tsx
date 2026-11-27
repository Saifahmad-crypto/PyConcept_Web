import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  ListOrdered,
  Eye,
  Cpu,
  Layers,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import {
  analyzePythonCodeStepByStep,
  fetchAiLineByLineExplanation,
  CodeLineStep,
  ExplainerSummary,
} from '../../utils/codeExplainer';

interface CodeExplainerModalProps {
  code: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenTutorWithCode?: (code: string) => void;
}

export const CodeExplainerModal: React.FC<CodeExplainerModalProps> = ({
  code,
  isOpen,
  onClose,
  onOpenTutorWithCode,
}) => {
  const [viewMode, setViewMode] = useState<'stepper' | 'overview'>('stepper');
  const [analysis, setAnalysis] = useState<ExplainerSummary>(() =>
    analyzePythonCodeStepByStep(code)
  );
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiEnhanced, setAiEnhanced] = useState<boolean>(false);

  const autoPlayTimerRef = useRef<number | null>(null);
  const codeListRef = useRef<HTMLDivElement | null>(null);

  // Re-analyze when code changes or modal opens
  useEffect(() => {
    if (isOpen) {
      const parsed = analyzePythonCodeStepByStep(code);
      setAnalysis(parsed);

      // Find first executable line
      const firstExecIdx = parsed.steps.findIndex((s) => s.isExecutable);
      setActiveStepIdx(firstExecIdx !== -1 ? firstExecIdx : 0);
      setIsPlaying(false);
      setAiEnhanced(false);
    }
  }, [code, isOpen]);

  // Auto-play stepper
  useEffect(() => {
    if (isPlaying) {
      autoPlayTimerRef.current = window.setInterval(() => {
        setActiveStepIdx((prev) => {
          // Find next step
          let next = prev + 1;
          while (next < analysis.steps.length && !analysis.steps[next].isExecutable) {
            next++;
          }
          if (next >= analysis.steps.length) {
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
      }, 2400);
    } else if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, analysis.steps]);

  // Scroll active line into view in stepper mode
  useEffect(() => {
    if (viewMode === 'stepper' && codeListRef.current) {
      const activeEl = document.getElementById(`explainer-line-${activeStepIdx}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeStepIdx, viewMode]);

  if (!isOpen) return null;

  const currentStep: CodeLineStep | undefined = analysis.steps[activeStepIdx];
  const executableSteps = analysis.steps.filter((s) => s.isExecutable);
  const currentExecNumber =
    analysis.steps.slice(0, activeStepIdx + 1).filter((s) => s.isExecutable).length || 1;

  const handleNext = () => {
    let next = activeStepIdx + 1;
    while (next < analysis.steps.length && !analysis.steps[next].isExecutable) {
      next++;
    }
    if (next < analysis.steps.length) {
      setActiveStepIdx(next);
    }
  };

  const handlePrev = () => {
    let prev = activeStepIdx - 1;
    while (prev >= 0 && !analysis.steps[prev].isExecutable) {
      prev--;
    }
    if (prev >= 0) {
      setActiveStepIdx(prev);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    const firstExecIdx = analysis.steps.findIndex((s) => s.isExecutable);
    setActiveStepIdx(firstExecIdx !== -1 ? firstExecIdx : 0);
  };

  const handleFetchAi = async () => {
    setAiLoading(true);
    try {
      const aiResults = await fetchAiLineByLineExplanation({ code });
      if (aiResults.length > 0) {
        setAnalysis((prev) => {
          const map = new Map(aiResults.map((r) => [r.lineNumber, r]));
          const nextSteps = prev.steps.map((s) => {
            const aiItem = map.get(s.lineNumber);
            if (aiItem) {
              return {
                ...s,
                title: aiItem.title || s.title,
                explanation: aiItem.explanation || s.explanation,
              };
            }
            return s;
          });
          return { ...prev, steps: nextSteps };
        });
        setAiEnhanced(true);
      }
    } catch {
      // Keep deterministic explanations
    } finally {
      setAiLoading(false);
    }
  };

  const getCategoryBadge = (cat: CodeLineStep['category']) => {
    switch (cat) {
      case 'variable':
        return { label: 'Variable Assignment', color: 'bg-blue-950/60 text-blue-400 border-blue-800' };
      case 'condition':
        return { label: 'Decision Check', color: 'bg-amber-950/60 text-amber-400 border-amber-800' };
      case 'loop':
        return { label: 'Loop Iteration', color: 'bg-purple-950/60 text-purple-400 border-purple-800' };
      case 'print':
        return { label: 'Console Output', color: 'bg-emerald-950/60 text-emerald-400 border-emerald-800' };
      case 'input':
        return { label: 'Keyboard Input', color: 'bg-cyan-950/60 text-cyan-400 border-cyan-800' };
      case 'flow':
        return { label: 'Flow Control', color: 'bg-rose-950/60 text-rose-400 border-rose-800' };
      case 'comment':
        return { label: 'Comment', color: 'bg-neutral-900 text-neutral-400 border-neutral-700' };
      default:
        return { label: 'Statement', color: 'bg-neutral-900 text-neutral-300 border-neutral-700' };
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-5xl rounded-2xl border border-[#3A1D1D] bg-[#100303] text-[#FBF5F9] shadow-2xl p-5 sm:p-7 space-y-5 my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2C1616] pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E10906]/60 bg-[#1E0505] text-[#E10906]">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-white">
                  AI Step-by-Step Code Explainer
                </h2>
                {aiEnhanced ? (
                  <span className="rounded-full bg-emerald-950/80 border border-emerald-700 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    Gemini AI Active
                  </span>
                ) : (
                  <span className="rounded-full bg-[#E10906]/20 border border-[#E10906]/50 px-2 py-0.5 text-[10px] font-semibold text-[#E10906]">
                    Educational AST Engine
                  </span>
                )}
              </div>
              <p className="font-mono text-xs text-[#8A8585]">
                {analysis.executableLines} executable steps · {analysis.totalLines} lines total
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-xl border border-[#3A1D1D] bg-[#190909] p-1 gap-1">
              <button
                type="button"
                onClick={() => setViewMode('stepper')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  viewMode === 'stepper'
                    ? 'bg-[#E10906] text-white shadow-xs'
                    : 'text-[#8A8585] hover:text-white'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Interactive Stepper
              </button>
              <button
                type="button"
                onClick={() => setViewMode('overview')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  viewMode === 'overview'
                    ? 'bg-[#E10906] text-white shadow-xs'
                    : 'text-[#8A8585] hover:text-white'
                }`}
              >
                <ListOrdered className="h-3.5 w-3.5" />
                All Lines
              </button>
            </div>

            <button
              type="button"
              onClick={handleFetchAi}
              disabled={aiLoading}
              title="Enhance line-by-line explanation with Gemini AI"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#3A1D1D] bg-[#190909] px-3 py-1.5 text-xs font-semibold text-[#D1C7C7] hover:border-[#E10906] hover:text-white transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#E10906]" />
              <span className="hidden sm:inline">{aiLoading ? 'Analyzing...' : 'Ask AI'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-2 text-[#8A8585] hover:text-white hover:bg-[#190909] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mode 1: Interactive Stepper */}
        {viewMode === 'stepper' && currentStep && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 overflow-hidden">
            {/* Left Column: Synchronized Code View */}
            <div className="lg:col-span-6 flex flex-col rounded-xl border border-[#3A1D1D] bg-[#090101] overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#2C1616] bg-[#120404] px-4 py-2 text-xs">
                <span className="font-mono text-[#D1C7C7]">Python Code</span>
                <span className="font-mono text-[#8A8585] text-[11px]">
                  Line {currentStep.lineNumber} of {analysis.totalLines}
                </span>
              </div>

              <div
                ref={codeListRef}
                className="p-3 font-mono text-xs leading-6 overflow-y-auto flex-1 space-y-1"
              >
                {analysis.steps.map((step, idx) => {
                  const isActive = idx === activeStepIdx;
                  return (
                    <div
                      key={step.lineNumber}
                      id={`explainer-line-${idx}`}
                      onClick={() => {
                        if (step.isExecutable) setActiveStepIdx(idx);
                      }}
                      className={`flex items-start gap-2.5 rounded-lg px-2.5 py-1 transition-all ${
                        step.isExecutable ? 'cursor-pointer' : 'cursor-default opacity-60'
                      } ${
                        isActive
                          ? 'bg-[#E10906]/20 border border-[#E10906] text-white shadow-sm ring-1 ring-[#E10906]/40'
                          : 'hover:bg-[#190909] text-[#D1C7C7]'
                      }`}
                    >
                      <span
                        className={`w-6 text-right shrink-0 select-none tabular-nums font-semibold ${
                          isActive ? 'text-[#E10906]' : 'text-[#8A8585]'
                        }`}
                      >
                        {step.lineNumber}
                      </span>

                      <span className="flex-1 whitespace-pre-wrap break-words">
                        {step.rawText || '\u00A0'}
                      </span>

                      {isActive && (
                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-[#E10906] bg-[#E10906]/20 px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Step Explanation & Variable State */}
            <div className="lg:col-span-6 flex flex-col space-y-4 overflow-y-auto pr-1">
              {/* Stepper Controls Bar */}
              <div className="flex items-center justify-between rounded-xl border border-[#3A1D1D] bg-[#140606] p-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-white tabular-nums">
                    Step {currentExecNumber} of {executableSteps.length}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleReset}
                    title="Reset to beginning"
                    className="p-1.5 text-[#8A8585] hover:text-white rounded-lg hover:bg-[#1E0505] transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    title={isPlaying ? 'Pause Auto-Step' : 'Auto-Play Steps'}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                      isPlaying
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-[#190909] text-white border border-[#3A1D1D] hover:bg-[#250d0d]'
                    }`}
                  >
                    {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    <span>{isPlaying ? 'Pause' : 'Auto-Step'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={activeStepIdx <= 0}
                    onClick={handlePrev}
                    title="Previous Line"
                    className="p-1.5 text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-[#1E0505] transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    disabled={activeStepIdx >= analysis.steps.length - 1}
                    onClick={handleNext}
                    title="Next Line"
                    className="p-1.5 text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg bg-[#E10906] hover:bg-[#C40705] transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Active Step Explanation Card */}
              <div className="rounded-xl border border-[#3A1D1D] bg-[#140606] p-4 space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-[#2C1616] pb-2.5">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                      getCategoryBadge(currentStep.category).color
                    }`}
                  >
                    {getCategoryBadge(currentStep.category).label}
                  </span>
                  <span className="font-mono text-xs text-[#8A8585]">
                    Line {currentStep.lineNumber}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display text-base font-bold text-white">
                    {currentStep.title}
                  </h3>
                  <p className="text-xs text-[#D1C7C7] leading-relaxed">
                    {currentStep.explanation}
                  </p>
                </div>

                {currentStep.proTip && (
                  <div className="rounded-lg border border-amber-900/60 bg-amber-950/30 p-2.5 text-xs text-amber-200 flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Pro Tip:</strong> {currentStep.proTip}
                    </span>
                  </div>
                )}
              </div>

              {/* Memory / Simulated Variables Inspector */}
              <div className="rounded-xl border border-[#3A1D1D] bg-[#140606] p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span className="flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-[#E10906]" />
                    Variables in Memory at Line {currentStep.lineNumber}
                  </span>
                  <span className="font-mono text-[11px] text-[#8A8585]">
                    {Object.keys(currentStep.mockVariablesState).length} tracked
                  </span>
                </div>

                {Object.keys(currentStep.mockVariablesState).length === 0 ? (
                  <p className="text-xs text-[#8A8585] italic p-2 bg-[#090101] rounded-lg border border-[#230b0b]">
                    No variables created yet. Variables will appear here as assignment lines execute.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(currentStep.mockVariablesState).map(([varName, val]) => (
                      <div
                        key={varName}
                        className="rounded-lg border border-[#2C1616] bg-[#090101] p-2 text-xs flex items-center justify-between gap-2"
                      >
                        <span className="font-mono font-bold text-[#FF6B6B] truncate">
                          {varName}
                        </span>
                        <span className="font-mono text-emerald-400 truncate text-[11px]">
                          = {val}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ask AI Tutor CTA */}
              {onOpenTutorWithCode && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTutorWithCode(code);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#3A1D1D] bg-[#190909] p-3 text-xs font-semibold text-white hover:border-[#E10906] transition-colors"
                >
                  <Cpu className="h-4 w-4 text-[#E10906]" />
                  <span>Ask AI Tutor to Explain Further in Chat</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#8A8585]" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mode 2: All Lines Unified Overview */}
        {viewMode === 'overview' && (
          <div className="space-y-3 overflow-y-auto pr-1 flex-1">
            {analysis.steps.map((step) => {
              const badge = getCategoryBadge(step.category);
              return (
                <div
                  key={step.lineNumber}
                  className={`rounded-xl border p-3.5 space-y-2 transition-colors ${
                    step.isExecutable
                      ? 'border-[#2C1616] bg-[#140606] hover:border-[#3A1D1D]'
                      : 'border-transparent bg-[#0e0303] opacity-60'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#E10906] bg-[#E10906]/15 px-2 py-0.5 rounded">
                        Line {step.lineNumber}
                      </span>
                      <span className={`rounded-full border px-2 py-0.2 text-[10px] font-semibold ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    <code className="font-mono text-xs text-[#FBF5F9] bg-[#090101] px-2.5 py-1 rounded-md border border-[#2C1616]">
                      {step.rawText || '(blank)'}
                    </code>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-display text-sm font-bold text-white">
                      {step.title}
                    </h4>
                    <p className="text-xs text-[#D1C7C7] leading-relaxed">
                      {step.explanation}
                    </p>
                  </div>

                  {step.proTip && (
                    <p className="text-[11px] text-amber-300 font-mono">
                      💡 {step.proTip}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
