import React from 'react';
import { Gamepad2, KeyRound, Bug, Code2, HelpCircle, Cpu } from 'lucide-react';
import {
  GamesHubTabId,
  GameScoreRecord,
  QuizScoreRecord,
  TopicId,
} from '../../types';
import { MiniGames } from '../MiniGames';
import { ChallengesSection } from '../ChallengesSection';
import { QuizSection } from '../QuizSection';
import { ConditionalSimulator } from '../ConditionalSimulator';
import { LoopVisualizer } from '../LoopVisualizer';
import { PythonEscapeRoom } from './PythonEscapeRoom';
import { BugHunterLab } from './BugHunterLab';

interface GameZonePageProps {
  activeTab: GamesHubTabId;
  onChangeTab: (tab: GamesHubTabId) => void;
  gameScores: Record<string, GameScoreRecord>;
  gameAttempts: Record<string, number>;
  onRecordGameScore: (gameId: string, score: number, maxScore: number) => void;
  completedEscapeRooms: string[];
  onCompleteEscapeRoom: (roomId: string, title: string) => void;
  completedBugHunts: string[];
  onCompleteBugHunt: (
    bugId: string,
    title: string,
    topic: TopicId,
    xpReward: number
  ) => void;
  completedChallenges: string[];
  onCompleteChallenge: (id: string) => void;
  quizScores: {
    conditionals: QuizScoreRecord | null;
    loops: QuizScoreRecord | null;
  };
  onRecordQuizResult: (topic: 'conditionals' | 'loops', score: number, total: number) => void;
}

const GAME_ZONE_TABS: Array<{
  id: GamesHubTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'mini-games', label: 'Mini-Games (8)', icon: Gamepad2 },
  { id: 'escape-room', label: 'Python Escape Room', icon: KeyRound },
  { id: 'bug-hunter', label: 'Bug Hunter Lab', icon: Bug },
  { id: 'challenges', label: 'Coding Challenges', icon: Code2 },
  { id: 'quizzes', label: 'Topic Quizzes', icon: HelpCircle },
];

export const GameZonePage: React.FC<GameZonePageProps> = ({
  activeTab,
  onChangeTab,
  gameScores,
  gameAttempts,
  onRecordGameScore,
  completedEscapeRooms,
  onCompleteEscapeRoom,
  completedBugHunts,
  onCompleteBugHunt,
  completedChallenges,
  onCompleteChallenge,
  quizScores,
  onRecordQuizResult,
}) => {
  return (
    <div>
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold text-[#8B5CF6]">
                PyVerse Game Zone &amp; Arena
              </p>
              <h1 className="mt-1 font-display text-3xl font-extrabold text-[#1E293B] sm:text-4xl">
                Learn Through Play &amp; Debugging
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm text-[#64748B]">
                Master Python logic across 8 mini-games, the 5-room Python Code Vault escape mission, Bug Hunter Lab debugging challenges, coding tasks, and topic quizzes.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-1.5">
            {GAME_ZONE_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onChangeTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 font-display text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#8B5CF6] text-white shadow-sm'
                      : 'text-[#64748B] hover:bg-white hover:text-[#1E293B]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
            {activeTab === 'logic-lab' && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-sky-100 px-3 py-2 text-xs font-semibold text-sky-900">
                <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
                Visual Logic Lab
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Views */}
      {activeTab === 'mini-games' && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <MiniGames
            gameScores={gameScores}
            gameAttempts={gameAttempts}
            onRecordGameScore={onRecordGameScore}
          />
        </div>
      )}

      {activeTab === 'escape-room' && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <PythonEscapeRoom
            completedEscapeRooms={completedEscapeRooms}
            onCompleteRoom={onCompleteEscapeRoom}
          />
        </div>
      )}

      {activeTab === 'bug-hunter' && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <BugHunterLab
            completedBugHunts={completedBugHunts}
            onCompleteBugHunt={onCompleteBugHunt}
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
          <div className="border-t border-slate-200 pt-10">
            <LoopVisualizer />
          </div>
        </div>
      )}
    </div>
  );
};
