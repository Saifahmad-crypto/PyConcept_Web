# scripts/challenges_loops.py
# 30 Loops Coding Challenges: ch-l1 to ch-l30

LOOPS_CHALLENGES = [
    {
        "id": "ch-l1",
        "topic": "loops",
        "title": "Print 1 to N",
        "difficulty": "Beginner",
        "description": "Given `n = 5`, use a for loop with `range()` to print numbers from 1 up to n inclusive, each on a new line.",
        "requirements": [
            "Use a for loop with range(1, n + 1).",
            "Print each number on its own line.",
        ],
        "sampleOutput": "1\n2\n3\n4\n5",
        "starterCode": "n = 5\n\n# Print numbers from 1 to n\n",
        "hint": "Remember that range(start, stop) excludes stop, so use `range(1, n + 1)`.",
        "solutionCode": "n = 5\n\nfor i in range(1, n + 1):\n    print(i)",
        "explanation": "range(1, n + 1) generates integers starting from 1 up through n, because the upper bound is exclusive.",
        "validator": {
            "variable": "n",
            "mustInclude": "range",
            "cases": [
                {"value": 5, "expected": "1\n2\n3\n4\n5"},
                {"value": 3, "expected": "1\n2\n3"},
                {"value": 1, "expected": "1"},
                {"value": 7, "expected": "1\n2\n3\n4\n5\n6\n7"},
                {"value": 10, "expected": "1\n2\n3\n4\n5\n6\n7\n8\n9\n10"},
            ]
        }
    },
    {
        "id": "ch-l2",
        "topic": "loops",
        "title": "Sum of First N Numbers",
        "difficulty": "Beginner",
        "description": "Given `n = 10`, compute and print the sum of all integers from 1 up to n inclusive using a loop.",
        "requirements": [
            "Initialize an accumulator variable `total = 0`.",
            "Use a loop to add each number to total.",
            "Print only the final sum.",
        ],
        "sampleOutput": "55",
        "starterCode": "n = 10\ntotal = 0\n\n# Calculate sum of 1 to n\n",
        "hint": "Loop over `range(1, n + 1)` and add `total += i` on each step.",
        "solutionCode": "n = 10\ntotal = 0\n\nfor i in range(1, n + 1):\n    total += i\nprint(total)",
        "explanation": "An accumulator variable maintains running state across loop iterations to compute the mathematical series sum n(n+1)/2.",
        "validator": {
            "variable": "n",
            "mustInclude": "+=",
            "cases": [
                {"value": 10, "expected": "55"},
                {"value": 5, "expected": "15"},
                {"value": 1, "expected": "1"},
                {"value": 0, "expected": "0"},
                {"value": 20, "expected": "210"},
            ]
        }
    },
    {
        "id": "ch-l3",
        "topic": "loops",
        "title": "Multiplication Table",
        "difficulty": "Guided",
        "description": "Given `n = 4`, print its multiplication table from 1 to 5 in the format: `4 x 1 = 4` through `4 x 5 = 20`.",
        "requirements": [
            "Iterate multiplier from 1 to 5.",
            "Format each line as f'{n} x {i} = {n * i}'.",
        ],
        "sampleOutput": "4 x 1 = 4\n4 x 2 = 8\n4 x 3 = 12\n4 x 4 = 16\n4 x 5 = 20",
        "starterCode": "n = 4\n\n# Print multiplication table for 1 to 5\n",
        "hint": "Loop `for i in range(1, 6):` and use an f-string inside print().",
        "solutionCode": "n = 4\n\nfor i in range(1, 6):\n    print(f'{n} x {i} = {n * i}')",
        "explanation": "f-strings evaluate mathematical products dynamically on each step while printing standardized mathematical table formatting.",
        "validator": {
            "variable": "n",
            "mustInclude": "range",
            "cases": [
                {"value": 4, "expected": "4 x 1 = 4\n4 x 2 = 8\n4 x 3 = 12\n4 x 4 = 16\n4 x 5 = 20"},
                {"value": 7, "expected": "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35"},
                {"value": 2, "expected": "2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10"},
                {"value": 9, "expected": "9 x 1 = 9\n9 x 2 = 18\n9 x 3 = 27\n9 x 4 = 36\n9 x 5 = 45"},
                {"value": 12, "expected": "12 x 1 = 12\n12 x 2 = 24\n12 x 3 = 36\n12 x 4 = 48\n12 x 5 = 60"},
            ]
        }
    },
    {
        "id": "ch-l4",
        "topic": "loops",
        "title": "Countdown Timer with Blast Off",
        "difficulty": "Beginner",
        "description": "Given countdown value `start = 5`, count down from start to 1 using a while loop, then print 'Blast Off!' on the final line.",
        "requirements": [
            "Use a while loop with a decreasing counter (`start -= 1`).",
            "Print 'Blast Off!' after the loop finishes.",
        ],
        "sampleOutput": "5\n4\n3\n2\n1\nBlast Off!",
        "starterCode": "start = 5\n\n# Write countdown while loop\n",
        "hint": "Loop `while start > 0:` and decrement inside the loop.",
        "solutionCode": "start = 5\n\nwhile start > 0:\n    print(start)\n    start -= 1\nprint('Blast Off!')",
        "explanation": "While loops driven by monotonic decrement terminate safely as soon as the boundary condition start > 0 is violated.",
        "validator": {
            "variable": "start",
            "mustInclude": "while ",
            "cases": [
                {"value": 5, "expected": "5\n4\n3\n2\n1\nBlast Off!"},
                {"value": 3, "expected": "3\n2\n1\nBlast Off!"},
                {"value": 1, "expected": "1\nBlast Off!"},
                {"value": 4, "expected": "4\n3\n2\n1\nBlast Off!"},
                {"value": 6, "expected": "6\n5\n4\n3\n2\n1\nBlast Off!"},
            ]
        }
    },
    {
        "id": "ch-l5",
        "topic": "loops",
        "title": "Count Multiples of 3 or 5",
        "difficulty": "Applied",
        "description": "Given `limit = 20`, count how many numbers from 1 to limit inclusive are multiples of 3 OR 5. Print only the total count.",
        "requirements": [
            "Loop from 1 to limit inclusive.",
            "Test condition: `i % 3 == 0 or i % 5 == 0`.",
            "Print the final count.",
        ],
        "sampleOutput": "9",
        "starterCode": "limit = 20\ncount = 0\n\n# Count multiples of 3 or 5\n",
        "hint": "Increment count whenever `i % 3 == 0 or i % 5 == 0` is True.",
        "solutionCode": "limit = 20\ncount = 0\n\nfor i in range(1, limit + 1):\n    if i % 3 == 0 or i % 5 == 0:\n        count += 1\nprint(count)",
        "explanation": "Iterating numbers and checking divisibility disjunction models the inclusion-exclusion principle over the sequence.",
        "validator": {
            "variable": "limit",
            "mustInclude": "range",
            "cases": [
                {"value": 20, "expected": "9"},
                {"value": 15, "expected": "7"},
                {"value": 10, "expected": "5"},
                {"value": 30, "expected": "14"},
                {"value": 5, "expected": "2"},
            ]
        }
    },
    {
        "id": "ch-l6",
        "topic": "loops",
        "title": "Factorial Calculator",
        "difficulty": "Beginner",
        "description": "Given integer `n = 5`, compute $n! = 1 \\times 2 \\times \\dots \\times n$ using a loop. Note that 0! = 1. Print the factorial result.",
        "requirements": [
            "Initialize product accumulator `fact = 1`.",
            "Multiply loop variable into fact.",
            "Print the final result.",
        ],
        "sampleOutput": "120",
        "starterCode": "n = 5\nfact = 1\n\n# Compute factorial of n\n",
        "hint": "Loop `for i in range(1, n + 1): fact *= i`.",
        "solutionCode": "n = 5\nfact = 1\n\nfor i in range(1, n + 1):\n    fact *= i\nprint(fact)",
        "explanation": "Initializing product accumulator to 1 guarantees that both 0! and 1! return 1 while correctly computing consecutive multiplications.",
        "validator": {
            "variable": "n",
            "mustInclude": "*=",
            "cases": [
                {"value": 5, "expected": "120"},
                {"value": 0, "expected": "1"},
                {"value": 1, "expected": "1"},
                {"value": 4, "expected": "24"},
                {"value": 6, "expected": "720"},
            ]
        }
    },
    {
        "id": "ch-l7",
        "topic": "loops",
        "title": "Count Digits of a Number",
        "difficulty": "Beginner",
        "description": "Given a positive integer `n = 4521`, count how many decimal digits it has using a mathematical while loop with floor division (`n //= 10`). Print the digit count.",
        "requirements": [
            "Use a while loop dividing n by 10 repeatedly.",
            "Count iterations until n reaches 0.",
            "Print total count.",
        ],
        "sampleOutput": "4",
        "starterCode": "n = 4521\ncount = 0\n\n# Count digits of n\n",
        "hint": "Loop `while n > 0:` and do `n //= 10; count += 1`.",
        "solutionCode": "n = 4521\ncount = 0\n\nwhile n > 0:\n    count += 1\n    n //= 10\nprint(count)",
        "explanation": "Floor division by 10 truncates the least significant decimal digit on each iteration until the number reduces to 0.",
        "validator": {
            "variable": "n",
            "mustInclude": "while ",
            "cases": [
                {"value": 4521, "expected": "4"},
                {"value": 7, "expected": "1"},
                {"value": 10000, "expected": "5"},
                {"value": 987654, "expected": "6"},
                {"value": 88, "expected": "2"},
            ]
        }
    },
    {
        "id": "ch-l8",
        "topic": "loops",
        "title": "Sum of Digits",
        "difficulty": "Beginner",
        "description": "Given integer `n = 385`, compute the sum of its decimal digits ($3 + 8 + 5 = 16$) using a while loop with modulo `% 10` and integer division `// 10`. Print the sum.",
        "requirements": [
            "Extract last digit via `n % 10`.",
            "Discard last digit via `n //= 10`.",
            "Print total digit sum.",
        ],
        "sampleOutput": "16",
        "starterCode": "n = 385\ntotal = 0\n\n# Calculate sum of digits\n",
        "hint": "Loop `while n > 0: total += n % 10; n //= 10`.",
        "solutionCode": "n = 385\ntotal = 0\n\nwhile n > 0:\n    total += n % 10\n    n //= 10\nprint(total)",
        "explanation": "Modulo 10 peels off units digits for arithmetic summation while integer division by 10 advances digit significance.",
        "validator": {
            "variable": "n",
            "mustInclude": "%",
            "cases": [
                {"value": 385, "expected": "16"},
                {"value": 123, "expected": "6"},
                {"value": 9, "expected": "9"},
                {"value": 1002, "expected": "3"},
                {"value": 9999, "expected": "36"},
            ]
        }
    },
    {
        "id": "ch-l9",
        "topic": "loops",
        "title": "Reverse an Integer",
        "difficulty": "Guided",
        "description": "Given positive integer `n = 1234`, reverse its decimal digits mathematically ($1234 \\rightarrow 4321$) using a while loop. Print the reversed number.",
        "requirements": [
            "Construct reversed number via `rev = rev * 10 + n % 10`.",
            "Do not convert to string; use pure arithmetic.",
            "Print the final reversed integer.",
        ],
        "sampleOutput": "4321",
        "starterCode": "n = 1234\nrev = 0\n\n# Mathematically reverse n\n",
        "hint": "Shift accumulator left by multiplying by 10, then add remainder: `rev = rev * 10 + n % 10`.",
        "solutionCode": "n = 1234\nrev = 0\n\nwhile n > 0:\n    rev = rev * 10 + n % 10\n    n //= 10\nprint(rev)",
        "explanation": "Multiplying the running reverse by 10 shifts previous digits one decimal place higher, appending the current least significant digit.",
        "validator": {
            "variable": "n",
            "mustInclude": "while ",
            "cases": [
                {"value": 1234, "expected": "4321"},
                {"value": 508, "expected": "805"},
                {"value": 9, "expected": "9"},
                {"value": 120, "expected": "21"},
                {"value": 7731, "expected": "1377"},
            ]
        }
    },
    {
        "id": "ch-l10",
        "topic": "loops",
        "title": "Palindrome Number Checker",
        "difficulty": "Guided",
        "description": "Given integer `n = 1221`, check whether it reads identically backwards and forwards. Print 'Palindrome' or 'Not Palindrome'.",
        "requirements": [
            "Save original value to a separate variable (`orig = n`).",
            "Reverse n using a while loop.",
            "Print 'Palindrome' or 'Not Palindrome'.",
        ],
        "sampleOutput": "Palindrome",
        "starterCode": "n = 1221\norig = n\nrev = 0\n\n# Check if n is a palindrome\n",
        "hint": "After reversing n in rev, check `if rev == orig:`.",
        "solutionCode": "n = 1221\norig = n\nrev = 0\n\nwhile n > 0:\n    rev = rev * 10 + n % 10\n    n //= 10\n\nif rev == orig:\n    print('Palindrome')\nelse:\n    print('Not Palindrome')",
        "explanation": "Comparing the mathematically reconstructed reverse against preserved original variable tests numerical palindromic symmetry.",
        "validator": {
            "variable": "n",
            "mustInclude": "orig",
            "cases": [
                {"value": 1221, "expected": "Palindrome"},
                {"value": 123, "expected": "Not Palindrome"},
                {"value": 7, "expected": "Palindrome"},
                {"value": 1331, "expected": "Palindrome"},
                {"value": 12345, "expected": "Not Palindrome"},
            ]
        }
    },
    {
        "id": "ch-l11",
        "topic": "loops",
        "title": "Prime Number Verifier",
        "difficulty": "Guided",
        "description": "Given integer `n = 29`, test whether n is a prime number (an integer > 1 having no divisors other than 1 and itself). Print 'Prime' or 'Not Prime'.",
        "requirements": [
            "If n <= 1, it is not prime.",
            "Loop potential divisors from 2 to n - 1.",
            "Print 'Prime' or 'Not Prime'.",
        ],
        "sampleOutput": "Prime",
        "starterCode": "n = 29\n\n# Check if n is prime\n",
        "hint": "Use a boolean flag `is_prime = True`. If `n % i == 0`, set to False and break.",
        "solutionCode": "n = 29\n\nif n <= 1:\n    print('Not Prime')\nelse:\n    is_prime = True\n    for i in range(2, n):\n        if n % i == 0:\n            is_prime = False\n            break\n    if is_prime:\n        print('Prime')\n    else:\n        print('Not Prime')",
        "explanation": "Trial division checks if any integer between 2 and n-1 divides n without remainder. Any divisor immediately disproves primality.",
        "validator": {
            "variable": "n",
            "mustInclude": "range",
            "cases": [
                {"value": 29, "expected": "Prime"},
                {"value": 15, "expected": "Not Prime"},
                {"value": 2, "expected": "Prime"},
                {"value": 1, "expected": "Not Prime"},
                {"value": 49, "expected": "Not Prime"},
            ]
        }
    },
    {
        "id": "ch-l12",
        "topic": "loops",
        "title": "Fibonacci N-th Term",
        "difficulty": "Guided",
        "description": "Given `n = 7`, compute and print the n-th Fibonacci number where the sequence starts: 1st=0, 2nd=1, 3rd=1, 4th=2, 5th=3, 6th=5, 7th=8.",
        "requirements": [
            "Use loop with variables to compute terms.",
            "Iterate n - 1 times.",
            "Print the n-th term value.",
        ],
        "sampleOutput": "8",
        "starterCode": "n = 7\n\n# Compute n-th Fibonacci term\n",
        "hint": "Initialize `a = 0` and `b = 1`. In the loop, use `nxt = a + b; a = b; b = nxt`.",
        "solutionCode": "n = 7\n\na = 0\nb = 1\nfor i in range(n - 1):\n    nxt = a + b\n    a = b\n    b = nxt\nprint(a)",
        "explanation": "Iterative state transition computes sequential Fibonacci numbers in O(N) time using constant auxiliary space.",
        "validator": {
            "variable": "n",
            "mustInclude": "range",
            "cases": [
                {"value": 1, "expected": "0"},
                {"value": 2, "expected": "1"},
                {"value": 5, "expected": "3"},
                {"value": 7, "expected": "8"},
                {"value": 10, "expected": "34"},
            ]
        }
    },
    {
        "id": "ch-l13",
        "topic": "loops",
        "title": "GCD / HCF of Two Numbers",
        "difficulty": "Guided",
        "description": "Given integers `a = 36` and `b = 60`, calculate their Greatest Common Divisor (GCD) using the Euclidean algorithm with a while loop. Print the GCD.",
        "requirements": [
            "While b != 0: replace a with b, and b with remainder.",
            "Print the final value of a.",
        ],
        "sampleOutput": "12",
        "starterCode": "a = 36\nb = 60\n\n# Calculate GCD using Euclidean algorithm\n",
        "hint": "Use `while b != 0: rem = a % b; a = b; b = rem`.",
        "solutionCode": "a = 36\nb = 60\n\nwhile b != 0:\n    rem = a % b\n    a = b\n    b = rem\nprint(a)",
        "explanation": "Euclid's algorithm relies on the theorem gcd(a, b) = gcd(b, a mod b), rapidly converging when remainder reaches 0.",
        "validator": {
            "variable": ["a", "b"],
            "mustInclude": "while ",
            "cases": [
                {"value": [36, 60], "expected": "12"},
                {"value": [17, 13], "expected": "1"},
                {"value": [10, 5], "expected": "5"},
                {"value": [48, 18], "expected": "6"},
                {"value": [100, 25], "expected": "25"},
            ]
        }
    },
    {
        "id": "ch-l14",
        "topic": "loops",
        "title": "LCM of Two Numbers",
        "difficulty": "Guided",
        "description": "Given positive integers `a = 12` and `b = 15`, calculate their Least Common Multiple (LCM) using the mathematical formula: $\\text{LCM}(a, b) = \\frac{a \\times b}{\\text{GCD}(a, b)}$. Print the LCM.",
        "requirements": [
            "Compute GCD first using a while loop.",
            "Calculate LCM using integer division `//`.",
            "Print the LCM.",
        ],
        "sampleOutput": "60",
        "starterCode": "a = 12\nb = 15\n\n# Calculate LCM\n",
        "hint": "Save product `prod = a * b`, find gcd via while loop, then `lcm = prod // gcd`.",
        "solutionCode": "a = 12\nb = 15\n\nprod = a * b\nx = a\ny = b\nwhile y != 0:\n    rem = x % y\n    x = y\n    y = rem\ngcd = x\nlcm = prod // gcd\nprint(lcm)",
        "explanation": "The fundamental theorem of arithmetic guarantees that the product of two positive integers equals the product of their GCD and LCM.",
        "validator": {
            "variable": ["a", "b"],
            "mustInclude": "//",
            "cases": [
                {"value": [12, 15], "expected": "60"},
                {"value": [4, 6], "expected": "12"},
                {"value": [7, 5], "expected": "35"},
                {"value": [10, 20], "expected": "20"},
                {"value": [14, 21], "expected": "42"},
            ]
        }
    },
    {
        "id": "ch-l15",
        "topic": "loops",
        "title": "Armstrong Number Check (3-digit)",
        "difficulty": "Guided",
        "description": "Given integer `n = 153`, determine whether it is an Armstrong number (where the sum of cubes of its digits equals the number: $1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153$). Print 'Armstrong Number' or 'Not Armstrong'.",
        "requirements": [
            "Sum cubes of extracted digits (`(n % 10) ** 3`).",
            "Compare sum against original value.",
            "Print 'Armstrong Number' or 'Not Armstrong'.",
        ],
        "sampleOutput": "Armstrong Number",
        "starterCode": "n = 153\norig = n\ntotal = 0\n\n# Check if n is an Armstrong number\n",
        "hint": "While temp > 0: `digit = temp % 10; total += digit ** 3; temp //= 10`.",
        "solutionCode": "n = 153\norig = n\ntotal = 0\n\nwhile n > 0:\n    d = n % 10\n    total += d ** 3\n    n //= 10\n\nif total == orig:\n    print('Armstrong Number')\nelse:\n    print('Not Armstrong')",
        "explanation": "Armstrong/narcissistic numbers are integers equal to the sum of their digits raised to the power of their digit count.",
        "validator": {
            "variable": "n",
            "mustInclude": "orig",
            "cases": [
                {"value": 153, "expected": "Armstrong Number"},
                {"value": 370, "expected": "Armstrong Number"},
                {"value": 371, "expected": "Armstrong Number"},
                {"value": 100, "expected": "Not Armstrong"},
                {"value": 407, "expected": "Armstrong Number"},
            ]
        }
    },
    {
        "id": "ch-l16",
        "topic": "loops",
        "title": "Perfect Number Detector",
        "difficulty": "Guided",
        "description": "Given integer `n = 28`, check if n is a perfect number (a positive integer that equals the sum of its proper positive divisors, excluding itself: $1 + 2 + 4 + 7 + 14 = 28$). Print 'Perfect Number' or 'Not Perfect'.",
        "requirements": [
            "Sum divisors `i` where `n % i == 0` for `i` from 1 to n - 1.",
            "Compare sum against n.",
            "Print 'Perfect Number' or 'Not Perfect'.",
        ],
        "sampleOutput": "Perfect Number",
        "starterCode": "n = 28\n\n# Check if n is a perfect number\n",
        "hint": "Loop `for i in range(1, n): if n % i == 0: total += i`.",
        "solutionCode": "n = 28\n\ntotal = 0\nfor i in range(1, n):\n    if n % i == 0:\n        total += i\nif total == n:\n    print('Perfect Number')\nelse:\n    print('Not Perfect')",
        "explanation": "Perfect numbers represent complete aliquot harmony where the sum of all proper factors matches the number itself.",
        "validator": {
            "variable": "n",
            "mustInclude": "range",
            "cases": [
                {"value": 6, "expected": "Perfect Number"},
                {"value": 28, "expected": "Perfect Number"},
                {"value": 12, "expected": "Not Perfect"},
                {"value": 15, "expected": "Not Perfect"},
                {"value": 496, "expected": "Perfect Number"},
            ]
        }
    },
    {
        "id": "ch-l17",
        "topic": "loops",
        "title": "Collatz Sequence Step Counter",
        "difficulty": "Applied",
        "description": "Given `n = 6`, compute how many steps it takes to reach 1 following Collatz rules: if n is even, $n = n // 2$; if n is odd, $n = 3n + 1$. Print the total step count.",
        "requirements": [
            "Loop while n != 1.",
            "Update n based on even/odd condition and increment steps counter.",
            "Print total steps.",
        ],
        "sampleOutput": "8",
        "starterCode": "n = 6\nsteps = 0\n\n# Count Collatz steps to 1\n",
        "hint": "Use `while n != 1:` with if n % 2 == 0: n //= 2 else: n = 3*n + 1.",
        "solutionCode": "n = 6\nsteps = 0\n\nwhile n != 1:\n    if n % 2 == 0:\n        n //= 2\n    else:\n        n = 3 * n + 1\n    steps += 1\nprint(steps)",
        "explanation": "The Collatz 3n+1 conjecture produces a deterministic dynamical trajectory that terminates when the sequence arrives at 1.",
        "validator": {
            "variable": "n",
            "mustInclude": "while ",
            "cases": [
                {"value": 6, "expected": "8"},
                {"value": 1, "expected": "0"},
                {"value": 2, "expected": "1"},
                {"value": 7, "expected": "16"},
                {"value": 12, "expected": "9"},
            ]
        }
    },
    {
        "id": "ch-l18",
        "topic": "loops",
        "title": "Count Even and Odd Digits",
        "difficulty": "Beginner",
        "description": "Given positive integer `n = 24791`, count how many even digits and odd digits it contains using a while loop. Print in format: `Even: {evens}, Odd: {odds}`.",
        "requirements": [
            "Extract each digit using % 10.",
            "Test parity of each digit and tally counts.",
            "Print exact formatted result.",
        ],
        "sampleOutput": "Even: 2, Odd: 3",
        "starterCode": "n = 24791\nevens = 0\nodds = 0\n\n# Count even and odd digits\n",
        "hint": "Loop `while n > 0:` and check `(n % 10) % 2 == 0`.",
        "solutionCode": "n = 24791\nevens = 0\nodds = 0\n\nwhile n > 0:\n    d = n % 10\n    if d % 2 == 0:\n        evens += 1\n    else:\n        odds += 1\n    n //= 10\nprint(f'Even: {evens}, Odd: {odds}')",
        "explanation": "Iterative digit extraction combines modulo arithmetic with conditional classification to tally distinct digit categories.",
        "validator": {
            "variable": "n",
            "mustInclude": "f'Even:",
            "cases": [
                {"value": 24791, "expected": "Even: 2, Odd: 3"},
                {"value": 888, "expected": "Even: 3, Odd: 0"},
                {"value": 1357, "expected": "Even: 0, Odd: 4"},
                {"value": 204, "expected": "Even: 3, Odd: 0"},
                {"value": 102, "expected": "Even: 2, Odd: 1"},
            ]
        }
    },
    {
        "id": "ch-l19",
        "topic": "loops",
        "title": "Product of Non-Zero Digits",
        "difficulty": "Beginner",
        "description": "Given integer `n = 2053`, compute the product of all its non-zero decimal digits ($2 \\times 5 \\times 3 = 30$). Zero digits must be skipped. Print the product.",
        "requirements": [
            "Loop through digits with n % 10 and n //= 10.",
            "Multiply into product only when digit != 0.",
            "Print final product.",
        ],
        "sampleOutput": "30",
        "starterCode": "n = 2053\nprod = 1\n\n# Compute product of non-zero digits\n",
        "hint": "Check `if d != 0: prod *= d`.",
        "solutionCode": "n = 2053\nprod = 1\n\nwhile n > 0:\n    d = n % 10\n    if d != 0:\n        prod *= d\n    n //= 10\nprint(prod)",
        "explanation": "Skipping zero digits avoids zeroing out the multiplicative accumulator, preserving product integrity.",
        "validator": {
            "variable": "n",
            "mustInclude": "prod",
            "cases": [
                {"value": 2053, "expected": "30"},
                {"value": 10204, "expected": "8"},
                {"value": 700, "expected": "7"},
                {"value": 1234, "expected": "24"},
                {"value": 909, "expected": "81"},
            ]
        }
    },
    {
        "id": "ch-l20",
        "topic": "loops",
        "title": "Power Without Exponentiation Operator",
        "difficulty": "Beginner",
        "description": "Given `base = 3` and non-negative integer `exp = 4`, compute $base^{exp}$ using a for loop (without using the `**` operator or `pow`). Print the result.",
        "requirements": [
            "Do not use ** or pow().",
            "Multiply base into accumulator exp times.",
            "Print final value.",
        ],
        "sampleOutput": "81",
        "starterCode": "base = 3\nexp = 4\nresult = 1\n\n# Compute base^exp using a loop\n",
        "hint": "Loop `for _ in range(exp): result *= base`.",
        "solutionCode": "base = 3\nexp = 4\nresult = 1\n\nfor i in range(exp):\n    result *= base\nprint(result)",
        "explanation": "Exponentiation is repeated multiplication: iterating exp times reproduces power definition from basic principles.",
        "validator": {
            "variable": ["base", "exp"],
            "mustInclude": "range",
            "cases": [
                {"value": [3, 4], "expected": "81"},
                {"value": [2, 5], "expected": "32"},
                {"value": [5, 0], "expected": "1"},
                {"value": [10, 3], "expected": "1000"},
                {"value": [4, 2], "expected": "16"},
            ]
        }
    },
    {
        "id": "ch-l21",
        "topic": "loops",
        "title": "Sum of Even Numbers up to N",
        "difficulty": "Beginner",
        "description": "Given positive integer `n = 10`, compute the sum of all positive even numbers less than or equal to n ($2 + 4 + 6 + 8 + 10 = 30$) using `range()` with step 2. Print the sum.",
        "requirements": [
            "Use range(2, n + 1, 2).",
            "Print the final sum.",
        ],
        "sampleOutput": "30",
        "starterCode": "n = 10\ntotal = 0\n\n# Sum even numbers up to n\n",
        "hint": "Use step 2: `for i in range(2, n + 1, 2): total += i`.",
        "solutionCode": "n = 10\ntotal = 0\n\nfor i in range(2, n + 1, 2):\n    total += i\nprint(total)",
        "explanation": "Stepping by 2 directly visits even integers, eliminating conditional branches and optimizing loop traversal.",
        "validator": {
            "variable": "n",
            "mustInclude": ", 2)",
            "cases": [
                {"value": 10, "expected": "30"},
                {"value": 4, "expected": "6"},
                {"value": 1, "expected": "0"},
                {"value": 6, "expected": "12"},
                {"value": 12, "expected": "42"},
            ]
        }
    },
    {
        "id": "ch-l22",
        "topic": "loops",
        "title": "Sum of Odd Numbers up to N",
        "difficulty": "Beginner",
        "description": "Given positive integer `n = 9`, compute the sum of all positive odd numbers less than or equal to n ($1 + 3 + 5 + 7 + 9 = 25$) using `range(1, n + 1, 2)`. Print the sum.",
        "requirements": [
            "Use range(1, n + 1, 2).",
            "Print the final sum.",
        ],
        "sampleOutput": "25",
        "starterCode": "n = 9\ntotal = 0\n\n# Sum odd numbers up to n\n",
        "hint": "Start at 1 with step 2: `range(1, n + 1, 2)`.",
        "solutionCode": "n = 9\ntotal = 0\n\nfor i in range(1, n + 1, 2):\n    total += i\nprint(total)",
        "explanation": "The sum of the first k odd numbers always equals k^2; stepping by 2 directly visits each consecutive odd term.",
        "validator": {
            "variable": "n",
            "mustInclude": "range",
            "cases": [
                {"value": 9, "expected": "25"},
                {"value": 5, "expected": "9"},
                {"value": 2, "expected": "1"},
                {"value": 1, "expected": "1"},
                {"value": 10, "expected": "25"},
            ]
        }
    },
    {
        "id": "ch-l23",
        "topic": "loops",
        "title": "Count Factors of an Integer",
        "difficulty": "Beginner",
        "description": "Given integer `n = 18`, count how many positive factors (divisors) it has (divisors of 18 are 1, 2, 3, 6, 9, 18 $\\rightarrow$ count = 6). Print the factor count.",
        "requirements": [
            "Check divisibility `n % i == 0` for `i` from 1 to n.",
            "Print total factors count.",
        ],
        "sampleOutput": "6",
        "starterCode": "n = 18\ncount = 0\n\n# Count factors of n\n",
        "hint": "Loop `for i in range(1, n + 1): if n % i == 0: count += 1`.",
        "solutionCode": "n = 18\ncount = 0\n\nfor i in range(1, n + 1):\n    if n % i == 0:\n        count += 1\nprint(count)",
        "explanation": "Testing remainder zero across [1, n] identifies every exact integer divisor of the target number.",
        "validator": {
            "variable": "n",
            "mustInclude": "range",
            "cases": [
                {"value": 18, "expected": "6"},
                {"value": 7, "expected": "2"},
                {"value": 1, "expected": "1"},
                {"value": 12, "expected": "6"},
                {"value": 16, "expected": "5"},
            ]
        }
    },
    {
        "id": "ch-l24",
        "topic": "loops",
        "title": "Harshad (Niven) Number Verifier",
        "difficulty": "Guided",
        "description": "Given positive integer `n = 18`, check if it is a Harshad number (divisible by the sum of its decimal digits: $18 / (1 + 8) = 18 / 9 = 2$). Print 'Harshad Number' or 'Not Harshad'.",
        "requirements": [
            "Compute digit sum of n using while loop.",
            "Check if `original_n % digit_sum == 0`.",
            "Print 'Harshad Number' or 'Not Harshad'.",
        ],
        "sampleOutput": "Harshad Number",
        "starterCode": "n = 18\norig = n\ndigit_sum = 0\n\n# Check if n is a Harshad number\n",
        "hint": "Sum digits into digit_sum, then check `if orig % digit_sum == 0:`.",
        "solutionCode": "n = 18\norig = n\ndigit_sum = 0\n\nwhile n > 0:\n    digit_sum += n % 10\n    n //= 10\n\nif orig % digit_sum == 0:\n    print('Harshad Number')\nelse:\n    print('Not Harshad')",
        "explanation": "A Harshad (joy-giver) number is an integer divisible by its digit sum in base 10.",
        "validator": {
            "variable": "n",
            "mustInclude": "orig",
            "cases": [
                {"value": 18, "expected": "Harshad Number"},
                {"value": 21, "expected": "Harshad Number"},
                {"value": 19, "expected": "Not Harshad"},
                {"value": 24, "expected": "Harshad Number"},
                {"value": 25, "expected": "Not Harshad"},
            ]
        }
    },
    {
        "id": "ch-l25",
        "topic": "loops",
        "title": "Strong / Krishnamurthy Number",
        "difficulty": "Applied",
        "description": "Given integer `n = 145`, check if it is a Strong number (equal to the sum of the factorials of its digits: $1! + 4! + 5! = 1 + 24 + 120 = 145$). Print 'Strong Number' or 'Not Strong'.",
        "requirements": [
            "For each extracted digit, compute its factorial using an inner loop.",
            "Sum the factorials and compare against original value.",
            "Print 'Strong Number' or 'Not Strong'.",
        ],
        "sampleOutput": "Strong Number",
        "starterCode": "n = 145\norig = n\ntotal = 0\n\n# Check if n is a Strong number\n",
        "hint": "Extract digit d; compute `fact = 1` for `j in range(1, d + 1): fact *= j`; add to total.",
        "solutionCode": "n = 145\norig = n\ntotal = 0\n\nwhile n > 0:\n    d = n % 10\n    fact = 1\n    for j in range(1, d + 1):\n        fact *= j\n    total += fact\n    n //= 10\n\nif total == orig:\n    print('Strong Number')\nelse:\n    print('Not Strong')",
        "explanation": "Nested loops extract digits and calculate their separate factorials, verifying Krishnamurthy identity.",
        "validator": {
            "variable": "n",
            "mustInclude": "orig",
            "cases": [
                {"value": 145, "expected": "Strong Number"},
                {"value": 1, "expected": "Strong Number"},
                {"value": 2, "expected": "Strong Number"},
                {"value": 123, "expected": "Not Strong"},
                {"value": 10, "expected": "Not Strong"},
            ]
        }
    },
    {
        "id": "ch-l26",
        "topic": "loops",
        "title": "Right-Angled Star Triangle",
        "difficulty": "Beginner",
        "description": "Given row count `n = 4`, print a right-angled star pattern where row $i$ has $i$ stars (from 1 to n).",
        "requirements": [
            "Loop `for i in range(1, n + 1):`.",
            "Print `*` repeated $i$ times using string multiplication.",
        ],
        "sampleOutput": "*\n**\n***\n****",
        "starterCode": "n = 4\n\n# Print star triangle\n",
        "hint": "Use `print('*' * i)` inside the loop.",
        "solutionCode": "n = 4\n\nfor i in range(1, n + 1):\n    print('*' * i)",
        "explanation": "Multiplying the character string '*' by the current loop index prints linearly expanding visual triangles.",
        "validator": {
            "variable": "n",
            "mustInclude": "range",
            "cases": [
                {"value": 4, "expected": "*\n**\n***\n****"},
                {"value": 3, "expected": "*\n**\n***"},
                {"value": 1, "expected": "*"},
                {"value": 5, "expected": "*\n**\n***\n****\n*****"},
                {"value": 2, "expected": "*\n**"},
            ]
        }
    },
    {
        "id": "ch-l27",
        "topic": "loops",
        "title": "Inverted Star Triangle",
        "difficulty": "Beginner",
        "description": "Given row count `n = 4`, print an inverted star triangle where the first row has n stars and the last row has 1 star.",
        "requirements": [
            "Loop backwards from n down to 1 using negative step.",
            "Print `*` repeated $i$ times.",
        ],
        "sampleOutput": "****\n***\n**\n*",
        "starterCode": "n = 4\n\n# Print inverted star triangle\n",
        "hint": "Use `range(n, 0, -1)`.",
        "solutionCode": "n = 4\n\nfor i in range(n, 0, -1):\n    print('*' * i)",
        "explanation": "A negative step in range(n, 0, -1) decrements the star multiplier on each iteration to invert the visual geometry.",
        "validator": {
            "variable": "n",
            "mustInclude": "-1)",
            "cases": [
                {"value": 4, "expected": "****\n***\n**\n*"},
                {"value": 3, "expected": "***\n**\n*"},
                {"value": 1, "expected": "*"},
                {"value": 5, "expected": "*****\n****\n***\n**\n*"},
                {"value": 2, "expected": "**\n*"},
            ]
        }
    },
    {
        "id": "ch-l28",
        "topic": "loops",
        "title": "Number Pyramid Pattern",
        "difficulty": "Guided",
        "description": "Given `n = 4`, print a number pyramid where each row $i$ repeats digit $i$, $i$ times (row 1: '1', row 2: '22', row 3: '333', row 4: '4444').",
        "requirements": [
            "Loop $i$ from 1 to n.",
            "Use `str(i) * i` to repeat the digit.",
        ],
        "sampleOutput": "1\n22\n333\n4444",
        "starterCode": "n = 4\n\n# Print number pyramid\n",
        "hint": "Convert $i$ to string with `str(i)` and multiply by $i$.",
        "solutionCode": "n = 4\n\nfor i in range(1, n + 1):\n    print(str(i) * i)",
        "explanation": "Converting loop index i to a string allows multiplication to repeat the digit across the row.",
        "validator": {
            "variable": "n",
            "mustInclude": "str",
            "cases": [
                {"value": 4, "expected": "1\n22\n333\n4444"},
                {"value": 3, "expected": "1\n22\n333"},
                {"value": 1, "expected": "1"},
                {"value": 5, "expected": "1\n22\n333\n4444\n55555"},
                {"value": 2, "expected": "1\n22"},
            ]
        }
    },
    {
        "id": "ch-l29",
        "topic": "loops",
        "title": "Continuous Floyd's Triangle",
        "difficulty": "Applied",
        "description": "Given row count `n = 3`, print a Floyd's triangle with continuous integers on each row: row 1 is '1', row 2 is '2 3', row 3 is '4 5 6'.",
        "requirements": [
            "Maintain a global counter `num = 1`.",
            "Assemble row strings or print values with space separator.",
        ],
        "sampleOutput": "1\n2 3\n4 5 6",
        "starterCode": "n = 3\nnum = 1\n\n# Print Floyd's triangle\n",
        "hint": "For each row i, build a row string: `row = []` or concat numbers with spaces.",
        "solutionCode": "n = 3\nnum = 1\n\nfor i in range(1, n + 1):\n    row = ''\n    for j in range(i):\n        if j == 0:\n            row = str(num)\n        else:\n            row = row + ' ' + str(num)\n        num += 1\n    print(row)",
        "explanation": "Nested loops coordinate row structure and column counts while a persistent external counter generates consecutive integers.",
        "validator": {
            "variable": "n",
            "mustInclude": "range",
            "cases": [
                {"value": 3, "expected": "1\n2 3\n4 5 6"},
                {"value": 2, "expected": "1\n2 3"},
                {"value": 1, "expected": "1"},
                {"value": 4, "expected": "1\n2 3\n4 5 6\n7 8 9 10"},
                {"value": 5, "expected": "1\n2 3\n4 5 6\n7 8 9 10\n11 12 13 14 15"},
            ]
        }
    },
    {
        "id": "ch-l30",
        "topic": "loops",
        "title": "Alternating Series Sum",
        "difficulty": "Applied",
        "description": "Given integer `n = 5`, compute the alternating harmonic series sum $S = 1 - 2 + 3 - 4 + 5 - \\dots \\pm n$. For n = 5, $S = 1 - 2 + 3 - 4 + 5 = 3$. Print the sum.",
        "requirements": [
            "Loop $i$ from 1 to n.",
            "If $i$ is odd add $i$, if $i$ is even subtract $i$.",
            "Print final alternating sum.",
        ],
        "sampleOutput": "3",
        "starterCode": "n = 5\ntotal = 0\n\n# Calculate alternating series sum\n",
        "hint": "Check parity: `if i % 2 == 1: total += i else: total -= i`.",
        "solutionCode": "n = 5\ntotal = 0\n\nfor i in range(1, n + 1):\n    if i % 2 == 1:\n        total += i\n    else:\n        total -= i\nprint(total)",
        "explanation": "Alternating signs modeled with modulo parity simulate converging oscillations in mathematical series analysis.",
        "validator": {
            "variable": "n",
            "mustInclude": "range",
            "cases": [
                {"value": 5, "expected": "3"},
                {"value": 4, "expected": "-2"},
                {"value": 1, "expected": "1"},
                {"value": 6, "expected": "-3"},
                {"value": 10, "expected": "-5"},
            ]
        }
    },
]
