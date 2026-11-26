import React from 'react';
import { Gamepad2, Code2, HelpCircle, Cpu } from 'lucide-react';
import {
  GamesHubTabId,
  GameScoreRecord,
  QuizScoreRecord,
} from '../types';
import { MiniGames } from './MiniGames';
import { ChallengesSection } from './ChallengesSection';
import { QuizSection } from './QuizSection';
import { ConditionalSimulator } from './ConditionalSimulator';
import { LoopVisualizer } from './LoopVisualizer';

interface GamesAndChallengesHubProps {
  activeTab: GamesHubTabId;
  onChangeTab: (tab: GamesHubTabId) => void;
  gameScores: Record<string, GameScoreRecord>;
  gameAttempts: Record<string, number>;
  onRecordGameScore: (gameId: string, score: number, maxScore: number) => void;
  completedChallenges: string[];
  onCompleteChallenge: (id: string) => void;
  quizScores: {
    conditionals: QuizScoreRecord | null;
    loops: QuizScoreRecord | null;
  };
  onRecordQuizResult: (topic: 'conditionals' | 'loops', score: number, total: number) => void;
}

const HUB_TABS: Array<{
  id: GamesHubTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'mini-games', label: 'Mini-Games (8)', icon: Gamepad2 },
  { id: 'challenges', label: 'Coding Challenges (10)', icon: Code2 },
  { id: 'quizzes', label: 'Topic Quizzes (20)', icon: HelpCircle },
  { id: 'logic-lab', label: 'Visual Logic Lab', icon: Cpu },
];

export const GamesAndChallengesHub: React.FC<GamesAndChallengesHubProps> = ({
  activeTab,
  onChangeTab,
  gameScores,
  gameAttempts,
  onRecordGameScore,
  completedChallenges,
  onCompleteChallenge,
  quizScores,
  onRecordQuizResult,
}) => {
  return (
    <div>
      {/* Unified Hub Top Header & Mode Switcher */}
      <div className="border-b border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-end lg:px-8">
          <div>
            <p className="text-xs font-semibold text-[#E10906]">
              PyVerse Practice Arena
            </p>
            <h1 className="mt-1 font-display text-3xl font-extrabold text-[#100303] dark:text-[#f0eaea] sm:text-4xl">
              Games, Challenges &amp; Quizzes
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-[#8A8585] dark:text-[#9a8585]">
              Train Python instincts through 8 logic mini-games, 10 verified coding challenges, 20
              quiz questions, and step-by-step visual labs.
            </p>
          </div>

          <div className="inline-flex flex-wrap rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-1 gap-1">
            {HUB_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onChangeTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 font-display text-xs font-semibold transition-all whitespace-nowrap ${
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

      {/* Active Sub-View */}
      {activeTab === 'mini-games' && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <MiniGames
            gameScores={gameScores}
            gameAttempts={gameAttempts}
            onRecordGameScore={onRecordGameScore}
          />
        </div>
      )}

      {activeTab === 'challenges' && (
        <ChallengesSection
          completedChallenges={completedChallenges}
          onCompleteChallenge={onCompleteChallenge}
        />
      )}

      {activeTab === 'quizzes' && (
        <QuizSection
          quizScores={quizScores}
          onRecordQuizResult={onRecordQuizResult}
        />
      )}

      {activeTab === 'logic-lab' && (
        <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
          <ConditionalSimulator />
          <div className="border-t border-[#E5DFDF] dark:border-[#3a1a1a] pt-10">
            <LoopVisualizer />
          </div>
        </div>
      )}
    </div>
  );
};
