import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const HeroVisual: React.FC = () => {
  const [score, setScore] = useState(84);
  const [pulseStep, setPulseStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPulseStep((prev) => (prev + 1) % 4);
    }, 1150);
    return () => window.clearInterval(timer);
  }, []);

  const passes = score >= 75;
  const loopCount = passes ? 3 : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#2C1616] bg-[#140505] p-5 sm:p-6 shadow-2xl">
      {/* Subtle architectural corner ticks */}
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true">
        <div className="absolute left-3 top-3 h-3 w-3 border-l border-t border-[#E10906]" />
        <div className="absolute right-3 top-3 h-3 w-3 border-r border-t border-[#E10906]" />
        <div className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[#E10906]" />
        <div className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#E10906]" />
      </div>

      {/* Top Telemetry Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-[#2C1616] pb-3.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#E10906]" aria-hidden="true" />
          <span className="font-mono text-[11px] font-semibold tracking-wider text-[#FBF5F9] uppercase">
            Live Logic Nexus
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-[#8A8585]">state:</span>
          <span
            className={`rounded px-2 py-0.5 font-semibold ${
              passes
                ? 'bg-[#E10906]/20 text-[#FF6B6B] border border-[#E10906]/40'
                : 'bg-[#2C1616] text-[#FBF5F9] border border-[#3A2222]'
            }`}
          >
            {passes ? 'TRUE · LOOP ×3' : 'FALSE · FALLBACK'}
          </span>
        </div>
      </div>

      {/* Central 3D-Inspired Sculptural SVG Stage */}
      <div className="relative z-10 mt-4 flex flex-col items-center">
        <svg
          viewBox="0 0 460 320"
          className="h-auto w-full max-w-[460px] select-none"
          role="img"
          aria-label={`Interactive PyVerse visual sculpture showing human hand vector meeting Python decision tree with score ${score}`}
        >
          <defs>
            <linearGradient id="pv-hand-grad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#2A1212" />
              <stop offset="60%" stopColor="#FBF5F9" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#E10906" />
            </linearGradient>
            <linearGradient id="pv-red-beam" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E10906" />
              <stop offset="100%" stopColor="#FF6B6B" />
            </linearGradient>
            <pattern id="pv-dots" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.8" fill="#FBF5F9" fillOpacity="0.16" />
            </pattern>
          </defs>

          {/* 3D Isometric Grid Plane */}
          <polygon
            points="230,28 430,115 230,205 30,115"
            fill="url(#pv-dots)"
            stroke="#2C1616"
            strokeWidth="1"
          />
          <polygon
            points="230,68 380,132 230,198 80,132"
            fill="none"
            stroke="#E10906"
            strokeOpacity="0.24"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Orbital Loop Ring (3D tilted ellipse) */}
          <g transform="translate(230 120)">
            <ellipse
              rx="116"
              ry="44"
              transform="rotate(-12)"
              fill="none"
              stroke={passes ? '#E10906' : '#3A2222'}
              strokeWidth={passes ? '1.8' : '1.2'}
              strokeDasharray="6 5"
              className={passes ? 'animate-flow-dash' : ''}
            />
            <ellipse
              rx="86"
              ry="32"
              transform="rotate(14)"
              fill="none"
              stroke="#FBF5F9"
              strokeOpacity="0.22"
              strokeWidth="1"
            />
          </g>

          {/* Stylized Architectural Hand Vector (Lower Left reaching to Nexus Core) */}
          <g>
            {/* Forearm & Wrist */}
            <path
              d="M28 308 L86 246 L116 266 L64 316 Z"
              fill="#190909"
              stroke="#FBF5F9"
              strokeOpacity="0.35"
              strokeWidth="1.2"
            />
            {/* Geometric Palm */}
            <polygon
              points="86,246 130,202 162,216 140,256 116,266"
              fill="#1E0B0B"
              stroke="url(#pv-hand-grad)"
              strokeWidth="1.5"
            />
            {/* Articulated Finger Vectors */}
            <path
              d="M130 202 L152 168 L174 146"
              fill="none"
              stroke="#FBF5F9"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M142 208 L172 178 L194 156"
              fill="none"
              stroke="#E10906"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d="M152 216 L180 194 L196 180"
              fill="none"
              stroke="#FBF5F9"
              strokeOpacity="0.7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M116 232 L124 196 L142 184"
              fill="none"
              stroke="#FBF5F9"
              strokeOpacity="0.5"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Joint Nodes */}
            {[
              [130, 202],
              [152, 168],
              [174, 146],
              [172, 178],
              [194, 156],
            ].map(([cx, cy], idx) => (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r="3.2"
                fill={idx === 4 ? '#E10906' : '#FBF5F9'}
              />
            ))}
          </g>

          {/* Decision Diamond Core */}
          <g transform="translate(230 118)">
            <polygon
              points="0,-36 58,0 0,36 -58,0"
              fill="#190909"
              stroke={pulseStep === 1 ? '#E10906' : '#FBF5F9'}
              strokeWidth="2"
            />
            <text
              x="0"
              y="-3"
              textAnchor="middle"
              className="fill-[#8A8585] font-mono text-[8.5px]"
            >
              if condition
            </text>
            <text
              x="0"
              y="10"
              textAnchor="middle"
              className="fill-[#FBF5F9] font-mono text-[10.5px] font-bold"
            >
              score &gt;= 75
            </text>
          </g>

          {/* Branch Pathways */}
          {/* TRUE PATH (Top-Right Loop Cluster) */}
          <path
            d="M 288 118 L 355 118 L 355 72"
            fill="none"
            stroke={passes ? '#E10906' : '#3A2222'}
            strokeWidth={passes ? '2.4' : '1.4'}
            className={passes ? 'animate-flow-dash' : ''}
          />
          <text
            x="324"
            y="109"
            textAnchor="middle"
            className={`font-mono text-[9px] font-bold ${
              passes ? 'fill-[#FF6B6B]' : 'fill-[#8A8585]'
            }`}
          >
            True
          </text>

          <g transform="translate(302 26)">
            <rect
              width="126"
              height="46"
              rx="8"
              fill={passes ? '#1F0808' : '#160707'}
              stroke={passes ? '#E10906' : '#2C1616'}
              strokeWidth={passes ? '2' : '1.2'}
            />
            <text x="12" y="19" className="fill-[#FF6B6B] font-mono text-[9.5px] font-bold">
              for s in range(1, 4):
            </text>
            <text x="12" y="34" className="fill-[#FBF5F9] font-mono text-[9.5px]">
              print(&quot;Star&quot;, s)
            </text>
          </g>

          {/* Loop Iteration Badges */}
          {[1, 2, 3].map((n) => {
            const active = passes && pulseStep >= n;
            return (
              <g key={n} transform={`translate(${296 + (n - 1) * 44} 148)`}>
                <rect
                  width="36"
                  height="24"
                  rx="6"
                  fill={active ? '#E10906' : '#190909'}
                  stroke={passes ? '#E10906' : '#2C1616'}
                  strokeWidth="1.2"
                />
                <text
                  x="18"
                  y="15.5"
                  textAnchor="middle"
                  className={`font-mono text-[9px] font-bold ${
                    active ? 'fill-white' : 'fill-[#8A8585]'
                  }`}
                >
                  s={n}
                </text>
              </g>
            );
          })}

          {/* FALSE PATH (Bottom-Right Fallback Node) */}
          <path
            d="M 230 154 L 230 226 L 306 226"
            fill="none"
            stroke={!passes ? '#E10906' : '#3A2222'}
            strokeWidth={!passes ? '2.4' : '1.4'}
            className={!passes ? 'animate-flow-dash' : ''}
          />
          <text
            x="258"
            y="217"
            textAnchor="middle"
            className={`font-mono text-[9px] font-bold ${
              !passes ? 'fill-[#FF6B6B]' : 'fill-[#8A8585]'
            }`}
          >
            False
          </text>

          <g transform="translate(306 204)">
            <rect
              width="124"
              height="44"
              rx="8"
              fill={!passes ? '#1F0808' : '#160707'}
              stroke={!passes ? '#E10906' : '#2C1616'}
              strokeWidth={!passes ? '2' : '1.2'}
            />
            <text x="12" y="18" className="fill-[#8A8585] font-mono text-[9px]">
              else:
            </text>
            <text x="12" y="33" className="fill-[#FBF5F9] font-mono text-[9.5px]">
              print(&quot;Retry&quot;)
            </text>
          </g>

          {/* Floating Code Fragment Top-Left */}
          <motion.g
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            transform="translate(22 24)"
          >
            <rect
              width="134"
              height="42"
              rx="8"
              fill="#190909"
              stroke="#2C1616"
              strokeWidth="1.2"
            />
            <text x="12" y="17" className="fill-[#8A8585] font-mono text-[9px]">
              # input state
            </text>
            <text x="12" y="32" className="fill-[#FBF5F9] font-mono text-[10.5px] font-bold">
              score = <tspan className="fill-[#FF6B6B]">{score}</tspan>
            </text>
          </motion.g>
        </svg>
      </div>

      {/* Interactive Experiment Control Strip */}
      <div className="relative z-10 mt-3 rounded-xl border border-[#2C1616] bg-[#190909] p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label
            htmlFor="hero-score-slider"
            className="text-xs font-medium text-[#FBF5F9]"
          >
            Drag <code className="font-mono text-[#FF6B6B]">score</code> to switch the live execution branch:
          </label>
          <span className="font-mono text-sm font-bold text-[#FF6B6B] tabular-nums">
            {score} / 100
          </span>
        </div>

        <input
          id="hero-score-slider"
          type="range"
          min={30}
          max={100}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="mt-2.5 w-full accent-[#E10906] cursor-pointer"
        />

        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#2C1616] pt-2.5 font-mono text-[11px]">
          <span className="text-[#8A8585]">
            Output:{' '}
            <strong className="text-[#FBF5F9]">
              {passes ? 'Star 1 · Star 2 · Star 3' : 'Retry'}
            </strong>
          </span>
          <span className="text-[#8A8585] tabular-nums">
            Iterations: <strong className="text-[#FF6B6B]">{loopCount}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
