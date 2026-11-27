import { CODING_CHALLENGES, QUIZ_QUESTIONS } from '../src/data/curriculumData';
import { runPythonCode } from '../src/utils/pythonEngine';
import { execSync, spawnSync } from 'child_process';

interface VerificationReport {
  totalChallenges: number;
  passedChallenges: number;
  failedChallenges: number;
  totalOutputQuizzes: number;
  passedOutputQuizzes: number;
  failedOutputQuizzes: number;
  python3Checked: boolean;
  errors: string[];
}

function verifyAll(): boolean {
  console.log('='.repeat(70));
  console.log('🧪 PyVerse Content Verification Engine (B.Tech & GATE Level)');
  console.log('='.repeat(70));

  const report: VerificationReport = {
    totalChallenges: CODING_CHALLENGES.length,
    passedChallenges: 0,
    failedChallenges: 0,
    totalOutputQuizzes: 0,
    passedOutputQuizzes: 0,
    failedOutputQuizzes: 0,
    python3Checked: false,
    errors: [],
  };

  // 1. Verify Python3 availability
  let pythonCmd: string | null = null;
  try {
    execSync('python --version', { stdio: 'pipe' });
    pythonCmd = 'python';
    report.python3Checked = true;
  } catch {
    try {
      execSync('python3 --version', { stdio: 'pipe' });
      pythonCmd = 'python3';
      report.python3Checked = true;
    } catch {
      report.python3Checked = false;
    }
  }

  if (pythonCmd) {
    console.log(`✓ External Python runtime detected: ${pythonCmd}`);
  } else {
    console.log('ℹ External Python not found, testing via internal Fast Engine only.');
  }

  // 2. Verify all 60 Coding Challenges
  console.log(`\n📋 Verifying ${CODING_CHALLENGES.length} Coding Challenges (5+ test cases each)...`);
  for (let i = 0; i < CODING_CHALLENGES.length; i++) {
    const ch = CODING_CHALLENGES[i];
    const initialRes = runPythonCode(ch.solutionCode);
    if (!initialRes.success) {
      report.failedChallenges++;
      const err = `[FAIL] Challenge #${i + 1} (${ch.id} - ${ch.title}) runtime syntax error: ${initialRes.error?.message}`;
      report.errors.push(err);
      console.error(err);
      continue;
    }

    const valResult = ch.validateOutput(initialRes.output, ch.solutionCode);
    if (!valResult.passed) {
      report.failedChallenges++;
      const err = `[FAIL] Challenge #${i + 1} (${ch.id} - ${ch.title}): ${valResult.message}`;
      report.errors.push(err);
      console.error(err);
    } else {
      report.passedChallenges++;
    }
  }

  // 3. Verify all Output Prediction Quiz Questions
  const outputQuizzes = QUIZ_QUESTIONS.filter((q) => q.kind === 'output');
  report.totalOutputQuizzes = outputQuizzes.length;
  console.log(`\n📋 Verifying ${outputQuizzes.length} Output-Prediction Quiz Questions...`);

  for (let i = 0; i < outputQuizzes.length; i++) {
    const q = outputQuizzes[i];
    if (!q.code) {
      report.failedOutputQuizzes++;
      report.errors.push(`[FAIL] Quiz ${q.id}: kind='output' but code is missing!`);
      continue;
    }

    // Fast Engine evaluation
    const res = runPythonCode(q.code);
    if (!res.success) {
      report.failedOutputQuizzes++;
      const err = `[FAIL] Quiz ${q.id} (${q.topic}): Engine execution error: ${res.error?.message}`;
      report.errors.push(err);
      console.error(err);
      continue;
    }

    const actual = res.output.trim().replace(/\r\n/g, '\n');
    const expected = q.options[q.correctIndex].trim().replace(/\r\n/g, '\n');

    if (actual !== expected) {
      report.failedOutputQuizzes++;
      const err = `[FAIL] Quiz ${q.id} (${q.topic}): Expected option[${q.correctIndex}] "${expected}", but engine produced "${actual}".`;
      report.errors.push(err);
      console.error(err);
      continue;
    }

    // Optional cross-check with system python
    if (pythonCmd) {
      try {
        const proc = spawnSync(pythonCmd, ['-'], {
          input: q.code,
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'ignore'],
        });
        if (proc.status === 0 && proc.stdout !== null) {
          const pyOut = proc.stdout.trim().replace(/\r\n/g, '\n');
          if (pyOut !== expected) {
            report.failedOutputQuizzes++;
            const err = `[FAIL] Quiz ${q.id} (${q.topic}): Python 3 returned "${pyOut}", but expected "${expected}".`;
            report.errors.push(err);
            console.error(err);
            continue;
          }
        }
      } catch {
        // If code snippet intentionally tests special construct or has stdin/custom logic
      }
    }

    report.passedOutputQuizzes++;
  }

  // 4. Print Summary Report
  console.log('\n' + '='.repeat(70));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(70));
  console.log(`Coding Challenges: ${report.passedChallenges} / ${report.totalChallenges} PASSED`);
  console.log(`Output Quizzes:    ${report.passedOutputQuizzes} / ${report.totalOutputQuizzes} PASSED`);
  console.log(`Total Quiz Bank:   ${QUIZ_QUESTIONS.length} Questions`);
  console.log(`- Basics:          ${QUIZ_QUESTIONS.filter((q) => q.topic === 'basics').length}`);
  console.log(`- Conditionals:    ${QUIZ_QUESTIONS.filter((q) => q.topic === 'conditionals').length}`);
  console.log(`- Loops:           ${QUIZ_QUESTIONS.filter((q) => q.topic === 'loops').length}`);
  console.log('='.repeat(70));

  if (report.errors.length > 0) {
    console.error(`\n❌ Found ${report.errors.length} errors:`);
    report.errors.forEach((e) => console.error(`  - ${e}`));
    return false;
  }

  console.log('\n🎉 ALL CONTENT VERIFIED 100% SUCCESFULLY! Zero discrepancies found.\n');
  return true;
}

const success = verifyAll();
if (!success) {
  process.exit(1);
}
