import { ResearchPublicationMeta } from "@/src/components/research/research-publication-meta";
import type { groupResearchByYear } from "@/src/lib/research";

type ChronologicalArchiveProps = {
  yearGroups: ReturnType<typeof groupResearchByYear>;
};

export function ChronologicalArchive({ yearGroups }: ChronologicalArchiveProps) {
  if (yearGroups.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="chronological-archive-heading">
      <h2
        id="chronological-archive-heading"
        className="font-serif text-2xl leading-tight text-ink sm:text-[1.75rem]"
      >
        연도별 연구 궤적
      </h2>
      <div className="mt-8 space-y-10">
        {yearGroups.map((group) => (
          <div key={group.year}>
            <h3 className="font-serif text-xl tabular-nums text-accent">
              {group.year}
            </h3>
            <ul className="mt-4 list-none space-y-0 p-0">
              {group.items.map((item) => (
                <li
                  key={item.number}
                  className="border-t border-line/70 py-4 first:border-t-0 first:pt-0 last:pb-0"
                >
                  <article>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-sm tabular-nums text-ink-muted">
                        No. {item.number}
                      </span>
                      <h4 className="text-keep font-serif text-base leading-snug text-ink">
                        {item.title}
                      </h4>
                    </div>
                    <div className="mt-2">
                      <ResearchPublicationMeta item={item} />
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
