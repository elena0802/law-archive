import {
  formatResearchDate,
  getCategoryLabel,
} from "@/src/lib/research";
import type { ResearchItem } from "@/src/types/research";

type ResearchPublicationMetaProps = {
  item: ResearchItem;
  showCategory?: boolean;
};

export function ResearchPublicationMeta({
  item,
  showCategory = true,
}: ResearchPublicationMetaProps) {
  const dateLabel = formatResearchDate(item.year, item.month);
  const detailParts = [
    dateLabel,
    item.journal,
    item.volume,
    item.pages ? `${item.pages}면` : undefined,
    item.publisher,
    showCategory ? getCategoryLabel(item.category) : undefined,
  ].filter((part): part is string => Boolean(part));

  if (detailParts.length === 0) {
    return null;
  }

  return (
    <p className="text-keep text-sm leading-relaxed text-ink-muted">
      {detailParts.join(" · ")}
    </p>
  );
}
