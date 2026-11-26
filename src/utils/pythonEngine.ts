export interface PythonRunResult {
  success: boolean;
  output: string;
  error?: {
    type: string;
    line: number;
    message: string;
    hint: string;
  };
  stepsExecuted: number;
}

type PyValue = number | string | boolean | null | PyValue[];

class PyRuntimeError extends Error {
  errorType: string;
  line: number;
  hint: string;

  constructor(errorType: string, line: number, message: string, hint: string) {
    super(message);
    this.errorType = errorType;
    this.line = line;
    this.hint = hint;
  }
}

class BreakSignal {}
class ContinueSignal {}

interface RawLine {
  lineNumber: number;
  indent: number;
  text: string;
}

type Stmt =
  | { kind: 'assign'; line: number; target: string; op: string; expr: string }
  | { kind: 'expr'; line: number; expr: string }
  | { kind: 'pass'; line: number }
  | { kind: 'break'; line: number }
  | { kind: 'continue'; line: number }
  | {
      kind: 'if';
      line: number;
      branches: Array<{ line: number; cond: string | null; body: Stmt[] }>;
    }
  | { kind: 'for'; line: number; target: string; iterExpr: string; body: Stmt[] }
  | { kind: 'while'; line: number; cond: string; body: Stmt[] };

function stripComment(line: string): string {
  let inSingle = false;
  let inDouble = false;
  let escaped = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === '\\') {
      escaped = true;
      continue;
    }
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
    } else if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
    } else if (ch === '#' && !inSingle && !inDouble) {
      return line.slice(0, i);
    }
  }
  return line;
}

function preprocessLines(code: string): RawLine[] {
  const raw = code.replace(/\r\n/g, '\n').split('\n');
  const result: RawLine[] = [];

  for (let i = 0; i < raw.length; i++) {
    const noComment = stripComment(raw[i]);
    if (noComment.trim() === '') continue;

    let indent = 0;
    for (let j = 0; j < noComment.length; j++) {
      if (noComment[j] === ' ') indent++;
      else if (noComment[j] === '\t') indent += 4;
      else break;
    }
    result.push({
      lineNumber: i + 1,
      indent,
      text: noComment.trim(),
    });
  }
  return result;
}

function checkAssignmentInCondition(cond: string, line: number): void {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < cond.length; i++) {
    const ch = cond[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (!inSingle && !inDouble && ch === '=') {
      const prev = cond[i - 1] ?? '';
      const next = cond[i + 1] ?? '';
      if (prev !== '=' && prev !== '!' && prev !== '<' && prev !== '>' && next !== '=') {
        throw new PyRuntimeError(
          'SyntaxError',
          line,
          `Invalid '=' inside condition "${cond}".`,
          "In Python, '=' assigns a value, while '==' checks if two values are equal. Replace '=' with '=='."
        );
      }
    }
  }
}

function parseBlock(lines: RawLine[], startIndex: number, expectedIndent: number): { stmts: Stmt[]; nextIndex: number } {
  const stmts: Stmt[] = [];
  let i = startIndex;

  while (i < lines.length) {
    const current = lines[i];
    if (current.indent < expectedIndent) {
      break;
    }
    if (current.indent > expectedIndent) {
      throw new PyRuntimeError(
        'IndentationError',
        current.lineNumber,
        `Unexpected indent on line ${current.lineNumber}.`,
        'Check your leading spaces. Statements at the same level must line up at the exact same indentation.'
      );
    }

    const txt = current.text;

    if (txt.startsWith('elif ') || txt === 'elif:' || txt.startsWith('else:') || txt === 'else') {
      break;
    }

    if (txt === 'pass') {
      stmts.push({ kind: 'pass', line: current.lineNumber });
      i++;
      continue;
    }

    if (txt === 'break') {
      stmts.push({ kind: 'break', line: current.lineNumber });
      i++;
      continue;
    }

    if (txt === 'continue') {
      stmts.push({ kind: 'continue', line: current.lineNumber });
      i++;
      continue;
    }

    if (txt.startsWith('if ') || txt === 'if:') {
      if (!txt.endsWith(':')) {
        throw new PyRuntimeError(
          'SyntaxError',
          current.lineNumber,
          `Missing ':' at the end of if statement.`,
          "Every 'if', 'elif', 'else', 'for', and 'while' header line must end with a colon ':'."
        );
      }
      const cond = txt.slice(3, -1).trim();
      if (!cond) {
        throw new PyRuntimeError('SyntaxError', current.lineNumber, 'Empty condition in if statement.', 'Add a condition before the colon.');
      }
      checkAssignmentInCondition(cond, current.lineNumber);

      if (i + 1 >= lines.length || lines[i + 1].indent <= expectedIndent) {
        throw new PyRuntimeError(
          'IndentationError',
          current.lineNumber,
          `Expected an indented block after 'if' on line ${current.lineNumber}.`,
          'Indent the code inside the if block by 4 spaces.'
        );
      }

      const bodyIndent = lines[i + 1].indent;
      const firstBody = parseBlock(lines, i + 1, bodyIndent);
      const branches: Array<{ line: number; cond: string | null; body: Stmt[] }> = [
        { line: current.lineNumber, cond, body: firstBody.stmts },
      ];
      i = firstBody.nextIndex;

      while (i < lines.length && lines[i].indent === expectedIndent) {
        const nextTxt = lines[i].text;
        if (nextTxt.startsWith('elif ')) {
          if (!nextTxt.endsWith(':')) {
            throw new PyRuntimeError(
              'SyntaxError',
              lines[i].lineNumber,
              `Missing ':' at the end of elif statement.`,
              "Add a colon ':' at the end of the elif line."
            );
          }
          const elifCond = nextTxt.slice(5, -1).trim();
          checkAssignmentInCondition(elifCond, lines[i].lineNumber);
          if (i + 1 >= lines.length || lines[i + 1].indent <= expectedIndent) {
            throw new PyRuntimeError(
              'IndentationError',
              lines[i].lineNumber,
              `Expected an indented block after 'elif' on line ${lines[i].lineNumber}.`,
              'Indent the lines inside the elif block by 4 spaces.'
            );
          }
          const elifBody = parseBlock(lines, i + 1, lines[i + 1].indent);
          branches.push({ line: lines[i].lineNumber, cond: elifCond, body: elifBody.stmts });
          i = elifBody.nextIndex;
        } else if (nextTxt.startsWith('else')) {
          if (nextTxt !== 'else:') {
            throw new PyRuntimeError(
              'SyntaxError',
              lines[i].lineNumber,
              `Invalid else syntax on line ${lines[i].lineNumber}.`,
              "Write 'else:' with a colon and no condition."
            );
          }
          if (i + 1 >= lines.length || lines[i + 1].indent <= expectedIndent) {
            throw new PyRuntimeError(
              'IndentationError',
              lines[i].lineNumber,
              `Expected an indented block after 'else:' on line ${lines[i].lineNumber}.`,
              'Indent the lines inside the else block by 4 spaces.'
            );
          }
          const elseBody = parseBlock(lines, i + 1, lines[i + 1].indent);
          branches.push({ line: lines[i].lineNumber, cond: null, body: elseBody.stmts });
          i = elseBody.nextIndex;
          break;
        } else {
          break;
        }
      }

      stmts.push({ kind: 'if', line: current.lineNumber, branches });
      continue;
    }

    if (txt.startsWith('elif ') || txt.startsWith('else:') || txt === 'else') {
      throw new PyRuntimeError(
        'SyntaxError',
        current.lineNumber,
        `'${txt.split(/[\s:]/)[0]}' without matching 'if'.`,
        "Make sure 'elif' and 'else' align at the exact same indentation as their matching 'if'."
      );
    }

    if (txt.startsWith('for ')) {
      if (!txt.endsWith(':')) {
        throw new PyRuntimeError(
          'SyntaxError',
          current.lineNumber,
          `Missing ':' at the end of for loop.`,
          "Every 'for' loop header must end with a colon ':'."
        );
      }
      const header = txt.slice(4, -1).trim();
      const inMatch = header.match(/^([A-Za-z_][A-Za-z0-9_]*)\s+in\s+(.+)$/);
      if (!inMatch) {
        throw new PyRuntimeError(
          'SyntaxError',
          current.lineNumber,
          `Invalid for loop syntax: "${txt}".`,
          "Use the format: for variable in range(...):"
        );
      }
      if (i + 1 >= lines.length || lines[i + 1].indent <= expectedIndent) {
        throw new PyRuntimeError(
          'IndentationError',
          current.lineNumber,
          `Expected an indented block inside 'for' loop on line ${current.lineNumber}.`,
          'Indent the loop body by 4 spaces.'
        );
      }
      const body = parseBlock(lines, i + 1, lines[i + 1].indent);
      stmts.push({
        kind: 'for',
        line: current.lineNumber,
        target: inMatch[1],
        iterExpr: inMatch[2].trim(),
        body: body.stmts,
      });
      i = body.nextIndex;
      continue;
    }

    if (txt.startsWith('while ')) {
      if (!txt.endsWith(':')) {
        throw new PyRuntimeError(
          'SyntaxError',
          current.lineNumber,
          `Missing ':' at the end of while loop.`,
          "Every 'while' loop header must end with a colon ':'."
        );
      }
      const cond = txt.slice(6, -1).trim();
      if (!cond) {
        throw new PyRuntimeError('SyntaxError', current.lineNumber, 'Empty condition in while loop.', 'Provide a condition before the colon.');
      }
      checkAssignmentInCondition(cond, current.lineNumber);
      if (i + 1 >= lines.length || lines[i + 1].indent <= expectedIndent) {
        throw new PyRuntimeError(
          'IndentationError',
          current.lineNumber,
          `Expected an indented block inside 'while' loop on line ${current.lineNumber}.`,
          'Indent the loop body by 4 spaces.'
        );
      }
      const body = parseBlock(lines, i + 1, lines[i + 1].indent);
      stmts.push({ kind: 'while', line: current.lineNumber, cond, body: body.stmts });
      i = body.nextIndex;
      continue;
    }

    // Check assignment vs expression
    const augMatch = txt.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*(\+=|-=|\*=|\/=|\/\/=|%=)\s*(.+)$/);
    if (augMatch) {
      stmts.push({
        kind: 'assign',
        line: current.lineNumber,
        target: augMatch[1],
        op: augMatch[2],
        expr: augMatch[3].trim(),
      });
      i++;
      continue;
    }

    const eqIdx = findTopLevelEquals(txt);
    if (eqIdx !== -1) {
      const target = txt.slice(0, eqIdx).trim();
      const expr = txt.slice(eqIdx + 1).trim();
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(target)) {
        throw new PyRuntimeError(
          'SyntaxError',
          current.lineNumber,
          `Invalid variable name "${target}".`,
          'Variable names must start with a letter or underscore and contain only letters, digits, or underscores.'
        );
      }
      stmts.push({ kind: 'assign', line: current.lineNumber, target, op: '=', expr });
      i++;
      continue;
    }

    stmts.push({ kind: 'expr', line: current.lineNumber, expr: txt });
    i++;
  }

  return { stmts, nextIndex: i };
}

function findTopLevelEquals(txt: string): number {
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < txt.length; i++) {
    const ch = txt[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (!inSingle && !inDouble) {
      if (ch === '(' || ch === '[' || ch === '{') depth++;
      else if (ch === ')' || ch === ']' || ch === '}') depth--;
      else if (ch === '=' && depth === 0) {
        const prev = txt[i - 1] ?? '';
        const next = txt[i + 1] ?? '';
        if (prev !== '=' && prev !== '!' && prev !== '<' && prev !== '>' && next !== '=') {
          return i;
        }
      }
    }
  }
  return -1;
}

// Tokenizer & Recursive Descent Expression Evaluator
interface Token {
  type: 'num' | 'str' | 'fstr' | 'ident' | 'op' | 'punct';
  value: string;
}

function tokenizeExpr(expr: string, line: number): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    // f-string
    if ((ch === 'f' || ch === 'F') && (expr[i + 1] === '"' || expr[i + 1] === "'")) {
      const quote = expr[i + 1];
      i += 2;
      let content = '';
      while (i < expr.length && expr[i] !== quote) {
        if (expr[i] === '\\' && i + 1 < expr.length) {
          const next = expr[i + 1];
          content += next === 'n' ? '\n' : next === 't' ? '\t' : next;
          i += 2;
        } else {
          content += expr[i++];
        }
      }
      if (expr[i] !== quote) {
        throw new PyRuntimeError('SyntaxError', line, 'Unterminated string literal.', 'Check that your quotes match.');
      }
      i++;
      tokens.push({ type: 'fstr', value: content });
      continue;
    }
    // normal string
    if (ch === '"' || ch === "'") {
      const quote = ch;
      i++;
      let content = '';
      while (i < expr.length && expr[i] !== quote) {
        if (expr[i] === '\\' && i + 1 < expr.length) {
          const next = expr[i + 1];
          content += next === 'n' ? '\n' : next === 't' ? '\t' : next;
          i += 2;
        } else {
          content += expr[i++];
        }
      }
      if (expr[i] !== quote) {
        throw new PyRuntimeError('SyntaxError', line, 'Unterminated string literal.', 'Make sure every opening quote has a matching closing quote.');
      }
      i++;
      tokens.push({ type: 'str', value: content });
      continue;
    }
    // number
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(expr[i + 1] ?? ''))) {
      let numStr = '';
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        numStr += expr[i++];
      }
      tokens.push({ type: 'num', value: numStr });
      continue;
    }
    // identifier or keyword
    if (/[A-Za-z_]/.test(ch)) {
      let ident = '';
      while (i < expr.length && /[A-Za-z0-9_]/.test(expr[i])) {
        ident += expr[i++];
      }
      if (ident === 'and' || ident === 'or' || ident === 'not' || ident === 'in') {
        tokens.push({ type: 'op', value: ident });
      } else {
        tokens.push({ type: 'ident', value: ident });
      }
      continue;
    }
    // multi-char operators
    const two = expr.slice(i, i + 2);
    if (['==', '!=', '<=', '>=', '//', '**'].includes(two)) {
      tokens.push({ type: 'op', value: two });
      i += 2;
      continue;
    }
    if ('+-*/%<>'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }
    if ('()[],:='.includes(ch)) {
      tokens.push({ type: 'punct', value: ch });
      i++;
      continue;
    }
    throw new PyRuntimeError('SyntaxError', line, `Unexpected character "${ch}".`, 'Check for typos or unsupported symbols.');
  }
  return tokens;
}

function isTruthy(val: PyValue): boolean {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val !== 0;
  if (typeof val === 'string') return val.length > 0;
  if (Array.isArray(val)) return val.length > 0;
  return false;
}

function pyToString(val: PyValue): string {
  if (val === null) return 'None';
  if (typeof val === 'boolean') return val ? 'True' : 'False';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return (
      '[' +
      val
        .map((item) => (typeof item === 'string' ? `'${item}'` : pyToString(item)))
        .join(', ') +
      ']'
    );
  }
  return String(val);
}

function pyEquals(a: PyValue, b: PyValue): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, idx) => pyEquals(v, b[idx]));
  }
  if (typeof a === 'boolean' && typeof b === 'number') return (a ? 1 : 0) === b;
  if (typeof a === 'number' && typeof b === 'boolean') return a === (b ? 1 : 0);
  return a === b;
}

function makeRangeArray(args: PyValue[], line: number): number[] {
  if (args.length < 1 || args.length > 3) {
    throw new PyRuntimeError('TypeError', line, `range() expects 1 to 3 arguments, got ${args.length}.`, 'Use range(stop), range(start, stop), or range(start, stop, step).');
  }
  const nums = args.map((a) => {
    if (typeof a !== 'number' || !Number.isInteger(a)) {
      throw new PyRuntimeError('TypeError', line, 'range() arguments must be integers.', 'Pass whole numbers like 1, 5, or -1 to range().');
    }
    return a;
  });
  let start = 0;
  let stop = 0;
  let step = 1;
  if (nums.length === 1) {
    stop = nums[0];
  } else if (nums.length === 2) {
    start = nums[0];
    stop = nums[1];
  } else {
    start = nums[0];
    stop = nums[1];
    step = nums[2];
  }
  if (step === 0) {
    throw new PyRuntimeError('ValueError', line, 'range() arg 3 (step) must not be zero.', 'Use a non-zero step value like 1, 2, or -1.');
  }
  const out: number[] = [];
  if (step > 0) {
    for (let v = start; v < stop && out.length < 2000; v += step) out.push(v);
  } else {
    for (let v = start; v > stop && out.length < 2000; v += step) out.push(v);
  }
  return out;
}

function evalExpression(
  expr: string,
  env: Record<string, PyValue>,
  line: number,
  outputChunks: string[]
): PyValue {
  const tokens = tokenizeExpr(expr, line);
  let pos = 0;

  const peek = () => tokens[pos];
  const consume = () => tokens[pos++];

  function parseOr(): PyValue {
    let left = parseAnd();
    while (peek()?.type === 'op' && peek()?.value === 'or') {
      consume();
      const right = parseAnd();
      left = isTruthy(left) ? left : right;
    }
    return left;
  }

  function parseAnd(): PyValue {
    let left = parseNot();
    while (peek()?.type === 'op' && peek()?.value === 'and') {
      consume();
      const right = parseNot();
      left = isTruthy(left) ? right : left;
    }
    return left;
  }

  function parseNot(): PyValue {
    if (peek()?.type === 'op' && peek()?.value === 'not') {
      consume();
      return !isTruthy(parseNot());
    }
    return parseComparison();
  }

  function parseComparison(): PyValue {
    let left = parseAddSub();
    const cmpOps = ['==', '!=', '<', '<=', '>', '>=', 'in'];
    const results: boolean[] = [];

    while (
      peek()?.type === 'op' &&
      (cmpOps.includes(peek()!.value) ||
        (peek()!.value === 'not' && tokens[pos + 1]?.value === 'in'))
    ) {
      let op = consume().value;
      if (op === 'not') {
        consume();
        op = 'not in';
      }
      const right = parseAddSub();
      let ok = false;
      if (op === '==') ok = pyEquals(left, right);
      else if (op === '!=') ok = !pyEquals(left, right);
      else if (op === '<') ok = (left as number) < (right as number);
      else if (op === '<=') ok = (left as number) <= (right as number);
      else if (op === '>') ok = (left as number) > (right as number);
      else if (op === '>=') ok = (left as number) >= (right as number);
      else if (op === 'in') {
        if (typeof right === 'string') ok = right.includes(String(left));
        else if (Array.isArray(right)) ok = right.some((item) => pyEquals(item, left));
        else throw new PyRuntimeError('TypeError', line, `'in' requires a string or list.`, 'Check the right side of the in operator.');
      } else if (op === 'not in') {
        if (typeof right === 'string') ok = !right.includes(String(left));
        else if (Array.isArray(right)) ok = !right.some((item) => pyEquals(item, left));
      }
      results.push(ok);
      left = right;
    }

    if (results.length > 0) {
      return results.every(Boolean);
    }
    return left;
  }

  function parseAddSub(): PyValue {
    let left = parseMulDiv();
    while (peek()?.type === 'op' && (peek()!.value === '+' || peek()!.value === '-')) {
      const op = consume().value;
      const right = parseMulDiv();
      if (op === '+') {
        if (typeof left === 'string' && typeof right === 'string') {
          left = left + right;
        } else if (Array.isArray(left) && Array.isArray(right)) {
          left = [...left, ...right];
        } else if (typeof left === 'number' && typeof right === 'number') {
          left = left + right;
        } else {
          throw new PyRuntimeError(
            'TypeError',
            line,
            `Cannot add ${typeof left} and ${typeof right} directly.`,
            'Use str(...) to turn a number into text before joining with +, or separate values with a comma inside print().'
          );
        }
      } else {
        if (typeof left !== 'number' || typeof right !== 'number') {
          throw new PyRuntimeError('TypeError', line, 'Subtraction requires numbers.', 'Make sure both sides of - are numbers.');
        }
        left = left - right;
      }
    }
    return left;
  }

  function parseMulDiv(): PyValue {
    let left = parseUnary();
    while (peek()?.type === 'op' && ['*', '/', '//', '%'].includes(peek()!.value)) {
      const op = consume().value;
      const right = parseUnary();
      if (op === '*') {
        if (typeof left === 'string' && typeof right === 'number') {
          left = left.repeat(Math.max(0, Math.floor(right)));
        } else if (typeof left === 'number' && typeof right === 'string') {
          left = right.repeat(Math.max(0, Math.floor(left)));
        } else if (typeof left === 'number' && typeof right === 'number') {
          left = left * right;
        } else {
          throw new PyRuntimeError('TypeError', line, 'Invalid operands for *.', 'Multiply two numbers, or repeat a string by an integer.');
        }
      } else {
        if (typeof left !== 'number' || typeof right !== 'number') {
          throw new PyRuntimeError('TypeError', line, `Operator '${op}' requires numbers.`, 'Ensure both values are numbers.');
        }
        if (right === 0) {
          throw new PyRuntimeError('ZeroDivisionError', line, 'Division by zero is not allowed.', 'Make sure the divisor is not 0.');
        }
        if (op === '/') left = left / right;
        else if (op === '//') left = Math.floor(left / right);
        else if (op === '%') left = ((left % right) + right) % right;
      }
    }
    return left;
  }

  function parseUnary(): PyValue {
    if (peek()?.type === 'op' && (peek()!.value === '-' || peek()!.value === '+')) {
      const op = consume().value;
      const val = parseUnary();
      if (typeof val !== 'number') {
        throw new PyRuntimeError('TypeError', line, 'Unary +/- requires a number.', 'Check your expression.');
      }
      return op === '-' ? -val : val;
    }
    return parsePower();
  }

  function parsePower(): PyValue {
    const base = parsePrimary();
    if (peek()?.type === 'op' && peek()!.value === '**') {
      consume();
      const exp = parseUnary();
      if (typeof base !== 'number' || typeof exp !== 'number') {
        throw new PyRuntimeError('TypeError', line, 'Exponentiation requires numbers.', 'Use numeric values with **.');
      }
      return Math.pow(base, exp);
    }
    return base;
  }

  function interpolateFString(template: string): string {
    let res = '';
    let idx = 0;
    while (idx < template.length) {
      if (template[idx] === '{') {
        const end = template.indexOf('}', idx + 1);
        if (end === -1) {
          throw new PyRuntimeError('SyntaxError', line, 'Unclosed { in f-string.', 'Close your {expression} with }.');
        }
        const innerExpr = template.slice(idx + 1, end).trim();
        const val = evalExpression(innerExpr, env, line, outputChunks);
        res += pyToString(val);
        idx = end + 1;
      } else {
        res += template[idx++];
      }
    }
    return res;
  }

  function parsePrimary(): PyValue {
    const tok = peek();
    if (!tok) {
      throw new PyRuntimeError('SyntaxError', line, 'Incomplete expression.', 'Check for missing values or closing parentheses.');
    }

    if (tok.type === 'num') {
      consume();
      return Number(tok.value);
    }
    if (tok.type === 'str') {
      consume();
      return tok.value;
    }
    if (tok.type === 'fstr') {
      consume();
      return interpolateFString(tok.value);
    }

    if (tok.type === 'punct' && tok.value === '(') {
      consume();
      const val = parseOr();
      if (peek()?.value !== ')') {
        throw new PyRuntimeError('SyntaxError', line, "Missing closing ')'.", 'Every opening parenthesis ( must have a matching ).');
      }
      consume();
      return val;
    }

    if (tok.type === 'punct' && tok.value === '[') {
      consume();
      const items: PyValue[] = [];
      while (peek() && peek()!.value !== ']') {
        items.push(parseOr());
        if (peek()?.value === ',') consume();
        else break;
      }
      if (peek()?.value !== ']') {
        throw new PyRuntimeError('SyntaxError', line, "Missing closing ']'.", 'Close your list with ].');
      }
      consume();
      return items;
    }

    if (tok.type === 'ident') {
      consume();
      const name = tok.value;
      if (name === 'True') return true;
      if (name === 'False') return false;
      if (name === 'None') return null;

      // Function call
      if (peek()?.type === 'punct' && peek()!.value === '(') {
        consume();
        const posArgs: PyValue[] = [];
        const kwArgs: Record<string, PyValue> = {};

        while (peek() && peek()!.value !== ')') {
          if (
            peek()?.type === 'ident' &&
            tokens[pos + 1]?.type === 'punct' &&
            tokens[pos + 1]?.value === '='
          ) {
            const kwName = consume().value;
            consume(); // '='
            kwArgs[kwName] = parseOr();
          } else {
            posArgs.push(parseOr());
          }
          if (peek()?.value === ',') consume();
          else break;
        }
        if (peek()?.value !== ')') {
          throw new PyRuntimeError('SyntaxError', line, `Missing closing ')' in ${name}() call.`, 'Make sure parentheses are balanced.');
        }
        consume();
        return callBuiltin(name, posArgs, kwArgs);
      }

      // Indexing e.g. items[0]
      let val: PyValue;
      if (!(name in env)) {
        throw new PyRuntimeError(
          'NameError',
          line,
          `Name '${name}' is not defined.`,
          `Assign a value to '${name}' before using it (for example: ${name} = 10).`
        );
      }
      val = env[name];

      while (peek()?.type === 'punct' && peek()!.value === '[') {
        consume();
        const idxVal = parseOr();
        if (peek()?.value !== ']') {
          throw new PyRuntimeError('SyntaxError', line, "Missing closing ']'.", 'Check index brackets.');
        }
        consume();
        if (typeof idxVal !== 'number' || !Number.isInteger(idxVal)) {
          throw new PyRuntimeError('TypeError', line, 'Index must be an integer.', 'Use a whole number inside [ ].');
        }
        if (typeof val === 'string' || Array.isArray(val)) {
          const normIdx = idxVal < 0 ? val.length + idxVal : idxVal;
          if (normIdx < 0 || normIdx >= val.length) {
            throw new PyRuntimeError('IndexError', line, 'Index out of range.', 'The index exceeds the length of the sequence.');
          }
          val = val[normIdx];
        } else {
          throw new PyRuntimeError('TypeError', line, 'Value is not subscriptable.', 'Only strings and lists support [index].');
        }
      }

      return val;
    }

    throw new PyRuntimeError('SyntaxError', line, `Unexpected token "${tok.value}".`, 'Review the syntax on this line.');
  }

  function callBuiltin(name: string, args: PyValue[], kw: Record<string, PyValue>): PyValue {
    switch (name) {
      case 'print': {
        const sep = typeof kw.sep === 'string' ? kw.sep : ' ';
        const end = typeof kw.end === 'string' ? kw.end : '\n';
        outputChunks.push(args.map(pyToString).join(sep) + end);
        return null;
      }
      case 'range':
        return makeRangeArray(args, line);
      case 'len': {
        if (args.length !== 1) throw new PyRuntimeError('TypeError', line, 'len() takes exactly 1 argument.', 'Pass one string or list to len().');
        const target = args[0];
        if (typeof target === 'string' || Array.isArray(target)) return target.length;
        throw new PyRuntimeError('TypeError', line, 'len() requires a string or list.', 'Pass a string or list.');
      }
      case 'int':
        return Math.trunc(Number(args[0]));
      case 'float':
        return Number(args[0]);
      case 'str':
        return pyToString(args[0] ?? '');
      case 'bool':
        return isTruthy(args[0] ?? false);
      case 'abs':
        return Math.abs(Number(args[0]));
      case 'round':
        return Number(Number(args[0]).toFixed(typeof args[1] === 'number' ? args[1] : 0));
      case 'min':
        if (args.length === 1 && Array.isArray(args[0])) return Math.min(...(args[0] as number[]));
        return Math.min(...(args as number[]));
      case 'max':
        if (args.length === 1 && Array.isArray(args[0])) return Math.max(...(args[0] as number[]));
        return Math.max(...(args as number[]));
      case 'sum':
        if (Array.isArray(args[0])) return (args[0] as number[]).reduce((a, b) => a + b, 0);
        return 0;
      default:
        throw new PyRuntimeError(
          'NameError',
          line,
          `Function '${name}' is not available in this beginner Python simulator.`,
          'Supported functions include print(), range(), len(), int(), float(), str(), bool(), abs(), min(), max(), and sum().'
        );
    }
  }

  const result = parseOr();
  if (pos < tokens.length) {
    throw new PyRuntimeError(
      'SyntaxError',
      line,
      `Unexpected syntax near "${tokens[pos].value}".`,
      'Check for missing operators, commas, or parentheses.'
    );
  }
  return result;
}

export function runPythonCode(code: string): PythonRunResult {
  const outputChunks: string[] = [];
  const env: Record<string, PyValue> = {};
  let stepsExecuted = 0;
  const MAX_STEPS = 4000;

  try {
    const lines = preprocessLines(code);
    if (lines.length === 0) {
      return { success: true, output: '', stepsExecuted: 0 };
    }
    if (lines[0].indent !== 0) {
      throw new PyRuntimeError(
        'IndentationError',
        lines[0].lineNumber,
        'Unexpected indent on the first line.',
        'Start top-level Python statements at column 1 with no leading spaces.'
      );
    }

    const { stmts } = parseBlock(lines, 0, 0);

    const execStmts = (block: Stmt[]): void => {
      for (const stmt of block) {
        stepsExecuted++;
        if (stepsExecuted > MAX_STEPS) {
          throw new PyRuntimeError(
            'InfiniteLoopGuard',
            stmt.line,
            'Execution stopped after 4,000 steps to prevent an infinite loop.',
            'Check your while loop condition and make sure your loop counter updates each iteration (e.g., count += 1).'
          );
        }

        if (stmt.kind === 'pass') continue;
        if (stmt.kind === 'break') throw new BreakSignal();
        if (stmt.kind === 'continue') throw new ContinueSignal();

        if (stmt.kind === 'assign') {
          const val = evalExpression(stmt.expr, env, stmt.line, outputChunks);
          if (stmt.op === '=') {
            env[stmt.target] = val;
          } else {
            if (!(stmt.target in env)) {
              throw new PyRuntimeError(
                'NameError',
                stmt.line,
                `Variable '${stmt.target}' is used before assignment.`,
                `Initialize '${stmt.target}' before using '${stmt.op}'.`
              );
            }
            const cur = env[stmt.target];
            if (typeof cur === 'number' && typeof val === 'number') {
              if (stmt.op === '+=') env[stmt.target] = cur + val;
              else if (stmt.op === '-=') env[stmt.target] = cur - val;
              else if (stmt.op === '*=') env[stmt.target] = cur * val;
              else if (stmt.op === '/=') env[stmt.target] = cur / val;
              else if (stmt.op === '//=') env[stmt.target] = Math.floor(cur / val);
              else if (stmt.op === '%=') env[stmt.target] = cur % val;
            } else if (stmt.op === '+=' && typeof cur === 'string' && typeof val === 'string') {
              env[stmt.target] = cur + val;
            } else {
              throw new PyRuntimeError('TypeError', stmt.line, `Unsupported types for ${stmt.op}.`, 'Check variable types.');
            }
          }
          continue;
        }

        if (stmt.kind === 'expr') {
          evalExpression(stmt.expr, env, stmt.line, outputChunks);
          continue;
        }

        if (stmt.kind === 'if') {
          for (const branch of stmt.branches) {
            if (branch.cond === null || isTruthy(evalExpression(branch.cond, env, branch.line, outputChunks))) {
              execStmts(branch.body);
              break;
            }
          }
          continue;
        }

        if (stmt.kind === 'for') {
          const iterable = evalExpression(stmt.iterExpr, env, stmt.line, outputChunks);
          let items: PyValue[] = [];
          if (Array.isArray(iterable)) {
            items = iterable;
          } else if (typeof iterable === 'string') {
            items = iterable.split('');
          } else {
            throw new PyRuntimeError(
              'TypeError',
              stmt.line,
              'Object is not iterable in for loop.',
              'Use range(...), a list [...], or a string after "in".'
            );
          }

          for (const item of items) {
            stepsExecuted++;
            if (stepsExecuted > MAX_STEPS) {
              throw new PyRuntimeError(
                'InfiniteLoopGuard',
                stmt.line,
                'Loop exceeded 4,000 steps.',
                'Reduce the range size so the simulation finishes quickly.'
              );
            }
            env[stmt.target] = item;
            try {
              execStmts(stmt.body);
            } catch (sig) {
              if (sig instanceof BreakSignal) break;
              if (sig instanceof ContinueSignal) continue;
              throw sig;
            }
          }
          continue;
        }

        if (stmt.kind === 'while') {
          while (isTruthy(evalExpression(stmt.cond, env, stmt.line, outputChunks))) {
            stepsExecuted++;
            if (stepsExecuted > MAX_STEPS) {
              throw new PyRuntimeError(
                'InfiniteLoopGuard',
                stmt.line,
                'While loop stopped after 4,000 steps (possible infinite loop).',
                'Make sure the condition eventually becomes False by updating the loop variable inside the loop.'
              );
            }
            try {
              execStmts(stmt.body);
            } catch (sig) {
              if (sig instanceof BreakSignal) break;
              if (sig instanceof ContinueSignal) continue;
              throw sig;
            }
          }
        }
      }
    };

    try {
      execStmts(stmts);
    } catch (sig) {
      if (sig instanceof BreakSignal || sig instanceof ContinueSignal) {
        throw new PyRuntimeError('SyntaxError', 1, "'break' or 'continue' outside loop.", 'Only use break or continue inside a for or while loop.');
      }
      throw sig;
    }

    return {
      success: true,
      output: outputChunks.join(''),
      stepsExecuted,
    };
  } catch (err) {
    if (err instanceof PyRuntimeError) {
      return {
        success: false,
        output: outputChunks.join(''),
        error: {
          type: err.errorType,
          line: err.line,
          message: err.message,
          hint: err.hint,
        },
        stepsExecuted,
      };
    }
    return {
      success: false,
      output: outputChunks.join(''),
      error: {
        type: 'Error',
        line: 1,
        message: err instanceof Error ? err.message : 'Unexpected execution error.',
        hint: 'Check your Python syntax, colons, and indentation.',
      },
      stepsExecuted,
    };
  }
}
