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
            <EssayMetaRow
              category={essay.category}
              date={essay.date}
              partLabel={partLabel}
              readingMinutes={readingMinutes}
              seriesTitle={essay.series}
            />
            <h1 className="text-keep mt-5 font-serif text-4xl leading-[1.18] text-ink sm:text-5xl">
              {essay.title}
            </h1>
            <p className="text-keep mt-6 text-lg leading-9 text-ink-muted">
              {essay.description}
            </p>
          </header>

          <div className="archive-prose mt-12">
            <MDXRemote source={essay.content} />
          </div>

          <footer className="mt-14 space-y-10 border-t border-line pt-10">
            <CitationBlock citation={citation} />
            {essaysInSeries.length > 0 ? (
              <SeriesSiblings
                currentSlug={essay.slug}
                essays={essaysInSeries}
                previewMode={isPreview}
              />
            ) : null}
          </footer>
        </article>
      </div>
    </>
  );
}
