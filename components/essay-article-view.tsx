import Image from "next/image";
import Link from "next/link";
import { getEssayCmsCoverImage } from "@/lib/essay-cover-image.server";
import { EssayCommentsSection } from "@/components/essay-comments-section";
import { EssayMdxContent } from "@/components/essay-mdx-content";
import { EssayPreviewBanner } from "@/components/essay-preview-banner";
import { EssayShareButton } from "@/components/essay-share-button";
import {
  EssayBreadcrumb,
  EssayMetaRow,
} from "@/components/essay-meta";
import { SeriesSiblings } from "@/components/series-siblings";
import type { Essay } from "@/lib/essays";
import { isPublishedEssayStatus } from "@/lib/content/essay-status";
import {
  estimateReadingMinutes,
  getSeriesContextForEssay,
  getSeriesPartLabel,
  getSeriesSlug,
} from "@/lib/essays";
import { isCommentsAvailable } from "@/lib/comments";
import { getSiteOrigin } from "@/lib/site";

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
  const { series, essaysInSeries } = await getSeriesContextForEssay(essay, {
    includeDrafts: isPreview,
  });
  const readingMinutes = estimateReadingMinutes(essay.content);
  const partLabel = getSeriesPartLabel(essaysInSeries, essay.slug);
  const isPublic =
    essay.status !== undefined
      ? isPublishedEssayStatus(essay.status)
      : !essay.draft;
  const showComments = !isPreview && isCommentsAvailable();
  const showSeriesSiblings = essaysInSeries.length > 1;
  const cover = getEssayCmsCoverImage(essay);

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
          {cover.src ? (
            <div className="relative mb-10 aspect-[5/3] overflow-hidden bg-paper-muted">
              <Image
                alt={cover.alt}
                className="h-full w-full object-cover"
                fill
                priority
                sizes="(min-width: 768px) 720px, 100vw"
                src={cover.src}
              />
            </div>
          ) : null}

          <header className="border-b border-line pb-10">
            <p className="text-keep text-xl font-serif leading-snug text-ink-muted sm:text-2xl">
              {essay.series}
            </p>
            {series ? (
              <p className="sr-only">연재 페이지: {series.title}</p>
            ) : null}
            <h1 className="text-keep mt-5 font-serif text-3xl leading-[1.22] text-ink sm:text-[2.45rem] sm:leading-[1.2]">
              {essay.title}
            </h1>
            {essay.description.trim() ? (
              <p className="text-keep mt-6 text-lg leading-9 text-ink-muted">
                {essay.description}
              </p>
            ) : null}
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
            <EssayMdxContent content={essay.content} />
          </div>

          <p className="text-keep mt-6 text-xs font-normal text-ink-muted">
            이 글은 저자의 생각과 연구를 바탕으로 작성되었으며, AI는 편집 및
            정리 과정에 활용되었습니다.
          </p>

          {!isPreview ? (
            <div className="mt-8 flex justify-start md:justify-end">
              <div className="flex flex-col items-start gap-4 md:items-end">
                <p className="text-keep text-sm leading-7 text-ink-muted">
                  이 글이 도움이 되셨다면
                </p>
                <EssayShareButton
                  title={essay.title}
                  url={`${getSiteOrigin()}/essays/${essay.slug}`}
                />
              </div>
            </div>
          ) : null}

          {showComments || showSeriesSiblings ? (
            <div className="mt-12 space-y-10 border-t border-line pt-10">
              {showComments ? (
                <EssayCommentsSection essaySlug={essay.slug} />
              ) : null}
              {showSeriesSiblings ? (
                <SeriesSiblings
                  currentSlug={essay.slug}
                  essays={essaysInSeries}
                  previewMode={isPreview}
                />
              ) : null}
            </div>
          ) : null}
        </article>
      </div>
    </>
  );
}
