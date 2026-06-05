import { AiCurrentResearchCard } from "@/components/home/ai-current-research-card";
import type { AiResearchTrack } from "@/lib/home-ai-research-tracks";

type HomeAiNotesProps = {
  tracks: readonly AiResearchTrack[];
};

export function HomeAiNotes({ tracks }: HomeAiNotesProps) {
  return (
    <section
      aria-labelledby="home-ai-notes-heading"
      className="relative"
    >
      <div className="mx-auto w-full max-w-reading">
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(180deg,transparent_0,transparent_1.65rem,var(--line)_1.65rem,var(--line)_calc(1.65rem+1px),transparent_calc(1.65rem+1px))] opacity-[0.22]"
          />

          <div className="relative border-l-2 border-accent/35 px-6 sm:px-8">
            <p className="text-xs tracking-[0.14em] text-accent uppercase">
              디지털 연구 노트
            </p>
            <h2
              id="home-ai-notes-heading"
              className="text-keep mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl"
            >
              AI와 함께 쓰는 연구 노트
            </h2>

            <div className="text-keep mt-8 space-y-6 text-base leading-[1.9] text-ink-muted">
              <p>강의를 마친 뒤에도, 판례와 제도에 대한 질문은 계속됩니다.</p>
              <p>
                이제는 AI를 활용하여
                <br />
                판례를 읽고,
                <br />
                생각을 정리하고,
                <br />
                새로운 질문을 탐구하고 있습니다.
              </p>
              <p>
                이 공간은 과거 연구를 보관하는 아카이브이면서,
                <br />
                AI와 함께 질문을 이어가는 연구 노트입니다.
              </p>
            </div>

            <ul className="mt-10 grid list-none gap-6 p-0 sm:grid-cols-2 sm:gap-8">
              {tracks.map((track) => (
                <li key={track.title} className="min-w-0">
                  <AiCurrentResearchCard track={track} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
