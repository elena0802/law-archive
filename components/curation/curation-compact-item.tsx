"use client";

import { useState } from "react";
import { CurationProfessorNote } from "@/components/curation/curation-professor-note";
import { CurationTypeBadge } from "@/components/curation/curation-type-badge";
import { CurationYoutubeModal } from "@/components/curation/curation-youtube-modal";
import type { CurationItem } from "@/lib/curation/types";
import { extractYouTubeVideoId } from "@/lib/curation/youtube";

type CurationCompactItemProps = {
  item: CurationItem;
};

export function CurationCompactItem({ item }: CurationCompactItemProps) {
  const [open, setOpen] = useState(false);
  const videoId =
    item.type === "youtube" ? extractYouTubeVideoId(item.url) : null;

  const content = (
    <>
      <CurationTypeBadge type={item.type} />
      <h3 className="text-keep mt-3 font-serif text-lg leading-snug text-ink group-hover:text-accent">
        {item.title}
      </h3>
      <CurationProfessorNote className="mt-2" note={item.professorNote} />
    </>
  );

  if (videoId) {
    return (
      <>
        <button
          className="group w-full border border-line/80 bg-paper p-5 text-left transition-colors hover:border-ink-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:p-6"
          onClick={() => setOpen(true)}
          type="button"
        >
          {content}
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
      className="group block border border-line/80 bg-paper p-5 transition-colors hover:border-ink-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:p-6"
      href={item.url}
      rel="noopener noreferrer"
      target="_blank"
    >
      {content}
    </a>
  );
}
