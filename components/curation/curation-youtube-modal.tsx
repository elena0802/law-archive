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

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      aria-labelledby="curation-youtube-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 px-4 py-8 sm:px-6"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded border border-line bg-paper shadow-sm"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <h2
            className="text-keep font-serif text-xl leading-snug text-ink sm:text-2xl"
            id="curation-youtube-title"
          >
            {title}
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
        <div className="aspect-video bg-ink/5">
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
