import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EssayArticleView } from "@/components/essay-article-view";
import { Section } from "@/components/section";
import {
  getAdminEssayEditIdBySlug,
  getAdminPreviewEssayBySlug,
} from "@/lib/admin/preview-essay";
import { ensureEditorAccess } from "@/lib/auth/ensure-editor-access";

type PreviewPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "미리보기",
    robots: { index: false, follow: false },
  };
}

export default async function PreviewEssayPage({ params }: PreviewPageProps) {
  const { slug } = await params;
  await ensureEditorAccess(`/preview/${slug}`);

  const essay = await getAdminPreviewEssayBySlug(slug);

  if (!essay) {
    notFound();
  }

  const editId = await getAdminEssayEditIdBySlug(slug);
  const editHref = editId ? `/admin/essays/${editId}` : undefined;

  return (
    <Section size="reading" className="px-6">
      <EssayArticleView
        editHref={editHref}
        essay={essay}
        mode="preview"
      />
    </Section>
  );
}
