import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CitationBlock } from "@/components/citation-block";
import { EssayPreviewBanner } from "@/components/essay-preview-banner";
import {
  EssayBreadcrumb,
  EssayMetaRow,
} from "@/components/essay-meta";
import { SeriesSiblings } from "@/components/series-siblings";
import type { Essay } from "@/lib/essays";
import { isPublishedEssayStatus } from "@/lib/content/essay-status";
import {
  estimateReadingMinutes,
  formatEssayDate,
  getRelatedEssays,
  getSeriesBySlug,
  getSeriesPartLabel,
  getSeriesSlug,
  sortEssaysByDateAsc,
} from "@/lib/essays";
import { formatEssayCitation, getSiteOrigin } from "@/lib/site";

type EssayArticleViewProps = {
  essay: Essay;
  mode?: "public" | "preview";
  editHref?: string;
};

function essayHref(slug: string, previewMode: boolean) {
  return previewMode ? `/preview/${slug}` : `/essays/${slug}`;
}

export async function EssayArticleView({
  essay,
  mode = "public",
  editHref,
}: EssayArticleViewProps) {
  const isPreview = mode === "preview";
  const seriesSlug = getSeriesSlug(essay.series);
  const series = await getSeriesBySlug(seriesSlug, {
    includeDrafts: isPreview,
  });
  const essaysInSeries = series ? sortEssaysByDateAsc(series.essays) : [];
  const readingMinutes = estimateReadingMinutes(essay.content);
  const partLabel = getSeriesPartLabel(essaysInSeries, essay.slug);
  const currentIndex = essaysInSeries.findIndex((item) => item.slug === essay.slug);
  const previousEssay = currentIndex > 0 ? essaysInSeries[currentIndex - 1] : null;
  const nextEssay =
    currentIndex >= 0 && currentIndex < essaysInSeries.length - 1
      ? essaysInSeries[currentIndex + 1]
      : null;
  const isPublic =
    essay.status !== undefined
      ? isPublishedEssayStatus(essay.status)
      : !essay.draft;
  const citation = formatEssayCitation({
    title: essay.title,
    slug: essay.slug,
    date: essay.date,
    siteOrigin: getSiteOrigin(),
  });
  const relatedEssays = isPreview ? [] : await getRelatedEssays(essay, 3);

  return (
    <>
      {isPreview ? (
        <EssayPreviewBanner
          editHref={editHref}
          essayStatus={essay.status}
          isDraft={!isPublic}
          publicHref={isPublic ? `/essays/${essay.slug}` : undefined}
        />
      ) : null}

      <div className={isPreview ? "py-page" : undefined}>
        {isPreview ? (
          <div className="mb-8">
            <Link
              className="text-sm tracking-[0.1em] text-accent underline-offset-4 hover:underline"
              href="/admin/essays"
            >
              ← 글 관리
            </Link>
          </div>
        ) : (
          <Link
            className="text-sm tracking-[0.1em] text-accent underline-offset-4 hover:underline"
            href="/essays"
          >
            ← 글 목록
          </Link>
        )}

        <EssayBreadcrumb seriesTitle={essay.series} />

        <article className="mt-8">
          <header className="border-b border-line pb-10">
            <p className="text-keep text-xl font-serif leading-snug text-ink-muted sm:text-2xl">
              {essay.series}
            </p>
            {series ? (
              <p className="sr-only">연재 페이지: {series.title}</p>
            ) : null}
            <h1 className="text-keep mt-5 font-serif text-4xl leading-[1.18] text-ink sm:text-5xl">
              {essay.title}
            </h1>
            <p className="text-keep mt-6 text-lg leading-9 text-ink-muted">
              {essay.description}
            </p>
            <EssayMetaRow
              category={essay.category}
              date={essay.date}
              partLabel={null}
              readingMinutes={readingMinutes}
              seriesTitle={essay.series}
            />
            {series && partLabel ? (
              <p className="text-keep mt-3 text-sm leading-7 text-ink-muted">
                {partLabel}
                <span aria-hidden="true" className="mx-2 text-line">
                  ·
                </span>
                <Link
                  className="text-accent underline-offset-4 hover:underline"
                  href={`/series/${seriesSlug}`}
                >
                  연재 전체 보기 →
                </Link>
              </p>
            ) : series ? (
              <p className="text-keep mt-3 text-sm leading-7 text-ink-muted">
                <Link
                  className="text-accent underline-offset-4 hover:underline"
                  href={`/series/${seriesSlug}`}
                >
                  연재 전체 보기 →
                </Link>
              </p>
            ) : null}
          </header>

          <div className="archive-prose mt-12">
            <MDXRemote source={essay.content} />
          </div>

          {previousEssay || nextEssay ? (
            <nav
              aria-label="연재 이전 다음 글"
              className="mt-12 border-t border-line pt-8"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  {previousEssay ? (
                    <>
                      <p className="text-xs tracking-[0.14em] text-ink-muted uppercase">
                        이전 글
                      </p>
                      <Link
                        className="text-keep mt-2 block font-serif text-lg leading-8 text-ink underline-offset-4 hover:text-accent hover:underline"
                        href={essayHref(previousEssay.slug, isPreview)}
                      >
                        ← {previousEssay.title}
                      </Link>
                    </>
                  ) : null}
                </div>
                <div className="text-left sm:text-right">
                  {nextEssay ? (
                    <>
                      <p className="text-xs tracking-[0.14em] text-ink-muted uppercase">
                        다음 글
                      </p>
                      <Link
                        className="text-keep mt-2 block font-serif text-lg leading-8 text-ink underline-offset-4 hover:text-accent hover:underline"
                        href={essayHref(nextEssay.slug, isPreview)}
                      >
                        {nextEssay.title} →
                      </Link>
                    </>
                  ) : null}
                </div>
              </div>
            </nav>
          ) : null}

          <footer className="mt-10 space-y-10 border-t border-line pt-10">
            <CitationBlock citation={citation} />
            {essaysInSeries.length > 0 ? (
              <SeriesSiblings
                currentSlug={essay.slug}
                essays={essaysInSeries}
                previewMode={isPreview}
              />
            ) : null}
            {relatedEssays.length > 0 ? (
              <section aria-labelledby="related-reading-heading">
                <h2
                  className="text-xs tracking-[0.14em] text-accent uppercase"
                  id="related-reading-heading"
                >
                  함께 읽으면 좋은 글
                </h2>
                <ul className="mt-3 list-none space-y-5 p-0">
                  {relatedEssays.map((item) => (
                    <li key={item.slug}>
                      <Link
                        className="block border-t border-line pt-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                        href={`/essays/${item.slug}`}
                      >
                        <p className="font-serif text-[1.125rem] leading-snug text-ink underline-offset-4 hover:text-accent hover:underline">
                          {item.title}
                        </p>
                        <p className="text-keep mt-2 text-base leading-8 text-ink-muted">
                          {item.description}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-ink-muted">
                          {formatEssayDate(item.date)} · {item.category}
                          <span aria-hidden="true" className="mx-2 text-line">
                            ·
                          </span>
                          연재: {item.series}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </footer>
        </article>
      </div>
    </>
  );
}
