import { ResearchPublicationBadges } from "@/src/components/research/research-publication-badges";
import { ResearchPublicationMeta } from "@/src/components/research/research-publication-meta";
import { formatResearchDate, getCategoryLabel } from "@/src/lib/research";
import type { ResearchItem } from "@/src/types/research";

type PublicationListProps = {
  items: readonly ResearchItem[];
  heading: string;
  headingId: string;
  description?: string;
  badgeMode?: "all" | "important-only" | "none";
};

export function PublicationList({
  items,
  heading,
  headingId,
  description,
  badgeMode = "none",
}: PublicationListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="font-serif text-2xl leading-tight text-ink sm:text-[1.75rem]"
      >
        {heading}
      </h2>
      {description ? (
        <p className="text-keep mt-3 text-base leading-[1.85] text-ink-muted">
          {description}
        </p>
      ) : null}
      <ul className="mt-8 list-none space-y-0 p-0">
        {items.map((item) => {
          const dateLabel = formatResearchDate(item.year, item.month);

          return (
            <li
              key={item.number}
              className="border-t border-line/70 py-5 first:border-t-0 first:pt-0 last:pb-0"
            >
              <article className="grid gap-3 sm:grid-cols-[3.5rem_1fr] sm:gap-6">
                <span className="font-serif text-sm tabular-nums text-accent sm:pt-0.5">
                  {String(item.number).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="text-keep font-serif text-lg leading-snug text-ink">
                      {item.title}
                    </h3>
                    {badgeMode !== "none" ? (
                      <ResearchPublicationBadges
                        item={item}
                        showRepresentative={badgeMode === "all"}
                        showImportant
                      />
                    ) : null}
                  </div>
                  {badgeMode === "none" ? (
                    <ResearchPublicationMeta item={item} />
                  ) : (
                    <p className="text-keep mt-2 text-sm leading-relaxed text-ink-muted">
                      {[
                        dateLabel,
                        item.journal,
                        item.volume,
                        item.pages ? `${item.pages}면` : undefined,
                        getCategoryLabel(item.category),
                        item.publisher,
                      ]
                        .filter((part): part is string => Boolean(part))
                        .join(" · ")}
                    </p>
                  )}
                  {badgeMode === "none" ? (
                    <div
                      className="mt-3 empty:hidden"
                      data-publication-actions={item.number}
                    />
                  ) : null}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
