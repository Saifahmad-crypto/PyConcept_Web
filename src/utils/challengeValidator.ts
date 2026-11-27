import { runPythonCode } from './pythonEngine';

export interface TestCase {
  value: any;
  expected: string;
}

export interface ValidatorConfig {
  variable: string | string[];
  cases: TestCase[];
  mustInclude?: string | string[];
}

export function makeValidator(config: ValidatorConfig) {
  return (_output: string, code: string): { passed: boolean; message: string } => {
    // 1. Check mustInclude keywords if specified
    if (config.mustInclude) {
      const required = Array.isArray(config.mustInclude) ? config.mustInclude : [config.mustInclude];
      for (const req of required) {
        if (!code.includes(req)) {
          return {
            passed: false,
            message: `Your code must use '${req.trim()}' to solve this challenge properly.`,
          };
        }
      }
    }

    // 2. Iterate through test cases
    for (let i = 0; i < config.cases.length; i++) {
      const tc = config.cases[i];
      let testCode = code;
      let label = '';

      if (Array.isArray(config.variable)) {
        // Multi-variable assignment (e.g. a and b)
        const valObj = typeof tc.value === 'object' && !Array.isArray(tc.value) ? tc.value : {};
        const labels: string[] = [];
        config.variable.forEach((vName, idx) => {
          const vVal = valObj[vName] !== undefined ? valObj[vName] : Array.isArray(tc.value) ? tc.value[idx] : tc.value;
          labels.push(`${vName} = ${vVal}`);
          const regex = new RegExp(`^(\\s*)${vName}\\s*=\\s*[^\\n;]+`, 'm');
          if (regex.test(testCode)) {
            testCode = testCode.replace(regex, `$1${vName} = ${typeof vVal === 'string' ? `"${vVal}"` : vVal}`);
          } else {
            testCode = `${vName} = ${typeof vVal === 'string' ? `"${vVal}"` : vVal}\n` + testCode;
          }
        });
        label = labels.join(', ');
      } else {
        const vName = config.variable;
        const vVal = tc.value;
        label = `${vName} = ${vVal}`;
        const regex = new RegExp(`^(\\s*)${vName}\\s*=\\s*[^\\n;]+`, 'm');
        if (regex.test(testCode)) {
          testCode = testCode.replace(regex, `$1${vName} = ${typeof vVal === 'string' ? `"${vVal}"` : vVal}`);
        } else {
          testCode = `${vName} = ${typeof vVal === 'string' ? `"${vVal}"` : vVal}\n` + testCode;
        }
      }

      const res = runPythonCode(testCode);
      if (!res.success) {
        return {
          passed: false,
          message: `Runtime error on test case (${label}): ${res.error?.message || 'Execution failed'}.`,
        };
      }

      const actual = res.output.trim();
      const expected = String(tc.expected).trim();
      if (actual !== expected) {
        return {
          passed: false,
          message: `Test case ${i + 1} failed (${label}): Expected "${expected}", but got "${actual || '(empty)'}".`,
        };
      }
    }

    return {
      passed: true,
      message: `All ${config.cases.length} test cases passed! Great job.`,
    };
  };
}
