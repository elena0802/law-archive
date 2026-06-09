"use client";

import { useState } from "react";

type ScholarDnaShareActionsProps = {
  shareUrl: string;
};

const buttonClassName =
  "border border-line px-4 py-2 text-sm text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60";

export function ScholarDnaShareActions({ shareUrl }: ScholarDnaShareActionsProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 2400);
    } catch {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 2400);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button className={buttonClassName} onClick={handleCopyLink} type="button">
        {copyStatus === "copied"
          ? "링크가 복사되었습니다"
          : copyStatus === "failed"
            ? "복사에 실패했습니다"
            : "링크 복사"}
      </button>
      <button
        className={buttonClassName}
        disabled
        title="PR52.2에서 제공 예정"
        type="button"
      >
        이미지 저장 (준비 중)
      </button>
    </div>
  );
}
