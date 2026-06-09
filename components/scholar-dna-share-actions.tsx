"use client";

import { useRef, useState } from "react";
import { ScholarDnaShareCard } from "@/components/scholar-dna-share-card";
import {
  downloadScholarDnaShareCard,
  type ScholarDnaShareCardData,
} from "@/lib/scholar-dna-share-card";

type ScholarDnaShareActionsProps = {
  shareUrl: string;
  cardData: ScholarDnaShareCardData;
};

const buttonClassName =
  "border border-line px-4 py-2 text-sm text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60";

function getSiteHost(shareUrl: string) {
  try {
    return new URL(shareUrl).host.replace(/^www\./, "");
  } catch {
    return "jurachun.com";
  }
}

export function ScholarDnaShareActions({
  shareUrl,
  cardData,
}: ScholarDnaShareActionsProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const [imageStatus, setImageStatus] = useState<
    "idle" | "generating" | "failed"
  >("idle");

  const siteHost = getSiteHost(shareUrl);

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

  async function handleSaveImage() {
    if (!cardRef.current) {
      return;
    }

    setImageStatus("generating");

    try {
      await downloadScholarDnaShareCard(cardRef.current, cardData.name);
      setImageStatus("idle");
    } catch (error) {
      console.error("[ScholarDnaShareActions] image export failed:", error);
      setImageStatus("failed");
      window.setTimeout(() => setImageStatus("idle"), 2400);
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          className={buttonClassName}
          onClick={handleCopyLink}
          type="button"
        >
          {copyStatus === "copied"
            ? "링크가 복사되었습니다"
            : copyStatus === "failed"
              ? "복사에 실패했습니다"
              : "링크 복사"}
        </button>
        <button
          className={buttonClassName}
          disabled={imageStatus === "generating"}
          onClick={handleSaveImage}
          type="button"
        >
          {imageStatus === "generating"
            ? "이미지 생성 중…"
            : imageStatus === "failed"
              ? "저장에 실패했습니다"
              : "이미지 저장"}
        </button>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 -left-[9999px] opacity-0"
      >
        <div ref={cardRef}>
          <ScholarDnaShareCard data={cardData} siteHost={siteHost} />
        </div>
      </div>
    </>
  );
}
