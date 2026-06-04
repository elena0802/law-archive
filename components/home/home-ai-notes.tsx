import { HomeSectionHeader } from "@/components/home/home-section-header";

export function HomeAiNotes() {
  return (
    <section aria-labelledby="home-ai-notes-heading">
      <HomeSectionHeader
        headingId="home-ai-notes-heading"
        title="AI와 함께 쓰는 연구 노트"
      />
      <div className="text-keep mt-10 max-w-2xl space-y-5 text-base leading-[1.9] text-ink-muted">
        <p>
          이 아카이브는 AI를 활용하여 글을 작성하고, 연구를 정리하며, 생각을
          기록하는 실험이기도 합니다.
        </p>
        <p>
          35년간 형사법을 연구한 경험과 새로운 기술이 만나 지식을 기록하는 새로운
          방식을 만들어가고 있습니다.
        </p>
      </div>
    </section>
  );
}
