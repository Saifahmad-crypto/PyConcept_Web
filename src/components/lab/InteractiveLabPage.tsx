import React from 'react';
import {
  Cpu,
  GitBranch,
  Repeat,
  Box,
  Play,
  Workflow,
  ArrowUpRight,
} from 'lucide-react';
import {
  LabTabId,
  SimulatorId,
  TutorSimulatorContext,
} from '../../types';
import { SIMULATORS_CATALOG } from '../../simulators/simulatorsData';
import { SimulatorsSection } from '../simulators/SimulatorsSection';
import { ConditionalSimulator } from '../ConditionalSimulator';
import { LoopVisualizer } from '../LoopVisualizer';
import { VisualMemoryExplorer } from './VisualMemoryExplorer';
import { CodeExecutionVisualizer } from './CodeExecutionVisualizer';
import { FlowchartBuilder } from './FlowchartBuilder';

interface InteractiveLabPageProps {
  activeTab: LabTabId;
  onChangeTab: (tab: LabTabId) => void;
  selectedSimulator: SimulatorId | null;
  onSelectSimulator: (id: SimulatorId | null) => void;
  visitedSimulators: string[];
  onRecordSimulatorRun: (id: SimulatorId) => void;
  onAskTutor: (ctx: TutorSimulatorContext) => void;
  onOpenInStudio: (code: string) => void;
  completedChallenges?: string[];
  onOpenChallenge?: (challengeId: string) => void;
}

const LAB_TABS: Array<{
  id: Exclude<LabTabId, 'conditional-sim' | 'loop-viz' | 'games'>;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'simulators', label: 'All Simulators (8)', icon: Cpu },
  { id: 'conditionals-lab', label: 'Conditional Lab', icon: GitBranch },
  { id: 'loops-lab', label: 'Loop Lab', icon: Repeat },
  { id: 'memory-explorer', label: 'Memory Explorer', icon: Box },
  { id: 'execution-visualizer', label: 'Execution Visualizer', icon: Play },
  { id: 'flowchart-builder', label: 'Flowchart Builder', icon: Workflow },
];

export const InteractiveLabPage: React.FC<InteractiveLabPageProps> = ({
  activeTab,
  onChangeTab,
  selectedSimulator,
  onSelectSimulator,
  visitedSimulators,
  onRecordSimulatorRun,
  onAskTutor,
  onOpenInStudio,
  completedChallenges = [],
  onOpenChallenge,
}) => {
  const normalizedTab: Exclude<LabTabId, 'conditional-sim' | 'loop-viz' | 'games'> =
    activeTab === 'conditional-sim'
      ? 'conditionals-lab'
      : activeTab === 'loop-viz'
      ? 'loops-lab'
      : activeTab === 'games'
      ? 'simulators'
      : activeTab;

  const conditionalSimulators = SIMULATORS_CATALOG.filter((s) => s.category === 'conditionals');
  const loopSimulators = SIMULATORS_CATALOG.filter((s) => s.category === 'loops');

  const launchSimulator = (id: SimulatorId) => {
    onChangeTab('simulators');
    onSelectSimulator(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Lab Header & Tool Switcher */}
      <div className="border-b border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold text-[#E10906]">
                PyVerse Visual Laboratory
              </p>
              <h1 className="mt-1 font-display text-3xl font-extrabold text-[#100303] dark:text-[#f0eaea] sm:text-4xl">
                Interactive Lab
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm text-[#8A8585] dark:text-[#9a8585]">
                Run 8 real-life Python simulators, inspect live variable memory, trace line-by-line execution, and design flowcharts that compile to Python.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-4 py-2 text-xs">
              <span className="text-[#8A8585] dark:text-[#9a8585]">Simulators Explored:</span>
              <span className="font-mono font-bold text-[#E10906] tabular-nums">
                {visitedSimulators.length} / {SIMULATORS_CATALOG.length}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-1.5">
            {LAB_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = normalizedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    if (tab.id === 'simulators' && normalizedTab === 'simulators') {
                      onSelectSimulator(null);
                    }
                    onChangeTab(tab.id);
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 font-display text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#E10906] text-white shadow-sm'
                      : 'text-[#8A8585] dark:text-[#9a8585] hover:bg-white dark:hover:bg-[#221010] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {normalizedTab === 'simulators' && (
        <SimulatorsSection
          selectedSimulator={selectedSimulator}
          onSelectSimulator={onSelectSimulator}
          visitedSimulators={visitedSimulators}
          onRecordSimulatorRun={onRecordSimulatorRun}
          onAskTutor={onAskTutor}
          completedChallenges={completedChallenges}
          onOpenChallenge={onOpenChallenge}
        />
      )}

      {normalizedTab === 'conditionals-lab' && (
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFF1F1]/70 dark:bg-[#2a0808]/70 p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">
                Real-Life Conditional Simulators
              </p>
              <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
                Jump directly into any of the 4 interactive conditional decision machines:
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {conditionalSimulators.map((sim) => (
                <button
                  key={sim.id}
                  type="button"
                  onClick={() => launchSimulator(sim.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3 py-1.5 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906] whitespace-nowrap"
                >
                  {sim.title}
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#E10906]" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          <ConditionalSimulator
            completedChallenges={completedChallenges}
            onOpenChallenge={onOpenChallenge}
          />
        </div>
      )}

      {normalizedTab === 'loops-lab' && (
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFF1F1]/70 dark:bg-[#2a0808]/70 p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">
                Real-Life Loop Simulators
              </p>
              <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
                Explore real-world iteration machines with live FPS &amp; speed controls:
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {loopSimulators.map((sim) => (
                <button
                  key={sim.id}
                  type="button"
                  onClick={() => launchSimulator(sim.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3 py-1.5 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906] whitespace-nowrap"
                >
                  {sim.title}
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#E10906]" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          <LoopVisualizer
            completedChallenges={completedChallenges}
            onOpenChallenge={onOpenChallenge}
          />
        </div>
      )}

      {normalizedTab === 'memory-explorer' && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <VisualMemoryExplorer />
        </div>
      )}

      {normalizedTab === 'execution-visualizer' && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <CodeExecutionVisualizer />
        </div>
      )}

      {normalizedTab === 'flowchart-builder' && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <FlowchartBuilder onOpenInStudio={onOpenInStudio} />
        </div>
      )}
    </div>
  );
};
