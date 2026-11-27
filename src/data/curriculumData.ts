import { CodingChallenge, LessonDef, PlaygroundExample, QuizQuestion } from '../types';
import { runPythonCode } from '../utils/pythonEngine';

export const TOPIC_BASICS_LESSONS: LessonDef[] = [
  { id: 'b-vars', topic: 'basics', number: '1.1', title: 'Variables & Memory Boxes', summary: 'Store numbers, text, and True/False values inside named variables.' },
  { id: 'b-types', topic: 'basics', number: '1.2', title: 'Core Data Types', summary: 'Tell int, float, str, and bool apart at a glance.' },
  { id: 'b-io', topic: 'basics', number: '1.3', title: 'Output, Expressions & Indentation', summary: 'Combine print(), f-strings, math operators, and Python spacing rules.' },
];

export const TOPIC_08_LESSONS: LessonDef[] = [
  { id: 'c-intro', topic: 'conditionals', number: '4.1', title: 'Introduction to Decisions', summary: 'Boolean values, True/False, and why programs branch.' },
  { id: 'c-if', topic: 'conditionals', number: '4.2', title: 'The if Statement', summary: 'Syntax, colons, indentation, and single-branch flow.' },
  { id: 'c-ifelse', topic: 'conditionals', number: '4.3', title: 'The if-else Statement', summary: 'Choosing between two mutually exclusive paths.' },
  { id: 'c-elif', topic: 'conditionals', number: '4.4', title: 'The if-elif-else Ladder', summary: 'Multiple conditions, evaluation order, and default branches.' },
  { id: 'c-nested', topic: 'conditionals', number: '4.5', title: 'Nested if Statements', summary: 'Placing decisions inside decisions using indentation.' },
  { id: 'c-compare', topic: 'conditionals', number: '4.6', title: 'Comparison Operators', summary: 'Using ==, !=, >, <, >=, <= and avoiding = mistakes.' },
  { id: 'c-logical', topic: 'conditionals', number: '4.7', title: 'Logical Operators', summary: 'Combining conditions with and, or, and not.' },
  { id: 'c-realworld', topic: 'conditionals', number: '4.8', title: 'Real-World Applications', summary: 'Interactive grade, age, sign, parity, and discount checkers.' },
  { id: 'c-flowchart', topic: 'conditionals', number: '4.9', title: 'Conditional Flowcharts', summary: 'Visualizing Start, Condition, True/False paths, and End.' },
];

export const TOPIC_09_LESSONS: LessonDef[] = [
  { id: 'l-intro', topic: 'loops', number: '6.1', title: 'Introduction to Loops', summary: 'Repetition, iteration, and replacing manual copy-paste.' },
  { id: 'l-for', topic: 'loops', number: '6.2', title: 'The for Loop', summary: 'Loop variables, sequences, and stepping through items.' },
  { id: 'l-range', topic: 'loops', number: '6.3', title: 'The range() Function', summary: 'stop exclusion, start/stop/step, and reverse counting.' },
  { id: 'l-while', topic: 'loops', number: '6.4', title: 'The while Loop', summary: 'Condition-driven repetition and updating loop counters.' },
  { id: 'l-compare', topic: 'loops', number: '6.5', title: 'for vs while Comparison', summary: 'Knowing which loop fits your problem best.' },
  { id: 'l-break', topic: 'loops', number: '6.6', title: 'The break Statement', summary: 'Exiting the nearest enclosing loop immediately.' },
  { id: 'l-continue', topic: 'loops', number: '6.7', title: 'The continue Statement', summary: 'Skipping the rest of the current iteration safely.' },
  { id: 'l-nested', topic: 'loops', number: '6.8', title: 'Nested Loops', summary: 'Outer and inner loops for grids and patterns.' },
  { id: 'l-mistakes', topic: 'loops', number: '6.9', title: 'Common Loop Mistakes', summary: 'Infinite loops, off-by-one bounds, and indentation errors.' },
];

export { QUIZ_QUESTIONS } from './quizQuestionsData';

export { CODING_CHALLENGES } from './challengesData';

export const PLAYGROUND_EXAMPLES: PlaygroundExample[] = [
  {
    id: 'ex-basics-vars',
    title: '0. Variables & f-strings (Basics)',
    topic: 'basics',
    description: 'Stores student data in variables and formats a clean greeting.',
    code: 'name = "Saif"\nlevel = 3\naccuracy = 94.5\nis_ready = True\n\nprint(f"Welcome {name}! Level {level} unlocked.")\nprint("Accuracy:", accuracy, "% | Ready:", is_ready)',
  },
  {
    id: 'ex-basic-if',
    title: '1. Basic if statement',
    topic: 'conditionals',
    description: 'Checks a single condition and prints only when True.',
    code: 'age = 18\n\nif age >= 18:\n    print("Eligible to vote")\n\nprint("Program finished")',
  },
  {
    id: 'ex-if-else',
    title: '2. if-else marks checker',
    topic: 'conditionals',
    description: 'Branches between Pass and Fail based on marks.',
    code: 'marks = 35\n\nif marks >= 40:\n    print("Pass")\nelse:\n    print("Fail")\n    print("Needs another attempt")',
  },
  {
    id: 'ex-elif-grade',
    title: '3. if-elif-else grade checker',
    topic: 'conditionals',
    description: 'Tests multiple grade thresholds in descending order.',
    code: 'marks = 85\n\nif marks >= 90:\n    print("Grade A")\nelif marks >= 75:\n    print("Grade B")\nelif marks >= 40:\n    print("Pass")\nelse:\n    print("Fail")',
  },
  {
    id: 'ex-for-count',
    title: '4. for loop counting',
    topic: 'loops',
    description: 'Iterates through range(1, 6) — notice 6 is excluded.',
    code: 'for i in range(1, 6):\n    print("Step:", i)',
  },
  {
    id: 'ex-while-count',
    title: '5. while loop counting',
    topic: 'loops',
    description: 'Repeats while count <= 5 and increments count each pass.',
    code: 'count = 1\n\nwhile count <= 5:\n    print("Count is", count)\n    count += 1\n\nprint("Loop ended, count =", count)',
  },
  {
    id: 'ex-break',
    title: '6. break statement example',
    topic: 'loops',
    description: 'Exits the loop immediately when target value 4 is found.',
    code: 'for num in range(1, 10):\n    if num == 4:\n        print("Found 4! Stopping early.")\n        break\n    print("Checking:", num)',
  },
  {
    id: 'ex-continue',
    title: '7. continue statement example',
    topic: 'loops',
    description: 'Skips printing the number 3 and moves to the next iteration.',
    code: 'for num in range(1, 6):\n    if num == 3:\n        continue\n    print("Value:", num)',
  },
  {
    id: 'ex-nested-pattern',
    title: '8. Nested loop pattern',
    topic: 'loops',
    description: 'Outer loop controls rows; inner loop controls stars per row.',
    code: 'for row in range(1, 5):\n    for col in range(row):\n        print("*", end=" ")\n    print()',
  },
];
