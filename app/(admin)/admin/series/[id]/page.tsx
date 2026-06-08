import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateSeries } from "@/app/(admin)/admin/series/actions";
import { SeriesForm } from "@/components/admin/series-form";
import { getAdminSeriesNoticeMessage } from "@/lib/admin/admin-notices";
import { getAdminSeriesById } from "@/lib/admin/series";

type AdminEditSeriesPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
};

export async function generateMetadata({
  params,
}: AdminEditSeriesPageProps): Promise<Metadata> {
  const { id } = await params;
  const series = await getAdminSeriesById(id);
  return { title: series ? `연재 편집: ${series.title}` : "연재 편집" };
}

export default async function AdminEditSeriesPage({
  params,
  searchParams,
}: AdminEditSeriesPageProps) {
  const { id } = await params;
  const { notice } = await searchParams;
  const series = await getAdminSeriesById(id);

  if (!series) {
    notFound();
  }

  const updateWithId = updateSeries.bind(null, id);
  const noticeMessage = getAdminSeriesNoticeMessage(notice);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm tracking-[0.18em] text-accent uppercase">연재</p>
      <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
        연재 편집
      </h1>
      <p className="text-keep mt-5 text-base leading-8 text-ink-muted">{series.title}</p>
      <SeriesForm
        action={updateWithId}
        initialValues={{
          title: series.title,
          slug: series.slug,
          description: series.description,
          introduction: series.introduction,
          display_order: series.display_order,
          status: series.status,
          featured: series.featured,
        }}
        mode="edit"
        noticeMessage={noticeMessage}
        slugLocked
      />
    </div>
  );
}

