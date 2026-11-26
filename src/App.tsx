import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  GamesHubTabId,
  SectionId,
  SimulatorId,
  TopicId,
  TutorSimulatorContext,
} from './types';
import { useProgress } from './hooks/useProgress';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { LearnSection } from './components/LearnSection';
import { SimulatorsSection } from './components/simulators/SimulatorsSection';
import { CodePlayground } from './components/CodePlayground';
import { GamesAndChallengesHub } from './components/GamesAndChallengesHub';
import { ProgressDashboard } from './components/ProgressDashboard';
import { AdaptiveTutorPage } from './components/tutor/AdaptiveTutorPage';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [activeTopic, setActiveTopic] = useState<TopicId>('basics');
  const [activeGamesTab, setActiveGamesTab] = useState<GamesHubTabId>('mini-games');
  const [selectedSimulator, setSelectedSimulator] = useState<SimulatorId | null>(null);
  const [sandboxCode, setSandboxCode] = useState<string | null>(null);
  const [pendingTutorSimContext, setPendingTutorSimContext] =
    useState<TutorSimulatorContext | null>(null);

  const {
    progress,
    toggleLesson,
    markChallengeComplete,
    recordQuizResult,
    recordGameScore,
    recordSimulatorRun,
    recordSandboxRun,
    setTutorTopic,
    setTutorDifficulty,
    markConceptUnderstood,
    markConceptToReview,
    removeConceptTag,
    recordPracticeAttempt,
    resetProgress,
  } = useProgress();

  const navigateTo = useCallback((section: SectionId) => {
    if (section === 'lab') {
      setActiveGamesTab('logic-lab');
      setActiveSection('games');
    } else if (section === 'challenges') {
      setActiveGamesTab('challenges');
      setActiveSection('games');
    } else if (section === 'quiz') {
      setActiveGamesTab('quizzes');
      setActiveSection('games');
    } else {
      setActiveSection(section);
    }

    if (section === 'simulators') {
      setSelectedSimulator(null);
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

  const openGamesTab = useCallback(
    (tab: GamesHubTabId) => {
      setActiveGamesTab(tab);
      navigateTo('games');
    },
    [navigateTo]
  );

  const handleOpenInPlayground = useCallback(
    (code: string) => {
      setSandboxCode(code);
      navigateTo('playground');
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

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-[#1E293B]">
      <Navbar activeSection={activeSection} onNavigate={navigateTo} />

      <main className="flex-1 bg-pyverse-soft">
        <motion.div
          key={`${activeSection}-${selectedSimulator ?? 'hub'}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          {activeSection === 'home' && (
            <HomePage
              progress={progress}
              onNavigate={navigateTo}
              onOpenTopic={openTopic}
              onOpenGamesTab={openGamesTab}
            />
          )}

          {activeSection === 'learn' && (
            <LearnSection
              activeTopic={activeTopic}
              onChangeTopic={setActiveTopic}
              completedLessons={progress.completedLessons}
              onToggleLesson={toggleLesson}
              onNavigate={navigateTo}
              onOpenGamesTab={openGamesTab}
              onOpenInSandbox={handleOpenInPlayground}
            />
          )}

          {activeSection === 'simulators' && (
            <SimulatorsSection
              selectedSimulator={selectedSimulator}
              onSelectSimulator={setSelectedSimulator}
              visitedSimulators={progress.visitedSimulators}
              onRecordSimulatorRun={recordSimulatorRun}
              onAskTutor={handleAskTutorFromSimulator}
            />
          )}

          {activeSection === 'playground' && (
            <CodePlayground
              externalCode={sandboxCode}
              onConsumeExternalCode={handleConsumeSandboxCode}
              onRecordSandboxRun={recordSandboxRun}
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

          {activeSection === 'games' && (
            <GamesAndChallengesHub
              activeTab={activeGamesTab}
              onChangeTab={setActiveGamesTab}
              gameScores={progress.gameScores}
              gameAttempts={progress.gameAttempts}
              onRecordGameScore={recordGameScore}
              completedChallenges={progress.completedChallenges}
              onCompleteChallenge={markChallengeComplete}
              quizScores={progress.quizScores}
              onRecordQuizResult={recordQuizResult}
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
            />
          )}
        </motion.div>
      </main>
    </div>
  );
}
