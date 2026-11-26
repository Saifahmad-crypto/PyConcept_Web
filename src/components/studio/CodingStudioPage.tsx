import React from 'react';
import { Terminal, Code2, Bookmark } from 'lucide-react';
import { SavedSnippet, StudioTabId } from '../../types';
import { CODING_CHALLENGES } from '../../data/curriculumData';
import { CodePlayground } from '../CodePlayground';
import { ChallengesSection } from '../ChallengesSection';

interface CodingStudioPageProps {
  activeTab: StudioTabId;
  onChangeTab: (tab: StudioTabId) => void;
  externalCode: string | null;
  onConsumeExternalCode: () => void;
  onRecordSandboxRun: () => void;
  savedSnippets: SavedSnippet[];
  onSaveSnippet: (title: string, code: string) => void;
  onDeleteSnippet: (id: string) => void;
  completedChallenges: string[];
  onCompleteChallenge: (id: string) => void;
  externalChallengeId?: string | null;
  onConsumeExternalChallenge?: () => void;
}

export const CodingStudioPage: React.FC<CodingStudioPageProps> = ({
  activeTab,
  onChangeTab,
  externalCode,
  onConsumeExternalCode,
  onRecordSandboxRun,
  savedSnippets,
  onSaveSnippet,
  onDeleteSnippet,
  completedChallenges,
  onCompleteChallenge,
  externalChallengeId,
  onConsumeExternalChallenge,
}) => {
  return (
    <div>
      {/* Studio Header & Sub-Navigation */}
      <div className="border-b border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-end lg:px-8">
          <div>
            <p className="text-xs font-semibold text-[#E10906]">
              PyVerse Coding Studio
            </p>
            <h1 className="mt-1 font-display text-3xl font-extrabold text-[#100303] dark:text-[#f0eaea] sm:text-4xl">
              Write, Save &amp; Verify Python
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-[#8A8585] dark:text-[#9a8585]">
              Experiment freely in the interactive Python Sandbox with saved snippets, or verify your skills across 10 guided coding challenges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3.5 py-2 text-xs">
              <span className="inline-flex items-center gap-1 text-[#8A8585] dark:text-[#9a8585]">
                <Bookmark className="h-3.5 w-3.5 text-[#E10906]" aria-hidden="true" />
                Snippets: <strong className="font-mono text-[#100303] dark:text-[#f0eaea]">{savedSnippets.length}</strong>
              </span>
              <span className="text-[#CFC8C8]">|</span>
              <span className="text-[#8A8585] dark:text-[#9a8585]">
                Challenges:{' '}
                <strong className="font-mono text-emerald-700 dark:text-emerald-300">
                  {completedChallenges.length}/{CODING_CHALLENGES.length}
                </strong>
              </span>
            </div>

            <div className="inline-flex rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-1 gap-1">
              <button
                type="button"
                onClick={() => onChangeTab('sandbox')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-display text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'sandbox'
                    ? 'bg-[#E10906] text-white shadow-sm'
                    : 'text-[#8A8585] dark:text-[#9a8585] hover:bg-white dark:hover:bg-[#221010] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                }`}
              >
                <Terminal className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Python Sandbox
              </button>
              <button
                type="button"
                onClick={() => onChangeTab('challenges')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-display text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'challenges'
                    ? 'bg-[#E10906] text-white shadow-sm'
                    : 'text-[#8A8585] dark:text-[#9a8585] hover:bg-white dark:hover:bg-[#221010] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                }`}
              >
                <Code2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Coding Challenges ({CODING_CHALLENGES.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'sandbox' ? (
        <CodePlayground
          externalCode={externalCode}
          onConsumeExternalCode={onConsumeExternalCode}
          onRecordSandboxRun={onRecordSandboxRun}
          savedSnippets={savedSnippets}
          onSaveSnippet={onSaveSnippet}
          onDeleteSnippet={onDeleteSnippet}
        />
      ) : (
        <ChallengesSection
          completedChallenges={completedChallenges}
          onCompleteChallenge={onCompleteChallenge}
          externalChallengeId={externalChallengeId}
          onConsumeExternalChallenge={onConsumeExternalChallenge}
        />
      )}
    </div>
  );
};
