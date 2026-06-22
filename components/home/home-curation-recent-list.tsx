"use client";

import { useState } from "react";
import { CurationTypeBadge } from "@/components/curation/curation-type-badge";
import { CurationYoutubeModal } from "@/components/curation/curation-youtube-modal";
import type { CurationItem } from "@/lib/curation/types";
import { extractYouTubeVideoId } from "@/lib/curation/youtube";

type HomeCurationRecentListProps = {
  items: readonly CurationItem[];
};

type HomeCurationRecentRowProps = {
  item: CurationItem;
};

function HomeCurationRecentRow({ item }: HomeCurationRecentRowProps) {
  const [open, setOpen] = useState(false);
  const videoId =
    item.type === "youtube" ? extractYouTubeVideoId(item.url) : null;

  const rowClassName =
    "group flex w-full items-baseline gap-3 py-3.5 text-left transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:gap-3.5 sm:py-4";

  const content = (
    <>
      <CurationTypeBadge type={item.type} variant="compact" />
      <span className="text-keep min-w-0 flex-1 font-serif text-base leading-snug text-ink transition-colors group-hover:text-accent sm:text-[1.0625rem]">
        {item.title}
      </span>
    </>
  );

  if (videoId) {
    return (
      <>
        <button className={rowClassName} onClick={() => setOpen(true)} type="button">
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
      className={rowClassName}
      href={item.url}
      rel="noopener noreferrer"
      target="_blank"
    >
      {content}
    </a>
  );
}

export function HomeCurationRecentList({ items }: HomeCurationRecentListProps) {
  return (
    <ul className="mt-6 list-none divide-y divide-line/70 border-y border-line/70 p-0">
      {items.map((item) => (
        <li className="min-w-0" key={item.id}>
          <HomeCurationRecentRow item={item} />
        </li>
      ))}
    </ul>
  );
}
