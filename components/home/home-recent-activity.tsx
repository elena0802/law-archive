import Link from "next/link";
import { HomeSectionLink } from "@/components/home/home-section-link";
import { HomeSectionHeader } from "@/components/home/home-section-header";
import { NewsCategoryLabel } from "@/components/news/news-category-label";
import type { NewsItem } from "@/lib/news/types";
import { formatNewsTimelineDay, newsPagePath } from "@/lib/news/types";

type HomeRecentActivityProps = {
  items: readonly NewsItem[];
};

export function HomeRecentActivity({ items }: HomeRecentActivityProps) {
  return (
    <section aria-labelledby="home-recent-activity-heading">
      <HomeSectionHeader
        description="연구와 강연, 학회 활동의 최근 기록입니다."
        headingId="home-recent-activity-heading"
        title="최근 연구실 소식"
      />
      <div
        aria-hidden
        className="mt-5 max-w-2xl border-b border-line sm:mt-6"
      />
      {items.length > 0 ? (
        <ol className="relative mt-5 max-w-2xl list-none border-l-2 border-line p-0 sm:mt-6">
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
      ) : (
        <p className="mt-6 max-w-2xl border border-line/80 px-6 py-8 text-base leading-8 text-ink-muted sm:mt-7">
          아직 기록된 소식이 없습니다.
        </p>
      )}
      <HomeSectionLink className="mt-10 sm:mt-11" href={newsPagePath}>
        모든 소식 보기 →
      </HomeSectionLink>
    </section>
  );
}
