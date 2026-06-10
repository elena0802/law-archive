import type { CurationType } from "@/lib/content/db-types";
import { CURATION_TYPE_LABELS } from "@/lib/curation/youtube";

type CurationTypeBadgeProps = {
  type: CurationType;
  variant?: "default" | "featured" | "compact";
  className?: string;
};

const variantClassName = {
  default:
    "border-line px-2 py-0.5 text-xs tracking-wide text-ink-muted",
  featured:
    "border-accent/40 bg-paper-muted px-2.5 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-accent",
  compact:
    "border-line bg-paper-muted px-2 py-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-ink",
} as const;

export function CurationTypeBadge({
  type,
  variant = "default",
  className = "",
}: CurationTypeBadgeProps) {
  return (
    <span
      className={`text-keep inline-flex shrink-0 rounded-sm border ${variantClassName[variant]} ${className}`}
    >
      {CURATION_TYPE_LABELS[type]}
    </span>
  );
}
