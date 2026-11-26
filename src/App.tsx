import { useState } from 'react';
import { LabTabId, SectionId, TopicId } from './types';
import { useProgress } from './hooks/useProgress';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { LearnSection } from './components/LearnSection';
import { InteractiveLab } from './components/InteractiveLab';
import { CodePlayground } from './components/CodePlayground';
import { ChallengesSection } from './components/ChallengesSection';
import { QuizSection } from './components/QuizSection';
import { ProgressDashboard } from './components/ProgressDashboard';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [activeTopic, setActiveTopic] = useState<TopicId>('conditionals');
  const [activeLabTab, setActiveLabTab] = useState<LabTabId>('conditional-sim');

  const {
    progress,
    toggleLesson,
    markChallengeComplete,
    recordQuizResult,
    recordGameScore,
    resetProgress,
  } = useProgress();

  const navigateTo = (section: SectionId) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openTopic = (topic: TopicId) => {
    setActiveTopic(topic);
    navigateTo('learn');
  };

  const openLabTab = (tab: LabTabId) => {
    setActiveLabTab(tab);
    navigateTo('lab');
  };

  return (
    <div className="min-h-screen bg-[#090E1A] text-slate-100 flex flex-col">
      <Navbar activeSection={activeSection} onNavigate={navigateTo} />

      <main className="flex-1">
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

        {activeSection === 'playground' && <CodePlayground />}

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
      </main>
    </div>
  );
}
