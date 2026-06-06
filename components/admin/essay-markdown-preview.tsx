"use client";

import { useMemo } from "react";

type MarkdownNode =
  | { type: "h1" | "h2" | "p" | "quote"; content: string; key: string }
  | { type: "hr"; key: string }
  | { type: "list"; items: string[]; key: string };

export function formatEssayCharacterCount(text: string) {
  return new Intl.NumberFormat("ko-KR").format(
    text.replace(/\s+/g, "").length,
  );
}

export function estimateEssayReadingMinutes(text: string) {
  const chars = text.replace(/\s+/g, "").length;
  return Math.max(1, Math.ceil(chars / 600));
}

function markdownToNodes(source: string): MarkdownNode[] {
  const lines = source.split("\n");
  const nodes: MarkdownNode[] = [];
  let idx = 0;

  while (idx < lines.length) {
    const line = lines[idx]?.trimEnd() ?? "";

    if (!line.trim()) {
      idx += 1;
      continue;
    }

    if (line === "---") {
      nodes.push({ type: "hr", key: `hr-${idx}` });
      idx += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      nodes.push({
        type: "h1",
        content: line.slice(2).trim(),
        key: `h1-${idx}`,
      });
      idx += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      nodes.push({
        type: "h2",
        content: line.slice(3).trim(),
        key: `h2-${idx}`,
      });
      idx += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (idx < lines.length && lines[idx].trimStart().startsWith("- ")) {
        items.push(lines[idx].trimStart().slice(2).trim());
        idx += 1;
      }
      nodes.push({ type: "list", items, key: `list-${idx}` });
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (idx < lines.length && lines[idx].trimStart().startsWith("> ")) {
        quoteLines.push(lines[idx].trimStart().slice(2).trim());
        idx += 1;
      }
      nodes.push({
        type: "quote",
        content: quoteLines.join(" "),
        key: `quote-${idx}`,
      });
      continue;
    }

    const paragraphLines: string[] = [line.trim()];
    idx += 1;
    while (idx < lines.length && lines[idx].trim()) {
      const next = lines[idx].trim();
      if (
        next.startsWith("# ") ||
        next.startsWith("## ") ||
        next.startsWith("- ") ||
        next.startsWith("> ") ||
        next === "---"
      ) {
        break;
      }
      paragraphLines.push(next);
      idx += 1;
    }
    nodes.push({
      type: "p",
      content: paragraphLines.join(" "),
      key: `p-${idx}`,
    });
  }

  return nodes;
}

export function EssayMarkdownPreview({ source }: { source: string }) {
  const nodes = useMemo(() => markdownToNodes(source), [source]);

  if (!source.trim()) {
    return (
      <p className="text-keep text-base leading-8 text-ink-muted">
        본문을 입력하면 여기에 미리보기가 표시됩니다.
      </p>
    );
  }

  return (
    <div className="archive-prose">
      {nodes.map((node) => {
        if (node.type === "h1") {
          return (
            <h1 className="text-keep mt-8 font-serif text-3xl text-ink" key={node.key}>
              {node.content}
            </h1>
          );
        }
        if (node.type === "h2") {
          return (
            <h2 className="text-keep mt-8 font-serif text-2xl text-ink" key={node.key}>
              {node.content}
            </h2>
          );
        }
        if (node.type === "list") {
          return (
            <ul className="mt-4 list-disc space-y-2 pl-6" key={node.key}>
              {node.items.map((item, itemIdx) => (
                <li className="text-keep text-ink" key={`${node.key}-${itemIdx}`}>
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        if (node.type === "quote") {
          return (
            <blockquote
              className="text-keep mt-4 border-l-2 border-line pl-4 italic text-ink-muted"
              key={node.key}
            >
              {node.content}
            </blockquote>
          );
        }
        if (node.type === "hr") {
          return <hr className="my-8 border-line" key={node.key} />;
        }
        return (
          <p className="text-keep mt-4 leading-8 text-ink" key={node.key}>
            {node.content}
          </p>
        );
      })}
    </div>
  );
}
