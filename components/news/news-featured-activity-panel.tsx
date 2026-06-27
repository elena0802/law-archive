import Image from "next/image";
import { NewsFeaturedActivityCta } from "@/components/news/news-featured-activity-cta";
import { NewsCategoryLabel } from "@/components/news/news-category-label";
import type { NewsItem } from "@/lib/news/types";
import { formatNewsDisplayDate } from "@/lib/news/types";

type NewsFeaturedActivityHeadingProps = {
  headingId: string;
  compact?: boolean;
  snug?: boolean;
};

export function NewsFeaturedActivityHeading({
  headingId,
  compact = false,
  snug = false,
}: NewsFeaturedActivityHeadingProps) {
  return (
    <>
      <h2
        className={
          compact
            ? "font-serif text-xl leading-none text-ink sm:text-2xl"
            : "font-serif text-2xl leading-none text-ink sm:text-[1.65rem]"
        }
        id={headingId}
      >
        연구실 하이라이트
      </h2>
      <div
        aria-hidden
        className={`border-b border-line ${
          snug
            ? "mt-2"
            : compact
              ? "mt-2 sm:mt-2.5"
              : "mt-2.5 sm:mt-3"
        }`}
      />
    </>
  );
}

type NewsFeaturedActivityPanelProps = {
  item: NewsItem;
  titleId: string;
  variant?: "default" | "compact";
  snug?: boolean;
  showCta?: boolean;
};

export function NewsFeaturedActivityPanel({
  item,
  titleId,
  variant = "default",
  snug = false,
  showCta = true,
}: NewsFeaturedActivityPanelProps) {
  const compact = variant === "compact";
  const summary = item.summary.trim();
  const imageSrc = item.image?.trim();
  const actionLink = item.link?.trim();

  return (
    <article
      aria-labelledby={titleId}
      className={`relative border-l-2 border-line ${
        compact
          ? snug
            ? "mt-2"
            : "mt-2 sm:mt-3"
          : "mt-3 sm:mt-4"
      }`}
    >
      <span
        aria-hidden
        className="absolute -left-px top-0 block h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent ring-[3px] ring-paper"
      />
      <div className="pl-5 sm:pl-6">
        {imageSrc ? (
          <div
            className={
              compact
                ? snug
                  ? "mt-2 w-[72%] max-w-full max-h-48 overflow-hidden sm:mt-3 sm:max-h-none"
                  : "mt-3 max-h-52 overflow-hidden sm:mt-4 sm:max-h-none"
                : "mt-4 w-full sm:mt-5"
            }
          >
            <Image
              alt={`${item.title} 이미지`}
              className={
                compact
                  ? snug
                    ? "h-auto max-h-48 w-full object-cover object-top sm:max-h-none sm:object-contain"
                    : "h-auto max-h-52 w-full object-cover object-top sm:max-h-none sm:object-contain"
                  : "h-auto w-full"
              }
              height={0}
              priority={compact}
              sizes={
                compact
                  ? snug
                    ? "(max-width: 1024px) 72vw, 13rem"
                    : "(max-width: 1024px) 100vw, 18rem"
                  : "(max-width: 1024px) 100vw, 40vw"
              }
              src={imageSrc}
              width={0}
            />
          </div>
        ) : null}
        <div
          className={
            compact
              ? snug
                ? "pt-3"
                : "pt-3 sm:pt-4"
              : "pt-4 sm:pt-5"
          }
        >
          <NewsCategoryLabel category={item.category} />
          <h3
            className={
              compact
                ? "text-keep mt-2 font-serif text-base leading-snug text-ink sm:text-lg"
                : "text-keep mt-2 font-serif text-lg leading-snug text-ink sm:text-[1.125rem]"
            }
            id={titleId}
          >
            {item.title}
          </h3>
          <time
            className={
              compact
                ? "mt-2 block font-serif text-lg tabular-nums leading-none tracking-tight text-ink sm:text-xl"
                : "mt-2 block font-serif text-xl tabular-nums leading-none tracking-tight text-ink sm:text-[1.35rem]"
            }
            dateTime={item.date}
          >
            {formatNewsDisplayDate(item.date)}
          </time>
          {!compact && summary ? (
            <p className="text-keep mt-3 text-sm leading-[1.75] text-ink-muted sm:mt-3.5">
              {summary}
            </p>
          ) : null}
          {showCta ? (
            <NewsFeaturedActivityCta
              actionLink={actionLink}
              behavior={item.featuredCtaBehavior}
              className={compact ? "mt-3 sm:mt-4" : "mt-4 sm:mt-5"}
              imageSrc={imageSrc}
              title={item.title}
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}
