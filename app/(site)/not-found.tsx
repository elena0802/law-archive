import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/section";

export const metadata: Metadata = {
  title: "찾을 수 없는 기록",
  description: "요청하신 글이나 페이지를 찾을 수 없습니다.",
};

export default function NotFound() {
  return (
    <Section size="reading" className="py-page">
      <p className="mb-6 text-sm uppercase tracking-[0.18em] text-accent">
        Not Found
      </p>
      <div className="archive-prose">
        <h1>이 기록은 아직 서가에 없습니다.</h1>
        <p>
          주소가 바뀌었거나 아직 공개되지 않은 글일 수 있습니다. 첫 화면으로
          돌아가면 현재 공개된 에세이와 시리즈를 다시 살펴볼 수 있습니다.
        </p>
        <p>
          <Link href="/">Home으로 돌아가기</Link>
        </p>
      </div>
    </Section>
  );
}
