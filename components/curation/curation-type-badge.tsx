import type { CurationType } from "@/lib/content/db-types";
import { CURATION_TYPE_LABELS } from "@/lib/curation/youtube";

type CurationTypeBadgeProps = {
  type: CurationType;
  className?: string;
};

export function CurationTypeBadge({ type, className = "" }: CurationTypeBadgeProps) {
  return (
    <span
      className={`text-keep inline-flex rounded-sm border border-line px-2 py-0.5 text-xs tracking-wide text-ink-muted ${className}`}
    >
      {CURATION_TYPE_LABELS[type]}
    </span>
  );
}
