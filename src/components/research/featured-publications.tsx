import { ResearchPublicationBadges } from "@/src/components/research/research-publication-badges";
import { ResearchPublicationMeta } from "@/src/components/research/research-publication-meta";
import { getCategoryLabel } from "@/src/lib/research";
import type { ResearchItem } from "@/src/types/research";

type FeaturedPublicationsProps = {
  items: readonly ResearchItem[];
};

export function FeaturedPublications({ items }: FeaturedPublicationsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="featured-publications-heading">
      <h2
        id="featured-publications-heading"
        className="font-serif text-2xl leading-tight text-ink sm:text-[1.75rem]"
      >
        대표 논문
      </h2>
      <p className="text-keep mt-3 text-base leading-[1.85] text-ink-muted">
        교수님의 주요 연구 흐름을 보여주는 대표 연구입니다.
      </p>
      <ul className="mt-8 list-none space-y-0 p-0">
        {items.map((item) => (
          <li
            key={item.number}
            className="border-t border-line/70 py-6 first:border-t-0 first:pt-0 last:pb-0"
          >
            <article>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <span className="shrink-0 font-serif text-sm tabular-nums text-accent">
                  No. {item.number}
                </span>
                <ResearchPublicationBadges
                  item={item}
                  showImportant={false}
                />
              </div>
              <h3 className="text-keep mt-3 font-serif text-lg leading-snug text-ink">
                {item.title}
              </h3>
              <ResearchPublicationMeta item={item} showCategory={false} />
              <dl className="mt-4 grid gap-2 text-sm text-ink-muted sm:grid-cols-2">
                {item.journal ? (
                  <div>
                    <dt className="sr-only">학술지</dt>
                    <dd>
                      <span className="text-ink-muted/80">학술지</span>{" "}
                      {item.journal}
                    </dd>
                  </div>
                ) : null}
                {item.publisher ? (
                  <div>
                    <dt className="sr-only">발행처</dt>
                    <dd>
                      <span className="text-ink-muted/80">발행처</span>{" "}
                      {item.publisher}
                    </dd>
                  </div>
                ) : null}
                {item.volume ? (
                  <div>
                    <dt className="sr-only">권호</dt>
                    <dd>
                      <span className="text-ink-muted/80">권호</span>{" "}
                      {item.volume}
                    </dd>
                  </div>
                ) : null}
                {item.pages ? (
                  <div>
                    <dt className="sr-only">면</dt>
                    <dd>
                      <span className="text-ink-muted/80">면</span>{" "}
                      {item.pages}
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className="sr-only">분야</dt>
                  <dd>
                    <span className="text-ink-muted/80">분야</span>{" "}
                    {getCategoryLabel(item.category)}
                  </dd>
                </div>
              </dl>
              {/* PR46.5-C: PDF view / download actions */}
              <div
                className="mt-4 empty:hidden"
                data-publication-actions={item.number}
              />
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
