import React from 'react';

export type FlowchartType =
  | 'if'
  | 'if-else'
  | 'if-elif-else'
  | 'nested-if'
  | 'for'
  | 'while'
  | 'break-continue'
  | 'nested-loop';

interface FlowchartSVGProps {
  type: FlowchartType;
  activeNode?: string;
  activeBranch?: string;
  labels?: {
    cond1?: string;
    cond2?: string;
    cond3?: string;
    action1?: string;
    action2?: string;
    action3?: string;
    action4?: string;
  };
}

const NODE_BASE = '#0F172A';
const NODE_STROKE = '#334155';
const ACTIVE_BLUE_FILL = '#1E3A8A';
const ACTIVE_BLUE_STROKE = '#60A5FA';
const ACTIVE_TRUE_FILL = '#064E3B';
const ACTIVE_TRUE_STROKE = '#34D399';
const ACTIVE_FALSE_FILL = '#4C1D95';
const ACTIVE_FALSE_STROKE = '#A78BFA';
const LINE_BASE = '#334155';
const LINE_ACTIVE = '#60A5FA';
const LINE_TRUE = '#34D399';
const LINE_FALSE = '#A78BFA';

export const FlowchartSVG: React.FC<FlowchartSVGProps> = ({
  type,
  activeNode = '',
  activeBranch = '',
  labels = {},
}) => {
  const isNode = (id: string) => activeNode === id;
  const isBranch = (id: string) => activeBranch === id;

  const boxStyle = (id: string, tone: 'blue' | 'true' | 'false' = 'blue') => {
    if (!isNode(id)) return { fill: NODE_BASE, stroke: NODE_STROKE, strokeWidth: 1.5 };
    if (tone === 'true') return { fill: ACTIVE_TRUE_FILL, stroke: ACTIVE_TRUE_STROKE, strokeWidth: 2.5 };
    if (tone === 'false') return { fill: ACTIVE_FALSE_FILL, stroke: ACTIVE_FALSE_STROKE, strokeWidth: 2.5 };
    return { fill: ACTIVE_BLUE_FILL, stroke: ACTIVE_BLUE_STROKE, strokeWidth: 2.5 };
  };

  const edgeColor = (branchId: string, tone: 'blue' | 'true' | 'false' = 'blue') => {
    if (!isBranch(branchId)) return LINE_BASE;
    if (tone === 'true') return LINE_TRUE;
    if (tone === 'false') return LINE_FALSE;
    return LINE_ACTIVE;
  };

  const edgeWidth = (branchId: string) => (isBranch(branchId) ? 2.8 : 1.5);

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800/80 bg-[#080D18] p-3">
      <svg
        viewBox={
          type === 'if-elif-else'
            ? '0 0 460 460'
            : type === 'nested-if'
            ? '0 0 460 400'
            : type === 'break-continue' || type === 'nested-loop'
            ? '0 0 460 360'
            : '0 0 420 340'
        }
        className="mx-auto h-auto w-full max-w-[460px] select-none"
        role="img"
        aria-label={`${type} execution flowchart`}
      >
        <defs>
          <marker id="arrow-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569" />
          </marker>
          <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#60A5FA" />
          </marker>
          <marker id="arrow-true" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#34D399" />
          </marker>
          <marker id="arrow-false" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#A78BFA" />
          </marker>
        </defs>

        {type === 'if' && (
          <g>
            {/* Start */}
            <rect x="150" y="14" width="120" height="36" rx="18" {...boxStyle('start')} />
            <text x="210" y="37" textAnchor="middle" fill="#F1F5F9" fontSize="12" fontWeight="600">Start</text>
            <line x1="210" y1="50" x2="210" y2="76" stroke={edgeColor('to-cond')} strokeWidth={edgeWidth('to-cond')} markerEnd={isBranch('to-cond') ? 'url(#arrow-blue)' : 'url(#arrow-muted)'} />

            {/* Condition Diamond */}
            <polygon points="210,80 300,124 210,168 120,124" {...boxStyle('cond1')} />
            <text x="210" y="128" textAnchor="middle" fill="#E2E8F0" fontSize="11.5" fontFamily="JetBrains Mono, monospace">
              {labels.cond1 || 'age >= 18'}
            </text>

            {/* True Branch */}
            <path d="M 210 168 L 210 206" stroke={edgeColor('true', 'true')} strokeWidth={edgeWidth('true')} markerEnd={isBranch('true') ? 'url(#arrow-true)' : 'url(#arrow-muted)'} />
            <text x="220" y="191" fill={isBranch('true') ? '#34D399' : '#94A3B8'} fontSize="11" fontWeight="600">True</text>
            <rect x="125" y="210" width="170" height="42" rx="8" {...boxStyle('action1', 'true')} />
            <text x="210" y="236" textAnchor="middle" fill="#F1F5F9" fontSize="11.5" fontFamily="JetBrains Mono, monospace">
              {labels.action1 || 'print("Eligible")'}
            </text>

            {/* False Bypass */}
            <path d="M 300 124 L 365 124 L 365 294 L 274 294" fill="none" stroke={edgeColor('false', 'false')} strokeWidth={edgeWidth('false')} markerEnd={isBranch('false') ? 'url(#arrow-false)' : 'url(#arrow-muted)'} />
            <text x="315" y="116" fill={isBranch('false') ? '#A78BFA' : '#94A3B8'} fontSize="11" fontWeight="600">False (skip)</text>

            {/* To End */}
            <line x1="210" y1="252" x2="210" y2="274" stroke={edgeColor('to-end')} strokeWidth={edgeWidth('to-end')} markerEnd={isBranch('to-end') ? 'url(#arrow-blue)' : 'url(#arrow-muted)'} />
            <rect x="150" y="278" width="120" height="36" rx="18" {...boxStyle('end')} />
            <text x="210" y="301" textAnchor="middle" fill="#F1F5F9" fontSize="12" fontWeight="600">End</text>
          </g>
        )}

        {type === 'if-else' && (
          <g>
            {/* Start */}
            <rect x="150" y="12" width="120" height="34" rx="17" {...boxStyle('start')} />
            <text x="210" y="34" textAnchor="middle" fill="#F1F5F9" fontSize="12" fontWeight="600">Start</text>
            <line x1="210" y1="46" x2="210" y2="72" stroke={edgeColor('to-cond')} strokeWidth={edgeWidth('to-cond')} markerEnd={isBranch('to-cond') ? 'url(#arrow-blue)' : 'url(#arrow-muted)'} />

            {/* Condition */}
            <polygon points="210,76 300,118 210,160 120,118" {...boxStyle('cond1')} />
            <text x="210" y="122" textAnchor="middle" fill="#E2E8F0" fontSize="11.5" fontFamily="JetBrains Mono, monospace">
              {labels.cond1 || 'marks >= 40'}
            </text>

            {/* True Left */}
            <path d="M 120 118 L 85 118 L 85 192" fill="none" stroke={edgeColor('true', 'true')} strokeWidth={edgeWidth('true')} markerEnd={isBranch('true') ? 'url(#arrow-true)' : 'url(#arrow-muted)'} />
            <text x="68" y="110" fill={isBranch('true') ? '#34D399' : '#94A3B8'} fontSize="11" fontWeight="600">True</text>
            <rect x="18" y="196" width="136" height="42" rx="8" {...boxStyle('action1', 'true')} />
            <text x="86" y="221" textAnchor="middle" fill="#F1F5F9" fontSize="11" fontFamily="JetBrains Mono, monospace">
              {labels.action1 || 'print("Pass")'}
            </text>

            {/* False Right */}
            <path d="M 300 118 L 335 118 L 335 192" fill="none" stroke={edgeColor('false', 'false')} strokeWidth={edgeWidth('false')} markerEnd={isBranch('false') ? 'url(#arrow-false)' : 'url(#arrow-muted)'} />
            <text x="322" y="110" fill={isBranch('false') ? '#A78BFA' : '#94A3B8'} fontSize="11" fontWeight="600">False</text>
            <rect x="266" y="196" width="136" height="42" rx="8" {...boxStyle('action2', 'false')} />
            <text x="334" y="221" textAnchor="middle" fill="#F1F5F9" fontSize="11" fontFamily="JetBrains Mono, monospace">
              {labels.action2 || 'print("Fail")'}
            </text>

            {/* Merge to End */}
            <path d="M 85 238 L 85 296 L 146 296" fill="none" stroke={edgeColor('end-true')} strokeWidth={edgeWidth('end-true')} markerEnd={isBranch('end-true') ? 'url(#arrow-blue)' : 'url(#arrow-muted)'} />
            <path d="M 335 238 L 335 296 L 274 296" fill="none" stroke={edgeColor('end-false')} strokeWidth={edgeWidth('end-false')} markerEnd={isBranch('end-false') ? 'url(#arrow-blue)' : 'url(#arrow-muted)'} />
            <rect x="150" y="278" width="120" height="36" rx="18" {...boxStyle('end')} />
            <text x="210" y="301" textAnchor="middle" fill="#F1F5F9" fontSize="12" fontWeight="600">End</text>
          </g>
        )}

        {type === 'if-elif-else' && (
          <g>
            {/* Start */}
            <rect x="100" y="12" width="110" height="34" rx="17" {...boxStyle('start')} />
            <text x="155" y="33" textAnchor="middle" fill="#F1F5F9" fontSize="12" fontWeight="600">Start</text>
            <line x1="155" y1="46" x2="155" y2="68" stroke={edgeColor('to-cond1')} strokeWidth={edgeWidth('to-cond1')} markerEnd={isBranch('to-cond1') ? 'url(#arrow-blue)' : 'url(#arrow-muted)'} />

            {/* Cond 1 */}
            <polygon points="155,72 245,110 155,148 65,110" {...boxStyle('cond1')} />
            <text x="155" y="114" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontFamily="JetBrains Mono, monospace">
              {labels.cond1 || 'marks >= 90'}
            </text>
            <line x1="245" y1="110" x2="294" y2="110" stroke={edgeColor('true1', 'true')} strokeWidth={edgeWidth('true1')} markerEnd={isBranch('true1') ? 'url(#arrow-true)' : 'url(#arrow-muted)'} />
            <text x="267" y="102" textAnchor="middle" fill={isBranch('true1') ? '#34D399' : '#94A3B8'} fontSize="10.5" fontWeight="600">True</text>
            <rect x="298" y="90" width="144" height="40" rx="8" {...boxStyle('action1', 'true')} />
            <text x="370" y="114" textAnchor="middle" fill="#F1F5F9" fontSize="11" fontFamily="JetBrains Mono, monospace">
              {labels.action1 || 'print("Grade A")'}
            </text>

            {/* False -> Cond 2 */}
            <line x1="155" y1="148" x2="155" y2="178" stroke={edgeColor('false1', 'false')} strokeWidth={edgeWidth('false1')} markerEnd={isBranch('false1') ? 'url(#arrow-false)' : 'url(#arrow-muted)'} />
            <text x="168" y="167" fill={isBranch('false1') ? '#A78BFA' : '#94A3B8'} fontSize="10.5" fontWeight="600">False</text>

            <polygon points="155,182 245,220 155,258 65,220" {...boxStyle('cond2')} />
            <text x="155" y="224" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontFamily="JetBrains Mono, monospace">
              {labels.cond2 || 'marks >= 75'}
            </text>
            <line x1="245" y1="220" x2="294" y2="220" stroke={edgeColor('true2', 'true')} strokeWidth={edgeWidth('true2')} markerEnd={isBranch('true2') ? 'url(#arrow-true)' : 'url(#arrow-muted)'} />
            <text x="267" y="212" textAnchor="middle" fill={isBranch('true2') ? '#34D399' : '#94A3B8'} fontSize="10.5" fontWeight="600">True</text>
            <rect x="298" y="200" width="144" height="40" rx="8" {...boxStyle('action2', 'true')} />
            <text x="370" y="224" textAnchor="middle" fill="#F1F5F9" fontSize="11" fontFamily="JetBrains Mono, monospace">
              {labels.action2 || 'print("Grade B")'}
            </text>

            {/* False -> Cond 3 */}
            <line x1="155" y1="258" x2="155" y2="288" stroke={edgeColor('false2', 'false')} strokeWidth={edgeWidth('false2')} markerEnd={isBranch('false2') ? 'url(#arrow-false)' : 'url(#arrow-muted)'} />
            <text x="168" y="277" fill={isBranch('false2') ? '#A78BFA' : '#94A3B8'} fontSize="10.5" fontWeight="600">False</text>

            <polygon points="155,292 245,330 155,368 65,330" {...boxStyle('cond3')} />
            <text x="155" y="334" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontFamily="JetBrains Mono, monospace">
              {labels.cond3 || 'marks >= 40'}
            </text>
            <line x1="245" y1="330" x2="294" y2="330" stroke={edgeColor('true3', 'true')} strokeWidth={edgeWidth('true3')} markerEnd={isBranch('true3') ? 'url(#arrow-true)' : 'url(#arrow-muted)'} />
            <text x="267" y="322" textAnchor="middle" fill={isBranch('true3') ? '#34D399' : '#94A3B8'} fontSize="10.5" fontWeight="600">True</text>
            <rect x="298" y="310" width="144" height="40" rx="8" {...boxStyle('action3', 'true')} />
            <text x="370" y="334" textAnchor="middle" fill="#F1F5F9" fontSize="11" fontFamily="JetBrains Mono, monospace">
              {labels.action3 || 'print("Pass")'}
            </text>

            {/* Else */}
            <line x1="155" y1="368" x2="155" y2="398" stroke={edgeColor('false3', 'false')} strokeWidth={edgeWidth('false3')} markerEnd={isBranch('false3') ? 'url(#arrow-false)' : 'url(#arrow-muted)'} />
            <text x="168" y="387" fill={isBranch('false3') ? '#A78BFA' : '#94A3B8'} fontSize="10.5" fontWeight="600">False (else)</text>
            <rect x="83" y="402" width="144" height="40" rx="8" {...boxStyle('action4', 'false')} />
            <text x="155" y="426" textAnchor="middle" fill="#F1F5F9" fontSize="11" fontFamily="JetBrains Mono, monospace">
              {labels.action4 || 'print("Fail")'}
            </text>

            {/* End node on bottom right */}
            <path d="M 442 110 L 452 110 L 452 422 L 424 422" fill="none" stroke="#334155" strokeWidth="1.2" />
            <path d="M 442 220 L 452 220" fill="none" stroke="#334155" strokeWidth="1.2" />
            <path d="M 442 330 L 452 330" fill="none" stroke="#334155" strokeWidth="1.2" />
            <path d="M 227 422 L 310 422" fill="none" stroke="#334155" strokeWidth="1.2" />
            <rect x="314" y="405" width="106" height="34" rx="17" {...boxStyle('end')} />
            <text x="367" y="426" textAnchor="middle" fill="#F1F5F9" fontSize="12" fontWeight="600">End</text>
          </g>
        )}

        {type === 'nested-if' && (
          <g>
            {/* Start */}
            <rect x="170" y="10" width="120" height="34" rx="17" {...boxStyle('start')} />
            <text x="230" y="31" textAnchor="middle" fill="#F1F5F9" fontSize="12" fontWeight="600">Start</text>
            <line x1="230" y1="44" x2="230" y2="68" stroke={edgeColor('to-outer')} strokeWidth={edgeWidth('to-outer')} markerEnd={isBranch('to-outer') ? 'url(#arrow-blue)' : 'url(#arrow-muted)'} />

            {/* Outer Condition */}
            <polygon points="230,72 328,110 230,148 132,110" {...boxStyle('cond1')} />
            <text x="230" y="114" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontFamily="JetBrains Mono, monospace">
              {labels.cond1 || 'age >= 18'}
            </text>

            {/* Outer False */}
            <path d="M 132 110 L 74 110 L 74 202" fill="none" stroke={edgeColor('outer-false', 'false')} strokeWidth={edgeWidth('outer-false')} markerEnd={isBranch('outer-false') ? 'url(#arrow-false)' : 'url(#arrow-muted)'} />
            <text x="86" y="102" fill={isBranch('outer-false') ? '#A78BFA' : '#94A3B8'} fontSize="10.5" fontWeight="600">False</text>
            <rect x="12" y="206" width="126" height="42" rx="8" {...boxStyle('action3', 'false')} />
            <text x="75" y="231" textAnchor="middle" fill="#F1F5F9" fontSize="10.5" fontFamily="JetBrains Mono, monospace">
              {labels.action3 || 'print("Too young")'}
            </text>

            {/* Outer True -> Inner Condition */}
            <path d="M 328 110 L 340 110 L 340 162" fill="none" stroke={edgeColor('outer-true', 'true')} strokeWidth={edgeWidth('outer-true')} markerEnd={isBranch('outer-true') ? 'url(#arrow-true)' : 'url(#arrow-muted)'} />
            <text x="352" y="140" fill={isBranch('outer-true') ? '#34D399' : '#94A3B8'} fontSize="10.5" fontWeight="600">True</text>

            <polygon points="340,166 438,204 340,242 242,204" {...boxStyle('cond2')} />
            <text x="340" y="208" textAnchor="middle" fill="#E2E8F0" fontSize="10.5" fontFamily="JetBrains Mono, monospace">
              {labels.cond2 || 'has_id == True'}
            </text>

            {/* Inner True */}
            <path d="M 438 204 L 448 204 L 448 274 L 410 274" fill="none" stroke={edgeColor('inner-true', 'true')} strokeWidth={edgeWidth('inner-true')} markerEnd={isBranch('inner-true') ? 'url(#arrow-true)' : 'url(#arrow-muted)'} />
            <text x="415" y="196" fill={isBranch('inner-true') ? '#34D399' : '#94A3B8'} fontSize="10" fontWeight="600">True</text>
            <rect x="330" y="264" width="120" height="40" rx="8" {...boxStyle('action1', 'true')} />
            <text x="390" y="288" textAnchor="middle" fill="#F1F5F9" fontSize="10.5" fontFamily="JetBrains Mono, monospace">
              {labels.action1 || 'print("Allowed")'}
            </text>

            {/* Inner False */}
            <path d="M 242 204 L 225 204 L 225 260" fill="none" stroke={edgeColor('inner-false', 'false')} strokeWidth={edgeWidth('inner-false')} markerEnd={isBranch('inner-false') ? 'url(#arrow-false)' : 'url(#arrow-muted)'} />
            <text x="200" y="196" fill={isBranch('inner-false') ? '#A78BFA' : '#94A3B8'} fontSize="10" fontWeight="600">False</text>
            <rect x="165" y="264" width="128" height="40" rx="8" {...boxStyle('action2', 'false')} />
            <text x="229" y="288" textAnchor="middle" fill="#F1F5F9" fontSize="10.5" fontFamily="JetBrains Mono, monospace">
              {labels.action2 || 'print("Need ID")'}
            </text>

            {/* End */}
            <path d="M 75 248 L 75 362 L 166 362" fill="none" stroke="#334155" strokeWidth="1.4" />
            <path d="M 229 304 L 229 340" fill="none" stroke="#334155" strokeWidth="1.4" />
            <path d="M 390 304 L 390 362 L 294 362" fill="none" stroke="#334155" strokeWidth="1.4" />
            <rect x="170" y="344" width="120" height="36" rx="18" {...boxStyle('end')} />
            <text x="230" y="366" textAnchor="middle" fill="#F1F5F9" fontSize="12" fontWeight="600">End</text>
          </g>
        )}

        {(type === 'for' || type === 'while') && (
          <g>
            {/* Start / Init */}
            <rect x="135" y="12" width="150" height="36" rx="18" {...boxStyle('init')} />
            <text x="210" y="34" textAnchor="middle" fill="#F1F5F9" fontSize="11.5" fontFamily="JetBrains Mono, monospace">
              {type === 'for' ? (labels.cond1 || 'init sequence') : (labels.cond1 || 'count = start')}
            </text>
            <line x1="210" y1="48" x2="210" y2="74" stroke={edgeColor('to-check')} strokeWidth={edgeWidth('to-check')} markerEnd={isBranch('to-check') ? 'url(#arrow-blue)' : 'url(#arrow-muted)'} />

            {/* Loop Condition / Next Item Diamond */}
            <polygon points="210,78 310,122 210,166 110,122" {...boxStyle('check')} />
            <text x="210" y="126" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontFamily="JetBrains Mono, monospace">
              {type === 'for' ? (labels.cond2 || 'More items in range?') : (labels.cond2 || 'Condition is True?')}
            </text>

            {/* True -> Loop Body */}
            <line x1="210" y1="166" x2="210" y2="198" stroke={edgeColor('loop-true', 'true')} strokeWidth={edgeWidth('loop-true')} markerEnd={isBranch('loop-true') ? 'url(#arrow-true)' : 'url(#arrow-muted)'} />
            <text x="222" y="186" fill={isBranch('loop-true') ? '#34D399' : '#94A3B8'} fontSize="11" fontWeight="600">True</text>

            <rect x="115" y="202" width="190" height="44" rx="8" {...boxStyle('body', 'true')} />
            <text x="210" y="228" textAnchor="middle" fill="#F1F5F9" fontSize="11.5" fontFamily="JetBrains Mono, monospace">
              {labels.action1 || 'Execute loop body'}
            </text>

            {/* Update / Loop Back Arrow */}
            <path d="M 115 224 L 46 224 L 46 122 L 106 122" fill="none" stroke={edgeColor('loop-back')} strokeWidth={edgeWidth('loop-back')} markerEnd={isBranch('loop-back') ? 'url(#arrow-blue)' : 'url(#arrow-muted)'} />
            <text x="54" y="176" fill={isBranch('loop-back') ? '#60A5FA' : '#94A3B8'} fontSize="10.5" fontWeight="600">
              {type === 'for' ? 'Next item' : 'Update & repeat'}
            </text>

            {/* False -> Exit */}
            <path d="M 310 122 L 368 122 L 368 296 L 274 296" fill="none" stroke={edgeColor('loop-exit', 'false')} strokeWidth={edgeWidth('loop-exit')} markerEnd={isBranch('loop-exit') ? 'url(#arrow-false)' : 'url(#arrow-muted)'} />
            <text x="320" y="114" fill={isBranch('loop-exit') ? '#A78BFA' : '#94A3B8'} fontSize="11" fontWeight="600">False (exit)</text>

            {/* End */}
            <rect x="150" y="278" width="120" height="36" rx="18" {...boxStyle('end')} />
            <text x="210" y="301" textAnchor="middle" fill="#F1F5F9" fontSize="12" fontWeight="600">Loop Done</text>
          </g>
        )}

        {type === 'break-continue' && (
          <g>
            {/* Loop Header */}
            <rect x="145" y="14" width="170" height="36" rx="8" {...boxStyle('header')} />
            <text x="230" y="36" textAnchor="middle" fill="#F1F5F9" fontSize="11.5" fontFamily="JetBrains Mono, monospace">for i in range(1, 6):</text>
            <line x1="230" y1="50" x2="230" y2="76" stroke={edgeColor('enter')} strokeWidth={edgeWidth('enter')} markerEnd="url(#arrow-blue)" />

            {/* Check condition */}
            <polygon points="230,80 324,120 230,160 136,120" {...boxStyle('cond1')} />
            <text x="230" y="124" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontFamily="JetBrains Mono, monospace">
              {labels.cond1 || 'if i == 3:'}
            </text>

            {/* Left: continue jumps back to header */}
            <path d="M 136 120 L 58 120 L 58 32 L 141 32" fill="none" stroke={edgeColor('continue', 'blue')} strokeWidth={edgeWidth('continue')} markerEnd="url(#arrow-blue)" />
            <rect x="14" y="64" width="88" height="28" rx="6" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1.2" />
            <text x="58" y="82" textAnchor="middle" fill="#DBEAFE" fontSize="10.5" fontWeight="600">continue</text>
            <text x="58" y="142" textAnchor="middle" fill="#93C5FD" fontSize="10">Skip to next i</text>

            {/* Right: break jumps straight to Exit */}
            <path d="M 324 120 L 402 120 L 402 314 L 296 314" fill="none" stroke={edgeColor('break', 'false')} strokeWidth={edgeWidth('break')} markerEnd="url(#arrow-false)" />
            <rect x="358" y="168" width="88" height="28" rx="6" fill="#4C1D95" stroke="#A78BFA" strokeWidth="1.2" />
            <text x="402" y="186" textAnchor="middle" fill="#EDE9FE" fontSize="10.5" fontWeight="600">break</text>
            <text x="402" y="214" textAnchor="middle" fill="#C4B5FD" fontSize="10">Exit loop now</text>

            {/* Normal body */}
            <line x1="230" y1="160" x2="230" y2="200" stroke={edgeColor('normal', 'true')} strokeWidth={edgeWidth('normal')} markerEnd="url(#arrow-true)" />
            <text x="242" y="184" fill="#94A3B8" fontSize="10.5">False</text>
            <rect x="150" y="204" width="160" height="38" rx="8" {...boxStyle('body', 'true')} />
            <text x="230" y="227" textAnchor="middle" fill="#F1F5F9" fontSize="11.5" fontFamily="JetBrains Mono, monospace">print(i)</text>
            <path d="M 230 242 L 230 264 L 116 264 L 116 32 L 141 32" fill="none" stroke="#475569" strokeWidth="1.3" markerEnd="url(#arrow-muted)" />

            {/* End */}
            <rect x="168" y="296" width="124" height="36" rx="18" {...boxStyle('end')} />
            <text x="230" y="318" textAnchor="middle" fill="#F1F5F9" fontSize="12" fontWeight="600">After Loop</text>
          </g>
        )}

        {type === 'nested-loop' && (
          <g>
            {/* Outer Loop */}
            <rect x="130" y="16" width="200" height="40" rx="8" {...boxStyle('outer')} />
            <text x="230" y="40" textAnchor="middle" fill="#F1F5F9" fontSize="11.5" fontFamily="JetBrains Mono, monospace">
              Outer: for row in range(1, 4)
            </text>
            <line x1="230" y1="56" x2="230" y2="88" stroke={edgeColor('to-inner')} strokeWidth={edgeWidth('to-inner')} markerEnd="url(#arrow-blue)" />

            {/* Inner Loop Box */}
            <rect x="78" y="92" width="304" height="164" rx="12" fill="#0B1324" stroke="#334155" strokeDasharray="5 4" strokeWidth="1.5" />
            <text x="230" y="114" textAnchor="middle" fill="#A78BFA" fontSize="11" fontWeight="600">
              Inner Loop runs completely per outer row
            </text>

            <rect x="135" y="128" width="190" height="38" rx="8" {...boxStyle('inner', 'false')} />
            <text x="230" y="151" textAnchor="middle" fill="#F1F5F9" fontSize="11.5" fontFamily="JetBrains Mono, monospace">
              Inner: for col in range(1, 4)
            </text>
            <line x1="230" y1="166" x2="230" y2="192" stroke={edgeColor('inner-body', 'true')} strokeWidth={edgeWidth('inner-body')} markerEnd="url(#arrow-true)" />

            <rect x="145" y="196" width="170" height="38" rx="8" {...boxStyle('body', 'true')} />
            <text x="230" y="219" textAnchor="middle" fill="#F1F5F9" fontSize="11.5" fontFamily="JetBrains Mono, monospace">
              print(row, col)
            </text>

            {/* Inner repeat arrow */}
            <path d="M 315 215 L 352 215 L 352 147 L 329 147" fill="none" stroke="#A78BFA" strokeWidth="1.6" markerEnd="url(#arrow-false)" />
            <text x="366" y="184" fill="#C4B5FD" fontSize="10">Next col</text>

            {/* Outer repeat arrow */}
            <path d="M 135 147 L 48 147 L 48 36 L 126 36" fill="none" stroke="#60A5FA" strokeWidth="1.6" markerEnd="url(#arrow-blue)" />
            <text x="38" y="94" fill="#93C5FD" fontSize="10">Next row</text>

            {/* Exit */}
            <line x1="230" y1="256" x2="230" y2="292" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow-muted)" />
            <rect x="165" y="296" width="130" height="36" rx="18" {...boxStyle('end')} />
            <text x="230" y="318" textAnchor="middle" fill="#F1F5F9" fontSize="12" fontWeight="600">All Rows Done</text>
          </g>
        )}
      </svg>
    </div>
  );
};
