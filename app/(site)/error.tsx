"use client";

import { ArchiveErrorPanel } from "@/components/archive-error-panel";

type SiteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SiteError({ error, reset }: SiteErrorProps) {
  return (
    <ArchiveErrorPanel
      variant="public"
      eyebrow="오류"
      title="페이지를 불러오지 못했습니다."
      supporting="잠시 후 다시 시도해 주세요."
      homeHref="/"
      homeLabel="서재로 돌아가기"
      error={error}
      reset={reset}
    />
  );
}
