import Image from "next/image";
import Link from "next/link";
import { homeSectionLinkClassName } from "@/components/home/home-section-link";
import { NewsCategoryLabel } from "@/components/news/news-category-label";
import type { NewsItem } from "@/lib/news/types";
import { formatNewsDisplayDate } from "@/lib/news/types";

type NewsFeaturedActivityProps = {
  item: NewsItem;
};

export function NewsFeaturedActivity({ item }: NewsFeaturedActivityProps) {
  const summary = item.summary.trim();
  const imageSrc = item.image?.trim();
  const actionLink = item.link?.trim();

  return (
    <section aria-labelledby="news-featured-activity-heading">
      <h2
        className="font-serif text-2xl leading-none text-ink sm:text-[1.65rem]"
        id="news-featured-activity-heading"
      >
        연구실 하이라이트
      </h2>
      <div aria-hidden className="mt-2.5 border-b border-line sm:mt-3" />
      <article
        aria-labelledby={`news-featured-title-${item.id}`}
        className="relative mt-3 border-l-2 border-line sm:mt-4"
      >
        <span
          aria-hidden
          className="absolute -left-px top-0 block h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent ring-[3px] ring-paper"
        />
        <div className="pl-5 sm:pl-6">
          {imageSrc ? (
            <div className="mt-4 w-full sm:mt-5">
              <Image
                alt={`${item.title} 이미지`}
                className="h-auto w-full"
                height={0}
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                src={imageSrc}
                width={0}
              />
            </div>
          ) : null}
          <div className="pt-4 sm:pt-5">
            <NewsCategoryLabel category={item.category} />
            <h3
              className="text-keep mt-2 font-serif text-lg leading-snug text-ink sm:text-[1.125rem]"
              id={`news-featured-title-${item.id}`}
            >
              {item.title}
            </h3>
            <time
              className="mt-2 block font-serif text-xl tabular-nums leading-none tracking-tight text-ink sm:text-[1.35rem]"
              dateTime={item.date}
            >
              {formatNewsDisplayDate(item.date)}
            </time>
            {summary ? (
              <p className="text-keep mt-3 text-sm leading-[1.75] text-ink-muted sm:mt-3.5">
                {summary}
              </p>
            ) : null}
            {actionLink ? (
              <p className="mt-4 sm:mt-5">
                <Link
                  className={homeSectionLinkClassName}
                  href={actionLink}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  자세히 보기 →
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      </article>
    </section>
  );
}
