import type { ResearchItem } from "@/src/types/research";

type ResearchPublicationBadgesProps = {
  item: ResearchItem;
  showRepresentative?: boolean;
  showImportant?: boolean;
};

export function ResearchPublicationBadges({
  item,
  showRepresentative = true,
  showImportant = true,
}: ResearchPublicationBadgesProps) {
  const badges: { key: string; label: string }[] = [];

  if (showRepresentative && item.isRepresentative) {
    badges.push({ key: "representative", label: "대표" });
  }

  if (showImportant && item.isImportant) {
    badges.push({ key: "important", label: "주요" });
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span
          key={badge.key}
          className="inline-flex rounded-sm border border-line px-2 py-0.5 text-xs tracking-wide text-ink-muted"
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}
