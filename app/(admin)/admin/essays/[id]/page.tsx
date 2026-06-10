import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateEssay } from "@/app/(admin)/admin/essays/actions";
import { AdminNoticeBanner } from "@/components/admin/admin-notice-banner";
import { EssayForm } from "@/components/admin/essay-form";
import { getAdminEssayNoticeMessage } from "@/lib/admin/admin-notices";
import {
  essayRowToFormValues,
  getAdminEssayById,
  getSeriesOrderHints,
  listAdminSeries,
} from "@/lib/admin/essays";
import type { SeriesRow } from "@/lib/content/db-types";

export const metadata: Metadata = {
  title: "글 편집",
};

type AdminEditEssayPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
};

const SERIES_LIST_UNAVAILABLE_MESSAGE =
  "연재 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";

async function loadSeriesForEdit(seriesSlug: string): Promise<{
  series: SeriesRow[];
  seriesLoadWarning?: string;
}> {
  const attempts: Array<{
    options: Parameters<typeof listAdminSeries>[0];
  }> = [
    { options: { activeOnly: true, includeSlug: seriesSlug } },
    { options: { includeSlug: seriesSlug } },
    { options: {} },
  ];

  for (const { options } of attempts) {
    try {
      const series = await listAdminSeries(options);
      return { series };
    } catch (error) {
      console.error("[admin/essays/edit] listAdminSeries failed", {
        seriesSlug,
        options,
        error,
      });
    }
  }

  return { series: [], seriesLoadWarning: SERIES_LIST_UNAVAILABLE_MESSAGE };
}

export default async function AdminEditEssayPage({
  params,
  searchParams,
}: AdminEditEssayPageProps) {
  const { id } = await params;
  const { notice } = await searchParams;

  let essay;
  try {
    essay = await getAdminEssayById(id);
  } catch (error) {
    console.error("[admin/essays/edit] getAdminEssayById failed", { id, error });
    throw error;
  }

  if (!essay) {
    notFound();
  }

  let seriesOrderHints: Record<string, number> = {};
  try {
    seriesOrderHints = await getSeriesOrderHints(id);
  } catch (error) {
    console.error("[admin/essays/edit] getSeriesOrderHints failed", { id, error });
  }

  const { series, seriesLoadWarning } = await loadSeriesForEdit(
    essay.series_slug ?? "",
  );

  const updateWithId = updateEssay.bind(null, id);
  const noticeMessage = getAdminEssayNoticeMessage(notice);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm tracking-[0.18em] text-accent uppercase">편집</p>
      <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
        글 편집
      </h1>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-keep text-base leading-8 text-ink-muted">
          {essay.title}
        </p>
        {essay.series_slug ? (
          <Link
            className="text-sm text-accent underline-offset-4 hover:underline"
            href={`/preview/${essay.slug}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            미리보기
          </Link>
        ) : (
          <span className="text-keep text-sm leading-7 text-ink-muted">
            연재를 선택하면 미리보기를 사용할 수 있습니다.
          </span>
        )}
        {essay.status === "published" ? (
          <Link
            className="text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline"
            href={`/essays/${essay.slug}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            공개 서재에서 보기
          </Link>
        ) : null}
      </div>
      {seriesLoadWarning ? (
        <div className="mt-8">
          <AdminNoticeBanner message={seriesLoadWarning} />
        </div>
      ) : null}
      <EssayForm
        key={`${essay.id}-${essay.status}-${essay.updated_at}`}
        action={updateWithId}
        currentStatus={essay.status}
        initialValues={essayRowToFormValues(essay)}
        mode="edit"
        noticeMessage={noticeMessage}
        series={series}
        seriesOrderHints={seriesOrderHints}
        slugLocked={essay.status === "published"}
      />
    </div>
  );
}
