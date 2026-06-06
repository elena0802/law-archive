import type { Metadata } from "next";
import Link from "next/link";
import { createEssay } from "@/app/(admin)/admin/essays/actions";
import { EssayForm } from "@/components/admin/essay-form";
import { emptyEssayFormValues } from "@/lib/admin/parse-essay-form";
import { getSeriesOrderHints, listAdminSeries } from "@/lib/admin/essays";

export const metadata: Metadata = {
  title: "새 글",
};

export default async function AdminNewEssayPage() {
  const [series, seriesOrderHints] = await Promise.all([
    listAdminSeries({ activeOnly: true }),
    getSeriesOrderHints(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm tracking-[0.18em] text-accent uppercase">새 글</p>
      <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
        새 글 작성
      </h1>
      <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
        제목만 입력해도 「임시 저장」이 가능합니다. 본문을 이어 쓴 뒤, 준비가
        되면 「공개하기」로 공개 서재에 올릴 수 있습니다.
      </p>
      {series.length === 0 ? (
        <div className="text-keep mt-8 rounded border border-line bg-paper-muted px-4 py-6 text-base leading-8 text-ink-muted">
          <p>
            연재가 없어도 임시 저장은 가능합니다. 공개하려면 먼저 연재를
            만들어 주세요.
          </p>
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
        seriesOrderHints={seriesOrderHints}
        slugLocked={false}
      />
    </div>
  );
}
