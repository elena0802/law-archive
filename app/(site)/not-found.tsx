import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/section";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  description: "요청하신 페이지를 찾을 수 없습니다.",
};

export default function NotFound() {
  return (
    <Section size="reading" className="py-page">
      <p className="mb-6 text-sm uppercase tracking-[0.18em] text-accent">
        페이지를 찾을 수 없습니다
      </p>
      <div className="archive-prose">
        <h1>페이지를 찾을 수 없습니다</h1>
        <p>
          요청하신 페이지를 찾을 수 없습니다.
          <br />
          아래 링크를 통해 서재로 돌아가실 수 있습니다.
        </p>
        <ul className="mt-6 list-none space-y-2 p-0">
          <li>
            <Link href="/essays">글 보기</Link>
          </li>
          <li>
            <Link href="/series">연재 보기</Link>
          </li>
          <li>
            <Link href="/">서재로 돌아가기</Link>
          </li>
        </ul>
      </div>
    </Section>
  );
}
