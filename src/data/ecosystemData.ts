import {
  BugChallengeDef,
  DailyQuestDef,
  FlashcardDef,
  MissionDef,
  TopicId,
} from '../types';

export const XP_REWARDS = {
  lesson: 25,
  mission: 35,
  simulator: 40,
  challenge: 60,
  quiz: 75,
  game: 45,
  dailyQuest: 50,
  bugHunt: 55,
  escapeRoom: 120,
  sandboxFirstRun: 20,
} as const;

export interface LearnerLevelDef {
  level: number;
  title: string;
  minXp: number;
}

export const LEARNER_LEVELS: LearnerLevelDef[] = [
  { level: 1, title: 'Beginner Explorer', minXp: 0 },
  { level: 2, title: 'Python Adventurer', minXp: 150 },
  { level: 3, title: 'Logic Builder', minXp: 350 },
  { level: 4, title: 'Loop Master', minXp: 650 },
  { level: 5, title: 'Code Detective', minXp: 1000 },
  { level: 6, title: 'Python Champion', minXp: 1500 },
];

export function getLearnerLevel(xp: number): {
  current: LearnerLevelDef;
  next: LearnerLevelDef | null;
  progressPercent: number;
  xpToNext: number;
} {
  let current = LEARNER_LEVELS[0];
  for (const lvl of LEARNER_LEVELS) {
    if (xp >= lvl.minXp) {
      current = lvl;
    }
  }
  const idx = LEARNER_LEVELS.findIndex((l) => l.level === current.level);
  const next = idx >= 0 && idx < LEARNER_LEVELS.length - 1 ? LEARNER_LEVELS[idx + 1] : null;
  if (!next) {
    return { current, next: null, progressPercent: 100, xpToNext: 0 };
  }
  const span = next.minXp - current.minXp;
  const gained = Math.max(0, xp - current.minXp);
  const progressPercent = Math.min(100, Math.round((gained / span) * 100));
  return {
    current,
    next,
    progressPercent,
    xpToNext: Math.max(0, next.minXp - xp),
  };
}

export const UPCOMING_PYTHON_ROADMAP: Array<{
  title: string;
  summary: string;
}> = [
  { title: 'Functions', summary: 'Reusable def blocks, parameters, and return values' },
  { title: 'Lists & Tuples', summary: 'Ordered collections, indexing, and slicing' },
  { title: 'Dictionaries & Sets', summary: 'Key-value lookup tables and unique collections' },
  { title: 'Strings & File Handling', summary: 'Text processing and reading/writing files' },
  { title: 'Exception Handling & OOP', summary: 'try/except safety and classes & objects' },
  { title: 'Modules & Packages', summary: 'Organizing and importing reusable Python code' },
];

export const LEARNING_MISSIONS: MissionDef[] = [
  // Python Basics Missions (3)
  {
    id: 'm-basics-vars',
    topic: 'basics',
    number: 'M1.1',
    title: 'Name Your Variables',
    objective: 'Store values in clearly named Python variables using =.',
    intro:
      'In Python, = binds a variable name to a value object. Names can use letters, digits, and underscores, but cannot start with a digit.',
    exampleCode: 'player_name = "Maya"\nscore = 90\nprint(player_name, score)',
    prompt: 'Which assignment creates a valid Python variable for a test score?',
    options: [
      '2nd_score = 88',
      'test score = 88',
      'test_score = 88',
      'test_score == 88',
    ],
    correctIndex: 2,
    explanation:
      'Underscores are allowed without spaces, cannot start with a digit, and single = assigns a value.',
    xpReward: XP_REWARDS.mission,
    linkedLessonId: 'b-vars',
  },
  {
    id: 'm-basics-types',
    topic: 'basics',
    number: 'M1.2',
    title: 'Spot the Data Type',
    objective: 'Distinguish int, float, str, and bool values at a glance.',
    intro:
      'Whole numbers are int, decimal numbers are float, quoted text is str, and True/False flags are bool.',
    exampleCode: 'age = 19        # int\ngpa = 3.85      # float\ncity = "Pune"   # str\nactive = True   # bool',
    prompt: 'What data type does Python create for value = "42"?',
    options: ['int', 'float', 'str', 'bool'],
    correctIndex: 2,
    explanation:
      'Because 42 is wrapped inside quotation marks, Python stores it as a string (str), not an integer.',
    xpReward: XP_REWARDS.mission,
    linkedLessonId: 'b-types',
  },
  {
    id: 'm-basics-indent',
    topic: 'basics',
    number: 'M1.3',
    title: 'Decode Python Operators & Spacing',
    objective: 'Use modulo %, floor division //, and 4-space block indentation.',
    intro:
      'Python uses // for whole-number division, % for the remainder, and consistent indentation (4 spaces) to define blocks.',
    exampleCode: 'print(17 // 5)  # 3\nprint(17 % 5)   # 2',
    prompt: 'What is the output of print(14 % 4)?',
    options: ['3', '2', '3.5', '1'],
    correctIndex: 1,
    explanation: '14 divided by 4 is 3 with a remainder of 2, so 14 % 4 evaluates to 2.',
    xpReward: XP_REWARDS.mission,
    linkedLessonId: 'b-io',
  },

  // Conditional Statements Missions (7)
  {
    id: 'm-cond-if',
    topic: 'conditionals',
    number: 'M2.1',
    title: 'Understand if',
    objective: 'Run an indented block only when a Boolean condition is True.',
    intro:
      'An if statement ends with a colon : and guards an indented block beneath it. When the condition is False, Python skips the block.',
    exampleCode: 'battery = 15\nif battery < 20:\n    print("Low Battery")',
    prompt: 'If battery = 25, what does the snippet above print?',
    options: ['Low Battery', 'Nothing (it skips the if block)', 'Error', '25'],
    correctIndex: 1,
    explanation: '25 < 20 is False, so Python skips the indented print statement.',
    xpReward: XP_REWARDS.mission,
    linkedLessonId: 'c-if',
  },
  {
    id: 'm-cond-ifelse',
    topic: 'conditionals',
    number: 'M2.2',
    title: 'Understand if-else',
    objective: 'Choose between two mutually exclusive execution paths.',
    intro:
      'Adding else: provides a guaranteed fallback branch whenever the if condition evaluates to False.',
    exampleCode: 'marks = 40\nif marks >= 40:\n    print("Pass")\nelse:\n    print("Retry")',
    prompt: 'When marks = 40, which message prints?',
    options: ['Pass', 'Retry', 'Both Pass and Retry', 'Nothing'],
    correctIndex: 0,
    explanation: '40 >= 40 is True because >= includes equality, so the if branch prints "Pass".',
    xpReward: XP_REWARDS.mission,
    linkedLessonId: 'c-ifelse',
  },
  {
    id: 'm-cond-elif',
    topic: 'conditionals',
    number: 'M2.3',
    title: 'Explore elif Ladders',
    objective: 'Chain multiple ordered checks from strictest to broadest.',
    intro:
      'Python checks if and each elif top-to-bottom and stops as soon as the first True condition runs.',
    exampleCode: 'temp = 31\nif temp > 35:\n    print("Extreme")\nelif temp > 28:\n    print("Warm")\nelse:\n    print("Mild")',
    prompt: 'With temp = 31, what prints?',
    options: ['Extreme', 'Warm', 'Mild', 'Warm and Mild'],
    correctIndex: 1,
    explanation: '31 > 35 is False, then 31 > 28 is True, so Python prints "Warm" and skips else.',
    xpReward: XP_REWARDS.mission,
    linkedLessonId: 'c-elif',
  },
  {
    id: 'm-cond-nested',
    topic: 'conditionals',
    number: 'M2.4',
    title: 'Master Nested if',
    objective: 'Place an inner decision inside an outer condition (8 spaces).',
    intro:
      'Nested if lets you verify a primary requirement (like valid PIN) before checking a secondary one (like sufficient balance).',
    exampleCode: 'pin_ok = True\nbalance = 500\nif pin_ok:\n    if balance >= 1000:\n        print("Dispense")\n    else:\n        print("Low Funds")',
    prompt: 'What prints when pin_ok = True and balance = 500?',
    options: ['Dispense', 'Low Funds', 'Nothing', 'IndentationError'],
    correctIndex: 1,
    explanation: 'pin_ok is True so Python enters the outer if, then 500 >= 1000 is False so inner else prints "Low Funds".',
    xpReward: XP_REWARDS.mission,
    linkedLessonId: 'c-nested',
  },
  {
    id: 'm-cond-compare',
    topic: 'conditionals',
    number: 'M2.5',
    title: 'Practise Comparison Operators',
    objective: 'Compare values accurately using ==, !=, >, <, >=, and <=.',
    intro:
      'Always use == to compare equality inside if statements; single = is reserved for variable assignment.',
    exampleCode: 'x = 12\nprint(x != 10, x <= 12)',
    prompt: 'What is the result of (8 == 8) and (8 < 8)?',
    options: ['True', 'False', 'None', 'SyntaxError'],
    correctIndex: 1,
    explanation: '8 == 8 is True, but 8 < 8 is False. With "and", both sides must be True.',
    xpReward: XP_REWARDS.mission,
    linkedLessonId: 'c-compare',
  },
  {
    id: 'm-cond-logical',
    topic: 'conditionals',
    number: 'M2.6',
    title: 'Practise Logical Operators',
    objective: 'Combine multiple conditions using and, or, and not.',
    intro:
      'and requires both True; or needs at least one True; not flips True to False and False to True.',
    exampleCode: 'is_vip = False\ncart = 2500\nif is_vip or cart >= 2000:\n    print("Free Delivery")',
    prompt: 'Does "not (5 > 10)" evaluate to True or False?',
    options: ['True', 'False', '0', 'Error'],
    correctIndex: 0,
    explanation: '5 > 10 is False, and "not False" flips to True.',
    xpReward: XP_REWARDS.mission,
    linkedLessonId: 'c-logical',
  },
  {
    id: 'm-cond-real',
    topic: 'conditionals',
    number: 'M2.7',
    title: 'Real-Life Decision Mission',
    objective: 'Apply boundary checks (>= 5000 vs >= 2000) to discount tiers.',
    intro:
      'Real systems rely on exact boundary checks like >= 5000 so edge values land in the intended tier.',
    exampleCode: 'amount = 5000\nif amount >= 5000:\n    discount = 20\nelif amount >= 2000:\n    discount = 10\nelse:\n    discount = 0',
    prompt: 'For amount = 2000, what discount does Python assign?',
    options: ['20', '10', '0', '30'],
    correctIndex: 1,
    explanation: '2000 >= 5000 is False, and 2000 >= 2000 is True, so discount becomes 10.',
    xpReward: XP_REWARDS.mission,
    linkedLessonId: 'c-realworld',
  },

  // Loops Missions (7)
  {
    id: 'm-loop-for',
    topic: 'loops',
    number: 'M3.1',
    title: 'Understand for Loops',
    objective: 'Repeat an action cleanly for every item in a sequence.',
    intro:
      'A for loop takes one item at a time into a loop variable and runs the indented body once per item.',
    exampleCode: 'for floor in [1, 2, 3]:\n    print("Floor", floor)',
    prompt: 'How many times does the print line run in: for n in [10, 20, 30, 40]:',
    options: ['1 time', '3 times', '4 times', '40 times'],
    correctIndex: 2,
    explanation: 'The list has 4 elements, so the loop executes 4 passes.',
    xpReward: XP_REWARDS.mission,
    linkedLessonId: 'l-for',
  },
  {
    id: 'm-loop-range',
    topic: 'loops',
    number: 'M3.2',
    title: 'Explore range()',
    objective: 'Predict exact sequences generated by range(start, stop, step).',
    intro:
      'Python includes start and stops strictly BEFORE stop. Optional third argument step controls the jump size.',
    exampleCode: 'for i in range(2, 9, 3):\n    print(i)',
    prompt: 'Which sequence does range(2, 9, 3) generate?',
    options: ['2, 5, 8', '2, 5, 8, 11', '3, 6, 9', '2, 3, 4, 5, 6, 7, 8'],
    correctIndex: 0,
    explanation: 'Starts at 2, adds 3 -> 5, adds 3 -> 8. Next would be 11 which is >= 9, so it stops.',
    xpReward: XP_REWARDS.mission,
    linkedLessonId: 'l-range',
  },
  {
    id: 'm-loop-while',
    topic: 'loops',
    number: 'M3.3',
    title: 'Understand while Loops',
    objective: 'Repeat while a condition stays True and update state safely.',
    intro:
      'A while loop checks its condition before each pass. Always update the counter inside the loop so it terminates.',
    exampleCode: 'n = 3\nwhile n > 0:\n    print(n)\n    n -= 1',
    prompt: 'If n starts at 0 in "while n > 0:", how many passes run?',
    options: ['0 passes', '1 pass', '3 passes', 'Infinite loop'],
    correctIndex: 0,
    explanation: '0 > 0 is False on the very first check, so the loop body runs 0 times.',
    xpReward: XP_REWARDS.mission,
    linkedLessonId: 'l-while',
  },
  {
    id: 'm-loop-break',
    topic: 'loops',
    number: 'M3.4',
    title: 'Learn break',
    objective: 'Exit a loop immediately once a target condition is met.',
    intro:
      'break stops the enclosing loop right away—ideal when scanning for the first open parking slot.',
    exampleCode: 'for i in range(1, 6):\n    if i == 3:\n        break\n    print(i)',
    prompt: 'What numbers get printed before break stops the loop?',
    options: ['1, 2', '1, 2, 3', '3, 4, 5', '1, 2, 4, 5'],
    correctIndex: 0,
    explanation: 'i=1 and i=2 print. At i=3, break exits before print(i) runs.',
    xpReward: XP_REWARDS.mission,
    linkedLessonId: 'l-break-cont',
  },
  {
    id: 'm-loop-continue',
    topic: 'loops',
    number: 'M3.5',
    title: 'Learn continue',
    objective: 'Skip the current iteration and jump to the next pass.',
    intro:
      'Unlike break, continue does NOT exit the loop—it only skips the remaining lines of the current pass.',
    exampleCode: 'for i in range(1, 5):\n    if i == 2:\n        continue\n    print(i)',
    prompt: 'Which numbers are printed by the snippet above?',
    options: ['1', '1, 3, 4', '1, 2, 3, 4', '2, 3, 4'],
    correctIndex: 1,
    explanation: 'Only i=2 is skipped by continue; passes 1, 3, and 4 all print.',
    xpReward: XP_REWARDS.mission,
    linkedLessonId: 'l-break-cont',
  },
  {
    id: 'm-loop-nested',
    topic: 'loops',
    number: 'M3.6',
    title: 'Explore Nested Loops',
    objective: 'Understand how an inner loop completes all passes for each outer step.',
    intro:
      'When one loop sits inside another, total iterations equal outer count × inner count.',
    exampleCode: 'for row in range(2):\n    for col in range(3):\n        print(row, col)',
    prompt: 'How many total pairs does this nested loop print?',
    options: ['5 pairs', '6 pairs', '3 pairs', '2 pairs'],
    correctIndex: 1,
    explanation: '2 outer passes × 3 inner passes = 6 total print executions.',
    xpReward: XP_REWARDS.mission,
    linkedLessonId: 'l-nested',
  },
  {
    id: 'm-loop-real',
    topic: 'loops',
    number: 'M3.7',
    title: 'Complete an Accumulation Mission',
    objective: 'Accumulate a running total across loop iterations.',
    intro:
      'Initialize total = 0 BEFORE the loop starts, then add each item inside the loop body.',
    exampleCode: 'total = 0\nfor note in [100, 200, 500]:\n    total += note\nprint(total)',
    prompt: 'Why must total = 0 be placed BEFORE the for loop?',
    options: [
      'To avoid resetting total back to 0 on every pass',
      'Because Python forbids variables inside loops',
      'So total becomes a string',
      'To make the loop run twice',
    ],
    correctIndex: 0,
    explanation:
      'If total = 0 were inside the loop, each iteration would erase the previous sum.',
    xpReward: XP_REWARDS.mission,
    linkedLessonId: 'l-patterns',
  },
];

export const DAILY_QUEST_BANK: Omit<DailyQuestDef, 'id'>[] = [
  {
    type: 'predict-output',
    topic: 'conditionals',
    difficulty: 'Easy',
    estimatedMinutes: 2,
    xpReward: XP_REWARDS.dailyQuest,
    title: 'Boundary Check Challenge',
    instructions: 'Trace the exact boundary comparison and choose what Python prints.',
    code: 'temp = 28\nif temp > 28:\n    print("AC ON")\nelse:\n    print("AC OFF")',
    options: ['AC ON', 'AC OFF', 'AC ON and AC OFF', 'Nothing'],
    correctIndex: 1,
    hint: 'Check > vs >=. Is 28 strictly greater than 28?',
    explanation: '28 > 28 is False, so Python runs the else branch and prints "AC OFF".',
  },
  {
    type: 'loop-iterations',
    topic: 'loops',
    difficulty: 'Easy',
    estimatedMinutes: 2,
    xpReward: XP_REWARDS.dailyQuest,
    title: 'Countdown Iterations Check',
    instructions: 'Count how many numbers this while loop prints before stopping.',
    code: 'count = 4\nwhile count > 0:\n    print(count)\n    count -= 2',
    options: ['1 number (4)', '2 numbers (4, 2)', '3 numbers (4, 2, 0)', 'Infinite loop'],
    correctIndex: 1,
    hint: 'Trace count after each subtraction: 4 -> 2 -> 0.',
    explanation: 'Prints 4 (count becomes 2), prints 2 (count becomes 0). Then 0 > 0 is False and the loop stops.',
  },
  {
    type: 'find-error',
    topic: 'conditionals',
    difficulty: 'Medium',
    estimatedMinutes: 3,
    xpReward: XP_REWARDS.dailyQuest,
    title: 'Spot the Elif Ordering Bug',
    instructions: 'Find why a student with marks = 95 receives "Pass" instead of "Grade A".',
    code: 'marks = 95\nif marks >= 40:\n    print("Pass")\nelif marks >= 90:\n    print("Grade A")',
    options: [
      'Missing else branch',
      'marks >= 40 is checked before marks >= 90',
      '95 is not an integer',
      'elif cannot follow if',
    ],
    correctIndex: 1,
    hint: 'Python exits an if-elif ladder at the FIRST True branch.',
    explanation: 'Because 95 >= 40 is True first, Python prints "Pass" and never reaches elif marks >= 90.',
  },
  {
    type: 'missing-code',
    topic: 'loops',
    difficulty: 'Easy',
    estimatedMinutes: 2,
    xpReward: XP_REWARDS.dailyQuest,
    title: 'Complete the range() Call',
    instructions: 'Pick the missing range() call that prints: 5, 10, 15.',
    code: 'for n in ___:\n    print(n)',
    options: ['range(5, 15, 5)', 'range(5, 16, 5)', 'range(5, 15)', 'range(0, 15, 5)'],
    correctIndex: 1,
    hint: 'Remember that stop in range(start, stop, step) is excluded.',
    explanation: 'range(5, 16, 5) includes 5, 10, and 15 before stopping prior to 16.',
  },
  {
    type: 'condition-solve',
    topic: 'conditionals',
    difficulty: 'Medium',
    estimatedMinutes: 3,
    xpReward: XP_REWARDS.dailyQuest,
    title: 'Logical Gate Puzzle',
    instructions: 'Determine which output this combined and/or rule produces.',
    code: 'age = 16\nhas_ticket = True\nvip = False\nif (age >= 18 and has_ticket) or vip:\n    print("Enter")\nelse:\n    print("Wait")',
    options: ['Enter', 'Wait', 'True', 'SyntaxError'],
    correctIndex: 1,
    hint: 'Evaluate inside parentheses first: (16 >= 18 and True).',
    explanation: '16 >= 18 is False, making the parentheses False. False or False is False, so "Wait" prints.',
  },
  {
    type: 'predict-output',
    topic: 'loops',
    difficulty: 'Medium',
    estimatedMinutes: 3,
    xpReward: XP_REWARDS.dailyQuest,
    title: 'Break vs Continue Trace',
    instructions: 'Trace both continue and break in this short scanner loop.',
    code: 'for slot in [1, 2, 3, 4]:\n    if slot == 2:\n        continue\n    if slot == 4:\n        break\n    print(slot)',
    options: ['1, 3', '1, 2, 3', '1, 3, 4', '3'],
    correctIndex: 0,
    hint: 'continue skips slot 2; break exits before printing slot 4.',
    explanation: 'slot=1 prints, slot=2 skips via continue, slot=3 prints, slot=4 stops the loop via break.',
  },
  {
    type: 'predict-output',
    topic: 'basics',
    difficulty: 'Easy',
    estimatedMinutes: 2,
    xpReward: XP_REWARDS.dailyQuest,
    title: 'Variable Reassignment Trace',
    instructions: 'Follow how Python updates the score variable step by step.',
    code: 'score = 10\nscore = score + 5\nscore *= 2\nprint(score)',
    options: ['15', '20', '30', '10'],
    correctIndex: 2,
    hint: 'Compute line 2 first (10 + 5), then double that result on line 3.',
    explanation: 'score becomes 15 on line 2, then 15 * 2 = 30 on line 3.',
  },
];

export function getDailyQuestForDate(dateKey: string): DailyQuestDef {
  // Deterministic hash of YYYY-MM-DD so refreshing on the same day never changes the quest
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  const picked = DAILY_QUEST_BANK[hash % DAILY_QUEST_BANK.length];
  return {
    ...picked,
    id: `daily-${dateKey}`,
  };
}

export const FLASHCARDS_BANK: FlashcardDef[] = [
  {
    id: 'fc-var-ref',
    topic: 'basics',
    front: 'How do variables work in Python?',
    codeHint: 'x = 10',
    back: 'A variable is a label/name bound to a value object. Reassigning x = 20 moves the label to a new object.',
    example: 'score = 10\nscore = 25\nprint(score)  # 25',
  },
  {
    id: 'fc-eq-vs-eqeq',
    topic: 'basics',
    front: 'What is the difference between = and ==?',
    codeHint: 'x = 5 vs x == 5',
    back: 'Single = assigns a value to a variable. Double == compares two values and returns True or False.',
    example: 'age = 18\nprint(age == 18)  # True',
  },
  {
    id: 'fc-elif',
    topic: 'conditionals',
    front: 'How does an if-elif-else ladder execute?',
    codeHint: 'if ... elif ... else',
    back: 'Python tests conditions top to bottom and executes ONLY the first branch whose condition is True.',
    example: 'if score >= 90:\n    print("A")\nelif score >= 75:\n    print("B")',
  },
  {
    id: 'fc-logical',
    topic: 'conditionals',
    front: 'Compare and, or, and not',
    codeHint: 'and / or / not',
    back: 'and needs both sides True; or needs at least one True; not reverses a Boolean value.',
    example: 'if age >= 18 and has_id:\n    print("Verified")',
  },
  {
    id: 'fc-range',
    topic: 'loops',
    front: 'What does range(start, stop, step) generate?',
    codeHint: 'range(1, 6, 2)',
    back: 'Generates numbers starting at start, increasing/decreasing by step, stopping strictly BEFORE stop.',
    example: 'for i in range(1, 6, 2):\n    print(i)  # 1, 3, 5',
  },
  {
    id: 'fc-while',
    topic: 'loops',
    front: 'When should you use a while loop instead of for?',
    codeHint: 'while condition:',
    back: 'Use while when repeating until a condition turns False rather than looping a known number of times.',
    example: 'n = 3\nwhile n > 0:\n    print(n)\n    n -= 1',
  },
  {
    id: 'fc-break-continue',
    topic: 'loops',
    front: 'What separates break from continue?',
    codeHint: 'break vs continue',
    back: 'break exits the loop immediately; continue skips only the current iteration and continues with the next pass.',
    example: 'for i in range(5):\n    if i == 2: continue\n    if i == 4: break\n    print(i)',
  },
  {
    id: 'fc-nested-loops',
    topic: 'loops',
    front: 'How many times does an inner loop run inside a nested loop?',
    codeHint: 'for r in range(3): for c in range(4):',
    back: 'For every single pass of the outer loop, the inner loop runs all of its iterations from start to finish.',
    example: 'for r in range(2):\n    for c in range(3):\n        print(r, c)  # 6 lines',
  },
];

export const BUG_HUNT_CHALLENGES: BugChallengeDef[] = [
  {
    id: 'bug-1-syntax',
    topic: 'conditionals',
    category: 'Syntax Error',
    difficulty: 'Easy',
    title: 'Missing Colon & Equality Check',
    description:
      'Fix the syntax bugs so the script checks if age equals 18 and prints "Adult Access".',
    buggyCode: 'age = 18\nif age = 18\n    print("Adult Access")',
    expectedOutput: 'Adult Access',
    hints: [
      'Look closely at line 2 — there are two small syntax mistakes.',
      'In Python, conditions compare with == and end with a colon :.',
      'Replace single = with == and add : at the end of the if line.',
      'Line 2 should read: if age == 18:',
    ],
    solutionCode: 'age = 18\nif age == 18:\n    print("Adult Access")',
    xpReward: XP_REWARDS.bugHunt,
    verify: (output, code) => {
      const ok = output.trim() === 'Adult Access' && /if\s+age\s*==\s*18\s*:/.test(code);
      return ok
        ? { passed: true, message: 'Syntax fixed! Equality == and colon : work cleanly.' }
        : { passed: false, message: 'Expected output "Adult Access" using "if age == 18:".' };
    },
  },
  {
    id: 'bug-2-condition-order',
    topic: 'conditionals',
    category: 'Incorrect Condition',
    difficulty: 'Easy',
    title: 'Flipped Discount Ladder',
    description:
      'A bill of 5200 should get "20% Off", not "10% Off". Reorder or fix the conditions so 5200 prints "20% Off".',
    buggyCode: 'bill = 5200\nif bill >= 2000:\n    print("10% Off")\nelif bill >= 5000:\n    print("20% Off")\nelse:\n    print("No Discount")',
    expectedOutput: '20% Off',
    hints: [
      'Python exits an if-elif ladder at the first True match.',
      'Because 5200 >= 2000 is True, Python never reaches >= 5000.',
      'Check the highest threshold (>= 5000) before >= 2000.',
      'Swap the >= 5000 branch into if and >= 2000 into elif.',
    ],
    solutionCode: 'bill = 5200\nif bill >= 5000:\n    print("20% Off")\nelif bill >= 2000:\n    print("10% Off")\nelse:\n    print("No Discount")',
    xpReward: XP_REWARDS.bugHunt,
    verify: (output, code) => {
      const ok = output.trim() === '20% Off' && code.indexOf('5000') < code.indexOf('2000');
      return ok
        ? { passed: true, message: 'Great catch! Ordering >= 5000 first fixes the ladder.' }
        : { passed: false, message: 'Check that >= 5000 runs before >= 2000 and prints "20% Off".' };
    },
  },
  {
    id: 'bug-3-off-by-one',
    topic: 'loops',
    category: 'Off-by-One Loop',
    difficulty: 'Medium',
    title: 'Missing Floor 5 in range()',
    description:
      'The elevator should print floors 1, 2, 3, 4, and 5—currently it stops at 4. Fix the range() stop bound.',
    buggyCode: 'for floor in range(1, 5):\n    print(floor)',
    expectedOutput: '1\n2\n3\n4\n5',
    hints: [
      'Count how many lines currently print.',
      'range(start, stop) excludes the stop number itself.',
      'Change stop from 5 to 6 so 5 is included.',
      'Line 1 should be: for floor in range(1, 6):',
    ],
    solutionCode: 'for floor in range(1, 6):\n    print(floor)',
    xpReward: XP_REWARDS.bugHunt,
    verify: (output) => {
      const ok = output.trim() === '1\n2\n3\n4\n5';
      return ok
        ? { passed: true, message: 'Off-by-one bug squashed! All 5 floors printed.' }
        : { passed: false, message: 'Output should print numbers 1 through 5 on separate lines.' };
    },
  },
  {
    id: 'bug-4-while-update',
    topic: 'loops',
    category: 'Variable Update',
    difficulty: 'Medium',
    title: 'Broken Countdown Update',
    description:
      'This countdown loop updates count in the wrong direction and triggers an infinite loop guard. Fix it to print 3, 2, 1.',
    buggyCode: 'count = 3\nwhile count > 0:\n    print(count)\n    count += 1',
    expectedOutput: '3\n2\n1',
    hints: [
      'Notice count starts at 3 and the loop checks count > 0.',
      'Look at line 4: count += 1 makes count grow forever (4, 5, 6...).',
      'To count down toward 0, subtract 1 on each pass.',
      'Change line 4 to: count -= 1',
    ],
    solutionCode: 'count = 3\nwhile count > 0:\n    print(count)\n    count -= 1',
    xpReward: XP_REWARDS.bugHunt,
    verify: (output) => {
      const ok = output.trim() === '3\n2\n1';
      return ok
        ? { passed: true, message: 'Countdown fixed! Updating count -= 1 terminates cleanly.' }
        : { passed: false, message: 'Expected output 3, 2, 1 on separate lines.' };
    },
  },
  {
    id: 'bug-5-accumulator',
    topic: 'loops',
    category: 'Wrong Output',
    difficulty: 'Advanced',
    title: 'Accumulator Reset Inside Loop',
    description:
      'We want the total of [100, 200, 500] (which is 800), but total = 0 is resetting on every pass. Fix the bug.',
    buggyCode: 'for note in [100, 200, 500]:\n    total = 0\n    total += note\nprint(total)',
    expectedOutput: '800',
    hints: [
      'Trace what total equals at the start of every iteration.',
      'Setting total = 0 inside the loop wipes out earlier notes.',
      'Initialize total = 0 once BEFORE the for loop starts.',
      'Move total = 0 above line 1.',
    ],
    solutionCode: 'total = 0\nfor note in [100, 200, 500]:\n    total += note\nprint(total)',
    xpReward: XP_REWARDS.bugHunt,
    verify: (output, code) => {
      const ok = output.trim() === '800' && /for\s+note\s+in/.test(code);
      return ok
        ? { passed: true, message: 'Accumulation bug resolved! Total is now 800.' }
        : { passed: false, message: 'Expected final output 800 using the for loop.' };
    },
  },
];

export const SEARCHABLE_CONCEPTS: Array<{
  id: string;
  title: string;
  category: 'Topic' | 'Simulator' | 'Lab Tool' | 'Game' | 'Challenge' | 'Cheat Sheet';
  keywords: string;
  section: 'learn' | 'lab' | 'games' | 'studio' | 'tutor' | 'revision' | 'progress';
  topicId?: TopicId;
  labTab?: string;
  gamesTab?: string;
  revisionTab?: string;
}> = [
  {
    id: 'search-topic-basics',
    title: 'Topic 01: Python Basics & Variables',
    category: 'Topic',
    keywords: 'variables int float str bool print f-string indentation math modulo',
    section: 'learn',
    topicId: 'basics',
  },
  {
    id: 'search-topic-cond',
    title: 'Topic 02: Conditional Statements (if / elif / else)',
    category: 'Topic',
    keywords: 'if else elif nested comparison logical and or not boolean',
    section: 'learn',
    topicId: 'conditionals',
  },
  {
    id: 'search-topic-loops',
    title: 'Topic 03: Loops (for, while, range, break, continue)',
    category: 'Topic',
    keywords: 'for while range break continue nested loops accumulation',
    section: 'learn',
    topicId: 'loops',
  },
  {
    id: 'search-sim-traffic',
    title: 'Traffic Signal Simulator',
    category: 'Simulator',
    keywords: 'if elif else traffic red yellow green conditional',
    section: 'lab',
    labTab: 'simulators',
  },
  {
    id: 'search-sim-atm',
    title: 'ATM Decision Simulator & Cash Counter',
    category: 'Simulator',
    keywords: 'nested if pin balance withdrawal cash counter loop',
    section: 'lab',
    labTab: 'simulators',
  },
  {
    id: 'search-sim-elevator',
    title: 'Elevator Floor & Countdown Simulators',
    category: 'Simulator',
    keywords: 'for range while countdown elevator parking scanner loop',
    section: 'lab',
    labTab: 'simulators',
  },
  {
    id: 'search-lab-memory',
    title: 'Visual Memory Explorer',
    category: 'Lab Tool',
    keywords: 'variables references memory diagram objects reassignment',
    section: 'lab',
    labTab: 'memory-explorer',
  },
  {
    id: 'search-lab-exec',
    title: 'Code Execution Visualizer',
    category: 'Lab Tool',
    keywords: 'line by line trace debugger step forward backward execution',
    section: 'lab',
    labTab: 'execution-visualizer',
  },
  {
    id: 'search-lab-flowchart',
    title: 'Interactive Flowchart Builder',
    category: 'Lab Tool',
    keywords: 'flowchart blocks decision diamond true false python generator',
    section: 'lab',
    labTab: 'flowchart-builder',
  },
  {
    id: 'search-game-escape',
    title: 'Python Escape Room — The Code Vault',
    category: 'Game',
    keywords: 'escape room vault puzzle rooms basics conditionals loops',
    section: 'games',
    gamesTab: 'escape-room',
  },
  {
    id: 'search-game-bughunt',
    title: 'Bug Hunter Lab',
    category: 'Game',
    keywords: 'debug fix errors off by one syntax condition bugs',
    section: 'games',
    gamesTab: 'bug-hunter',
  },
  {
    id: 'search-studio-sandbox',
    title: 'Python Coding Studio & Sandbox',
    category: 'Challenge',
    keywords: 'sandbox editor pyodide run input challenges',
    section: 'studio',
  },
  {
    id: 'search-rev-sheets',
    title: 'Python Cheat Sheets & Flashcards',
    category: 'Cheat Sheet',
    keywords: 'cheat sheet flashcards revision quiz arena notes',
    section: 'revision',
    revisionTab: 'cheat-sheets',
  },
];
