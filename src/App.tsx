import { useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  GamesHubTabId,
  LabTabId,
  RevisionTabId,
  SectionId,
  SimulatorId,
  StudioTabId,
  TopicId,
  TutorSimulatorContext,
} from './types';
import { useProgress } from './hooks/useProgress';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { LearningWorldPage } from './components/LearningWorldPage';
import { InteractiveLabPage } from './components/lab/InteractiveLabPage';
import { GameZonePage } from './components/games/GameZonePage';
import { CodingStudioPage } from './components/studio/CodingStudioPage';
import { AdaptiveTutorPage } from './components/tutor/AdaptiveTutorPage';
import { RevisionHubPage } from './components/revision/RevisionHubPage';
import { ProgressDashboard } from './components/ProgressDashboard';
import { GlobalSearchModal } from './components/GlobalSearchModal';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [activeTopic, setActiveTopic] = useState<TopicId>('basics');
  const [activeLabTab, setActiveLabTab] = useState<LabTabId>('simulators');
  const [activeGamesTab, setActiveGamesTab] = useState<GamesHubTabId>('mini-games');
  const [activeStudioTab, setActiveStudioTab] = useState<StudioTabId>('sandbox');
  const [activeRevisionTab, setActiveRevisionTab] = useState<RevisionTabId>('cheat-sheets');
  const [selectedSimulator, setSelectedSimulator] = useState<SimulatorId | null>(null);
  const [sandboxCode, setSandboxCode] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [pendingTutorSimContext, setPendingTutorSimContext] =
    useState<TutorSimulatorContext | null>(null);

  const {
    progress,
    toggleLesson,
    completeMission,
    completeDailyQuest,
    markChallengeComplete,
    completeBugHunt,
    completeEscapeRoom,
    toggleFlashcardUnderstood,
    recordQuizResult,
    recordGameScore,
    recordSimulatorRun,
    recordSandboxRun,
    saveSnippet,
    deleteSnippet,
    updatePreferences,
    setTutorTopic,
    setTutorDifficulty,
    markConceptUnderstood,
    markConceptToReview,
    removeConceptTag,
    recordPracticeAttempt,
    resetProgress,
  } = useProgress();

  // Global keyboard shortcut Ctrl+K / Cmd+K for PyVerse Search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const navigateTo = useCallback((section: SectionId) => {
    if (section === 'simulators') {
      setActiveLabTab('simulators');
      setSelectedSimulator(null);
      setActiveSection('lab');
    } else if (section === 'playground') {
      setActiveStudioTab('sandbox');
      setActiveSection('studio');
    } else if (section === 'challenges') {
      setActiveStudioTab('challenges');
      setActiveSection('studio');
    } else if (section === 'quiz') {
      setActiveRevisionTab('quizzes');
      setActiveSection('revision');
    } else {
      setActiveSection(section);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openTopic = useCallback(
    (topic: TopicId) => {
      setActiveTopic(topic);
      navigateTo('learn');
    },
    [navigateTo]
  );

  const openLabTab = useCallback(
    (tab: LabTabId) => {
      setActiveLabTab(tab);
      if (tab === 'simulators') {
        setSelectedSimulator(null);
      }
      navigateTo('lab');
    },
    [navigateTo]
  );

  const openGamesTab = useCallback(
    (tab: GamesHubTabId) => {
      setActiveGamesTab(tab);
      navigateTo('games');
    },
    [navigateTo]
  );

  const openRevisionTab = useCallback(
    (tab: RevisionTabId) => {
      setActiveRevisionTab(tab);
      navigateTo('revision');
    },
    [navigateTo]
  );

  const handleOpenInPlayground = useCallback(
    (code: string) => {
      setSandboxCode(code);
      setActiveStudioTab('sandbox');
      navigateTo('studio');
    },
    [navigateTo]
  );

  const handleConsumeSandboxCode = useCallback(() => {
    setSandboxCode(null);
  }, []);

  const handleAskTutorFromSimulator = useCallback(
    (ctx: TutorSimulatorContext) => {
      setPendingTutorSimContext(ctx);
      navigateTo('tutor');
    },
    [navigateTo]
  );

  const handleConsumeSimulatorContext = useCallback(() => {
    setPendingTutorSimContext(null);
  }, []);

  const reducedMotion = progress.preferences.reducedMotion;

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-[#1E293B]">
      <Navbar
        activeSection={activeSection}
        xp={progress.xp}
        preferences={progress.preferences}
        onUpdatePreferences={updatePreferences}
        onOpenSearch={() => setSearchOpen(true)}
        onNavigate={navigateTo}
      />

      <main className="flex-1 bg-pyverse-soft">
        <motion.div
          key={`${activeSection}-${activeLabTab}-${selectedSimulator ?? 'hub'}`}
          initial={reducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.18, ease: 'easeOut' }}
        >
          {activeSection === 'home' && (
            <HomePage
              progress={progress}
              onNavigate={navigateTo}
              onOpenTopic={openTopic}
              onOpenLabTab={openLabTab}
              onOpenGamesTab={openGamesTab}
              onOpenRevisionTab={openRevisionTab}
              onCompleteDailyQuest={completeDailyQuest}
            />
          )}

          {activeSection === 'learn' && (
            <LearningWorldPage
              activeTopic={activeTopic}
              onChangeTopic={setActiveTopic}
              progress={progress}
              onToggleLesson={toggleLesson}
              onCompleteMission={completeMission}
              onCompleteDailyQuest={completeDailyQuest}
              onNavigate={navigateTo}
              onOpenGamesTab={openGamesTab}
              onOpenInSandbox={handleOpenInPlayground}
            />
          )}

          {activeSection === 'lab' && (
            <InteractiveLabPage
              activeTab={activeLabTab}
              onChangeTab={setActiveLabTab}
              selectedSimulator={selectedSimulator}
              onSelectSimulator={setSelectedSimulator}
              visitedSimulators={progress.visitedSimulators}
              onRecordSimulatorRun={recordSimulatorRun}
              onAskTutor={handleAskTutorFromSimulator}
              onOpenInStudio={handleOpenInPlayground}
            />
          )}

          {activeSection === 'games' && (
            <GameZonePage
              activeTab={activeGamesTab}
              onChangeTab={setActiveGamesTab}
              gameScores={progress.gameScores}
              gameAttempts={progress.gameAttempts}
              onRecordGameScore={recordGameScore}
              completedEscapeRooms={progress.completedEscapeRooms}
              onCompleteEscapeRoom={completeEscapeRoom}
              completedBugHunts={progress.completedBugHunts}
              onCompleteBugHunt={completeBugHunt}
              completedChallenges={progress.completedChallenges}
              onCompleteChallenge={markChallengeComplete}
              quizScores={progress.quizScores}
              onRecordQuizResult={recordQuizResult}
            />
          )}

          {activeSection === 'studio' && (
            <CodingStudioPage
              activeTab={activeStudioTab}
              onChangeTab={setActiveStudioTab}
              externalCode={sandboxCode}
              onConsumeExternalCode={handleConsumeSandboxCode}
              onRecordSandboxRun={recordSandboxRun}
              savedSnippets={progress.savedSnippets}
              onSaveSnippet={saveSnippet}
              onDeleteSnippet={deleteSnippet}
              completedChallenges={progress.completedChallenges}
              onCompleteChallenge={markChallengeComplete}
            />
          )}

          {activeSection === 'tutor' && (
            <AdaptiveTutorPage
              progress={progress}
              onSetTopic={setTutorTopic}
              onSetDifficulty={setTutorDifficulty}
              onMarkUnderstood={markConceptUnderstood}
              onMarkToReview={markConceptToReview}
              onRemoveConcept={removeConceptTag}
              onRecordPracticeAttempt={recordPracticeAttempt}
              onResetProgress={resetProgress}
              onNavigate={navigateTo}
              onOpenTopic={openTopic}
              onOpenInPlayground={handleOpenInPlayground}
              pendingSimulatorContext={pendingTutorSimContext}
              onConsumeSimulatorContext={handleConsumeSimulatorContext}
            />
          )}

          {activeSection === 'revision' && (
            <RevisionHubPage
              activeTab={activeRevisionTab}
              onChangeTab={setActiveRevisionTab}
              understoodFlashcards={progress.understoodFlashcards}
              onToggleFlashcardUnderstood={toggleFlashcardUnderstood}
              quizScores={progress.quizScores}
              onRecordQuizResult={recordQuizResult}
              onOpenInStudio={handleOpenInPlayground}
            />
          )}

          {activeSection === 'progress' && (
            <ProgressDashboard
              progress={progress}
              onToggleLesson={toggleLesson}
              onResetProgress={resetProgress}
              onNavigate={navigateTo}
              onOpenTopic={openTopic}
              onOpenGamesTab={openGamesTab}
              onOpenRevisionTab={openRevisionTab}
            />
          )}
        </motion.div>
      </main>

      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigateTo}
        onOpenTopic={openTopic}
        onOpenLabTab={openLabTab}
        onOpenGamesTab={openGamesTab}
        onOpenRevisionTab={openRevisionTab}
      />
    </div>
  );
}
