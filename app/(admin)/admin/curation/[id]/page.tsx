import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  deleteCurationItem,
  updateCurationItem,
} from "@/app/(admin)/admin/curation/actions";
import { CurationForm } from "@/components/admin/curation-form";
import { getAdminCurationNoticeMessage } from "@/lib/admin/admin-notices";
import {
  curationRowToFormValues,
  getAdminCurationItemById,
} from "@/lib/admin/curation";

type AdminEditCurationPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
};

export async function generateMetadata({
  params,
}: AdminEditCurationPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getAdminCurationItemById(id);
  return {
    title: item ? `큐레이션 편집: ${item.title}` : "큐레이션 편집",
  };
}

export default async function AdminEditCurationPage({
  params,
  searchParams,
}: AdminEditCurationPageProps) {
  const { id } = await params;
  const { notice } = await searchParams;
  const item = await getAdminCurationItemById(id);

  if (!item) {
    notFound();
  }

  const updateWithId = updateCurationItem.bind(null, id);
  const deleteWithId = deleteCurationItem.bind(null, id);
  const noticeMessage = getAdminCurationNoticeMessage(notice);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm tracking-[0.18em] text-accent uppercase">큐레이션</p>
      <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
        큐레이션 편집
      </h1>
      <p className="text-keep mt-5 text-base leading-8 text-ink-muted">
        {item.title}
      </p>
      <CurationForm
        action={updateWithId}
        deleteAction={deleteWithId}
        initialValues={curationRowToFormValues(item)}
        itemId={item.id}
        key={`${item.id}-${item.updated_at}`}
        mode="edit"
        noticeMessage={noticeMessage}
      />
    </div>
  );
}
