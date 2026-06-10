"use client";

import { CurationLinkCard } from "@/components/curation/curation-link-card";
import { CurationYoutubeFeature } from "@/components/curation/curation-youtube-feature";
import type { CurationItem } from "@/lib/curation/types";

type CurationFeaturedItemProps = {
  item: CurationItem;
};

export function CurationFeaturedItem({ item }: CurationFeaturedItemProps) {
  if (item.type === "youtube") {
    return <CurationYoutubeFeature item={item} layout="home" />;
  }

  return <CurationLinkCard featured item={item} />;
}
