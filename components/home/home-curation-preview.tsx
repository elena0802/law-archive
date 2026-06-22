import { HomeCurationFeaturedCard } from "@/components/home/home-curation-featured-card";
import { HomeCurationRecentList } from "@/components/home/home-curation-recent-list";
import { HomeSectionHeader } from "@/components/home/home-section-header";
import { HomeSectionLink } from "@/components/home/home-section-link";
import type { HomeCurationPreviewData } from "@/lib/curation/home-preview";
import { curationPagePath, curationSectionDescription } from "@/lib/curation/types";

type HomeCurationPreviewProps = HomeCurationPreviewData;

export function HomeCurationPreview({
  featuredSlots,
  recent,
}: HomeCurationPreviewProps) {
  const featuredItems = featuredSlots.filter(
    (item): item is NonNullable<typeof item> => item !== null,
  );
  const hasContent = featuredItems.length > 0 || recent.length > 0;

  return (
    <section aria-labelledby="home-curation-heading">
      <HomeSectionHeader
        description={curationSectionDescription}
        headingId="home-curation-heading"
        title="요즘의 시선"
      />

      {hasContent ? (
        <div className="mt-12">
          {featuredItems.length > 0 ? (
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
              {featuredItems.map((item) => (
                <HomeCurationFeaturedCard item={item} key={item.id} />
              ))}
            </div>
          ) : null}

          {recent.length > 0 ? (
            <div className={featuredItems.length > 0 ? "mt-12" : ""}>
              <h3 className="text-keep font-serif text-xl text-ink sm:text-[1.35rem]">
                함께 읽고 본 자료
              </h3>
              <HomeCurationRecentList items={recent} />
            </div>
          ) : null}
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
