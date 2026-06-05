import Link from "next/link";
import { researchPagePath } from "@/lib/research-record";

export function AboutResearchLink() {
  return (
    <aside aria-label="연구업적 안내">
      <p className="text-keep text-base leading-[1.85] text-ink-muted">
        대표 저서 외에도 논문, 연구 연표, 전체 연구업적을
        <br />
        연구업적 페이지에서 확인할 수 있습니다.
      </p>
      <p className="mt-3">
        <Link
          className="cursor-pointer font-medium text-ink underline-offset-4 transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href={researchPagePath}
        >
          연구업적 보기 →
        </Link>
      </p>
    </aside>
  );
}
