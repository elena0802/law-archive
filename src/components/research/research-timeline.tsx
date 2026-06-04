import { formatResearchDate } from "@/src/lib/research";
import type { ResearchItem } from "@/src/types/research";

type ResearchTimelineProps = {
  items: readonly ResearchItem[];
};

export function ResearchTimeline({ items }: ResearchTimelineProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="research-timeline-heading">
      <h2
        id="research-timeline-heading"
        className="font-serif text-2xl leading-tight text-ink sm:text-[1.75rem]"
      >
        연구 연표
      </h2>
      <p className="text-keep mt-3 text-base leading-[1.85] text-ink-muted">
        대표 연구를 중심으로 살펴보는 연구의 흐름입니다.
      </p>
      <ol className="mt-8 list-none space-y-0 p-0">
        {items.map((item) => {
          const dateLabel = formatResearchDate(item.year, item.month);

          return (
            <li
              key={item.number}
              className="grid gap-2 border-t border-line/70 py-4 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[5.5rem_1fr]"
            >
              <span className="font-serif text-sm tabular-nums text-accent">
                {dateLabel ?? "—"}
              </span>
              <div className="min-w-0">
                <h3 className="text-keep font-serif text-base leading-snug text-ink">
                  {item.title}
                </h3>
                {item.journal ? (
                  <p className="text-keep mt-1 text-sm text-ink-muted">
                    {item.journal}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
