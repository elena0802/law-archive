"use client";

import { ArchiveErrorPanel } from "@/components/archive-error-panel";

type AdminErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: AdminErrorProps) {
  return (
    <ArchiveErrorPanel
      variant="admin"
      eyebrow="서재 관리"
      title="관리 화면을 불러오지 못했습니다."
      supporting="잠시 후 다시 시도해 주세요. 문제가 계속되면 사이트 관리자에게 문의해 주세요."
      homeHref="/admin"
      homeLabel="대시보드로 돌아가기"
      error={error}
      reset={reset}
    />
  );
}
