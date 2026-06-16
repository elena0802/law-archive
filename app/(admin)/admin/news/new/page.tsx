import type { Metadata } from "next";
import { createNewsItem } from "@/app/(admin)/admin/news/actions";
import { NewsForm } from "@/components/admin/news-form";
import { emptyNewsFormValues } from "@/lib/admin/parse-news-form";

export const metadata: Metadata = {
  title: "새 소식",
};

export default function AdminNewNewsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm tracking-[0.18em] text-accent uppercase">소식</p>
      <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
        새 소식 추가
      </h1>
      <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
        연구실 활동 소식을 등록합니다. Featured는 한 항목만 유지됩니다.
      </p>
      <NewsForm
        action={createNewsItem}
        initialValues={emptyNewsFormValues()}
        mode="create"
      />
    </div>
  );
}
