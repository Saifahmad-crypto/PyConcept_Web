import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, GitBranch, Terminal, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const HeroVisual: React.FC = () => {
  const [score, setScore] = useState(84);
  const [pulseStep, setPulseStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-pulse execution sequence
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setPulseStep((prev) => (prev + 1) % 4);
    }, 1100);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const passes = score >= 75;
  const loopCount = passes ? 3 : 0;

  // Active node determination based on pulse step
  // Step 0: Input -> Step 1: Decision -> Step 2: Branch Execution (Loop / Else) -> Step 3: Terminal Stdout
  const activeNode = pulseStep;

  const presets = [
    { label: 'Fail (50)', val: 50 },
    { label: 'Boundary (75)', val: 75 },
    { label: 'Pass (85)', val: 85 },
    { label: 'High (95)', val: 95 },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#2C1616] bg-[#140505] p-4 sm:p-6 shadow-2xl transition-all duration-300">
      {/* Subtle architectural HUD corner ticks */}
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
        <div className="absolute left-2.5 top-2.5 h-3 w-3 border-l-2 border-t-2 border-[#E10906]" />
        <div className="absolute right-2.5 top-2.5 h-3 w-3 border-r-2 border-t-2 border-[#E10906]" />
        <div className="absolute bottom-2.5 left-2.5 h-3 w-3 border-b-2 border-l-2 border-[#E10906]" />
        <div className="absolute bottom-2.5 right-2.5 h-3 w-3 border-b-2 border-r-2 border-[#E10906]" />
      </div>

      {/* Top Telemetry Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[#2C1616] pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E10906] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#E10906]" />
          </span>
          <span className="font-mono text-xs font-bold tracking-wider text-[#FBF5F9] uppercase">
            Live Logic Nexus
          </span>
          <span className="hidden sm:inline-flex rounded-full bg-[#2C1616] px-2 py-0.5 font-mono text-[10px] text-[#FF6B6B] border border-[#E10906]/30">
            Interactive Flowchart
          </span>
        </div>

        {/* Live Flow State Pill */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#8A8585]">flow:</span>
          <span
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-[11px] font-bold transition-colors ${
              passes
                ? 'bg-[#E10906]/20 text-[#FF6B6B] border border-[#E10906]/50 shadow-[0_0_12px_rgba(225,9,6,0.2)]'
                : 'bg-[#2A1616] text-[#E0A0A0] border border-[#4A2222]'
            }`}
          >
            {passes ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-[#FF6B6B]" />
                TRUE · LOOP (×3)
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 text-[#E0A0A0]" />
                FALSE · FALLBACK
              </>
            )}
          </span>
        </div>
      </div>

      {/* Central Interactive Flowchart SVG Stage */}
      <div className="relative z-10 mt-3 flex flex-col items-center">
        <svg
          viewBox="0 0 540 370"
          className="h-auto w-full max-w-[540px] select-none"
          role="img"
          aria-label={`Interactive Python Logic Flowchart demonstrating if score >= 75 decision branch with score ${score}`}
        >
          <defs>
            {/* Red neon glow for active paths & nodes */}
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Subtle background tech grid */}
            <pattern id="nexus-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2C1616" strokeWidth="0.6" strokeOpacity="0.45" />
              <circle cx="20" cy="20" r="0.8" fill="#E10906" fillOpacity="0.15" />
            </pattern>

            {/* Gradient fills */}
            <linearGradient id="grad-active-node" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2D0B0B" />
              <stop offset="100%" stopColor="#170606" />
            </linearGradient>

            <linearGradient id="grad-idle-node" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#180707" />
              <stop offset="100%" stopColor="#100303" />
            </linearGradient>
          </defs>

          {/* Futuristic Grid Canvas */}
          <rect width="540" height="370" rx="14" fill="#120404" />
          <rect width="540" height="370" rx="14" fill="url(#nexus-grid)" />

          {/* =========================================================================
              1. CONNECTING FLOW PATHS (Rendered under nodes)
              ========================================================================= */}

          {/* Path 1: Input -> Decision Diamond */}
          <path
            d="M 270 54 L 270 98"
            fill="none"
            stroke={activeNode === 0 || activeNode === 1 ? '#E10906' : '#3A1E1E'}
            strokeWidth={activeNode === 0 || activeNode === 1 ? '2.5' : '1.5'}
            className={activeNode === 0 || activeNode === 1 ? 'animate-flow-dash' : ''}
            filter={activeNode === 0 || activeNode === 1 ? 'url(#neon-glow)' : undefined}
          />
          {/* Arrowhead to Diamond */}
          <polygon
            points="270,102 265,92 275,92"
            fill={activeNode === 1 ? '#FF6B6B' : '#5A2A2A'}
          />

          {/* Path 2A: Decision -> TRUE Branch (Right towards Loop Block) */}
          <path
            d="M 334 140 H 420 Q 430 140 430 150 V 192"
            fill="none"
            stroke={passes ? '#E10906' : '#2D1414'}
            strokeWidth={passes ? '2.5' : '1.2'}
            className={passes ? 'animate-flow-dash' : ''}
            filter={passes ? 'url(#neon-glow)' : undefined}
          />
          {/* TRUE Arrowhead */}
          <polygon
            points="430,196 425,186 435,186"
            fill={passes ? '#FF6B6B' : '#3A1E1E'}
          />

          {/* Path 2B: Decision -> FALSE Branch (Left towards Else Block) */}
          <path
            d="M 206 140 H 120 Q 110 140 110 150 V 192"
            fill="none"
            stroke={!passes ? '#E10906' : '#2D1414'}
            strokeWidth={!passes ? '2.5' : '1.2'}
            className={!passes ? 'animate-flow-dash' : ''}
            filter={!passes ? 'url(#neon-glow)' : undefined}
          />
          {/* FALSE Arrowhead */}
          <polygon
            points="110,196 105,186 115,186"
            fill={!passes ? '#FF6B6B' : '#3A1E1E'}
          />

          {/* Path 3A: Loop Block -> Terminal Stdout */}
          <path
            d="M 430 270 V 302 Q 430 312 410 312 H 360"
            fill="none"
            stroke={passes && activeNode >= 2 ? '#E10906' : '#2D1414'}
            strokeWidth={passes && activeNode >= 2 ? '2.2' : '1.2'}
            className={passes && activeNode >= 2 ? 'animate-flow-dash' : ''}
          />

          {/* Path 3B: Else Block -> Terminal Stdout */}
          <path
            d="M 110 270 V 302 Q 110 312 130 312 H 180"
            fill="none"
            stroke={!passes && activeNode >= 2 ? '#E10906' : '#2D1414'}
            strokeWidth={!passes && activeNode >= 2 ? '2.2' : '1.2'}
            className={!passes && activeNode >= 2 ? 'animate-flow-dash' : ''}
          />

          {/* Terminal input arrowheads */}
          <polygon points="356,312 366,307 366,317" fill={passes && activeNode >= 2 ? '#FF6B6B' : '#3A1E1E'} />
          <polygon points="184,312 174,307 174,317" fill={!passes && activeNode >= 2 ? '#FF6B6B' : '#3A1E1E'} />

          {/* =========================================================================
              2. FLOW NODES
              ========================================================================= */}

          {/* NODE 1: INPUT STATE (Top Center) */}
          <g transform="translate(180 14)">
            <rect
              width="180"
              height="40"
              rx="8"
              fill={activeNode === 0 ? 'url(#grad-active-node)' : 'url(#grad-idle-node)'}
              stroke={activeNode === 0 ? '#E10906' : '#3A1A1A'}
              strokeWidth={activeNode === 0 ? '2' : '1.2'}
              filter={activeNode === 0 ? 'url(#neon-glow)' : undefined}
            />
            {/* Node Step Marker */}
            <circle cx="16" cy="20" r="7" fill={activeNode === 0 ? '#E10906' : '#2A1212'} />
            <text x="16" y="23.5" textAnchor="middle" className="fill-white font-mono text-[9px] font-bold">1</text>
            <text x="32" y="17" className="fill-[#8A8585] font-mono text-[9px] font-semibold tracking-wider uppercase">
              VARIABLE INPUT
            </text>
            <text x="32" y="30" className="fill-[#FBF5F9] font-mono text-[11px] font-bold">
              score = <tspan className="fill-[#FF6B6B]">{score}</tspan>
            </text>
          </g>

          {/* NODE 2: CONDITIONAL DECISION (Center Diamond) */}
          <g transform="translate(270 140)">
            {/* Diamond Polygon */}
            <polygon
              points="0,-36 64,0 0,36 -64,0"
              fill={activeNode === 1 ? 'url(#grad-active-node)' : 'url(#grad-idle-node)'}
              stroke={activeNode === 1 ? '#E10906' : passes ? '#B31212' : '#5A2A2A'}
              strokeWidth={activeNode === 1 ? '2.5' : '1.6'}
              filter={activeNode === 1 ? 'url(#neon-glow)' : undefined}
            />

            {/* Corner Calipers */}
            <circle cx="0" cy="-36" r="2.5" fill="#E10906" />
            <circle cx="64" cy="0" r="2.5" fill="#E10906" />
            <circle cx="0" cy="36" r="2.5" fill="#E10906" />
            <circle cx="-64" cy="0" r="2.5" fill="#E10906" />

            {/* Node Step Tag */}
            <text x="0" y="-14" textAnchor="middle" className="fill-[#8A8585] font-mono text-[8.5px] uppercase tracking-wider">
              2. IF DECISION
            </text>
            <text x="0" y="2" textAnchor="middle" className="fill-[#FBF5F9] font-mono text-[11px] font-extrabold">
              score &gt;= 75
            </text>
            <text
              x="0"
              y="18"
              textAnchor="middle"
              className={`font-mono text-[9.5px] font-bold ${passes ? 'fill-[#FF6B6B]' : 'fill-[#E0A0A0]'}`}
            >
              ➔ {passes ? 'TRUE' : 'FALSE'}
            </text>
          </g>

          {/* Branch Decision Badges */}
          {/* TRUE Label Badge */}
          <g transform="translate(346 122)">
            <rect
              width="46"
              height="18"
              rx="4"
              fill={passes ? '#3A0F0F' : '#1A0B0B'}
              stroke={passes ? '#E10906' : '#3A1E1E'}
              strokeWidth="1.2"
            />
            <text x="23" y="12.5" textAnchor="middle" className={`font-mono text-[9.5px] font-bold ${passes ? 'fill-[#FF6B6B]' : 'fill-[#8A8585]'}`}>
              TRUE
            </text>
          </g>

          {/* FALSE Label Badge */}
          <g transform="translate(148 122)">
            <rect
              width="50"
              height="18"
              rx="4"
              fill={!passes ? '#3A0F0F' : '#1A0B0B'}
              stroke={!passes ? '#E10906' : '#3A1E1E'}
              strokeWidth="1.2"
            />
            <text x="25" y="12.5" textAnchor="middle" className={`font-mono text-[9.5px] font-bold ${!passes ? 'fill-[#FF6B6B]' : 'fill-[#8A8585]'}`}>
              FALSE
            </text>
          </g>

          {/* NODE 3A: FOR-LOOP BLOCK (Right Node) */}
          <g transform="translate(348 196)">
            <rect
              width="164"
              height="74"
              rx="8"
              fill={passes && activeNode === 2 ? 'url(#grad-active-node)' : passes ? '#1F0808' : '#140606'}
              stroke={passes ? '#E10906' : '#2D1414'}
              strokeWidth={passes ? '2' : '1'}
              filter={passes && activeNode === 2 ? 'url(#neon-glow)' : undefined}
            />

            {/* Header */}
            <rect x="8" y="8" width="62" height="14" rx="3" fill="#E10906" fillOpacity={passes ? 0.25 : 0.1} />
            <text x="13" y="18" className={`font-mono text-[8.5px] font-bold ${passes ? 'fill-[#FF6B6B]' : 'fill-[#7A4040]'}`}>
              3A. FOR LOOP
            </text>

            {/* Python Code */}
            <text x="12" y="35" className={`font-mono text-[10px] font-bold ${passes ? 'fill-[#FBF5F9]' : 'fill-[#6E5555]'}`}>
              for s in range(1, 4):
            </text>
            <text x="22" y="49" className={`font-mono text-[9.5px] ${passes ? 'fill-[#FF8A8A]' : 'fill-[#5A4545]'}`}>
              print(&quot;Star&quot;, s)
            </text>

            {/* Live Iteration Tracker (s=1, s=2, s=3) */}
            <g transform="translate(12 56)">
              {[1, 2, 3].map((n) => {
                const active = passes && pulseStep === n;
                const completed = passes && pulseStep > n;
                return (
                  <g key={n} transform={`translate(${(n - 1) * 46} 0)`}>
                    <rect
                      width="40"
                      height="13"
                      rx="3"
                      fill={active ? '#E10906' : completed ? '#3A1414' : '#170808'}
                      stroke={active ? '#FF6B6B' : passes ? '#4A1C1C' : '#250E0E'}
                      strokeWidth="1"
                    />
                    <text
                      x="20"
                      y="9.5"
                      textAnchor="middle"
                      className={`font-mono text-[8px] font-bold ${
                        active ? 'fill-white' : completed ? 'fill-[#FF6B6B]' : 'fill-[#8A8585]'
                      }`}
                    >
                      s={n} {active ? '⚡' : ''}
                    </text>
                  </g>
                );
              })}
            </g>
          </g>

          {/* NODE 3B: ELSE FALLBACK BLOCK (Left Node) */}
          <g transform="translate(28 196)">
            <rect
              width="164"
              height="74"
              rx="8"
              fill={!passes && activeNode === 2 ? 'url(#grad-active-node)' : !passes ? '#1F0808' : '#140606'}
              stroke={!passes ? '#E10906' : '#2D1414'}
              strokeWidth={!passes ? '2' : '1'}
              filter={!passes && activeNode === 2 ? 'url(#neon-glow)' : undefined}
            />

            {/* Header */}
            <rect x="8" y="8" width="68" height="14" rx="3" fill="#E10906" fillOpacity={!passes ? 0.25 : 0.1} />
            <text x="13" y="18" className={`font-mono text-[8.5px] font-bold ${!passes ? 'fill-[#FF6B6B]' : 'fill-[#7A4040]'}`}>
              3B. ELSE BLOCK
            </text>

            {/* Python Code */}
            <text x="12" y="35" className={`font-mono text-[10px] font-bold ${!passes ? 'fill-[#FBF5F9]' : 'fill-[#6E5555]'}`}>
              else:
            </text>
            <text x="22" y="49" className={`font-mono text-[9.5px] ${!passes ? 'fill-[#FF8A8A]' : 'fill-[#5A4545]'}`}>
              print(&quot;Retry&quot;)
            </text>

            {/* Fallback label */}
            <text x="12" y="65" className="fill-[#8A8585] font-mono text-[8px]">
              Triggered when score &lt; 75
            </text>
          </g>

          {/* NODE 4: TERMINAL CONSOLE STDOUT (Bottom Center) */}
          <g transform="translate(180 292)">
            <rect
              width="180"
              height="40"
              rx="8"
              fill={activeNode === 3 ? 'url(#grad-active-node)' : '#160606'}
              stroke={activeNode === 3 ? '#E10906' : '#3A1E1E'}
              strokeWidth={activeNode === 3 ? '2' : '1.2'}
              filter={activeNode === 3 ? 'url(#neon-glow)' : undefined}
            />
            {/* Terminal prompt symbol */}
            <rect x="10" y="12" width="16" height="16" rx="3" fill="#2C1212" />
            <text x="18" y="24" textAnchor="middle" className="fill-[#FF6B6B] font-mono text-[10px] font-bold">&gt;_</text>
            
            <text x="34" y="17" className="fill-[#8A8585] font-mono text-[8.5px] uppercase tracking-wider">
              4. CONSOLE OUTPUT
            </text>
            <text x="34" y="30" className="fill-[#FBF5F9] font-mono text-[10px] font-bold truncate">
              {passes ? '"Star 1", "Star 2", "Star 3"' : '"Retry"'}
            </text>
          </g>
        </svg>
      </div>

      {/* =========================================================================
          3. REAL-TIME VARIABLE & EXECUTION TRACE STRIP
          ========================================================================= */}
      <div className="relative z-10 mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-[#2C1616] pt-3">
        <div className="rounded-lg border border-[#2C1616] bg-[#190909] px-2.5 py-1.5 font-mono text-xs">
          <div className="text-[10px] text-[#8A8585]">var: score</div>
          <div className="text-sm font-bold text-[#FF6B6B] tabular-nums">{score}</div>
        </div>

        <div className="rounded-lg border border-[#2C1616] bg-[#190909] px-2.5 py-1.5 font-mono text-xs">
          <div className="text-[10px] text-[#8A8585]">condition</div>
          <div className={`text-sm font-bold ${passes ? 'text-[#FF6B6B]' : 'text-[#8A8585]'}`}>
            {passes ? 'True (>= 75)' : 'False (< 75)'}
          </div>
        </div>

        <div className="rounded-lg border border-[#2C1616] bg-[#190909] px-2.5 py-1.5 font-mono text-xs">
          <div className="text-[10px] text-[#8A8585]">active branch</div>
          <div className="text-xs font-bold text-[#FBF5F9] truncate">
            {passes ? 'for-loop (3x)' : 'else: retry'}
          </div>
        </div>

        <div className="rounded-lg border border-[#2C1616] bg-[#190909] px-2.5 py-1.5 font-mono text-xs">
          <div className="text-[10px] text-[#8A8585]">step sequence</div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF6B6B]">
            {[0, 1, 2, 3].map((step) => (
              <span
                key={step}
                className={`h-2 w-2 rounded-full transition-colors ${
                  pulseStep === step ? 'bg-[#E10906] shadow-[0_0_8px_#E10906]' : 'bg-[#3A1E1E]'
                }`}
              />
            ))}
            <span className="text-[10px] text-[#8A8585] ml-1">
              {['Input', 'Check', 'Branch', 'Output'][pulseStep]}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. BEGINNER-FRIENDLY DYNAMIC LOGIC EXPLANATION
          ========================================================================= */}
      <div className="relative z-10 mt-2.5 rounded-xl border border-[#2C1616] bg-[#180808]/90 p-3">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 rounded-md bg-[#E10906]/20 p-1 text-[#FF6B6B]">
            <GitBranch className="h-4 w-4" />
          </div>
          <div className="flex-1 text-xs leading-relaxed text-[#D6CECE]">
            {passes ? (
              <span>
                <strong className="text-white">Condition is True:</strong> Because <code className="rounded bg-[#2C1212] px-1 py-0.5 font-mono text-[#FF6B6B]">score ({score}) &gt;= 75</code>, Python chooses the green/red flow line and executes the <code className="rounded bg-[#2C1212] px-1 py-0.5 font-mono text-[#FF6B6B]">for s in range(1, 4)</code> loop, printing 3 stars sequentially.
              </span>
            ) : (
              <span>
                <strong className="text-white">Condition is False:</strong> Because <code className="rounded bg-[#2C1212] px-1 py-0.5 font-mono text-[#FF6B6B]">score ({score}) &lt; 75</code>, Python completely skips the loop block and routes straight to the <code className="rounded bg-[#2C1212] px-1 py-0.5 font-mono text-[#FF6B6B]">else</code> branch, outputting <code className="rounded bg-[#2C1212] px-1 py-0.5 font-mono text-[#FF6B6B]">&quot;Retry&quot;</code>.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. INTERACTIVE CONTROL STRIP (SLIDER + PRESETS + PLAY/PAUSE)
          ========================================================================= */}
      <div className="relative z-10 mt-3 rounded-xl border border-[#2C1616] bg-[#190909] p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="hero-score-slider" className="text-xs font-semibold text-[#FBF5F9]">
            Adjust <code className="font-mono text-[#FF6B6B]">score</code> to test Python conditional branching:
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="flex items-center gap-1 rounded bg-[#2C1616] px-2 py-0.5 text-[11px] font-mono text-[#FBF5F9] hover:bg-[#3E1F1F] transition-colors"
              title={isPlaying ? 'Pause Auto Step' : 'Resume Auto Step'}
            >
              {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 text-[#FF6B6B]" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <span className="font-mono text-sm font-bold text-[#FF6B6B] tabular-nums">
              {score} / 100
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <input
          id="hero-score-slider"
          type="range"
          min={30}
          max={100}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="mt-2.5 w-full accent-[#E10906] cursor-pointer"
        />

        {/* Presets and Output Bar */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#2C1616] pt-2.5">
          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-[#8A8585] mr-1">Presets:</span>
            {presets.map((p) => (
              <button
                key={p.val}
                onClick={() => setScore(p.val)}
                className={`rounded px-2 py-0.5 text-[10px] font-mono font-semibold transition-all ${
                  score === p.val
                    ? 'bg-[#E10906] text-white shadow-[0_0_8px_#E10906]'
                    : 'bg-[#2A1212] text-[#D8CECE] hover:bg-[#3D1A1A]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Quick Telemetry */}
          <div className="font-mono text-[11px] text-[#8A8585]">
            Loop count: <strong className="text-[#FF6B6B]">{loopCount}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
