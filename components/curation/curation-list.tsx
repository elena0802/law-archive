"use client";

import { CurationLinkCard } from "@/components/curation/curation-link-card";
import { CurationTypeBadge } from "@/components/curation/curation-type-badge";
import { CurationYoutubeFeature } from "@/components/curation/curation-youtube-feature";
import type { CurationItem } from "@/lib/curation/types";
import { formatCurationDate } from "@/lib/curation/types";

type CurationListProps = {
  items: CurationItem[];
};

export function CurationList({ items }: CurationListProps) {
  if (items.length === 0) {
    return (
      <p className="text-keep border-t border-line py-8 text-base leading-8 text-ink-muted">
        아직 추천 콘텐츠가 없습니다.
      </p>
    );
  }

  return (
    <div>
      {items.map((item) =>
        item.type === "youtube" ? (
          <article className="border-t border-line py-8" key={item.id}>
            <div className="max-w-3xl">
              <CurationYoutubeFeature item={item} layout="list" />
            </div>
          </article>
        ) : (
          <article className="border-t border-line py-8" key={item.id}>
            <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[9.5rem_1fr] sm:gap-8">
              <div className="text-sm leading-6 text-ink-muted">
                <CurationTypeBadge type={item.type} />
                <p className="mt-2">{formatCurationDate(item.recommendedAt)}</p>
                {item.source.trim() ? (
                  <p className="mt-1 text-xs">{item.source}</p>
                ) : null}
              </div>
              <div className="min-w-0">
                <CurationLinkCard item={item} />
              </div>
            </div>
          </article>
        ),
      )}
    </div>
  );
}
