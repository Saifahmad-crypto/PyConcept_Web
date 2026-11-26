import type { Language } from '../hooks/useLanguage';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.home': 'Explore',
    'nav.learn': 'Learning World',
    'nav.lab': 'Interactive Lab',
    'nav.games': 'Games',
    'nav.studio': 'Python Playground',
    'nav.tutor': 'AI Tutor',
    'nav.revision': 'Revision',
    'nav.progress': 'Progress',
    'nav.search': 'Search',
    'nav.startLearning': 'Start Learning',

    // Home — Hero
    'home.hero.badge': 'PyVerse · Think. Code. Experiment.',
    'home.hero.titlePart1': "Don't Just Learn Python.",
    'home.hero.titlePart2': 'Experience It.',
    'home.hero.subtitle':
      'Explore programming through interactive simulations, visual experiments, challenges and intelligent guidance.',
    'home.hero.ctaExplore': 'Explore PyVerse',
    'home.hero.ctaLearn': 'Enter Learning World',
    'home.hero.stat1': 'Real-Life Simulators',
    'home.hero.stat2': 'Guided Missions',
    'home.hero.stat3': 'Games & Escape Vault',

    // Home — Problem section
    'home.problem.eyebrow': '01 · The Problem',
    'home.problem.title': 'Static code on a page hides how Python actually thinks.',
    'home.problem.subtitle':
      'Traditional tutorials ask beginners to memorize syntax before they can picture conditions, memory references, or loop iterations.',
    'home.problem.card1.title': 'Invisible Memory State',
    'home.problem.card1.desc':
      'Variables change line by line, yet static text never reveals what is stored in memory.',
    'home.problem.card2.title': 'Unclear Branching',
    'home.problem.card2.desc':
      'Beginners guess why an elif skipped or an else ran instead of seeing the condition gate.',
    'home.problem.card3.title': 'Loop Blindness',
    'home.problem.card3.desc':
      'Off-by-one bugs and infinite loops happen when iteration steps are not visualized.',

    // Home — Progress / Journey
    'home.progress.eyebrow': '02 · Your Journey',
    'home.progress.openDashboard': 'Open Progress Dashboard',

    // Home — Learning World
    'home.world.eyebrow': '03 · Learning World',
    'home.world.title': 'Structured Python stages built for real understanding.',
    'home.world.subtitle':
      'Progress from variables & data types to conditionals and loops with interactive visuals at every step.',
    'home.stage.basics.title': 'Python Basics',
    'home.stage.basics.subtitle':
      'Variables, object references, core types, f-strings, and 4-space indentation.',
    'home.stage.conditionals.title': 'Conditional Statements',
    'home.stage.conditionals.subtitle':
      'if / elif / else decision branches, nested checks, and boolean logic gates.',
    'home.stage.loops.title': 'Loops & Iteration',
    'home.stage.loops.subtitle':
      'for loops, range(), while termination, break, continue, and nested grids.',

    // Home — Simulators
    'home.sims.eyebrow': '04 · Interactive Lab',
    'home.sims.title': 'See Python power real-world systems.',
    'home.sims.launchInLab': 'Launch in Lab',

    // Home — Game Zone
    'home.games.eyebrow': '05 · Game Zone',
    'home.games.title': 'Learn faster by debugging, predicting, and escaping.',

    // Home — Playground
    'home.playground.eyebrow': '06 · Python Playground',
    'home.playground.title': 'Write and run real Python right in your browser.',
    'home.playground.viewChallenges': 'View Coding Challenges',

    // Home — AI Tutor
    'home.tutor.eyebrow': '07 · Adaptive AI Tutor',
    'home.tutor.title': 'A personal Python mentor that adapts to your pace.',
    'home.tutor.subtitle':
      'Get step-by-step explanations, debug help, and progressive hints tailored to your current topic, difficulty level, simulator state, and concepts needing review—giving progressive hints before revealing answers.',
    'home.tutor.openBtn': 'Open AI Tutor',

    // Home — Footer CTA
    'home.footer.title': 'Ready to see Python come alive?',
    'home.footer.startBtn': 'Start Learning',
    'home.footer.labBtn': 'Open Interactive Lab',

    // LearnSection
    'learn.chapters': 'Topic Chapters',
    'learn.openSimulators': 'Open Simulators',
    'learn.playMiniGames': 'Play Mini-Games',
    'learn.openLogicLab': 'Open Logic Lab',
    'learn.cheatSheet': 'Cheat Sheet',
    'learn.markComplete': 'Mark Lesson Complete',
    'learn.completed': 'Completed',
  },

  hinglish: {
    // Navbar
    'nav.home': 'Explore',
    'nav.learn': 'Seekho',
    'nav.lab': 'Visual Lab',
    'nav.games': 'Games',
    'nav.studio': 'Code Studio',
    'nav.tutor': 'AI Guru',
    'nav.revision': 'Revision',
    'nav.progress': 'Progress',
    'nav.search': 'Khojo',
    'nav.startLearning': 'Seekhna Shuru',

    // Home — Hero
    'home.hero.badge': 'PyVerse · Socho. Code Karo. Experiment Karo.',
    'home.hero.titlePart1': 'Sirf Python Ratta Mat Maaro.',
    'home.hero.titlePart2': 'Use Experience Karo.',
    'home.hero.subtitle':
      'Interactive simulations, visual experiments, coding challenges aur smart AI guidance ke saath Python ko asli tarike se samjho.',
    'home.hero.ctaExplore': 'PyVerse Dekho',
    'home.hero.ctaLearn': 'Learning World Kholo',
    'home.hero.stat1': 'Real-Life Simulators',
    'home.hero.stat2': 'Guided Missions',
    'home.hero.stat3': 'Games aur Escape Vault',

    // Home — Problem section
    'home.problem.eyebrow': '01 · Asli Problem',
    'home.problem.title': 'Static code dekhkar samajh nahi aata ki Python kaise sochta hai.',
    'home.problem.subtitle':
      'Purane tutorials mein beginners ko syntax ratna padta hai bina ye dekhe ki conditions, memory aur loops andar kaise chalte hain.',
    'home.problem.card1.title': 'Chhupi Hui Memory State',
    'home.problem.card1.desc':
      'Variables har line par badalte hain, lekin static text kabhi nahi dikhata ki memory mein kya store hai.',
    'home.problem.card2.title': 'Confusing Branching',
    'home.problem.card2.desc':
      'Beginners andaza lagate rehte hain ki elif kyun skip hua ya else kyun chala, bina condition gate dekhe.',
    'home.problem.card3.title': 'Loop Confusion',
    'home.problem.card3.desc':
      'Off-by-one bugs aur infinite loops tab aate hain jab har iteration step visually nahi dikhta.',

    // Home — Progress / Journey
    'home.progress.eyebrow': '02 · Tumhari Journey',
    'home.progress.openDashboard': 'Progress Dashboard Kholo',

    // Home — Learning World
    'home.world.eyebrow': '03 · Learning World',
    'home.world.title': 'Step-by-step Python stages jo concept pakka kar dein.',
    'home.world.subtitle':
      'Variables aur data types se lekar conditionals aur loops tak, har step par interactive visuals ke saath seekho.',
    'home.stage.basics.title': 'Python Basics',
    'home.stage.basics.subtitle':
      'Variables, memory boxes, core data types, f-strings, aur 4-space indentation.',
    'home.stage.conditionals.title': 'Conditional Statements',
    'home.stage.conditionals.subtitle':
      'if / elif / else decision branches, nested checks, aur boolean logic gates.',
    'home.stage.loops.title': 'Loops aur Iteration',
    'home.stage.loops.subtitle':
      'for loops, range(), while condition, break, continue, aur nested grids.',

    // Home — Simulators
    'home.sims.eyebrow': '04 · Interactive Lab',
    'home.sims.title': 'Dekho Python real-world systems ko kaise chalata hai.',
    'home.sims.launchInLab': 'Lab Mein Chalao',

    // Home — Game Zone
    'home.games.eyebrow': '05 · Game Zone',
    'home.games.title': 'Debug karke, output guess karke aur escape karke tezi se seekho.',

    // Home — Playground
    'home.playground.eyebrow': '06 · Python Playground',
    'home.playground.title': 'Seedha browser mein asli Python code likho aur chalao.',
    'home.playground.viewChallenges': 'Coding Challenges Dekho',

    // Home — AI Tutor
    'home.tutor.eyebrow': '07 · Adaptive AI Tutor',
    'home.tutor.title': 'Ek personal Python mentor jo tumhari speed se sikhaye.',
    'home.tutor.subtitle':
      'Apne topic, level aur simulator state ke hisaab se step-by-step explanation, debugging help aur smart hints pao — seedha answer dene se pehle.',
    'home.tutor.openBtn': 'AI Tutor Kholo',

    // Home — Footer CTA
    'home.footer.title': 'Python ko live action mein dekhne ke liye ready ho?',
    'home.footer.startBtn': 'Seekhna Shuru Karo',
    'home.footer.labBtn': 'Interactive Lab Kholo',

    // LearnSection
    'learn.chapters': 'Topic Chapters',
    'learn.openSimulators': 'Simulators Kholo',
    'learn.playMiniGames': 'Mini-Games Khelo',
    'learn.openLogicLab': 'Logic Lab Kholo',
    'learn.cheatSheet': 'Cheat Sheet',
    'learn.markComplete': 'Lesson Complete Mark Karo',
    'learn.completed': 'Complete Ho Gaya',
  },
};

export const LESSON_TRANSLATIONS: Record<string, { title: string; summary: string }> = {
  // Topic 01: Basics
  'b-vars': {
    title: 'Variables aur Memory Boxes',
    summary: 'Naam wale variables mein numbers, text aur True/False values store karna seekho.',
  },
  'b-types': {
    title: 'Core Data Types',
    summary: 'int, float, str aur bool ko ek nazar mein pehchanna seekho.',
  },
  'b-io': {
    title: 'Output, Expressions aur Indentation',
    summary: 'print(), f-strings, math operators aur Python ke spacing rules ko mila kar use karo.',
  },

  // Topic 08: Conditionals
  'c-intro': {
    title: 'Decisions ka Introduction',
    summary: 'Boolean values, True/False, aur programs alag-alag raste kyun chunte hain.',
  },
  'c-if': {
    title: 'if Statement',
    summary: 'Syntax, colon (:), indentation aur single-branch decision flow.',
  },
  'c-ifelse': {
    title: 'if-else Statement',
    summary: 'Do mein se kisi ek sahi raste ko chunna.',
  },
  'c-elif': {
    title: 'if-elif-else Ladder',
    summary: 'Multiple conditions, check hone ka order aur default else branch.',
  },
  'c-nested': {
    title: 'Nested if Statements',
    summary: 'Indentation ke zariye ek decision ke andar doosra decision rakhna.',
  },
  'c-compare': {
    title: 'Comparison Operators',
    summary: '==, !=, >, <, >=, <= ka sahi use aur = wali galti se bachna.',
  },
  'c-logical': {
    title: 'Logical Operators',
    summary: 'and, or, aur not se multiple conditions ko jodna.',
  },
  'c-realworld': {
    title: 'Real-World Examples',
    summary: 'Interactive grade, age, sign, even-odd aur discount checkers.',
  },
  'c-flowchart': {
    title: 'Conditional Flowcharts',
    summary: 'Start, Condition, True/False paths aur End ko visually samajhna.',
  },

  // Topic 09: Loops
  'l-intro': {
    title: 'Loops ka Introduction',
    summary: 'Kaam ko repeat karna, iteration, aur copy-paste se chhutkara.',
  },
  'l-for': {
    title: 'for Loop',
    summary: 'Loop variable, sequences aur har item par ek-ek karke chalna.',
  },
  'l-range': {
    title: 'range() Function',
    summary: 'Stop number exclude hona, start/stop/step aur ulta ginti ginna.',
  },
  'l-while': {
    title: 'while Loop',
    summary: 'Condition par chalne wala loop aur counter ko update karna.',
  },
  'l-compare': {
    title: 'for vs while Comparison',
    summary: 'Samjho kis problem ke liye kaunsa loop best rahega.',
  },
  'l-break': {
    title: 'break Statement',
    summary: 'Sabse paas wale loop se turant bahar nikalna.',
  },
  'l-continue': {
    title: 'continue Statement',
    summary: 'Current step ko skip karke agle iteration par safely jaana.',
  },
  'l-nested': {
    title: 'Nested Loops',
    summary: 'Grids aur star patterns ke liye outer aur inner loops.',
  },
  'l-mistakes': {
    title: 'Loop ki Common Galtiyan',
    summary: 'Infinite loops, off-by-one bugs aur indentation errors se bachna.',
  },
};

export function t(lang: Language, key: string, fallback?: string): string {
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? fallback ?? key;
}

export function tLesson(
  lang: Language,
  lesson: { id: string; title: string; summary: string }
): { title: string; summary: string } {
  if (lang === 'hinglish' && LESSON_TRANSLATIONS[lesson.id]) {
    return LESSON_TRANSLATIONS[lesson.id];
  }
  return { title: lesson.title, summary: lesson.summary };
}
