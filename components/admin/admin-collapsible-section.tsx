"use client";

import { useCallback, useState, type ReactNode } from "react";

type AdminCollapsibleSectionProps = {
  label: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

const summaryClassName =
  "text-keep flex w-full cursor-pointer list-none items-center rounded-sm px-5 py-4 text-base font-medium text-ink transition hover:bg-paper/70 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent marker:content-none [&::-webkit-details-marker]:hidden";

export function AdminCollapsibleSection({
  label,
  children,
  className = "rounded border border-line bg-paper-muted",
  contentClassName = "px-5 pb-5",
}: AdminCollapsibleSectionProps) {
  const [open, setOpen] = useState(false);

  const handleToggle = useCallback(
    (event: React.SyntheticEvent<HTMLDetailsElement>) => {
      setOpen(event.currentTarget.open);
    },
    [],
  );

  const actionLabel = open ? "숨기기" : "보기";
  const indicator = open ? "▼" : "▶";

  return (
    <details className={className} onToggle={handleToggle}>
      <summary className={summaryClassName}>
        <span aria-hidden="true" className="mr-2 text-sm text-ink-muted">
          {indicator}
        </span>
        {label} {actionLabel}
      </summary>
      <div className={contentClassName}>{children}</div>
    </details>
  );
}
