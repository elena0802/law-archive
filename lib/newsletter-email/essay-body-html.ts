import { escapeNewsletterHtml } from "@/lib/newsletter-email/html-utils";

const PROSE_PARAGRAPH =
  "margin:0 0 1.25rem;font-size:1rem;line-height:1.85;color:#1d1a15;";
const PROSE_HEADING =
  "margin:2rem 0 1rem;font-family:Georgia,'Times New Roman',serif;font-size:1.375rem;font-weight:400;line-height:1.35;color:#1d1a15;";
const PROSE_SUBHEADING =
  "margin:1.5rem 0 0.75rem;font-family:Georgia,'Times New Roman',serif;font-size:1.125rem;font-weight:400;line-height:1.4;color:#1d1a15;";

function looksLikeHtml(content: string) {
  return /^</.test(content.trim());
}

function normalizeSiteUrl(siteOrigin: string, href: string) {
  const trimmed = href.trim();
  if (!trimmed) {
    return trimmed;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return `${siteOrigin.replace(/\/$/, "")}${trimmed}`;
  }

  return trimmed;
}

function inlineMarkdownToHtml(text: string, siteOrigin: string) {
  let html = escapeNewsletterHtml(text);
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match, label: string, href: string) => {
      const safeHref = escapeNewsletterHtml(normalizeSiteUrl(siteOrigin, href));
      return `<a href="${safeHref}" style="color:#68462d;text-decoration:underline;">${escapeNewsletterHtml(label)}</a>`;
    },
  );
  return html;
}

function stripMdxComponents(content: string) {
  return content
    .replace(/<[^>]+\/>/g, "")
    .replace(/<([A-Za-z][\w-]*)[^>]*>([\s\S]*?)<\/\1>/g, "$2");
}

function renderParagraph(text: string, siteOrigin: string) {
  return `<p style="${PROSE_PARAGRAPH}">${inlineMarkdownToHtml(text, siteOrigin)}</p>`;
}

function renderHeading(level: 2 | 3, text: string, siteOrigin: string) {
  const style = level === 2 ? PROSE_HEADING : PROSE_SUBHEADING;
  const tag = level === 2 ? "h2" : "h3";
  return `<${tag} style="${style}">${inlineMarkdownToHtml(text, siteOrigin)}</${tag}>`;
}

function renderList(lines: string[], ordered: boolean, siteOrigin: string) {
  const tag = ordered ? "ol" : "ul";
  const items = lines
    .map((line) => {
      const text = line.replace(/^\d+\.\s+/, "").replace(/^[-*]\s+/, "");
      return `<li style="margin:0 0 0.5rem;line-height:1.8;color:#1d1a15;">${inlineMarkdownToHtml(text, siteOrigin)}</li>`;
    })
    .join("");

  return `<${tag} style="margin:0 0 1.25rem;padding-left:1.25rem;">${items}</${tag}>`;
}

function markdownToEmailHtml(markdown: string, siteOrigin: string) {
  const normalized = stripMdxComponents(markdown).replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return "";
  }

  const blocks = normalized.split(/\n{2,}/);
  const parts: string[] = [];

  for (const block of blocks) {
    const lines = block.split("\n").map((line) => line.trimEnd());
    const firstLine = lines[0]?.trim() ?? "";

    if (!firstLine) {
      continue;
    }

    if (firstLine.startsWith("### ")) {
      parts.push(renderHeading(3, firstLine.slice(4).trim(), siteOrigin));
      continue;
    }

    if (firstLine.startsWith("## ")) {
      parts.push(renderHeading(2, firstLine.slice(3).trim(), siteOrigin));
      continue;
    }

    if (firstLine.startsWith("# ")) {
      parts.push(renderHeading(2, firstLine.slice(2).trim(), siteOrigin));
      continue;
    }

    if (lines.every((line) => /^[-*]\s+/.test(line.trim()))) {
      parts.push(renderList(lines, false, siteOrigin));
      continue;
    }

    if (lines.every((line) => /^\d+\.\s+/.test(line.trim()))) {
      parts.push(renderList(lines, true, siteOrigin));
      continue;
    }

    if (firstLine.startsWith(">")) {
      const quote = lines
        .map((line) => line.replace(/^>\s?/, ""))
        .join(" ")
        .trim();
      parts.push(
        `<blockquote style="margin:0 0 1.25rem;padding:0.75rem 1rem;border-left:3px solid #d9cbb7;color:#655d52;">${inlineMarkdownToHtml(quote, siteOrigin)}</blockquote>`,
      );
      continue;
    }

    if (/^---+$/.test(firstLine)) {
      parts.push(
        `<hr style="margin:2rem 0;border:0;border-top:1px solid #d9cbb7;" />`,
      );
      continue;
    }

    parts.push(renderParagraph(lines.join("\n").trim(), siteOrigin));
  }

  return parts.join("");
}

function sanitizeEmailHtml(html: string, siteOrigin: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(
      /href="(\/[^"]*)"/g,
      (_match, path: string) => `href="${escapeNewsletterHtml(normalizeSiteUrl(siteOrigin, path))}"`,
    );
}

export function essayBodyToEmailHtml(content: string, siteOrigin: string) {
  const trimmed = content.trim();
  if (!trimmed) {
    return "";
  }

  if (looksLikeHtml(trimmed)) {
    return sanitizeEmailHtml(trimmed, siteOrigin);
  }

  return markdownToEmailHtml(trimmed, siteOrigin);
}

export function essayBodyToPlainText(content: string) {
  return stripMdxComponents(content)
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*]\s+/gm, "• ")
    .replace(/^>\s?/gm, "")
    .replace(/\r\n/g, "\n")
    .trim();
}
