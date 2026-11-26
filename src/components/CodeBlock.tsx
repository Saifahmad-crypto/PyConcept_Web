import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  activeLine?: number;
  title?: string;
  showCopy?: boolean;
  compact?: boolean;
}

const KEYWORDS = new Set([
  'if',
  'elif',
  'else',
  'for',
  'while',
  'in',
  'and',
  'or',
  'not',
  'break',
  'continue',
  'pass',
  'def',
  'return',
  'True',
  'False',
  'None',
]);

const BUILTINS = new Set([
  'print',
  'input',
  'range',
  'len',
  'int',
  'str',
  'float',
  'bool',
  'abs',
  'min',
  'max',
  'sum',
  'type',
]);

function highlightPythonLine(line: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < line.length) {
    if (line[i] === '#') {
      tokens.push(
        <span key={key++} className="text-[#8A8585] italic">
          {line.slice(i)}
        </span>
      );
      break;
    }

    if (
      (line[i] === 'f' && (line[i + 1] === '"' || line[i + 1] === "'")) ||
      line[i] === '"' ||
      line[i] === "'"
    ) {
      const start = i;
      if (line[i] === 'f') i++;
      const quote = line[i];
      i++;
      while (i < line.length && line[i] !== quote) {
        if (line[i] === '\\' && i + 1 < line.length) i += 2;
        else i++;
      }
      if (i < line.length) i++;
      tokens.push(
        <span key={key++} className="text-emerald-300">
          {line.slice(start, i)}
        </span>
      );
      continue;
    }

    if (/[0-9]/.test(line[i]) && (i === 0 || !/[A-Za-z0-9_]/.test(line[i - 1]))) {
      const start = i;
      while (i < line.length && /[0-9.]/.test(line[i])) i++;
      tokens.push(
        <span key={key++} className="text-amber-300">
          {line.slice(start, i)}
        </span>
      );
      continue;
    }

    if (/[A-Za-z_]/.test(line[i])) {
      const start = i;
      while (i < line.length && /[A-Za-z0-9_]/.test(line[i])) i++;
      const word = line.slice(start, i);
      if (KEYWORDS.has(word)) {
        tokens.push(
          <span key={key++} className="font-semibold text-[#FF6B6B]">
            {word}
          </span>
        );
      } else if (BUILTINS.has(word)) {
        tokens.push(
          <span key={key++} className="text-[#FBF5F9] underline decoration-[#E10906]/60 underline-offset-2">
            {word}
          </span>
        );
      } else {
        tokens.push(
          <span key={key++} className="text-[#F1EEEE]">
            {word}
          </span>
        );
      }
      continue;
    }

    if ('=<>!+-*/%:'.includes(line[i])) {
      tokens.push(
        <span key={key++} className="text-[#FF8A88]">
          {line[i]}
        </span>
      );
      i++;
      continue;
    }

    tokens.push(<span key={key++}>{line[i]}</span>);
    i++;
  }

  return tokens.length > 0 ? tokens : [<span key="empty">&nbsp;</span>];
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  activeLine,
  title = 'Python',
  showCopy = true,
  compact = false,
}) => {
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[#2C1616] bg-[#100303] shadow-sm">
      <div className="flex items-center justify-between border-b border-[#2C1616] bg-[#190909] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#E10906]" aria-hidden="true" />
          <span className="font-mono text-xs font-medium text-[#FBF5F9]">{title}</span>
        </div>
        {showCopy && (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-[#8A8585] transition-colors hover:bg-[#2C1616] hover:text-[#FBF5F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10906]"
            aria-label="Copy code snippet"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>
      <div
        className={`overflow-x-auto font-mono text-[13px] leading-relaxed ${
          compact ? 'py-2.5' : 'py-3.5'
        }`}
      >
        {lines.map((line, idx) => {
          const lineNum = idx + 1;
          const isCurrent = activeLine === lineNum;
          return (
            <div
              key={lineNum}
              className={`flex items-start px-4 transition-colors duration-150 ${
                isCurrent
                  ? 'border-l-2 border-[#E10906] bg-[#E10906]/20 text-white'
                  : 'hover:bg-[#190909]'
              }`}
            >
              <span
                className={`mr-4 w-5 shrink-0 select-none text-right tabular-nums text-xs leading-relaxed ${
                  isCurrent ? 'font-bold text-[#FF6B6B]' : 'text-[#8A8585]'
                }`}
              >
                {lineNum}
              </span>
              <pre className="whitespace-pre font-mono text-[#FBF5F9]">
                {highlightPythonLine(line)}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};
