# scripts/build_challenges_data.py
# -*- coding: utf-8 -*-
import io
import re
import sys
import json
import contextlib

from challenges_conditionals import CONDITIONALS_CHALLENGES
from challenges_loops import LOOPS_CHALLENGES

def run_py(code):
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        try:
            exec(code, {})
        except Exception as e:
            return None, type(e).__name__ + ": " + str(e)
    return buf.getvalue().replace("\r\n", "\n").rstrip("\n"), None

def substitute_code(code, var_config, val):
    test_code = code
    if isinstance(var_config, list):
        # Multiple variables
        val_map = {}
        if isinstance(val, list):
            for i, vname in enumerate(var_config):
                val_map[vname] = val[i]
        elif isinstance(val, dict):
            val_map = val
        else:
            for vname in var_config:
                val_map[vname] = val

        for vname, vval in val_map.items():
            rep_val = f'"{vval}"' if isinstance(vval, str) else str(vval)
            pattern = rf"^(\s*){vname}\s*=\s*[^\n;]+"
            if re.search(pattern, test_code, flags=re.MULTILINE):
                test_code = re.sub(pattern, rf"\g<1>{vname} = {rep_val}", test_code, count=1, flags=re.MULTILINE)
            else:
                test_code = f"{vname} = {rep_val}\n" + test_code
    else:
        vname = var_config
        rep_val = f'"{val}"' if isinstance(val, str) else str(val)
        pattern = rf"^(\s*){vname}\s*=\s*[^\n;]+"
        if re.search(pattern, test_code, flags=re.MULTILINE):
            test_code = re.sub(pattern, rf"\g<1>{vname} = {rep_val}", test_code, count=1, flags=re.MULTILINE)
        else:
            test_code = f"{vname} = {rep_val}\n" + test_code
    return test_code

def main():
    all_challenges = CONDITIONALS_CHALLENGES + LOOPS_CHALLENGES
    print(f"Total Challenges to verify: {len(all_challenges)}")
    assert len(all_challenges) == 60, f"Expected 60, got {len(all_challenges)}"
    assert len(CONDITIONALS_CHALLENGES) == 30
    assert len(LOOPS_CHALLENGES) == 30

    tested_cases = 0

    for ch in all_challenges:
        cid = ch["id"]
        vconfig = ch["validator"]
        var_spec = vconfig["variable"]
        cases = vconfig["cases"]
        assert len(cases) >= 5, f"{cid}: Must have at least 5 test cases, found {len(cases)}"

        sol = ch["solutionCode"]

        for tc in cases:
            test_py = substitute_code(sol, var_spec, tc["value"])
            out, err = run_py(test_py)
            if err:
                print(f"ERROR executing test case in {cid}!")
                print(f"Test code:\n{test_py}")
                print(f"Error: {err}")
                sys.exit(1)
            expected = tc["expected"].strip()
            actual = out.strip()
            if actual != expected:
                print(f"MISMATCH in {cid}!")
                print(f"Variable: {var_spec}, Value: {tc['value']}")
                print(f"Expected:\n{repr(expected)}")
                print(f"Actual:\n{repr(actual)}")
                sys.exit(1)
            tested_cases += 1

    print(f"ALL 60 CHALLENGES VERIFIED! ({tested_cases} test cases passed perfectly in Python)")

    # Build TypeScript output
    ts_code = """import { CodingChallenge } from '../types';
import { makeValidator } from '../utils/challengeValidator';

export const CODING_CHALLENGES: CodingChallenge[] = [
"""
    for ch in all_challenges:
        v = ch["validator"]
        ts_code += "  {\n"
        ts_code += f"    id: {json.dumps(ch['id'])},\n"
        ts_code += f"    topic: {json.dumps(ch['topic'])},\n"
        ts_code += f"    title: {json.dumps(ch['title'])},\n"
        ts_code += f"    difficulty: {json.dumps(ch['difficulty'])},\n"
        ts_code += f"    description: {json.dumps(ch['description'])},\n"
        ts_code += f"    requirements: {json.dumps(ch['requirements'])},\n"
        ts_code += f"    sampleOutput: {json.dumps(ch['sampleOutput'])},\n"
        ts_code += f"    starterCode: {json.dumps(ch['starterCode'])},\n"
        ts_code += f"    hint: {json.dumps(ch['hint'])},\n"
        ts_code += f"    solutionCode: {json.dumps(ch['solutionCode'])},\n"
        ts_code += f"    explanation: {json.dumps(ch['explanation'])},\n"
        ts_code += f"    validateOutput: makeValidator({json.dumps(v, indent=6)}),\n"
        ts_code += "  },\n"

    ts_code += "];\n"

    with open("src/data/challengesData.ts", "w", encoding="utf-8") as f:
        f.write(ts_code)
    print("Wrote src/data/challengesData.ts successfully!")

if __name__ == "__main__":
    main()
