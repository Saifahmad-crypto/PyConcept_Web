import React from 'react';
import { TutorCodePanel } from './TutorCodePanel';

interface TutorMessageContentProps {
  content: string;
  onOpenInPlayground?: (code: string) => void;
}

function renderInlineFormatting(text: string): React.ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={idx}
          className="rounded border border-[#E5DFDF]/70 bg-[#FFF1F1] px-1.5 py-0.5 font-mono text-[12px] font-semibold text-[#100303]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={idx} className="font-semibold text-[#100303]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function renderTextBlock(block: string, keyPrefix: string): React.ReactNode {
  const lines = block.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listOrdered = false;

  const flushList = (idx: number) => {
    if (listItems.length === 0) return;
    if (listOrdered) {
      elements.push(
        <ol key={`${keyPrefix}-ol-${idx}`} className="my-2 list-decimal space-y-1.5 pl-5 text-sm text-[#100303]">
          {listItems.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ol>
      );
    } else {
      elements.push(
        <ul key={`${keyPrefix}-ul-${idx}`} className="my-2 list-disc space-y-1.5 pl-5 text-sm text-[#100303]">
          {listItems.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ul>
      );
    }
    listItems = [];
  };

  lines.forEach((rawLine, idx) => {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      flushList(idx);
      return;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushList(idx);
      elements.push(
        <h4
          key={`${keyPrefix}-h-${idx}`}
          className="mt-3 mb-1 font-display text-sm font-bold text-[#100303]"
        >
          {renderInlineFormatting(headingMatch[2])}
        </h4>
      );
      return;
    }

    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      if (listItems.length > 0 && listOrdered) flushList(idx);
      listOrdered = false;
      listItems.push(bulletMatch[1]);
      return;
    }

    const numMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (numMatch) {
      if (listItems.length > 0 && !listOrdered) flushList(idx);
      listOrdered = true;
      listItems.push(numMatch[1]);
      return;
    }

    flushList(idx);
    elements.push(
      <p key={`${keyPrefix}-p-${idx}`} className="my-1.5 text-sm leading-relaxed text-[#100303]">
        {renderInlineFormatting(trimmed)}
      </p>
    );
  });

  flushList(lines.length);
  return elements;
}

export const TutorMessageContent: React.FC<TutorMessageContentProps> = ({
  content,
  onOpenInPlayground,
}) => {
  // Split fenced code blocks ```lang\n...\n```
  const segments: Array<{ type: 'text' | 'code'; lang?: string; body: string }> = [];
  const fenceRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = fenceRegex.exec(content)) !== null) {
    if (match.index > lastIdx) {
      segments.push({ type: 'text', body: content.slice(lastIdx, match.index) });
    }
    segments.push({
      type: 'code',
      lang: match[1] || 'python',
      body: match[2],
    });
    lastIdx = fenceRegex.lastIndex;
  }

  if (lastIdx < content.length) {
    const tail = content.slice(lastIdx);
    // Handle still-streaming unclosed code fence gracefully
    const unclosedMatch = tail.match(/^([\s\S]*?)```([a-zA-Z0-9_-]*)\n([\s\S]*)$/);
    if (unclosedMatch) {
      if (unclosedMatch[1]) {
        segments.push({ type: 'text', body: unclosedMatch[1] });
      }
      segments.push({
        type: 'code',
        lang: unclosedMatch[2] || 'python',
        body: unclosedMatch[3],
      });
    } else {
      segments.push({ type: 'text', body: tail });
    }
  }

  return (
    <div className="space-y-1">
      {segments.map((seg, idx) =>
        seg.type === 'code' ? (
          <TutorCodePanel
            key={idx}
            code={seg.body}
            language={seg.lang}
            onOpenInPlayground={onOpenInPlayground}
          />
        ) : (
          <React.Fragment key={idx}>{renderTextBlock(seg.body, `seg-${idx}`)}</React.Fragment>
        )
      )}
    </div>
  );
};
