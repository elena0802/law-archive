import Link from "next/link";

export function ResearchAboutLink() {
  return (
    <aside
      aria-label="연구자 소개 안내"
      className="border-y border-line/70 py-8"
    >
      <p className="text-keep text-base leading-[1.85] text-ink-muted">
        천진호 교수의 학력, 경력, 학술 활동은
        <br />
        서재 소개에서 확인할 수 있습니다.
      </p>
      <p className="mt-3">
        <Link
          className="cursor-pointer font-medium text-ink underline-offset-4 transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href="/about"
        >
          연구자 소개 보기 →
        </Link>
      </p>
    </aside>
  );
}
