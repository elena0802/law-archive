import { NewsCategoryLabel } from "@/components/news/news-category-label";
import type { NewsItem } from "@/lib/news/types";
import { formatNewsTimelineDay } from "@/lib/news/types";

type NewsTimelineEntryProps = {
  item: NewsItem;
};

export function NewsTimelineEntry({ item }: NewsTimelineEntryProps) {
  const summary = item.summary.trim();

  return (
    <article aria-labelledby={`news-item-title-${item.id}`}>
      <time
        className="block font-serif text-[1.75rem] leading-none tabular-nums tracking-tight text-ink sm:text-[2rem]"
        dateTime={item.date}
      >
        {formatNewsTimelineDay(item.date)}
      </time>
      <div className="mt-2">
        <NewsCategoryLabel category={item.category} />
      </div>
      <h3
        className="text-keep mt-2 font-serif text-lg leading-snug text-ink sm:text-[1.125rem]"
        id={`news-item-title-${item.id}`}
      >
        {item.title}
      </h3>
      {summary ? (
        <p className="text-keep mt-1.5 max-w-prose text-sm leading-[1.7] text-ink-muted">
          {summary}
        </p>
      ) : null}
    </article>
  );
}
