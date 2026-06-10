import { CurationTypeBadge } from "@/components/curation/curation-type-badge";
import type { CurationItem } from "@/lib/curation/types";
import { formatCurationDate } from "@/lib/curation/types";

type CurationLinkCardProps = {
  item: CurationItem;
  compact?: boolean;
};

export function CurationLinkCard({ item, compact = false }: CurationLinkCardProps) {
  const metaParts = [
    item.source.trim() || null,
    formatCurationDate(item.recommendedAt),
  ].filter(Boolean);

  return (
    <a
      className="group flex h-full flex-col border border-line/80 bg-paper p-5 transition-colors hover:border-ink-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:p-6"
      href={item.url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="flex items-start gap-4">
        {item.thumbnailUrl && !compact ? (
          <div className="relative hidden h-16 w-24 shrink-0 overflow-hidden bg-paper-muted sm:block">
            {/* eslint-disable-next-line @next/next/no-img-element -- external admin-provided thumbnail URLs */}
            <img
              alt=""
              className="h-full w-full object-cover"
              src={item.thumbnailUrl}
            />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <CurationTypeBadge type={item.type} />
            {metaParts.length > 0 ? (
              <span className="text-xs text-ink-muted">{metaParts.join(" · ")}</span>
            ) : null}
          </div>
          <h3 className="text-keep mt-3 font-serif text-lg leading-snug text-ink group-hover:text-accent sm:text-xl">
            {item.title}
          </h3>
          {item.description.trim() ? (
            <p
              className={`text-keep mt-2 text-sm leading-[1.75] text-ink-muted ${
                compact ? "line-clamp-2" : "line-clamp-3"
              }`}
            >
              {item.description}
            </p>
          ) : null}
          <p className="mt-4 text-sm text-accent">외부 링크로 이동 →</p>
        </div>
      </div>
    </a>
  );
}
