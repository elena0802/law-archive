"use client";

import { useState } from "react";
import { CurationProfessorNote } from "@/components/curation/curation-professor-note";
import { CurationTypeBadge } from "@/components/curation/curation-type-badge";
import { CurationYoutubeModal } from "@/components/curation/curation-youtube-modal";
import type { CurationItem } from "@/lib/curation/types";
import { extractYouTubeVideoId } from "@/lib/curation/youtube";

const cardClassName =
  "group flex h-full w-full flex-col overflow-hidden border border-line/80 bg-paper text-left transition-colors hover:border-ink-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

type HomeCurationFeaturedCardProps = {
  item: CurationItem;
};

export function HomeCurationFeaturedCard({ item }: HomeCurationFeaturedCardProps) {
  const [open, setOpen] = useState(false);
  const videoId =
    item.type === "youtube" ? extractYouTubeVideoId(item.url) : null;

  const thumbnail = item.thumbnailUrl ? (
    <div className="relative aspect-[3/2] overflow-hidden bg-paper-muted">
      {/* eslint-disable-next-line @next/next/no-img-element -- external admin-provided thumbnail URLs */}
      <img
        alt=""
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        src={item.thumbnailUrl}
      />
      {videoId ? (
        <span className="absolute inset-0 flex items-center justify-center bg-ink/10 transition group-hover:bg-ink/15">
          <span className="rounded-sm border border-line/80 bg-paper/95 px-3.5 py-1.5 text-sm text-ink">
            재생
          </span>
        </span>
      ) : null}
    </div>
  ) : null;

  const body = (
    <div className="flex flex-1 flex-col items-start p-4 sm:p-5">
      <CurationTypeBadge type={item.type} variant="compact" />
      <h3 className="text-keep mt-2.5 line-clamp-2 font-serif text-lg leading-snug text-ink group-hover:text-accent sm:text-xl">
        {item.title}
      </h3>
      <CurationProfessorNote className="mt-2" lines={2} note={item.professorNote} />
    </div>
  );

  if (videoId) {
    return (
      <>
        <button className={cardClassName} onClick={() => setOpen(true)} type="button">
          {thumbnail}
          {body}
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

  return (
    <a
      className={cardClassName}
      href={item.url}
      rel="noopener noreferrer"
      target="_blank"
    >
      {thumbnail}
      {body}
    </a>
  );
}
