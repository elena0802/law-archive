import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateEssay } from "@/app/(admin)/admin/essays/actions";
import { EssayForm } from "@/components/admin/essay-form";
import { essayStatusLabel } from "@/components/admin/essay-status-badge";
import {
  essayRowToFormValues,
  getAdminEssayById,
  listAdminSeries,
} from "@/lib/admin/essays";

type AdminEditEssayPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
};

export async function generateMetadata({
  params,
}: AdminEditEssayPageProps): Promise<Metadata> {
  const { id } = await params;
  const essay = await getAdminEssayById(id);

  return {
    title: essay ? `편집: ${essay.title}` : "글 편집",
  };
}

export default async function AdminEditEssayPage({
  params,
  searchParams,
}: AdminEditEssayPageProps) {
  const { id } = await params;
  const { notice } = await searchParams;
  const [essay, series] = await Promise.all([
    getAdminEssayById(id),
    listAdminSeries(),
  ]);

  if (!essay) {
    notFound();
  }

  const updateWithId = updateEssay.bind(null, id);
  const noticeMessage =
    notice === "saved" || notice === "published"
      ? `${notice === "published" ? "공개되었습니다." : "저장되었습니다."} 현재 상태: ${essayStatusLabel(essay.status)}`
      : undefined;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm tracking-[0.18em] text-accent uppercase">편집</p>
      <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
        글 편집
      </h1>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <p className="text-keep text-base leading-8 text-ink-muted">
          {essay.title}
        </p>
        <Link
          className="text-sm text-accent underline-offset-4 hover:underline"
          href={`/preview/${essay.slug}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          미리보기
        </Link>
      </div>
      <EssayForm
        action={updateWithId}
        currentStatus={essay.status}
        initialValues={essayRowToFormValues(essay)}
        mode="edit"
        noticeMessage={noticeMessage}
        previewSlug={essay.slug}
        series={series}
        slugLocked={essay.status === "published"}
      />
    </div>
  );
}
