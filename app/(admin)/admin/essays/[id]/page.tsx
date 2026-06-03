import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateEssay } from "@/app/(admin)/admin/essays/actions";
import { AdminNoticeBanner } from "@/components/admin/admin-notice-banner";
import { EssayForm } from "@/components/admin/essay-form";
import { essayStatusLabel } from "@/components/admin/essay-status-badge";
import { getAdminEssayNoticeMessage } from "@/lib/admin/admin-notices";
import {
  essayRowToFormValues,
  getAdminEssayById,
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

const LOG_PREFIX = "[admin/essays/edit]";

const SERIES_LIST_UNAVAILABLE_MESSAGE =
  "연재 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";

async function loadSeriesForEdit(seriesSlug: string): Promise<{
  series: SeriesRow[];
  seriesLoadWarning?: string;
}> {
  const attempts: Array<{
    label: string;
    options: Parameters<typeof listAdminSeries>[0];
  }> = [
    {
      label: "activeOnly+includeSlug",
      options: { activeOnly: true, includeSlug: seriesSlug },
    },
    { label: "includeSlug", options: { includeSlug: seriesSlug } },
    { label: "all", options: {} },
  ];

  for (const { label, options } of attempts) {
    console.error(`${LOG_PREFIX} listAdminSeries: before`, {
      seriesSlug,
      attempt: label,
      options,
    });

    try {
      const series = await listAdminSeries(options);
      console.error(`${LOG_PREFIX} listAdminSeries: after`, {
        seriesSlug,
        attempt: label,
        count: series.length,
      });
      return { series };
    } catch (error) {
      console.error(`${LOG_PREFIX} listAdminSeries: failed`, {
        seriesSlug,
        attempt: label,
        options,
        error,
      });
    }
  }

  console.error(`${LOG_PREFIX} listAdminSeries: all attempts exhausted`, {
    seriesSlug,
  });
  return { series: [], seriesLoadWarning: SERIES_LIST_UNAVAILABLE_MESSAGE };
}

export default async function AdminEditEssayPage({
  params,
  searchParams,
}: AdminEditEssayPageProps) {
  const { id } = await params;
  const { notice } = await searchParams;

  console.error(`${LOG_PREFIX} params`, { id, notice: notice ?? null });

  let essay;
  console.error(`${LOG_PREFIX} getAdminEssayById: before`, { id });
  try {
    essay = await getAdminEssayById(id);
    console.error(`${LOG_PREFIX} getAdminEssayById: after`, {
      id,
      found: Boolean(essay),
      essayId: essay?.id ?? null,
      slug: essay?.slug ?? null,
      series_slug: essay?.series_slug ?? null,
      status: essay?.status ?? null,
    });
  } catch (error) {
    console.error(`${LOG_PREFIX} getAdminEssayById: failed`, { id, error });
    throw error;
  }

  if (!essay) {
    console.error(`${LOG_PREFIX} essay not found`, { id });
    notFound();
  }

  console.error(`${LOG_PREFIX} loadSeriesForEdit: before`, {
    id,
    series_slug: essay.series_slug,
  });
  const { series, seriesLoadWarning } = await loadSeriesForEdit(
    essay.series_slug,
  );
  console.error(`${LOG_PREFIX} loadSeriesForEdit: after`, {
    id,
    series_slug: essay.series_slug,
    seriesCount: series.length,
    seriesLoadWarning: seriesLoadWarning ?? null,
  });

  const updateWithId = updateEssay.bind(null, id);
  const noticeMessage = getAdminEssayNoticeMessage(notice);

  console.error(`${LOG_PREFIX} render EssayForm: before`, {
    id,
    seriesCount: series.length,
    hasSeriesLoadWarning: Boolean(seriesLoadWarning),
  });

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
        <span className="text-sm text-ink-muted">
          현재 상태: {essayStatusLabel(essay.status)}
        </span>
        <Link
          className="text-sm text-accent underline-offset-4 hover:underline"
          href={`/preview/${essay.slug}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          미리보기
        </Link>
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
        action={updateWithId}
        currentStatus={essay.status}
        initialValues={essayRowToFormValues(essay)}
        mode="edit"
        noticeMessage={noticeMessage}
        series={series}
        slugLocked={essay.status === "published"}
      />
    </div>
  );
}
