// Python Code <-> Logic Blocks Bi-directional Parser & Compiler
import { LogicBlock, SystemInputConfig } from './projectStorage';

export interface ParseResult {
  success: boolean;
  blocks: LogicBlock[];
  inputs: SystemInputConfig[];
  error?: string;
  errorLine?: number;
}

/**
 * Parses Python source code into structured PyVerse LogicBlock hierarchy.
 * Supports:
 * - Variable initializations (e.g. `hasPass = True`, `temp = 28`, `mode = "ECO"`)
 * - If / Else conditional statements (including nested conditionals)
 * - For loops (`for cycle in range(1, 5):`, `for i in range(3):`)
 * - Action assignments & function calls (`barrier = "OPEN"`, `print("...")`, `fan = 3`)
 */
export function parsePythonToBlocks(code: string, currentInputs: SystemInputConfig[] = []): ParseResult {
  const lines = code.split('\n');
  const detectedInputs: Record<string, any> = {};
  
  // Clone inputs dictionary
  currentInputs.forEach(inp => {
    detectedInputs[inp.id] = inp.currentValue;
  });

  try {
    interface RawLine {
      raw: string;
      trimmed: string;
      indent: number;
      lineNum: number;
    }

    const cleanedLines: RawLine[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Skip empty lines or pure comments (except header comments)
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      // Calculate 4-space or tab indent level
      const matchIndent = line.match(/^(\s*)/);
      const leadingSpaces = matchIndent ? matchIndent[1].replace(/\t/g, '    ').length : 0;
      const indent = Math.floor(leadingSpaces / 4);

      cleanedLines.push({
        raw: line,
        trimmed,
        indent,
        lineNum: i + 1
      });
    }

    // Helper to generate IDs
    let idCounter = 1;
    const nextId = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${idCounter++}`;

    // Recursive block parser based on indentation
    function parseBlockRange(startIdx: number, targetIndent: number): { blocks: LogicBlock[]; nextIdx: number } {
      const resultBlocks: LogicBlock[] = [];
      let idx = startIdx;

      while (idx < cleanedLines.length) {
        const item = cleanedLines[idx];

        if (item.indent < targetIndent) {
          // Dedent encountered, finish current block
          break;
        }

        if (item.indent > targetIndent) {
          // Extra indentation without statement, skip or advance
          idx++;
          continue;
        }

        const stmt = item.trimmed;

        // 1. Detect Variable Declarations / Sensor Inputs at root
        if (targetIndent === 0 && stmt.includes('=') && !stmt.startsWith('if ') && !stmt.startsWith('for ')) {
          const parts = stmt.split('=');
          if (parts.length === 2) {
            const varName = parts[0].trim();
            const rawVal = parts[1].trim();
            let parsedVal: any = rawVal;

            if (rawVal === 'True') parsedVal = true;
            else if (rawVal === 'False') parsedVal = false;
            else if (!isNaN(Number(rawVal))) parsedVal = Number(rawVal);
            else parsedVal = rawVal.replace(/['"]/g, '');

            detectedInputs[varName] = parsedVal;
          }
        }

        // 2. Condition statement (if ...)
        if (stmt.startsWith('if ')) {
          const condExpr = stmt.replace(/^if\s+/, '').replace(/:$/, '').trim();
          
          // Parse operator and variable
          const opMatch = condExpr.match(/(==|!=|>=|<=|>|<)/);
          let varName = condExpr;
          let operator: any = '==';
          let conditionVal: any = 'True';

          if (opMatch) {
            operator = opMatch[0];
            const condParts = condExpr.split(operator);
            varName = condParts[0].trim();
            conditionVal = condParts[1].trim();
          }

          idx++; // Move past 'if' header
          const { blocks: trueBranch, nextIdx: afterTrueIdx } = parseBlockRange(idx, targetIndent + 1);
          idx = afterTrueIdx;

          let elseBranch: LogicBlock[] = [];
          if (idx < cleanedLines.length && cleanedLines[idx].indent === targetIndent && cleanedLines[idx].trimmed.startsWith('else:')) {
            idx++; // Move past 'else:' header
            const { blocks: falseBranch, nextIdx: afterFalseIdx } = parseBlockRange(idx, targetIndent + 1);
            elseBranch = falseBranch;
            idx = afterFalseIdx;
          }

          resultBlocks.push({
            id: nextId('b_cond'),
            type: 'condition',
            label: `If ${condExpr}`,
            variableName: varName,
            operator,
            conditionValue: conditionVal,
            children: trueBranch,
            elseChildren: elseBranch
          });
          continue;
        }

        // 3. Loop statement (for ... in range(...))
        if (stmt.startsWith('for ')) {
          const rangeMatch = stmt.match(/range\(([^)]+)\)/);
          let iterations = 3;
          if (rangeMatch) {
            const rangeArgs = rangeMatch[1].split(',').map(s => s.trim());
            if (rangeArgs.length === 1 && !isNaN(Number(rangeArgs[0]))) {
              iterations = Math.max(1, parseInt(rangeArgs[0], 10));
            } else if (rangeArgs.length === 2 && !isNaN(Number(rangeArgs[1]))) {
              const stop = parseInt(rangeArgs[1], 10);
              const start = parseInt(rangeArgs[0], 10) || 0;
              iterations = Math.max(1, stop - start);
            }
          }

          const loopLabel = stmt.replace(/:$/, '').trim();
          idx++;
          const { blocks: loopChildren, nextIdx: afterLoopIdx } = parseBlockRange(idx, targetIndent + 1);
          idx = afterLoopIdx;

          resultBlocks.push({
            id: nextId('b_loop'),
            type: 'loop',
            label: loopLabel,
            iterations,
            children: loopChildren
          });
          continue;
        }

        // 4. Action / Assignment / Print Statement
        if (stmt.startsWith('print(')) {
          const printContent = stmt.replace(/^print\(/, '').replace(/\)$/, '').replace(/['"]/g, '');
          resultBlocks.push({
            id: nextId('b_act'),
            type: 'action',
            label: printContent.length > 28 ? printContent.substring(0, 25) + '...' : printContent,
            actionCode: stmt
          });
          idx++;
          continue;
        }

        // General Action Statement
        resultBlocks.push({
          id: nextId('b_act'),
          type: 'action',
          label: stmt.length > 32 ? stmt.substring(0, 29) + '...' : stmt,
          actionCode: stmt
        });
        idx++;
      }

      return { blocks: resultBlocks, nextIdx: idx };
    }

    const { blocks: parsedBlocks } = parseBlockRange(0, 0);

    // Ensure Start and End blocks exist at root
    const finalBlocks: LogicBlock[] = [];
    const hasStart = parsedBlocks.some(b => b.type === 'start');
    const hasEnd = parsedBlocks.some(b => b.type === 'end');

    if (!hasStart) {
      finalBlocks.push({
        id: nextId('b_start'),
        type: 'start',
        label: 'System Boot & Initialization'
      });
    }

    parsedBlocks.forEach(b => {
      // Don't duplicate root variable declarations if they were parsed
      if (b.type === 'action' && b.actionCode && b.actionCode.includes('=') && !b.actionCode.includes('(') && b.actionCode.split('=').length === 2) {
        const varName = b.actionCode.split('=')[0].trim();
        if (varName in detectedInputs && !b.actionCode.includes('+') && !b.actionCode.includes('-')) {
          // This was a top-level input initialization, we keep it in inputs config
          return;
        }
      }
      finalBlocks.push(b);
    });

    if (!hasEnd) {
      finalBlocks.push({
        id: nextId('b_end'),
        type: 'end',
        label: 'Log Event & Cycle End'
      });
    }

    // Merge detected inputs with current inputs
    const updatedInputs: SystemInputConfig[] = [...currentInputs];
    Object.entries(detectedInputs).forEach(([key, val]) => {
      const existing = updatedInputs.find(inp => inp.id === key);
      if (existing) {
        existing.currentValue = val;
      } else {
        const type = typeof val === 'boolean' ? 'boolean' : typeof val === 'number' ? 'number' : 'select';
        updatedInputs.push({
          id: key,
          label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          type,
          defaultValue: val,
          currentValue: val,
          min: type === 'number' ? 0 : undefined,
          max: type === 'number' ? Math.max(100, Number(val) * 2) : undefined
        });
      }
    });

    return {
      success: true,
      blocks: finalBlocks,
      inputs: updatedInputs
    };
  } catch (err: any) {
    return {
      success: false,
      blocks: [],
      inputs: currentInputs,
      error: err.message || 'Failed to parse Python code.'
    };
  }
}
