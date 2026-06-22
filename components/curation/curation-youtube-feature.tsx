"use client";

import { useState } from "react";
import { CurationProfessorNote } from "@/components/curation/curation-professor-note";
import { CurationTypeBadge } from "@/components/curation/curation-type-badge";
import { CurationYoutubeModal } from "@/components/curation/curation-youtube-modal";
import type { CurationItem } from "@/lib/curation/types";
import { extractYouTubeVideoId } from "@/lib/curation/youtube";

type CurationYoutubeFeatureProps = {
  item: CurationItem;
  layout?: "home" | "list";
};

export function CurationYoutubeFeature({
  item,
  layout = "home",
}: CurationYoutubeFeatureProps) {
  const [open, setOpen] = useState(false);
  const videoId = extractYouTubeVideoId(item.url);

  if (!videoId) {
    return null;
  }

  const isHome = layout === "home";

  return (
    <>
      <button
        className="group flex w-full cursor-pointer flex-col overflow-hidden border border-line/80 bg-paper text-left transition-colors hover:border-ink-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        onClick={() => setOpen(true)}
        type="button"
      >
        <div className="relative aspect-video cursor-pointer overflow-hidden bg-paper-muted lg:aspect-[16/7.65]">
          {item.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- external admin-provided thumbnail URLs
            <img
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              src={item.thumbnailUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink-muted">
              유튜브
            </div>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-ink/10 transition group-hover:bg-ink/20">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line/80 bg-paper/95 text-sm font-medium text-ink shadow-sm">
              재생
            </span>
          </span>
        </div>
        <div className={`flex flex-col ${isHome ? "p-4 sm:p-5" : "flex-1 p-5 sm:p-6"}`}>
          <div className="flex flex-wrap items-center gap-2.5">
            <CurationTypeBadge
              type={item.type}
              variant={isHome ? "featured" : "default"}
            />
            {item.source.trim() ? (
              <span className="text-xs text-ink-muted">{item.source}</span>
            ) : null}
          </div>
          <h3
            className={`text-keep mt-3 font-serif leading-snug text-ink group-hover:text-accent ${
              isHome
                ? "line-clamp-2 text-xl sm:text-2xl"
                : "text-lg sm:text-xl"
            }`}
          >
            {item.title}
          </h3>
          <CurationProfessorNote
            className={isHome ? "mt-2.5" : "mt-3"}
            lines={2}
            note={item.professorNote}
          />
        </div>
      </button>

      <CurationYoutubeModal
        onClose={() => setOpen(false)}
        open={open}
        title={item.title}
        videoId={videoId}
      />
    </>
  );
}
