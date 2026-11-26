import React from 'react';
import { GitBranch, Repeat, Gamepad2 } from 'lucide-react';
import { GameScoreRecord, LabTabId } from '../types';
import { ConditionalSimulator } from './ConditionalSimulator';
import { LoopVisualizer } from './LoopVisualizer';
import { MiniGames } from './MiniGames';

interface InteractiveLabProps {
  activeTab: LabTabId;
  onChangeTab: (tab: LabTabId) => void;
  gameScores: Record<string, GameScoreRecord>;
  onRecordGameScore: (gameId: string, score: number, maxScore: number) => void;
}

export const InteractiveLab: React.FC<InteractiveLabProps> = ({
  activeTab,
  onChangeTab,
  gameScores,
  onRecordGameScore,
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Lab Header & Mode Tabs */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-800/80 pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-medium text-blue-400">Interactive Lab</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-white sm:text-4xl">
            Visual Simulators &amp; Logic Games
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Step through Python code line by line, watch live flowcharts and loop progression charts,
            and test your mastery in 8 interactive mini-games.
          </p>
        </div>

        <div className="inline-flex flex-wrap rounded-xl border border-slate-800 bg-[#0D1426] p-1 gap-1">
          <button
            type="button"
            onClick={() => onChangeTab('conditional-sim')}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'conditional-sim'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
            Conditional Simulator
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('loop-viz')}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'loop-viz'
                ? 'bg-violet-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Repeat className="h-3.5 w-3.5" aria-hidden="true" />
            Loop Visualizer
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('games')}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'games'
                ? 'bg-sky-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
            Mini Games (8)
          </button>
        </div>
      </div>

      {activeTab === 'conditional-sim' && <ConditionalSimulator />}
      {activeTab === 'loop-viz' && <LoopVisualizer />}
      {activeTab === 'games' && (
        <MiniGames gameScores={gameScores} onRecordGameScore={onRecordGameScore} />
      )}
    </div>
  );
};
