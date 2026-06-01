"use client";

import { useState } from "react";

type CitationBlockProps = {
  citation: string;
};

export function CitationBlock({ citation }: CitationBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section aria-labelledby="essay-citation-heading">
      <h2
        className="text-xs tracking-[0.14em] text-accent uppercase"
        id="essay-citation-heading"
      >
        인용
      </h2>
      <div className="mt-3 border border-line bg-paper-muted px-5 py-4">
        <p className="text-sm leading-7 text-ink-muted">{citation}</p>
        <button
          className="mt-3 text-sm text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          onClick={handleCopy}
          type="button"
        >
          {copied ? "복사됨" : "복사"}
        </button>
      </div>
    </section>
  );
}
