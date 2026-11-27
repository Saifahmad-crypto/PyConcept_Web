# scripts/challenges_conditionals.py
# 30 Conditionals Coding Challenges: ch-c1 to ch-c30

CONDITIONALS_CHALLENGES = [
    {
        "id": "ch-c1",
        "topic": "conditionals",
        "title": "Positive, Negative, or Zero",
        "difficulty": "Beginner",
        "description": "Given a variable `num = -7`, write an if-elif-else statement that prints 'Positive' if num > 0, 'Negative' if num < 0, or 'Zero' if num == 0.",
        "requirements": [
            "Use if num > 0, elif num < 0, and else.",
            "Print exactly 'Positive', 'Negative', or 'Zero'.",
        ],
        "sampleOutput": "Negative",
        "starterCode": "num = -7\n\n# Write your if-elif-else logic below\n",
        "hint": "Use `if num > 0:`, `elif num < 0:`, and `else:` with print() calls.",
        "solutionCode": "num = -7\n\nif num > 0:\n    print('Positive')\nelif num < 0:\n    print('Negative')\nelse:\n    print('Zero')",
        "explanation": "Conditions are evaluated sequentially from top to bottom. As soon as a branch condition is True, its body executes and remaining elif/else branches are bypassed.",
        "validator": {
            "variable": "num",
            "mustInclude": "if ",
            "cases": [
                {"value": 10, "expected": "Positive"},
                {"value": -7, "expected": "Negative"},
                {"value": 0, "expected": "Zero"},
                {"value": -100, "expected": "Negative"},
                {"value": 42, "expected": "Positive"},
            ]
        }
    },
    {
        "id": "ch-c2",
        "topic": "conditionals",
        "title": "Even or Odd Detector",
        "difficulty": "Beginner",
        "description": "Check whether `number = 24` is even or odd using the modulo operator `%`. Print 'Even' if divisible by 2, otherwise print 'Odd'.",
        "requirements": [
            "Use `number % 2 == 0` to check even parity.",
            "Print 'Even' or 'Odd'.",
        ],
        "sampleOutput": "Even",
        "starterCode": "number = 24\n\n# Check if number is even or odd\n",
        "hint": "If number % 2 == 0 is True, remainder is 0, so the number is Even.",
        "solutionCode": "number = 24\n\nif number % 2 == 0:\n    print('Even')\nelse:\n    print('Odd')",
        "explanation": "The modulo operator % returns the remainder after division by 2. Even integers always produce a remainder of 0.",
        "validator": {
            "variable": "number",
            "mustInclude": "%",
            "cases": [
                {"value": 24, "expected": "Even"},
                {"value": 13, "expected": "Odd"},
                {"value": 0, "expected": "Even"},
                {"value": -8, "expected": "Even"},
                {"value": -15, "expected": "Odd"},
            ]
        }
    },
    {
        "id": "ch-c3",
        "topic": "conditionals",
        "title": "Ticket Age Categorizer",
        "difficulty": "Beginner",
        "description": "Categorize a patron's ticket based on `age = 15`. Print 'Child' for age < 13, 'Teen' for 13 <= age < 20, 'Adult' for 20 <= age < 65, and 'Senior' for age >= 65.",
        "requirements": [
            "Check the age intervals using an if-elif-else ladder.",
            "Print 'Child', 'Teen', 'Adult', or 'Senior'.",
        ],
        "sampleOutput": "Teen",
        "starterCode": "age = 15\n\n# Categorize ticket by age\n",
        "hint": "Check in ascending order: `if age < 13:`, `elif age < 20:`, `elif age < 65:`, `else:`.",
        "solutionCode": "age = 15\n\nif age < 13:\n    print('Child')\nelif age < 20:\n    print('Teen')\nelif age < 65:\n    print('Adult')\nelse:\n    print('Senior')",
        "explanation": "Organizing comparison bounds in ascending order guarantees that prior bounds were already tested, simplifying each subsequent elif condition.",
        "validator": {
            "variable": "age",
            "mustInclude": "elif ",
            "cases": [
                {"value": 8, "expected": "Child"},
                {"value": 15, "expected": "Teen"},
                {"value": 25, "expected": "Adult"},
                {"value": 70, "expected": "Senior"},
                {"value": 13, "expected": "Teen"},
                {"value": 65, "expected": "Senior"},
            ]
        }
    },
    {
        "id": "ch-c4",
        "topic": "conditionals",
        "title": "Quadrant Finder",
        "difficulty": "Guided",
        "description": "Given coordinates `x = -4` and `y = 7`, determine which 2D Cartesian quadrant the point lies in. Print 'Quadrant 1' (x>0, y>0), 'Quadrant 2' (x<0, y>0), 'Quadrant 3' (x<0, y<0), 'Quadrant 4' (x>0, y<0), or 'Origin / Axis' otherwise.",
        "requirements": [
            "Use relational and logical operators to check signs of x and y.",
            "Print the correct quadrant name.",
        ],
        "sampleOutput": "Quadrant 2",
        "starterCode": "x = -4\ny = 7\n\n# Determine quadrant\n",
        "hint": "Use `if x > 0 and y > 0:` for Q1, `elif x < 0 and y > 0:` for Q2, etc.",
        "solutionCode": "x = -4\ny = 7\n\nif x > 0 and y > 0:\n    print('Quadrant 1')\nelif x < 0 and y > 0:\n    print('Quadrant 2')\nelif x < 0 and y < 0:\n    print('Quadrant 3')\nelif x > 0 and y < 0:\n    print('Quadrant 4')\nelse:\n    print('Origin / Axis')",
        "explanation": "2D Cartesian quadrants depend directly on the signs of x and y coordinates. Boundary points on the axes or origin are caught by the else branch.",
        "validator": {
            "variable": ["x", "y"],
            "mustInclude": "and",
            "cases": [
                {"value": [3, 5], "expected": "Quadrant 1"},
                {"value": [-4, 7], "expected": "Quadrant 2"},
                {"value": [-2, -8], "expected": "Quadrant 3"},
                {"value": [6, -1], "expected": "Quadrant 4"},
                {"value": [0, 0], "expected": "Origin / Axis"},
                {"value": [0, 5], "expected": "Origin / Axis"},
            ]
        }
    },
    {
        "id": "ch-c5",
        "topic": "conditionals",
        "title": "Maximum of Three Numbers",
        "difficulty": "Guided",
        "description": "Given three variables `a = 14`, `b = 29`, and `c = 8`, find and print the maximum value among them using conditional logic (without using the max() function).",
        "requirements": [
            "Use nested if or logical operators (and) to compare a, b, and c.",
            "Print only the maximum numeric value.",
        ],
        "sampleOutput": "29",
        "starterCode": "a = 14\nb = 29\nc = 8\n\n# Find and print the maximum without max()\n",
        "hint": "Check `if a >= b and a >= c:`, `elif b >= a and b >= c:`, `else:`.",
        "solutionCode": "a = 14\nb = 29\nc = 8\n\nif a >= b and a >= c:\n    print(a)\nelif b >= a and b >= c:\n    print(b)\nelse:\n    print(c)",
        "explanation": "Comparing each candidate against the other two using >= accurately handles both distinct numbers and ties without requiring built-in helper functions.",
        "validator": {
            "variable": ["a", "b", "c"],
            "mustInclude": "if ",
            "cases": [
                {"value": [14, 29, 8], "expected": "29"},
                {"value": [50, 10, 20], "expected": "50"},
                {"value": [5, 5, 25], "expected": "25"},
                {"value": [-10, -2, -30], "expected": "-2"},
                {"value": [0, 0, 0], "expected": "0"},
            ]
        }
    },
    {
        "id": "ch-c6",
        "topic": "conditionals",
        "title": "Minimum of Three Numbers",
        "difficulty": "Beginner",
        "description": "Given three variables `a = 14`, `b = 29`, and `c = 8`, find and print the minimum value among them without using min().",
        "requirements": [
            "Compare a, b, and c using <= and logical and.",
            "Print only the minimum numeric value.",
        ],
        "sampleOutput": "8",
        "starterCode": "a = 14\nb = 29\nc = 8\n\n# Find and print the minimum without min()\n",
        "hint": "Check `if a <= b and a <= c:` print a, `elif b <= a and b <= c:` print b, else print c.",
        "solutionCode": "a = 14\nb = 29\nc = 8\n\nif a <= b and a <= c:\n    print(a)\nelif b <= a and b <= c:\n    print(b)\nelse:\n    print(c)",
        "explanation": "Testing whether a number is less than or equal to all other operands isolates the global minimum across all branches.",
        "validator": {
            "variable": ["a", "b", "c"],
            "mustInclude": "if ",
            "cases": [
                {"value": [14, 29, 8], "expected": "8"},
                {"value": [5, 2, 9], "expected": "2"},
                {"value": [-10, -2, -30], "expected": "-30"},
                {"value": [0, 4, -1], "expected": "-1"},
                {"value": [7, 7, 7], "expected": "7"},
            ]
        }
    },
    {
        "id": "ch-c7",
        "topic": "conditionals",
        "title": "Leap Year Checker",
        "difficulty": "Guided",
        "description": "Given `year = 2024`, determine if it is a leap year. A year is a leap year if divisible by 4, except century years must be divisible by 400. Print 'Leap Year' or 'Not a Leap Year'.",
        "requirements": [
            "Implement the full Gregorian calendar leap year rule.",
            "Print 'Leap Year' or 'Not a Leap Year'.",
        ],
        "sampleOutput": "Leap Year",
        "starterCode": "year = 2024\n\n# Check if year is a leap year\n",
        "hint": "Use `(year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)`.",
        "solutionCode": "year = 2024\n\nif (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):\n    print('Leap Year')\nelse:\n    print('Not a Leap Year')",
        "explanation": "The Gregorian rule accounts for Earth's orbital period: 4-year periodicity is adjusted by removing century leaps unless offset by 400-year alignment.",
        "validator": {
            "variable": "year",
            "mustInclude": "%",
            "cases": [
                {"value": 2024, "expected": "Leap Year"},
                {"value": 1900, "expected": "Not a Leap Year"},
                {"value": 2000, "expected": "Leap Year"},
                {"value": 2023, "expected": "Not a Leap Year"},
                {"value": 2004, "expected": "Leap Year"},
            ]
        }
    },
    {
        "id": "ch-c8",
        "topic": "conditionals",
        "title": "Triangle Validity by Sides",
        "difficulty": "Beginner",
        "description": "Given side lengths `a = 3`, `b = 4`, and `c = 5`, verify whether they can form a valid triangle according to the Triangle Inequality Theorem. Print 'Valid Triangle' or 'Invalid Triangle'.",
        "requirements": [
            "Check that the sum of any two sides is strictly greater than the third side.",
            "Print 'Valid Triangle' or 'Invalid Triangle'.",
        ],
        "sampleOutput": "Valid Triangle",
        "starterCode": "a = 3\nb = 4\nc = 5\n\n# Check triangle inequality\n",
        "hint": "Condition: `a + b > c and a + c > b and b + c > a`.",
        "solutionCode": "a = 3\nb = 4\nc = 5\n\nif a + b > c and a + c > b and b + c > a:\n    print('Valid Triangle')\nelse:\n    print('Invalid Triangle')",
        "explanation": "By geometry theorem, a closed triangle can only be formed if the combined length of any two edges strictly exceeds the remaining edge.",
        "validator": {
            "variable": ["a", "b", "c"],
            "mustInclude": "and",
            "cases": [
                {"value": [3, 4, 5], "expected": "Valid Triangle"},
                {"value": [1, 2, 5], "expected": "Invalid Triangle"},
                {"value": [5, 5, 5], "expected": "Valid Triangle"},
                {"value": [7, 10, 5], "expected": "Valid Triangle"},
                {"value": [10, 2, 2], "expected": "Invalid Triangle"},
            ]
        }
    },
    {
        "id": "ch-c9",
        "topic": "conditionals",
        "title": "Triangle Classification by Sides",
        "difficulty": "Guided",
        "description": "Given triangle side lengths `a = 5`, `b = 5`, and `c = 5`, classify the triangle into 'Equilateral' (all 3 sides equal), 'Isosceles' (any 2 sides equal), or 'Scalene' (all sides different).",
        "requirements": [
            "Use an if-elif-else structure to classify side equality.",
            "Print 'Equilateral', 'Isosceles', or 'Scalene'.",
        ],
        "sampleOutput": "Equilateral",
        "starterCode": "a = 5\nb = 5\nc = 5\n\n# Classify triangle\n",
        "hint": "Check `if a == b == c:` first for equilateral, then check if any pair is equal for isosceles.",
        "solutionCode": "a = 5\nb = 5\nc = 5\n\nif a == b and b == c:\n    print('Equilateral')\nelif a == b or b == c or a == c:\n    print('Isosceles')\nelse:\n    print('Scalene')",
        "explanation": "Checking equilateral first eliminates the 3-side tie, so the subsequent elif only triggers when exactly 2 sides match.",
        "validator": {
            "variable": ["a", "b", "c"],
            "mustInclude": "elif ",
            "cases": [
                {"value": [5, 5, 5], "expected": "Equilateral"},
                {"value": [5, 5, 8], "expected": "Isosceles"},
                {"value": [3, 4, 5], "expected": "Scalene"},
                {"value": [6, 9, 6], "expected": "Isosceles"},
                {"value": [7, 8, 10], "expected": "Scalene"},
            ]
        }
    },
    {
        "id": "ch-c10",
        "topic": "conditionals",
        "title": "Right-Angled Triangle Detector",
        "difficulty": "Guided",
        "description": "Given side lengths `a = 3`, `b = 4`, and `c = 5`, check whether the sides satisfy the Pythagorean theorem ($x^2 + y^2 = z^2$ for any side orientation). Print 'Right Angled' or 'Not Right Angled'.",
        "requirements": [
            "Compute squares of sides using ** 2 or multiplication.",
            "Print 'Right Angled' or 'Not Right Angled'.",
        ],
        "sampleOutput": "Right Angled",
        "starterCode": "a = 3\nb = 4\nc = 5\n\n# Check Pythagorean theorem\n",
        "hint": "Check if `a*a + b*b == c*c or a*a + c*c == b*b or b*b + c*c == a*a:`.",
        "solutionCode": "a = 3\nb = 4\nc = 5\n\nif a*a + b*b == c*c or a*a + c*c == b*b or b*b + c*c == a*a:\n    print('Right Angled')\nelse:\n    print('Not Right Angled')",
        "explanation": "Testing all 3 pairings covers any hypotenuse orientation without requiring the sides to be pre-sorted.",
        "validator": {
            "variable": ["a", "b", "c"],
            "mustInclude": "or",
            "cases": [
                {"value": [3, 4, 5], "expected": "Right Angled"},
                {"value": [5, 12, 13], "expected": "Right Angled"},
                {"value": [4, 5, 6], "expected": "Not Right Angled"},
                {"value": [6, 8, 10], "expected": "Right Angled"},
                {"value": [1, 1, 2], "expected": "Not Right Angled"},
            ]
        }
    },
    {
        "id": "ch-c11",
        "topic": "conditionals",
        "title": "Quadratic Equation Roots Nature",
        "difficulty": "Guided",
        "description": "Given coefficients `a = 1`, `b = -5`, and `c = 6` for quadratic equation $ax^2 + bx + c = 0$, compute discriminant $D = b^2 - 4ac$. Print 'Two Real Roots' if D > 0, 'One Real Root' if D == 0, or 'Complex Roots' if D < 0.",
        "requirements": [
            "Compute discriminant d = b*b - 4*a*c.",
            "Print 'Two Real Roots', 'One Real Root', or 'Complex Roots'.",
        ],
        "sampleOutput": "Two Real Roots",
        "starterCode": "a = 1\nb = -5\nc = 6\n\n# Calculate discriminant and print roots nature\n",
        "hint": "Calculate `d = b*b - 4*a*c` then branch with if-elif-else.",
        "solutionCode": "a = 1\nb = -5\nc = 6\n\nd = b*b - 4*a*c\nif d > 0:\n    print('Two Real Roots')\nelif d == 0:\n    print('One Real Root')\nelse:\n    print('Complex Roots')",
        "explanation": "The sign of discriminant D under the square root determines whether the roots are distinct real numbers, coincident, or complex conjugates.",
        "validator": {
            "variable": ["a", "b", "c"],
            "mustInclude": "elif ",
            "cases": [
                {"value": [1, -5, 6], "expected": "Two Real Roots"},
                {"value": [1, -4, 4], "expected": "One Real Root"},
                {"value": [1, 2, 5], "expected": "Complex Roots"},
                {"value": [2, -4, -6], "expected": "Two Real Roots"},
                {"value": [3, 2, 1], "expected": "Complex Roots"},
            ]
        }
    },
    {
        "id": "ch-c12",
        "topic": "conditionals",
        "title": "Electricity Slab Bill Calculator",
        "difficulty": "Applied",
        "description": "Calculate total electricity bill for `units = 150`. First 100 units cost 2 per unit. Any additional units beyond 100 cost 5 per unit. Print the total bill amount as an integer.",
        "requirements": [
            "If units <= 100, bill = units * 2.",
            "If units > 100, bill = 100 * 2 + (units - 100) * 5.",
            "Print the final total.",
        ],
        "sampleOutput": "450",
        "starterCode": "units = 150\n\n# Calculate tiered electricity bill\n",
        "hint": "Check `if units <= 100: bill = units * 2` else `bill = 200 + (units - 100) * 5`.",
        "solutionCode": "units = 150\n\nif units <= 100:\n    bill = units * 2\nelse:\n    bill = 100 * 2 + (units - 100) * 5\nprint(bill)",
        "explanation": "Tiered utility billing applies baseline tariff rates to initial usage brackets and escalated rates exclusively to marginal units.",
        "validator": {
            "variable": "units",
            "mustInclude": "if ",
            "cases": [
                {"value": 50, "expected": "100"},
                {"value": 100, "expected": "200"},
                {"value": 150, "expected": "450"},
                {"value": 200, "expected": "700"},
                {"value": 0, "expected": "0"},
            ]
        }
    },
    {
        "id": "ch-c13",
        "topic": "conditionals",
        "title": "Income Tax Slab Calculator",
        "difficulty": "Applied",
        "description": "Calculate income tax for annual `income = 600000`. Up to 250,000: 0% tax. From 250,001 to 500,000: 5% on excess above 250,000. Above 500,000: 12,500 base + 20% on excess above 500,000. Print the total tax as an integer.",
        "requirements": [
            "Compute tax using the progressive tax brackets.",
            "Print the tax as an int value.",
        ],
        "sampleOutput": "32500",
        "starterCode": "income = 600000\n\n# Compute income tax\n",
        "hint": "Use `int(...)` for bracket calculations: 5% is `0.05` and 20% is `0.20`.",
        "solutionCode": "income = 600000\n\nif income <= 250000:\n    tax = 0\nelif income <= 500000:\n    tax = int((income - 250000) * 0.05)\nelse:\n    tax = int(12500 + (income - 500000) * 0.20)\nprint(tax)",
        "explanation": "Progressive taxation only taxes the slice of income within each respective threshold, maintaining economic incentives.",
        "validator": {
            "variable": "income",
            "mustInclude": "elif ",
            "cases": [
                {"value": 200000, "expected": "0"},
                {"value": 250000, "expected": "0"},
                {"value": 400000, "expected": "7500"},
                {"value": 600000, "expected": "32500"},
                {"value": 800000, "expected": "72500"},
            ]
        }
    },
    {
        "id": "ch-c14",
        "topic": "conditionals",
        "title": "Cinema Ticket Tier Pricing",
        "difficulty": "Beginner",
        "description": "Given `age = 22`, determine cinema ticket pricing: age < 12 prints 'Child: 100', age <= 60 prints 'Adult: 250', and age > 60 prints 'Senior: 150'.",
        "requirements": [
            "Use if-elif-else branches.",
            "Print the exact formatted price string.",
        ],
        "sampleOutput": "Adult: 250",
        "starterCode": "age = 22\n\n# Print ticket pricing\n",
        "hint": "Check `if age < 12:`, `elif age <= 60:`, `else:`.",
        "solutionCode": "age = 22\n\nif age < 12:\n    print('Child: 100')\nelif age <= 60:\n    print('Adult: 250')\nelse:\n    print('Senior: 150')",
        "explanation": "Conditional tier boundaries map demographic attributes to corresponding pricing categories.",
        "validator": {
            "variable": "age",
            "mustInclude": "elif ",
            "cases": [
                {"value": 8, "expected": "Child: 100"},
                {"value": 12, "expected": "Adult: 250"},
                {"value": 22, "expected": "Adult: 250"},
                {"value": 60, "expected": "Adult: 250"},
                {"value": 65, "expected": "Senior: 150"},
            ]
        }
    },
    {
        "id": "ch-c15",
        "topic": "conditionals",
        "title": "Student Grade with Distinction",
        "difficulty": "Beginner",
        "description": "Evaluate student grade for `marks = 85`: marks >= 90 prints 'Grade A+ (Distinction)', marks >= 75 prints 'Grade A', marks >= 60 prints 'Grade B', marks >= 40 prints 'Grade C', otherwise prints 'Grade F'.",
        "requirements": [
            "Use standard descending grading ladder.",
            "Print the exact grade string.",
        ],
        "sampleOutput": "Grade A",
        "starterCode": "marks = 85\n\n# Evaluate student grade\n",
        "hint": "Start with `if marks >= 90:` and descend down to else.",
        "solutionCode": "marks = 85\n\nif marks >= 90:\n    print('Grade A+ (Distinction)')\nelif marks >= 75:\n    print('Grade A')\nelif marks >= 60:\n    print('Grade B')\nelif marks >= 40:\n    print('Grade C')\nelse:\n    print('Grade F')",
        "explanation": "Descending threshold ladders ensure that higher distinction categories take precedence before broad passing criteria.",
        "validator": {
            "variable": "marks",
            "mustInclude": "elif ",
            "cases": [
                {"value": 95, "expected": "Grade A+ (Distinction)"},
                {"value": 85, "expected": "Grade A"},
                {"value": 68, "expected": "Grade B"},
                {"value": 50, "expected": "Grade C"},
                {"value": 30, "expected": "Grade F"},
            ]
        }
    },
    {
        "id": "ch-c16",
        "topic": "conditionals",
        "title": "FizzBuzz Single Branch",
        "difficulty": "Beginner",
        "description": "Given integer `n = 15`, print 'FizzBuzz' if n is divisible by both 3 and 5, print 'Fizz' if divisible by 3 only, print 'Buzz' if divisible by 5 only, or print n itself otherwise.",
        "requirements": [
            "Check divisibility by 15 first.",
            "Print 'FizzBuzz', 'Fizz', 'Buzz', or n.",
        ],
        "sampleOutput": "FizzBuzz",
        "starterCode": "n = 15\n\n# FizzBuzz decision\n",
        "hint": "Condition order matters: test `n % 15 == 0` first!",
        "solutionCode": "n = 15\n\nif n % 15 == 0:\n    print('FizzBuzz')\nelif n % 3 == 0:\n    print('Fizz')\nelif n % 5 == 0:\n    print('Buzz')\nelse:\n    print(n)",
        "explanation": "Because numbers divisible by 15 are also divisible by 3 and 5, checking the combined condition first prevents premature matching.",
        "validator": {
            "variable": "n",
            "mustInclude": "%",
            "cases": [
                {"value": 15, "expected": "FizzBuzz"},
                {"value": 9, "expected": "Fizz"},
                {"value": 10, "expected": "Buzz"},
                {"value": 7, "expected": "7"},
                {"value": 30, "expected": "FizzBuzz"},
            ]
        }
    },
    {
        "id": "ch-c17",
        "topic": "conditionals",
        "title": "Character Case & Digit Classifier",
        "difficulty": "Guided",
        "description": "Given a character variable `ch = 'k'`, classify it: if '0' <= ch <= '9' print 'Digit', elif 'A' <= ch <= 'Z' print 'Uppercase', elif 'a' <= ch <= 'z' print 'Lowercase', else print 'Special'.",
        "requirements": [
            "Use ASCII chained comparisons on character ch.",
            "Print 'Digit', 'Uppercase', 'Lowercase', or 'Special'.",
        ],
        "sampleOutput": "Lowercase",
        "starterCode": "ch = 'k'\n\n# Classify character\n",
        "hint": "Python strings compare via ASCII values, so `'a' <= ch <= 'z'` works directly.",
        "solutionCode": "ch = 'k'\n\nif '0' <= ch <= '9':\n    print('Digit')\nelif 'A' <= ch <= 'Z':\n    print('Uppercase')\nelif 'a' <= ch <= 'z':\n    print('Lowercase')\nelse:\n    print('Special')",
        "explanation": "Chained character comparisons leverage consecutive Unicode/ASCII code points for digits and alphabet ranges without regex.",
        "validator": {
            "variable": "ch",
            "mustInclude": "elif ",
            "cases": [
                {"value": "5", "expected": "Digit"},
                {"value": "G", "expected": "Uppercase"},
                {"value": "k", "expected": "Lowercase"},
                {"value": "#", "expected": "Special"},
                {"value": "0", "expected": "Digit"},
            ]
        }
    },
    {
        "id": "ch-c18",
        "topic": "conditionals",
        "title": "Century Year Detector",
        "difficulty": "Beginner",
        "description": "Given `year = 2000`, test whether it is a century year (ending in 00, meaning divisible by 100). Print 'Century Year' or 'Non-Century Year'.",
        "requirements": [
            "Check if year % 100 == 0.",
            "Print 'Century Year' or 'Non-Century Year'.",
        ],
        "sampleOutput": "Century Year",
        "starterCode": "year = 2000\n\n# Check if year is a century year\n",
        "hint": "Use the modulo operator: `if year % 100 == 0:`.",
        "solutionCode": "year = 2000\n\nif year % 100 == 0:\n    print('Century Year')\nelse:\n    print('Non-Century Year')",
        "explanation": "Any year ending in two zeros has an exact integer quotient when divided by 100, leaving a remainder of 0.",
        "validator": {
            "variable": "year",
            "mustInclude": "100",
            "cases": [
                {"value": 2000, "expected": "Century Year"},
                {"value": 1900, "expected": "Century Year"},
                {"value": 2024, "expected": "Non-Century Year"},
                {"value": 1800, "expected": "Century Year"},
                {"value": 2021, "expected": "Non-Century Year"},
            ]
        }
    },
    {
        "id": "ch-c19",
        "topic": "conditionals",
        "title": "Traffic Speed Radar Fine",
        "difficulty": "Guided",
        "description": "Given `speed = 85` and `limit = 60`, calculate traffic penalty: if speed <= limit print 'No Fine', elif speed <= limit + 20 print 'Fine: 500', else print 'Fine: 2000'.",
        "requirements": [
            "Compare speed against limit thresholds.",
            "Print 'No Fine', 'Fine: 500', or 'Fine: 2000'.",
        ],
        "sampleOutput": "Fine: 2000",
        "starterCode": "speed = 85\nlimit = 60\n\n# Calculate speed penalty\n",
        "hint": "Check `if speed <= limit:`, `elif speed <= limit + 20:`, `else:`.",
        "solutionCode": "speed = 85\nlimit = 60\n\nif speed <= limit:\n    print('No Fine')\nelif speed <= limit + 20:\n    print('Fine: 500')\nelse:\n    print('Fine: 2000')",
        "explanation": "Dynamic speed limits adjust thresholds relative to zone rules, applying tiered monetary deterrents for severe violations.",
        "validator": {
            "variable": ["speed", "limit"],
            "mustInclude": "elif ",
            "cases": [
                {"value": [55, 60], "expected": "No Fine"},
                {"value": [60, 60], "expected": "No Fine"},
                {"value": [75, 60], "expected": "Fine: 500"},
                {"value": [85, 60], "expected": "Fine: 2000"},
                {"value": [110, 60], "expected": "Fine: 2000"},
            ]
        }
    },
    {
        "id": "ch-c20",
        "topic": "conditionals",
        "title": "ATM Cash Withdrawal Check",
        "difficulty": "Guided",
        "description": "Given withdrawal request `amount = 500` and account `balance = 2000`: if amount % 100 != 0 print 'Invalid Multiple of 100', elif amount > balance print 'Insufficient Balance', else print 'Withdrawal Approved'.",
        "requirements": [
            "Validate ATM dispenser denomination compatibility first.",
            "Validate available balance.",
            "Print the exact outcome message.",
        ],
        "sampleOutput": "Withdrawal Approved",
        "starterCode": "amount = 500\nbalance = 2000\n\n# Validate withdrawal\n",
        "hint": "Check `if amount % 100 != 0:`, `elif amount > balance:`, `else:`.",
        "solutionCode": "amount = 500\nbalance = 2000\n\nif amount % 100 != 0:\n    print('Invalid Multiple of 100')\nelif amount > balance:\n    print('Insufficient Balance')\nelse:\n    print('Withdrawal Approved')",
        "explanation": "Hardware cash dispenser constraints are validated before querying banking balances to prevent invalid transactional locks.",
        "validator": {
            "variable": ["amount", "balance"],
            "mustInclude": "elif ",
            "cases": [
                {"value": [500, 2000], "expected": "Withdrawal Approved"},
                {"value": [250, 2000], "expected": "Invalid Multiple of 100"},
                {"value": [3000, 2000], "expected": "Insufficient Balance"},
                {"value": [2000, 2000], "expected": "Withdrawal Approved"},
                {"value": [100, 100], "expected": "Withdrawal Approved"},
            ]
        }
    },
    {
        "id": "ch-c21",
        "topic": "conditionals",
        "title": "BMI Category Analyzer",
        "difficulty": "Guided",
        "description": "Given `bmi = 22.5`, classify health status: bmi < 18.5 prints 'Underweight', bmi < 25.0 prints 'Normal Weight', bmi < 30.0 prints 'Overweight', else prints 'Obese'.",
        "requirements": [
            "Use if-elif-else with float thresholds.",
            "Print the exact classification string.",
        ],
        "sampleOutput": "Normal Weight",
        "starterCode": "bmi = 22.5\n\n# Classify BMI\n",
        "hint": "Check in ascending order: `if bmi < 18.5:`, `elif bmi < 25.0:`, etc.",
        "solutionCode": "bmi = 22.5\n\nif bmi < 18.5:\n    print('Underweight')\nelif bmi < 25.0:\n    print('Normal Weight')\nelif bmi < 30.0:\n    print('Overweight')\nelse:\n    print('Obese')",
        "explanation": "WHO body mass index ranges are categorized in strict ascending order, automatically bounding each subsequent bracket.",
        "validator": {
            "variable": "bmi",
            "mustInclude": "elif ",
            "cases": [
                {"value": 17.2, "expected": "Underweight"},
                {"value": 18.5, "expected": "Normal Weight"},
                {"value": 22.5, "expected": "Normal Weight"},
                {"value": 27.8, "expected": "Overweight"},
                {"value": 33.1, "expected": "Obese"},
            ]
        }
    },
    {
        "id": "ch-c22",
        "topic": "conditionals",
        "title": "Profit, Loss, or Break-Even",
        "difficulty": "Beginner",
        "description": "Given `cost = 100` and `sell = 120`: if sell > cost print f'Profit: {sell - cost}', elif sell < cost print f'Loss: {cost - sell}', else print 'Break Even'.",
        "requirements": [
            "Compare selling price and cost price.",
            "Print the profit/loss difference or 'Break Even'.",
        ],
        "sampleOutput": "Profit: 20",
        "starterCode": "cost = 100\nsell = 120\n\n# Evaluate transaction\n",
        "hint": "Use f-strings: `print(f'Profit: {sell - cost}')`.",
        "solutionCode": "cost = 100\nsell = 120\n\nif sell > cost:\n    print(f'Profit: {sell - cost}')\nelif sell < cost:\n    print(f'Loss: {cost - sell}')\nelse:\n    print('Break Even')",
        "explanation": "Comparing selling price against acquisition cost cleanly divides commercial outcomes into positive delta, negative delta, or zero delta.",
        "validator": {
            "variable": ["cost", "sell"],
            "mustInclude": "elif ",
            "cases": [
                {"value": [100, 120], "expected": "Profit: 20"},
                {"value": [100, 80], "expected": "Loss: 20"},
                {"value": [100, 100], "expected": "Break Even"},
                {"value": [50, 150], "expected": "Profit: 100"},
                {"value": [200, 180], "expected": "Loss: 20"},
            ]
        }
    },
    {
        "id": "ch-c23",
        "topic": "conditionals",
        "title": "Engineering Admission Cutoff",
        "difficulty": "Applied",
        "description": "Given marks `math = 70`, `phy = 65`, and `chem = 60`, check admission eligibility: student must score math >= 60, phy >= 55, chem >= 50, AND total marks >= 180. Print 'Eligible' or 'Not Eligible'.",
        "requirements": [
            "Combine individual subject cutoffs with total aggregate requirement.",
            "Print 'Eligible' or 'Not Eligible'.",
        ],
        "sampleOutput": "Eligible",
        "starterCode": "math = 70\nphy = 65\nchem = 60\n\n# Check admission eligibility\n",
        "hint": "Condition: `math >= 60 and phy >= 55 and chem >= 50 and (math + phy + chem) >= 180`.",
        "solutionCode": "math = 70\nphy = 65\nchem = 60\n\ntotal = math + phy + chem\nif math >= 60 and phy >= 55 and chem >= 50 and total >= 180:\n    print('Eligible')\nelse:\n    print('Not Eligible')",
        "explanation": "Composite admissions criteria combine sectional minimums to verify baseline competency alongside an aggregate threshold for overall excellence.",
        "validator": {
            "variable": ["math", "phy", "chem"],
            "mustInclude": "and",
            "cases": [
                {"value": [70, 65, 60], "expected": "Eligible"},
                {"value": [55, 70, 70], "expected": "Not Eligible"},
                {"value": [80, 50, 80], "expected": "Not Eligible"},
                {"value": [90, 80, 70], "expected": "Eligible"},
                {"value": [60, 55, 50], "expected": "Not Eligible"},
            ]
        }
    },
    {
        "id": "ch-c24",
        "topic": "conditionals",
        "title": "Angle Geometry Classification",
        "difficulty": "Beginner",
        "description": "Given `angle = 90` (degrees): if angle < 90 print 'Acute Angle', elif angle == 90 print 'Right Angle', elif angle < 180 print 'Obtuse Angle', elif angle == 180 print 'Straight Angle', else print 'Reflex Angle'.",
        "requirements": [
            "Use if-elif-else to classify geometric angle types.",
            "Print the exact angle description.",
        ],
        "sampleOutput": "Right Angle",
        "starterCode": "angle = 90\n\n# Classify angle\n",
        "hint": "Check in increasing order: `< 90`, `== 90`, `< 180`, `== 180`, `else`.",
        "solutionCode": "angle = 90\n\nif angle < 90:\n    print('Acute Angle')\nelif angle == 90:\n    print('Right Angle')\nelif angle < 180:\n    print('Obtuse Angle')\nelif angle == 180:\n    print('Straight Angle')\nelse:\n    print('Reflex Angle')",
        "explanation": "Geometric angle nomenclature partitions angular measurements between 0 and 360 degrees into distinct named sectors.",
        "validator": {
            "variable": "angle",
            "mustInclude": "elif ",
            "cases": [
                {"value": 45, "expected": "Acute Angle"},
                {"value": 90, "expected": "Right Angle"},
                {"value": 120, "expected": "Obtuse Angle"},
                {"value": 180, "expected": "Straight Angle"},
                {"value": 210, "expected": "Reflex Angle"},
            ]
        }
    },
    {
        "id": "ch-c25",
        "topic": "conditionals",
        "title": "Days in Month (Standard Year)",
        "difficulty": "Beginner",
        "description": "Given `month = 4` (1 for January to 12 for December), determine the number of days in a standard non-leap year. Print 31, 30, or 28.",
        "requirements": [
            "Check for months with 31, 30, or 28 days.",
            "Print the day count.",
        ],
        "sampleOutput": "30",
        "starterCode": "month = 4\n\n# Output days in month\n",
        "hint": "Months 4, 6, 9, 11 have 30 days. Month 2 has 28 days. All others have 31 days.",
        "solutionCode": "month = 4\n\nif month == 2:\n    print(28)\nelif month == 4 or month == 6 or month == 9 or month == 11:\n    print(30)\nelse:\n    print(31)",
        "explanation": "Grouping calendar months into 28-day (February), 30-day (Apr/Jun/Sep/Nov), and 31-day sets structures the lookup cleanly.",
        "validator": {
            "variable": "month",
            "mustInclude": "elif ",
            "cases": [
                {"value": 1, "expected": "31"},
                {"value": 2, "expected": "28"},
                {"value": 4, "expected": "30"},
                {"value": 7, "expected": "31"},
                {"value": 11, "expected": "30"},
            ]
        }
    },
    {
        "id": "ch-c26",
        "topic": "conditionals",
        "title": "Shopping Cart Tier Discount",
        "difficulty": "Guided",
        "description": "Given `cart_total = 1200`, compute payable amount: cart_total >= 2000 gets 20% discount, cart_total >= 1000 gets 10% discount, otherwise 0% discount. Print the final payable amount as an integer.",
        "requirements": [
            "Calculate tiered percentage discounts.",
            "Print final integer amount.",
        ],
        "sampleOutput": "1080",
        "starterCode": "cart_total = 1200\n\n# Compute final discounted amount\n",
        "hint": "Use `int(cart_total * 0.80)` for 20% discount and `int(cart_total * 0.90)` for 10% discount.",
        "solutionCode": "cart_total = 1200\n\nif cart_total >= 2000:\n    payable = int(cart_total * 0.80)\nelif cart_total >= 1000:\n    payable = int(cart_total * 0.90)\nelse:\n    payable = cart_total\nprint(payable)",
        "explanation": "Checking the highest qualifying threshold first ensures high-value baskets receive their full entitled discount rate.",
        "validator": {
            "variable": "cart_total",
            "mustInclude": "elif ",
            "cases": [
                {"value": 500, "expected": "500"},
                {"value": 1000, "expected": "900"},
                {"value": 1200, "expected": "1080"},
                {"value": 2000, "expected": "1600"},
                {"value": 2500, "expected": "2000"},
            ]
        }
    },
    {
        "id": "ch-c27",
        "topic": "conditionals",
        "title": "Rock Paper Scissors Arbiter",
        "difficulty": "Guided",
        "description": "Given `p1 = 'rock'` and `p2 = 'scissors'`, decide the match outcome: print 'Tie' if choices match, 'Player 1 Wins' if p1 beats p2, or 'Player 2 Wins' otherwise.",
        "requirements": [
            "Winning pairs for Player 1: (rock, scissors), (scissors, paper), (paper, rock).",
            "Print 'Tie', 'Player 1 Wins', or 'Player 2 Wins'.",
        ],
        "sampleOutput": "Player 1 Wins",
        "starterCode": "p1 = 'rock'\np2 = 'scissors'\n\n# Determine game outcome\n",
        "hint": "Check equality for 'Tie', then check Player 1's three winning permutations.",
        "solutionCode": "p1 = 'rock'\np2 = 'scissors'\n\nif p1 == p2:\n    print('Tie')\nelif (p1 == 'rock' and p2 == 'scissors') or (p1 == 'scissors' and p2 == 'paper') or (p1 == 'paper' and p2 == 'rock'):\n    print('Player 1 Wins')\nelse:\n    print('Player 2 Wins')",
        "explanation": "Game arbiter logic simplifies by handling the symmetric tie condition first, then enumerating all winning states for Player 1.",
        "validator": {
            "variable": ["p1", "p2"],
            "mustInclude": "elif ",
            "cases": [
                {"value": ["rock", "scissors"], "expected": "Player 1 Wins"},
                {"value": ["scissors", "rock"], "expected": "Player 2 Wins"},
                {"value": ["paper", "paper"], "expected": "Tie"},
                {"value": ["rock", "paper"], "expected": "Player 2 Wins"},
                {"value": ["scissors", "paper"], "expected": "Player 1 Wins"},
            ]
        }
    },
    {
        "id": "ch-c28",
        "topic": "conditionals",
        "title": "Divisibility Relationship",
        "difficulty": "Beginner",
        "description": "Given `a = 36` and `b = 6`, check if a is an exact multiple of b. If a % b == 0 print f'{a} is a multiple of {b}', otherwise print f'{a} is not a multiple of {b}'.",
        "requirements": [
            "Use modulo operator %.",
            "Print the formatted relationship string.",
        ],
        "sampleOutput": "36 is a multiple of 6",
        "starterCode": "a = 36\nb = 6\n\n# Test divisibility\n",
        "hint": "Use `if a % b == 0:` with f-string output.",
        "solutionCode": "a = 36\nb = 6\n\nif a % b == 0:\n    print(f'{a} is a multiple of {b}')\nelse:\n    print(f'{a} is not a multiple of {b}')",
        "explanation": "A non-zero remainder from % directly disproves divisibility; remainder 0 proves a is an integer multiple of b.",
        "validator": {
            "variable": ["a", "b"],
            "mustInclude": "%",
            "cases": [
                {"value": [36, 6], "expected": "36 is a multiple of 6"},
                {"value": [35, 6], "expected": "35 is not a multiple of 6"},
                {"value": [100, 25], "expected": "100 is a multiple of 25"},
                {"value": [7, 3], "expected": "7 is not a multiple of 3"},
                {"value": [12, 12], "expected": "12 is a multiple of 12"},
            ]
        }
    },
    {
        "id": "ch-c29",
        "topic": "conditionals",
        "title": "24-Hour to 12-Hour Converter",
        "difficulty": "Guided",
        "description": "Given military hour `hour = 17` (0 to 23): convert to 12-hour AM/PM format. Hour 0 is '12 AM', 1 to 11 is '{hour} AM', 12 is '12 PM', and 13 to 23 is '{hour - 12} PM'.",
        "requirements": [
            "Handle midnight (0) and noon (12) boundary cases correctly.",
            "Print the converted time string.",
        ],
        "sampleOutput": "5 PM",
        "starterCode": "hour = 17\n\n# Convert 24-hour time to 12-hour format\n",
        "hint": "Check `if hour == 0:`, `elif hour < 12:`, `elif hour == 12:`, `else:`.",
        "solutionCode": "hour = 17\n\nif hour == 0:\n    print('12 AM')\nelif hour < 12:\n    print(f'{hour} AM')\nelif hour == 12:\n    print('12 PM')\nelse:\n    print(f'{hour - 12} PM')",
        "explanation": "Special handling for zero (midnight) and twelve (noon) properly accounts for non-zero 12-hour cycle offsets.",
        "validator": {
            "variable": "hour",
            "mustInclude": "elif ",
            "cases": [
                {"value": 0, "expected": "12 AM"},
                {"value": 9, "expected": "9 AM"},
                {"value": 12, "expected": "12 PM"},
                {"value": 17, "expected": "5 PM"},
                {"value": 23, "expected": "11 PM"},
            ]
        }
    },
    {
        "id": "ch-c30",
        "topic": "conditionals",
        "title": "Water State by Temperature",
        "difficulty": "Beginner",
        "description": "Given water temperature `temp = 25` (Celsius): if temp <= 0 print 'Solid (Ice)', elif temp >= 100 print 'Gas (Steam)', else print 'Liquid (Water)'.",
        "requirements": [
            "Check freezing (<=0) and boiling (>=100) phase transitions.",
            "Print the exact state string.",
        ],
        "sampleOutput": "Liquid (Water)",
        "starterCode": "temp = 25\n\n# Output state of water\n",
        "hint": "Check `if temp <= 0:`, `elif temp >= 100:`, `else:`.",
        "solutionCode": "temp = 25\n\nif temp <= 0:\n    print('Solid (Ice)')\nelif temp >= 100:\n    print('Gas (Steam)')\nelse:\n    print('Liquid (Water)')",
        "explanation": "Physical phase change boundaries at 0°C and 100°C partition standard pressure thermodynamic states.",
        "validator": {
            "variable": "temp",
            "mustInclude": "elif ",
            "cases": [
                {"value": -5, "expected": "Solid (Ice)"},
                {"value": 0, "expected": "Solid (Ice)"},
                {"value": 25, "expected": "Liquid (Water)"},
                {"value": 100, "expected": "Gas (Steam)"},
                {"value": 120, "expected": "Gas (Steam)"},
            ]
        }
    },
]
