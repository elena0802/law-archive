import type { Metadata } from "next";
import { createCurationItem } from "@/app/(admin)/admin/curation/actions";
import { CurationForm } from "@/components/admin/curation-form";
import { emptyCurationFormValues } from "@/lib/admin/parse-curation-form";
import { getNextCurationSortOrder } from "@/lib/admin/curation";

export const metadata: Metadata = {
  title: "새 큐레이션",
};

export default async function AdminNewCurationPage() {
  const nextSortOrder = await getNextCurationSortOrder();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm tracking-[0.18em] text-accent uppercase">큐레이션</p>
      <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
        새 항목 추가
      </h1>
      <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
        추천할 콘텐츠의 제목, 설명, 링크, 출처를 입력하고 저장하세요.
      </p>
      <CurationForm
        action={createCurationItem}
        initialValues={{
          ...emptyCurationFormValues(),
          sort_order: nextSortOrder,
        }}
        mode="create"
      />
    </div>
  );
}
