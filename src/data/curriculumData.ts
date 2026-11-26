import { CodingChallenge, LessonDef, PlaygroundExample, QuizQuestion } from '../types';
import { runPythonCode } from '../utils/pythonEngine';

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

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // TOPIC 08: CONDITIONAL STATEMENTS (10 questions)
  {
    id: 'qc1',
    topic: 'conditionals',
    question: 'Which Python keyword is used to test an additional condition after an initial if condition is False?',
    options: ['elseif', 'elif', 'otherwise', 'else if'],
    correctIndex: 1,
    explanation: 'Python uses "elif" (short for else-if). Writing "elseif" or "else if" causes a SyntaxError.',
  },
  {
    id: 'qc2',
    topic: 'conditionals',
    question: 'What is the output of the following Python code?',
    code: 'marks = 78\nif marks >= 90:\n    print("Grade A")\nelif marks >= 75:\n    print("Grade B")\nelif marks >= 40:\n    print("Pass")\nelse:\n    print("Fail")',
    options: ['Grade A', 'Grade B', 'Grade B followed by Pass', 'Pass'],
    correctIndex: 1,
    explanation: 'Python checks conditions from top to bottom and runs only the FIRST matching branch. 78 >= 90 is False, 78 >= 75 is True, so it prints "Grade B" and skips the rest.',
  },
  {
    id: 'qc3',
    topic: 'conditionals',
    question: 'What is the difference between = and == in Python?',
    options: [
      'They do the exact same thing',
      '= compares two values, == assigns a value',
      '= assigns a value to a variable, == compares if two values are equal',
      '== is only used inside loops',
    ],
    correctIndex: 2,
    explanation: 'A single equals sign (=) stores a value in a variable. A double equals sign (==) compares two values and returns True or False.',
  },
  {
    id: 'qc4',
    topic: 'conditionals',
    question: 'What does Python output when this code runs?',
    code: 'age = 16\nif age >= 18:\n    print("Adult")\nprint("Done")',
    options: ['Adult\nDone', 'Done', 'Adult', 'Nothing is printed'],
    correctIndex: 1,
    explanation: 'age >= 18 is False, so the indented print("Adult") is skipped. print("Done") is NOT indented, so it sits outside the if block and always runs.',
  },
  {
    id: 'qc5',
    topic: 'conditionals',
    question: 'Which expression evaluates to True when x = 12 and y = 5?',
    options: [
      'x < 10 and y == 5',
      'x == 12 or y > 20',
      'not (x > y)',
      'x != 12',
    ],
    correctIndex: 1,
    explanation: 'With "or", only one side needs to be True. Since x == 12 is True, the entire expression evaluates to True.',
  },
  {
    id: 'qc6',
    topic: 'conditionals',
    question: 'What happens if you forget the colon (:) at the end of an if line?',
    code: 'x = 10\nif x > 5\n    print("Big")',
    options: [
      'Python guesses where the block starts',
      'It prints nothing and continues',
      'Python raises a SyntaxError',
      'It raises an IndentationError',
    ],
    correctIndex: 2,
    explanation: 'Python requires a colon (:) at the end of every if, elif, else, for, and while header line. Missing it causes a SyntaxError.',
  },
  {
    id: 'qc7',
    topic: 'conditionals',
    question: 'What is the output of this nested if code?',
    code: 'has_ticket = True\nage = 14\nif has_ticket:\n    if age >= 18:\n        print("VIP Entry")\n    else:\n        print("Standard Entry")\nelse:\n    print("No Entry")',
    options: ['VIP Entry', 'Standard Entry', 'No Entry', 'VIP Entry and Standard Entry'],
    correctIndex: 1,
    explanation: 'has_ticket is True so Python enters the outer if. Inside, age >= 18 (14 >= 18) is False, so the inner else branch runs and prints "Standard Entry".',
  },
  {
    id: 'qc8',
    topic: 'conditionals',
    question: 'Which operator checks whether two values are NOT equal?',
    options: ['<>', '!=', 'not=', '==!'],
    correctIndex: 1,
    explanation: 'In Python, != is the "not equal to" comparison operator. For example, 5 != 3 evaluates to True.',
  },
  {
    id: 'qc9',
    topic: 'conditionals',
    question: 'What does `not (10 > 3)` evaluate to?',
    options: ['True', 'False', '10', 'Error'],
    correctIndex: 1,
    explanation: '10 > 3 is True. The "not" operator reverses a boolean value, so not True becomes False.',
  },
  {
    id: 'qc10',
    topic: 'conditionals',
    question: 'Why does indentation matter in Python if statements?',
    options: [
      'It only makes the code look neat; Python ignores spaces',
      'It defines which lines belong inside the if or else block',
      'It makes numbers calculate faster',
      'It is only required for else blocks',
    ],
    correctIndex: 1,
    explanation: 'Unlike languages that use curly braces { }, Python uses indentation (usually 4 spaces) to group statements belonging to an if, elif, or else block.',
  },

  // TOPIC 09: LOOPS (10 questions)
  {
    id: 'ql1',
    topic: 'loops',
    question: 'Which numbers does range(1, 5) produce in Python?',
    options: ['1, 2, 3, 4, 5', '1, 2, 3, 4', '0, 1, 2, 3, 4', '2, 3, 4, 5'],
    correctIndex: 1,
    explanation: 'range(start, stop) includes the start value (1) and EXCLUDES the stop value (5), producing 1, 2, 3, 4.',
  },
  {
    id: 'ql2',
    topic: 'loops',
    question: 'How many times will "Hello" be printed by this loop?',
    code: 'for i in range(4):\n    print("Hello")',
    options: ['3 times', '4 times', '5 times', '0 times'],
    correctIndex: 1,
    explanation: 'range(4) produces 4 values: 0, 1, 2, 3. Therefore the loop body executes 4 times.',
  },
  {
    id: 'ql3',
    topic: 'loops',
    question: 'What is the output of this loop with a step value?',
    code: 'for n in range(2, 9, 3):\n    print(n)',
    options: ['2, 5, 8', '2, 5', '3, 6, 9', '2, 3, 4, 5, 6, 7, 8'],
    correctIndex: 0,
    explanation: 'Starting at 2 and stepping by 3 gives 2, 5, 8. The next value (11) is not less than 9, so the loop stops.',
  },
  {
    id: 'ql4',
    topic: 'loops',
    question: 'What happens if you run this while loop?',
    code: 'count = 1\nwhile count <= 3:\n    print(count)',
    options: [
      'It prints 1, 2, 3 and stops',
      'It prints 1 once and stops',
      'It creates an infinite loop printing 1 forever',
      'It raises a SyntaxError',
    ],
    correctIndex: 2,
    explanation: 'Because count is never updated inside the loop (missing count += 1), count stays 1, so count <= 3 remains True forever!',
  },
  {
    id: 'ql5',
    topic: 'loops',
    question: 'What does the break statement do inside a loop?',
    options: [
      'Skips only the current iteration and continues the loop',
      'Immediately exits the nearest enclosing loop',
      'Restarts the loop from the beginning',
      'Pauses the program for 1 second',
    ],
    correctIndex: 1,
    explanation: 'break immediately terminates the nearest enclosing loop and moves execution to the first line after the loop.',
  },
  {
    id: 'ql6',
    topic: 'loops',
    question: 'What is the output of this code using continue?',
    code: 'for i in range(1, 5):\n    if i == 3:\n        continue\n    print(i)',
    options: ['1\n2\n3\n4', '1\n2', '1\n2\n4', '3'],
    correctIndex: 2,
    explanation: 'When i == 3, continue skips print(i) for that iteration and jumps to the next iteration (i = 4). So 1, 2, 4 are printed.',
  },
  {
    id: 'ql7',
    topic: 'loops',
    question: 'What sequence does range(5, 0, -2) generate?',
    options: ['5, 3, 1', '5, 3, 1, -1', '5, 4, 3, 2, 1', 'Nothing (empty)'],
    correctIndex: 0,
    explanation: 'Starting at 5 and stepping by -2 gives 5, 3, 1. The next value (-1) is beyond stop (0), so it stops at 1.',
  },
  {
    id: 'ql8',
    topic: 'loops',
    question: 'How many total times does the inner print statement run in this nested loop?',
    code: 'for i in range(3):\n    for j in range(2):\n        print(i, j)',
    options: ['3 times', '5 times', '6 times', '2 times'],
    correctIndex: 2,
    explanation: 'The outer loop runs 3 times. For EACH outer iteration, the inner loop runs 2 times. 3 × 2 = 6 total executions.',
  },
  {
    id: 'ql9',
    topic: 'loops',
    question: 'What is the final value printed by this while loop?',
    code: 'x = 10\nwhile x > 4:\n    x -= 3\nprint(x)',
    options: ['7', '4', '1', '10'],
    correctIndex: 1,
    explanation: 'Start x=10 (>4) -> x=7 (>4) -> x=4 (4 > 4 is False, loop stops). Then print(x) outputs 4.',
  },
  {
    id: 'ql10',
    topic: 'loops',
    question: 'When is a while loop usually preferred over a for loop?',
    options: [
      'When you know the exact number of repetitions beforehand',
      'When you want to loop until a specific condition becomes False',
      'When you want to use range()',
      'while loops are always faster than for loops',
    ],
    correctIndex: 1,
    explanation: 'Use a for loop when iterating a known count or sequence (like range(1, 11)). Use a while loop when repetition depends on a changing condition.',
  },
];

export const CODING_CHALLENGES: CodingChallenge[] = [
  // TOPIC 08 CHALLENGES
  {
    id: 'ch-c1',
    topic: 'conditionals',
    title: 'Positive, Negative, or Zero',
    difficulty: 'Beginner',
    description: 'Given a variable `num = -7`, write an if-elif-else statement that prints "Positive" if num > 0, "Negative" if num < 0, or "Zero" if num == 0.',
    requirements: [
      'Keep `num = -7` at the top (feel free to test other values first, then set back to -7 to verify).',
      'Print exactly "Negative" when num is -7.',
    ],
    sampleOutput: 'Negative',
    starterCode: 'num = -7\n\n# Write your if-elif-else logic below\n',
    hint: 'Use `if num > 0:`, `elif num < 0:`, and `else:` with indented `print(...)` calls.',
    solutionCode: 'num = -7\n\nif num > 0:\n    print("Positive")\nelif num < 0:\n    print("Negative")\nelse:\n    print("Zero")',
    validateOutput: (_output, code) => {
      const testCases = [
        { val: 10, expected: 'Positive' },
        { val: -7, expected: 'Negative' },
        { val: 0, expected: 'Zero' },
      ];
      if (!code.includes('if ')) {
        return { passed: false, message: 'Use an if-elif-else conditional structure to solve this.' };
      }
      for (const tc of testCases) {
        const replaced = code.replace(/num\s*=\s*-?\d+/, `num = ${tc.val}`);
        const res = runPythonCode(replaced);
        if (!res.success) {
          return { passed: false, message: res.error?.message || 'Syntax error in your code.' };
        }
        if (res.output.trim() !== tc.expected) {
          return {
            passed: false,
            message: `When num = ${tc.val}, expected "${tc.expected}", but got "${res.output.trim() || '(empty)'}".`,
          };
        }
      }
      return { passed: true, message: 'All 3 test cases (Positive, Negative, Zero) passed!' };
    },
  },
  {
    id: 'ch-c2',
    topic: 'conditionals',
    title: 'Even or Odd Detector',
    difficulty: 'Beginner',
    description: 'Check whether `number = 24` is even or odd using the modulo operator `%`. Print "Even" if divisible by 2, otherwise print "Odd".',
    requirements: [
      'Use `number % 2 == 0` to test divisibility by 2.',
      'Print "Even" or "Odd".',
    ],
    sampleOutput: 'Even',
    starterCode: 'number = 24\n\n# Check if number is even or odd\n',
    hint: 'If `number % 2 == 0:` is True, the remainder after dividing by 2 is 0, meaning the number is Even.',
    solutionCode: 'number = 24\n\nif number % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")',
    validateOutput: (_output, code) => {
      for (const tc of [
        { val: 24, expected: 'Even' },
        { val: 15, expected: 'Odd' },
        { val: 0, expected: 'Even' },
      ]) {
        const replaced = code.replace(/number\s*=\s*-?\d+/, `number = ${tc.val}`);
        const res = runPythonCode(replaced);
        if (!res.success) return { passed: false, message: res.error?.message || 'Code error.' };
        if (res.output.trim() !== tc.expected) {
          return { passed: false, message: `For number = ${tc.val}, expected "${tc.expected}", got "${res.output.trim()}".` };
        }
      }
      return { passed: true, message: 'Passed! Even and odd checks work for all test numbers.' };
    },
  },
  {
    id: 'ch-c3',
    topic: 'conditionals',
    title: 'Greater of Two Numbers',
    difficulty: 'Guided',
    description: 'Compare variables `a = 42` and `b = 65`. Print `65` (the larger value), or `"Equal"` if both numbers are equal.',
    requirements: [
      'Compare `a` and `b` using `>`, `<`, or `==`.',
      'Print the greater number, or `"Equal"` when `a == b`.',
    ],
    sampleOutput: '65',
    starterCode: 'a = 42\nb = 65\n\n# Compare a and b\n',
    hint: 'Check `if a > b: print(a)`, `elif b > a: print(b)`, `else: print("Equal")`.',
    solutionCode: 'a = 42\nb = 65\n\nif a > b:\n    print(a)\nelif b > a:\n    print(b)\nelse:\n    print("Equal")',
    validateOutput: (_output, code) => {
      const cases = [
        { a: 42, b: 65, expected: '65' },
        { a: 99, b: 12, expected: '99' },
        { a: 20, b: 20, expected: 'Equal' },
      ];
      for (const tc of cases) {
        const modified = code
          .replace(/a\s*=\s*-?\d+/, `a = ${tc.a}`)
          .replace(/b\s*=\s*-?\d+/, `b = ${tc.b}`);
        const res = runPythonCode(modified);
        if (!res.success) return { passed: false, message: res.error?.message || 'Execution error.' };
        if (res.output.trim() !== tc.expected) {
          return { passed: false, message: `For a=${tc.a}, b=${tc.b}, expected "${tc.expected}", got "${res.output.trim()}".` };
        }
      }
      return { passed: true, message: 'Great job! All comparison cases passed.' };
    },
  },
  {
    id: 'ch-c4',
    topic: 'conditionals',
    title: 'Student Grade Calculator',
    difficulty: 'Guided',
    description: 'Given `marks = 82`, print `"Grade A"` for 90+, `"Grade B"` for 75–89, `"Pass"` for 40–74, and `"Fail"` below 40.',
    requirements: [
      'Order your `if` and `elif` thresholds from highest (90) to lowest (40).',
      'Include an `else` branch for `"Fail"`.',
    ],
    sampleOutput: 'Grade B',
    starterCode: 'marks = 82\n\n# Write the grade ladder below\n',
    hint: 'Start with `if marks >= 90:`, then `elif marks >= 75:`, `elif marks >= 40:`, and `else:`.',
    solutionCode: 'marks = 82\n\nif marks >= 90:\n    print("Grade A")\nelif marks >= 75:\n    print("Grade B")\nelif marks >= 40:\n    print("Pass")\nelse:\n    print("Fail")',
    validateOutput: (_output, code) => {
      const cases = [
        { m: 95, expected: 'Grade A' },
        { m: 82, expected: 'Grade B' },
        { m: 55, expected: 'Pass' },
        { m: 25, expected: 'Fail' },
      ];
      for (const tc of cases) {
        const modified = code.replace(/marks\s*=\s*-?\d+/, `marks = ${tc.m}`);
        const res = runPythonCode(modified);
        if (!res.success) return { passed: false, message: res.error?.message || 'Error.' };
        if (res.output.trim() !== tc.expected) {
          return { passed: false, message: `When marks = ${tc.m}, expected "${tc.expected}", got "${res.output.trim()}".` };
        }
      }
      return { passed: true, message: 'All 4 grade bands passed accurately!' };
    },
  },
  {
    id: 'ch-c5',
    topic: 'conditionals',
    title: 'Multi-Condition Eligibility',
    difficulty: 'Applied',
    description: 'A student qualifies for a scholarship if `gpa >= 3.5` AND `attendance >= 85`. Given `gpa = 3.8` and `attendance = 90`, print `"Eligible"` if both are met, else `"Not Eligible"`.',
    requirements: [
      'Combine both conditions using the `and` logical operator.',
      'Print `"Eligible"` or `"Not Eligible"`.',
    ],
    sampleOutput: 'Eligible',
    starterCode: 'gpa = 3.8\nattendance = 90\n\n# Check both conditions using "and"\n',
    hint: 'Write `if gpa >= 3.5 and attendance >= 85:` followed by the print statements.',
    solutionCode: 'gpa = 3.8\nattendance = 90\n\nif gpa >= 3.5 and attendance >= 85:\n    print("Eligible")\nelse:\n    print("Not Eligible")',
    validateOutput: (_output, code) => {
      const cases = [
        { g: 3.8, a: 90, expected: 'Eligible' },
        { g: 3.9, a: 70, expected: 'Not Eligible' },
        { g: 3.2, a: 95, expected: 'Not Eligible' },
      ];
      for (const tc of cases) {
        const modified = code
          .replace(/gpa\s*=\s*[\d.]+/, `gpa = ${tc.g}`)
          .replace(/attendance\s*=\s*\d+/, `attendance = ${tc.a}`);
        const res = runPythonCode(modified);
        if (!res.success) return { passed: false, message: res.error?.message || 'Error.' };
        if (res.output.trim() !== tc.expected) {
          return { passed: false, message: `For gpa=${tc.g}, attendance=${tc.a}, expected "${tc.expected}", got "${res.output.trim()}".` };
        }
      }
      return { passed: true, message: 'Excellent! Multi-condition logical evaluation passed.' };
    },
  },

  // TOPIC 09 CHALLENGES
  {
    id: 'ch-l1',
    topic: 'loops',
    title: 'Print Numbers 1 to 10',
    difficulty: 'Beginner',
    description: 'Use a `for` loop with `range()` to print the numbers 1 through 10, one per line.',
    requirements: [
      'Use `for` and `range(1, 11)`.',
      'Remember that `range()` excludes the stop value!',
    ],
    sampleOutput: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10',
    starterCode: '# Print 1 to 10 using a for loop\n',
    hint: 'Write `for i in range(1, 11):` and indent `print(i)`.',
    solutionCode: 'for i in range(1, 11):\n    print(i)',
    validateOutput: (output, code) => {
      if (!code.includes('for ') && !code.includes('while ')) {
        return { passed: false, message: 'Use a loop (for or while) rather than 10 separate print lines.' };
      }
      const expected = '1\n2\n3\n4\n5\n6\n7\n8\n9\n10';
      if (output.trim() !== expected) {
        return { passed: false, message: `Expected numbers 1 through 10 on separate lines. Got:\n${output.trim() || '(empty)'}` };
      }
      return { passed: true, message: 'Perfect! All 10 numbers printed cleanly.' };
    },
  },
  {
    id: 'ch-l2',
    topic: 'loops',
    title: 'Sum of Numbers (1 to 10)',
    difficulty: 'Beginner',
    description: 'Calculate and print the total sum of numbers from 1 to 10 (`1 + 2 + ... + 10`) using a loop and an accumulator variable `total`.',
    requirements: [
      'Initialize `total = 0` before the loop.',
      'Add each number inside the loop using `total += i`, then print `total` after the loop.',
    ],
    sampleOutput: '55',
    starterCode: 'total = 0\n\n# Add numbers 1 to 10 into total\n\nprint(total)\n',
    hint: 'Use `for i in range(1, 11):` and inside it write `total += i`. Put `print(total)` outside the loop.',
    solutionCode: 'total = 0\nfor i in range(1, 11):\n    total += i\nprint(total)',
    validateOutput: (output, code) => {
      if (!code.includes('for ') && !code.includes('while ')) {
        return { passed: false, message: 'Calculate the sum using a for or while loop.' };
      }
      if (output.trim() !== '55') {
        return { passed: false, message: `Expected final sum 55, got "${output.trim() || '(empty)'}". Make sure print(total) is outside the loop.` };
      }
      return { passed: true, message: 'Correct! 1 + 2 + ... + 10 = 55.' };
    },
  },
  {
    id: 'ch-l3',
    topic: 'loops',
    title: 'Multiplication Table of 5',
    difficulty: 'Guided',
    description: 'Print the multiplication table of `5` from `5 x 1 = 5` up to `5 x 5 = 25` (or just the products `5, 10, 15, 20, 25`). Let\'s print each line as `5 x i = result` using an f-string or comma-separated print.',
    requirements: [
      'Loop `i` from 1 to 5 inclusive.',
      'Print lines in the form `5 x 1 = 5` through `5 x 5 = 25`.',
    ],
    sampleOutput: '5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25',
    starterCode: 'num = 5\n\n# Loop from 1 to 5 and print the table\n',
    hint: 'Use `for i in range(1, 6):` and `print(f"{num} x {i} = {num * i}")`.',
    solutionCode: 'num = 5\nfor i in range(1, 6):\n    print(f"{num} x {i} = {num * i}")',
    validateOutput: (output, code) => {
      if (!code.includes('for ') && !code.includes('while ')) {
        return { passed: false, message: 'Use a loop to generate the table.' };
      }
      const expected = '5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25';
      if (output.trim() !== expected) {
        return { passed: false, message: `Expected:\n${expected}\n\nGot:\n${output.trim() || '(empty)'}` };
      }
      return { passed: true, message: 'Awesome! Multiplication table generated cleanly.' };
    },
  },
  {
    id: 'ch-l4',
    topic: 'loops',
    title: 'Count Even Numbers (1 to 20)',
    difficulty: 'Guided',
    description: 'Loop through numbers from 1 to 20 (inclusive) and count how many even numbers exist. Print the final count (`10`).',
    requirements: [
      'Use a loop combined with an `if` statement checking `% 2 == 0`.',
      'Print only the final count (`10`).',
    ],
    sampleOutput: '10',
    starterCode: 'count = 0\n\n# Loop 1 to 20 and count even numbers\n\nprint(count)\n',
    hint: 'Inside `for n in range(1, 21):`, add `if n % 2 == 0: count += 1`.',
    solutionCode: 'count = 0\nfor n in range(1, 21):\n    if n % 2 == 0:\n        count += 1\nprint(count)',
    validateOutput: (output, code) => {
      if ((!code.includes('for ') && !code.includes('while ')) || !code.includes('if ')) {
        return { passed: false, message: 'Combine a loop with an if condition to count the even numbers.' };
      }
      if (output.trim() !== '10') {
        return { passed: false, message: `Expected final count 10, got "${output.trim() || '(empty)'}".` };
      }
      return { passed: true, message: 'Nice work! Combining loops and conditionals is a core skill.' };
    },
  },
  {
    id: 'ch-l5',
    topic: 'loops',
    title: 'Number Triangle Pattern',
    difficulty: 'Applied',
    description: 'Use nested loops (or a loop) to print a 4-row number pattern where row 1 prints `1`, row 2 prints `1 2`, row 3 prints `1 2 3`, and row 4 prints `1 2 3 4`.',
    requirements: [
      'Outer loop runs for rows 1 through 4.',
      'Inner loop prints numbers `1` through `row` separated by spaces.',
    ],
    sampleOutput: '1\n1 2\n1 2 3\n1 2 3 4',
    starterCode: '# Print the 4-row number triangle\nfor row in range(1, 5):\n    for col in range(1, row + 1):\n        print(col, end=" ")\n    print()\n',
    hint: 'The starter code is almost ready—run it and inspect how `end=" "` keeps numbers on the same line, while `print()` starts a new line!',
    solutionCode: 'for row in range(1, 5):\n    for col in range(1, row + 1):\n        print(col, end=" ")\n    print()',
    validateOutput: (output, code) => {
      if (!code.includes('for ') && !code.includes('while ')) {
        return { passed: false, message: 'Use nested loops to generate the pattern.' };
      }
      const normalized = output
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .join('\n');
      const expected = '1\n1 2\n1 2 3\n1 2 3 4';
      if (normalized !== expected) {
        return { passed: false, message: `Expected:\n${expected}\n\nGot:\n${normalized || '(empty)'}` };
      }
      return { passed: true, message: 'Pattern verified! You mastered nested loop execution order.' };
    },
  },
];

export const PLAYGROUND_EXAMPLES: PlaygroundExample[] = [
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
