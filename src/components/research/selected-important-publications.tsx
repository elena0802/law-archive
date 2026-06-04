import { PublicationList } from "@/src/components/research/publication-list";
import type { ResearchItem } from "@/src/types/research";

const PREVIEW_LIMIT = 12;
const COMPLETE_SECTION_ID = "complete-publications-heading";

type SelectedImportantPublicationsProps = {
  items: readonly ResearchItem[];
};

export function SelectedImportantPublications({
  items,
}: SelectedImportantPublicationsProps) {
  const preview = items.slice(0, PREVIEW_LIMIT);
  const hasMore = items.length > preview.length;

  if (preview.length === 0) {
    return null;
  }

  return (
    <div>
      <PublicationList
        items={preview}
        heading="주요 논문"
        headingId="selected-publications-heading"
        description="대표 연구와 최근 주요 논문을 중심으로 살펴볼 수 있습니다."
        badgeMode="all"
      />
      {hasMore ? (
        <p className="mt-6">
          <a
            className="text-sm text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            href={`#${COMPLETE_SECTION_ID}`}
          >
            전체 주요 논문 보기
          </a>
        </p>
      ) : null}
    </div>
  );
}
