import React, { useState } from 'react';
import { Copy, Check, Play } from 'lucide-react';

interface TutorCodePanelProps {
  code: string;
  language?: string;
  onOpenInPlayground?: (code: string) => void;
}

const PY_KEYWORDS = new Set([
  'if',
  'elif',
  'else',
  'for',
  'in',
  'while',
  'break',
  'continue',
  'and',
  'or',
  'not',
  'True',
  'False',
  'None',
  'def',
  'return',
  'pass',
]);

const PY_BUILTINS = new Set([
  'print',
  'range',
  'len',
  'input',
  'int',
  'float',
  'str',
  'bool',
  'abs',
  'min',
  'max',
  'sum',
]);

function highlightPythonLine(line: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const regex =
    /(#.*$|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let k = 0;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(line.slice(lastIndex, match.index));
    }
    const word = match[0];
    if (word.startsWith('#')) {
      tokens.push(
        <span key={k++} className="text-[#8A8585] italic">
          {word}
        </span>
      );
    } else if (word.startsWith('"') || word.startsWith("'")) {
      tokens.push(
        <span key={k++} className="text-emerald-300">
          {word}
        </span>
      );
    } else if (/^\d/.test(word)) {
      tokens.push(
        <span key={k++} className="text-amber-300">
          {word}
        </span>
      );
    } else if (PY_KEYWORDS.has(word)) {
      tokens.push(
        <span key={k++} className="font-semibold text-[#FF6B6B]">
          {word}
        </span>
      );
    } else if (PY_BUILTINS.has(word)) {
      tokens.push(
        <span key={k++} className="text-[#E10906]">
          {word}
        </span>
      );
    } else {
      tokens.push(
        <span key={k++} className="text-[#FBF5F9]">
          {word}
        </span>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    tokens.push(line.slice(lastIndex));
  }
  return tokens;
}

export const TutorCodePanel: React.FC<TutorCodePanelProps> = ({
  code,
  language = 'python',
  onOpenInPlayground,
}) => {
  const [copied, setCopied] = useState(false);
  const cleanCode = code.replace(/\n$/, '');
  const lines = cleanCode.split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard fallback ignored
    }
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-[#E5DFDF] bg-[#100303] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2C1616] bg-[#190909] px-3.5 py-2 text-xs">
        <span className="font-mono font-medium text-[#E10906]">{language || 'python'}</span>
        <div className="flex items-center gap-2">
          {onOpenInPlayground && (
            <button
              type="button"
              onClick={() => onOpenInPlayground(cleanCode)}
              className="inline-flex items-center gap-1 rounded-lg bg-[#E10906] px-2.5 py-1 text-[11px] font-semibold text-white transition-opacity hover:opacity-95 whitespace-nowrap"
            >
              <Play className="h-3 w-3" aria-hidden="true" />
              Test in Playground
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-lg border border-[#2C1616] bg-[#190909]/80 px-2.5 py-1 text-[11px] font-medium text-[#CFC8C8] transition-colors hover:text-white whitespace-nowrap"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" aria-hidden="true" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto py-3 font-mono text-xs sm:text-[13px] leading-6">
        {lines.map((line, idx) => (
          <div key={idx} className="flex px-3 hover:bg-[#190909]/40">
            <span className="w-7 shrink-0 select-none pr-3 text-right text-[#8A8585] tabular-nums">
              {idx + 1}
            </span>
            <pre className="whitespace-pre text-[#FBF5F9]">
              {line.length > 0 ? highlightPythonLine(line) : ' '}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};
