import {
  NewsFeaturedActivityHeading,
  NewsFeaturedActivityPanel,
} from "@/components/news/news-featured-activity-panel";
import type { NewsItem } from "@/lib/news/types";

type NewsFeaturedActivityProps = {
  item: NewsItem;
};

export function NewsFeaturedActivity({ item }: NewsFeaturedActivityProps) {
  return (
    <section aria-labelledby="news-featured-activity-heading">
      <NewsFeaturedActivityHeading headingId="news-featured-activity-heading" />
      <NewsFeaturedActivityPanel
        item={item}
        titleId={`news-featured-title-${item.id}`}
        variant="default"
      />
    </section>
  );
}
