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

    // Landing Page
    'landing.nav.badge': 'Interactive Python Universe',
    'landing.nav.enter': 'Enter PyVerse',
    'landing.hero.eyebrow': 'Interactive • Visual • No Video Lectures',
    'landing.hero.titlePart1': "Don't Just Learn Python.",
    'landing.hero.titlePart2': 'Experience It.',
    'landing.hero.subtitle':
      'PyVerse transforms Python from static terminal syntax into live, interactive mental models. Simulate real-world hardware, drag-and-drop logic blocks, trace memory allocations, and solve hands-on coding escape rooms.',
    'landing.hero.trySims': 'Try Real-World Simulators',
    'landing.trust.oss': 'Free & Open Source',
    'landing.trust.browser': 'Runs 100% In-Browser',
    'landing.trust.noInstall': 'No Python Installation Needed',
    'landing.stats.simulators': 'Simulators',
    'landing.stats.quizzes': 'Quizzes',
    'landing.stats.challenges': 'Coding Challenges',
    'landing.stats.bugHunts': 'Bug Hunts',
    'landing.stats.missions': 'Guided Missions',
    'landing.stats.miniGames': 'Mini-Games',
    'landing.pillars.eyebrow': 'Four Pillars of PyVerse',
    'landing.pillars.title': 'How You Master Python',
    'landing.pillars.subtitle': 'Choose any dimension of the universe to sharpen your intuition, test hypotheses, and write real code.',
    'landing.pillar.explore.title': 'Explore',
    'landing.pillar.explore.tagline': 'Visual Concept Mental Models',
    'landing.pillar.explore.desc': 'Ditch abstract syntax drills. Grasp variables, object memory references, and execution frames through interactive, illustrated visual maps.',
    'landing.pillar.explore.cta': 'Explore Curriculum',
    'landing.pillar.simulate.title': 'Simulate',
    'landing.pillar.simulate.tagline': 'Real-World Logic Machines',
    'landing.pillar.simulate.desc': 'Watch your code control physical systems in real-time — from ATM cash dispensers and smart climate ACs to multi-floor elevators and adaptive traffic junctions.',
    'landing.pillar.simulate.cta': 'Launch Simulators',
    'landing.pillar.create.title': 'Create',
    'landing.pillar.create.tagline': 'Drag-and-Drop & Bi-Directional Code',
    'landing.pillar.create.desc': 'Build custom logic architectures with visual blocks, auto-generating clean Python code with live two-way AST synchronization and dynamic SVG flowcharts.',
    'landing.pillar.create.cta': 'Open Create Studio',
    'landing.pillar.play.title': 'Play',
    'landing.pillar.play.tagline': 'Gamified Challenges & Code Vaults',
    'landing.pillar.play.cta': 'Enter GameZone',
    'landing.more.eyebrow': 'And Much More',
    'landing.more.title': 'Everything Inside PyVerse',
    'landing.more.tile1.title': '2D + 3D Labs',
    'landing.more.tile1.desc': 'Run every simulator in 2D or rotate it in 3D.',
    'landing.more.tile2.title': 'Quizzes',
    'landing.more.tile2.desc': 'From concepts to tricky output questions.',
    'landing.more.tile3.title': 'Coding Challenges',
    'landing.more.tile3.desc': 'Lab-style problems checked with real test cases.',
    'landing.more.tile4.title': 'Bug Hunter',
    'landing.more.tile4.desc': 'Spot the bug in broken code and fix it.',
    'landing.more.tile5.title': 'Games & Escape Rooms',
    'landing.more.tile5.desc': 'Practice through mini-games and puzzles.',
    'landing.more.tile6.title': 'XP, Streaks & Certificates',
    'landing.more.tile6.desc': 'Earn XP, keep your streak, get certified.',
    'landing.more.tile7.title': 'Flashcards & Cheat Sheets',
    'landing.more.tile7.desc': 'Quick revision before the exam.',
    'landing.more.tile8.title': 'AI Tutor & Real Python',
    'landing.more.tile8.desc': 'Ask doubts and run real Python in the Studio.',
    'landing.more.chip.offline': 'Works offline',
    'landing.more.chip.hinglish': 'Hinglish',
    'landing.more.chip.dark': 'Dark mode',
    'landing.cta.title': 'Ready to Experience Python?',
    'landing.cta.subtitle': 'Launch into PyVerse right now. Explore interactive simulators, build custom logic machines, and test your skills with zero setup.',
    'landing.cta.btn': 'Enter PyVerse Now',
    'landing.cta.foot': 'Free forever • Open-source • No account required to start',
    'landing.creator.badge': 'About the Creator',
    'landing.creator.bio': 'Creator of PyVerse. Built to make programming visual, tactile, and unforgettable—transforming abstract syntax into interactive models, simulators, and debugging adventures.',

    // Landing FAQ
    'landing.faq.eyebrow': 'FAQ',
    'landing.faq.title': 'Frequently Asked Questions',
    'landing.faq.q1': 'What is PyVerse?',
    'landing.faq.a1': 'PyVerse is an interactive visual Python learning platform that turns code into live simulations, 3D labs, flowcharts, quizzes, and debugging challenges.',
    'landing.faq.q2': 'Is PyVerse free to use?',
    'landing.faq.a2': 'Yes, PyVerse is completely free and open source, with no account or subscription required to start learning.',
    'landing.faq.q3': 'Do I need to install Python on my device?',
    'landing.faq.a3': 'No installation is needed. PyVerse runs Python directly in your browser using an instant execution engine and in-browser Python runtime.',
    'landing.faq.q4': 'Which Python topics are covered in PyVerse?',
    'landing.faq.a4': 'PyVerse focuses on core Python fundamentals—Basics (variables, types, operators), Conditional Statements (if/elif/else), and Loops (for, while, range, break/continue)—alongside lab-style coding problems.',
    'landing.faq.q5': 'Does PyVerse work offline?',
    'landing.faq.a5': 'Yes! Once loaded, PyVerse works offline as a Progressive Web App (PWA), allowing you to run simulators, quizzes, and coding challenges without internet.',
    'footer.feedback': 'Feedback',
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

    // Landing Page
    'landing.nav.badge': 'Interactive Python Universe',
    'landing.nav.enter': 'PyVerse Kholo',
    'landing.hero.eyebrow': 'Interactive • Visual • Bina Video Lectures',
    'landing.hero.titlePart1': 'Sirf Python Ratta Mat Maaro.',
    'landing.hero.titlePart2': 'Use Experience Karo.',
    'landing.hero.subtitle':
      'PyVerse Python ko boring text se nikaal kar live visual models mein badalta hai. Real-world machines simulate karo, logic blocks jodo, memory trace karo aur coding escape rooms solve karo.',
    'landing.hero.trySims': 'Real-World Simulators Chalao',
    'landing.trust.oss': 'Free & Open Source',
    'landing.trust.browser': '100% Browser Mein Chalta Hai',
    'landing.trust.noInstall': 'Python Install Karne Ki Zaroorat Nahi',
    'landing.stats.simulators': 'Simulators',
    'landing.stats.quizzes': 'Quizzes',
    'landing.stats.challenges': 'Coding Challenges',
    'landing.stats.bugHunts': 'Bug Hunts',
    'landing.stats.missions': 'Guided Missions',
    'landing.stats.miniGames': 'Mini-Games',
    'landing.pillars.eyebrow': 'PyVerse Ke Chaar Pillars',
    'landing.pillars.title': 'Python Master Kaise Karein',
    'landing.pillars.subtitle': 'Apne intuition ko sharp karne aur real code chalane ke liye kisi bhi dimension ko chuno.',
    'landing.pillar.explore.title': 'Explore',
    'landing.pillar.explore.tagline': 'Visual Concept Mental Models',
    'landing.pillar.explore.desc': 'Syntax ratna chhodo. Variables, object references aur execution frames ko interactive visual maps se samjho.',
    'landing.pillar.explore.cta': 'Curriculum Dekho',
    'landing.pillar.simulate.title': 'Simulate',
    'landing.pillar.simulate.tagline': 'Real-World Logic Machines',
    'landing.pillar.simulate.desc': 'Dekho kaise tumhara code real-time machines chalata hai — ATM, Smart AC, Elevator aur Traffic Signals.',
    'landing.pillar.simulate.cta': 'Simulators Chalao',
    'landing.pillar.create.title': 'Create',
    'landing.pillar.create.tagline': 'Drag-and-Drop & Live Code Sync',
    'landing.pillar.create.desc': 'Visual blocks se custom logic banao jo automatically clean Python code aur live SVG flowcharts banata hai.',
    'landing.pillar.create.cta': 'Create Studio Kholo',
    'landing.pillar.play.title': 'Play',
    'landing.pillar.play.tagline': 'Gamified Challenges & Code Vaults',
    'landing.pillar.play.cta': 'GameZone Mein Jao',
    'landing.more.eyebrow': 'Aur Bhi Bahut Kuch',
    'landing.more.title': 'PyVerse Ke Andar Sab Kuch',
    'landing.more.tile1.title': '2D + 3D Labs',
    'landing.more.tile1.desc': 'Har simulator ko 2D mein chalao ya 3D mein ghumao.',
    'landing.more.tile2.title': 'Quizzes',
    'landing.more.tile2.desc': 'Basic concepts se lekar tricky output sawal tak.',
    'landing.more.tile3.title': 'Coding Challenges',
    'landing.more.tile3.desc': 'Lab-style problems jo real test cases check karein.',
    'landing.more.tile4.title': 'Bug Hunter',
    'landing.more.tile4.desc': 'Toote huye code mein bug dhoondho aur theek karo.',
    'landing.more.tile5.title': 'Games & Escape Rooms',
    'landing.more.tile5.desc': 'Mini-games aur puzzles ke zariye practice karo.',
    'landing.more.tile6.title': 'XP, Streaks & Certificates',
    'landing.more.tile6.desc': 'XP kamao, streak banao aur certificate pao.',
    'landing.more.tile7.title': 'Flashcards & Cheat Sheets',
    'landing.more.tile7.desc': 'Exam se pehle fast revision ke liye.',
    'landing.more.tile8.title': 'AI Tutor & Real Python',
    'landing.more.tile8.desc': 'Doubts poochho aur Studio mein real Python chalao.',
    'landing.more.chip.offline': 'Offline chalta hai',
    'landing.more.chip.hinglish': 'Hinglish',
    'landing.more.chip.dark': 'Dark mode',
    'landing.cta.title': 'Python Experience Karne Ke Liye Ready?',
    'landing.cta.subtitle': 'Abhi PyVerse launch karo. Interactive simulators chalao, custom logic banao aur bina setup ke skills test karo.',
    'landing.cta.btn': 'Abhi PyVerse Kholo',
    'landing.cta.foot': 'Hamesha Free • Open-source • Account ki zaroorat nahi',
    'landing.creator.badge': 'Creator Ke Baare Mein',
    'landing.creator.bio': 'PyVerse ke creator. Programming ko visual aur yaadgar banane ke liye banaya gaya — jahan syntax live models, simulators aur debugging adventures ban jata hai.',

    // Landing FAQ
    'landing.faq.eyebrow': 'FAQ',
    'landing.faq.title': 'Aksar Poochhe Jaane Wale Sawaal',
    'landing.faq.q1': 'PyVerse kya hai?',
    'landing.faq.a1': 'PyVerse ek interactive visual Python learning platform hai jo code ko live simulations, 3D labs, flowcharts, quizzes aur debugging challenges mein badalta hai.',
    'landing.faq.q2': 'Kya PyVerse bilkul free hai?',
    'landing.faq.a2': 'Haan, PyVerse poori tarah free aur open source hai — shuru karne ke liye kisi account ya subscription ki zaroorat nahi hai.',
    'landing.faq.q3': 'Kya mujhe apne device par Python install karna padega?',
    'landing.faq.a3': 'Bilkul nahi. PyVerse aapke browser mein hi instant execution engine aur in-browser Python runtime ke saath chalta hai.',
    'landing.faq.q4': 'PyVerse mein kaun se Python topics cover hote hain?',
    'landing.faq.a4': 'PyVerse mein Python ke core topics—Basics (variables, types, operators), Conditional Statements (if/elif/else) aur Loops (for, while, range, break/continue)—lab-style problems ke saath cover hote hain.',
    'landing.faq.q5': 'Kya PyVerse bina internet ke offline chalta hai?',
    'landing.faq.a5': 'Haan! Ek baar load hone ke baad PyVerse PWA ke roop mein offline kaam karta hai, jisse aap simulators, quizzes aur coding challenges bina internet ke chala sakte hain.',
    'footer.feedback': 'फ़ीडबैक / Feedback',
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
