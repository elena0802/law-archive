import type { Metadata } from "next";
import { createSeries } from "@/app/(admin)/admin/series/actions";
import { SeriesForm } from "@/components/admin/series-form";
import { emptySeriesFormValues } from "@/lib/admin/parse-series-form";
import { getNextSeriesDisplayOrder } from "@/lib/admin/series";

export const metadata: Metadata = {
  title: "새 연재",
};

export default async function AdminNewSeriesPage() {
  const nextDisplayOrder = await getNextSeriesDisplayOrder();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm tracking-[0.18em] text-accent uppercase">연재</p>
      <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
        새 연재 작성
      </h1>
      <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
        연재 제목과 소개를 입력하고 공개 여부를 선택해 저장하세요.
      </p>
      <SeriesForm
        action={createSeries}
        initialValues={{
          ...emptySeriesFormValues(),
          display_order: nextDisplayOrder,
        }}
        mode="create"
      />
    </div>
  );
}

