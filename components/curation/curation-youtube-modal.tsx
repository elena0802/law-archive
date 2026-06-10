"use client";

import { useEffect } from "react";
import { buildYouTubeEmbedUrl } from "@/lib/curation/youtube";

type CurationYoutubeModalProps = {
  open: boolean;
  title: string;
  videoId: string;
  onClose: () => void;
};

export function CurationYoutubeModal({
  open,
  title,
  videoId,
  onClose,
}: CurationYoutubeModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      aria-labelledby="curation-youtube-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/35 p-0 sm:items-center sm:px-4 sm:py-8"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="flex max-h-[min(100dvh,48rem)] w-full max-w-4xl flex-col overflow-hidden rounded-t border border-line bg-paper shadow-sm sm:max-h-[90dvh] sm:rounded"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line px-4 py-3.5 sm:gap-4 sm:px-6 sm:py-4">
          <h2
            className="text-keep min-w-0 flex-1 font-serif text-lg leading-snug text-ink sm:text-2xl sm:leading-snug"
            id="curation-youtube-title"
          >
            <span className="line-clamp-2">{title}</span>
          </h2>
          <button
            aria-label="닫기"
            className="shrink-0 rounded border border-line px-3 py-1.5 text-sm text-ink-muted transition hover:border-accent/40 hover:text-ink"
            onClick={onClose}
            type="button"
          >
            닫기
          </button>
        </div>
        <div className="aspect-video w-full shrink-0 bg-ink/5">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
            src={buildYouTubeEmbedUrl(videoId)}
            title={title}
          />
        </div>
      </div>
    </div>
  );
}
