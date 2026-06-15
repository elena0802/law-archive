import { NewsActivityLog } from "@/components/news/news-activity-log";
import { NewsFeaturedActivity } from "@/components/news/news-featured-activity";
import type { NewsItem, NewsMonthGroup } from "@/lib/news/types";

type NewsPageContentProps = {
  featured: NewsItem | null;
  groups: readonly NewsMonthGroup[];
};

export function NewsPageContent({ featured, groups }: NewsPageContentProps) {
  if (!featured) {
    return <NewsActivityLog groups={groups} />;
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start lg:gap-12 xl:gap-14">
      <aside className="order-1 lg:order-2">
        <NewsFeaturedActivity item={featured} />
      </aside>
      <div className="order-2 min-w-0 lg:order-1">
        <NewsActivityLog groups={groups} />
      </div>
    </div>
  );
}
