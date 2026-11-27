# scripts/build_quiz.py
# -*- coding: utf-8 -*-
import io
import sys
import json
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
    # Normalize CRLF to LF
    val = buf.getvalue().replace("\r\n", "\n").rstrip("\n")
    return val, None

def verify_and_build():
    all_questions = BASICS + CONDITIONALS + LOOPS
    print(f"Total Questions to verify: {len(all_questions)}")
    assert len(all_questions) == 150, f"Expected 150, got {len(all_questions)}"
    assert len(BASICS) == 30, f"Expected 30 basics, got {len(BASICS)}"
    assert len(CONDITIONALS) == 60, f"Expected 60 conditionals, got {len(CONDITIONALS)}"
    assert len(LOOPS) == 60, f"Expected 60 loops, got {len(LOOPS)}"

    ids = set()
    diff_counts = {"Easy": 0, "Medium": 0, "Hard": 0}
    kind_counts = {"output": 0, "concept": 0, "error": 0, "fill": 0}
    correct_idx_counts = {0: 0, 1: 0, 2: 0, 3: 0}

    output_verified = 0

    for q in all_questions:
        qid = q["id"]
        assert qid not in ids, f"Duplicate ID: {qid}"
        ids.add(qid)

        assert len(q["options"]) == 4, f"{qid}: Options count must be 4, got {len(q['options'])}"
        c_idx = q["correctIndex"]
        assert c_idx in [0, 1, 2, 3], f"{qid}: Invalid correctIndex {c_idx}"
        correct_idx_counts[c_idx] += 1

        diff = q.get("difficulty")
        assert diff in ["Easy", "Medium", "Hard"], f"{qid}: Invalid difficulty {diff}"
        diff_counts[diff] += 1

        kind = q.get("kind")
        assert kind in ["output", "concept", "error", "fill"], f"{qid}: Invalid kind {kind}"
        kind_counts[kind] += 1

        # Check output questions against python execution
        if kind == "output":
            code = q.get("code")
            assert code, f"{qid}: kind='output' but code is missing"
            actual_out, err = run_py(code)
            if err:
                print(f"ERROR in {qid}: {err}\nCode:\n{code}")
                sys.exit(1)
            expected_opt = q["options"][c_idx]
            # Handle option normalization
            actual_norm = actual_out.strip()
            expected_norm = expected_opt.strip()
            if actual_norm != expected_norm:
                print(f"MISMATCH in {qid}!")
                print(f"Code:\n{code}")
                print(f"Actual Python output:\n{repr(actual_norm)}")
                print(f"Expected option[{c_idx}]:\n{repr(expected_norm)}")
                sys.exit(1)
            output_verified += 1

    print("ALL 150 QUESTIONS VALIDATED SUCCESSFULLY!")
    print(f"Verified Python Outputs: {output_verified} questions")
    print(f"Difficulties: {diff_counts}")
    print(f"Kinds: {kind_counts}")
    print(f"Correct Index Distribution: {correct_idx_counts}")

    # Generate TypeScript file: src/data/quizQuestionsData.ts
    ts_content = """import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = """ + json.dumps(all_questions, indent=2) + """;
"""
    with open("src/data/quizQuestionsData.ts", "w", encoding="utf-8") as f:
        f.write(ts_content)
    print("Successfully wrote src/data/quizQuestionsData.ts")

if __name__ == "__main__":
    verify_and_build()
