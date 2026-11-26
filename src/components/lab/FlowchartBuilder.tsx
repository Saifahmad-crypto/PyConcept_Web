import React, { useState, useMemo, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Code2,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from 'lucide-react';

export type BlockKind = 'start' | 'end' | 'process' | 'io' | 'decision';

export interface FlowBlock {
  id: string;
  kind: BlockKind;
  label: string;
  // Next connections: for non-decision use nextId; for decision use trueId / falseId
  nextId?: string | null;
  trueId?: string | null;
  falseId?: string | null;
}

interface FlowTemplate {
  id: string;
  name: string;
  blocks: FlowBlock[];
}

const FLOW_TEMPLATES: FlowTemplate[] = [
  {
    id: 'simple-if',
    name: 'Simple if',
    blocks: [
      { id: 'n1', kind: 'start', label: 'Start (age = 20)', nextId: 'n2' },
      { id: 'n2', kind: 'decision', label: 'age >= 18?', trueId: 'n3', falseId: 'n4' },
      { id: 'n3', kind: 'io', label: 'print("Eligible")', nextId: 'n4' },
      { id: 'n4', kind: 'end', label: 'End' },
    ],
  },
  {
    id: 'if-else',
    name: 'if-else',
    blocks: [
      { id: 'n1', kind: 'start', label: 'Start (marks = 65)', nextId: 'n2' },
      { id: 'n2', kind: 'decision', label: 'marks >= 40?', trueId: 'n3', falseId: 'n4' },
      { id: 'n3', kind: 'io', label: 'print("Pass")', nextId: 'n5' },
      { id: 'n4', kind: 'io', label: 'print("Fail")', nextId: 'n5' },
      { id: 'n5', kind: 'end', label: 'End' },
    ],
  },
  {
    id: 'if-elif-else',
    name: 'if-elif-else',
    blocks: [
      { id: 'n1', kind: 'start', label: 'Start (score = 82)', nextId: 'n2' },
      { id: 'n2', kind: 'decision', label: 'score >= 90?', trueId: 'n3', falseId: 'n4' },
      { id: 'n3', kind: 'io', label: 'print("Grade A")', nextId: 'n7' },
      { id: 'n4', kind: 'decision', label: 'score >= 75?', trueId: 'n5', falseId: 'n6' },
      { id: 'n5', kind: 'io', label: 'print("Grade B")', nextId: 'n7' },
      { id: 'n6', kind: 'io', label: 'print("Keep Going")', nextId: 'n7' },
      { id: 'n7', kind: 'end', label: 'End' },
    ],
  },
  {
    id: 'nested-if',
    name: 'Nested if',
    blocks: [
      { id: 'n1', kind: 'start', label: 'Start (age=20, id=True)', nextId: 'n2' },
      { id: 'n2', kind: 'decision', label: 'age >= 18?', trueId: 'n3', falseId: 'n5' },
      { id: 'n3', kind: 'decision', label: 'has_id == True?', trueId: 'n4', falseId: 'n5' },
      { id: 'n4', kind: 'io', label: 'print("Access Granted")', nextId: 'n6' },
      { id: 'n5', kind: 'io', label: 'print("Access Denied")', nextId: 'n6' },
      { id: 'n6', kind: 'end', label: 'End' },
    ],
  },
  {
    id: 'for-loop',
    name: 'for loop',
    blocks: [
      { id: 'n1', kind: 'start', label: 'Start', nextId: 'n2' },
      { id: 'n2', kind: 'process', label: 'i = 1', nextId: 'n3' },
      { id: 'n3', kind: 'decision', label: 'i <= 3?', trueId: 'n4', falseId: 'n6' },
      { id: 'n4', kind: 'io', label: 'print("Step", i)', nextId: 'n5' },
      { id: 'n5', kind: 'process', label: 'i += 1', nextId: 'n3' },
      { id: 'n6', kind: 'end', label: 'End' },
    ],
  },
  {
    id: 'while-loop',
    name: 'while loop',
    blocks: [
      { id: 'n1', kind: 'start', label: 'Start', nextId: 'n2' },
      { id: 'n2', kind: 'process', label: 'count = 3', nextId: 'n3' },
      { id: 'n3', kind: 'decision', label: 'count > 0?', trueId: 'n4', falseId: 'n6' },
      { id: 'n4', kind: 'io', label: 'print(count)', nextId: 'n5' },
      { id: 'n5', kind: 'process', label: 'count -= 1', nextId: 'n3' },
      { id: 'n6', kind: 'end', label: 'End' },
    ],
  },
];

const REVERSE_CHALLENGES = [
  {
    id: 'rev-if-else',
    title: 'Reverse Challenge 1: Build Flowchart for Pass/Fail',
    code: `marks = 55\nif marks >= 40:\n    print("Pass")\nelse:\n    print("Fail")`,
    requiredKinds: ['start', 'decision', 'io', 'end'] as BlockKind[],
    minIo: 2,
  },
  {
    id: 'rev-while',
    title: 'Reverse Challenge 2: Build Flowchart for Countdown Loop',
    code: `n = 2\nwhile n > 0:\n    print(n)\n    n -= 1`,
    requiredKinds: ['start', 'process', 'decision', 'io', 'end'] as BlockKind[],
    minIo: 1,
  },
];

export const FlowchartBuilder: React.FC<{
  onOpenInStudio?: (code: string) => void;
}> = ({ onOpenInStudio }) => {
  const [blocks, setBlocks] = useState<FlowBlock[]>(FLOW_TEMPLATES[1].blocks);
  const [selectedId, setSelectedId] = useState<string>('n2');
  const [decisionChoices, setDecisionChoices] = useState<Record<string, boolean>>({
    n2: true,
    n3: true,
    n4: true,
  });
  const [activeExecId, setActiveExecId] = useState<string | null>(null);
  const [execHistory, setExecHistory] = useState<string[]>([]);
  const [isStepping, setIsStepping] = useState(false);
  const [reverseMode, setReverseMode] = useState(false);
  const [reverseIdx, setReverseIdx] = useState(0);

  const selectedBlock = blocks.find((b) => b.id === selectedId) ?? blocks[0] ?? null;

  // Validate connections cleanly
  const validationIssues = useMemo(() => {
    const issues: string[] = [];
    const startNodes = blocks.filter((b) => b.kind === 'start');
    const endNodes = blocks.filter((b) => b.kind === 'end');
    const ids = new Set(blocks.map((b) => b.id));

    if (startNodes.length !== 1) issues.push('Flowchart needs exactly 1 Start block.');
    if (endNodes.length < 1) issues.push('Add at least 1 End block to terminate.');

    blocks.forEach((b) => {
      if (b.kind === 'decision') {
        if (!b.trueId || !ids.has(b.trueId)) {
          issues.push(`Decision "${b.label}" is missing a valid True branch.`);
        }
        if (!b.falseId || !ids.has(b.falseId)) {
          issues.push(`Decision "${b.label}" is missing a valid False branch.`);
        }
      } else if (b.kind !== 'end') {
        if (!b.nextId || !ids.has(b.nextId)) {
          issues.push(`Block "${b.label}" has no outgoing connection.`);
        }
      }
    });
    return issues;
  }, [blocks]);

  // Generate clean Python code from connected blocks
  const generatedPython = useMemo(() => {
    if (blocks.length === 0) return '# Empty flowchart';
    const map = new Map(blocks.map((b) => [b.id, b]));
    const start = blocks.find((b) => b.kind === 'start');
    if (!start) return '# Add a Start block to generate Python';

    const lines: string[] = ['# Generated from Flowchart Builder'];
    const visited = new Set<string>();

    const walk = (id: string | null | undefined, indent: number) => {
      if (!id || visited.has(id)) return;
      const node = map.get(id);
      if (!node || node.kind === 'end') return;
      visited.add(id);
      const pad = '    '.repeat(indent);

      if (node.kind === 'start') {
        const match = node.label.match(/\(([^)]+)\)/);
        if (match) {
          match[1]
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .forEach((assign) => lines.push(`${pad}${assign}`));
        }
        walk(node.nextId, indent);
      } else if (node.kind === 'process' || node.kind === 'io') {
        lines.push(`${pad}${node.label}`);
        walk(node.nextId, indent);
      } else if (node.kind === 'decision') {
        const cond = node.label.replace(/\?$/, '').trim();
        // Detect back-edge (loop) cleanly
        const trueNode = node.trueId ? map.get(node.trueId) : undefined;
        const loopsBack =
          trueNode &&
          (trueNode.nextId === node.id ||
            (trueNode.nextId && map.get(trueNode.nextId)?.nextId === node.id));
        if (loopsBack) {
          lines.push(`${pad}while ${cond}:`);
          walk(node.trueId, indent + 1);
          walk(node.falseId, indent);
        } else {
          lines.push(`${pad}if ${cond}:`);
          if (node.trueId && map.get(node.trueId)?.kind !== 'end') {
            walk(node.trueId, indent + 1);
          } else {
            lines.push(`${pad}    pass`);
          }
          if (node.falseId && map.get(node.falseId)?.kind !== 'end') {
            lines.push(`${pad}else:`);
            walk(node.falseId, indent + 1);
          }
        }
      }
    };

    walk(start.id, 0);
    return lines.join('\n');
  }, [blocks]);

  const stepFlowchart = () => {
    const map = new Map(blocks.map((b) => [b.id, b]));
    if (!activeExecId) {
      const start = blocks.find((b) => b.kind === 'start');
      if (!start) return;
      setActiveExecId(start.id);
      setExecHistory([start.label]);
      return;
    }

    const cur = map.get(activeExecId);
    if (!cur || cur.kind === 'end') {
      setIsStepping(false);
      return;
    }

    let nextId: string | null | undefined = cur.nextId;
    if (cur.kind === 'decision') {
      const branch = decisionChoices[cur.id] ?? true;
      nextId = branch ? cur.trueId : cur.falseId;
    }

    if (!nextId || !map.has(nextId)) {
      setIsStepping(false);
      return;
    }

    const nextNode = map.get(nextId)!;
    setActiveExecId(nextNode.id);
    setExecHistory((prev) => [...prev.slice(-11), nextNode.label]);
    if (nextNode.kind === 'end') {
      setIsStepping(false);
    }
  };

  useEffect(() => {
    if (!isStepping) return;
    const timer = window.setTimeout(() => {
      stepFlowchart();
    }, 750);
    return () => window.clearTimeout(timer);
  });

  const addBlock = (kind: BlockKind) => {
    const id = `n${Date.now().toString().slice(-4)}`;
    const defaultLabel =
      kind === 'start'
        ? 'Start'
        : kind === 'end'
        ? 'End'
        : kind === 'decision'
        ? 'x > 0?'
        : kind === 'io'
        ? 'print("Result")'
        : 'x = x + 1';

    const endNode = blocks.find((b) => b.kind === 'end');
    const newBlock: FlowBlock =
      kind === 'decision'
        ? { id, kind, label: defaultLabel, trueId: endNode?.id ?? null, falseId: endNode?.id ?? null }
        : kind === 'end'
        ? { id, kind, label: defaultLabel }
        : { id, kind, label: defaultLabel, nextId: endNode?.id ?? null };

    setBlocks((prev) => [...prev, newBlock]);
    setSelectedId(id);
    setActiveExecId(null);
  };

  const updateBlock = (id: string, patch: Partial<FlowBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const deleteBlock = (id: string) => {
    setBlocks((prev) =>
      prev
        .filter((b) => b.id !== id)
        .map((b) => ({
          ...b,
          nextId: b.nextId === id ? null : b.nextId,
          trueId: b.trueId === id ? null : b.trueId,
          falseId: b.falseId === id ? null : b.falseId,
        }))
    );
    if (selectedId === id) setSelectedId('');
    setActiveExecId(null);
  };

  const moveBlock = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= blocks.length) return;
    setBlocks((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(target, 0, item);
      return copy;
    });
  };

  const activeReverse = REVERSE_CHALLENGES[reverseIdx];
  const reversePassed = useMemo(() => {
    if (!reverseMode) return false;
    if (validationIssues.length > 0) return false;
    const kinds = new Set(blocks.map((b) => b.kind));
    const ioCount = blocks.filter((b) => b.kind === 'io').length;
    return (
      activeReverse.requiredKinds.every((k) => kinds.has(k)) &&
      ioCount >= activeReverse.minIo
    );
  }, [reverseMode, validationIssues.length, blocks, activeReverse]);

  return (
    <div className="space-y-6">
      {/* Header + Templates */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-semibold text-[#2563EB]">Interactive Flowchart Studio</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-[#1E293B]">
              Flowchart Builder &amp; Visual Executor
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-[#64748B]">
              Add blocks, wire True/False branches, validate logic paths, step through execution,
              and generate Python code automatically.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setReverseMode((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
                reverseMode
                  ? 'border-violet-300 bg-violet-50 text-violet-800'
                  : 'border-slate-200 bg-[#F8FAFC] text-[#1E293B] hover:border-violet-300'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#8B5CF6]" aria-hidden="true" />
              {reverseMode ? 'Exit Reverse Challenge' : 'Reverse Activity: Code → Flowchart'}
            </button>
          </div>
        </div>

        {/* Template Selector + Block Adder */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-semibold text-[#64748B]">Templates:</span>
            {FLOW_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => {
                  setBlocks(tpl.blocks);
                  setSelectedId(tpl.blocks[1]?.id ?? tpl.blocks[0].id);
                  setActiveExecId(null);
                  setExecHistory([]);
                  setIsStepping(false);
                }}
                className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-2.5 py-1.5 font-mono text-xs font-semibold text-[#1E293B] hover:border-sky-300 hover:bg-[#F0F9FF]"
              >
                {tpl.name}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-semibold text-[#64748B]">Add Block:</span>
            {(
              [
                { kind: 'process', label: '+ Process' },
                { kind: 'io', label: '+ I/O' },
                { kind: 'decision', label: '+ Decision' },
                { kind: 'start', label: '+ Start' },
                { kind: 'end', label: '+ End' },
              ] as const
            ).map((btn) => (
              <button
                key={btn.kind}
                type="button"
                onClick={() => addBlock(btn.kind)}
                className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-xs font-semibold text-[#2563EB] hover:bg-sky-100"
              >
                <Plus className="h-3 w-3" aria-hidden="true" />
                {btn.label.replace('+ ', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Optional Reverse Activity Banner */}
      {reverseMode && (
        <div className="rounded-3xl border border-violet-200 bg-violet-50/60 p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-base font-bold text-[#1E293B]">
                {activeReverse.title}
              </h3>
              <p className="text-xs text-[#64748B]">
                Construct a valid connected flowchart below matching every step in this snippet.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {REVERSE_CHALLENGES.map((rc, i) => (
                <button
                  key={rc.id}
                  type="button"
                  onClick={() => setReverseIdx(i)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                    reverseIdx === i
                      ? 'bg-[#8B5CF6] text-white'
                      : 'border border-slate-200 bg-white text-[#64748B]'
                  }`}
                >
                  Challenge {i + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setBlocks([
                    { id: 'n1', kind: 'start', label: 'Start', nextId: null },
                    { id: 'n2', kind: 'end', label: 'End' },
                  ]);
                  setSelectedId('n1');
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-[#1E293B]"
              >
                Clear Canvas
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <pre className="rounded-2xl bg-[#0F172A] p-4 font-mono text-xs text-sky-200">
              {activeReverse.code}
            </pre>
            <div
              className={`flex items-center gap-3 rounded-2xl border p-4 text-xs ${
                reversePassed
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                  : 'border-amber-200 bg-white text-[#1E293B]'
              }`}
            >
              {reversePassed ? (
                <>
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  <span>
                    <strong>Structure Verified!</strong> Your flowchart includes Start, Decision,
                    Output, and End blocks with valid connections.
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
                  <span>
                    Include {activeReverse.requiredKinds.join(', ')} blocks with {activeReverse.minIo}+ I/O block(s) and zero connection warnings.
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Workspace Split: Visual Nodes + Inspector & Code Generator */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Interactive Flowchart Node Canvas */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (isStepping) setIsStepping(false);
                    else {
                      if (!activeExecId) stepFlowchart();
                      setIsStepping(true);
                    }
                  }}
                  disabled={validationIssues.length > 0}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#8B5CF6] px-4 py-1.5 text-xs font-semibold text-white shadow-xs disabled:opacity-40"
                >
                  <Play className="h-3.5 w-3.5" />
                  {isStepping ? 'Running...' : 'Run Flow'}
                </button>
                <button
                  type="button"
                  onClick={stepFlowchart}
                  disabled={validationIssues.length > 0}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#1E293B] disabled:opacity-40"
                >
                  Step Path
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsStepping(false);
                    setActiveExecId(null);
                    setExecHistory([]);
                  }}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#64748B]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>

              <span className="font-mono text-xs text-[#64748B]">
                {blocks.length} blocks
              </span>
            </div>

            {/* Interactive Node Cards */}
            <div className="space-y-2.5">
              {blocks.map((block, idx) => {
                const isSelected = selectedBlock?.id === block.id;
                const isActive = activeExecId === block.id;
                const shapeBadge =
                  block.kind === 'start' || block.kind === 'end'
                    ? 'rounded-full border-sky-300 bg-sky-50 text-sky-800'
                    : block.kind === 'decision'
                    ? 'rounded-xl border-violet-300 bg-violet-50 text-violet-900'
                    : block.kind === 'io'
                    ? 'rounded-xl border-emerald-300 bg-emerald-50 text-emerald-900'
                    : 'rounded-xl border-slate-300 bg-[#F8FAFC] text-[#1E293B]';

                const findLabel = (targetId?: string | null) =>
                  blocks.find((b) => b.id === targetId)?.label ?? 'Unconnected';

                return (
                  <div
                    key={block.id}
                    onClick={() => setSelectedId(block.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedId(block.id);
                      }
                    }}
                    className={`flex flex-col justify-between gap-3 rounded-2xl border p-3.5 transition-all cursor-pointer sm:flex-row sm:items-center ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-300'
                        : isSelected
                        ? 'border-[#2563EB] bg-[#F0F9FF]/60'
                        : 'border-slate-200 bg-white hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`shrink-0 border px-2.5 py-1 font-mono text-[10px] font-bold uppercase ${shapeBadge}`}
                      >
                        {block.kind}
                      </span>
                      <span className="truncate font-mono text-xs sm:text-sm font-bold text-[#1E293B]">
                        {block.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                      {block.kind === 'decision' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-700">
                            T→{findLabel(block.trueId)}
                          </span>
                          <span className="text-amber-700">
                            F→{findLabel(block.falseId)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDecisionChoices((prev) => ({
                                ...prev,
                                [block.id]: !(prev[block.id] ?? true),
                              }));
                            }}
                            className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                              decisionChoices[block.id] ?? true
                                ? 'border-emerald-300 bg-emerald-100 text-emerald-800'
                                : 'border-amber-300 bg-amber-100 text-amber-800'
                            }`}
                          >
                            Sim: {decisionChoices[block.id] ?? true ? 'True' : 'False'}
                          </button>
                        </div>
                      ) : block.kind !== 'end' ? (
                        <span className="inline-flex items-center gap-1 text-[#64748B]">
                          <ArrowRight className="h-3 w-3" />
                          {findLabel(block.nextId)}
                        </span>
                      ) : (
                        <span className="text-slate-400">Terminates</span>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveBlock(idx, -1);
                          }}
                          disabled={idx === 0}
                          aria-label="Move block up"
                          className="rounded border border-slate-200 p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveBlock(idx, 1);
                          }}
                          disabled={idx === blocks.length - 1}
                          aria-label="Move block down"
                          className="rounded border border-slate-200 p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {execHistory.length > 0 && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5 text-xs text-emerald-900">
                <strong>Active Path Trace:</strong> {execHistory.join(' → ')}
              </div>
            )}
          </div>
        </div>

        {/* Right: Block Properties Editor, Validation & Generated Python */}
        <div className="space-y-4 lg:col-span-5">
          {/* Block Inspector */}
          {selectedBlock && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="font-display text-sm font-bold text-[#1E293B]">
                  Edit Selected Block ({selectedBlock.kind})
                </h3>
                <button
                  type="button"
                  onClick={() => deleteBlock(selectedBlock.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#64748B]">
                  Block Label / Statement
                </label>
                <input
                  type="text"
                  value={selectedBlock.label}
                  onChange={(e) => updateBlock(selectedBlock.id, { label: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#1E293B] focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              {selectedBlock.kind === 'decision' ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-700">
                      True Branch →
                    </label>
                    <select
                      value={selectedBlock.trueId ?? ''}
                      onChange={(e) =>
                        updateBlock(selectedBlock.id, { trueId: e.target.value || null })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-2.5 py-2 text-xs font-medium"
                    >
                      <option value="">-- Select target --</option>
                      {blocks
                        .filter((b) => b.id !== selectedBlock.id)
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.label}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-amber-700">
                      False Branch →
                    </label>
                    <select
                      value={selectedBlock.falseId ?? ''}
                      onChange={(e) =>
                        updateBlock(selectedBlock.id, { falseId: e.target.value || null })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-2.5 py-2 text-xs font-medium"
                    >
                      <option value="">-- Select target --</option>
                      {blocks
                        .filter((b) => b.id !== selectedBlock.id)
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.label}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              ) : selectedBlock.kind !== 'end' ? (
                <div>
                  <label className="block text-xs font-semibold text-[#64748B]">
                    Next Block →
                  </label>
                  <select
                    value={selectedBlock.nextId ?? ''}
                    onChange={(e) =>
                      updateBlock(selectedBlock.id, { nextId: e.target.value || null })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-2.5 py-2 text-xs font-medium"
                  >
                    <option value="">-- Select target --</option>
                    {blocks
                      .filter((b) => b.id !== selectedBlock.id)
                      .map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.label}
                        </option>
                      ))}
                  </select>
                </div>
              ) : null}
            </div>
          )}

          {/* Validation Status */}
          {validationIssues.length > 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 space-y-1">
              <p className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Connection Validation Warnings
              </p>
              <ul className="list-disc pl-5 space-y-0.5">
                {validationIssues.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              All flowchart paths are validly connected.
            </div>
          )}

          {/* Generated Python Code */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-[#0F172A]">
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#1E293B] px-4 py-2.5 text-xs text-slate-200">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Code2 className="h-3.5 w-3.5 text-sky-400" />
                Generated Python Preview
              </span>
              {onOpenInStudio && (
                <button
                  type="button"
                  onClick={() => onOpenInStudio(generatedPython)}
                  className="rounded-lg bg-[#2563EB] px-2.5 py-1 text-[11px] font-semibold text-white hover:opacity-95"
                >
                  Open in Coding Studio
                </button>
              )}
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 text-sky-200">
              {generatedPython}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
