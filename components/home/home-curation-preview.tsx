import { CurationCompactItem } from "@/components/curation/curation-compact-item";
import { CurationFeaturedItem } from "@/components/curation/curation-featured-item";
import { HomeSectionHeader } from "@/components/home/home-section-header";
import { HomeSectionLink } from "@/components/home/home-section-link";
import type { CurationItem } from "@/lib/curation/types";
import { curationPagePath, curationSectionDescription } from "@/lib/curation/types";

type HomeCurationPreviewProps = {
  featured: CurationItem | null;
  recent: readonly CurationItem[];
};

export function HomeCurationPreview({ featured, recent }: HomeCurationPreviewProps) {
  const hasContent = featured || recent.length > 0;

  return (
    <section aria-labelledby="home-curation-heading">
      <HomeSectionHeader
        description={curationSectionDescription}
        headingId="home-curation-heading"
        title="요즘의 시선"
      />

      {hasContent ? (
        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
          <div className="min-w-0">
            {featured ? (
              <CurationFeaturedItem item={featured} />
            ) : (
              <div className="flex h-full min-h-[18rem] items-center justify-center border border-line/80 bg-paper-muted/40 px-6 py-10 text-center text-base leading-8 text-ink-muted">
                대표 콘텐츠가 아직 없습니다.
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-3 sm:gap-3.5">
            {recent.length > 0 ? (
              recent.map((item) => <CurationCompactItem item={item} key={item.id} />)
            ) : (
              <div className="flex flex-1 items-center justify-center border border-line/80 bg-paper px-6 py-10 text-center text-base leading-8 text-ink-muted">
                최신 추천이 아직 없습니다.
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-12 border border-line/80 px-6 py-10 text-base leading-8 text-ink-muted">
          아직 추천 콘텐츠가 없습니다.
        </p>
      )}

      <HomeSectionLink href={curationPagePath}>요즘의 시선 더 보기 →</HomeSectionLink>
    </section>
  );
}
