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

export interface MakeBugVerifierOptions {
  expectedOutput: string;
  mustMatch?: RegExp | RegExp[];
  successMessage?: string;
  failMessage?: string;
}

export function makeBugVerifier({
  expectedOutput,
  mustMatch,
  successMessage = 'Bug squashed! Output and logic verified.',
  failMessage,
}: MakeBugVerifierOptions): (output: string, code: string) => { passed: boolean; message: string } {
  const normalizedExpected = expectedOutput.trim().replace(/\r\n/g, '\n');
  return (output: string, code: string) => {
    const normalizedActual = output.trim().replace(/\r\n/g, '\n');
    if (normalizedActual !== normalizedExpected) {
      return {
        passed: false,
        message:
          failMessage ||
          `Expected output "${normalizedExpected}", but got "${normalizedActual || '(no output)'}".`,
      };
    }

    if (mustMatch) {
      const patterns = Array.isArray(mustMatch) ? mustMatch : [mustMatch];
      for (const pattern of patterns) {
        if (!pattern.test(code)) {
          return {
            passed: false,
            message:
              failMessage ||
              'Output matches, but fix the underlying bug instead of hardcoding print().',
          };
        }
      }
    }

    return { passed: true, message: successMessage };
  };
}

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
  // ---------------------------------------------------------------------------
  // Conditionals (13 new: 6 Easy, 5 Medium, 2 Advanced)
  // ---------------------------------------------------------------------------
  {
    id: 'bug-6-elif-assignment',
    topic: 'conditionals',
    category: 'Syntax Error',
    difficulty: 'Easy',
    title: 'Assignment Inside elif Condition',
    description:
      'Fix the syntax error in the elif condition so tier == 2 prints "Silver".',
    buggyCode: 'tier = 2\nif tier == 1:\n    print("Gold")\nelif tier = 2:\n    print("Silver")\nelse:\n    print("Bronze")',
    expectedOutput: 'Silver',
    hints: [
      'Check line 4 carefully where tier is compared to 2.',
      'Single = assigns a value; conditions require ==.',
      'Change tier = 2 to tier == 2 inside the elif statement.',
      'Line 4 should read: elif tier == 2:',
    ],
    solutionCode: 'tier = 2\nif tier == 1:\n    print("Gold")\nelif tier == 2:\n    print("Silver")\nelse:\n    print("Bronze")',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: 'Silver',
      mustMatch: /elif\s+tier\s*==\s*2\s*:/,
      successMessage: 'Syntax fixed! elif tier == 2: evaluates properly.',
    }),
  },
  {
    id: 'bug-7-else-colon',
    topic: 'conditionals',
    category: 'Syntax Error',
    difficulty: 'Easy',
    title: 'Missing Colon After else',
    description:
      'A score of 45 should print "Fail". Fix the missing punctuation so the program runs cleanly.',
    buggyCode: 'score = 45\nif score >= 50:\n    print("Pass")\nelse\n    print("Fail")',
    expectedOutput: 'Fail',
    hints: [
      'Look at line 4 where the else branch begins.',
      'Every if, elif, and else header in Python must end with a colon :.',
      'Add a colon immediately after else.',
      'Line 4 should be: else:',
    ],
    solutionCode: 'score = 45\nif score >= 50:\n    print("Pass")\nelse:\n    print("Fail")',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: 'Fail',
      mustMatch: /else\s*:/,
      successMessage: 'Colon added! The else block now parses cleanly.',
    }),
  },
  {
    id: 'bug-8-if-indentation',
    topic: 'conditionals',
    category: 'Indentation',
    difficulty: 'Easy',
    title: 'Unindented Alert Inside if',
    description:
      'For temp = 28, nothing should print before "Done". Currently "Heat Alert" prints unconditionally because of wrong indentation.',
    buggyCode: 'temp = 28\nif temp > 35:\nprint("Heat Alert")\nprint("Done")',
    expectedOutput: 'Done',
    hints: [
      'Look at line 3 right after if temp > 35:.',
      'Python uses 4 spaces of indentation to group statements inside an if block.',
      'Indent print("Heat Alert") by 4 spaces so it only runs when temp > 35.',
      'Line 3 should be:     print("Heat Alert")',
    ],
    solutionCode: 'temp = 28\nif temp > 35:\n    print("Heat Alert")\nprint("Done")',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: 'Done',
      mustMatch: /if\s+temp\s*>\s*35\s*:\s*\n\s+print\("Heat Alert"\)/,
      successMessage: 'Indentation repaired! Heat Alert now stays inside the if block.',
    }),
  },
  {
    id: 'bug-9-logical-or-range',
    topic: 'conditionals',
    category: 'Wrong Operator',
    difficulty: 'Easy',
    title: 'Invalid Marks Accepted by "or"',
    description:
      'Marks = 105 is out of 0..100 range and should print "Invalid", but "or" lets it print "Valid". Fix the logical operator.',
    buggyCode: 'marks = 105\nif marks >= 0 or marks <= 100:\n    print("Valid")\nelse:\n    print("Invalid")',
    expectedOutput: 'Invalid',
    hints: [
      '105 >= 0 is True, and True or anything is always True.',
      'To require BOTH bounds at the same time, use "and" instead of "or".',
      'Change or to and in the if condition.',
      'Line 2 should be: if marks >= 0 and marks <= 100:',
    ],
    solutionCode: 'marks = 105\nif marks >= 0 and marks <= 100:\n    print("Valid")\nelse:\n    print("Invalid")',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: 'Invalid',
      mustMatch: /marks\s*>=\s*0\s+and\s+marks\s*<=\s*100/,
      successMessage: 'Logical operator fixed! Both bounds are now enforced with "and".',
    }),
  },
  {
    id: 'bug-10-reversed-comparison',
    topic: 'conditionals',
    category: 'Wrong Operator',
    difficulty: 'Easy',
    title: 'Reversed Comparison Sign',
    description:
      'A 20-year-old should print "Eligible", not "Too Young". Fix the comparison operator.',
    buggyCode: 'age = 20\nif age < 18:\n    print("Eligible")\nelse:\n    print("Too Young")',
    expectedOutput: 'Eligible',
    hints: [
      'Look at the comparison sign on line 2.',
      'age < 18 checks if age is less than 18, which is False for 20.',
      'Replace < with >= so ages 18 and above are Eligible.',
      'Line 2 should be: if age >= 18:',
    ],
    solutionCode: 'age = 20\nif age >= 18:\n    print("Eligible")\nelse:\n    print("Too Young")',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: 'Eligible',
      mustMatch: /if\s+age\s*>=\s*18/,
      successMessage: 'Comparison sign fixed! age >= 18 matches 20 correctly.',
    }),
  },
  {
    id: 'bug-11-even-modulo',
    topic: 'conditionals',
    category: 'Incorrect Condition',
    difficulty: 'Easy',
    title: 'Inverted Even/Odd Check',
    description:
      '14 is an even number and should print "Even", but the remainder check is inverted. Fix the condition.',
    buggyCode: 'n = 14\nif n % 2 == 1:\n    print("Even")\nelse:\n    print("Odd")',
    expectedOutput: 'Even',
    hints: [
      'What is 14 % 2?',
      'Even numbers leave remainder 0 when divided by 2, not 1.',
      'Change n % 2 == 1 to n % 2 == 0.',
      'Line 2 should be: if n % 2 == 0:',
    ],
    solutionCode: 'n = 14\nif n % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: 'Even',
      mustMatch: /n\s*%\s*2\s*==\s*0/,
      successMessage: 'Modulo condition fixed! n % 2 == 0 identifies even numbers.',
    }),
  },
  {
    id: 'bug-12-elif-grade-order',
    topic: 'conditionals',
    category: 'Elif Order',
    difficulty: 'Medium',
    title: 'Backwards Grade Ladder',
    description:
      'Marks = 95 should earn "A+", but the >= 60 branch catches it first and prints "C". Reorder the branches.',
    buggyCode: 'marks = 95\nif marks >= 60:\n    print("C")\nelif marks >= 80:\n    print("A")\nelif marks >= 90:\n    print("A+")\nelse:\n    print("F")',
    expectedOutput: 'A+',
    hints: [
      'Python executes only the FIRST matching branch in an if-elif chain.',
      'Since 95 >= 60 is True, >= 80 and >= 90 are never reached.',
      'Put the highest threshold (>= 90) first, then >= 80, then >= 60.',
      'Start with if marks >= 90: print("A+"), then elif marks >= 80:, then elif marks >= 60:.',
    ],
    solutionCode: 'marks = 95\nif marks >= 90:\n    print("A+")\nelif marks >= 80:\n    print("A")\nelif marks >= 60:\n    print("C")\nelse:\n    print("F")',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: 'A+',
      mustMatch: [/marks\s*>=\s*90/, /marks\s*>=\s*60/],
      successMessage: 'Ladder reordered! Highest threshold >= 90 now evaluates first.',
    }),
  },
  {
    id: 'bug-13-leap-year-century',
    topic: 'conditionals',
    category: 'Incorrect Condition',
    difficulty: 'Medium',
    title: 'Century Year Leap Bug (1900)',
    description:
      '1900 is divisible by 4 and 100, but NOT by 400—so it is "Not Leap". Fix the leap year condition.',
    buggyCode: 'year = 1900\nif year % 4 == 0:\n    print("Leap")\nelse:\n    print("Not Leap")',
    expectedOutput: 'Not Leap',
    hints: [
      'Divisibility by 4 alone falsely marks century years like 1900 as leap.',
      'A year is leap if divisible by 400, OR (divisible by 4 AND not divisible by 100).',
      'Combine (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0).',
      'Line 2: if (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:',
    ],
    solutionCode: 'year = 1900\nif (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:\n    print("Leap")\nelse:\n    print("Not Leap")',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: 'Not Leap',
      mustMatch: [/100/, /400/],
      successMessage: 'Century rule applied! 1900 is properly rejected as Not Leap.',
    }),
  },
  {
    id: 'bug-14-nested-else-indent',
    topic: 'conditionals',
    category: 'Indentation',
    difficulty: 'Medium',
    title: 'Dangling Nested else Block',
    description:
      'When has_id is False, "No ID" should print. Currently else is indented under the inner if, so nothing prints!',
    buggyCode: 'has_id = False\nage = 20\nif has_id:\n    if age >= 18:\n        print("Allowed")\n    else:\n        print("No ID")',
    expectedOutput: 'No ID',
    hints: [
      'Check which "if" the else on line 6 lines up with.',
      'Because else has 4 spaces, it belongs to if age >= 18:, not if has_id:.',
      'Unindent else: and print("No ID") by 4 spaces so else pairs with if has_id:.',
      'Lines 6-7 should start at column 0 (else:) and 4 spaces (print("No ID")).',
    ],
    solutionCode: 'has_id = False\nage = 20\nif has_id:\n    if age >= 18:\n        print("Allowed")\nelse:\n    print("No ID")',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: 'No ID',
      mustMatch: /\nelse:\s*\n\s+print\("No ID"\)/,
      successMessage: 'Dangling else fixed! Now pairs cleanly with outer if has_id.',
    }),
  },
  {
    id: 'bug-15-banned-or-bug',
    topic: 'conditionals',
    category: 'Wrong Operator',
    difficulty: 'Medium',
    title: 'Banned User Allowed by "or"',
    description:
      'A banned user with a pass (is_banned = True, has_pass = True) should print "Denied". Fix the boolean logic.',
    buggyCode: 'is_banned = True\nhas_pass = True\nif not is_banned or has_pass:\n    print("Access Granted")\nelse:\n    print("Denied")',
    expectedOutput: 'Denied',
    hints: [
      'not is_banned is False, while has_pass is True.',
      'Using "or" grants access even when the user is banned!',
      'Require BOTH: not banned AND having a pass.',
      'Change line 3 to: if not is_banned and has_pass:',
    ],
    solutionCode: 'is_banned = True\nhas_pass = True\nif not is_banned and has_pass:\n    print("Access Granted")\nelse:\n    print("Denied")',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: 'Denied',
      mustMatch: /not\s+is_banned\s+and\s+has_pass/,
      successMessage: 'Access control tightened! Banned users are now blocked.',
    }),
  },
  {
    id: 'bug-16-zero-division-guard',
    topic: 'conditionals',
    category: 'Runtime Error',
    difficulty: 'Medium',
    title: 'ZeroDivisionError in Guard Check',
    description:
      'When denom = 0, the script crashes with Division by zero! Fix the guard condition so it prints "Cannot Divide".',
    buggyCode: 'num = 50\ndenom = 0\nif denom >= 0:\n    print(num // denom)\nelse:\n    print("Cannot Divide")',
    expectedOutput: 'Cannot Divide',
    hints: [
      'Why does num // denom crash when denom is 0?',
      'denom >= 0 is True for 0, letting 50 // 0 execute!',
      'Change denom >= 0 to denom > 0 (or denom != 0).',
      'Line 3 should be: if denom > 0:',
    ],
    solutionCode: 'num = 50\ndenom = 0\nif denom > 0:\n    print(num // denom)\nelse:\n    print("Cannot Divide")',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: 'Cannot Divide',
      mustMatch: /if\s+denom\s*(>|!=)\s*0/,
      successMessage: 'ZeroDivisionError prevented! Guard properly blocks denom == 0.',
    }),
  },
  {
    id: 'bug-17-two-ifs-vs-elif',
    topic: 'conditionals',
    category: 'Elif Order',
    difficulty: 'Advanced',
    title: 'Double Print From Separate ifs',
    description:
      'For units = 250, only "Tier 2" should print, but two independent if statements print both "Tier 2" and "Tier 1". Fix it.',
    buggyCode: 'units = 250\nif units > 200:\n    print("Tier 2")\nif units > 100:\n    print("Tier 1")\nelse:\n    print("Base")',
    expectedOutput: 'Tier 2',
    hints: [
      'Two separate "if" statements are evaluated independently.',
      '250 is both > 200 AND > 100, so both print statements run.',
      'Link the second condition to the first using elif.',
      'Change line 4 from if units > 100: to elif units > 100:',
    ],
    solutionCode: 'units = 250\nif units > 200:\n    print("Tier 2")\nelif units > 100:\n    print("Tier 1")\nelse:\n    print("Base")',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: 'Tier 2',
      mustMatch: /elif\s+units\s*>\s*100/,
      successMessage: 'Mutually exclusive branching restored using elif!',
    }),
  },
  {
    id: 'bug-18-triangle-inequality',
    topic: 'conditionals',
    category: 'Incorrect Condition',
    difficulty: 'Advanced',
    title: 'Broken Triangle Inequality Check',
    description:
      'Sides 3, 4, 10 cannot form a triangle (3 + 4 < 10) and must print "Invalid". Fix the logical operators.',
    buggyCode: 'a = 3\nb = 4\nc = 10\nif a + b > c or a + c > b or b + c > a:\n    print("Valid")\nelse:\n    print("Invalid")',
    expectedOutput: 'Invalid',
    hints: [
      'A triangle is valid ONLY if ALL THREE side-sum pairs exceed the third side.',
      'Using "or" passes as soon as any single pair like 4 + 10 > 3 is True.',
      'Replace both "or" operators with "and".',
      'Line 4: if a + b > c and a + c > b and b + c > a:',
    ],
    solutionCode: 'a = 3\nb = 4\nc = 10\nif a + b > c and a + c > b and b + c > a:\n    print("Valid")\nelse:\n    print("Invalid")',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: 'Invalid',
      mustMatch: /a\s*\+\s*b\s*>\s*c\s+and\s+a\s*\+\s*c\s*>\s*b\s+and\s+b\s*\+\s*c\s*>\s*a/,
      successMessage: 'Triangle inequality theorem enforced across all 3 sides!',
    }),
  },
  // ---------------------------------------------------------------------------
  // Loops (12 new: 4 Easy, 4 Medium, 4 Advanced)
  // ---------------------------------------------------------------------------
  {
    id: 'bug-19-for-colon',
    topic: 'loops',
    category: 'Syntax Error',
    difficulty: 'Easy',
    title: 'Missing Colon in for Header',
    description:
      'Fix the syntax error on line 1 so the loop prints 0, 1, 2, 3 on separate lines.',
    buggyCode: 'for i in range(4)\n    print(i)',
    expectedOutput: '0\n1\n2\n3',
    hints: [
      'Look at the end of line 1.',
      'for loop headers in Python must end with a colon :.',
      'Add : after range(4).',
      'Line 1 should read: for i in range(4):',
    ],
    solutionCode: 'for i in range(4):\n    print(i)',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: '0\n1\n2\n3',
      mustMatch: /for\s+i\s+in\s+range\s*\(\s*4\s*\)\s*:/,
      successMessage: 'Syntax fixed! Loop runs from 0 to 3.',
    }),
  },
  {
    id: 'bug-20-range-start-bound',
    topic: 'loops',
    category: 'Wrong Range',
    difficulty: 'Easy',
    title: 'Zero-Based vs 1-Based Range',
    description:
      'The badge counter should print 1, 2, 3 instead of 0, 1, 2. Update the range() bounds.',
    buggyCode: 'for badge in range(3):\n    print(badge)',
    expectedOutput: '1\n2\n3',
    hints: [
      'range(3) starts at 0 and stops before 3 (0, 1, 2).',
      'Pass both start and stop arguments to range(start, stop).',
      'Remember stop is exclusive, so to include 3, stop must be 4.',
      'Line 1 should be: for badge in range(1, 4):',
    ],
    solutionCode: 'for badge in range(1, 4):\n    print(badge)',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: '1\n2\n3',
      mustMatch: /range\s*\(\s*1\s*,\s*4\s*\)/,
      successMessage: 'Range fixed! Prints 1, 2, 3 cleanly.',
    }),
  },
  {
    id: 'bug-21-print-inside-loop',
    topic: 'loops',
    category: 'Indentation',
    difficulty: 'Easy',
    title: 'Printing Partial Sums Every Step',
    description:
      'We only want the final sum (10) of numbers 1 to 4, not intermediate totals (1, 3, 6, 10). Fix the indentation.',
    buggyCode: 'total = 0\nfor x in range(1, 5):\n    total += x\n    print(total)',
    expectedOutput: '10',
    hints: [
      'Why does print(total) run 4 times instead of once?',
      'Because line 4 is indented inside the for loop body.',
      'Unindent print(total) so it runs only AFTER the loop finishes.',
      'Move print(total) to column 0.',
    ],
    solutionCode: 'total = 0\nfor x in range(1, 5):\n    total += x\nprint(total)',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: '10',
      mustMatch: /\nprint\(total\)/,
      successMessage: 'Final total printed once after loop completion!',
    }),
  },
  {
    id: 'bug-22-negative-step-range',
    topic: 'loops',
    category: 'Wrong Range',
    difficulty: 'Easy',
    title: 'Silent Reverse range()',
    description:
      'We want to print even countdown numbers: 10, 8, 6, 4, 2. Currently range(10, 0) prints nothing! Add the step argument.',
    buggyCode: 'for n in range(10, 0):\n    print(n)',
    expectedOutput: '10\n8\n6\n4\n2',
    hints: [
      'By default, range() steps by +1, so range(10, 0) is empty.',
      'To count backwards by 2s, pass a third step argument: -2.',
      'Use range(start, stop, step) with -2.',
      'Line 1 should be: for n in range(10, 0, -2):',
    ],
    solutionCode: 'for n in range(10, 0, -2):\n    print(n)',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: '10\n8\n6\n4\n2',
      mustMatch: /range\s*\(\s*10\s*,\s*0\s*,\s*-2\s*\)/,
      successMessage: 'Reverse step added! Countdown 10 to 2 works.',
    }),
  },
  {
    id: 'bug-23-infinite-while-missing-inc',
    topic: 'loops',
    category: 'Infinite Loop',
    difficulty: 'Medium',
    title: 'Frozen While Loop Counter',
    description:
      'This while loop triggers the InfiniteLoopGuard because i never changes! Fix it to print 1, 2, 3, 4.',
    buggyCode: 'i = 1\nwhile i <= 4:\n    print(i)',
    expectedOutput: '1\n2\n3\n4',
    hints: [
      'Trace what i equals on the 1st, 2nd, and 100th iteration.',
      'i starts at 1 and is never incremented inside the while block.',
      'Add i += 1 inside the loop body after print(i).',
      'Add a 4th line (indented): i += 1',
    ],
    solutionCode: 'i = 1\nwhile i <= 4:\n    print(i)\n    i += 1',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: '1\n2\n3\n4',
      mustMatch: /i\s*(\+=|=\s*i\s*\+)\s*1/,
      successMessage: 'Infinite loop resolved! Counter advances cleanly.',
    }),
  },
  {
    id: 'bug-24-off-by-one-factorial',
    topic: 'loops',
    category: 'Off-by-One Loop',
    difficulty: 'Medium',
    title: 'Factorial Off-by-One (4! vs 5!)',
    description:
      '5! should equal 120, but range(1, n) stops at 4 and prints 24. Fix the upper bound.',
    buggyCode: 'n = 5\nfact = 1\nfor i in range(1, n):\n    fact *= i\nprint(fact)',
    expectedOutput: '120',
    hints: [
      'In range(1, 5), the loop runs for i = 1, 2, 3, 4 — skipping 5.',
      'To multiply by n as well, extend the stop bound by 1.',
      'Change range(1, n) to range(1, n + 1).',
      'Line 3 should be: for i in range(1, n + 1):',
    ],
    solutionCode: 'n = 5\nfact = 1\nfor i in range(1, n + 1):\n    fact *= i\nprint(fact)',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: '120',
      mustMatch: /range\s*\(\s*1\s*,\s*n\s*\+\s*1\s*\)/,
      successMessage: 'Factorial fixed! 5! = 120 computed accurately.',
    }),
  },
  {
    id: 'bug-25-continue-infinite-while',
    topic: 'loops',
    category: 'break/continue',
    difficulty: 'Medium',
    title: 'continue Skipping Loop Update',
    description:
      'We want to print 1, 2, 4, 5 (skipping 3), but hitting continue skips i += 1 and triggers an infinite loop!',
    buggyCode: 'i = 0\nwhile i < 5:\n    if i == 2:\n        continue\n    i += 1\n    print(i)',
    expectedOutput: '1\n2\n4\n5',
    hints: [
      'When i becomes 2, if i == 2: runs continue immediately.',
      'That jumps back to while i < 5: BEFORE i += 1 executes, trapping i at 2 forever!',
      'Increment i += 1 before checking or continuing.',
      'Move i += 1 above if i == 3: (or increment inside the if before continue).',
    ],
    solutionCode: 'i = 0\nwhile i < 5:\n    i += 1\n    if i == 3:\n        continue\n    print(i)',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: '1\n2\n4\n5',
      mustMatch: [/while\s+i\s*<\s*5/, /continue/],
      successMessage: 'Infinite continue trap resolved! Prints 1, 2, 4, 5.',
    }),
  },
  {
    id: 'bug-26-break-instead-of-continue',
    topic: 'loops',
    category: 'break/continue',
    difficulty: 'Medium',
    title: 'break Halting Loop Early',
    description:
      'This loop should skip multiples of 3 and print 1, 2, 4, 5. Currently break stops the entire loop at 3!',
    buggyCode: 'for num in range(1, 6):\n    if num % 3 == 0:\n        break\n    print(num)',
    expectedOutput: '1\n2\n4\n5',
    hints: [
      'Look at line 3 when num reaches 3.',
      'break terminates the whole loop immediately, so 4 and 5 never run.',
      'Use continue to skip just the current iteration.',
      'Replace break with continue on line 3.',
    ],
    solutionCode: 'for num in range(1, 6):\n    if num % 3 == 0:\n        continue\n    print(num)',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: '1\n2\n4\n5',
      mustMatch: /continue/,
      successMessage: 'Replaced break with continue! Only multiples of 3 are skipped.',
    }),
  },
  {
    id: 'bug-27-nested-while-reset',
    topic: 'loops',
    category: 'Variable Update',
    difficulty: 'Advanced',
    title: 'Unreset Inner Loop Counter',
    description:
      'Nested while loops should count 6 total steps (3 rows × 2 cols), but col = 1 is never reset, giving only 2! Fix it.',
    buggyCode: 'row = 1\ncol = 1\ncount = 0\nwhile row <= 3:\n    while col <= 2:\n        count += 1\n        col += 1\n    row += 1\nprint(count)',
    expectedOutput: '6',
    hints: [
      'After row 1 finishes, col has become 3.',
      'For row 2 and row 3, while col <= 2: is immediately False!',
      'Reset col = 1 inside the outer while loop before the inner while loop starts.',
      'Move col = 1 inside while row <= 3: (right above while col <= 2:).',
    ],
    solutionCode: 'row = 1\ncount = 0\nwhile row <= 3:\n    col = 1\n    while col <= 2:\n        count += 1\n        col += 1\n    row += 1\nprint(count)',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: '6',
      mustMatch: /while\s+row\s*<=\s*3:\s*\n\s+col\s*=\s*1/,
      successMessage: 'Inner loop counter properly reset per row! Total steps = 6.',
    }),
  },
  {
    id: 'bug-28-prime-else-overwrite',
    topic: 'loops',
    category: 'break/continue',
    difficulty: 'Advanced',
    title: 'Prime Flag Overwritten in Loop',
    description:
      '9 is divisible by 3, so it should print "Not Prime", but the else branch sets is_prime = True for later divisors (4..8)! Fix it.',
    buggyCode: 'n = 9\nis_prime = True\nfor d in range(2, n):\n    if n % d == 0:\n        is_prime = False\n    else:\n        is_prime = True\nif is_prime:\n    print("Prime")\nelse:\n    print("Not Prime")',
    expectedOutput: 'Not Prime',
    hints: [
      'When d = 3, is_prime becomes False. Then when d = 4, 9 % 4 != 0 runs else and resets it to True!',
      'Once any divisor is found, the number is definitely NOT prime.',
      'Remove the else: is_prime = True block inside the loop and add break after is_prime = False.',
      'Keep is_prime = True before the loop, set is_prime = False and break on n % d == 0.',
    ],
    solutionCode: 'n = 9\nis_prime = True\nfor d in range(2, n):\n    if n % d == 0:\n        is_prime = False\n        break\nif is_prime:\n    print("Prime")\nelse:\n    print("Not Prime")',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: 'Not Prime',
      mustMatch: [/is_prime\s*=\s*False/, /break/],
      successMessage: 'Prime detector fixed! Exits immediately on first divisor.',
    }),
  },
  {
    id: 'bug-29-float-div-digit-sum',
    topic: 'loops',
    category: 'Wrong Operator',
    difficulty: 'Advanced',
    title: 'Float Division in Digit Sum',
    description:
      'Sum of digits of 472 should be 13 (4+7+2), but n /= 10 produces floats and breaks the digit extraction. Fix the operator.',
    buggyCode: 'n = 472\ns = 0\nwhile n > 0:\n    s += n % 10\n    n /= 10\nprint(s)',
    expectedOutput: '13',
    hints: [
      'In Python 3, / performs floating-point division (472 / 10 = 47.2).',
      'To strip the last digit cleanly as an integer, use integer floor division //.',
      'Change n /= 10 to n //= 10.',
      'Line 5 should be: n //= 10',
    ],
    solutionCode: 'n = 472\ns = 0\nwhile n > 0:\n    s += n % 10\n    n //= 10\nprint(s)',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: '13',
      mustMatch: /n\s*(\/\/=|\/\/)\s*10/,
      successMessage: 'Integer floor division //= fixed the digit sum to 13!',
    }),
  },
  {
    id: 'bug-30-fibonacci-overwrite',
    topic: 'loops',
    category: 'Variable Update',
    difficulty: 'Advanced',
    title: 'Clobbered Fibonacci State',
    description:
      'The 6th Fibonacci number (0, 1, 1, 2, 3, 5) should print 5, but updating a = b before b = a + b produces 16! Use a temp variable.',
    buggyCode: 'a = 0\nb = 1\nfor i in range(5):\n    a = b\n    b = a + b\nprint(a)',
    expectedOutput: '5',
    hints: [
      'Line 4 overwrites "a" with "b" BEFORE line 5 computes a + b.',
      'Because "a" is already equal to "b", b = a + b just doubles b every time!',
      'Save nxt = a + b first, then assign a = b and b = nxt.',
      'Replace lines 4-5 with: nxt = a + b; a = b; b = nxt',
    ],
    solutionCode: 'a = 0\nb = 1\nfor i in range(5):\n    nxt = a + b\n    a = b\n    b = nxt\nprint(a)',
    xpReward: XP_REWARDS.bugHunt,
    verify: makeBugVerifier({
      expectedOutput: '5',
      mustMatch: /for\s+i\s+in\s+range\s*\(\s*5\s*\)/,
      successMessage: 'Fibonacci transition preserved! 6th term = 5.',
    }),
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
