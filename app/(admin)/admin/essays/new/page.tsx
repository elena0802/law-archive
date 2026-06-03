import type { Metadata } from "next";
import Link from "next/link";
import { createEssay } from "@/app/(admin)/admin/essays/actions";
import { EssayForm } from "@/components/admin/essay-form";
import { emptyEssayFormValues } from "@/lib/admin/parse-essay-form";
import { listAdminSeries } from "@/lib/admin/essays";

export const metadata: Metadata = {
  title: "새 글",
};

export default async function AdminNewEssayPage() {
  const series = await listAdminSeries({ activeOnly: true });

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm tracking-[0.18em] text-accent uppercase">새 글</p>
      <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
        새 글 작성
      </h1>
      <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
        제목과 본문을 작성한 뒤, 아래의 공개 상태를 선택하고 저장하세요. 처음에는
        보통 「임시 저장」으로 두고, 준비가 되면 「공개」로 바꿔 저장하면 공개
        서재에 표시됩니다.
      </p>
      {series.length === 0 ? (
        <div className="text-keep mt-8 rounded border border-line bg-paper-muted px-4 py-6 text-base leading-8 text-ink-muted">
          <p>먼저 연재를 만들어 주세요.</p>
          <Link
            className="mt-3 inline-block text-sm text-accent underline-offset-4 hover:underline"
            href="/admin/series/new"
          >
            새 연재 작성
          </Link>
        </div>
      ) : null}
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
