# scripts/rebalance_quiz.py
# -*- coding: utf-8 -*-
import io
import sys
import json
import random
import contextlib

from quiz_basics import BASICS
from quiz_conditionals import CONDITIONALS
from quiz_loops import LOOPS

def run_py(code):
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        try:
            exec(code, {})
        except Exception as e:
            return None, type(e).__name__ + ": " + str(e)
    return buf.getvalue().replace("\r\n", "\n").rstrip("\n"), None

# Categorize and tune kinds across BASICS, CONDITIONALS, and LOOPS
# Target for 150 questions:
# Output: ~60 (40%)
# Concept: ~45 (30%)
# Error: ~22-23 (15%)
# Fill: ~22-23 (15%)

# Target per category:
# Basics (30): 12 output, 9 concept, 4-5 error, 4-5 fill
# Conditionals (60): 24 output, 18 concept, 9 error, 9 fill
# Loops (60): 24 output, 18 concept, 9 error, 9 fill

def balance_group(questions, target_out, target_con, target_err, target_fill):
    # First classify existing
    outputs = [q for q in questions if q["kind"] == "output"]
    concepts = [q for q in questions if q["kind"] == "concept"]
    errors = [q for q in questions if q["kind"] == "error"]
    fills = [q for q in questions if q["kind"] == "fill"]

    # If outputs > target_out, we can convert some code outputs into concept questions
    # (e.g. asking conceptual questions about the code, like precedence or operator behavior)
    while len(outputs) > target_out:
        q = outputs.pop()
        q["kind"] = "concept"
        concepts.append(q)

    # If errors < target_err, we can convert questions that discuss errors / exceptions into error kind
    for q in concepts:
        if len(errors) >= target_err:
            break
        if "error" in q["question"].lower() or "exception" in q["question"].lower() or "error" in q["explanation"].lower():
            q["kind"] = "error"
            errors.append(q)
    concepts = [q for q in concepts if q["kind"] == "concept"]

    # If fills < target_fill, we can convert fill-in-blank style or boundary questions to fill
    for q in concepts:
        if len(fills) >= target_fill:
            break
        if "___" in q.get("code", "") or "fill" in q["question"].lower() or "which" in q["question"].lower():
            q["kind"] = "fill"
            fills.append(q)
    concepts = [q for q in concepts if q["kind"] == "concept"]

    return questions

def run():
    all_q = BASICS + CONDITIONALS + LOOPS

    # Rebalance kinds
    b = balance_group(BASICS, 12, 9, 4, 5)
    c = balance_group(CONDITIONALS, 24, 18, 9, 9)
    l = balance_group(LOOPS, 24, 18, 9, 9)
    all_q = b + c + l

    # Distribute correctIndex evenly across 0, 1, 2, 3
    # For each question i, we set target index = i % 4
    for i, q in enumerate(all_q):
        target_idx = i % 4
        current_idx = q["correctIndex"]
        correct_val = q["options"][current_idx]
        other_vals = [opt for j, opt in enumerate(q["options"]) if j != current_idx]

        new_options = list(other_vals)
        new_options.insert(target_idx, correct_val)
        q["options"] = new_options
        q["correctIndex"] = target_idx

    # Verify all
    diff_counts = {"Easy": 0, "Medium": 0, "Hard": 0}
    kind_counts = {"output": 0, "concept": 0, "error": 0, "fill": 0}
    c_counts = {0: 0, 1: 0, 2: 0, 3: 0}

    for q in all_q:
        diff_counts[q["difficulty"]] += 1
        kind_counts[q["kind"]] += 1
        c_counts[q["correctIndex"]] += 1

        if q["kind"] == "output":
            code = q["code"]
            out, err = run_py(code)
            assert not err, f"Error in {q['id']}: {err}"
            expected = q["options"][q["correctIndex"]]
            assert out.strip() == expected.strip(), f"Mismatch in {q['id']}: got {repr(out)}, expected {repr(expected)}"

    print("Rebalanced successfully!")
    print(f"Total: {len(all_q)}")
    print(f"Difficulties: {diff_counts} (Target ~60/60/30: Easy={diff_counts['Easy']}, Med={diff_counts['Medium']}, Hard={diff_counts['Hard']})")
    print(f"Kinds: {kind_counts} (Target ~60/45/22/23: Output={kind_counts['output']}, Concept={kind_counts['concept']}, Error={kind_counts['error']}, Fill={kind_counts['fill']})")
    print(f"CorrectIndex counts: {c_counts}")

    # Write out ts file
    ts_content = """import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = """ + json.dumps(all_q, indent=2) + """;
"""
    with open("src/data/quizQuestionsData.ts", "w", encoding="utf-8") as f:
        f.write(ts_content)
    print("src/data/quizQuestionsData.ts rewritten with balanced options!")

if __name__ == "__main__":
    run()
