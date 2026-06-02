import type { Metadata } from "next";
import Link from "next/link";
import { createEssay } from "@/app/(admin)/admin/essays/actions";
import { EssayForm } from "@/components/admin/essay-form";
import { listAdminSeries } from "@/lib/admin/essays";
import { emptyEssayFormValues } from "@/lib/admin/parse-essay-form";

export const metadata: Metadata = {
  title: "새 글",
};

export default async function AdminNewEssayPage() {
  const series = await listAdminSeries();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-sm tracking-[0.18em] text-accent uppercase">새 글</p>
      <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
        새 글 작성
      </h1>
      <p className="text-keep mt-5 text-base leading-8 text-ink-muted">
        제목과 소개, 연재를 정한 뒤 본문을 작성합니다. 처음에는 임시 저장으로
        두었다가 준비되면 공개로 바꿀 수 있습니다.
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
        action={createEssay}
        initialValues={emptyEssayFormValues()}
        mode="create"
        series={series}
        slugLocked={false}
      />
    </div>
  );
}
