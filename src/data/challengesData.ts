import { CodingChallenge } from '../types';
import { makeValidator } from '../utils/challengeValidator';

export const CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: "ch-c1",
    topic: "conditionals",
    title: "Positive, Negative, or Zero",
    difficulty: "Beginner",
    description: "Given a variable `num = -7`, write an if-elif-else statement that prints 'Positive' if num > 0, 'Negative' if num < 0, or 'Zero' if num == 0.",
    requirements: ["Use if num > 0, elif num < 0, and else.", "Print exactly 'Positive', 'Negative', or 'Zero'."],
    sampleOutput: "Negative",
    starterCode: "num = -7\n\n# Write your if-elif-else logic below\n",
    hint: "Use `if num > 0:`, `elif num < 0:`, and `else:` with print() calls.",
    solutionCode: "num = -7\n\nif num > 0:\n    print('Positive')\nelif num < 0:\n    print('Negative')\nelse:\n    print('Zero')",
    explanation: "Conditions are evaluated sequentially from top to bottom. As soon as a branch condition is True, its body executes and remaining elif/else branches are bypassed.",
    validateOutput: makeValidator({
      "variable": "num",
      "mustInclude": "if ",
      "cases": [
            {
                  "value": 10,
                  "expected": "Positive"
            },
            {
                  "value": -7,
                  "expected": "Negative"
            },
            {
                  "value": 0,
                  "expected": "Zero"
            },
            {
                  "value": -100,
                  "expected": "Negative"
            },
            {
                  "value": 42,
                  "expected": "Positive"
            }
      ]
}),
  },
  {
    id: "ch-c2",
    topic: "conditionals",
    title: "Even or Odd Detector",
    difficulty: "Beginner",
    description: "Check whether `number = 24` is even or odd using the modulo operator `%`. Print 'Even' if divisible by 2, otherwise print 'Odd'.",
    requirements: ["Use `number % 2 == 0` to check even parity.", "Print 'Even' or 'Odd'."],
    sampleOutput: "Even",
    starterCode: "number = 24\n\n# Check if number is even or odd\n",
    hint: "If number % 2 == 0 is True, remainder is 0, so the number is Even.",
    solutionCode: "number = 24\n\nif number % 2 == 0:\n    print('Even')\nelse:\n    print('Odd')",
    explanation: "The modulo operator % returns the remainder after division by 2. Even integers always produce a remainder of 0.",
    validateOutput: makeValidator({
      "variable": "number",
      "mustInclude": "%",
      "cases": [
            {
                  "value": 24,
                  "expected": "Even"
            },
            {
                  "value": 13,
                  "expected": "Odd"
            },
            {
                  "value": 0,
                  "expected": "Even"
            },
            {
                  "value": -8,
                  "expected": "Even"
            },
            {
                  "value": -15,
                  "expected": "Odd"
            }
      ]
}),
  },
  {
    id: "ch-c3",
    topic: "conditionals",
    title: "Ticket Age Categorizer",
    difficulty: "Beginner",
    description: "Categorize a patron's ticket based on `age = 15`. Print 'Child' for age < 13, 'Teen' for 13 <= age < 20, 'Adult' for 20 <= age < 65, and 'Senior' for age >= 65.",
    requirements: ["Check the age intervals using an if-elif-else ladder.", "Print 'Child', 'Teen', 'Adult', or 'Senior'."],
    sampleOutput: "Teen",
    starterCode: "age = 15\n\n# Categorize ticket by age\n",
    hint: "Check in ascending order: `if age < 13:`, `elif age < 20:`, `elif age < 65:`, `else:`.",
    solutionCode: "age = 15\n\nif age < 13:\n    print('Child')\nelif age < 20:\n    print('Teen')\nelif age < 65:\n    print('Adult')\nelse:\n    print('Senior')",
    explanation: "Organizing comparison bounds in ascending order guarantees that prior bounds were already tested, simplifying each subsequent elif condition.",
    validateOutput: makeValidator({
      "variable": "age",
      "mustInclude": "elif ",
      "cases": [
            {
                  "value": 8,
                  "expected": "Child"
            },
            {
                  "value": 15,
                  "expected": "Teen"
            },
            {
                  "value": 25,
                  "expected": "Adult"
            },
            {
                  "value": 70,
                  "expected": "Senior"
            },
            {
                  "value": 13,
                  "expected": "Teen"
            },
            {
                  "value": 65,
                  "expected": "Senior"
            }
      ]
}),
  },
  {
    id: "ch-c4",
    topic: "conditionals",
    title: "Quadrant Finder",
    difficulty: "Guided",
    description: "Given coordinates `x = -4` and `y = 7`, determine which 2D Cartesian quadrant the point lies in. Print 'Quadrant 1' (x>0, y>0), 'Quadrant 2' (x<0, y>0), 'Quadrant 3' (x<0, y<0), 'Quadrant 4' (x>0, y<0), or 'Origin / Axis' otherwise.",
    requirements: ["Use relational and logical operators to check signs of x and y.", "Print the correct quadrant name."],
    sampleOutput: "Quadrant 2",
    starterCode: "x = -4\ny = 7\n\n# Determine quadrant\n",
    hint: "Use `if x > 0 and y > 0:` for Q1, `elif x < 0 and y > 0:` for Q2, etc.",
    solutionCode: "x = -4\ny = 7\n\nif x > 0 and y > 0:\n    print('Quadrant 1')\nelif x < 0 and y > 0:\n    print('Quadrant 2')\nelif x < 0 and y < 0:\n    print('Quadrant 3')\nelif x > 0 and y < 0:\n    print('Quadrant 4')\nelse:\n    print('Origin / Axis')",
    explanation: "2D Cartesian quadrants depend directly on the signs of x and y coordinates. Boundary points on the axes or origin are caught by the else branch.",
    validateOutput: makeValidator({
      "variable": [
            "x",
            "y"
      ],
      "mustInclude": "and",
      "cases": [
            {
                  "value": [
                        3,
                        5
                  ],
                  "expected": "Quadrant 1"
            },
            {
                  "value": [
                        -4,
                        7
                  ],
                  "expected": "Quadrant 2"
            },
            {
                  "value": [
                        -2,
                        -8
                  ],
                  "expected": "Quadrant 3"
            },
            {
                  "value": [
                        6,
                        -1
                  ],
                  "expected": "Quadrant 4"
            },
            {
                  "value": [
                        0,
                        0
                  ],
                  "expected": "Origin / Axis"
            },
            {
                  "value": [
                        0,
                        5
                  ],
                  "expected": "Origin / Axis"
            }
      ]
}),
  },
  {
    id: "ch-c5",
    topic: "conditionals",
    title: "Maximum of Three Numbers",
    difficulty: "Guided",
    description: "Given three variables `a = 14`, `b = 29`, and `c = 8`, find and print the maximum value among them using conditional logic (without using the max() function).",
    requirements: ["Use nested if or logical operators (and) to compare a, b, and c.", "Print only the maximum numeric value."],
    sampleOutput: "29",
    starterCode: "a = 14\nb = 29\nc = 8\n\n# Find and print the maximum without max()\n",
    hint: "Check `if a >= b and a >= c:`, `elif b >= a and b >= c:`, `else:`.",
    solutionCode: "a = 14\nb = 29\nc = 8\n\nif a >= b and a >= c:\n    print(a)\nelif b >= a and b >= c:\n    print(b)\nelse:\n    print(c)",
    explanation: "Comparing each candidate against the other two using >= accurately handles both distinct numbers and ties without requiring built-in helper functions.",
    validateOutput: makeValidator({
      "variable": [
            "a",
            "b",
            "c"
      ],
      "mustInclude": "if ",
      "cases": [
            {
                  "value": [
                        14,
                        29,
                        8
                  ],
                  "expected": "29"
            },
            {
                  "value": [
                        50,
                        10,
                        20
                  ],
                  "expected": "50"
            },
            {
                  "value": [
                        5,
                        5,
                        25
                  ],
                  "expected": "25"
            },
            {
                  "value": [
                        -10,
                        -2,
                        -30
                  ],
                  "expected": "-2"
            },
            {
                  "value": [
                        0,
                        0,
                        0
                  ],
                  "expected": "0"
            }
      ]
}),
  },
  {
    id: "ch-c6",
    topic: "conditionals",
    title: "Minimum of Three Numbers",
    difficulty: "Beginner",
    description: "Given three variables `a = 14`, `b = 29`, and `c = 8`, find and print the minimum value among them without using min().",
    requirements: ["Compare a, b, and c using <= and logical and.", "Print only the minimum numeric value."],
    sampleOutput: "8",
    starterCode: "a = 14\nb = 29\nc = 8\n\n# Find and print the minimum without min()\n",
    hint: "Check `if a <= b and a <= c:` print a, `elif b <= a and b <= c:` print b, else print c.",
    solutionCode: "a = 14\nb = 29\nc = 8\n\nif a <= b and a <= c:\n    print(a)\nelif b <= a and b <= c:\n    print(b)\nelse:\n    print(c)",
    explanation: "Testing whether a number is less than or equal to all other operands isolates the global minimum across all branches.",
    validateOutput: makeValidator({
      "variable": [
            "a",
            "b",
            "c"
      ],
      "mustInclude": "if ",
      "cases": [
            {
                  "value": [
                        14,
                        29,
                        8
                  ],
                  "expected": "8"
            },
            {
                  "value": [
                        5,
                        2,
                        9
                  ],
                  "expected": "2"
            },
            {
                  "value": [
                        -10,
                        -2,
                        -30
                  ],
                  "expected": "-30"
            },
            {
                  "value": [
                        0,
                        4,
                        -1
                  ],
                  "expected": "-1"
            },
            {
                  "value": [
                        7,
                        7,
                        7
                  ],
                  "expected": "7"
            }
      ]
}),
  },
  {
    id: "ch-c7",
    topic: "conditionals",
    title: "Leap Year Checker",
    difficulty: "Guided",
    description: "Given `year = 2024`, determine if it is a leap year. A year is a leap year if divisible by 4, except century years must be divisible by 400. Print 'Leap Year' or 'Not a Leap Year'.",
    requirements: ["Implement the full Gregorian calendar leap year rule.", "Print 'Leap Year' or 'Not a Leap Year'."],
    sampleOutput: "Leap Year",
    starterCode: "year = 2024\n\n# Check if year is a leap year\n",
    hint: "Use `(year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)`.",
    solutionCode: "year = 2024\n\nif (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):\n    print('Leap Year')\nelse:\n    print('Not a Leap Year')",
    explanation: "The Gregorian rule accounts for Earth's orbital period: 4-year periodicity is adjusted by removing century leaps unless offset by 400-year alignment.",
    validateOutput: makeValidator({
      "variable": "year",
      "mustInclude": "%",
      "cases": [
            {
                  "value": 2024,
                  "expected": "Leap Year"
            },
            {
                  "value": 1900,
                  "expected": "Not a Leap Year"
            },
            {
                  "value": 2000,
                  "expected": "Leap Year"
            },
            {
                  "value": 2023,
                  "expected": "Not a Leap Year"
            },
            {
                  "value": 2004,
                  "expected": "Leap Year"
            }
      ]
}),
  },
  {
    id: "ch-c8",
    topic: "conditionals",
    title: "Triangle Validity by Sides",
    difficulty: "Beginner",
    description: "Given side lengths `a = 3`, `b = 4`, and `c = 5`, verify whether they can form a valid triangle according to the Triangle Inequality Theorem. Print 'Valid Triangle' or 'Invalid Triangle'.",
    requirements: ["Check that the sum of any two sides is strictly greater than the third side.", "Print 'Valid Triangle' or 'Invalid Triangle'."],
    sampleOutput: "Valid Triangle",
    starterCode: "a = 3\nb = 4\nc = 5\n\n# Check triangle inequality\n",
    hint: "Condition: `a + b > c and a + c > b and b + c > a`.",
    solutionCode: "a = 3\nb = 4\nc = 5\n\nif a + b > c and a + c > b and b + c > a:\n    print('Valid Triangle')\nelse:\n    print('Invalid Triangle')",
    explanation: "By geometry theorem, a closed triangle can only be formed if the combined length of any two edges strictly exceeds the remaining edge.",
    validateOutput: makeValidator({
      "variable": [
            "a",
            "b",
            "c"
      ],
      "mustInclude": "and",
      "cases": [
            {
                  "value": [
                        3,
                        4,
                        5
                  ],
                  "expected": "Valid Triangle"
            },
            {
                  "value": [
                        1,
                        2,
                        5
                  ],
                  "expected": "Invalid Triangle"
            },
            {
                  "value": [
                        5,
                        5,
                        5
                  ],
                  "expected": "Valid Triangle"
            },
            {
                  "value": [
                        7,
                        10,
                        5
                  ],
                  "expected": "Valid Triangle"
            },
            {
                  "value": [
                        10,
                        2,
                        2
                  ],
                  "expected": "Invalid Triangle"
            }
      ]
}),
  },
  {
    id: "ch-c9",
    topic: "conditionals",
    title: "Triangle Classification by Sides",
    difficulty: "Guided",
    description: "Given triangle side lengths `a = 5`, `b = 5`, and `c = 5`, classify the triangle into 'Equilateral' (all 3 sides equal), 'Isosceles' (any 2 sides equal), or 'Scalene' (all sides different).",
    requirements: ["Use an if-elif-else structure to classify side equality.", "Print 'Equilateral', 'Isosceles', or 'Scalene'."],
    sampleOutput: "Equilateral",
    starterCode: "a = 5\nb = 5\nc = 5\n\n# Classify triangle\n",
    hint: "Check `if a == b == c:` first for equilateral, then check if any pair is equal for isosceles.",
    solutionCode: "a = 5\nb = 5\nc = 5\n\nif a == b and b == c:\n    print('Equilateral')\nelif a == b or b == c or a == c:\n    print('Isosceles')\nelse:\n    print('Scalene')",
    explanation: "Checking equilateral first eliminates the 3-side tie, so the subsequent elif only triggers when exactly 2 sides match.",
    validateOutput: makeValidator({
      "variable": [
            "a",
            "b",
            "c"
      ],
      "mustInclude": "elif ",
      "cases": [
            {
                  "value": [
                        5,
                        5,
                        5
                  ],
                  "expected": "Equilateral"
            },
            {
                  "value": [
                        5,
                        5,
                        8
                  ],
                  "expected": "Isosceles"
            },
            {
                  "value": [
                        3,
                        4,
                        5
                  ],
                  "expected": "Scalene"
            },
            {
                  "value": [
                        6,
                        9,
                        6
                  ],
                  "expected": "Isosceles"
            },
            {
                  "value": [
                        7,
                        8,
                        10
                  ],
                  "expected": "Scalene"
            }
      ]
}),
  },
  {
    id: "ch-c10",
    topic: "conditionals",
    title: "Right-Angled Triangle Detector",
    difficulty: "Guided",
    description: "Given side lengths `a = 3`, `b = 4`, and `c = 5`, check whether the sides satisfy the Pythagorean theorem ($x^2 + y^2 = z^2$ for any side orientation). Print 'Right Angled' or 'Not Right Angled'.",
    requirements: ["Compute squares of sides using ** 2 or multiplication.", "Print 'Right Angled' or 'Not Right Angled'."],
    sampleOutput: "Right Angled",
    starterCode: "a = 3\nb = 4\nc = 5\n\n# Check Pythagorean theorem\n",
    hint: "Check if `a*a + b*b == c*c or a*a + c*c == b*b or b*b + c*c == a*a:`.",
    solutionCode: "a = 3\nb = 4\nc = 5\n\nif a*a + b*b == c*c or a*a + c*c == b*b or b*b + c*c == a*a:\n    print('Right Angled')\nelse:\n    print('Not Right Angled')",
    explanation: "Testing all 3 pairings covers any hypotenuse orientation without requiring the sides to be pre-sorted.",
    validateOutput: makeValidator({
      "variable": [
            "a",
            "b",
            "c"
      ],
      "mustInclude": "or",
      "cases": [
            {
                  "value": [
                        3,
                        4,
                        5
                  ],
                  "expected": "Right Angled"
            },
            {
                  "value": [
                        5,
                        12,
                        13
                  ],
                  "expected": "Right Angled"
            },
            {
                  "value": [
                        4,
                        5,
                        6
                  ],
                  "expected": "Not Right Angled"
            },
            {
                  "value": [
                        6,
                        8,
                        10
                  ],
                  "expected": "Right Angled"
            },
            {
                  "value": [
                        1,
                        1,
                        2
                  ],
                  "expected": "Not Right Angled"
            }
      ]
}),
  },
  {
    id: "ch-c11",
    topic: "conditionals",
    title: "Quadratic Equation Roots Nature",
    difficulty: "Guided",
    description: "Given coefficients `a = 1`, `b = -5`, and `c = 6` for quadratic equation $ax^2 + bx + c = 0$, compute discriminant $D = b^2 - 4ac$. Print 'Two Real Roots' if D > 0, 'One Real Root' if D == 0, or 'Complex Roots' if D < 0.",
    requirements: ["Compute discriminant d = b*b - 4*a*c.", "Print 'Two Real Roots', 'One Real Root', or 'Complex Roots'."],
    sampleOutput: "Two Real Roots",
    starterCode: "a = 1\nb = -5\nc = 6\n\n# Calculate discriminant and print roots nature\n",
    hint: "Calculate `d = b*b - 4*a*c` then branch with if-elif-else.",
    solutionCode: "a = 1\nb = -5\nc = 6\n\nd = b*b - 4*a*c\nif d > 0:\n    print('Two Real Roots')\nelif d == 0:\n    print('One Real Root')\nelse:\n    print('Complex Roots')",
    explanation: "The sign of discriminant D under the square root determines whether the roots are distinct real numbers, coincident, or complex conjugates.",
    validateOutput: makeValidator({
      "variable": [
            "a",
            "b",
            "c"
      ],
      "mustInclude": "elif ",
      "cases": [
            {
                  "value": [
                        1,
                        -5,
                        6
                  ],
                  "expected": "Two Real Roots"
            },
            {
                  "value": [
                        1,
                        -4,
                        4
                  ],
                  "expected": "One Real Root"
            },
            {
                  "value": [
                        1,
                        2,
                        5
                  ],
                  "expected": "Complex Roots"
            },
            {
                  "value": [
                        2,
                        -4,
                        -6
                  ],
                  "expected": "Two Real Roots"
            },
            {
                  "value": [
                        3,
                        2,
                        1
                  ],
                  "expected": "Complex Roots"
            }
      ]
}),
  },
  {
    id: "ch-c12",
    topic: "conditionals",
    title: "Electricity Slab Bill Calculator",
    difficulty: "Applied",
    description: "Calculate total electricity bill for `units = 150`. First 100 units cost 2 per unit. Any additional units beyond 100 cost 5 per unit. Print the total bill amount as an integer.",
    requirements: ["If units <= 100, bill = units * 2.", "If units > 100, bill = 100 * 2 + (units - 100) * 5.", "Print the final total."],
    sampleOutput: "450",
    starterCode: "units = 150\n\n# Calculate tiered electricity bill\n",
    hint: "Check `if units <= 100: bill = units * 2` else `bill = 200 + (units - 100) * 5`.",
    solutionCode: "units = 150\n\nif units <= 100:\n    bill = units * 2\nelse:\n    bill = 100 * 2 + (units - 100) * 5\nprint(bill)",
    explanation: "Tiered utility billing applies baseline tariff rates to initial usage brackets and escalated rates exclusively to marginal units.",
    validateOutput: makeValidator({
      "variable": "units",
      "mustInclude": "if ",
      "cases": [
            {
                  "value": 50,
                  "expected": "100"
            },
            {
                  "value": 100,
                  "expected": "200"
            },
            {
                  "value": 150,
                  "expected": "450"
            },
            {
                  "value": 200,
                  "expected": "700"
            },
            {
                  "value": 0,
                  "expected": "0"
            }
      ]
}),
  },
  {
    id: "ch-c13",
    topic: "conditionals",
    title: "Income Tax Slab Calculator",
    difficulty: "Applied",
    description: "Calculate income tax for annual `income = 600000`. Up to 250,000: 0% tax. From 250,001 to 500,000: 5% on excess above 250,000. Above 500,000: 12,500 base + 20% on excess above 500,000. Print the total tax as an integer.",
    requirements: ["Compute tax using the progressive tax brackets.", "Print the tax as an int value."],
    sampleOutput: "32500",
    starterCode: "income = 600000\n\n# Compute income tax\n",
    hint: "Use `int(...)` for bracket calculations: 5% is `0.05` and 20% is `0.20`.",
    solutionCode: "income = 600000\n\nif income <= 250000:\n    tax = 0\nelif income <= 500000:\n    tax = int((income - 250000) * 0.05)\nelse:\n    tax = int(12500 + (income - 500000) * 0.20)\nprint(tax)",
    explanation: "Progressive taxation only taxes the slice of income within each respective threshold, maintaining economic incentives.",
    validateOutput: makeValidator({
      "variable": "income",
      "mustInclude": "elif ",
      "cases": [
            {
                  "value": 200000,
                  "expected": "0"
            },
            {
                  "value": 250000,
                  "expected": "0"
            },
            {
                  "value": 400000,
                  "expected": "7500"
            },
            {
                  "value": 600000,
                  "expected": "32500"
            },
            {
                  "value": 800000,
                  "expected": "72500"
            }
      ]
}),
  },
  {
    id: "ch-c14",
    topic: "conditionals",
    title: "Cinema Ticket Tier Pricing",
    difficulty: "Beginner",
    description: "Given `age = 22`, determine cinema ticket pricing: age < 12 prints 'Child: 100', age <= 60 prints 'Adult: 250', and age > 60 prints 'Senior: 150'.",
    requirements: ["Use if-elif-else branches.", "Print the exact formatted price string."],
    sampleOutput: "Adult: 250",
    starterCode: "age = 22\n\n# Print ticket pricing\n",
    hint: "Check `if age < 12:`, `elif age <= 60:`, `else:`.",
    solutionCode: "age = 22\n\nif age < 12:\n    print('Child: 100')\nelif age <= 60:\n    print('Adult: 250')\nelse:\n    print('Senior: 150')",
    explanation: "Conditional tier boundaries map demographic attributes to corresponding pricing categories.",
    validateOutput: makeValidator({
      "variable": "age",
      "mustInclude": "elif ",
      "cases": [
            {
                  "value": 8,
                  "expected": "Child: 100"
            },
            {
                  "value": 12,
                  "expected": "Adult: 250"
            },
            {
                  "value": 22,
                  "expected": "Adult: 250"
            },
            {
                  "value": 60,
                  "expected": "Adult: 250"
            },
            {
                  "value": 65,
                  "expected": "Senior: 150"
            }
      ]
}),
  },
  {
    id: "ch-c15",
    topic: "conditionals",
    title: "Student Grade with Distinction",
    difficulty: "Beginner",
    description: "Evaluate student grade for `marks = 85`: marks >= 90 prints 'Grade A+ (Distinction)', marks >= 75 prints 'Grade A', marks >= 60 prints 'Grade B', marks >= 40 prints 'Grade C', otherwise prints 'Grade F'.",
    requirements: ["Use standard descending grading ladder.", "Print the exact grade string."],
    sampleOutput: "Grade A",
    starterCode: "marks = 85\n\n# Evaluate student grade\n",
    hint: "Start with `if marks >= 90:` and descend down to else.",
    solutionCode: "marks = 85\n\nif marks >= 90:\n    print('Grade A+ (Distinction)')\nelif marks >= 75:\n    print('Grade A')\nelif marks >= 60:\n    print('Grade B')\nelif marks >= 40:\n    print('Grade C')\nelse:\n    print('Grade F')",
    explanation: "Descending threshold ladders ensure that higher distinction categories take precedence before broad passing criteria.",
    validateOutput: makeValidator({
      "variable": "marks",
      "mustInclude": "elif ",
      "cases": [
            {
                  "value": 95,
                  "expected": "Grade A+ (Distinction)"
            },
            {
                  "value": 85,
                  "expected": "Grade A"
            },
            {
                  "value": 68,
                  "expected": "Grade B"
            },
            {
                  "value": 50,
                  "expected": "Grade C"
            },
            {
                  "value": 30,
                  "expected": "Grade F"
            }
      ]
}),
  },
  {
    id: "ch-c16",
    topic: "conditionals",
    title: "FizzBuzz Single Branch",
    difficulty: "Beginner",
    description: "Given integer `n = 15`, print 'FizzBuzz' if n is divisible by both 3 and 5, print 'Fizz' if divisible by 3 only, print 'Buzz' if divisible by 5 only, or print n itself otherwise.",
    requirements: ["Check divisibility by 15 first.", "Print 'FizzBuzz', 'Fizz', 'Buzz', or n."],
    sampleOutput: "FizzBuzz",
    starterCode: "n = 15\n\n# FizzBuzz decision\n",
    hint: "Condition order matters: test `n % 15 == 0` first!",
    solutionCode: "n = 15\n\nif n % 15 == 0:\n    print('FizzBuzz')\nelif n % 3 == 0:\n    print('Fizz')\nelif n % 5 == 0:\n    print('Buzz')\nelse:\n    print(n)",
    explanation: "Because numbers divisible by 15 are also divisible by 3 and 5, checking the combined condition first prevents premature matching.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "%",
      "cases": [
            {
                  "value": 15,
                  "expected": "FizzBuzz"
            },
            {
                  "value": 9,
                  "expected": "Fizz"
            },
            {
                  "value": 10,
                  "expected": "Buzz"
            },
            {
                  "value": 7,
                  "expected": "7"
            },
            {
                  "value": 30,
                  "expected": "FizzBuzz"
            }
      ]
}),
  },
  {
    id: "ch-c17",
    topic: "conditionals",
    title: "Character Case & Digit Classifier",
    difficulty: "Guided",
    description: "Given a character variable `ch = 'k'`, classify it: if '0' <= ch <= '9' print 'Digit', elif 'A' <= ch <= 'Z' print 'Uppercase', elif 'a' <= ch <= 'z' print 'Lowercase', else print 'Special'.",
    requirements: ["Use ASCII chained comparisons on character ch.", "Print 'Digit', 'Uppercase', 'Lowercase', or 'Special'."],
    sampleOutput: "Lowercase",
    starterCode: "ch = 'k'\n\n# Classify character\n",
    hint: "Python strings compare via ASCII values, so `'a' <= ch <= 'z'` works directly.",
    solutionCode: "ch = 'k'\n\nif '0' <= ch <= '9':\n    print('Digit')\nelif 'A' <= ch <= 'Z':\n    print('Uppercase')\nelif 'a' <= ch <= 'z':\n    print('Lowercase')\nelse:\n    print('Special')",
    explanation: "Chained character comparisons leverage consecutive Unicode/ASCII code points for digits and alphabet ranges without regex.",
    validateOutput: makeValidator({
      "variable": "ch",
      "mustInclude": "elif ",
      "cases": [
            {
                  "value": "5",
                  "expected": "Digit"
            },
            {
                  "value": "G",
                  "expected": "Uppercase"
            },
            {
                  "value": "k",
                  "expected": "Lowercase"
            },
            {
                  "value": "#",
                  "expected": "Special"
            },
            {
                  "value": "0",
                  "expected": "Digit"
            }
      ]
}),
  },
  {
    id: "ch-c18",
    topic: "conditionals",
    title: "Century Year Detector",
    difficulty: "Beginner",
    description: "Given `year = 2000`, test whether it is a century year (ending in 00, meaning divisible by 100). Print 'Century Year' or 'Non-Century Year'.",
    requirements: ["Check if year % 100 == 0.", "Print 'Century Year' or 'Non-Century Year'."],
    sampleOutput: "Century Year",
    starterCode: "year = 2000\n\n# Check if year is a century year\n",
    hint: "Use the modulo operator: `if year % 100 == 0:`.",
    solutionCode: "year = 2000\n\nif year % 100 == 0:\n    print('Century Year')\nelse:\n    print('Non-Century Year')",
    explanation: "Any year ending in two zeros has an exact integer quotient when divided by 100, leaving a remainder of 0.",
    validateOutput: makeValidator({
      "variable": "year",
      "mustInclude": "100",
      "cases": [
            {
                  "value": 2000,
                  "expected": "Century Year"
            },
            {
                  "value": 1900,
                  "expected": "Century Year"
            },
            {
                  "value": 2024,
                  "expected": "Non-Century Year"
            },
            {
                  "value": 1800,
                  "expected": "Century Year"
            },
            {
                  "value": 2021,
                  "expected": "Non-Century Year"
            }
      ]
}),
  },
  {
    id: "ch-c19",
    topic: "conditionals",
    title: "Traffic Speed Radar Fine",
    difficulty: "Guided",
    description: "Given `speed = 85` and `limit = 60`, calculate traffic penalty: if speed <= limit print 'No Fine', elif speed <= limit + 20 print 'Fine: 500', else print 'Fine: 2000'.",
    requirements: ["Compare speed against limit thresholds.", "Print 'No Fine', 'Fine: 500', or 'Fine: 2000'."],
    sampleOutput: "Fine: 2000",
    starterCode: "speed = 85\nlimit = 60\n\n# Calculate speed penalty\n",
    hint: "Check `if speed <= limit:`, `elif speed <= limit + 20:`, `else:`.",
    solutionCode: "speed = 85\nlimit = 60\n\nif speed <= limit:\n    print('No Fine')\nelif speed <= limit + 20:\n    print('Fine: 500')\nelse:\n    print('Fine: 2000')",
    explanation: "Dynamic speed limits adjust thresholds relative to zone rules, applying tiered monetary deterrents for severe violations.",
    validateOutput: makeValidator({
      "variable": [
            "speed",
            "limit"
      ],
      "mustInclude": "elif ",
      "cases": [
            {
                  "value": [
                        55,
                        60
                  ],
                  "expected": "No Fine"
            },
            {
                  "value": [
                        60,
                        60
                  ],
                  "expected": "No Fine"
            },
            {
                  "value": [
                        75,
                        60
                  ],
                  "expected": "Fine: 500"
            },
            {
                  "value": [
                        85,
                        60
                  ],
                  "expected": "Fine: 2000"
            },
            {
                  "value": [
                        110,
                        60
                  ],
                  "expected": "Fine: 2000"
            }
      ]
}),
  },
  {
    id: "ch-c20",
    topic: "conditionals",
    title: "ATM Cash Withdrawal Check",
    difficulty: "Guided",
    description: "Given withdrawal request `amount = 500` and account `balance = 2000`: if amount % 100 != 0 print 'Invalid Multiple of 100', elif amount > balance print 'Insufficient Balance', else print 'Withdrawal Approved'.",
    requirements: ["Validate ATM dispenser denomination compatibility first.", "Validate available balance.", "Print the exact outcome message."],
    sampleOutput: "Withdrawal Approved",
    starterCode: "amount = 500\nbalance = 2000\n\n# Validate withdrawal\n",
    hint: "Check `if amount % 100 != 0:`, `elif amount > balance:`, `else:`.",
    solutionCode: "amount = 500\nbalance = 2000\n\nif amount % 100 != 0:\n    print('Invalid Multiple of 100')\nelif amount > balance:\n    print('Insufficient Balance')\nelse:\n    print('Withdrawal Approved')",
    explanation: "Hardware cash dispenser constraints are validated before querying banking balances to prevent invalid transactional locks.",
    validateOutput: makeValidator({
      "variable": [
            "amount",
            "balance"
      ],
      "mustInclude": "elif ",
      "cases": [
            {
                  "value": [
                        500,
                        2000
                  ],
                  "expected": "Withdrawal Approved"
            },
            {
                  "value": [
                        250,
                        2000
                  ],
                  "expected": "Invalid Multiple of 100"
            },
            {
                  "value": [
                        3000,
                        2000
                  ],
                  "expected": "Insufficient Balance"
            },
            {
                  "value": [
                        2000,
                        2000
                  ],
                  "expected": "Withdrawal Approved"
            },
            {
                  "value": [
                        100,
                        100
                  ],
                  "expected": "Withdrawal Approved"
            }
      ]
}),
  },
  {
    id: "ch-c21",
    topic: "conditionals",
    title: "BMI Category Analyzer",
    difficulty: "Guided",
    description: "Given `bmi = 22.5`, classify health status: bmi < 18.5 prints 'Underweight', bmi < 25.0 prints 'Normal Weight', bmi < 30.0 prints 'Overweight', else prints 'Obese'.",
    requirements: ["Use if-elif-else with float thresholds.", "Print the exact classification string."],
    sampleOutput: "Normal Weight",
    starterCode: "bmi = 22.5\n\n# Classify BMI\n",
    hint: "Check in ascending order: `if bmi < 18.5:`, `elif bmi < 25.0:`, etc.",
    solutionCode: "bmi = 22.5\n\nif bmi < 18.5:\n    print('Underweight')\nelif bmi < 25.0:\n    print('Normal Weight')\nelif bmi < 30.0:\n    print('Overweight')\nelse:\n    print('Obese')",
    explanation: "WHO body mass index ranges are categorized in strict ascending order, automatically bounding each subsequent bracket.",
    validateOutput: makeValidator({
      "variable": "bmi",
      "mustInclude": "elif ",
      "cases": [
            {
                  "value": 17.2,
                  "expected": "Underweight"
            },
            {
                  "value": 18.5,
                  "expected": "Normal Weight"
            },
            {
                  "value": 22.5,
                  "expected": "Normal Weight"
            },
            {
                  "value": 27.8,
                  "expected": "Overweight"
            },
            {
                  "value": 33.1,
                  "expected": "Obese"
            }
      ]
}),
  },
  {
    id: "ch-c22",
    topic: "conditionals",
    title: "Profit, Loss, or Break-Even",
    difficulty: "Beginner",
    description: "Given `cost = 100` and `sell = 120`: if sell > cost print f'Profit: {sell - cost}', elif sell < cost print f'Loss: {cost - sell}', else print 'Break Even'.",
    requirements: ["Compare selling price and cost price.", "Print the profit/loss difference or 'Break Even'."],
    sampleOutput: "Profit: 20",
    starterCode: "cost = 100\nsell = 120\n\n# Evaluate transaction\n",
    hint: "Use f-strings: `print(f'Profit: {sell - cost}')`.",
    solutionCode: "cost = 100\nsell = 120\n\nif sell > cost:\n    print(f'Profit: {sell - cost}')\nelif sell < cost:\n    print(f'Loss: {cost - sell}')\nelse:\n    print('Break Even')",
    explanation: "Comparing selling price against acquisition cost cleanly divides commercial outcomes into positive delta, negative delta, or zero delta.",
    validateOutput: makeValidator({
      "variable": [
            "cost",
            "sell"
      ],
      "mustInclude": "elif ",
      "cases": [
            {
                  "value": [
                        100,
                        120
                  ],
                  "expected": "Profit: 20"
            },
            {
                  "value": [
                        100,
                        80
                  ],
                  "expected": "Loss: 20"
            },
            {
                  "value": [
                        100,
                        100
                  ],
                  "expected": "Break Even"
            },
            {
                  "value": [
                        50,
                        150
                  ],
                  "expected": "Profit: 100"
            },
            {
                  "value": [
                        200,
                        180
                  ],
                  "expected": "Loss: 20"
            }
      ]
}),
  },
  {
    id: "ch-c23",
    topic: "conditionals",
    title: "Engineering Admission Cutoff",
    difficulty: "Applied",
    description: "Given marks `math = 70`, `phy = 65`, and `chem = 60`, check admission eligibility: student must score math >= 60, phy >= 55, chem >= 50, AND total marks >= 180. Print 'Eligible' or 'Not Eligible'.",
    requirements: ["Combine individual subject cutoffs with total aggregate requirement.", "Print 'Eligible' or 'Not Eligible'."],
    sampleOutput: "Eligible",
    starterCode: "math = 70\nphy = 65\nchem = 60\n\n# Check admission eligibility\n",
    hint: "Condition: `math >= 60 and phy >= 55 and chem >= 50 and (math + phy + chem) >= 180`.",
    solutionCode: "math = 70\nphy = 65\nchem = 60\n\ntotal = math + phy + chem\nif math >= 60 and phy >= 55 and chem >= 50 and total >= 180:\n    print('Eligible')\nelse:\n    print('Not Eligible')",
    explanation: "Composite admissions criteria combine sectional minimums to verify baseline competency alongside an aggregate threshold for overall excellence.",
    validateOutput: makeValidator({
      "variable": [
            "math",
            "phy",
            "chem"
      ],
      "mustInclude": "and",
      "cases": [
            {
                  "value": [
                        70,
                        65,
                        60
                  ],
                  "expected": "Eligible"
            },
            {
                  "value": [
                        55,
                        70,
                        70
                  ],
                  "expected": "Not Eligible"
            },
            {
                  "value": [
                        80,
                        50,
                        80
                  ],
                  "expected": "Not Eligible"
            },
            {
                  "value": [
                        90,
                        80,
                        70
                  ],
                  "expected": "Eligible"
            },
            {
                  "value": [
                        60,
                        55,
                        50
                  ],
                  "expected": "Not Eligible"
            }
      ]
}),
  },
  {
    id: "ch-c24",
    topic: "conditionals",
    title: "Angle Geometry Classification",
    difficulty: "Beginner",
    description: "Given `angle = 90` (degrees): if angle < 90 print 'Acute Angle', elif angle == 90 print 'Right Angle', elif angle < 180 print 'Obtuse Angle', elif angle == 180 print 'Straight Angle', else print 'Reflex Angle'.",
    requirements: ["Use if-elif-else to classify geometric angle types.", "Print the exact angle description."],
    sampleOutput: "Right Angle",
    starterCode: "angle = 90\n\n# Classify angle\n",
    hint: "Check in increasing order: `< 90`, `== 90`, `< 180`, `== 180`, `else`.",
    solutionCode: "angle = 90\n\nif angle < 90:\n    print('Acute Angle')\nelif angle == 90:\n    print('Right Angle')\nelif angle < 180:\n    print('Obtuse Angle')\nelif angle == 180:\n    print('Straight Angle')\nelse:\n    print('Reflex Angle')",
    explanation: "Geometric angle nomenclature partitions angular measurements between 0 and 360 degrees into distinct named sectors.",
    validateOutput: makeValidator({
      "variable": "angle",
      "mustInclude": "elif ",
      "cases": [
            {
                  "value": 45,
                  "expected": "Acute Angle"
            },
            {
                  "value": 90,
                  "expected": "Right Angle"
            },
            {
                  "value": 120,
                  "expected": "Obtuse Angle"
            },
            {
                  "value": 180,
                  "expected": "Straight Angle"
            },
            {
                  "value": 210,
                  "expected": "Reflex Angle"
            }
      ]
}),
  },
  {
    id: "ch-c25",
    topic: "conditionals",
    title: "Days in Month (Standard Year)",
    difficulty: "Beginner",
    description: "Given `month = 4` (1 for January to 12 for December), determine the number of days in a standard non-leap year. Print 31, 30, or 28.",
    requirements: ["Check for months with 31, 30, or 28 days.", "Print the day count."],
    sampleOutput: "30",
    starterCode: "month = 4\n\n# Output days in month\n",
    hint: "Months 4, 6, 9, 11 have 30 days. Month 2 has 28 days. All others have 31 days.",
    solutionCode: "month = 4\n\nif month == 2:\n    print(28)\nelif month == 4 or month == 6 or month == 9 or month == 11:\n    print(30)\nelse:\n    print(31)",
    explanation: "Grouping calendar months into 28-day (February), 30-day (Apr/Jun/Sep/Nov), and 31-day sets structures the lookup cleanly.",
    validateOutput: makeValidator({
      "variable": "month",
      "mustInclude": "elif ",
      "cases": [
            {
                  "value": 1,
                  "expected": "31"
            },
            {
                  "value": 2,
                  "expected": "28"
            },
            {
                  "value": 4,
                  "expected": "30"
            },
            {
                  "value": 7,
                  "expected": "31"
            },
            {
                  "value": 11,
                  "expected": "30"
            }
      ]
}),
  },
  {
    id: "ch-c26",
    topic: "conditionals",
    title: "Shopping Cart Tier Discount",
    difficulty: "Guided",
    description: "Given `cart_total = 1200`, compute payable amount: cart_total >= 2000 gets 20% discount, cart_total >= 1000 gets 10% discount, otherwise 0% discount. Print the final payable amount as an integer.",
    requirements: ["Calculate tiered percentage discounts.", "Print final integer amount."],
    sampleOutput: "1080",
    starterCode: "cart_total = 1200\n\n# Compute final discounted amount\n",
    hint: "Use `int(cart_total * 0.80)` for 20% discount and `int(cart_total * 0.90)` for 10% discount.",
    solutionCode: "cart_total = 1200\n\nif cart_total >= 2000:\n    payable = int(cart_total * 0.80)\nelif cart_total >= 1000:\n    payable = int(cart_total * 0.90)\nelse:\n    payable = cart_total\nprint(payable)",
    explanation: "Checking the highest qualifying threshold first ensures high-value baskets receive their full entitled discount rate.",
    validateOutput: makeValidator({
      "variable": "cart_total",
      "mustInclude": "elif ",
      "cases": [
            {
                  "value": 500,
                  "expected": "500"
            },
            {
                  "value": 1000,
                  "expected": "900"
            },
            {
                  "value": 1200,
                  "expected": "1080"
            },
            {
                  "value": 2000,
                  "expected": "1600"
            },
            {
                  "value": 2500,
                  "expected": "2000"
            }
      ]
}),
  },
  {
    id: "ch-c27",
    topic: "conditionals",
    title: "Rock Paper Scissors Arbiter",
    difficulty: "Guided",
    description: "Given `p1 = 'rock'` and `p2 = 'scissors'`, decide the match outcome: print 'Tie' if choices match, 'Player 1 Wins' if p1 beats p2, or 'Player 2 Wins' otherwise.",
    requirements: ["Winning pairs for Player 1: (rock, scissors), (scissors, paper), (paper, rock).", "Print 'Tie', 'Player 1 Wins', or 'Player 2 Wins'."],
    sampleOutput: "Player 1 Wins",
    starterCode: "p1 = 'rock'\np2 = 'scissors'\n\n# Determine game outcome\n",
    hint: "Check equality for 'Tie', then check Player 1's three winning permutations.",
    solutionCode: "p1 = 'rock'\np2 = 'scissors'\n\nif p1 == p2:\n    print('Tie')\nelif (p1 == 'rock' and p2 == 'scissors') or (p1 == 'scissors' and p2 == 'paper') or (p1 == 'paper' and p2 == 'rock'):\n    print('Player 1 Wins')\nelse:\n    print('Player 2 Wins')",
    explanation: "Game arbiter logic simplifies by handling the symmetric tie condition first, then enumerating all winning states for Player 1.",
    validateOutput: makeValidator({
      "variable": [
            "p1",
            "p2"
      ],
      "mustInclude": "elif ",
      "cases": [
            {
                  "value": [
                        "rock",
                        "scissors"
                  ],
                  "expected": "Player 1 Wins"
            },
            {
                  "value": [
                        "scissors",
                        "rock"
                  ],
                  "expected": "Player 2 Wins"
            },
            {
                  "value": [
                        "paper",
                        "paper"
                  ],
                  "expected": "Tie"
            },
            {
                  "value": [
                        "rock",
                        "paper"
                  ],
                  "expected": "Player 2 Wins"
            },
            {
                  "value": [
                        "scissors",
                        "paper"
                  ],
                  "expected": "Player 1 Wins"
            }
      ]
}),
  },
  {
    id: "ch-c28",
    topic: "conditionals",
    title: "Divisibility Relationship",
    difficulty: "Beginner",
    description: "Given `a = 36` and `b = 6`, check if a is an exact multiple of b. If a % b == 0 print f'{a} is a multiple of {b}', otherwise print f'{a} is not a multiple of {b}'.",
    requirements: ["Use modulo operator %.", "Print the formatted relationship string."],
    sampleOutput: "36 is a multiple of 6",
    starterCode: "a = 36\nb = 6\n\n# Test divisibility\n",
    hint: "Use `if a % b == 0:` with f-string output.",
    solutionCode: "a = 36\nb = 6\n\nif a % b == 0:\n    print(f'{a} is a multiple of {b}')\nelse:\n    print(f'{a} is not a multiple of {b}')",
    explanation: "A non-zero remainder from % directly disproves divisibility; remainder 0 proves a is an integer multiple of b.",
    validateOutput: makeValidator({
      "variable": [
            "a",
            "b"
      ],
      "mustInclude": "%",
      "cases": [
            {
                  "value": [
                        36,
                        6
                  ],
                  "expected": "36 is a multiple of 6"
            },
            {
                  "value": [
                        35,
                        6
                  ],
                  "expected": "35 is not a multiple of 6"
            },
            {
                  "value": [
                        100,
                        25
                  ],
                  "expected": "100 is a multiple of 25"
            },
            {
                  "value": [
                        7,
                        3
                  ],
                  "expected": "7 is not a multiple of 3"
            },
            {
                  "value": [
                        12,
                        12
                  ],
                  "expected": "12 is a multiple of 12"
            }
      ]
}),
  },
  {
    id: "ch-c29",
    topic: "conditionals",
    title: "24-Hour to 12-Hour Converter",
    difficulty: "Guided",
    description: "Given military hour `hour = 17` (0 to 23): convert to 12-hour AM/PM format. Hour 0 is '12 AM', 1 to 11 is '{hour} AM', 12 is '12 PM', and 13 to 23 is '{hour - 12} PM'.",
    requirements: ["Handle midnight (0) and noon (12) boundary cases correctly.", "Print the converted time string."],
    sampleOutput: "5 PM",
    starterCode: "hour = 17\n\n# Convert 24-hour time to 12-hour format\n",
    hint: "Check `if hour == 0:`, `elif hour < 12:`, `elif hour == 12:`, `else:`.",
    solutionCode: "hour = 17\n\nif hour == 0:\n    print('12 AM')\nelif hour < 12:\n    print(f'{hour} AM')\nelif hour == 12:\n    print('12 PM')\nelse:\n    print(f'{hour - 12} PM')",
    explanation: "Special handling for zero (midnight) and twelve (noon) properly accounts for non-zero 12-hour cycle offsets.",
    validateOutput: makeValidator({
      "variable": "hour",
      "mustInclude": "elif ",
      "cases": [
            {
                  "value": 0,
                  "expected": "12 AM"
            },
            {
                  "value": 9,
                  "expected": "9 AM"
            },
            {
                  "value": 12,
                  "expected": "12 PM"
            },
            {
                  "value": 17,
                  "expected": "5 PM"
            },
            {
                  "value": 23,
                  "expected": "11 PM"
            }
      ]
}),
  },
  {
    id: "ch-c30",
    topic: "conditionals",
    title: "Water State by Temperature",
    difficulty: "Beginner",
    description: "Given water temperature `temp = 25` (Celsius): if temp <= 0 print 'Solid (Ice)', elif temp >= 100 print 'Gas (Steam)', else print 'Liquid (Water)'.",
    requirements: ["Check freezing (<=0) and boiling (>=100) phase transitions.", "Print the exact state string."],
    sampleOutput: "Liquid (Water)",
    starterCode: "temp = 25\n\n# Output state of water\n",
    hint: "Check `if temp <= 0:`, `elif temp >= 100:`, `else:`.",
    solutionCode: "temp = 25\n\nif temp <= 0:\n    print('Solid (Ice)')\nelif temp >= 100:\n    print('Gas (Steam)')\nelse:\n    print('Liquid (Water)')",
    explanation: "Physical phase change boundaries at 0\u00b0C and 100\u00b0C partition standard pressure thermodynamic states.",
    validateOutput: makeValidator({
      "variable": "temp",
      "mustInclude": "elif ",
      "cases": [
            {
                  "value": -5,
                  "expected": "Solid (Ice)"
            },
            {
                  "value": 0,
                  "expected": "Solid (Ice)"
            },
            {
                  "value": 25,
                  "expected": "Liquid (Water)"
            },
            {
                  "value": 100,
                  "expected": "Gas (Steam)"
            },
            {
                  "value": 120,
                  "expected": "Gas (Steam)"
            }
      ]
}),
  },
  {
    id: "ch-l1",
    topic: "loops",
    title: "Print 1 to N",
    difficulty: "Beginner",
    description: "Given `n = 5`, use a for loop with `range()` to print numbers from 1 up to n inclusive, each on a new line.",
    requirements: ["Use a for loop with range(1, n + 1).", "Print each number on its own line."],
    sampleOutput: "1\n2\n3\n4\n5",
    starterCode: "n = 5\n\n# Print numbers from 1 to n\n",
    hint: "Remember that range(start, stop) excludes stop, so use `range(1, n + 1)`.",
    solutionCode: "n = 5\n\nfor i in range(1, n + 1):\n    print(i)",
    explanation: "range(1, n + 1) generates integers starting from 1 up through n, because the upper bound is exclusive.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "range",
      "cases": [
            {
                  "value": 5,
                  "expected": "1\n2\n3\n4\n5"
            },
            {
                  "value": 3,
                  "expected": "1\n2\n3"
            },
            {
                  "value": 1,
                  "expected": "1"
            },
            {
                  "value": 7,
                  "expected": "1\n2\n3\n4\n5\n6\n7"
            },
            {
                  "value": 10,
                  "expected": "1\n2\n3\n4\n5\n6\n7\n8\n9\n10"
            }
      ]
}),
  },
  {
    id: "ch-l2",
    topic: "loops",
    title: "Sum of First N Numbers",
    difficulty: "Beginner",
    description: "Given `n = 10`, compute and print the sum of all integers from 1 up to n inclusive using a loop.",
    requirements: ["Initialize an accumulator variable `total = 0`.", "Use a loop to add each number to total.", "Print only the final sum."],
    sampleOutput: "55",
    starterCode: "n = 10\ntotal = 0\n\n# Calculate sum of 1 to n\n",
    hint: "Loop over `range(1, n + 1)` and add `total += i` on each step.",
    solutionCode: "n = 10\ntotal = 0\n\nfor i in range(1, n + 1):\n    total += i\nprint(total)",
    explanation: "An accumulator variable maintains running state across loop iterations to compute the mathematical series sum n(n+1)/2.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "+=",
      "cases": [
            {
                  "value": 10,
                  "expected": "55"
            },
            {
                  "value": 5,
                  "expected": "15"
            },
            {
                  "value": 1,
                  "expected": "1"
            },
            {
                  "value": 0,
                  "expected": "0"
            },
            {
                  "value": 20,
                  "expected": "210"
            }
      ]
}),
  },
  {
    id: "ch-l3",
    topic: "loops",
    title: "Multiplication Table",
    difficulty: "Guided",
    description: "Given `n = 4`, print its multiplication table from 1 to 5 in the format: `4 x 1 = 4` through `4 x 5 = 20`.",
    requirements: ["Iterate multiplier from 1 to 5.", "Format each line as f'{n} x {i} = {n * i}'."],
    sampleOutput: "4 x 1 = 4\n4 x 2 = 8\n4 x 3 = 12\n4 x 4 = 16\n4 x 5 = 20",
    starterCode: "n = 4\n\n# Print multiplication table for 1 to 5\n",
    hint: "Loop `for i in range(1, 6):` and use an f-string inside print().",
    solutionCode: "n = 4\n\nfor i in range(1, 6):\n    print(f'{n} x {i} = {n * i}')",
    explanation: "f-strings evaluate mathematical products dynamically on each step while printing standardized mathematical table formatting.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "range",
      "cases": [
            {
                  "value": 4,
                  "expected": "4 x 1 = 4\n4 x 2 = 8\n4 x 3 = 12\n4 x 4 = 16\n4 x 5 = 20"
            },
            {
                  "value": 7,
                  "expected": "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35"
            },
            {
                  "value": 2,
                  "expected": "2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10"
            },
            {
                  "value": 9,
                  "expected": "9 x 1 = 9\n9 x 2 = 18\n9 x 3 = 27\n9 x 4 = 36\n9 x 5 = 45"
            },
            {
                  "value": 12,
                  "expected": "12 x 1 = 12\n12 x 2 = 24\n12 x 3 = 36\n12 x 4 = 48\n12 x 5 = 60"
            }
      ]
}),
  },
  {
    id: "ch-l4",
    topic: "loops",
    title: "Countdown Timer with Blast Off",
    difficulty: "Beginner",
    description: "Given countdown value `start = 5`, count down from start to 1 using a while loop, then print 'Blast Off!' on the final line.",
    requirements: ["Use a while loop with a decreasing counter (`start -= 1`).", "Print 'Blast Off!' after the loop finishes."],
    sampleOutput: "5\n4\n3\n2\n1\nBlast Off!",
    starterCode: "start = 5\n\n# Write countdown while loop\n",
    hint: "Loop `while start > 0:` and decrement inside the loop.",
    solutionCode: "start = 5\n\nwhile start > 0:\n    print(start)\n    start -= 1\nprint('Blast Off!')",
    explanation: "While loops driven by monotonic decrement terminate safely as soon as the boundary condition start > 0 is violated.",
    validateOutput: makeValidator({
      "variable": "start",
      "mustInclude": "while ",
      "cases": [
            {
                  "value": 5,
                  "expected": "5\n4\n3\n2\n1\nBlast Off!"
            },
            {
                  "value": 3,
                  "expected": "3\n2\n1\nBlast Off!"
            },
            {
                  "value": 1,
                  "expected": "1\nBlast Off!"
            },
            {
                  "value": 4,
                  "expected": "4\n3\n2\n1\nBlast Off!"
            },
            {
                  "value": 6,
                  "expected": "6\n5\n4\n3\n2\n1\nBlast Off!"
            }
      ]
}),
  },
  {
    id: "ch-l5",
    topic: "loops",
    title: "Count Multiples of 3 or 5",
    difficulty: "Applied",
    description: "Given `limit = 20`, count how many numbers from 1 to limit inclusive are multiples of 3 OR 5. Print only the total count.",
    requirements: ["Loop from 1 to limit inclusive.", "Test condition: `i % 3 == 0 or i % 5 == 0`.", "Print the final count."],
    sampleOutput: "9",
    starterCode: "limit = 20\ncount = 0\n\n# Count multiples of 3 or 5\n",
    hint: "Increment count whenever `i % 3 == 0 or i % 5 == 0` is True.",
    solutionCode: "limit = 20\ncount = 0\n\nfor i in range(1, limit + 1):\n    if i % 3 == 0 or i % 5 == 0:\n        count += 1\nprint(count)",
    explanation: "Iterating numbers and checking divisibility disjunction models the inclusion-exclusion principle over the sequence.",
    validateOutput: makeValidator({
      "variable": "limit",
      "mustInclude": "range",
      "cases": [
            {
                  "value": 20,
                  "expected": "9"
            },
            {
                  "value": 15,
                  "expected": "7"
            },
            {
                  "value": 10,
                  "expected": "5"
            },
            {
                  "value": 30,
                  "expected": "14"
            },
            {
                  "value": 5,
                  "expected": "2"
            }
      ]
}),
  },
  {
    id: "ch-l6",
    topic: "loops",
    title: "Factorial Calculator",
    difficulty: "Beginner",
    description: "Given integer `n = 5`, compute $n! = 1 \\times 2 \\times \\dots \\times n$ using a loop. Note that 0! = 1. Print the factorial result.",
    requirements: ["Initialize product accumulator `fact = 1`.", "Multiply loop variable into fact.", "Print the final result."],
    sampleOutput: "120",
    starterCode: "n = 5\nfact = 1\n\n# Compute factorial of n\n",
    hint: "Loop `for i in range(1, n + 1): fact *= i`.",
    solutionCode: "n = 5\nfact = 1\n\nfor i in range(1, n + 1):\n    fact *= i\nprint(fact)",
    explanation: "Initializing product accumulator to 1 guarantees that both 0! and 1! return 1 while correctly computing consecutive multiplications.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "*=",
      "cases": [
            {
                  "value": 5,
                  "expected": "120"
            },
            {
                  "value": 0,
                  "expected": "1"
            },
            {
                  "value": 1,
                  "expected": "1"
            },
            {
                  "value": 4,
                  "expected": "24"
            },
            {
                  "value": 6,
                  "expected": "720"
            }
      ]
}),
  },
  {
    id: "ch-l7",
    topic: "loops",
    title: "Count Digits of a Number",
    difficulty: "Beginner",
    description: "Given a positive integer `n = 4521`, count how many decimal digits it has using a mathematical while loop with floor division (`n //= 10`). Print the digit count.",
    requirements: ["Use a while loop dividing n by 10 repeatedly.", "Count iterations until n reaches 0.", "Print total count."],
    sampleOutput: "4",
    starterCode: "n = 4521\ncount = 0\n\n# Count digits of n\n",
    hint: "Loop `while n > 0:` and do `n //= 10; count += 1`.",
    solutionCode: "n = 4521\ncount = 0\n\nwhile n > 0:\n    count += 1\n    n //= 10\nprint(count)",
    explanation: "Floor division by 10 truncates the least significant decimal digit on each iteration until the number reduces to 0.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "while ",
      "cases": [
            {
                  "value": 4521,
                  "expected": "4"
            },
            {
                  "value": 7,
                  "expected": "1"
            },
            {
                  "value": 10000,
                  "expected": "5"
            },
            {
                  "value": 987654,
                  "expected": "6"
            },
            {
                  "value": 88,
                  "expected": "2"
            }
      ]
}),
  },
  {
    id: "ch-l8",
    topic: "loops",
    title: "Sum of Digits",
    difficulty: "Beginner",
    description: "Given integer `n = 385`, compute the sum of its decimal digits ($3 + 8 + 5 = 16$) using a while loop with modulo `% 10` and integer division `// 10`. Print the sum.",
    requirements: ["Extract last digit via `n % 10`.", "Discard last digit via `n //= 10`.", "Print total digit sum."],
    sampleOutput: "16",
    starterCode: "n = 385\ntotal = 0\n\n# Calculate sum of digits\n",
    hint: "Loop `while n > 0: total += n % 10; n //= 10`.",
    solutionCode: "n = 385\ntotal = 0\n\nwhile n > 0:\n    total += n % 10\n    n //= 10\nprint(total)",
    explanation: "Modulo 10 peels off units digits for arithmetic summation while integer division by 10 advances digit significance.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "%",
      "cases": [
            {
                  "value": 385,
                  "expected": "16"
            },
            {
                  "value": 123,
                  "expected": "6"
            },
            {
                  "value": 9,
                  "expected": "9"
            },
            {
                  "value": 1002,
                  "expected": "3"
            },
            {
                  "value": 9999,
                  "expected": "36"
            }
      ]
}),
  },
  {
    id: "ch-l9",
    topic: "loops",
    title: "Reverse an Integer",
    difficulty: "Guided",
    description: "Given positive integer `n = 1234`, reverse its decimal digits mathematically ($1234 \\rightarrow 4321$) using a while loop. Print the reversed number.",
    requirements: ["Construct reversed number via `rev = rev * 10 + n % 10`.", "Do not convert to string; use pure arithmetic.", "Print the final reversed integer."],
    sampleOutput: "4321",
    starterCode: "n = 1234\nrev = 0\n\n# Mathematically reverse n\n",
    hint: "Shift accumulator left by multiplying by 10, then add remainder: `rev = rev * 10 + n % 10`.",
    solutionCode: "n = 1234\nrev = 0\n\nwhile n > 0:\n    rev = rev * 10 + n % 10\n    n //= 10\nprint(rev)",
    explanation: "Multiplying the running reverse by 10 shifts previous digits one decimal place higher, appending the current least significant digit.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "while ",
      "cases": [
            {
                  "value": 1234,
                  "expected": "4321"
            },
            {
                  "value": 508,
                  "expected": "805"
            },
            {
                  "value": 9,
                  "expected": "9"
            },
            {
                  "value": 120,
                  "expected": "21"
            },
            {
                  "value": 7731,
                  "expected": "1377"
            }
      ]
}),
  },
  {
    id: "ch-l10",
    topic: "loops",
    title: "Palindrome Number Checker",
    difficulty: "Guided",
    description: "Given integer `n = 1221`, check whether it reads identically backwards and forwards. Print 'Palindrome' or 'Not Palindrome'.",
    requirements: ["Save original value to a separate variable (`orig = n`).", "Reverse n using a while loop.", "Print 'Palindrome' or 'Not Palindrome'."],
    sampleOutput: "Palindrome",
    starterCode: "n = 1221\norig = n\nrev = 0\n\n# Check if n is a palindrome\n",
    hint: "After reversing n in rev, check `if rev == orig:`.",
    solutionCode: "n = 1221\norig = n\nrev = 0\n\nwhile n > 0:\n    rev = rev * 10 + n % 10\n    n //= 10\n\nif rev == orig:\n    print('Palindrome')\nelse:\n    print('Not Palindrome')",
    explanation: "Comparing the mathematically reconstructed reverse against preserved original variable tests numerical palindromic symmetry.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "orig",
      "cases": [
            {
                  "value": 1221,
                  "expected": "Palindrome"
            },
            {
                  "value": 123,
                  "expected": "Not Palindrome"
            },
            {
                  "value": 7,
                  "expected": "Palindrome"
            },
            {
                  "value": 1331,
                  "expected": "Palindrome"
            },
            {
                  "value": 12345,
                  "expected": "Not Palindrome"
            }
      ]
}),
  },
  {
    id: "ch-l11",
    topic: "loops",
    title: "Prime Number Verifier",
    difficulty: "Guided",
    description: "Given integer `n = 29`, test whether n is a prime number (an integer > 1 having no divisors other than 1 and itself). Print 'Prime' or 'Not Prime'.",
    requirements: ["If n <= 1, it is not prime.", "Loop potential divisors from 2 to n - 1.", "Print 'Prime' or 'Not Prime'."],
    sampleOutput: "Prime",
    starterCode: "n = 29\n\n# Check if n is prime\n",
    hint: "Use a boolean flag `is_prime = True`. If `n % i == 0`, set to False and break.",
    solutionCode: "n = 29\n\nif n <= 1:\n    print('Not Prime')\nelse:\n    is_prime = True\n    for i in range(2, n):\n        if n % i == 0:\n            is_prime = False\n            break\n    if is_prime:\n        print('Prime')\n    else:\n        print('Not Prime')",
    explanation: "Trial division checks if any integer between 2 and n-1 divides n without remainder. Any divisor immediately disproves primality.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "range",
      "cases": [
            {
                  "value": 29,
                  "expected": "Prime"
            },
            {
                  "value": 15,
                  "expected": "Not Prime"
            },
            {
                  "value": 2,
                  "expected": "Prime"
            },
            {
                  "value": 1,
                  "expected": "Not Prime"
            },
            {
                  "value": 49,
                  "expected": "Not Prime"
            }
      ]
}),
  },
  {
    id: "ch-l12",
    topic: "loops",
    title: "Fibonacci N-th Term",
    difficulty: "Guided",
    description: "Given `n = 7`, compute and print the n-th Fibonacci number where the sequence starts: 1st=0, 2nd=1, 3rd=1, 4th=2, 5th=3, 6th=5, 7th=8.",
    requirements: ["Use loop with variables to compute terms.", "Iterate n - 1 times.", "Print the n-th term value."],
    sampleOutput: "8",
    starterCode: "n = 7\n\n# Compute n-th Fibonacci term\n",
    hint: "Initialize `a = 0` and `b = 1`. In the loop, use `nxt = a + b; a = b; b = nxt`.",
    solutionCode: "n = 7\n\na = 0\nb = 1\nfor i in range(n - 1):\n    nxt = a + b\n    a = b\n    b = nxt\nprint(a)",
    explanation: "Iterative state transition computes sequential Fibonacci numbers in O(N) time using constant auxiliary space.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "range",
      "cases": [
            {
                  "value": 1,
                  "expected": "0"
            },
            {
                  "value": 2,
                  "expected": "1"
            },
            {
                  "value": 5,
                  "expected": "3"
            },
            {
                  "value": 7,
                  "expected": "8"
            },
            {
                  "value": 10,
                  "expected": "34"
            }
      ]
}),
  },
  {
    id: "ch-l13",
    topic: "loops",
    title: "GCD / HCF of Two Numbers",
    difficulty: "Guided",
    description: "Given integers `a = 36` and `b = 60`, calculate their Greatest Common Divisor (GCD) using the Euclidean algorithm with a while loop. Print the GCD.",
    requirements: ["While b != 0: replace a with b, and b with remainder.", "Print the final value of a."],
    sampleOutput: "12",
    starterCode: "a = 36\nb = 60\n\n# Calculate GCD using Euclidean algorithm\n",
    hint: "Use `while b != 0: rem = a % b; a = b; b = rem`.",
    solutionCode: "a = 36\nb = 60\n\nwhile b != 0:\n    rem = a % b\n    a = b\n    b = rem\nprint(a)",
    explanation: "Euclid's algorithm relies on the theorem gcd(a, b) = gcd(b, a mod b), rapidly converging when remainder reaches 0.",
    validateOutput: makeValidator({
      "variable": [
            "a",
            "b"
      ],
      "mustInclude": "while ",
      "cases": [
            {
                  "value": [
                        36,
                        60
                  ],
                  "expected": "12"
            },
            {
                  "value": [
                        17,
                        13
                  ],
                  "expected": "1"
            },
            {
                  "value": [
                        10,
                        5
                  ],
                  "expected": "5"
            },
            {
                  "value": [
                        48,
                        18
                  ],
                  "expected": "6"
            },
            {
                  "value": [
                        100,
                        25
                  ],
                  "expected": "25"
            }
      ]
}),
  },
  {
    id: "ch-l14",
    topic: "loops",
    title: "LCM of Two Numbers",
    difficulty: "Guided",
    description: "Given positive integers `a = 12` and `b = 15`, calculate their Least Common Multiple (LCM) using the mathematical formula: $\\text{LCM}(a, b) = \\frac{a \\times b}{\\text{GCD}(a, b)}$. Print the LCM.",
    requirements: ["Compute GCD first using a while loop.", "Calculate LCM using integer division `//`.", "Print the LCM."],
    sampleOutput: "60",
    starterCode: "a = 12\nb = 15\n\n# Calculate LCM\n",
    hint: "Save product `prod = a * b`, find gcd via while loop, then `lcm = prod // gcd`.",
    solutionCode: "a = 12\nb = 15\n\nprod = a * b\nx = a\ny = b\nwhile y != 0:\n    rem = x % y\n    x = y\n    y = rem\ngcd = x\nlcm = prod // gcd\nprint(lcm)",
    explanation: "The fundamental theorem of arithmetic guarantees that the product of two positive integers equals the product of their GCD and LCM.",
    validateOutput: makeValidator({
      "variable": [
            "a",
            "b"
      ],
      "mustInclude": "//",
      "cases": [
            {
                  "value": [
                        12,
                        15
                  ],
                  "expected": "60"
            },
            {
                  "value": [
                        4,
                        6
                  ],
                  "expected": "12"
            },
            {
                  "value": [
                        7,
                        5
                  ],
                  "expected": "35"
            },
            {
                  "value": [
                        10,
                        20
                  ],
                  "expected": "20"
            },
            {
                  "value": [
                        14,
                        21
                  ],
                  "expected": "42"
            }
      ]
}),
  },
  {
    id: "ch-l15",
    topic: "loops",
    title: "Armstrong Number Check (3-digit)",
    difficulty: "Guided",
    description: "Given integer `n = 153`, determine whether it is an Armstrong number (where the sum of cubes of its digits equals the number: $1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153$). Print 'Armstrong Number' or 'Not Armstrong'.",
    requirements: ["Sum cubes of extracted digits (`(n % 10) ** 3`).", "Compare sum against original value.", "Print 'Armstrong Number' or 'Not Armstrong'."],
    sampleOutput: "Armstrong Number",
    starterCode: "n = 153\norig = n\ntotal = 0\n\n# Check if n is an Armstrong number\n",
    hint: "While temp > 0: `digit = temp % 10; total += digit ** 3; temp //= 10`.",
    solutionCode: "n = 153\norig = n\ntotal = 0\n\nwhile n > 0:\n    d = n % 10\n    total += d ** 3\n    n //= 10\n\nif total == orig:\n    print('Armstrong Number')\nelse:\n    print('Not Armstrong')",
    explanation: "Armstrong/narcissistic numbers are integers equal to the sum of their digits raised to the power of their digit count.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "orig",
      "cases": [
            {
                  "value": 153,
                  "expected": "Armstrong Number"
            },
            {
                  "value": 370,
                  "expected": "Armstrong Number"
            },
            {
                  "value": 371,
                  "expected": "Armstrong Number"
            },
            {
                  "value": 100,
                  "expected": "Not Armstrong"
            },
            {
                  "value": 407,
                  "expected": "Armstrong Number"
            }
      ]
}),
  },
  {
    id: "ch-l16",
    topic: "loops",
    title: "Perfect Number Detector",
    difficulty: "Guided",
    description: "Given integer `n = 28`, check if n is a perfect number (a positive integer that equals the sum of its proper positive divisors, excluding itself: $1 + 2 + 4 + 7 + 14 = 28$). Print 'Perfect Number' or 'Not Perfect'.",
    requirements: ["Sum divisors `i` where `n % i == 0` for `i` from 1 to n - 1.", "Compare sum against n.", "Print 'Perfect Number' or 'Not Perfect'."],
    sampleOutput: "Perfect Number",
    starterCode: "n = 28\n\n# Check if n is a perfect number\n",
    hint: "Loop `for i in range(1, n): if n % i == 0: total += i`.",
    solutionCode: "n = 28\n\ntotal = 0\nfor i in range(1, n):\n    if n % i == 0:\n        total += i\nif total == n:\n    print('Perfect Number')\nelse:\n    print('Not Perfect')",
    explanation: "Perfect numbers represent complete aliquot harmony where the sum of all proper factors matches the number itself.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "range",
      "cases": [
            {
                  "value": 6,
                  "expected": "Perfect Number"
            },
            {
                  "value": 28,
                  "expected": "Perfect Number"
            },
            {
                  "value": 12,
                  "expected": "Not Perfect"
            },
            {
                  "value": 15,
                  "expected": "Not Perfect"
            },
            {
                  "value": 496,
                  "expected": "Perfect Number"
            }
      ]
}),
  },
  {
    id: "ch-l17",
    topic: "loops",
    title: "Collatz Sequence Step Counter",
    difficulty: "Applied",
    description: "Given `n = 6`, compute how many steps it takes to reach 1 following Collatz rules: if n is even, $n = n // 2$; if n is odd, $n = 3n + 1$. Print the total step count.",
    requirements: ["Loop while n != 1.", "Update n based on even/odd condition and increment steps counter.", "Print total steps."],
    sampleOutput: "8",
    starterCode: "n = 6\nsteps = 0\n\n# Count Collatz steps to 1\n",
    hint: "Use `while n != 1:` with if n % 2 == 0: n //= 2 else: n = 3*n + 1.",
    solutionCode: "n = 6\nsteps = 0\n\nwhile n != 1:\n    if n % 2 == 0:\n        n //= 2\n    else:\n        n = 3 * n + 1\n    steps += 1\nprint(steps)",
    explanation: "The Collatz 3n+1 conjecture produces a deterministic dynamical trajectory that terminates when the sequence arrives at 1.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "while ",
      "cases": [
            {
                  "value": 6,
                  "expected": "8"
            },
            {
                  "value": 1,
                  "expected": "0"
            },
            {
                  "value": 2,
                  "expected": "1"
            },
            {
                  "value": 7,
                  "expected": "16"
            },
            {
                  "value": 12,
                  "expected": "9"
            }
      ]
}),
  },
  {
    id: "ch-l18",
    topic: "loops",
    title: "Count Even and Odd Digits",
    difficulty: "Beginner",
    description: "Given positive integer `n = 24791`, count how many even digits and odd digits it contains using a while loop. Print in format: `Even: {evens}, Odd: {odds}`.",
    requirements: ["Extract each digit using % 10.", "Test parity of each digit and tally counts.", "Print exact formatted result."],
    sampleOutput: "Even: 2, Odd: 3",
    starterCode: "n = 24791\nevens = 0\nodds = 0\n\n# Count even and odd digits\n",
    hint: "Loop `while n > 0:` and check `(n % 10) % 2 == 0`.",
    solutionCode: "n = 24791\nevens = 0\nodds = 0\n\nwhile n > 0:\n    d = n % 10\n    if d % 2 == 0:\n        evens += 1\n    else:\n        odds += 1\n    n //= 10\nprint(f'Even: {evens}, Odd: {odds}')",
    explanation: "Iterative digit extraction combines modulo arithmetic with conditional classification to tally distinct digit categories.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "f'Even:",
      "cases": [
            {
                  "value": 24791,
                  "expected": "Even: 2, Odd: 3"
            },
            {
                  "value": 888,
                  "expected": "Even: 3, Odd: 0"
            },
            {
                  "value": 1357,
                  "expected": "Even: 0, Odd: 4"
            },
            {
                  "value": 204,
                  "expected": "Even: 3, Odd: 0"
            },
            {
                  "value": 102,
                  "expected": "Even: 2, Odd: 1"
            }
      ]
}),
  },
  {
    id: "ch-l19",
    topic: "loops",
    title: "Product of Non-Zero Digits",
    difficulty: "Beginner",
    description: "Given integer `n = 2053`, compute the product of all its non-zero decimal digits ($2 \\times 5 \\times 3 = 30$). Zero digits must be skipped. Print the product.",
    requirements: ["Loop through digits with n % 10 and n //= 10.", "Multiply into product only when digit != 0.", "Print final product."],
    sampleOutput: "30",
    starterCode: "n = 2053\nprod = 1\n\n# Compute product of non-zero digits\n",
    hint: "Check `if d != 0: prod *= d`.",
    solutionCode: "n = 2053\nprod = 1\n\nwhile n > 0:\n    d = n % 10\n    if d != 0:\n        prod *= d\n    n //= 10\nprint(prod)",
    explanation: "Skipping zero digits avoids zeroing out the multiplicative accumulator, preserving product integrity.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "prod",
      "cases": [
            {
                  "value": 2053,
                  "expected": "30"
            },
            {
                  "value": 10204,
                  "expected": "8"
            },
            {
                  "value": 700,
                  "expected": "7"
            },
            {
                  "value": 1234,
                  "expected": "24"
            },
            {
                  "value": 909,
                  "expected": "81"
            }
      ]
}),
  },
  {
    id: "ch-l20",
    topic: "loops",
    title: "Power Without Exponentiation Operator",
    difficulty: "Beginner",
    description: "Given `base = 3` and non-negative integer `exp = 4`, compute $base^{exp}$ using a for loop (without using the `**` operator or `pow`). Print the result.",
    requirements: ["Do not use ** or pow().", "Multiply base into accumulator exp times.", "Print final value."],
    sampleOutput: "81",
    starterCode: "base = 3\nexp = 4\nresult = 1\n\n# Compute base^exp using a loop\n",
    hint: "Loop `for _ in range(exp): result *= base`.",
    solutionCode: "base = 3\nexp = 4\nresult = 1\n\nfor i in range(exp):\n    result *= base\nprint(result)",
    explanation: "Exponentiation is repeated multiplication: iterating exp times reproduces power definition from basic principles.",
    validateOutput: makeValidator({
      "variable": [
            "base",
            "exp"
      ],
      "mustInclude": "range",
      "cases": [
            {
                  "value": [
                        3,
                        4
                  ],
                  "expected": "81"
            },
            {
                  "value": [
                        2,
                        5
                  ],
                  "expected": "32"
            },
            {
                  "value": [
                        5,
                        0
                  ],
                  "expected": "1"
            },
            {
                  "value": [
                        10,
                        3
                  ],
                  "expected": "1000"
            },
            {
                  "value": [
                        4,
                        2
                  ],
                  "expected": "16"
            }
      ]
}),
  },
  {
    id: "ch-l21",
    topic: "loops",
    title: "Sum of Even Numbers up to N",
    difficulty: "Beginner",
    description: "Given positive integer `n = 10`, compute the sum of all positive even numbers less than or equal to n ($2 + 4 + 6 + 8 + 10 = 30$) using `range()` with step 2. Print the sum.",
    requirements: ["Use range(2, n + 1, 2).", "Print the final sum."],
    sampleOutput: "30",
    starterCode: "n = 10\ntotal = 0\n\n# Sum even numbers up to n\n",
    hint: "Use step 2: `for i in range(2, n + 1, 2): total += i`.",
    solutionCode: "n = 10\ntotal = 0\n\nfor i in range(2, n + 1, 2):\n    total += i\nprint(total)",
    explanation: "Stepping by 2 directly visits even integers, eliminating conditional branches and optimizing loop traversal.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": ", 2)",
      "cases": [
            {
                  "value": 10,
                  "expected": "30"
            },
            {
                  "value": 4,
                  "expected": "6"
            },
            {
                  "value": 1,
                  "expected": "0"
            },
            {
                  "value": 6,
                  "expected": "12"
            },
            {
                  "value": 12,
                  "expected": "42"
            }
      ]
}),
  },
  {
    id: "ch-l22",
    topic: "loops",
    title: "Sum of Odd Numbers up to N",
    difficulty: "Beginner",
    description: "Given positive integer `n = 9`, compute the sum of all positive odd numbers less than or equal to n ($1 + 3 + 5 + 7 + 9 = 25$) using `range(1, n + 1, 2)`. Print the sum.",
    requirements: ["Use range(1, n + 1, 2).", "Print the final sum."],
    sampleOutput: "25",
    starterCode: "n = 9\ntotal = 0\n\n# Sum odd numbers up to n\n",
    hint: "Start at 1 with step 2: `range(1, n + 1, 2)`.",
    solutionCode: "n = 9\ntotal = 0\n\nfor i in range(1, n + 1, 2):\n    total += i\nprint(total)",
    explanation: "The sum of the first k odd numbers always equals k^2; stepping by 2 directly visits each consecutive odd term.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "range",
      "cases": [
            {
                  "value": 9,
                  "expected": "25"
            },
            {
                  "value": 5,
                  "expected": "9"
            },
            {
                  "value": 2,
                  "expected": "1"
            },
            {
                  "value": 1,
                  "expected": "1"
            },
            {
                  "value": 10,
                  "expected": "25"
            }
      ]
}),
  },
  {
    id: "ch-l23",
    topic: "loops",
    title: "Count Factors of an Integer",
    difficulty: "Beginner",
    description: "Given integer `n = 18`, count how many positive factors (divisors) it has (divisors of 18 are 1, 2, 3, 6, 9, 18 $\\rightarrow$ count = 6). Print the factor count.",
    requirements: ["Check divisibility `n % i == 0` for `i` from 1 to n.", "Print total factors count."],
    sampleOutput: "6",
    starterCode: "n = 18\ncount = 0\n\n# Count factors of n\n",
    hint: "Loop `for i in range(1, n + 1): if n % i == 0: count += 1`.",
    solutionCode: "n = 18\ncount = 0\n\nfor i in range(1, n + 1):\n    if n % i == 0:\n        count += 1\nprint(count)",
    explanation: "Testing remainder zero across [1, n] identifies every exact integer divisor of the target number.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "range",
      "cases": [
            {
                  "value": 18,
                  "expected": "6"
            },
            {
                  "value": 7,
                  "expected": "2"
            },
            {
                  "value": 1,
                  "expected": "1"
            },
            {
                  "value": 12,
                  "expected": "6"
            },
            {
                  "value": 16,
                  "expected": "5"
            }
      ]
}),
  },
  {
    id: "ch-l24",
    topic: "loops",
    title: "Harshad (Niven) Number Verifier",
    difficulty: "Guided",
    description: "Given positive integer `n = 18`, check if it is a Harshad number (divisible by the sum of its decimal digits: $18 / (1 + 8) = 18 / 9 = 2$). Print 'Harshad Number' or 'Not Harshad'.",
    requirements: ["Compute digit sum of n using while loop.", "Check if `original_n % digit_sum == 0`.", "Print 'Harshad Number' or 'Not Harshad'."],
    sampleOutput: "Harshad Number",
    starterCode: "n = 18\norig = n\ndigit_sum = 0\n\n# Check if n is a Harshad number\n",
    hint: "Sum digits into digit_sum, then check `if orig % digit_sum == 0:`.",
    solutionCode: "n = 18\norig = n\ndigit_sum = 0\n\nwhile n > 0:\n    digit_sum += n % 10\n    n //= 10\n\nif orig % digit_sum == 0:\n    print('Harshad Number')\nelse:\n    print('Not Harshad')",
    explanation: "A Harshad (joy-giver) number is an integer divisible by its digit sum in base 10.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "orig",
      "cases": [
            {
                  "value": 18,
                  "expected": "Harshad Number"
            },
            {
                  "value": 21,
                  "expected": "Harshad Number"
            },
            {
                  "value": 19,
                  "expected": "Not Harshad"
            },
            {
                  "value": 24,
                  "expected": "Harshad Number"
            },
            {
                  "value": 25,
                  "expected": "Not Harshad"
            }
      ]
}),
  },
  {
    id: "ch-l25",
    topic: "loops",
    title: "Strong / Krishnamurthy Number",
    difficulty: "Applied",
    description: "Given integer `n = 145`, check if it is a Strong number (equal to the sum of the factorials of its digits: $1! + 4! + 5! = 1 + 24 + 120 = 145$). Print 'Strong Number' or 'Not Strong'.",
    requirements: ["For each extracted digit, compute its factorial using an inner loop.", "Sum the factorials and compare against original value.", "Print 'Strong Number' or 'Not Strong'."],
    sampleOutput: "Strong Number",
    starterCode: "n = 145\norig = n\ntotal = 0\n\n# Check if n is a Strong number\n",
    hint: "Extract digit d; compute `fact = 1` for `j in range(1, d + 1): fact *= j`; add to total.",
    solutionCode: "n = 145\norig = n\ntotal = 0\n\nwhile n > 0:\n    d = n % 10\n    fact = 1\n    for j in range(1, d + 1):\n        fact *= j\n    total += fact\n    n //= 10\n\nif total == orig:\n    print('Strong Number')\nelse:\n    print('Not Strong')",
    explanation: "Nested loops extract digits and calculate their separate factorials, verifying Krishnamurthy identity.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "orig",
      "cases": [
            {
                  "value": 145,
                  "expected": "Strong Number"
            },
            {
                  "value": 1,
                  "expected": "Strong Number"
            },
            {
                  "value": 2,
                  "expected": "Strong Number"
            },
            {
                  "value": 123,
                  "expected": "Not Strong"
            },
            {
                  "value": 10,
                  "expected": "Not Strong"
            }
      ]
}),
  },
  {
    id: "ch-l26",
    topic: "loops",
    title: "Right-Angled Star Triangle",
    difficulty: "Beginner",
    description: "Given row count `n = 4`, print a right-angled star pattern where row $i$ has $i$ stars (from 1 to n).",
    requirements: ["Loop `for i in range(1, n + 1):`.", "Print `*` repeated $i$ times using string multiplication."],
    sampleOutput: "*\n**\n***\n****",
    starterCode: "n = 4\n\n# Print star triangle\n",
    hint: "Use `print('*' * i)` inside the loop.",
    solutionCode: "n = 4\n\nfor i in range(1, n + 1):\n    print('*' * i)",
    explanation: "Multiplying the character string '*' by the current loop index prints linearly expanding visual triangles.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "range",
      "cases": [
            {
                  "value": 4,
                  "expected": "*\n**\n***\n****"
            },
            {
                  "value": 3,
                  "expected": "*\n**\n***"
            },
            {
                  "value": 1,
                  "expected": "*"
            },
            {
                  "value": 5,
                  "expected": "*\n**\n***\n****\n*****"
            },
            {
                  "value": 2,
                  "expected": "*\n**"
            }
      ]
}),
  },
  {
    id: "ch-l27",
    topic: "loops",
    title: "Inverted Star Triangle",
    difficulty: "Beginner",
    description: "Given row count `n = 4`, print an inverted star triangle where the first row has n stars and the last row has 1 star.",
    requirements: ["Loop backwards from n down to 1 using negative step.", "Print `*` repeated $i$ times."],
    sampleOutput: "****\n***\n**\n*",
    starterCode: "n = 4\n\n# Print inverted star triangle\n",
    hint: "Use `range(n, 0, -1)`.",
    solutionCode: "n = 4\n\nfor i in range(n, 0, -1):\n    print('*' * i)",
    explanation: "A negative step in range(n, 0, -1) decrements the star multiplier on each iteration to invert the visual geometry.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "-1)",
      "cases": [
            {
                  "value": 4,
                  "expected": "****\n***\n**\n*"
            },
            {
                  "value": 3,
                  "expected": "***\n**\n*"
            },
            {
                  "value": 1,
                  "expected": "*"
            },
            {
                  "value": 5,
                  "expected": "*****\n****\n***\n**\n*"
            },
            {
                  "value": 2,
                  "expected": "**\n*"
            }
      ]
}),
  },
  {
    id: "ch-l28",
    topic: "loops",
    title: "Number Pyramid Pattern",
    difficulty: "Guided",
    description: "Given `n = 4`, print a number pyramid where each row $i$ repeats digit $i$, $i$ times (row 1: '1', row 2: '22', row 3: '333', row 4: '4444').",
    requirements: ["Loop $i$ from 1 to n.", "Use `str(i) * i` to repeat the digit."],
    sampleOutput: "1\n22\n333\n4444",
    starterCode: "n = 4\n\n# Print number pyramid\n",
    hint: "Convert $i$ to string with `str(i)` and multiply by $i$.",
    solutionCode: "n = 4\n\nfor i in range(1, n + 1):\n    print(str(i) * i)",
    explanation: "Converting loop index i to a string allows multiplication to repeat the digit across the row.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "str",
      "cases": [
            {
                  "value": 4,
                  "expected": "1\n22\n333\n4444"
            },
            {
                  "value": 3,
                  "expected": "1\n22\n333"
            },
            {
                  "value": 1,
                  "expected": "1"
            },
            {
                  "value": 5,
                  "expected": "1\n22\n333\n4444\n55555"
            },
            {
                  "value": 2,
                  "expected": "1\n22"
            }
      ]
}),
  },
  {
    id: "ch-l29",
    topic: "loops",
    title: "Continuous Floyd's Triangle",
    difficulty: "Applied",
    description: "Given row count `n = 3`, print a Floyd's triangle with continuous integers on each row: row 1 is '1', row 2 is '2 3', row 3 is '4 5 6'.",
    requirements: ["Maintain a global counter `num = 1`.", "Assemble row strings or print values with space separator."],
    sampleOutput: "1\n2 3\n4 5 6",
    starterCode: "n = 3\nnum = 1\n\n# Print Floyd's triangle\n",
    hint: "For each row i, build a row string: `row = []` or concat numbers with spaces.",
    solutionCode: "n = 3\nnum = 1\n\nfor i in range(1, n + 1):\n    row = ''\n    for j in range(i):\n        if j == 0:\n            row = str(num)\n        else:\n            row = row + ' ' + str(num)\n        num += 1\n    print(row)",
    explanation: "Nested loops coordinate row structure and column counts while a persistent external counter generates consecutive integers.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "range",
      "cases": [
            {
                  "value": 3,
                  "expected": "1\n2 3\n4 5 6"
            },
            {
                  "value": 2,
                  "expected": "1\n2 3"
            },
            {
                  "value": 1,
                  "expected": "1"
            },
            {
                  "value": 4,
                  "expected": "1\n2 3\n4 5 6\n7 8 9 10"
            },
            {
                  "value": 5,
                  "expected": "1\n2 3\n4 5 6\n7 8 9 10\n11 12 13 14 15"
            }
      ]
}),
  },
  {
    id: "ch-l30",
    topic: "loops",
    title: "Alternating Series Sum",
    difficulty: "Applied",
    description: "Given integer `n = 5`, compute the alternating harmonic series sum $S = 1 - 2 + 3 - 4 + 5 - \\dots \\pm n$. For n = 5, $S = 1 - 2 + 3 - 4 + 5 = 3$. Print the sum.",
    requirements: ["Loop $i$ from 1 to n.", "If $i$ is odd add $i$, if $i$ is even subtract $i$.", "Print final alternating sum."],
    sampleOutput: "3",
    starterCode: "n = 5\ntotal = 0\n\n# Calculate alternating series sum\n",
    hint: "Check parity: `if i % 2 == 1: total += i else: total -= i`.",
    solutionCode: "n = 5\ntotal = 0\n\nfor i in range(1, n + 1):\n    if i % 2 == 1:\n        total += i\n    else:\n        total -= i\nprint(total)",
    explanation: "Alternating signs modeled with modulo parity simulate converging oscillations in mathematical series analysis.",
    validateOutput: makeValidator({
      "variable": "n",
      "mustInclude": "range",
      "cases": [
            {
                  "value": 5,
                  "expected": "3"
            },
            {
                  "value": 4,
                  "expected": "-2"
            },
            {
                  "value": 1,
                  "expected": "1"
            },
            {
                  "value": 6,
                  "expected": "-3"
            },
            {
                  "value": 10,
                  "expected": "-5"
            }
      ]
}),
  },
];
