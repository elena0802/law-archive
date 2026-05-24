import type { Metadata } from "next";
import { Section } from "@/components/section";

export const metadata: Metadata = {
  title: "About",
  description: "디지털 서재의 목적과 글을 추가하는 방법을 안내합니다.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About",
    description: "디지털 서재의 목적과 글을 추가하는 방법을 안내합니다.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <Section size="reading" className="py-page">
      <p className="mb-6 text-sm uppercase tracking-[0.18em] text-accent">
        About
      </p>
      <div className="archive-prose">
        <h1>서재에 대하여</h1>
        <p>
          이곳은 원로 형사법학자의 글과 강의, 메모를 차분히 정리하기 위한
          디지털 서재입니다. 원고가 한 편씩 쌓일수록 에세이와 연재가
          자연스럽게 아카이브로 정리됩니다.
        </p>
        <p>
          운영 방식은 단순합니다. 복잡한 관리자 화면을 따로 배우지 않고,
          글 파일 하나를 복사해 제목과 날짜를 바꾼 뒤 본문을 쓰면 됩니다.
        </p>
        <h2>글을 추가하는 방법</h2>
        <ol>
          <li>
            <code>content/essays</code> 폴더에서 기존 글이나
            <code>_template.mdx</code> 파일을 복사합니다.
          </li>
          <li>
            파일 맨 위의 제목, 날짜, 분류, 시리즈 이름을 새 글에 맞게
            바꿉니다.
          </li>
          <li>그 아래에는 평소 원고를 쓰듯이 문단을 나누어 작성합니다.</li>
          <li>
            공개할 준비가 되면 <code>draft: true</code>를
            <code>draft: false</code>로 바꿉니다.
          </li>
        </ol>
        <p>
          <strong>작은 안내:</strong> <code>draft: true</code>인 글은 사이트
          목록에 보이지 않습니다. 발행 전 원고는 이 상태로 두면 안전합니다.
        </p>
      </div>
    </Section>
  );
}
