import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateEssay } from "@/app/(admin)/admin/essays/actions";
import { EssayForm } from "@/components/admin/essay-form";
import {
  essayRowToFormValues,
  getAdminEssayById,
  listAdminSeries,
} from "@/lib/admin/essays";

type AdminEditEssayPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
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
  const { saved } = await searchParams;
  const [essay, series] = await Promise.all([
    getAdminEssayById(id),
    listAdminSeries(),
  ]);

  if (!essay) {
    notFound();
  }

  const updateWithId = updateEssay.bind(null, id);
  const savedMessage = saved === "1" ? "저장되었습니다." : undefined;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-sm tracking-[0.18em] text-accent uppercase">편집</p>
      <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
        글 편집
      </h1>
      <p className="text-keep mt-5 text-base leading-8 text-ink-muted">
        {essay.title}
      </p>
      <p className="mt-6">
        <Link
          className="text-sm text-accent underline-offset-4 hover:underline"
          href="/admin/essays"
        >
          ← 글 목록
        </Link>
      </p>
      <EssayForm
        action={updateWithId}
        initialValues={essayRowToFormValues(essay)}
        mode="edit"
        savedMessage={savedMessage}
        series={series}
        slugLocked={essay.status === "published"}
      />
    </div>
  );
}
