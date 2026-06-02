import type { Metadata } from "next";
import { createEssay } from "@/app/(admin)/admin/essays/actions";
import { EssayForm } from "@/components/admin/essay-form";
import { emptyEssayFormValues } from "@/lib/admin/parse-essay-form";
import { listAdminSeries } from "@/lib/admin/essays";

export const metadata: Metadata = {
  title: "새 글",
};

export default async function AdminNewEssayPage() {
  const series = await listAdminSeries();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm tracking-[0.18em] text-accent uppercase">새 글</p>
      <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
        새 글 작성
      </h1>
      <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
        제목과 본문을 작성한 뒤, 아래의 공개 상태를 선택하고 저장하세요.
      </p>
      <EssayForm
        action={createEssay}
        currentStatus="draft"
        initialValues={emptyEssayFormValues()}
        mode="create"
        series={series}
        slugLocked={false}
      />
    </div>
  );
}
