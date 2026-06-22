import { CurationProfessorNote } from "@/components/curation/curation-professor-note";
import { CurationTypeBadge } from "@/components/curation/curation-type-badge";
import type { CurationItem } from "@/lib/curation/types";
import { formatCurationDate } from "@/lib/curation/types";

type CurationLinkCardProps = {
  item: CurationItem;
  compact?: boolean;
  featured?: boolean;
};

export function CurationLinkCard({
  item,
  compact = false,
  featured = false,
}: CurationLinkCardProps) {
  const metaParts = [
    item.source.trim() || null,
    formatCurationDate(item.recommendedAt),
  ].filter(Boolean);

  return (
    <a
      className={`group flex flex-col border border-line/80 bg-paper transition-colors hover:border-ink-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
        featured ? "overflow-hidden" : "h-full p-5 sm:p-6"
      }`}
      href={item.url}
      rel="noopener noreferrer"
      target="_blank"
    >
      {featured && item.thumbnailUrl ? (
        <div className="relative aspect-[5/3] overflow-hidden bg-paper-muted lg:aspect-[5/2.55]">
          {/* eslint-disable-next-line @next/next/no-img-element -- external admin-provided thumbnail URLs */}
          <img
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            src={item.thumbnailUrl}
          />
        </div>
      ) : null}

      <div className={`flex flex-col ${featured ? "p-4 sm:p-5" : "flex-1"}`}>
        <div className="flex items-start gap-4">
          {item.thumbnailUrl && !compact && !featured ? (
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
            <div className="flex flex-wrap items-center gap-2.5">
              <CurationTypeBadge
                type={item.type}
                variant={featured ? "featured" : "default"}
              />
              {metaParts.length > 0 ? (
                <span className="text-xs text-ink-muted">{metaParts.join(" · ")}</span>
              ) : null}
            </div>
            <h3
              className={`text-keep mt-3 font-serif leading-snug text-ink group-hover:text-accent ${
                featured
                  ? "line-clamp-2 text-xl sm:text-2xl"
                  : "text-lg sm:text-xl"
              }`}
            >
              {item.title}
            </h3>
            <CurationProfessorNote
              className={featured ? "mt-2.5" : "mt-3"}
              lines={featured ? 2 : compact ? 2 : 3}
              note={item.professorNote}
            />
            {!compact ? (
              <p className={`text-sm text-accent ${featured ? "mt-3" : "mt-4"}`}>
                외부 링크로 이동 →
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </a>
  );
}
