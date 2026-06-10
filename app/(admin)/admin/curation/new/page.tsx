import type { Metadata } from "next";
import { createCurationItem } from "@/app/(admin)/admin/curation/actions";
import { CurationForm } from "@/components/admin/curation-form";
import { adminCurationFormLead } from "@/lib/admin/curation-copy";
import { emptyCurationFormValues } from "@/lib/admin/parse-curation-form";

export const metadata: Metadata = {
  title: "새 큐레이션",
};

export default async function AdminNewCurationPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm tracking-[0.18em] text-accent uppercase">큐레이션</p>
      <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
        새 항목 추가
      </h1>
      <p className="text-keep mt-5 max-w-2xl text-base leading-8 text-ink-muted">
        {adminCurationFormLead}
      </p>
      <CurationForm
        action={createCurationItem}
        initialValues={emptyCurationFormValues()}
        mode="create"
      />
    </div>
  );
}
