import Link from "next/link";
import { HomeSectionLink } from "@/components/home/home-section-link";
import { HomeSectionHeader } from "@/components/home/home-section-header";
import { NewsFeaturedActivityPanel } from "@/components/news/news-featured-activity-panel";
import { NewsCategoryLabel } from "@/components/news/news-category-label";
import type { NewsItem } from "@/lib/news/types";
import { formatNewsTimelineDay, newsPagePath } from "@/lib/news/types";

type HomeRecentActivityProps = {
  featured: NewsItem | null;
  items: readonly NewsItem[];
};

function HomeRecentActivityTimeline({
  items,
}: {
  items: readonly NewsItem[];
}) {
  return (
    <ol className="relative list-none border-l-2 border-line p-0">
      {items.map((item, index) => (
        <li
          className={`relative pl-5 sm:pl-6 ${index < items.length - 1 ? "pb-7 sm:pb-8" : ""}`}
          key={item.id}
        >
          <span
            aria-hidden
            className="absolute -left-px top-[0.7rem] block h-2 w-2 -translate-x-1/2 rounded-full bg-accent ring-[3px] ring-paper"
          />
          <Link
            className="group block cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            href={newsPagePath}
          >
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <time
                className="font-serif text-[1.65rem] tabular-nums leading-none tracking-tight text-ink sm:text-[1.85rem]"
                dateTime={item.date}
              >
                {formatNewsTimelineDay(item.date)}
              </time>
              <NewsCategoryLabel category={item.category} />
            </div>
            <p className="text-keep mt-2 font-serif text-base leading-snug text-ink transition-colors group-hover:text-accent sm:mt-2.5 sm:text-[1.0625rem]">
              {item.title}
            </p>
          </Link>
        </li>
      ))}
    </ol>
  );
}

function HomeFeaturedHighlight({ item }: { item: NewsItem }) {
  return (
    <NewsFeaturedActivityPanel
      item={item}
      snug
      titleId={`home-featured-title-${item.id}`}
      variant="compact"
    />
  );
}

export function HomeRecentActivity({ featured, items }: HomeRecentActivityProps) {
  const hasTimeline = items.length > 0;
  const hasContent = featured !== null || hasTimeline;
  const twoColumn = featured !== null && hasTimeline;

  return (
    <section aria-labelledby="home-recent-activity-heading">
      <HomeSectionHeader
        description="연구와 강연, 학회 활동의 최근 기록입니다."
        headingId="home-recent-activity-heading"
        title="최근 연구실 소식"
      />

      {twoColumn ? (
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start lg:gap-9 xl:gap-10">
          <aside className="order-1 lg:order-2">
            <HomeFeaturedHighlight item={featured} />
          </aside>
          <div className="order-2 min-w-0 lg:order-1">
            <HomeRecentActivityTimeline items={items} />
            <HomeSectionLink className="mt-10 sm:mt-11" href={newsPagePath}>
              모든 소식 보기 →
            </HomeSectionLink>
          </div>
        </div>
      ) : null}

      {!twoColumn && featured ? (
        <aside className="mt-12">
          <HomeFeaturedHighlight item={featured} />
          <HomeSectionLink className="mt-10 sm:mt-11" href={newsPagePath}>
            모든 소식 보기 →
          </HomeSectionLink>
        </aside>
      ) : null}

      {!twoColumn && hasTimeline ? (
        <>
          <div className="mt-12">
            <HomeRecentActivityTimeline items={items} />
          </div>
          <HomeSectionLink className="mt-10 sm:mt-11" href={newsPagePath}>
            모든 소식 보기 →
          </HomeSectionLink>
        </>
      ) : null}

      {!hasContent ? (
        <>
          <p className="mt-6 border border-line/80 px-6 py-8 text-base leading-8 text-ink-muted sm:mt-7">
            아직 기록된 소식이 없습니다.
          </p>
          <HomeSectionLink className="mt-10 sm:mt-11" href={newsPagePath}>
            모든 소식 보기 →
          </HomeSectionLink>
        </>
      ) : null}
    </section>
  );
}
