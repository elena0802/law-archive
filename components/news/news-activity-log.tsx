import { NewsTimelineEntry } from "@/components/news/news-timeline-entry";
import type { NewsMonthGroup } from "@/lib/news/types";

type NewsActivityLogProps = {
  groups: readonly NewsMonthGroup[];
};

export function NewsActivityLog({ groups }: NewsActivityLogProps) {
  if (groups.length === 0) {
    return (
      <p className="border border-line/80 px-6 py-10 text-base leading-8 text-ink-muted">
        아직 기록된 소식이 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section aria-labelledby={`news-month-${group.monthKey}`} key={group.monthKey}>
          <h2
            className="font-serif text-2xl leading-none text-ink sm:text-[1.65rem]"
            id={`news-month-${group.monthKey}`}
          >
            {group.label}
          </h2>
          <div aria-hidden className="mt-2.5 border-b border-line sm:mt-3" />
          <ol className="relative mt-3 list-none border-l-2 border-line sm:mt-4">
            {group.items.map((item, index) => (
              <li
                className={`relative pl-6 sm:pl-7 ${index < group.items.length - 1 ? "pb-5 sm:pb-6" : ""}`}
                key={item.id}
              >
                <span
                  aria-hidden
                  className="absolute -left-px top-0 block h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent ring-[3px] ring-paper"
                />
                <div className="pt-4 sm:pt-5">
                  <NewsTimelineEntry item={item} />
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
