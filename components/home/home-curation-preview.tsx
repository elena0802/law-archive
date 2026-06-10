import { CurationLinkCard } from "@/components/curation/curation-link-card";
import { CurationYoutubeFeature } from "@/components/curation/curation-youtube-feature";
import { HomeSectionHeader } from "@/components/home/home-section-header";
import { HomeSectionLink } from "@/components/home/home-section-link";
import type { CurationItem } from "@/lib/curation/types";
import { curationPagePath } from "@/lib/curation/types";

type HomeCurationPreviewProps = {
  featuredYoutube: CurationItem | null;
  links: readonly CurationItem[];
};

export function HomeCurationPreview({
  featuredYoutube,
  links,
}: HomeCurationPreviewProps) {
  const hasContent = featuredYoutube || links.length > 0;

  return (
    <section aria-labelledby="home-curation-heading">
      <HomeSectionHeader
        description="교수님이 요즘 주목하는 영상, 기사, 글, 논문, 책을 모았습니다."
        headingId="home-curation-heading"
        title="요즘의 시선"
      />

      {hasContent ? (
        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
          <div className="min-w-0">
            {featuredYoutube ? (
              <CurationYoutubeFeature item={featuredYoutube} layout="home" />
            ) : (
              <div className="flex h-full min-h-[18rem] items-center justify-center border border-line/80 bg-paper-muted/40 px-6 py-10 text-center text-base leading-8 text-ink-muted">
                대표 유튜브 콘텐츠가 아직 없습니다.
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            {links.length > 0 ? (
              links.map((item) => <CurationLinkCard compact item={item} key={item.id} />)
            ) : (
              <div className="flex flex-1 items-center justify-center border border-line/80 bg-paper px-6 py-10 text-center text-base leading-8 text-ink-muted">
                추천 링크가 아직 없습니다.
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
