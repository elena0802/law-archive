"use client";

import { useState } from "react";
import { PublicationList } from "@/src/components/research/publication-list";
import type { ResearchItem } from "@/src/types/research";

type ExpandablePublicationListProps = {
  items: readonly ResearchItem[];
  previewItems: readonly ResearchItem[];
};

export function ExpandablePublicationList({
  items,
  previewItems,
}: ExpandablePublicationListProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : previewItems;
  const canExpand = items.length > previewItems.length;

  return (
    <div>
      <PublicationList
        items={visibleItems}
        heading="전체 연구업적"
        headingId="complete-publications-heading"
        description={`${items.length}편의 전체 연구업적 목록입니다.`}
        badgeMode="none"
      />
      {canExpand ? (
        <p className="mt-6">
          <button
            className="text-sm text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            onClick={() => setExpanded((value) => !value)}
            type="button"
          >
            {expanded ? "접기" : "전체 연구업적 펼치기"}
          </button>
        </p>
      ) : null}
    </div>
  );
}
