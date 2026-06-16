import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  deleteNewsItem,
  updateNewsItem,
} from "@/app/(admin)/admin/news/actions";
import { NewsForm } from "@/components/admin/news-form";
import { getAdminNewsNoticeMessage } from "@/lib/admin/admin-notices";
import { getAdminNewsItemById, newsRowToFormValues } from "@/lib/admin/news";

type AdminEditNewsPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
};

export async function generateMetadata({
  params,
}: AdminEditNewsPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getAdminNewsItemById(id);
  return {
    title: item ? `소식 편집: ${item.title}` : "소식 편집",
  };
}

export default async function AdminEditNewsPage({
  params,
  searchParams,
}: AdminEditNewsPageProps) {
  const { id } = await params;
  const { notice } = await searchParams;
  const item = await getAdminNewsItemById(id);

  if (!item) {
    notFound();
  }

  const updateWithId = updateNewsItem.bind(null, id);
  const deleteWithId = deleteNewsItem.bind(null, id);
  const noticeMessage = getAdminNewsNoticeMessage(notice);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm tracking-[0.18em] text-accent uppercase">소식</p>
      <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
        소식 편집
      </h1>
      <p className="text-keep mt-5 text-base leading-8 text-ink-muted">
        {item.title}
      </p>
      <NewsForm
        action={updateWithId}
        deleteAction={deleteWithId}
        initialValues={newsRowToFormValues(item)}
        itemId={item.id}
        key={`${item.id}-${item.updated_at}`}
        mode="edit"
        noticeMessage={noticeMessage}
      />
    </div>
  );
}
