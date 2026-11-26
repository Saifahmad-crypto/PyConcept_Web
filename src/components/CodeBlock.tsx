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
  'True',
  'False',
  'None',
]);

const BUILTINS = new Set([
  'print',
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
]);

function highlightPythonLine(line: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < line.length) {
    if (line[i] === '#') {
      tokens.push(
        <span key={key++} className="text-slate-400 italic">
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
          <span key={key++} className="text-violet-300 font-semibold">
            {word}
          </span>
        );
      } else if (BUILTINS.has(word)) {
        tokens.push(
          <span key={key++} className="text-sky-300">
            {word}
          </span>
        );
      } else {
        tokens.push(
          <span key={key++} className="text-slate-100">
            {word}
          </span>
        );
      }
      continue;
    }

    if ('=<>!+-*/%:'.includes(line[i])) {
      tokens.push(
        <span key={key++} className="text-sky-400">
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
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-[#0F172A] shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#1E293B] px-4 py-2.5">
        <span className="font-mono text-xs font-medium text-slate-300">{title}</span>
        {showCopy && (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
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
                  ? 'bg-gradient-to-r from-sky-500/25 to-violet-500/20 text-white'
                  : 'hover:bg-slate-800/40'
              }`}
            >
              <span
                className={`mr-4 w-5 shrink-0 select-none text-right tabular-nums text-xs leading-relaxed ${
                  isCurrent ? 'font-bold text-sky-300' : 'text-slate-500'
                }`}
              >
                {lineNum}
              </span>
              <pre className="whitespace-pre font-mono text-slate-100">
                {highlightPythonLine(line)}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};
