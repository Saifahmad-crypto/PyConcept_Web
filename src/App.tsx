import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  LabTabId,
  SectionId,
  SimulatorId,
  TopicId,
  TutorSimulatorContext,
} from './types';
import { useProgress } from './hooks/useProgress';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { LearnSection } from './components/LearnSection';
import { InteractiveLab } from './components/InteractiveLab';
import { SimulatorsSection } from './components/simulators/SimulatorsSection';
import { CodePlayground } from './components/CodePlayground';
import { ChallengesSection } from './components/ChallengesSection';
import { QuizSection } from './components/QuizSection';
import { ProgressDashboard } from './components/ProgressDashboard';
import { AdaptiveTutorPage } from './components/tutor/AdaptiveTutorPage';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [activeTopic, setActiveTopic] = useState<TopicId>('conditionals');
  const [activeLabTab, setActiveLabTab] = useState<LabTabId>('conditional-sim');
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
    setTutorTopic,
    setTutorDifficulty,
    markConceptUnderstood,
    markConceptToReview,
    removeConceptTag,
    recordPracticeAttempt,
    resetProgress,
  } = useProgress();

  const navigateTo = useCallback((section: SectionId) => {
    setActiveSection(section);
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

  const openLabTab = useCallback(
    (tab: LabTabId) => {
      setActiveLabTab(tab);
      navigateTo('lab');
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
    <div className="flex min-h-screen flex-col bg-white text-[#1E293B]">
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
              onOpenLabTab={openLabTab}
            />
          )}

          {activeSection === 'learn' && (
            <LearnSection
              activeTopic={activeTopic}
              onChangeTopic={setActiveTopic}
              completedLessons={progress.completedLessons}
              onToggleLesson={toggleLesson}
              onOpenLab={openLabTab}
            />
          )}

          {activeSection === 'lab' && (
            <InteractiveLab
              activeTab={activeLabTab}
              onChangeTab={setActiveLabTab}
              gameScores={progress.gameScores}
              onRecordGameScore={recordGameScore}
            />
          )}

          {activeSection === 'simulators' && (
            <SimulatorsSection
              selectedSimulator={selectedSimulator}
              onSelectSimulator={setSelectedSimulator}
              onAskTutor={handleAskTutorFromSimulator}
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

          {activeSection === 'playground' && (
            <CodePlayground
              externalCode={sandboxCode}
              onConsumeExternalCode={handleConsumeSandboxCode}
            />
          )}

          {activeSection === 'challenges' && (
            <ChallengesSection
              completedChallenges={progress.completedChallenges}
              onCompleteChallenge={markChallengeComplete}
            />
          )}

          {activeSection === 'quiz' && (
            <QuizSection
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
            />
          )}
        </motion.div>
      </main>
    </div>
  );
}
