import { Section } from "@/components/section";

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
          디지털 서재입니다. 현재 단계에서는 소개 문안과 읽기 폭, 문단 간격,
          행간을 확인하기 위한 기본 화면만 마련했습니다.
        </p>
        <p>
          다음 단계에서 실제 원고 파일이 연결되면 에세이, 연재, 소개 글이
          같은 타이포그래피 체계 안에서 자연스럽게 읽히도록 확장할 수
          있습니다.
        </p>
        <h2>글을 추가하는 방법</h2>
        <ol>
          <li>
            <code>content/essays</code> 폴더에 새 <code>.mdx</code> 파일을
            만듭니다.
          </li>
          <li>파일 맨 위에 제목, 날짜, 분류, 연재명을 적습니다.</li>
          <li>그 아래에는 평소 글을 쓰듯이 본문을 작성합니다.</li>
          <li>
            아직 공개하지 않을 글은 <code>draft: true</code>로 두고, 공개할
            때 <code>draft: false</code>로 바꿉니다.
          </li>
        </ol>
      </div>
    </Section>
  );
}
