import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    "id": "qb1",
    "topic": "basics",
    "difficulty": "Easy",
    "kind": "error",
    "question": "Which of the following is an INVALID variable name in Python?",
    "options": [
      "1st_rank",
      "_student_rank",
      "rank_1",
      "Rank"
    ],
    "correctIndex": 0,
    "explanation": "Python variable names cannot start with a digit. '1st_rank' raises a SyntaxError."
  },
  {
    "id": "qb2",
    "topic": "basics",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What is the output of the following exponentiation expression?",
    "code": "print(2 ** 3 ** 2)",
    "options": [
      "64",
      "512",
      "36",
      "256"
    ],
    "correctIndex": 1,
    "explanation": "In Python, the ** operator is right-associative: 2 ** (3 ** 2) = 2 ** 9 = 512, NOT (2 ** 3) ** 2."
  },
  {
    "id": "qb3",
    "topic": "basics",
    "difficulty": "Easy",
    "kind": "output",
    "question": "What is the output of floor division and modulo on positive integers?",
    "code": "print(10 // 3, 10 % 3)",
    "options": [
      "3.33 1",
      "3 0",
      "3 1",
      "3.0 1.0"
    ],
    "correctIndex": 2,
    "explanation": "// computes integer quotient (10 // 3 = 3) and % computes remainder (10 % 3 = 1)."
  },
  {
    "id": "qb4",
    "topic": "basics",
    "difficulty": "Hard",
    "kind": "output",
    "question": "What does Python print for floor division with a negative dividend?",
    "code": "print(-7 // 2, -7 % 2)",
    "options": [
      "-3 -1",
      "-3 1",
      "-4 -1",
      "-4 1"
    ],
    "correctIndex": 3,
    "explanation": "Python floor division rounds down towards -infinity (-3.5 -> -4). Then remainder = -7 - (-4 * 2) = 1."
  },
  {
    "id": "qb5",
    "topic": "basics",
    "difficulty": "Hard",
    "kind": "output",
    "question": "What is the result when dividing a positive integer by a negative integer?",
    "code": "print(7 // -2, 7 % -2)",
    "options": [
      "-4 -1",
      "-3 1",
      "-3 -1",
      "-4 1"
    ],
    "correctIndex": 0,
    "explanation": "7 // -2 rounds down towards -infinity to -4. Then 7 - (-4 * -2) = 7 - 8 = -1."
  },
  {
    "id": "qb6",
    "topic": "basics",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What is the output according to operator precedence?",
    "code": "print(2 + 3 * 4 ** 2)",
    "options": [
      "80",
      "50",
      "400",
      "38"
    ],
    "correctIndex": 1,
    "explanation": "** has highest precedence: 4 ** 2 = 16. Then multiplication: 3 * 16 = 48. Finally addition: 2 + 48 = 50."
  },
  {
    "id": "qb7",
    "topic": "basics",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What value does the 'or' operator return in this short-circuit expression?",
    "code": "x = 0 or 25\nprint(x)",
    "options": [
      "True",
      "0",
      "25",
      "False"
    ],
    "correctIndex": 2,
    "explanation": "'or' evaluates the first operand. Since 0 is falsy, it short-circuits to and returns the second operand (25)."
  },
  {
    "id": "qb8",
    "topic": "basics",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What value does the 'and' operator return when both operands are truthy?",
    "code": "x = 10 and 20\nprint(x)",
    "options": [
      "True",
      "10",
      "30",
      "20"
    ],
    "correctIndex": 3,
    "explanation": "With 'and', if the first operand is truthy, Python evaluates and returns the second operand (20)."
  },
  {
    "id": "qb9",
    "topic": "basics",
    "difficulty": "Easy",
    "kind": "output",
    "question": "What is printed when the first operand of 'and' is 0?",
    "code": "x = 0 and 50\nprint(x)",
    "options": [
      "0",
      "50",
      "False",
      "None"
    ],
    "correctIndex": 0,
    "explanation": "0 is falsy. 'and' immediately stops (short-circuits) and returns 0 without evaluating 50."
  },
  {
    "id": "qb10",
    "topic": "basics",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What does bool('False') evaluate to?",
    "code": "print(bool('False'))",
    "options": [
      "False",
      "True",
      "None",
      "Error"
    ],
    "correctIndex": 1,
    "explanation": "In Python, any non-empty string is truthy! Only the empty string '' converts to False."
  },
  {
    "id": "qb11",
    "topic": "basics",
    "difficulty": "Easy",
    "kind": "fill",
    "question": "Which of the following values evaluates to True in Python?",
    "options": [
      "bool(0)",
      "bool('')",
      "bool(-5)",
      "bool(0.0)"
    ],
    "correctIndex": 2,
    "explanation": "Any non-zero number (including negative numbers like -5) evaluates to True in boolean context."
  },
  {
    "id": "qb12",
    "topic": "basics",
    "difficulty": "Medium",
    "kind": "error",
    "question": "What error occurs when running this type conversion?",
    "code": "val = int('12.5')",
    "options": [
      "TypeError",
      "SyntaxError",
      "No error, val becomes 12",
      "ValueError"
    ],
    "correctIndex": 3,
    "explanation": "int() cannot directly parse a string containing a decimal point. You must do int(float('12.5'))."
  },
  {
    "id": "qb13",
    "topic": "basics",
    "difficulty": "Easy",
    "kind": "output",
    "question": "What is the output of multiplying a string by an integer?",
    "code": "print('Py' * 3)",
    "options": [
      "PyPyPy",
      "Py*3",
      "Py 3",
      "TypeError"
    ],
    "correctIndex": 0,
    "explanation": "The * operator repeats a string N times, producing 'PyPyPy'."
  },
  {
    "id": "qb14",
    "topic": "basics",
    "difficulty": "Easy",
    "kind": "output",
    "question": "What is the output of string concatenation with str()?",
    "code": "a = '10'\nb = 20\nprint(a + str(b))",
    "options": [
      "30",
      "1020",
      "10 20",
      "TypeError"
    ],
    "correctIndex": 1,
    "explanation": "str(20) is '20'. '10' + '20' concatenates the strings to produce '1020'."
  },
  {
    "id": "qb15",
    "topic": "basics",
    "difficulty": "Easy",
    "kind": "output",
    "question": "What is printed after swapping variables using a temporary variable?",
    "code": "a = 5\nb = 10\ntemp = a\na = b\nb = temp\nprint(a, b)",
    "options": [
      "5 10",
      "10 10",
      "10 5",
      "5 5"
    ],
    "correctIndex": 2,
    "explanation": "temp holds original a (5), letting b receive 5 while a takes 10."
  },
  {
    "id": "qb16",
    "topic": "basics",
    "difficulty": "Easy",
    "kind": "fill",
    "question": "Fill in the blank to check if variable 'val' is of integer type:",
    "code": "val = 42\nif ___:\n    print('Integer')",
    "options": [
      "val.type == 'int'",
      "typeof(val) == int",
      "is_int(val)",
      "type(val) == int"
    ],
    "correctIndex": 3,
    "explanation": "type(val) == int (or isinstance(val, int)) checks the type of variable val."
  },
  {
    "id": "qb17",
    "topic": "basics",
    "difficulty": "Easy",
    "kind": "concept",
    "question": "Is Python case-sensitive for variable names?",
    "code": "x = 5\nX = 10\nprint(x + X)",
    "options": [
      "15",
      "10",
      "20",
      "NameError"
    ],
    "correctIndex": 0,
    "explanation": "Python is case-sensitive, so x and X are two distinct variables. 5 + 10 = 15."
  },
  {
    "id": "qb18",
    "topic": "basics",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What is printed after reassigning one of the chained variables?",
    "code": "a = b = 7\nb = 10\nprint(a)",
    "options": [
      "10",
      "7",
      "None",
      "SyntaxError"
    ],
    "correctIndex": 1,
    "explanation": "Integers are immutable. Reassigning b = 10 binds b to a new object, leaving a pointing to 7."
  },
  {
    "id": "qb19",
    "topic": "basics",
    "difficulty": "Hard",
    "kind": "concept",
    "question": "What is the output according to boolean operator precedence?",
    "code": "print(not False or True and False)",
    "options": [
      "False",
      "None",
      "True",
      "Error"
    ],
    "correctIndex": 2,
    "explanation": "Precedence: 'not' > 'and' > 'or'. not False = True. True and False = False. True or False = True."
  },
  {
    "id": "qb20",
    "topic": "basics",
    "difficulty": "Easy",
    "kind": "error",
    "question": "What error is raised by the line: `1student = 'Aarav'`?",
    "options": [
      "NameError",
      "TypeError",
      "ValueError",
      "SyntaxError"
    ],
    "correctIndex": 3,
    "explanation": "Starting an identifier with a digit violates Python grammar and causes a SyntaxError at compile time."
  },
  {
    "id": "qb21",
    "topic": "basics",
    "difficulty": "Easy",
    "kind": "concept",
    "question": "What type and value does standard division / always return in Python 3?",
    "code": "print(10 / 2)",
    "options": [
      "5.0",
      "5",
      "5.00",
      "TypeError"
    ],
    "correctIndex": 0,
    "explanation": "In Python 3, single slash / always performs true floating-point division and returns a float (5.0)."
  },
  {
    "id": "qb22",
    "topic": "basics",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What is the output when floor division involves a float operand?",
    "code": "print(7.0 // 2)",
    "options": [
      "3",
      "3.0",
      "3.5",
      "4.0"
    ],
    "correctIndex": 1,
    "explanation": "If either operand in // is a float, the result is floored but returned as a float (3.0)."
  },
  {
    "id": "qb23",
    "topic": "basics",
    "difficulty": "Easy",
    "kind": "concept",
    "question": "What does this formatted f-string print?",
    "code": "x = 4\nprint(f'Area: {x * x}')",
    "options": [
      "Area: {x * x}",
      "Area: 4 * 4",
      "Area: 16",
      "Area: x * x"
    ],
    "correctIndex": 2,
    "explanation": "f-strings evaluate expressions inside curly braces {} at runtime, printing 'Area: 16'."
  },
  {
    "id": "qb24",
    "topic": "basics",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What is the output according to left-to-right subtraction associativity?",
    "code": "print(10 - 4 - 2)",
    "options": [
      "8",
      "-4",
      "6",
      "4"
    ],
    "correctIndex": 3,
    "explanation": "Subtraction is left-associative: (10 - 4) - 2 = 6 - 2 = 4."
  },
  {
    "id": "qb25",
    "topic": "basics",
    "difficulty": "Easy",
    "kind": "error",
    "question": "What happens when executing `x = 10 % 0` in Python?",
    "options": [
      "ZeroDivisionError is raised",
      "x = 0",
      "x = None",
      "ValueError is raised"
    ],
    "correctIndex": 0,
    "explanation": "Both division / and modulo % with a zero divisor raise ZeroDivisionError: integer division or modulo by zero."
  },
  {
    "id": "qb26",
    "topic": "basics",
    "difficulty": "Easy",
    "kind": "fill",
    "question": "Fill in the blank to convert the string '45' into an integer:",
    "code": "s = '45'\nnum = ___(s)",
    "options": [
      "to_int",
      "int",
      "Integer",
      "parse_int"
    ],
    "correctIndex": 1,
    "explanation": "Python's built-in int() function parses a numeric string into an integer."
  },
  {
    "id": "qb27",
    "topic": "basics",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What is the output of double negation on a non-zero number?",
    "code": "print(not not 5)",
    "options": [
      "5",
      "False",
      "True",
      "Error"
    ],
    "correctIndex": 2,
    "explanation": "5 is truthy. not 5 is False. not False is True. 'not not x' converts x to its boolean equivalent."
  },
  {
    "id": "qb28",
    "topic": "basics",
    "difficulty": "Hard",
    "kind": "concept",
    "question": "What is the output of negation combined with exponentiation?",
    "code": "print(-2 ** 2)",
    "options": [
      "4",
      "2",
      "-2",
      "-4"
    ],
    "correctIndex": 3,
    "explanation": "** has higher precedence than unary minus -. So Python evaluates -(2 ** 2) = -4, NOT (-2) ** 2."
  },
  {
    "id": "qb29",
    "topic": "basics",
    "difficulty": "Easy",
    "kind": "concept",
    "question": "What does parenthesized negative exponentiation output?",
    "code": "print((-2) ** 2)",
    "options": [
      "4",
      "-4",
      "2",
      "-2"
    ],
    "correctIndex": 0,
    "explanation": "Parentheses override precedence: (-2) * (-2) = 4."
  },
  {
    "id": "qb30",
    "topic": "basics",
    "difficulty": "Hard",
    "kind": "concept",
    "question": "What is the value of x after the augmented assignment?",
    "code": "x = 5\nx *= 2 + 3\nprint(x)",
    "options": [
      "13",
      "25",
      "10",
      "15"
    ],
    "correctIndex": 1,
    "explanation": "The entire expression on the right-hand side (2 + 3 = 5) evaluates first before *=: x = 5 * 5 = 25."
  },
  {
    "id": "qc1",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "error",
    "question": "Which Python keyword is used to test an additional condition after an initial if condition is False?",
    "options": [
      "elseif",
      "otherwise",
      "elif",
      "else if"
    ],
    "correctIndex": 2,
    "explanation": "Python uses 'elif' (short for else-if). Writing 'elseif' or 'else if' causes a SyntaxError."
  },
  {
    "id": "qc2",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "output",
    "question": "What is the output of the following Python code?",
    "code": "marks = 78\nif marks >= 90:\n    print('Grade A')\nelif marks >= 75:\n    print('Grade B')\nelif marks >= 40:\n    print('Pass')\nelse:\n    print('Fail')",
    "options": [
      "Grade A",
      "Grade B followed by Pass",
      "Pass",
      "Grade B"
    ],
    "correctIndex": 3,
    "explanation": "Python checks conditions top-down and executes only the FIRST matching branch (78 >= 75 is True), skipping remaining branches."
  },
  {
    "id": "qc3",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "concept",
    "question": "What is the difference between = and == in Python?",
    "options": [
      "= assigns a value to a variable, == compares if two values are equal",
      "They do the exact same thing",
      "= compares two values, == assigns a value",
      "== is only used inside loops"
    ],
    "correctIndex": 0,
    "explanation": "A single equals sign (=) stores a value in a variable. A double equals sign (==) compares equality and returns True or False."
  },
  {
    "id": "qc4",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "output",
    "question": "What does Python output when this code runs?",
    "code": "age = 16\nif age >= 18:\n    print('Adult')\nprint('Done')",
    "options": [
      "Adult\nDone",
      "Done",
      "Adult",
      "Nothing is printed"
    ],
    "correctIndex": 1,
    "explanation": "age >= 18 is False, so print('Adult') is skipped. print('Done') is outside the if block (unindented) and always runs."
  },
  {
    "id": "qc5",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "fill",
    "question": "Which expression evaluates to True when x = 12 and y = 5?",
    "options": [
      "x < 10 and y == 5",
      "not (x > y)",
      "x == 12 or y > 20",
      "x != 12"
    ],
    "correctIndex": 2,
    "explanation": "With 'or', only one condition needs to be True. Since x == 12 is True, the whole expression is True."
  },
  {
    "id": "qc6",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "error",
    "question": "What happens if you forget the colon (:) at the end of an if line?",
    "code": "x = 10\nif x > 5\n    print('Big')",
    "options": [
      "Python guesses where the block starts",
      "It prints nothing and continues",
      "It raises an IndentationError",
      "Python raises a SyntaxError"
    ],
    "correctIndex": 3,
    "explanation": "Python grammar requires a colon (:) after if, elif, else, for, and while headers. Omitting it raises a SyntaxError."
  },
  {
    "id": "qc7",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What is the output of this nested if code?",
    "code": "has_ticket = True\nage = 14\nif has_ticket:\n    if age >= 18:\n        print('VIP Entry')\n    else:\n        print('Standard Entry')\nelse:\n    print('No Entry')",
    "options": [
      "Standard Entry",
      "VIP Entry",
      "No Entry",
      "VIP Entry and Standard Entry"
    ],
    "correctIndex": 0,
    "explanation": "has_ticket is True, so Python enters outer if. Inside, 14 >= 18 is False, so the inner else prints 'Standard Entry'."
  },
  {
    "id": "qc8",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "fill",
    "question": "Which operator checks whether two values are NOT equal?",
    "options": [
      "<>",
      "!=",
      "not=",
      "==!"
    ],
    "correctIndex": 1,
    "explanation": "In Python, != is the comparison operator for 'not equal to'."
  },
  {
    "id": "qc9",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "concept",
    "question": "What does `not (10 > 3)` evaluate to?",
    "options": [
      "True",
      "10",
      "False",
      "Error"
    ],
    "correctIndex": 2,
    "explanation": "10 > 3 is True. 'not True' inverts the boolean value to False."
  },
  {
    "id": "qc10",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "concept",
    "question": "Why does indentation matter in Python if statements?",
    "options": [
      "It only makes code look neat; Python ignores spaces",
      "It makes numbers calculate faster",
      "It is only required for else blocks",
      "It defines which lines belong inside the if or else block"
    ],
    "correctIndex": 3,
    "explanation": "Python uses indentation instead of curly braces { } to group statements belonging to code blocks."
  },
  {
    "id": "qc11",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What is the output of chained comparison in Python?",
    "code": "x = 3\nprint(1 < x < 5)",
    "options": [
      "True",
      "False",
      "1",
      "SyntaxError"
    ],
    "correctIndex": 0,
    "explanation": "Python supports chained comparisons: '1 < x < 5' is interpreted as '(1 < x) and (x < 5)', which is True."
  },
  {
    "id": "qc12",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What is the output when a chained comparison fails early?",
    "code": "print(3 < 2 < 5)",
    "options": [
      "True",
      "False",
      "None",
      "TypeError"
    ],
    "correctIndex": 1,
    "explanation": "3 < 2 is False. In chained comparisons, if any link is False, the whole chain evaluates to False."
  },
  {
    "id": "qc13",
    "topic": "conditionals",
    "difficulty": "Hard",
    "kind": "error",
    "question": "Does short-circuit evaluation prevent ZeroDivisionError in this condition?",
    "code": "x = 0\nif x != 0 and 10 / x > 1:\n    print('Pass')\nelse:\n    print('Safe')",
    "options": [
      "Pass",
      "ZeroDivisionError",
      "Safe",
      "SyntaxError"
    ],
    "correctIndex": 2,
    "explanation": "Since x != 0 is False, 'and' short-circuits immediately. The second operand (10 / x) is never evaluated!"
  },
  {
    "id": "qc14",
    "topic": "conditionals",
    "difficulty": "Hard",
    "kind": "concept",
    "question": "What is the output when the left operand of 'or' is True?",
    "code": "x = 5\nif x > 0 or 10 / 0 == 0:\n    print('Shield Active')\nelse:\n    print('Shield Down')",
    "options": [
      "Shield Down",
      "ZeroDivisionError",
      "TypeError",
      "Shield Active"
    ],
    "correctIndex": 3,
    "explanation": "Because x > 0 is True, 'or' short-circuits and never executes 10 / 0, avoiding a runtime exception."
  },
  {
    "id": "qc15",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What does operator precedence yield for mixed 'or' and 'and'?",
    "code": "print(True or False and False)",
    "options": [
      "True",
      "False",
      "None",
      "Error"
    ],
    "correctIndex": 0,
    "explanation": "'and' has higher precedence than 'or'. Python evaluates: True or (False and False) = True or False = True."
  },
  {
    "id": "qc16",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What is the output when parentheses alter logical operator precedence?",
    "code": "print((True or False) and False)",
    "options": [
      "True",
      "False",
      "None",
      "Error"
    ],
    "correctIndex": 1,
    "explanation": "Parentheses force (True or False) = True first. Then True and False evaluates to False."
  },
  {
    "id": "qc17",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "output",
    "question": "What is the output when testing an empty string in an if statement?",
    "code": "name = ''\nif name:\n    print('Found')\nelse:\n    print('Empty')",
    "options": [
      "Found",
      "None",
      "Empty",
      "TypeError"
    ],
    "correctIndex": 2,
    "explanation": "An empty string '' is falsy in Python, so the else branch executes and prints 'Empty'."
  },
  {
    "id": "qc18",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "output",
    "question": "What is the truthiness of negative integers in conditional branching?",
    "code": "val = -5\nif val:\n    print('Active')\nelse:\n    print('Inactive')",
    "options": [
      "Inactive",
      "Error",
      "None",
      "Active"
    ],
    "correctIndex": 3,
    "explanation": "In Python, ALL non-zero numbers (including negative numbers) evaluate to True."
  },
  {
    "id": "qc19",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What is the output of consecutive independent if statements?",
    "code": "x = 10\nif x > 5:\n    print('A')\nif x > 8:\n    print('B')",
    "options": [
      "A\nB",
      "A",
      "B",
      "Nothing"
    ],
    "correctIndex": 0,
    "explanation": "Two separate if statements are evaluated independently. Both 10 > 5 and 10 > 8 are True, so both print."
  },
  {
    "id": "qc20",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "output",
    "question": "How does if-elif behave compared to consecutive if statements?",
    "code": "x = 10\nif x > 5:\n    print('A')\nelif x > 8:\n    print('B')",
    "options": [
      "A\nB",
      "A",
      "B",
      "Nothing"
    ],
    "correctIndex": 1,
    "explanation": "In an if-elif ladder, once a condition matches (10 > 5 is True), subsequent elif branches are skipped."
  },
  {
    "id": "qc21",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "error",
    "question": "What error occurs if the body of an if statement is not indented?",
    "code": "if True:\nprint('Hi')",
    "options": [
      "SyntaxError",
      "NameError",
      "IndentationError",
      "TypeError"
    ],
    "correctIndex": 2,
    "explanation": "Python expects an indented block after the colon (:). Unindented code raises an IndentationError: expected an indented block."
  },
  {
    "id": "qc22",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "error",
    "question": "What happens when you accidentally use single = instead of == in an if condition?",
    "code": "x = 5\nif x = 5:\n    print('Equal')",
    "options": [
      "Prints Equal",
      "TypeError",
      "x becomes 5 and prints nothing",
      "SyntaxError"
    ],
    "correctIndex": 3,
    "explanation": "Python does not allow assignment statements inside an if condition header, raising a SyntaxError."
  },
  {
    "id": "qc23",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "output",
    "question": "How does Python compare two strings using the < operator?",
    "code": "print('apple' < 'banana')",
    "options": [
      "True",
      "False",
      "TypeError",
      "5 < 6"
    ],
    "correctIndex": 0,
    "explanation": "Strings are compared lexicographically (character by character based on ASCII values). 'a' (97) < 'b' (98), so True."
  },
  {
    "id": "qc24",
    "topic": "conditionals",
    "difficulty": "Hard",
    "kind": "output",
    "question": "What is the output when comparing uppercase and lowercase strings?",
    "code": "print('Zebra' < 'apple')",
    "options": [
      "False",
      "True",
      "TypeError",
      "None"
    ],
    "correctIndex": 1,
    "explanation": "In ASCII, all uppercase letters ('A'-'Z', codes 65-90) come before lowercase letters ('a'-'z', codes 97-122). 'Z' < 'a' is True!"
  },
  {
    "id": "qc25",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "output",
    "question": "What is the output of comparing integer and string representations with ==?",
    "code": "print(5 == '5')",
    "options": [
      "True",
      "TypeError",
      "False",
      "SyntaxError"
    ],
    "correctIndex": 2,
    "explanation": "In Python, int and str are completely different types; equality == evaluates to False without implicit coercion."
  },
  {
    "id": "qc26",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "output",
    "question": "What does numerical equality between int and float evaluate to?",
    "code": "print(5 == 5.0)",
    "options": [
      "False",
      "TypeError",
      "ValueError",
      "True"
    ],
    "correctIndex": 3,
    "explanation": "Python numeric types compare values mathematically: 5 and 5.0 represent the same numerical value, so True."
  },
  {
    "id": "qc27",
    "topic": "conditionals",
    "difficulty": "Hard",
    "kind": "output",
    "question": "Which branch executes in this nested decision with negative numbers?",
    "code": "a = 5\nb = -2\nif a > 0:\n    if b > 0:\n        print('Both')\n    else:\n        print('b_neg')\nelse:\n    print('a_neg')",
    "options": [
      "b_neg",
      "Both",
      "a_neg",
      "Nothing"
    ],
    "correctIndex": 0,
    "explanation": "Outer if (a > 0) is True. Inside, b > 0 (-2 > 0) is False, so the inner else executes and prints 'b_neg'."
  },
  {
    "id": "qc28",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "fill",
    "question": "Fill in the blank to check if num is divisible by BOTH 3 and 7:",
    "code": "num = 21\nif ___:\n    print('Divisible by 3 and 7')",
    "options": [
      "num % 3 == 0 or num % 7 == 0",
      "num % 3 == 0 and num % 7 == 0",
      "num // 21 == 0",
      "num % (3 and 7) == 0"
    ],
    "correctIndex": 1,
    "explanation": "To check divisibility by both numbers, both remainders must equal 0 using the 'and' operator."
  },
  {
    "id": "qc29",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "fill",
    "question": "Fill in the blank to check if character ch is a lowercase vowel:",
    "code": "ch = 'e'\nif ___:\n    print('Vowel')",
    "options": [
      "ch == 'aeiou'",
      "ch is 'aeiou'",
      "ch in 'aeiou'",
      "in(ch, 'aeiou')"
    ],
    "correctIndex": 2,
    "explanation": "The 'in' membership operator checks whether substring 'e' exists within 'aeiou'."
  },
  {
    "id": "qc30",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "output",
    "question": "What is the output of substring membership check using 'in'?",
    "code": "print('cat' in 'scatter')",
    "options": [
      "False",
      "TypeError",
      "1",
      "True"
    ],
    "correctIndex": 3,
    "explanation": "'cat' is a contiguous substring inside 's-cat-ter', so 'in' evaluates to True."
  },
  {
    "id": "qc31",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "output",
    "question": "Is the 'in' operator case-sensitive for strings?",
    "code": "print('Cat' in 'scatter')",
    "options": [
      "False",
      "True",
      "None",
      "Error"
    ],
    "correctIndex": 0,
    "explanation": "String matching in Python is strictly case-sensitive. 'Cat' with capital 'C' does not match 'cat'."
  },
  {
    "id": "qc32",
    "topic": "conditionals",
    "difficulty": "Hard",
    "kind": "output",
    "question": "Why is the order of conditions in an elif ladder critical?",
    "code": "score = 85\nif score > 70:\n    print('C')\nelif score > 80:\n    print('B')\nelse:\n    print('A')",
    "options": [
      "B",
      "C",
      "A",
      "C\nB"
    ],
    "correctIndex": 1,
    "explanation": "85 > 70 is True, so branch 'C' executes first and Python exits the ladder! The score > 80 branch is never reached."
  },
  {
    "id": "qc33",
    "topic": "conditionals",
    "difficulty": "Hard",
    "kind": "concept",
    "question": "According to De Morgan's Law, what is the boolean equivalence of `not (A and B)`?",
    "options": [
      "(not A) and (not B)",
      "not A and B",
      "(not A) or (not B)",
      "A or B"
    ],
    "correctIndex": 2,
    "explanation": "De Morgan's First Law states that not (A and B) is logically equivalent to (not A) or (not B)."
  },
  {
    "id": "qc34",
    "topic": "conditionals",
    "difficulty": "Hard",
    "kind": "output",
    "question": "What does testing De Morgan's Law evaluate to in Python?",
    "code": "x = 4\nres = not (x > 2 and x < 10) == (x <= 2 or x >= 10)\nprint(res)",
    "options": [
      "False",
      "None",
      "SyntaxError",
      "True"
    ],
    "correctIndex": 3,
    "explanation": "Both sides are logically equivalent by De Morgan's Law, so the comparison evaluates to True."
  },
  {
    "id": "qc35",
    "topic": "conditionals",
    "difficulty": "Hard",
    "kind": "output",
    "question": "What is the output of this combined truth table evaluation?",
    "code": "a = False\nb = True\nc = True\nif (a or b) and not (b and not c):\n    print('Pass')\nelse:\n    print('Fail')",
    "options": [
      "Pass",
      "Fail",
      "Error",
      "None"
    ],
    "correctIndex": 0,
    "explanation": "(a or b) = True. not c = False, so (b and not c) = False. not False = True. True and True = True."
  },
  {
    "id": "qc36",
    "topic": "conditionals",
    "difficulty": "Hard",
    "kind": "output",
    "question": "What does modulo on a negative odd number evaluate to in Python?",
    "code": "n = -7\nif n % 2 == 1:\n    print('Odd')\nelse:\n    print('Even')",
    "options": [
      "Even",
      "Odd",
      "ZeroDivisionError",
      "-1"
    ],
    "correctIndex": 1,
    "explanation": "In Python, -7 % 2 = 1 (unlike C/Java which return -1). Thus n % 2 == 1 is True and prints 'Odd'."
  },
  {
    "id": "qc37",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What is the output of boolean arithmetic print(True + True + False) in standard Python?",
    "code": "print(True + True + False)",
    "options": [
      "True",
      "False",
      "2",
      "TypeError"
    ],
    "correctIndex": 2,
    "explanation": "In Python, bool is a subclass of int: True has value 1 and False has value 0. 1 + 1 + 0 = 2."
  },
  {
    "id": "qc38",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What does multiplying an integer by a boolean print(True * 10) output in Python?",
    "code": "print(True * 10)",
    "options": [
      "True",
      "TrueTrue...",
      "TypeError",
      "10"
    ],
    "correctIndex": 3,
    "explanation": "True behaves as 1 in mathematical operations. 1 * 10 = 10."
  },
  {
    "id": "qc39",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "error",
    "question": "What happens if an elif statement appears without a preceding if?",
    "code": "x = 5\nelif x > 2:\n    print('High')",
    "options": [
      "SyntaxError",
      "IndentationError",
      "NameError",
      "Runs as an if"
    ],
    "correctIndex": 0,
    "explanation": "An elif must always follow an if statement. Using elif standalone causes a SyntaxError: invalid syntax."
  },
  {
    "id": "qc40",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What is the purpose and effect of the 'pass' statement in this code?",
    "code": "x = 5\nif x > 2:\n    pass\nelse:\n    print('Low')\nprint('Done')",
    "options": [
      "Low\nDone",
      "Done",
      "Nothing",
      "IndentationError"
    ],
    "correctIndex": 1,
    "explanation": "pass is a null operation (placeholder). Since x > 2 is True, pass runs doing nothing, then print('Done') runs."
  },
  {
    "id": "qc41",
    "topic": "conditionals",
    "difficulty": "Hard",
    "kind": "fill",
    "question": "Which boolean condition correctly identifies a leap year in Python?",
    "options": [
      "year % 4 == 0",
      "year % 4 == 0 or year % 400 == 0",
      "(year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)",
      "year % 4 == 0 and year % 100 == 0"
    ],
    "correctIndex": 2,
    "explanation": "A year is leap if divisible by 4 but NOT 100, UNLESS also divisible by 400 (e.g. 2000 is leap, 1900 is not)."
  },
  {
    "id": "qc42",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What does the leap year logic determine for the century year 1900?",
    "code": "year = 1900\nis_leap = (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)\nprint(is_leap)",
    "options": [
      "True",
      "None",
      "Error",
      "False"
    ],
    "correctIndex": 3,
    "explanation": "1900 is divisible by 100 and NOT divisible by 400, so it is NOT a leap year (False)."
  },
  {
    "id": "qc43",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What does the leap year logic determine for the year 2000?",
    "code": "year = 2000\nis_leap = (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)\nprint(is_leap)",
    "options": [
      "True",
      "False",
      "None",
      "Error"
    ],
    "correctIndex": 0,
    "explanation": "2000 % 400 == 0 is True, so 2000 is a leap year (True)."
  },
  {
    "id": "qc44",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "concept",
    "question": "What is the truthiness of None in a conditional statement?",
    "code": "x = None\nif x:\n    print('A')\nelse:\n    print('B')",
    "options": [
      "A",
      "B",
      "None",
      "TypeError"
    ],
    "correctIndex": 1,
    "explanation": "None evaluates to False in boolean contexts, executing the else branch and printing 'B'."
  },
  {
    "id": "qc45",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "fill",
    "question": "Fill in the blank to check if marks is between 40 and 100 inclusive:",
    "code": "marks = 75\nif ___:\n    print('Valid')",
    "options": [
      "40 < marks < 100",
      "marks in (40, 100)",
      "40 <= marks <= 100",
      "40 <= marks or marks <= 100"
    ],
    "correctIndex": 2,
    "explanation": "Chained comparison 40 <= marks <= 100 accurately tests if marks lies in the range [40, 100] inclusive."
  },
  {
    "id": "qc46",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What is the output according to precedence of or vs and?",
    "code": "x = 5\ny = 10\nprint(x > 2 or y > 20 and x == 10)",
    "options": [
      "False",
      "None",
      "Error",
      "True"
    ],
    "correctIndex": 3,
    "explanation": "'and' binds tighter: (y > 20 and x == 10) = False. Then (x > 2 or False) = True or False = True."
  },
  {
    "id": "qc47",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What is the output when parentheses group the or condition first?",
    "code": "x = 5\ny = 10\nprint((x > 2 or y > 20) and x == 10)",
    "options": [
      "False",
      "True",
      "None",
      "Error"
    ],
    "correctIndex": 0,
    "explanation": "(x > 2 or y > 20) = True. But x == 10 (5 == 10) is False. True and False = False."
  },
  {
    "id": "qc48",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What is the key difference between == and 'is' in Python?",
    "options": [
      "== and is are identical in all cases",
      "== checks value equality, whereas 'is' checks object memory identity",
      "== is for strings, 'is' is for numbers",
      "'is' assigns values, == compares them"
    ],
    "correctIndex": 1,
    "explanation": "== compares whether two values are equal; 'is' checks if both variables reference the exact same object in memory."
  },
  {
    "id": "qc49",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What is the output of taking the absolute value using an if statement?",
    "code": "x = -15\nif x < 0:\n    x = -x\nprint(x)",
    "options": [
      "-15",
      "0",
      "15",
      "SyntaxError"
    ],
    "correctIndex": 2,
    "explanation": "-15 < 0 is True, so x = -(-15) = 15."
  },
  {
    "id": "qc50",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "error",
    "question": "What error occurs if you omit the colon on an elif line?",
    "code": "x = 5\nif x > 10:\n    print('High')\nelif x == 5\n    print('Five')",
    "options": [
      "IndentationError",
      "ValueError",
      "TypeError",
      "SyntaxError"
    ],
    "correctIndex": 3,
    "explanation": "Every elif header requires a colon (:) at the end. Missing it raises a SyntaxError."
  },
  {
    "id": "qc51",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "fill",
    "question": "Fill in the blank to check if a single-digit integer 'd' is between 0 and 9:",
    "code": "d = 7\nif ___:\n    print('Single Digit')",
    "options": [
      "0 <= d <= 9",
      "0 < d < 9",
      "d == 0 to 9",
      "d in range(9)"
    ],
    "correctIndex": 0,
    "explanation": "0 <= d <= 9 includes both 0 and 9."
  },
  {
    "id": "qc52",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What is the output of nested conditional status flags?",
    "code": "active = True\nverified = False\nif active:\n    if verified:\n        print('Full')\n    else:\n        print('Partial')\nelse:\n    print('None')",
    "options": [
      "Full",
      "Partial",
      "None",
      "Nothing"
    ],
    "correctIndex": 1,
    "explanation": "active is True, so it enters outer if. Inside, verified is False, printing 'Partial'."
  },
  {
    "id": "qc53",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "concept",
    "question": "Why is writing `if is_valid == True:` considered non-idiomatic Python?",
    "options": [
      "It causes a SyntaxError",
      "== cannot compare boolean values",
      "`if is_valid:` is simpler, cleaner, and handles truthiness directly",
      "is_valid == True is always False in Python"
    ],
    "correctIndex": 2,
    "explanation": "PEP 8 recommends writing 'if is_valid:' directly instead of comparing to == True."
  },
  {
    "id": "qc54",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "Watch out for off-by-one boundary comparisons! What is printed here?",
    "code": "marks = 60\nif marks > 60:\n    print('Pass')\nelse:\n    print('Borderline')",
    "options": [
      "Pass",
      "Pass and Borderline",
      "Error",
      "Borderline"
    ],
    "correctIndex": 3,
    "explanation": "Strict inequality > requires marks to be strictly greater than 60. Since 60 > 60 is False, 'Borderline' prints."
  },
  {
    "id": "qc55",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What is the output of testing character digit bounds?",
    "code": "ch = '7'\nif '0' <= ch <= '9':\n    print('Digit')\nelse:\n    print('Non-digit')",
    "options": [
      "Digit",
      "Non-digit",
      "TypeError",
      "SyntaxError"
    ],
    "correctIndex": 0,
    "explanation": "Character '7' has an ASCII value between '0' (48) and '9' (57), so the chained comparison evaluates to True."
  },
  {
    "id": "qc56",
    "topic": "conditionals",
    "difficulty": "Hard",
    "kind": "concept",
    "question": "What is the output of triangle inequality check for side lengths 3, 4, 8?",
    "code": "a = 3\nb = 4\nc = 8\nif a + b > c and a + c > b and b + c > a:\n    print('Valid')\nelse:\n    print('Invalid')",
    "options": [
      "Valid",
      "Invalid",
      "Error",
      "None"
    ],
    "correctIndex": 1,
    "explanation": "For a valid triangle, the sum of any two sides must exceed the third. Here 3 + 4 = 7, which is NOT > 8, so 'Invalid'."
  },
  {
    "id": "qc57",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "error",
    "question": "What error occurs if an else block is indented more than its matching if statement?",
    "code": "x = 5\nif x > 0:\n    print('Positive')\n    else:\n    print('Negative')",
    "options": [
      "SyntaxError",
      "NameError",
      "IndentationError",
      "TypeError"
    ],
    "correctIndex": 2,
    "explanation": "An else must be aligned at the exact same indentation level as its matching if statement; otherwise IndentationError is raised."
  },
  {
    "id": "qc58",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What is the output of an if statement with trailing statements?",
    "code": "x = 2\nif x == 2:\n    print('Two')\nprint('Done')",
    "options": [
      "Two",
      "Done",
      "Nothing",
      "Two\nDone"
    ],
    "correctIndex": 3,
    "explanation": "x == 2 is True so 'Two' prints. Then print('Done') outside the if block executes unconditionally."
  },
  {
    "id": "qc59",
    "topic": "conditionals",
    "difficulty": "Easy",
    "kind": "fill",
    "question": "Fill in the blank to apply discount if customer is VIP or bill exceeds 500:",
    "code": "is_vip = False\nbill = 600\nif ___:\n    print('Discount')",
    "options": [
      "is_vip or bill > 500",
      "is_vip and bill > 500",
      "is_vip == bill > 500",
      "bill > 500 if is_vip"
    ],
    "correctIndex": 0,
    "explanation": "'is_vip or bill > 500' returns True if either condition is satisfied."
  },
  {
    "id": "qc60",
    "topic": "conditionals",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What is the truthiness of 0.0 in conditional branching?",
    "code": "rate = 0.0\nif rate:\n    print('Positive Rate')\nelse:\n    print('Zero Rate')",
    "options": [
      "Positive Rate",
      "Zero Rate",
      "Error",
      "None"
    ],
    "correctIndex": 1,
    "explanation": "Floating-point 0.0 is falsy in Python, so the else block executes and prints 'Zero Rate'."
  },
  {
    "id": "ql1",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "fill",
    "question": "Which numbers does range(1, 5) produce in Python?",
    "options": [
      "1, 2, 3, 4, 5",
      "0, 1, 2, 3, 4",
      "1, 2, 3, 4",
      "2, 3, 4, 5"
    ],
    "correctIndex": 2,
    "explanation": "range(start, stop) includes start (1) and EXCLUDES stop (5), generating 1, 2, 3, 4."
  },
  {
    "id": "ql2",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "concept",
    "question": "How many times will 'Hello' be printed by this loop?",
    "code": "for i in range(4):\n    print('Hello')",
    "options": [
      "3 times",
      "5 times",
      "0 times",
      "4 times"
    ],
    "correctIndex": 3,
    "explanation": "range(4) produces 4 indices: 0, 1, 2, 3. The loop body executes exactly 4 times."
  },
  {
    "id": "ql3",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What is the output of this loop with a step value?",
    "code": "for n in range(2, 9, 3):\n    print(n)",
    "options": [
      "2\n5\n8",
      "2\n5",
      "3\n6\n9",
      "2\n3\n4\n5\n6\n7\n8"
    ],
    "correctIndex": 0,
    "explanation": "Starting at 2 with step 3 produces 2, 5, 8. The next value (11) is >= 9, so the loop terminates."
  },
  {
    "id": "ql4",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "error",
    "question": "What happens if you run this while loop?",
    "code": "count = 1\nwhile count <= 3:\n    print(count)",
    "options": [
      "It prints 1, 2, 3 and stops",
      "It creates an infinite loop printing 1 forever",
      "It prints 1 once and stops",
      "It raises a SyntaxError"
    ],
    "correctIndex": 1,
    "explanation": "Because count is never incremented (missing count += 1), count stays 1 and count <= 3 is perpetually True."
  },
  {
    "id": "ql5",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "concept",
    "question": "What does the break statement do inside a loop?",
    "options": [
      "Skips only the current iteration and continues the loop",
      "Restarts the loop from the beginning",
      "Immediately exits the nearest enclosing loop",
      "Pauses the program for 1 second"
    ],
    "correctIndex": 2,
    "explanation": "break immediately terminates execution of the nearest enclosing loop."
  },
  {
    "id": "ql6",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What is the output of this code using continue?",
    "code": "for i in range(1, 5):\n    if i == 3:\n        continue\n    print(i)",
    "options": [
      "1\n2\n3\n4",
      "1\n2",
      "3",
      "1\n2\n4"
    ],
    "correctIndex": 3,
    "explanation": "When i == 3, continue skips the rest of that iteration (print(i)), so only 1, 2, and 4 are printed."
  },
  {
    "id": "ql7",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What sequence does range(5, 0, -2) generate?",
    "options": [
      "5, 3, 1",
      "5, 3, 1, -1",
      "5, 4, 3, 2, 1",
      "Nothing (empty)"
    ],
    "correctIndex": 0,
    "explanation": "Start at 5, step by -2: 5, 3, 1. The next candidate (-1) is not > 0 (the stop bound), so it stops at 1."
  },
  {
    "id": "ql8",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "How many total times does the inner print statement run in this nested loop?",
    "code": "for i in range(3):\n    for j in range(2):\n        print(i, j)",
    "options": [
      "3 times",
      "6 times",
      "5 times",
      "2 times"
    ],
    "correctIndex": 1,
    "explanation": "Outer loop runs 3 times; for each outer iteration, inner loop runs 2 times. 3 * 2 = 6 total executions."
  },
  {
    "id": "ql9",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What is the final value printed by this while loop?",
    "code": "x = 10\nwhile x > 4:\n    x -= 3\nprint(x)",
    "options": [
      "7",
      "1",
      "4",
      "10"
    ],
    "correctIndex": 2,
    "explanation": "x starts at 10 -> 7 -> 4. When x = 4, 4 > 4 is False and the loop terminates. print(x) outputs 4."
  },
  {
    "id": "ql10",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "concept",
    "question": "When is a while loop usually preferred over a for loop?",
    "options": [
      "When you know the exact number of repetitions beforehand",
      "When you want to use range()",
      "while loops are always faster than for loops",
      "When you want to repeat until a specific dynamic condition becomes False"
    ],
    "correctIndex": 3,
    "explanation": "Use for loops for known counts or sequences; use while loops when termination depends on an unpredictable condition."
  },
  {
    "id": "ql11",
    "topic": "loops",
    "difficulty": "Hard",
    "kind": "output",
    "question": "What is the value of loop variable 'i' after a for loop completes in Python?",
    "code": "for i in range(5):\n    pass\nprint(i)",
    "options": [
      "4",
      "5",
      "0",
      "NameError"
    ],
    "correctIndex": 0,
    "explanation": "In Python, for loops do not have their own scope. The variable 'i' retains its last assigned value from range (4)."
  },
  {
    "id": "ql12",
    "topic": "loops",
    "difficulty": "Hard",
    "kind": "output",
    "question": "What happens if you reassign the loop variable inside a for loop?",
    "code": "total = 0\nfor i in range(3):\n    i = i + 10\n    total += 1\nprint(total)",
    "options": [
      "30",
      "3",
      "0",
      "Infinite Loop"
    ],
    "correctIndex": 1,
    "explanation": "Modifying 'i' inside the loop has no effect on the next iteration; the for loop reassigns 'i' from the iterator."
  },
  {
    "id": "ql13",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "output",
    "question": "How many times does a loop over range(5, 5) execute?",
    "code": "count = 0\nfor i in range(5, 5):\n    count += 1\nprint(count)",
    "options": [
      "5",
      "1",
      "0",
      "SyntaxError"
    ],
    "correctIndex": 2,
    "explanation": "When start equals stop in range(start, stop), the sequence is empty, so the loop body executes 0 times."
  },
  {
    "id": "ql14",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What happens when start > stop without a negative step?",
    "code": "count = 0\nfor i in range(5, 1):\n    count += 1\nprint(count)",
    "options": [
      "4",
      "5",
      "ValueError",
      "0"
    ],
    "correctIndex": 3,
    "explanation": "Default step is +1. Since 5 is already >= 1, the range is empty and the loop runs 0 times."
  },
  {
    "id": "ql15",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What values does range(5, 1, -1) print?",
    "code": "for i in range(5, 1, -1):\n    print(i)",
    "options": [
      "5\n4\n3\n2",
      "5\n4\n3\n2\n1",
      "4\n3\n2\n1",
      "Empty"
    ],
    "correctIndex": 0,
    "explanation": "Starting at 5 and decrementing by -1 stops before 1, yielding 5, 4, 3, 2."
  },
  {
    "id": "ql16",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What is the output of range with negative bounds?",
    "code": "for i in range(-3, 1):\n    print(i)",
    "options": [
      "-3\n-2\n-1",
      "-3\n-2\n-1\n0",
      "-3\n-2\n-1\n0\n1",
      "-2\n-1\n0"
    ],
    "correctIndex": 1,
    "explanation": "range(-3, 1) starts at -3 and increments by +1 up to stop bound 1 (excluded): -3, -2, -1, 0."
  },
  {
    "id": "ql17",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "output",
    "question": "At what value of i does the break statement terminate this while loop?",
    "code": "i = 1\nwhile i < 10:\n    if i % 4 == 0:\n        break\n    i += 1\nprint(i)",
    "options": [
      "10",
      "3",
      "4",
      "5"
    ],
    "correctIndex": 2,
    "explanation": "When i reaches 4, 4 % 4 == 0 is True, so break triggers immediately and exits the loop with i = 4."
  },
  {
    "id": "ql18",
    "topic": "loops",
    "difficulty": "Hard",
    "kind": "error",
    "question": "Why does this while loop result in an infinite loop?",
    "code": "i = 1\nwhile i < 4:\n    if i == 2:\n        continue\n    i += 1",
    "options": [
      "SyntaxError on continue",
      "range is missing",
      "while loops cannot use continue",
      "When i == 2, continue skips 'i += 1', keeping i stuck at 2 forever"
    ],
    "correctIndex": 3,
    "explanation": "When i == 2, continue skips the rest of the loop body (including i += 1). i remains 2 and loops forever!"
  },
  {
    "id": "ql19",
    "topic": "loops",
    "difficulty": "Hard",
    "kind": "output",
    "question": "What is printed by this safe use of continue in a while loop?",
    "code": "i = 0\nwhile i < 4:\n    i += 1\n    if i == 2:\n        continue\n    print(i)",
    "options": [
      "1\n3\n4",
      "1\n2\n3\n4",
      "2",
      "1\n3"
    ],
    "correctIndex": 0,
    "explanation": "i increments before the continue check: i=1 (prints 1), i=2 (skipped), i=3 (prints 3), i=4 (prints 4)."
  },
  {
    "id": "ql20",
    "topic": "loops",
    "difficulty": "Hard",
    "kind": "output",
    "question": "How many total iterations occur in this triangular nested loop?",
    "code": "total = 0\nfor i in range(4):\n    for j in range(i):\n        total += 1\nprint(total)",
    "options": [
      "16",
      "6",
      "10",
      "4"
    ],
    "correctIndex": 1,
    "explanation": "For i=0: 0 times. For i=1: 1 time. For i=2: 2 times. For i=3: 3 times. Total = 0 + 1 + 2 + 3 = 6 iterations."
  },
  {
    "id": "ql21",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What is the output of nested loops printing the outer index?",
    "code": "for i in range(1, 4):\n    for j in range(i):\n        print(i)",
    "options": [
      "1\n2\n3",
      "0\n1\n2",
      "1\n2\n2\n3\n3\n3",
      "1\n2\n3\n4"
    ],
    "correctIndex": 2,
    "explanation": "When i=1: prints 1 once. When i=2: prints 2 twice. When i=3: prints 3 three times."
  },
  {
    "id": "ql22",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "output",
    "question": "What does this loop calculate for factorial of 4?",
    "code": "prod = 1\nfor i in range(1, 5):\n    prod *= i\nprint(prod)",
    "options": [
      "10",
      "120",
      "20",
      "24"
    ],
    "correctIndex": 3,
    "explanation": "prod = 1 * 1 * 2 * 3 * 4 = 24 (4 factorial)."
  },
  {
    "id": "ql23",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What is the sum of even numbers from 2 to 10 inclusive?",
    "code": "s = 0\nfor i in range(2, 11, 2):\n    s += i\nprint(s)",
    "options": [
      "30",
      "20",
      "25",
      "40"
    ],
    "correctIndex": 0,
    "explanation": "range(2, 11, 2) produces 2, 4, 6, 8, 10. Sum = 2 + 4 + 6 + 8 + 10 = 30."
  },
  {
    "id": "ql24",
    "topic": "loops",
    "difficulty": "Hard",
    "kind": "output",
    "question": "Does a break statement inside an inner loop exit the outer loop?",
    "code": "count = 0\nfor i in range(3):\n    for j in range(3):\n        if j == 1:\n            break\n        count += 1\nprint(count)",
    "options": [
      "1",
      "3",
      "9",
      "0"
    ],
    "correctIndex": 1,
    "explanation": "break only terminates the innermost loop. In each of the 3 outer iterations, count increments once (for j=0). 3 * 1 = 3."
  },
  {
    "id": "ql25",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What is the sum of digits calculated by this while loop?",
    "code": "n = 123\ns = 0\nwhile n > 0:\n    s += n % 10\n    n //= 10\nprint(s)",
    "options": [
      "321",
      "123",
      "6",
      "3"
    ],
    "correctIndex": 2,
    "explanation": "Extracts digits using modulo 10: 3, then 2, then 1. Sum = 3 + 2 + 1 = 6."
  },
  {
    "id": "ql26",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "output",
    "question": "How many digits does this loop count for n = 4056?",
    "code": "n = 4056\ncount = 0\nwhile n > 0:\n    count += 1\n    n //= 10\nprint(count)",
    "options": [
      "3",
      "5",
      "15",
      "4"
    ],
    "correctIndex": 3,
    "explanation": "Divides by 10 four times: 4056 -> 405 -> 40 -> 4 -> 0. count = 4."
  },
  {
    "id": "ql27",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What is the output of reversing a number using arithmetic in a while loop?",
    "code": "n = 123\nrev = 0\nwhile n > 0:\n    rev = rev * 10 + n % 10\n    n //= 10\nprint(rev)",
    "options": [
      "321",
      "123",
      "6",
      "3"
    ],
    "correctIndex": 0,
    "explanation": "rev builds 3 -> 32 -> 321. Standard mathematical number reversal."
  },
  {
    "id": "ql28",
    "topic": "loops",
    "difficulty": "Hard",
    "kind": "output",
    "question": "What does this palindrome verification print for n = 121?",
    "code": "orig = 121\nn = orig\nrev = 0\nwhile n > 0:\n    rev = rev * 10 + n % 10\n    n //= 10\nprint(rev == orig)",
    "options": [
      "False",
      "True",
      "121",
      "None"
    ],
    "correctIndex": 1,
    "explanation": "Reversing 121 yields 121. Since rev == orig (121 == 121) is True, True prints."
  },
  {
    "id": "ql29",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "output",
    "question": "Watch out for off-by-one errors! Why does this loop NOT compute 5 factorial?",
    "code": "n = 5\nfact = 1\nfor i in range(1, n):\n    fact *= i\nprint(fact)",
    "options": [
      "120",
      "720",
      "24",
      "0"
    ],
    "correctIndex": 2,
    "explanation": "range(1, 5) excludes 5, stopping at 4! 1 * 2 * 3 * 4 = 24. To include 5, range(1, n + 1) is required."
  },
  {
    "id": "ql30",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "fill",
    "question": "Fill in the blank to include N in the loop range from 1 to N:",
    "code": "n = 5\nfor i in range(1, ___):\n    print(i)",
    "options": [
      "n",
      "n - 1",
      "n * 2",
      "n + 1"
    ],
    "correctIndex": 3,
    "explanation": "Because range stop value is exclusive, you must provide n + 1 to include n."
  },
  {
    "id": "ql31",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "fill",
    "question": "Fill in the blank to count down from 10 to 1 inclusive in a for loop:",
    "code": "for i in range(___):\n    print(i)",
    "options": [
      "10, 0, -1",
      "10, 1, -1",
      "1, 10, -1",
      "10, -1, 0"
    ],
    "correctIndex": 0,
    "explanation": "range(10, 0, -1) starts at 10 and steps by -1 down to 0 + 1 = 1."
  },
  {
    "id": "ql32",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "fill",
    "question": "Fill in the blank to repeat while n is strictly greater than 1:",
    "code": "n = 10\nwhile ___:\n    n //= 2",
    "options": [
      "n >= 0",
      "n > 1",
      "n == 1",
      "n < 10"
    ],
    "correctIndex": 1,
    "explanation": "'while n > 1:' continues halving n until n becomes 1."
  },
  {
    "id": "ql33",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "error",
    "question": "What error occurs if the colon is omitted from a for loop header?",
    "code": "for i in range(5)\n    print(i)",
    "options": [
      "IndentationError",
      "TypeError",
      "SyntaxError",
      "ValueError"
    ],
    "correctIndex": 2,
    "explanation": "Missing a colon (:) at the end of a for header causes a SyntaxError: expected ':'."
  },
  {
    "id": "ql34",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "error",
    "question": "What error is raised if the loop counter variable was never initialized?",
    "code": "while counter < 5:\n    counter += 1",
    "options": [
      "TypeError",
      "ValueError",
      "Infinite Loop",
      "NameError"
    ],
    "correctIndex": 3,
    "explanation": "Attempting to read 'counter' when it has not been assigned raises NameError: name 'counter' is not defined."
  },
  {
    "id": "ql35",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "output",
    "question": "How many vowels are counted by iterating over the string 'pyverse'?",
    "code": "count = 0\nfor ch in 'pyverse':\n    if ch in 'aeiou':\n        count += 1\nprint(count)",
    "options": [
      "2",
      "1",
      "3",
      "0"
    ],
    "correctIndex": 0,
    "explanation": "The vowels in 'pyverse' are the two 'e's (p-y-v-e-r-s-e). count = 2."
  },
  {
    "id": "ql36",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "output",
    "question": "What star pattern is printed by this string multiplication loop?",
    "code": "for i in range(1, 4):\n    print('*' * i)",
    "options": [
      "***\n**\n*",
      "*\n**\n***",
      "*\n*\n*",
      "***"
    ],
    "correctIndex": 1,
    "explanation": "i=1 prints '*', i=2 prints '**', i=3 prints '***'."
  },
  {
    "id": "ql37",
    "topic": "loops",
    "difficulty": "Hard",
    "kind": "output",
    "question": "What is the final value of the running counter in this 2x2 grid?",
    "code": "num = 1\nfor i in range(2):\n    for j in range(2):\n        num += 1\nprint(num)",
    "options": [
      "4",
      "6",
      "5",
      "2"
    ],
    "correctIndex": 2,
    "explanation": "Inner loop runs 2 * 2 = 4 times. num starts at 1, so 1 + 4 = 5."
  },
  {
    "id": "ql38",
    "topic": "loops",
    "difficulty": "Hard",
    "kind": "concept",
    "question": "What Fibonacci number is printed after 4 transitions?",
    "code": "a = 0\nb = 1\nfor i in range(4):\n    c = a + b\n    a = b\n    b = c\nprint(a)",
    "options": [
      "2",
      "5",
      "1",
      "3"
    ],
    "correctIndex": 3,
    "explanation": "Start (0, 1) -> iter 1: (1, 1) -> iter 2: (1, 2) -> iter 3: (2, 3) -> iter 4: (3, 5). Final a = 3."
  },
  {
    "id": "ql39",
    "topic": "loops",
    "difficulty": "Hard",
    "kind": "concept",
    "question": "How many Collatz steps does it take for n = 6 to reach 1?",
    "code": "n = 6\nsteps = 0\nwhile n != 1:\n    if n % 2 == 0:\n        n //= 2\n    else:\n        n = 3 * n + 1\n    steps += 1\nprint(steps)",
    "options": [
      "8",
      "6",
      "10",
      "12"
    ],
    "correctIndex": 0,
    "explanation": "Sequence: 6 -> 3 -> 10 -> 5 -> 16 -> 8 -> 4 -> 2 -> 1. Total transitions = 8 steps."
  },
  {
    "id": "ql40",
    "topic": "loops",
    "difficulty": "Hard",
    "kind": "concept",
    "question": "What does this prime checker print for composite number n = 15?",
    "code": "n = 15\nis_prime = True\nfor i in range(2, n):\n    if n % i == 0:\n        is_prime = False\n        break\nprint(is_prime)",
    "options": [
      "True",
      "False",
      "None",
      "3"
    ],
    "correctIndex": 1,
    "explanation": "When i = 3, 15 % 3 == 0 is True. is_prime is set to False and break terminates the loop."
  },
  {
    "id": "ql41",
    "topic": "loops",
    "difficulty": "Hard",
    "kind": "concept",
    "question": "What GCD value is computed by Euclidean subtraction for (12, 18)?",
    "code": "a = 12\nb = 18\nwhile a != b:\n    if a > b:\n        a -= b\n    else:\n        b -= a\nprint(a)",
    "options": [
      "3",
      "2",
      "6",
      "12"
    ],
    "correctIndex": 2,
    "explanation": "(12, 18) -> (12, 6) -> (6, 6). Loop terminates when a == b, printing GCD = 6."
  },
  {
    "id": "ql42",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What is computed by multiplying a base in a loop for 2 ** 4?",
    "code": "base = 2\nexp = 4\nres = 1\nfor i in range(exp):\n    res *= base\nprint(res)",
    "options": [
      "8",
      "32",
      "64",
      "16"
    ],
    "correctIndex": 3,
    "explanation": "Loop runs 4 times: 1 * 2 * 2 * 2 * 2 = 16."
  },
  {
    "id": "ql43",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What is the sum of odd numbers when continue skips even numbers?",
    "code": "total = 0\nfor i in range(1, 6):\n    if i % 2 == 0:\n        continue\n    total += i\nprint(total)",
    "options": [
      "9",
      "6",
      "15",
      "8"
    ],
    "correctIndex": 0,
    "explanation": "i = 2 and i = 4 are skipped by continue. total = 1 + 3 + 5 = 9."
  },
  {
    "id": "ql44",
    "topic": "loops",
    "difficulty": "Hard",
    "kind": "concept",
    "question": "At what index i does the cumulative sum first exceed 15?",
    "code": "s = 0\nfor i in range(1, 10):\n    s += i\n    if s > 15:\n        break\nprint(i)",
    "options": [
      "5",
      "6",
      "7",
      "15"
    ],
    "correctIndex": 1,
    "explanation": "Sums: 1(1), 2(3), 3(6), 4(10), 5(15), 6(21). At i = 6, s = 21 > 15, so break triggers."
  },
  {
    "id": "ql45",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "concept",
    "question": "What is the output when a while condition is False from the start?",
    "code": "x = 10\nwhile x < 5:\n    x += 1\nprint(x)",
    "options": [
      "5",
      "11",
      "10",
      "0"
    ],
    "correctIndex": 2,
    "explanation": "10 < 5 is False immediately. The loop body never executes, and print(x) outputs 10."
  },
  {
    "id": "ql46",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "Does this loop successfully find if 9 is a perfect square?",
    "code": "found = False\nfor i in range(1, 5):\n    if i * i == 9:\n        found = True\n        break\nprint(found)",
    "options": [
      "False",
      "3",
      "None",
      "True"
    ],
    "correctIndex": 3,
    "explanation": "When i = 3, 3 * 3 == 9 is True. found becomes True and break exits the loop."
  },
  {
    "id": "ql47",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "error",
    "question": "What is wrong with this countdown while loop?",
    "code": "i = 5\nwhile i > 0:\n    i += 1",
    "options": [
      "i is incremented instead of decremented, causing an infinite loop",
      "SyntaxError on while",
      "5 is too large for while",
      "IndentationError"
    ],
    "correctIndex": 0,
    "explanation": "To count down, the loop counter must decrease (i -= 1). Adding 1 keeps i > 0 permanently True."
  },
  {
    "id": "ql48",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "concept",
    "question": "What does looping over a single-character string output?",
    "code": "for ch in 'X':\n    print(ch)",
    "options": [
      "None",
      "X",
      "Error",
      "Empty"
    ],
    "correctIndex": 1,
    "explanation": "A string of length 1 has exactly one element, so the loop executes once and prints 'X'."
  },
  {
    "id": "ql49",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What numbers are generated by range(10, 0, -3)?",
    "code": "for i in range(10, 0, -3):\n    print(i)",
    "options": [
      "10\n7\n4",
      "10\n8\n6\n4\n2",
      "10\n7\n4\n1",
      "7\n4\n1"
    ],
    "correctIndex": 2,
    "explanation": "Start at 10, step by -3: 10, 7, 4, 1. The next step (-2) is not > 0, so loop stops at 1."
  },
  {
    "id": "ql50",
    "topic": "loops",
    "difficulty": "Hard",
    "kind": "concept",
    "question": "What is the sum of even digits for n = 2468?",
    "code": "n = 2468\ns = 0\nwhile n > 0:\n    d = n % 10\n    if d % 2 == 0:\n        s += d\n    n //= 10\nprint(s)",
    "options": [
      "10",
      "8",
      "2468",
      "20"
    ],
    "correctIndex": 3,
    "explanation": "Digits 8, 6, 4, 2 are all even. Sum = 8 + 6 + 4 + 2 = 20."
  },
  {
    "id": "ql51",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "fill",
    "question": "Fill in the blank to stop the loop when sentinel value -1 is encountered:",
    "code": "val = -1\nwhile True:\n    if ___:\n        break",
    "options": [
      "val == -1",
      "val = -1",
      "val != -1",
      "val < 0"
    ],
    "correctIndex": 0,
    "explanation": "Equality comparison val == -1 detects the sentinel value to break out of while True."
  },
  {
    "id": "ql52",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "fill",
    "question": "Fill in the blank for the inner loop iterating through 3 columns:",
    "code": "for r in range(3):\n    for c in ___:\n        print(r, c)",
    "options": [
      "3",
      "range(3)",
      "col(3)",
      "range(r)"
    ],
    "correctIndex": 1,
    "explanation": "range(3) provides column indices 0, 1, 2 for each row."
  },
  {
    "id": "ql53",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "error",
    "question": "What error occurs if the statement inside a for loop is not indented?",
    "code": "for i in range(3):\nprint(i)",
    "options": [
      "SyntaxError",
      "NameError",
      "IndentationError",
      "TypeError"
    ],
    "correctIndex": 2,
    "explanation": "Like if statements, for loop bodies require indentation. Omitting it causes an IndentationError."
  },
  {
    "id": "ql54",
    "topic": "loops",
    "difficulty": "Hard",
    "kind": "concept",
    "question": "How many diagonal elements (where row == col) are counted in a 3x3 grid?",
    "code": "count = 0\nfor r in range(3):\n    for c in range(3):\n        if r == c:\n            count += 1\nprint(count)",
    "options": [
      "9",
      "6",
      "1",
      "3"
    ],
    "correctIndex": 3,
    "explanation": "The diagonal cells are (0,0), (1,1), and (2,2). count = 3."
  },
  {
    "id": "ql55",
    "topic": "loops",
    "difficulty": "Hard",
    "kind": "concept",
    "question": "How many total divisors does 12 have according to this loop?",
    "code": "n = 12\ncount = 0\nfor i in range(1, n + 1):\n    if n % i == 0:\n        count += 1\nprint(count)",
    "options": [
      "6",
      "4",
      "5",
      "12"
    ],
    "correctIndex": 0,
    "explanation": "The divisors of 12 are 1, 2, 3, 4, 6, 12 (6 divisors). count = 6."
  },
  {
    "id": "ql56",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What is the final value of terms after iterating from 1 to 4?",
    "code": "n = 4\nterms = 0\nfor i in range(1, n + 1):\n    terms += 1\nprint(terms)",
    "options": [
      "3",
      "4",
      "5",
      "10"
    ],
    "correctIndex": 1,
    "explanation": "range(1, 5) iterates 4 times (1, 2, 3, 4), so terms = 4."
  },
  {
    "id": "ql57",
    "topic": "loops",
    "difficulty": "Hard",
    "kind": "concept",
    "question": "Is 6 a perfect number (equal to the sum of its proper divisors)?",
    "code": "n = 6\ns = 0\nfor i in range(1, n):\n    if n % i == 0:\n        s += i\nprint(s == n)",
    "options": [
      "False",
      "6",
      "True",
      "None"
    ],
    "correctIndex": 2,
    "explanation": "Proper divisors of 6 are 1, 2, 3. Sum = 1 + 2 + 3 = 6. Since s == n (6 == 6) is True, True prints."
  },
  {
    "id": "ql58",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "error",
    "question": "What happens if a break statement is used outside of any loop?",
    "code": "x = 5\nif x > 2:\n    break",
    "options": [
      "NameError",
      "TypeError",
      "Exits the program cleanly",
      "SyntaxError"
    ],
    "correctIndex": 3,
    "explanation": "'break' is only valid inside for or while loops; using it outside raises a SyntaxError: 'break' outside loop."
  },
  {
    "id": "ql59",
    "topic": "loops",
    "difficulty": "Easy",
    "kind": "error",
    "question": "What happens if a continue statement is placed outside of a loop?",
    "code": "x = 5\nif x > 2:\n    continue",
    "options": [
      "SyntaxError",
      "IndentationError",
      "TypeError",
      "Skips to next statement"
    ],
    "correctIndex": 0,
    "explanation": "'continue' is only legal within loop bodies; using it outside raises a SyntaxError: 'continue' not properly in loop."
  },
  {
    "id": "ql60",
    "topic": "loops",
    "difficulty": "Medium",
    "kind": "concept",
    "question": "What is the output of repeated string representation in a loop?",
    "code": "for i in range(3):\n    print(str(i) * 3)",
    "options": [
      "111\n222\n333",
      "000\n111\n222",
      "0\n1\n2",
      "012"
    ],
    "correctIndex": 1,
    "explanation": "i=0: str(0)*3 = '000'. i=1: str(1)*3 = '111'. i=2: str(2)*3 = '222'."
  }
];
